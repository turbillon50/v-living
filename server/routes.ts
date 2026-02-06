import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertPreBookingSchema, insertAnnouncementSchema, insertSubscriberSchema, insertNavButtonSchema, insertCategorySchema, insertLeadSchema, insertUserSchema } from "@shared/schema";
import crypto from "crypto";
import { z } from "zod";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { sendLeadConfirmationEmail, sendUserRegistrationEmail, sendCampaignEmail } from "./resend";
import OpenAI from "openai";
import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express";
import { registerAlixRoutes } from "./alix-routes";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const ALMYRIA_PROPERTIES = [
  { title: 'ALMYRIA Residencia A', subtitle: 'Residencia de 126 m² en Aldea Zama', sqMeters: 126, fractionPrice: 380000, bedrooms: 2, bathrooms: 2 },
  { title: 'ALMYRIA Residencia B', subtitle: 'Residencia de 126 m² vista panorámica', sqMeters: 126, fractionPrice: 380000, bedrooms: 2, bathrooms: 2 },
  { title: 'ALMYRIA Residencia C', subtitle: 'Residencia de 126 m² acabados premium', sqMeters: 126, fractionPrice: 380000, bedrooms: 2, bathrooms: 2 },
  { title: 'ALMYRIA Penthouse', subtitle: 'Penthouse de 127 m² con rooftop privado', sqMeters: 127, fractionPrice: 380000, bedrooms: 2, bathrooms: 2 },
];

const HERMITAGE_PROPERTIES = [
  { title: 'HERMITAGE KEEJ Estudio 4A', subtitle: 'Estudio de 49 m² con terraza y jacuzzi', sqMeters: 49, fractionPrice: 180000, bedrooms: 1, bathrooms: 1 },
  { title: 'HERMITAGE KEEJ Residencia 01', subtitle: 'Residencia de 118 m² planta baja con jacuzzi', sqMeters: 118, fractionPrice: 280000, bedrooms: 2, bathrooms: 2 },
  { title: 'HERMITAGE KEEJ Residencia 06', subtitle: 'Residencia de 126 m² tercer nivel con jacuzzi', sqMeters: 126, fractionPrice: 280000, bedrooms: 2, bathrooms: 2 },
];

