import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import crypto from "crypto";
import type { Platform, PlatformApiKey } from "@shared/schema";

declare global {
  namespace Express {
    interface Request {
      ecosystemPlatform?: Platform;
      ecosystemApiKey?: PlatformApiKey;
      ecosystemScopes?: string[];
    }
  }
}

const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 200;

export async function ecosystemAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      code: "AUTH_MISSING",
      message: "Missing Authorization header. Expected: Bearer [PLATFORM_API_KEY]",
      timestamp: new Date().toISOString(),
    });
  }

  const token = authHeader.slice(7);

  try {
    const keyData = await storage.getPlatformApiKeyByKey(token);

    if (!keyData) {
      return res.status(401).json({
        status: "error",
        code: "AUTH_INVALID",
        message: "Invalid platform API key",
        timestamp: new Date().toISOString(),
      });
    }

    if (!keyData.platform.isActive) {
      return res.status(403).json({
        status: "error",
        code: "PLATFORM_INACTIVE",
        message: "Platform is inactive",
        timestamp: new Date().toISOString(),
      });
    }

    if (keyData.expiresAt && new Date(keyData.expiresAt) < new Date()) {
      return res.status(401).json({
        status: "error",
        code: "KEY_EXPIRED",
        message: "API key has expired",
        timestamp: new Date().toISOString(),
      });
    }

    req.ecosystemPlatform = keyData.platform;
    req.ecosystemApiKey = keyData;
    req.ecosystemScopes = (keyData.scopes as string[]) || ["read"];

    await storage.updatePlatformApiKeyLastUsed(keyData.id);

    next();
  } catch (err) {
    console.error("[ECOSYSTEM] Auth error:", err);
    return res.status(500).json({
      status: "error",
      code: "AUTH_ERROR",
      message: "Authentication error",
      timestamp: new Date().toISOString(),
    });
  }
}

export function requireScope(...requiredScopes: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const scopes = req.ecosystemScopes || [];
    const hasAllScopes = requiredScopes.every(s => scopes.includes(s) || scopes.includes("admin"));

    if (!hasAllScopes) {
      return res.status(403).json({
        status: "error",
        code: "SCOPE_DENIED",
        message: `Insufficient permissions. Required scopes: ${requiredScopes.join(", ")}. Your scopes: ${scopes.join(", ")}`,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
}

export function ecosystemRateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const platformSlug = req.ecosystemPlatform?.slug || "unknown";
  const key = `${ip}:${platformSlug}`;
  const now = Date.now();

  let entry = requestCounts.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
    requestCounts.set(key, entry);
  }

  entry.count++;

  res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX);
  res.setHeader("X-RateLimit-Remaining", Math.max(0, RATE_LIMIT_MAX - entry.count));
  res.setHeader("X-RateLimit-Reset", Math.ceil(entry.resetAt / 1000));

  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({
      status: "error",
      code: "RATE_LIMIT",
      message: "Rate limit exceeded. Max 200 requests per minute per platform.",
      timestamp: new Date().toISOString(),
    });
  }

  next();
}

export function ecosystemCorsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  const platform = req.ecosystemPlatform;

  if (origin && platform) {
    const allowedOrigins = (platform.allowedOrigins as string[]) || [];
    if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Request-Id");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
}

export function ecosystemResponseHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Ecosystem-Platform", "fractional_living");
  res.setHeader("X-Ecosystem-Version", "1.0.0");
  res.setHeader("Content-Type", "application/json");

  const requestId = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("X-Request-Id", requestId as string);

  next();
}

export function ecosystemLogMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const platform = req.ecosystemPlatform?.slug || "unknown";
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    console.log(`[ECOSYSTEM] ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | Platform: ${platform} | IP: ${ip} | Status: ${res.statusCode} | ${duration}ms`);
  });
  next();
}

export function generateWebhookSignature(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}
