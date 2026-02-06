import type { Express } from "express";
import crypto from "crypto";
import { storage } from "./storage";
import { insertAnnouncementSchema, insertPropertySchema } from "@shared/schema";
import { z } from "zod";
import {
  alixAuthMiddleware,
  alixRateLimitMiddleware,
  alixCorsMiddleware,
  alixResponseHeaders,
  alixLogMiddleware,
} from "./alix-middleware";

const APP_VERSION = "2.1.0";

function generateApiKey(): string {
  return crypto.randomBytes(48).toString("base64url");
}

export function registerAlixRoutes(app: Express) {
  const alixMiddleware = [
    alixCorsMiddleware,
    alixRateLimitMiddleware,
    alixAuthMiddleware,
    alixResponseHeaders,
    alixLogMiddleware,
  ];

  // ========== API KEY MANAGEMENT (protected by creator password) ==========

  const CREATOR_PASSWORD = process.env.CREATOR_PASSWORD || "lumamijuvisado";

  app.post("/api/alix/generate-key", async (req, res) => {
    const { password, name } = req.body;
    if (password !== CREATOR_PASSWORD) {
      return res.status(401).json({
        status: "error",
        data: null,
        message: "Unauthorized - Creator password required",
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const key = generateApiKey();
      const apiKey = await storage.createApiKey(name || "ALIX 2.4", key);
      res.json({
        status: "ok",
        data: {
          id: apiKey.id,
          name: apiKey.name,
          key: apiKey.key,
          createdAt: apiKey.createdAt,
        },
        message: "API Key generated. Save this key now - it will only be shown masked after this.",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error generating API key:", error);
      res.status(500).json({
        status: "error",
        data: null,
        message: "Error generating API key",
        timestamp: new Date().toISOString(),
      });
    }
  });

  app.get("/api/alix/keys", async (req, res) => {
    const password = req.headers["x-creator-password"] as string;
    if (password !== CREATOR_PASSWORD) {
      return res.status(401).json({
        status: "error",
        data: null,
        message: "Unauthorized - Creator password required in X-Creator-Password header",
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const keys = await storage.getApiKeys();
      res.json({
        status: "ok",
        data: {
          keys: keys.map((k) => ({
            id: k.id,
            name: k.name,
            keyPreview: k.key.slice(0, 8) + "..." + k.key.slice(-4),
            isActive: k.isActive,
            lastUsed: k.lastUsed,
            createdAt: k.createdAt,
          })),
        },
        message: `${keys.length} active API keys`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        data: null,
        message: "Error fetching API keys",
        timestamp: new Date().toISOString(),
      });
    }
  });

  // ========== READ ENDPOINTS ==========

  app.get("/api/alix/status", ...alixMiddleware, (_req, res) => {
    res.json({
      status: "ok",
      data: {
        appName: "Fractional Living",
        appVersion: APP_VERSION,
        state: "online",
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
      },
      message: "Fractional Living is online and operational",
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/alix/catalog", ...alixMiddleware, async (_req, res) => {
    try {
      const properties = await storage.getProperties();
      const catalog = properties
        .filter((p) => p.isActive)
        .map((p) => ({
          id: p.id,
          nombre: p.title,
          subtitulo: p.subtitle,
          descripcion: p.description?.slice(0, 200),
          categoria: p.category,
          ubicacion: p.location,
          pais: p.country,
          disponibilidad: `${p.availableFractions}/${p.totalFractions} fracciones disponibles`,
          precioFraccion: p.fractionPrice,
          moneda: p.currency,
          semanasIncluidas: p.weeksPerFraction,
          recamaras: p.bedrooms,
          banos: p.bathrooms,
          m2: p.sqMeters,
          amenidades: p.amenities,
          url: `https://allliving.org/property/${p.id}`,
        }));

      res.json({
        status: "ok",
        data: { totalItems: catalog.length, items: catalog },
        message: `${catalog.length} propiedades activas en el catálogo`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error fetching catalog:", error);
      res.status(500).json({ status: "error", data: null, message: "Error retrieving catalog", timestamp: new Date().toISOString() });
    }
  });

  app.get("/api/alix/stats", ...alixMiddleware, async (_req, res) => {
    try {
      const users = await storage.getUsers();
      const properties = await storage.getProperties();
      const bookings = await storage.getAllPreBookings();
      const subscribers = await storage.getSubscribers();
      const leads = await storage.getLeads();

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const activeTodayCount = users.filter((u) => {
        if (!u.lastLogin) return false;
        const loginDate = new Date(u.lastLogin);
        loginDate.setHours(0, 0, 0, 0);
        return loginDate.getTime() === today.getTime();
      }).length;

      const activeBookings = bookings.filter((b) => new Date(b.expiresAt) > new Date());

      res.json({
        status: "ok",
        data: {
          totalUsuarios: users.length,
          activosHoy: activeTodayCount,
          totalPropiedades: properties.length,
          propiedadesActivas: properties.filter((p) => p.isActive).length,
          totalReservas: bookings.length,
          reservasActivas: activeBookings.length,
          totalSuscriptores: subscribers.length,
          totalLeads: leads.length,
          leadsPorEstatus: {
            nuevo: leads.filter((l) => l.status === "nuevo").length,
            contactado: leads.filter((l) => l.status === "contactado").length,
            enProceso: leads.filter((l) => l.status === "en_proceso").length,
            cerrado: leads.filter((l) => l.status === "cerrado").length,
          },
        },
        message: "Platform statistics retrieved successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error fetching stats:", error);
      res.status(500).json({ status: "error", data: null, message: "Error retrieving statistics", timestamp: new Date().toISOString() });
    }
  });

  app.get("/api/alix/announcements", ...alixMiddleware, async (_req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      const publicAnnouncements = announcements.map((a) => ({
        id: a.id,
        titulo: a.title,
        contenido: a.message,
        tipo: a.type,
        imagen: a.image,
        link: a.link,
        fecha: a.createdAt,
        activo: a.isActive,
      }));

      res.json({
        status: "ok",
        data: { total: publicAnnouncements.length, announcements: publicAnnouncements },
        message: `${publicAnnouncements.length} announcements retrieved`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error fetching announcements:", error);
      res.status(500).json({ status: "error", data: null, message: "Error retrieving announcements", timestamp: new Date().toISOString() });
    }
  });

  app.get("/api/alix/leads", ...alixMiddleware, async (_req, res) => {
    try {
      const leads = await storage.getLeads();
      const safeleads = leads.map((l) => ({
        id: l.id,
        nombre: l.name,
        email: l.email,
        telefono: l.phone,
        interes: l.interest,
        mensaje: l.message,
        estatus: l.status,
        fuente: l.source,
        fecha: l.createdAt,
      }));

      res.json({
        status: "ok",
        data: { total: safeleads.length, leads: safeleads },
        message: `${safeleads.length} leads retrieved`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error fetching leads:", error);
      res.status(500).json({ status: "error", data: null, message: "Error retrieving leads", timestamp: new Date().toISOString() });
    }
  });

  app.get("/api/alix/bookings", ...alixMiddleware, async (_req, res) => {
    try {
      const bookings = await storage.getAllPreBookings();
      const safeBookings = bookings.map((b) => ({
        id: b.id,
        propertyId: b.propertyId,
        email: b.email,
        nombre: b.name,
        semanas: b.selectedWeeks,
        tipo: b.bookingType,
        estatus: b.status,
        precioTotal: b.totalPrice,
        expira: b.expiresAt,
        fecha: b.createdAt,
      }));

      res.json({
        status: "ok",
        data: { total: safeBookings.length, bookings: safeBookings },
        message: `${safeBookings.length} bookings retrieved`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error fetching bookings:", error);
      res.status(500).json({ status: "error", data: null, message: "Error retrieving bookings", timestamp: new Date().toISOString() });
    }
  });

  // ========== WRITE ENDPOINTS ==========

  // --- Announcements CRUD ---
  app.post("/api/alix/announcements", ...alixMiddleware, async (req, res) => {
    try {
      const validated = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validated);
      res.status(201).json({
        status: "ok",
        data: announcement,
        message: "Announcement created successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: "error", data: null, message: "Invalid data", timestamp: new Date().toISOString() });
      }
      console.error("[ALIX] Error creating announcement:", error);
      res.status(500).json({ status: "error", data: null, message: "Error creating announcement", timestamp: new Date().toISOString() });
    }
  });

  app.put("/api/alix/announcements/:id", ...alixMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertAnnouncementSchema.partial().parse(req.body);
      const updated = await storage.updateAnnouncement(id, data);
      if (!updated) {
        return res.status(404).json({ status: "error", data: null, message: "Announcement not found", timestamp: new Date().toISOString() });
      }
      res.json({
        status: "ok",
        data: updated,
        message: "Announcement updated successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error updating announcement:", error);
      res.status(500).json({ status: "error", data: null, message: "Error updating announcement", timestamp: new Date().toISOString() });
    }
  });

  app.delete("/api/alix/announcements/:id", ...alixMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteAnnouncement(id);
      res.json({
        status: "ok",
        data: { id },
        message: "Announcement deleted successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error deleting announcement:", error);
      res.status(500).json({ status: "error", data: null, message: "Error deleting announcement", timestamp: new Date().toISOString() });
    }
  });

  // --- Properties CRUD ---
  app.post("/api/alix/properties", ...alixMiddleware, async (req, res) => {
    try {
      const validated = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(validated);
      res.status(201).json({
        status: "ok",
        data: property,
        message: "Property created successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: "error", data: null, message: "Invalid property data", timestamp: new Date().toISOString() });
      }
      console.error("[ALIX] Error creating property:", error);
      res.status(500).json({ status: "error", data: null, message: "Error creating property", timestamp: new Date().toISOString() });
    }
  });

  app.put("/api/alix/properties/:id", ...alixMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertPropertySchema.partial().parse(req.body);
      const updated = await storage.updateProperty(id, data);
      if (!updated) {
        return res.status(404).json({ status: "error", data: null, message: "Property not found", timestamp: new Date().toISOString() });
      }
      res.json({
        status: "ok",
        data: updated,
        message: "Property updated successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error updating property:", error);
      res.status(500).json({ status: "error", data: null, message: "Error updating property", timestamp: new Date().toISOString() });
    }
  });

  app.delete("/api/alix/properties/:id", ...alixMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const property = await storage.getPropertyById(id);
      if (!property) {
        return res.status(404).json({ status: "error", data: null, message: "Property not found", timestamp: new Date().toISOString() });
      }
      await storage.deleteProperty(id);
      res.json({
        status: "ok",
        data: { id },
        message: "Property deleted successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error deleting property:", error);
      res.status(500).json({ status: "error", data: null, message: "Error deleting property", timestamp: new Date().toISOString() });
    }
  });

  // --- Leads management ---
  app.put("/api/alix/leads/:id", ...alixMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateLead(id, req.body);
      if (!updated) {
        return res.status(404).json({ status: "error", data: null, message: "Lead not found", timestamp: new Date().toISOString() });
      }
      res.json({
        status: "ok",
        data: updated,
        message: "Lead updated successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error updating lead:", error);
      res.status(500).json({ status: "error", data: null, message: "Error updating lead", timestamp: new Date().toISOString() });
    }
  });

  app.delete("/api/alix/leads/:id", ...alixMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteLead(id);
      res.json({
        status: "ok",
        data: { id },
        message: "Lead deleted successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error deleting lead:", error);
      res.status(500).json({ status: "error", data: null, message: "Error deleting lead", timestamp: new Date().toISOString() });
    }
  });

  // --- Subscribers management ---
  app.post("/api/alix/subscribers", ...alixMiddleware, async (req, res) => {
    try {
      const subscriber = await storage.createSubscriber(req.body);
      res.status(201).json({
        status: "ok",
        data: subscriber,
        message: "Subscriber added successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error creating subscriber:", error);
      res.status(500).json({ status: "error", data: null, message: "Error creating subscriber", timestamp: new Date().toISOString() });
    }
  });

  app.get("/api/alix/subscribers", ...alixMiddleware, async (_req, res) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json({
        status: "ok",
        data: { total: subscribers.length, subscribers: subscribers.map((s) => ({ id: s.id, email: s.email, nombre: s.name, fuente: s.source, fecha: s.createdAt })) },
        message: `${subscribers.length} subscribers retrieved`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ status: "error", data: null, message: "Error retrieving subscribers", timestamp: new Date().toISOString() });
    }
  });
}