const ATTIK_PROPERTIES = [
  { title: 'ATTIK Loft', subtitle: 'Unidades de 50-75 m² con vista de ático', sqMeters: 75, fractionPrice: 250000, bedrooms: 1, bathrooms: 1 },
  { title: 'ATTIK Loft Central', subtitle: 'Unidad de 50 m² con vista panorámica', sqMeters: 50, fractionPrice: 250000, bedrooms: 1, bathrooms: 1 },
  { title: 'ATTIK Loft Esquina', subtitle: 'Unidad de 60 m² con doble vista', sqMeters: 60, fractionPrice: 250000, bedrooms: 1, bathrooms: 1 },
  { title: 'ATTIK Loft Premium', subtitle: 'Unidad de 75 m² con acabados superiores', sqMeters: 75, fractionPrice: 250000, bedrooms: 1, bathrooms: 1 },
  { title: 'ATTIK Pareja', subtitle: 'Unidades de 75-98 m² con jacuzzi o plunge pool', sqMeters: 98, fractionPrice: 350000, bedrooms: 1, bathrooms: 1 },
  { title: 'ATTIK Pareja Jacuzzi', subtitle: 'Unidad de 85 m² con jacuzzi privado', sqMeters: 85, fractionPrice: 350000, bedrooms: 1, bathrooms: 1 },
  { title: 'ATTIK Pareja Plunge Pool', subtitle: 'Unidad de 98 m² con plunge pool', sqMeters: 98, fractionPrice: 350000, bedrooms: 1, bathrooms: 1 },
  { title: 'ATTIK Familiar', subtitle: 'Unidades de 100-125 m² para toda la familia', sqMeters: 125, fractionPrice: 400000, bedrooms: 2, bathrooms: 2 },
  { title: 'ATTIK Familiar Plus', subtitle: 'Unidad de 115 m² espacios amplios', sqMeters: 115, fractionPrice: 400000, bedrooms: 2, bathrooms: 2 },
  { title: 'ATTIK Penthouse', subtitle: 'Unidad de 125 m² vista privilegiada', sqMeters: 125, fractionPrice: 400000, bedrooms: 2, bathrooms: 2 },
];

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Clerk middleware (if keys are available)
  if (process.env.CLERK_SECRET_KEY) {
    app.use(clerkMiddleware());
  }
  
  // Setup Replit Auth (must be before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);
  
  // Register ALIX 2.4 integration routes
  registerAlixRoutes(app);
  
  // Clerk user sync endpoint
  app.post("/api/clerk/sync-user", async (req, res) => {
    try {
      const { clerkId, email, name, phone, profileImage } = req.body;
      
      if (!clerkId || !email) {
        return res.status(400).json({ error: "clerkId and email required" });
      }

      let user = await storage.getUserByEmail(email.toLowerCase());
      
      if (user) {
        user = await storage.updateUser(user.id, {
          name: name || user.name,
          phone: phone || user.phone,
        } as any);
        if (!user!.referralCode) {
          await storage.generateReferralCode(user!.id);
          user = await storage.getUserById(user!.id);
        }
      } else {
        user = await storage.createUser({
          name: name || 'Usuario',
          email: email.toLowerCase(),
          phone: phone || '',
          country: 'México',
          password: clerkId,
          interests: [],
          referredBy: req.body.referralCode || undefined,
          status: 'lead',
          source: req.body.referralCode ? 'referral' : 'clerk',
        });
        await storage.generateReferralCode(user.id);
        user = await storage.getUserById(user.id);
      }
      
      const { password: _, ...safeUser } = user!;
      res.json(safeUser);
    } catch (error) {
      console.error("Error syncing Clerk user:", error);
      res.status(500).json({ error: "Failed to sync user" });
    }
  });
  
  // Get current Clerk user
  app.get("/api/clerk/me", async (req, res) => {
    try {
      const auth = getAuth(req);
      if (!auth.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      // Find user by clerk ID in password field or by session
      const users = await storage.getUsers();
      const user = users.find(u => u.password === auth.userId || u.source === 'clerk');
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error getting Clerk user:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Version endpoint for automatic updates
  app.get("/api/version", (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.json({ version: "2.1.0", timestamp: Date.now() });
  });

  // Seed ATTIK properties endpoint - call this on production to populate
  app.post("/api/seed-attik", async (req, res) => {
    try {
      const { password } = req.body;
      if (password !== 'lumamijuvisado') {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // First delete old properties that aren't ATTIK
      const existingProps = await storage.getProperties();
      for (const prop of existingProps) {
        if (!prop.title.startsWith('ATTIK')) {
          await storage.deleteProperty(prop.id);
        }
      }

      // Check which ATTIK properties already exist
      const existingTitles = existingProps.filter(p => p.title.startsWith('ATTIK')).map(p => p.title);
      
      let added = 0;
      for (const prop of ATTIK_PROPERTIES) {
        if (!existingTitles.includes(prop.title)) {
          await storage.createProperty({
            category: 'fractional',
            title: prop.title,
            subtitle: prop.subtitle,
            location: 'La Veleta, Tulum',
            country: 'México',
            description: 'Un refugio de lujo donde arquitectura, confort y naturaleza se fusionan. El único complejo con arquitectura de vanguardia en Tulum. Vista de ático hacia la selva, ventanales gigantes para los mejores amaneceres y atardeceres. A 0.3 km del centro, 1 km de Av. Cobá y 4 km de la playa con transporte incluido.',
            images: ['/attik-1.jpg', '/attik-2.jpg', '/attik-3.jpg', '/attik-4.jpg', '/attik-5.jpg'],
            conditions: ['Preventa - Beneficio de compra inmediata', `1 semana: $${prop.fractionPrice.toLocaleString()} MXN`, 'Enganche: 30%', '12 meses sin intereses', 'Propiedad heredable', 'Estructura fiduciaria'],
            amenities: ['Infinity Pool', 'Sky Bar', 'Gimnasio', 'Yoga Loft', 'Float Tank', 'Área de Fogata', 'Rooftop', 'Club de Playa', 'Seguridad 24/7', 'Transporte a Playa'],
            sqMeters: prop.sqMeters,
            fractionPrice: prop.fractionPrice,
            totalFractions: 14,
            availableFractions: 14,
            weeksPerFraction: 3,
            currency: 'MXN',
            isFeatured: true,
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
          });
          added++;
        }
      }

      res.json({ success: true, added, message: `Added ${added} ATTIK properties` });
    } catch (error) {
      console.error("Error seeding ATTIK:", error);
      res.status(500).json({ error: "Failed to seed properties" });
    }
  });

  // Seed ALMYRIA properties endpoint
  app.post("/api/seed-almyria", async (req, res) => {
    try {
      const { password } = req.body;
      if (password !== 'lumamijuvisado') {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const existingProps = await storage.getProperties();
      const existingTitles = existingProps.filter(p => p.title.startsWith('ALMYRIA')).map(p => p.title);
      
      let added = 0;
      for (const prop of ALMYRIA_PROPERTIES) {
        if (!existingTitles.includes(prop.title)) {
          await storage.createProperty({
            category: 'fractional',
            title: prop.title,
            subtitle: prop.subtitle,
            location: 'Aldea Zama, Tulum',
            country: 'México',
            description: 'ALMYRIA Residences te acerca al corazón de la Riviera Maya. A tan solo 35 minutos del aeropuerto internacional de Tulum y a 1:35 horas del aeropuerto de Cancún. Este hogar excepcional te brinda la experiencia de vivir en un paraíso. Preventa 90% avance - Entrega Julio 2026. Si compras hoy, te instalamos en una propiedad de las mismas características o superiores mientras se entrega.',
            images: ['/almyria-1.jpg', '/almyria-2.jpg', '/almyria-3.jpg', '/almyria-4.jpg'],
            conditions: [
              'Preventa 90% - Entrega Julio 2026',
              '1 semana: $380,000 MXN',
              '2 semanas: $706,000 MXN (~7% desc)',
              '3 semanas: $980,000 MXN (~14% desc)',
              '30% Enganche',
              '50% Mensualidades',
              '20% a la escrituración',
              'Si compras hoy, te instalamos en propiedad similar mientras se entrega',
              'Propiedad heredable'
            ],
            amenities: ['Roofgarden', 'Infinity Pool', 'Gimnasio', 'Vista Panorámica', 'Seguridad 24/7', 'Estacionamiento', 'Bodega'],
            sqMeters: prop.sqMeters,
            fractionPrice: prop.fractionPrice,
            totalFractions: 14,
            availableFractions: 14,
            weeksPerFraction: 3,
            currency: 'MXN',
            isFeatured: true,
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
          });
          added++;
        }
      }

      res.json({ success: true, added, message: `Added ${added} ALMYRIA properties` });
    } catch (error) {
      console.error("Error seeding ALMYRIA:", error);
      res.status(500).json({ error: "Failed to seed properties" });
    }
  });

  // Seed HERMITAGE KEEJ properties endpoint
  app.post("/api/seed-hermitage", async (req, res) => {
    try {
      const { password } = req.body;
      if (password !== 'lumamijuvisado') {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const existingProps = await storage.getProperties();
      const existingTitles = existingProps.filter(p => p.title.startsWith('HERMITAGE')).map(p => p.title);
      
      let added = 0;
      for (const prop of HERMITAGE_PROPERTIES) {
        if (!existingTitles.includes(prop.title)) {
          await storage.createProperty({
            category: 'fractional',
            title: prop.title,
            subtitle: prop.subtitle,
            location: 'Aldea Zama, Tulum',
            country: 'México',
            description: 'HERMITAGE KEEJ ofrece una ubicación de excelencia en Aldea Zama, combinada con una amplia diversidad de experiencias que solo la joya de la Riviera Maya puede ofrecer. A 35 minutos del aeropuerto de Tulum y 1:35 hrs de Cancún. Vida de lujo y comodidad en el corazón de Tulum. Cocina equipada SMEG, terraza con jacuzzi, acabados premium en nogal. Entrega Junio 2026.',
            images: ['/hermitage-1.jpg', '/hermitage-2.jpg', '/hermitage-3.jpg'],
            conditions: [
              'Preventa - Entrega Junio 2026',
              `1 semana: $${prop.fractionPrice.toLocaleString()} MXN`,
              '30% Enganche',
              '50% Mensualidades',
              '20% a la escrituración',
              'Cocina equipada SMEG',
              'Terraza con jacuzzi',
              'Propiedad heredable'
            ],
            amenities: ['Lobby Front Desk', 'Elevador', 'Roof Garden', 'Alberca', 'Lounge', 'Gimnasio', 'Bodega', 'Vigilancia 24/7', 'CCTV', 'Planta Emergencia'],
            sqMeters: prop.sqMeters,
            fractionPrice: prop.fractionPrice,
            totalFractions: 14,
            availableFractions: 14,
            weeksPerFraction: 3,
            currency: 'MXN',
            isFeatured: true,
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
          });
          added++;
        }
      }

      res.json({ success: true, added, message: `Added ${added} HERMITAGE KEEJ properties` });
    } catch (error) {
      console.error("Error seeding HERMITAGE:", error);
      res.status(500).json({ error: "Failed to seed properties" });
    }
  });
  
  // Get all properties
  app.get("/api/properties", async (req, res) => {
    try {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
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

  // Duplicate property (Creator Mode)
  app.post("/api/properties/:id/duplicate", verifyCreatorToken, async (req, res) => {
    try {
      const { id } = req.params;
      const duplicated = await storage.duplicateProperty(id);
      if (!duplicated) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.status(201).json(duplicated);
    } catch (error) {
      console.error("Error duplicating property:", error);
      res.status(500).json({ error: "Failed to duplicate property" });
    }
  });

  // Increment view count (public)
  app.post("/api/properties/:id/view", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementViewCount(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing view:", error);
      res.status(500).json({ error: "Failed to increment view" });
    }
  });

  // Categories CRUD
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", verifyCreatorToken, async (req, res) => {
    try {
      const validated = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validated);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid category data", details: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.put("/api/categories/:id", verifyCreatorToken, async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.updateCategory(id, req.body);
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", verifyCreatorToken, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCategory(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Site Settings (CMS texts)
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

  app.get("/api/site-settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getSiteSetting(key);
      res.json(setting || { key, value: '' });
    } catch (error) {
      console.error("Error fetching site setting:", error);
      res.status(500).json({ error: "Failed to fetch site setting" });
    }
  });

  app.post("/api/site-settings", verifyCreatorToken, async (req, res) => {
    try {
      const { key, value } = req.body;
      if (!key) {
        return res.status(400).json({ error: "Key is required" });
      }
      const setting = await storage.upsertSiteSetting(key, value || '');
      res.json(setting);
    } catch (error) {
      console.error("Error saving site setting:", error);
      res.status(500).json({ error: "Failed to save site setting" });
    }
  });

  app.delete("/api/site-settings/:key", verifyCreatorToken, async (req, res) => {
    try {
      const { key } = req.params;
      await storage.deleteSiteSetting(key);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting site setting:", error);
      res.status(500).json({ error: "Failed to delete site setting" });
    }
  });

  // Leads endpoints
  app.post("/api/leads", async (req, res) => {
    try {
      const data = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(data);
      
      // Send confirmation email via Resend
      try {
        const emailResult = await sendLeadConfirmationEmail(data.email, data.interest, data.name || undefined);
        if (emailResult.success) {
          await storage.markLeadEmailSent(lead.id);
        }
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }
      
      res.status(201).json({ 
        success: true, 
        message: "Tu solicitud ha sido recibida. En los próximos 5 días recibirás el estatus de tu solicitud.",
        lead 
      });
    } catch (error) {
      console.error("Error creating lead:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  app.get("/api/leads", verifyCreatorToken, async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.patch("/api/leads/:id/status", verifyCreatorToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const lead = await storage.updateLeadStatus(id, status);
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead status:", error);
      res.status(500).json({ error: "Failed to update lead status" });
    }
  });

  // Multilinks CRUD
  app.get("/api/multilinks", async (req, res) => {
    try {
      const links = await storage.getMultilinks();
      res.json(links);
    } catch (error) {
      console.error("Error fetching multilinks:", error);
      res.status(500).json({ error: "Failed to fetch multilinks" });
    }
  });

  app.post("/api/multilinks", verifyCreatorToken, async (req, res) => {
    try {
      const link = await storage.createMultilink(req.body);
      res.status(201).json(link);
    } catch (error) {
      console.error("Error creating multilink:", error);
      res.status(500).json({ error: "Failed to create multilink" });
    }
  });

  app.put("/api/multilinks/:id", verifyCreatorToken, async (req, res) => {
    try {
      const { id } = req.params;
      const link = await storage.updateMultilink(id, req.body);
      res.json(link);
    } catch (error) {
      console.error("Error updating multilink:", error);
      res.status(500).json({ error: "Failed to update multilink" });
    }
  });

  app.delete("/api/multilinks/:id", verifyCreatorToken, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMultilink(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting multilink:", error);
      res.status(500).json({ error: "Failed to delete multilink" });
    }
  });

  // Alix AI Chat endpoint - Using external ALIX API
  app.post("/api/alix/chat", async (req, res) => {
    try {
      const { message, history = [] } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ALIX_API_KEY = process.env.ALIX_API_KEY;
      const ALIX_BASE_URL = 'https://alix-ai.net';

      if (ALIX_API_KEY) {
        // Use external ALIX API
        try {
          const alixResponse = await fetch(`${ALIX_BASE_URL}/api/alix/command`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-ALIX-API-KEY': ALIX_API_KEY
            },
            body: JSON.stringify({
              command: message,
              context: {
                currentApp: 'fractional-living',
                userRole: 'visitor',
                history: history.slice(-5)
              }
            })
          });

          if (alixResponse.ok) {
            const alixData = await alixResponse.json();
            return res.json({ reply: alixData.response || alixData.reply || alixData.message });
          }
        } catch (alixError) {
          console.error("ALIX API error, falling back to OpenAI:", alixError);
        }
      }

      // Fallback to OpenAI if ALIX API fails or is not configured
      const systemPrompt = `Eres Alix, la asesora virtual de Fractional Living - All Global Holding LLC. 
      
Tu rol es ayudar a los usuarios a entender el modelo de propiedad fraccionada de lujo en el Caribe mexicano.

INFORMACIÓN CLAVE:
- Fractional Living ofrece fracciones de propiedades de lujo en Tulum, México
- Cada fracción te da derecho a 3 semanas al año de uso
- Las propiedades son heredables y legalmente tuyas
- Proyectos actuales: ATTIK (La Veleta), ALMYRIA (Aldea Zama), HERMITAGE KEEJ (Aldea Zama)
- Precios desde $180,000 MXN hasta $400,000 MXN por semana dependiendo del proyecto
- Modelo de pago: 30% enganche, 50% mensualidades, 20% a la escrituración
- Las propiedades incluyen amenidades de lujo: alberca, gimnasio, seguridad 24/7, transporte a playa

CÓMO RESPONDER:
- Sé amable, profesional y entusiasta
- Responde en español por defecto
- Mantén respuestas concisas pero informativas (2-3 párrafos máximo)
- Si no sabes algo específico, invita al usuario a contactar por WhatsApp: +52 998 429 2748
- Siempre menciona que pueden registrar su interés en allliving.org

NO HAGAS:
- No inventes precios o datos que no conoces
- No prometas cosas que no están confirmadas
- No des asesoría legal o financiera específica`;

      const messages: any[] = [
        { role: "system", content: systemPrompt },
        ...history.map((h: any) => ({ role: h.role, content: h.content })),
        { role: "user", content: message }
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content || "Lo siento, no pude procesar tu mensaje. Por favor intenta de nuevo.";
      
      res.json({ reply });
    } catch (error) {
      console.error("Error in Alix chat:", error);
      res.status(500).json({ error: "Failed to process message", reply: "Lo siento, hubo un error. Por favor contacta por WhatsApp al +52 998 429 2748." });
    }
  });

  // ========== USER REGISTRATION & AUTH ==========
  
  // Simple password hashing (for production use bcrypt)
  function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  // Register new user
  app.post("/api/users/register", async (req, res) => {
    try {
      const { name, email, phone, country, password, referralCode, interests } = req.body;
      
      if (!name || !email || !phone || !password) {
        return res.status(400).json({ error: "Nombre, email, teléfono y contraseña son obligatorios" });
      }

      const existingUser = await storage.getUserByEmail(email.toLowerCase());
      if (existingUser) {
        return res.status(409).json({ error: "Este email ya está registrado. Intenta iniciar sesión." });
      }

      let referredBy: string | undefined;
      if (referralCode) {
        const referrer = await storage.getUserByReferralCode(referralCode);
        if (referrer) {
          referredBy = referralCode;
        }
      }

      const user = await storage.createUser({
        name,
        email: email.toLowerCase(),
        phone,
        country: country || "México",
        password: hashPassword(password),
        interests: interests || [],
        referredBy: referredBy,
        status: "lead",
        source: referredBy ? "referral" : "web",
      });

      const code = await storage.generateReferralCode(user.id);
      const updatedUser = await storage.getUserById(user.id);

      const { password: _, ...safeUser } = updatedUser!;
      res.status(201).json(safeUser);
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  });

  // Login user
  app.post("/api/users/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son obligatorios" });
      }

      const user = await storage.getUserByEmail(email.toLowerCase());
      if (!user || user.password !== hashPassword(password)) {
        return res.status(401).json({ error: "Email o contraseña incorrectos" });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLogin: new Date() } as any);

      // Return user without password
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  });

  // Update user interests
  app.put("/api/users/:id/interests", async (req, res) => {
    try {
      const { interests, primaryInterest } = req.body;
      
      if (!interests || !Array.isArray(interests)) {
        return res.status(400).json({ error: "Intereses son obligatorios" });
      }

      const user = await storage.updateUserInterests(req.params.id, interests, primaryInterest);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Send confirmation email after interests are set
      try {
        await sendUserRegistrationEmail(user.email, user.name, interests);
      } catch (emailError) {
        console.error("Error sending registration email:", emailError);
        // Don't fail the request if email fails
      }

      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating interests:", error);
      res.status(500).json({ error: "Error al actualizar intereses" });
    }
  });

  // Get all users (CRM - protected by creator password)
  app.get("/api/users", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== 'lumamijuvisado') {
        return res.status(401).json({ error: "No autorizado" });
      }

      const users = await storage.getUsers();
      // Remove passwords from response
      const safeUsers = users.map(u => {
        const { password: _, ...safe } = u;
        return safe;
      });
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  });

  // Update user status (CRM)
  app.put("/api/users/:id/status", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== 'lumamijuvisado') {
        return res.status(401).json({ error: "No autorizado" });
      }

      const { status } = req.body;
      const user = await storage.updateUserStatus(req.params.id, status);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({ error: "Error al actualizar estatus" });
    }
  });

  // Update user profile (requires auth - user can only update their own profile)
  app.put("/api/users/:id/profile", async (req, res) => {
    try {
      const authUserId = req.headers['x-user-id'];
      
      if (!authUserId || authUserId !== req.params.id) {
        return res.status(401).json({ error: "No autorizado - solo puedes editar tu propio perfil" });
      }

      const { name, phone, country } = req.body;
      
      if (!name || !phone || !country) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }

      const user = await storage.updateUserProfile(req.params.id, { name, phone, country });
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Error al actualizar perfil" });
    }
  });

  // Update user notes (CRM)
  app.put("/api/users/:id/notes", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== 'lumamijuvisado') {
        return res.status(401).json({ error: "No autorizado" });
      }

      const { notes } = req.body;
      const user = await storage.updateUserNotes(req.params.id, notes);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating notes:", error);
      res.status(500).json({ error: "Error al actualizar notas" });
    }
  });

  // Get users by interest (CRM)
  app.get("/api/users/interest/:interest", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== 'lumamijuvisado') {
        return res.status(401).json({ error: "No autorizado" });
      }

      const users = await storage.getUsersByInterest(req.params.interest);
      const safeUsers = users.map(u => {
        const { password: _, ...safe } = u;
        return safe;
      });
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users by interest:", error);
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  });

  // Send campaign email to users
  app.post("/api/campaigns/send", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== 'lumamijuvisado') {
        return res.status(401).json({ error: "No autorizado" });
      }

      const { subject, content, ctaText, ctaUrl, filterInterest, userIds } = req.body;

      if (!subject || !content) {
        return res.status(400).json({ error: "Asunto y contenido son obligatorios" });
      }

      let targetUsers: any[];

      if (userIds && userIds.length > 0) {
        const allUsers = await storage.getUsers();
        targetUsers = allUsers.filter(u => userIds.includes(u.id));
      } else if (filterInterest) {
        targetUsers = await storage.getUsersByInterest(filterInterest);
      } else {
        targetUsers = await storage.getUsers();
      }

      let sent = 0;
      let failed = 0;

      for (const user of targetUsers) {
        try {
          const result = await sendCampaignEmail(user.email, subject, content, ctaText, ctaUrl);
          if (result.success) {
            sent++;
          } else {
            failed++;
          }
        } catch (e) {
          failed++;
        }
      }

      res.json({ 
        success: true, 
        sent, 
        failed, 
        total: targetUsers.length,
        message: `Correos enviados: ${sent}/${targetUsers.length}`
      });
    } catch (error) {
      console.error("Error sending campaign:", error);
      res.status(500).json({ error: "Error al enviar campaña" });
    }
  });

  // ========== REFERRAL SYSTEM ==========

  // Get referral info by code (public - for landing page)
  app.get("/api/referral/:code", async (req, res) => {
    try {
      const user = await storage.getUserByReferralCode(req.params.code);
      if (!user) {
        return res.status(404).json({ error: "Código de referido no encontrado" });
      }
      res.json({ name: user.name, code: user.referralCode });
    } catch (error) {
      console.error("Error fetching referral:", error);
      res.status(500).json({ error: "Error al obtener referido" });
    }
  });

  // Get user's referral dashboard data
  app.get("/api/users/:id/referral-dashboard", async (req, res) => {
    try {
      const user = await storage.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (!user.referralCode) {
        await storage.generateReferralCode(user.id);
      }

      const updatedUser = await storage.getUserById(user.id);
      const stats = await storage.getReferralStats(user.id);
      const network = await storage.getReferralNetwork(user.id, 5);
      const commissions = await storage.getCommissions(user.id);

      const networkData = network.map(level => ({
        level: level.level,
        count: level.users.length,
        users: level.users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          interests: u.interests,
          createdAt: u.createdAt,
          referralCode: u.referralCode,
        }))
      }));

      const commissionLevels = [
        { level: 1, percentage: 1.2, label: "Nivel 1 - Directos" },
        { level: 2, percentage: 0.8, label: "Nivel 2" },
        { level: 3, percentage: 0.8, label: "Nivel 3" },
        { level: 4, percentage: 0.6, label: "Nivel 4" },
        { level: 5, percentage: 0.6, label: "Nivel 5" },
      ];

      const totalCommission = commissions.reduce((sum, c) => sum + parseFloat(c.amount), 0);

      const { password: _, ...safeUser } = updatedUser!;
      res.json({
        user: safeUser,
        referralCode: updatedUser!.referralCode,
        referralLink: `https://allliving.org/ref/${updatedUser!.referralCode}`,
        stats,
        network: networkData,
        commissions,
        totalCommission,
        commissionStructure: commissionLevels,
      });
    } catch (error) {
      console.error("Error fetching referral dashboard:", error);
      res.status(500).json({ error: "Error al obtener dashboard de referidos" });
    }
  });

  // Generate referral code for existing user
  app.post("/api/users/:id/generate-referral", async (req, res) => {
    try {
      const code = await storage.generateReferralCode(req.params.id);
      res.json({ referralCode: code, referralLink: `https://allliving.org/ref/${code}` });
    } catch (error) {
      console.error("Error generating referral code:", error);
      res.status(500).json({ error: "Error al generar código de referido" });
    }
  });

  return httpServer;
}
