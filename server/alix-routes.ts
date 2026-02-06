import type { Express } from "express";
import { storage } from "./storage";
import {
  alixAuthMiddleware,
  alixRateLimitMiddleware,
  alixCorsMiddleware,
  alixResponseHeaders,
  alixLogMiddleware,
} from "./alix-middleware";

const APP_VERSION = "2.1.0";

export function registerAlixRoutes(app: Express) {
  const alixMiddleware = [
    alixCorsMiddleware,
    alixRateLimitMiddleware,
    alixAuthMiddleware,
    alixResponseHeaders,
    alixLogMiddleware,
  ];

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
          descripcion: p.subtitle || p.description?.slice(0, 200),
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
          url: `https://allliving.org/property/${p.id}`,
        }));

      res.json({
        status: "ok",
        data: {
          totalItems: catalog.length,
          items: catalog,
        },
        message: `${catalog.length} propiedades activas en el catálogo`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error fetching catalog:", error);
      res.status(500).json({
        status: "error",
        data: null,
        message: "Error retrieving catalog",
        timestamp: new Date().toISOString(),
      });
    }
  });

  app.get("/api/alix/stats", ...alixMiddleware, async (_req, res) => {
    try {
      const users = await storage.getUsers();
      const properties = await storage.getProperties();
      const bookings = await storage.getAllPreBookings();
      const subscribers = await storage.getSubscribers();

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const activeTodayCount = users.filter((u) => {
        if (!u.lastLogin) return false;
        const loginDate = new Date(u.lastLogin);
        loginDate.setHours(0, 0, 0, 0);
        return loginDate.getTime() === today.getTime();
      }).length;

      const activeBookings = bookings.filter(
        (b) => new Date(b.expiresAt) > new Date()
      );

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
        },
        message: "Platform statistics retrieved successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error fetching stats:", error);
      res.status(500).json({
        status: "error",
        data: null,
        message: "Error retrieving statistics",
        timestamp: new Date().toISOString(),
      });
    }
  });

  app.get("/api/alix/announcements", ...alixMiddleware, async (_req, res) => {
    try {
      const announcements = await storage.getAnnouncements();

      const publicAnnouncements = announcements
        .filter((a) => a.isActive)
        .map((a) => ({
          id: a.id,
          titulo: a.title,
          contenido: a.message,
          tipo: a.type,
          fecha: a.createdAt,
          activo: a.isActive,
        }));

      res.json({
        status: "ok",
        data: {
          total: publicAnnouncements.length,
          announcements: publicAnnouncements,
        },
        message: `${publicAnnouncements.length} announcements retrieved`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[ALIX] Error fetching announcements:", error);
      res.status(500).json({
        status: "error",
        data: null,
        message: "Error retrieving announcements",
        timestamp: new Date().toISOString(),
      });
    }
  });
}
