import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertPreBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

  // Create property (Creator Mode)
  app.post("/api/properties", async (req, res) => {
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

  return httpServer;
}
