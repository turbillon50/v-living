import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertPreBookingSchema, insertAnnouncementSchema, insertSubscriberSchema, insertNavButtonSchema } from "@shared/schema";
import { z } from "zod";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);
  
  // Get all properties
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  // Get properties by category
  app.get("/api/properties/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const properties = await storage.getPropertiesByCategory(category);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties by category:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  // Get single property
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const property = await storage.getPropertyById(id);
      
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  // Creator Mode authentication
  const CREATOR_PASSWORD = process.env.CREATOR_PASSWORD || 'lumamijuvisado';

  // Creator login endpoint - returns a session token
  const CREATOR_TOKEN = 'creator_session_' + Date.now().toString(36);
  let activeCreatorToken = '';
  
  app.post("/api/creator/login", (req, res) => {
    const { password } = req.body;
    if (password === CREATOR_PASSWORD) {
      activeCreatorToken = CREATOR_TOKEN + '_' + Math.random().toString(36).slice(2);
      res.json({ success: true, token: activeCreatorToken });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  // Update verifyCreator to check active token
  const verifyCreatorToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['x-creator-token'];
    if (!activeCreatorToken || authHeader !== activeCreatorToken) {
      return res.status(401).json({ error: "Unauthorized - Creator access required" });
    }
    next();
  };

  // Create property (Creator Mode - Protected)
  app.post("/api/properties", verifyCreatorToken, async (req, res) => {
    try {
      const validated = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(validated);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid property data", details: error.errors });
      }
      console.error("Error creating property:", error);
      res.status(500).json({ error: "Failed to create property" });
    }
  });

  // Update property (Creator Mode - Protected)
  app.put("/api/properties/:id", verifyCreatorToken, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertPropertySchema.partial().parse(req.body);
      const property = await storage.updateProperty(id, validated);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid property data", details: error.errors });
      }
      console.error("Error updating property:", error);
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  // Delete property (Creator Mode - Protected)
  app.delete("/api/properties/:id", verifyCreatorToken, async (req, res) => {
    try {
      const { id } = req.params;
      const property = await storage.getPropertyById(id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      await storage.deleteProperty(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ error: "Failed to delete property" });
    }
  });

  // Get active pre-bookings for a property (check week availability)
  app.get("/api/properties/:id/bookings", async (req, res) => {
    try {
      const { id } = req.params;
      const bookings = await storage.getActivePreBookings(id);
      
      // Extract all booked weeks
      const bookedWeeks = bookings.flatMap(b => b.selectedWeeks as number[]);
      
      res.json({ bookedWeeks });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // Create pre-booking
  app.post("/api/pre-bookings", async (req, res) => {
    try {
      // Calculate expiration (5 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 5);
      
      const validated = insertPreBookingSchema.parse({
        ...req.body,
        expiresAt
      });

      // Clean up expired bookings first
      await storage.cleanExpiredBookings();

      // Check if weeks are still available
      const activeBookings = await storage.getActivePreBookings(validated.propertyId);
      const bookedWeeks = activeBookings.flatMap(b => b.selectedWeeks as number[]);
      const requestedWeeks = validated.selectedWeeks as number[];
      
      const hasConflict = requestedWeeks.some(week => bookedWeeks.includes(week));
      
      if (hasConflict) {
        return res.status(409).json({ 
          error: "Some weeks are no longer available",
          bookedWeeks 
        });
      }

      const booking = await storage.createPreBooking(validated);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      console.error("Error creating pre-booking:", error);
      res.status(500).json({ error: "Failed to create pre-booking" });
    }
  });

  // Get user's pre-bookings by email
  app.get("/api/pre-bookings/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const bookings = await storage.getPreBookingsByEmail(email);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // === CREATOR MODE ROUTES (Protected) ===

  // Get all pre-bookings (admin)
  app.get("/api/admin/pre-bookings", verifyCreatorToken, async (req, res) => {
    try {
      const bookings = await storage.getAllPreBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // Get analytics
  app.get("/api/admin/analytics", verifyCreatorToken, async (req, res) => {
    try {
      const properties = await storage.getProperties();
      const bookings = await storage.getAllPreBookings();
      const subscribers = await storage.getSubscribers();
      const announcements = await storage.getAnnouncements();

      const activeBookings = bookings.filter(b => new Date(b.expiresAt) > new Date());
      const fractionBookings = bookings.filter(b => b.bookingType === 'fraction' || !b.bookingType);
      const vacationBookings = bookings.filter(b => b.bookingType === 'vacation');

      res.json({
        totalProperties: properties.length,
        totalBookings: bookings.length,
        activeBookings: activeBookings.length,
        fractionBookings: fractionBookings.length,
        vacationBookings: vacationBookings.length,
        totalSubscribers: subscribers.length,
        totalAnnouncements: announcements.length,
        uniqueEmails: Array.from(new Set(bookings.map(b => b.email))).length,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Get announcements
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  // Create announcement (Protected)
  app.post("/api/announcements", verifyCreatorToken, async (req, res) => {
    try {
      const validated = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validated);
      res.status(201).json(announcement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid announcement data", details: error.errors });
      }
      console.error("Error creating announcement:", error);
      res.status(500).json({ error: "Failed to create announcement" });
    }
  });

  // Get subscribers
  app.get("/api/subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  // Create subscriber
  app.post("/api/subscribers", verifyCreatorToken, async (req, res) => {
    try {
      const validated = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.createSubscriber(validated);
      res.status(201).json(subscriber);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid subscriber data", details: error.errors });
      }
      console.error("Error creating subscriber:", error);
      res.status(500).json({ error: "Failed to create subscriber" });
    }
  });

  // Nav Buttons
  app.get("/api/nav-buttons", async (req, res) => {
    try {
      const buttons = await storage.getNavButtons();
      res.json(buttons);
    } catch (error) {
      console.error("Error fetching nav buttons:", error);
      res.status(500).json({ error: "Failed to fetch nav buttons" });
    }
  });

  app.post("/api/nav-buttons", verifyCreatorToken, async (req, res) => {
    try {
      const validated = insertNavButtonSchema.parse(req.body);
      const button = await storage.createNavButton(validated);
      res.status(201).json(button);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid button data", details: error.errors });
      }
      console.error("Error creating nav button:", error);
      res.status(500).json({ error: "Failed to create nav button" });
    }
  });

  app.put("/api/nav-buttons/:id", verifyCreatorToken, async (req, res) => {
    try {
      const { id } = req.params;
      const button = await storage.updateNavButton(id, req.body);
      res.json(button);
    } catch (error) {
      console.error("Error updating nav button:", error);
      res.status(500).json({ error: "Failed to update nav button" });
    }
  });

  app.delete("/api/nav-buttons/:id", verifyCreatorToken, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNavButton(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting nav button:", error);
      res.status(500).json({ error: "Failed to delete nav button" });
    }
  });

  // Exchange rate endpoint
  app.get("/api/exchange-rate", async (req, res) => {
    try {
      const rate = 17.5; // Default rate MXN to USD
      res.json({ rate, currency: "USD" });
    } catch (error) {
      res.status(500).json({ error: "Failed to get exchange rate" });
    }
  });

  return httpServer;
}
