import type { Express } from "express";
import crypto from "crypto";
import { storage } from "./storage";
import { z } from "zod";
import {
  ecosystemAuthMiddleware,
  ecosystemRateLimitMiddleware,
  ecosystemCorsMiddleware,
  ecosystemResponseHeaders,
  ecosystemLogMiddleware,
  requireScope,
  generateWebhookSignature,
} from "./ecosystem-middleware";

const CREATOR_PASSWORD = process.env.CREATOR_PASSWORD || "lumamijuvisado";

function generatePlatformApiKey(): string {
  return "eco_" + crypto.randomBytes(32).toString("base64url");
}

function generateWebhookSecret(): string {
  return "whsec_" + crypto.randomBytes(24).toString("base64url");
}

async function emitEvent(event: string, payload: Record<string, any>) {
  try {
    const ecosystemEvent = await storage.createEcosystemEvent({
      event,
      sourcePlatform: "fractional_living",
      payload,
    });

    const webhooks = await storage.getWebhooksByEvent(event);
    const deliveredTo: string[] = [];

    for (const webhook of webhooks) {
      try {
        const body = JSON.stringify({
          id: ecosystemEvent.id,
          event,
          timestamp: new Date().toISOString(),
          source: "fractional_living",
          data: payload,
        });

        const signature = generateWebhookSignature(body, webhook.secret);

        const response = await fetch(webhook.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Ecosystem-Signature": signature,
            "X-Ecosystem-Event": event,
            "X-Ecosystem-Delivery": ecosystemEvent.id,
          },
          body,
          signal: AbortSignal.timeout(10000),
        });

        await storage.updateWebhookDelivery(webhook.id, response.status, response.ok);
        if (response.ok) deliveredTo.push(webhook.platformId);
      } catch (err) {
        console.error(`[ECOSYSTEM] Webhook delivery failed for ${webhook.url}:`, err);
        await storage.updateWebhookDelivery(webhook.id, 0, false);
      }
    }

    await storage.updateEcosystemEventDelivery(ecosystemEvent.id, deliveredTo);

    return ecosystemEvent;
  } catch (err) {
    console.error("[ECOSYSTEM] Event emission failed:", err);
  }
}

