import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

const APP_NAME = "Fractional Living";
const APP_VERSION = "2.1.0";

const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 100;

export async function alixAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logAlixRequest(req, 401);
    return res.status(401).json({
      status: "error",
      data: null,
      message: "Missing or invalid Authorization header. Expected: Bearer [API_KEY]",
      timestamp: new Date().toISOString(),
    });
  }

  const token = authHeader.slice(7);

  const envKey = process.env.ALIX_API_KEY;
  if (envKey && token === envKey) {
    return next();
  }

  try {
    const dbKey = await storage.getApiKeyByKey(token);
    if (dbKey && dbKey.isActive) {
      await storage.updateApiKeyLastUsed(dbKey.id);
      return next();
    }
  } catch (err) {
    console.error("[ALIX] Error checking DB API key:", err);
  }

  logAlixRequest(req, 401);
  return res.status(401).json({
    status: "error",
    data: null,
    message: "Invalid API key",
    timestamp: new Date().toISOString(),
  });
}

export function alixRateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  let entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
    requestCounts.set(ip, entry);
  }

  entry.count++;

  res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX);
  res.setHeader("X-RateLimit-Remaining", Math.max(0, RATE_LIMIT_MAX - entry.count));
  res.setHeader("X-RateLimit-Reset", Math.ceil(entry.resetAt / 1000));

  if (entry.count > RATE_LIMIT_MAX) {
    logAlixRequest(req, 429);
    return res.status(429).json({
      status: "error",
      data: null,
      message: "Rate limit exceeded. Max 100 requests per minute.",
      timestamp: new Date().toISOString(),
    });
  }

  next();
}

export function alixCorsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  const allowedOrigins = ["https://alix-ai.net"];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
}

export function alixResponseHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-App-Name", APP_NAME);
  res.setHeader("X-App-Version", APP_VERSION);
  res.setHeader("Content-Type", "application/json");
  next();
}

function logAlixRequest(req: Request, statusCode: number) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const timestamp = new Date().toISOString();
  const endpoint = req.originalUrl || req.url;
  console.log(`[ALIX] ${timestamp} | ${req.method} ${endpoint} | IP: ${ip} | Status: ${statusCode}`);
}

export function alixLogMiddleware(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    logAlixRequest(req, res.statusCode);
  });
  next();
}
