import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertPreBookingSchema, insertAnnouncementSchema, insertSubscriberSchema, insertNavButtonSchema, insertCategorySchema, insertLeadSchema } from "@shared/schema";
import { z } from "zod";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { sendLeadConfirmationEmail } from "./resend";

const ALMYRIA_PROPERTIES = [
  { title: 'ALMYRIA Residencia A', subtitle: 'Residencia de 126 m² en Aldea Zama', sqMeters: 126, fractionPrice: 380000, bedrooms: 2, bathrooms: 2 },
  { title: 'ALMYRIA Residencia B', subtitle: 'Residencia de 126 m² vista panorámica', sqMeters: 126, fractionPrice: 380000, bedrooms: 2, bathrooms: 2 },
  { title: 'ALMYRIA Residencia C', subtitle: 'Residencia de 126 m² acabados premium', sqMeters: 126, fractionPrice: 380000, bedrooms: 2, bathrooms: 2 },
  { title: 'ALMYRIA Penthouse', subtitle: 'Penthouse de 127 m² con rooftop privado', sqMeters: 127, fractionPrice: 380000, bedrooms: 2, bathrooms: 2 },
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
  
  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

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

  return httpServer;
}