export function registerEcosystemRoutes(app: Express) {
  const ecoMiddleware = [
    ecosystemCorsMiddleware,
    ecosystemAuthMiddleware,
    ecosystemRateLimitMiddleware,
    ecosystemResponseHeaders,
    ecosystemLogMiddleware,
  ];

  // ========== PLATFORM MANAGEMENT (Creator password protected) ==========

  app.post("/api/ecosystem/v1/platforms", async (req, res) => {
    const { password, name, slug, type, baseUrl, allowedOrigins, description, contactEmail, scopes } = req.body;
    if (password !== CREATOR_PASSWORD) {
      return res.status(401).json({ status: "error", message: "Creator password required" });
    }

    try {
      const platform = await storage.createPlatform({
        name,
        slug,
        type: type || "external",
        baseUrl,
        allowedOrigins: allowedOrigins || [],
        description,
        contactEmail,
      });

      const apiKey = generatePlatformApiKey();
      const platformKey = await storage.createPlatformApiKey({
        platformId: platform.id,
        name: `${name} - Primary Key`,
        key: apiKey,
        scopes: scopes || ["read"],
      });

      res.status(201).json({
        status: "ok",
        data: {
          platform: {
            id: platform.id,
            name: platform.name,
            slug: platform.slug,
            type: platform.type,
          },
          apiKey: {
            id: platformKey.id,
            key: apiKey,
            scopes: platformKey.scopes,
          },
        },
        message: "Platform registered. Save the API key - it will only be shown once.",
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      if (error.code === "23505") {
        return res.status(409).json({ status: "error", message: "Platform name or slug already exists" });
      }
      console.error("[ECOSYSTEM] Error creating platform:", error);
      res.status(500).json({ status: "error", message: "Error creating platform" });
    }
  });

  app.get("/api/ecosystem/v1/platforms", async (req, res) => {
    const password = req.headers["x-creator-password"] as string;
    if (password !== CREATOR_PASSWORD) {
      return res.status(401).json({ status: "error", message: "Creator password required in X-Creator-Password header" });
    }

    try {
      const platforms = await storage.getPlatforms();
      res.json({
        status: "ok",
        data: {
          total: platforms.length,
          platforms: platforms.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            type: p.type,
            baseUrl: p.baseUrl,
            status: p.status,
            lastHeartbeat: p.lastHeartbeat,
            isActive: p.isActive,
            createdAt: p.createdAt,
          })),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error fetching platforms" });
    }
  });

  app.post("/api/ecosystem/v1/platforms/:id/generate-key", async (req, res) => {
    const { password, name, scopes } = req.body;
    if (password !== CREATOR_PASSWORD) {
      return res.status(401).json({ status: "error", message: "Creator password required" });
    }

    try {
      const platform = await storage.getPlatformById(req.params.id);
      if (!platform) {
        return res.status(404).json({ status: "error", message: "Platform not found" });
      }

      const apiKey = generatePlatformApiKey();
      const platformKey = await storage.createPlatformApiKey({
        platformId: platform.id,
        name: name || `${platform.name} Key`,
        key: apiKey,
        scopes: scopes || ["read"],
      });

      res.status(201).json({
        status: "ok",
        data: { id: platformKey.id, key: apiKey, scopes: platformKey.scopes },
        message: "New API key generated. Save it now.",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error generating key" });
    }
  });

  // ========== ECOSYSTEM DATA ENDPOINTS (Platform API key required) ==========

  // Health / Heartbeat
  app.post("/api/ecosystem/v1/heartbeat", ...ecoMiddleware, async (req, res) => {
    try {
      const platform = req.ecosystemPlatform!;
      await storage.updatePlatformHeartbeat(platform.id, req.body.metadata);

      res.json({
        status: "ok",
        data: {
          platform: platform.slug,
          receivedAt: new Date().toISOString(),
          yourScopes: req.ecosystemScopes,
        },
        message: "Heartbeat received",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Heartbeat failed" });
    }
  });

  app.get("/api/ecosystem/v1/status", ...ecoMiddleware, async (_req, res) => {
    try {
      const platforms = await storage.getPlatforms();
      const now = new Date();
      const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);

      res.json({
        status: "ok",
        data: {
          ecosystem: "All Global Holding LLC",
          node: "fractional_living",
          version: "1.0.0",
          uptime: true,
          uptimeSeconds: Math.floor(process.uptime()),
          connectedPlatforms: platforms.filter(p => p.isActive).length,
          platforms: platforms.map(p => ({
            name: p.name,
            slug: p.slug,
            status: p.lastHeartbeat && new Date(p.lastHeartbeat) > fiveMinAgo ? "online" : "offline",
            lastSeen: p.lastHeartbeat,
          })),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error fetching status" });
    }
  });

  // Properties (read)
  app.get("/api/ecosystem/v1/properties", ...ecoMiddleware, requireScope("read"), async (_req, res) => {
    try {
      const properties = await storage.getProperties();
      res.json({
        status: "ok",
        data: {
          total: properties.filter(p => p.isActive).length,
          items: properties.filter(p => p.isActive).map(p => ({
            id: p.id,
            title: p.title,
            subtitle: p.subtitle,
            category: p.category,
            location: p.location,
            country: p.country,
            description: p.description?.slice(0, 300),
            images: p.images,
            fractionPrice: p.fractionPrice,
            currency: p.currency,
            totalFractions: p.totalFractions,
            availableFractions: p.availableFractions,
            weeksPerFraction: p.weeksPerFraction,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            sqMeters: p.sqMeters,
            amenities: p.amenities,
            isFeatured: p.isFeatured,
            url: `https://allliving.org/property/${p.id}`,
          })),
        },
        source: "fractional_living",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error fetching properties" });
    }
  });

  app.get("/api/ecosystem/v1/properties/:id", ...ecoMiddleware, requireScope("read"), async (req, res) => {
    try {
      const property = await storage.getPropertyById(req.params.id);
      if (!property || !property.isActive) {
        return res.status(404).json({ status: "error", message: "Property not found" });
      }

      res.json({
        status: "ok",
        data: {
          ...property,
          url: `https://allliving.org/property/${property.id}`,
        },
        source: "fractional_living",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error fetching property" });
    }
  });

  // Leads (read + write)
  app.get("/api/ecosystem/v1/leads", ...ecoMiddleware, requireScope("read"), async (_req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json({
        status: "ok",
        data: {
          total: leads.length,
          items: leads.map(l => ({
            id: l.id,
            name: l.name,
            email: l.email,
            phone: l.phone,
            interest: l.interest,
            status: l.status,
            source: l.source,
            createdAt: l.createdAt,
          })),
        },
        source: "fractional_living",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error fetching leads" });
    }
  });

  app.post("/api/ecosystem/v1/leads", ...ecoMiddleware, requireScope("write"), async (req, res) => {
    try {
      const { name, email, phone, interest, message, source } = req.body;
      if (!email || !interest) {
        return res.status(400).json({ status: "error", message: "email and interest are required" });
      }

      const lead = await storage.createLead({
        name,
        email,
        phone,
        interest,
        message,
        source: source || `ecosystem:${req.ecosystemPlatform?.slug}`,
        status: "nuevo",
      });

      await emitEvent("lead.created", { leadId: lead.id, email: lead.email, source: lead.source });

      res.status(201).json({
        status: "ok",
        data: lead,
        message: "Lead created successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error creating lead" });
    }
  });

  // Bookings (read)
  app.get("/api/ecosystem/v1/bookings", ...ecoMiddleware, requireScope("read"), async (_req, res) => {
    try {
      const bookings = await storage.getAllPreBookings();
      const activeBookings = bookings.filter(b => new Date(b.expiresAt) > new Date());

      res.json({
        status: "ok",
        data: {
          total: bookings.length,
          active: activeBookings.length,
          items: bookings.map(b => ({
            id: b.id,
            propertyId: b.propertyId,
            email: b.email,
            name: b.name,
            selectedWeeks: b.selectedWeeks,
            bookingType: b.bookingType,
            status: b.status,
            totalPrice: b.totalPrice,
            expiresAt: b.expiresAt,
            createdAt: b.createdAt,
          })),
        },
        source: "fractional_living",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error fetching bookings" });
    }
  });

  // Users (read, limited fields)
  app.get("/api/ecosystem/v1/users", ...ecoMiddleware, requireScope("read"), async (_req, res) => {
    try {
      const users = await storage.getUsers();
      res.json({
        status: "ok",
        data: {
          total: users.length,
          items: users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            country: u.country,
            interests: u.interests,
            primaryInterest: u.primaryInterest,
            referralCode: u.referralCode,
            status: u.status,
            source: u.source,
            createdAt: u.createdAt,
          })),
        },
        source: "fractional_living",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error fetching users" });
    }
  });

  // Stats (read)
  app.get("/api/ecosystem/v1/stats", ...ecoMiddleware, requireScope("read"), async (_req, res) => {
    try {
      const users = await storage.getUsers();
      const properties = await storage.getProperties();
      const bookings = await storage.getAllPreBookings();
      const leads = await storage.getLeads();
      const subscribers = await storage.getSubscribers();

      const activeBookings = bookings.filter(b => new Date(b.expiresAt) > new Date());

      res.json({
        status: "ok",
        data: {
          node: "fractional_living",
          metrics: {
            totalUsers: users.length,
            totalProperties: properties.filter(p => p.isActive).length,
            totalBookings: bookings.length,
            activeBookings: activeBookings.length,
            totalLeads: leads.length,
            totalSubscribers: subscribers.length,
            leadsByStatus: {
              nuevo: leads.filter(l => l.status === "nuevo").length,
              contactado: leads.filter(l => l.status === "contactado").length,
              en_proceso: leads.filter(l => l.status === "en_proceso").length,
              cerrado: leads.filter(l => l.status === "cerrado").length,
            },
          },
        },
        source: "fractional_living",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error fetching stats" });
    }
  });

  // Announcements (read + write)
  app.get("/api/ecosystem/v1/announcements", ...ecoMiddleware, requireScope("read"), async (_req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json({
        status: "ok",
        data: {
          total: announcements.length,
          items: announcements.map(a => ({
            id: a.id,
            title: a.title,
            message: a.message,
            type: a.type,
            image: a.image,
            link: a.link,
            isActive: a.isActive,
            createdAt: a.createdAt,
          })),
        },
        source: "fractional_living",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error fetching announcements" });
    }
  });

  app.post("/api/ecosystem/v1/announcements", ...ecoMiddleware, requireScope("write"), async (req, res) => {
    try {
      const { title, message, type, image, link } = req.body;
      if (!title || !message) {
        return res.status(400).json({ status: "error", message: "title and message are required" });
      }

      const announcement = await storage.createAnnouncement({ title, message, type: type || "news", image, link });
      await emitEvent("announcement.created", { announcementId: announcement.id, title });

      res.status(201).json({
        status: "ok",
        data: announcement,
        message: "Announcement created",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error creating announcement" });
    }
  });

  // ========== WEBHOOK MANAGEMENT ==========

  app.post("/api/ecosystem/v1/webhooks", ...ecoMiddleware, requireScope("read"), async (req, res) => {
    try {
      const { url, events } = req.body;
      if (!url || !events || !Array.isArray(events)) {
        return res.status(400).json({ status: "error", message: "url and events[] are required" });
      }

      const validEvents = [
        "property.created", "property.updated", "property.deleted",
        "lead.created", "lead.updated",
        "booking.created", "booking.expired",
        "user.registered",
        "announcement.created",
      ];

      const invalidEvents = events.filter((e: string) => !validEvents.includes(e));
      if (invalidEvents.length > 0) {
        return res.status(400).json({
          status: "error",
          message: `Invalid events: ${invalidEvents.join(", ")}`,
          validEvents,
        });
      }

      const secret = generateWebhookSecret();
      const webhook = await storage.createWebhook({
        platformId: req.ecosystemPlatform!.id,
        url,
        secret,
        events,
      });

      res.status(201).json({
        status: "ok",
        data: {
          id: webhook.id,
          url: webhook.url,
          events: webhook.events,
          secret,
        },
        message: "Webhook registered. Save the secret for signature verification.",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error creating webhook" });
    }
  });

  app.get("/api/ecosystem/v1/webhooks", ...ecoMiddleware, async (req, res) => {
    try {
      const webhooks = await storage.getWebhooks(req.ecosystemPlatform!.id);
      res.json({
        status: "ok",
        data: {
          total: webhooks.length,
          items: webhooks.map(w => ({
            id: w.id,
            url: w.url,
            events: w.events,
            isActive: w.isActive,
            failCount: w.failCount,
            lastDelivery: w.lastDelivery,
            lastStatus: w.lastStatus,
          })),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error fetching webhooks" });
    }
  });

  app.delete("/api/ecosystem/v1/webhooks/:id", ...ecoMiddleware, async (req, res) => {
    try {
      await storage.deleteWebhook(req.params.id);
      res.json({
        status: "ok",
        data: { id: req.params.id },
        message: "Webhook deleted",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error deleting webhook" });
    }
  });

  // ========== EVENT LOG ==========

  app.get("/api/ecosystem/v1/events", ...ecoMiddleware, requireScope("read"), async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      const events = await storage.getRecentEvents(limit);

      res.json({
        status: "ok",
        data: {
          total: events.length,
          items: events.map(e => ({
            id: e.id,
            event: e.event,
            sourcePlatform: e.sourcePlatform,
            delivered: e.delivered,
            deliveredTo: e.deliveredTo,
            createdAt: e.createdAt,
          })),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error fetching events" });
    }
  });

  // ========== CROSS-PLATFORM DATA SYNC ==========

  app.post("/api/ecosystem/v1/sync/properties", ...ecoMiddleware, requireScope("write"), async (req, res) => {
    try {
      const { properties } = req.body;
      if (!Array.isArray(properties)) {
        return res.status(400).json({ status: "error", message: "properties[] array required" });
      }

      const results = [];
      for (const prop of properties) {
        try {
          const created = await storage.createProperty({
            ...prop,
            category: prop.category || "fractional",
            title: prop.title,
            location: prop.location || "Sin ubicación",
            description: prop.description || "",
            images: prop.images || [],
            conditions: prop.conditions || [],
          });
          results.push({ id: created.id, title: created.title, status: "created" });
          await emitEvent("property.created", { propertyId: created.id, source: req.ecosystemPlatform?.slug });
        } catch (err) {
          results.push({ title: prop.title, status: "error", error: (err as Error).message });
        }
      }

      res.status(201).json({
        status: "ok",
        data: { synced: results.filter(r => r.status === "created").length, total: results.length, results },
        message: "Sync completed",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error syncing properties" });
    }
  });

  app.post("/api/ecosystem/v1/sync/leads", ...ecoMiddleware, requireScope("write"), async (req, res) => {
    try {
      const { leads } = req.body;
      if (!Array.isArray(leads)) {
        return res.status(400).json({ status: "error", message: "leads[] array required" });
      }

      const results = [];
      for (const lead of leads) {
        try {
          const created = await storage.createLead({
            email: lead.email,
            name: lead.name,
            phone: lead.phone,
            interest: lead.interest || "general",
            message: lead.message,
            source: lead.source || `ecosystem:${req.ecosystemPlatform?.slug}`,
            status: "nuevo",
          });
          results.push({ id: created.id, email: created.email, status: "created" });
          await emitEvent("lead.created", { leadId: created.id, source: req.ecosystemPlatform?.slug });
        } catch (err) {
          results.push({ email: lead.email, status: "error", error: (err as Error).message });
        }
      }

      res.status(201).json({
        status: "ok",
        data: { synced: results.filter(r => r.status === "created").length, total: results.length, results },
        message: "Lead sync completed",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error syncing leads" });
    }
  });
}

export { emitEvent };
