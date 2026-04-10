import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export auth models (Replit Auth)
export * from "./models/auth";

// Categories for dynamic navigation
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  image: text("image"),
  description: text("description"),
  position: integer("position").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Properties - fractional real estate
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  location: text("location").notNull(),
  country: text("country").default("México"),
  description: text("description").notNull(),
  images: jsonb("images").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  videos: jsonb("videos").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  conditions: jsonb("conditions").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  amenities: jsonb("amenities").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  highlights: jsonb("highlights").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  blockedWeeks: jsonb("blocked_weeks").$type<number[]>().notNull().default(sql`'[]'::jsonb`),
  creatorBlockedWeeks: jsonb("creator_blocked_weeks").$type<number[]>().notNull().default(sql`'[]'::jsonb`),
  price: integer("price").default(650000),
  pricePerNight: integer("price_per_night").default(500),
  priceHighSeason: integer("price_high_season"),
  priceMidSeason: integer("price_mid_season"),
  priceLowSeason: integer("price_low_season"),
  currency: text("currency").default("USD"),
  fractionPrice: integer("fraction_price").default(65000),
  totalFractions: integer("total_fractions").default(8),
  availableFractions: integer("available_fractions").default(8),
  weeksPerFraction: integer("weeks_per_fraction").default(3),
  videoUrl: text("video_url"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  mapUrl: text("map_url"),
  virtualTourUrl: text("virtual_tour_url"),
  bedrooms: integer("bedrooms").default(3),
  bathrooms: integer("bathrooms").default(2),
  maxGuests: integer("max_guests").default(6),
  sqMeters: integer("sq_meters").default(150),
  yearBuilt: integer("year_built"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("4.8"),
  reviewCount: integer("review_count").default(0),
  viewCount: integer("view_count").default(0),
  tag: text("tag"),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  propertyType: text("property_type").default("apartment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Experiences - activities and tours
export const experiences = pgTable("experiences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  location: text("location").notNull(),
  description: text("description").notNull(),
  images: jsonb("images").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  price: integer("price").notNull(),
  duration: text("duration").notNull(),
  category: text("category").default("adventure"),
  maxParticipants: integer("max_participants").default(10),
  includes: jsonb("includes").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("4.9"),
  reviewCount: integer("review_count").default(0),
  hostName: text("host_name"),
  hostImage: text("host_image"),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Services - additional services
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  price: integer("price"),
  priceType: text("price_type").default("fixed"),
  category: text("category").default("concierge"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Pre-bookings for properties
export const preBookings = pgTable("pre_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id, { onDelete: 'cascade' }),
  email: text("email").notNull(),
  name: text("name"),
  phone: text("phone"),
  selectedWeeks: jsonb("selected_weeks").$type<number[]>().notNull(),
  bookingType: text("booking_type").default("fraction"),
  status: text("status").default("pending"),
  totalPrice: integer("total_price"),
  notes: text("notes"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Experience bookings
export const experienceBookings = pgTable("experience_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  experienceId: varchar("experience_id").notNull().references(() => experiences.id, { onDelete: 'cascade' }),
  email: text("email").notNull(),
  name: text("name"),
  phone: text("phone"),
  date: timestamp("date").notNull(),
  participants: integer("participants").default(1),
  status: text("status").default("pending"),
  totalPrice: integer("total_price"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").references(() => properties.id, { onDelete: 'cascade' }),
  experienceId: varchar("experience_id").references(() => experiences.id, { onDelete: 'cascade' }),
  userName: text("user_name").notNull(),
  userImage: text("user_image"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Announcements
export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("news"),
  image: text("image"),
  link: text("link"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscribers
export const subscribers = pgTable("subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  source: text("source").default("website"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Navigation buttons (dynamic)
export const navButtons = pgTable("nav_buttons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  position: integer("position").notNull(),
  type: text("type").notNull().default("main"),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  link: text("link").notNull(),
  image: text("image"),
  icon: text("icon"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Site settings
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true });
export const insertPropertySchema = createInsertSchema(properties).omit({ id: true, createdAt: true });
export const insertExperienceSchema = createInsertSchema(experiences).omit({ id: true, createdAt: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true });
export const insertPreBookingSchema = createInsertSchema(preBookings).omit({ id: true, createdAt: true });
export const insertExperienceBookingSchema = createInsertSchema(experienceBookings).omit({ id: true, createdAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true });
export const insertSubscriberSchema = createInsertSchema(subscribers).omit({ id: true, createdAt: true });
export const insertNavButtonSchema = createInsertSchema(navButtons).omit({ id: true, createdAt: true });
export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({ id: true, updatedAt: true });

// Types
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertPreBooking = z.infer<typeof insertPreBookingSchema>;
export type PreBooking = typeof preBookings.$inferSelect;
export type InsertExperienceBooking = z.infer<typeof insertExperienceBookingSchema>;
export type ExperienceBooking = typeof experienceBookings.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertNavButton = z.infer<typeof insertNavButtonSchema>;
export type NavButton = typeof navButtons.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

// Real Estate Listings - traditional real estate properties (NOT fractional)
export const realEstateListings = pgTable("real_estate_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  country: text("country").default("México"),
  propertyType: text("property_type").default("casa"),
  price: integer("price").notNull(),
  currency: text("currency").default("USD"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  sqMeters: integer("sq_meters"),
  images: jsonb("images").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  amenities: jsonb("amenities").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  features: jsonb("features").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  yearBuilt: integer("year_built"),
  status: text("status").default("disponible"),
  contactName: text("contact_name"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Credit Applications - mortgage/credit applications
export const creditApplications = pgTable("credit_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  propertyValue: integer("property_value").notNull(),
  downPayment: integer("down_payment").notNull(),
  loanAmount: integer("loan_amount").notNull(),
  termYears: integer("term_years").notNull(),
  monthlyIncome: integer("monthly_income"),
  employmentType: text("employment_type").default("empleado"),
  propertyType: text("property_type").default("casa"),
  notes: text("notes"),
  status: text("status").default("nueva"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas for real estate listings and credit applications
export const insertRealEstateListingSchema = createInsertSchema(realEstateListings).omit({ id: true, createdAt: true });
export const insertCreditApplicationSchema = createInsertSchema(creditApplications).omit({ id: true, createdAt: true });

// Types for real estate listings and credit applications
export type InsertRealEstateListing = z.infer<typeof insertRealEstateListingSchema>;
export type RealEstateListing = typeof realEstateListings.$inferSelect;
export type InsertCreditApplication = z.infer<typeof insertCreditApplicationSchema>;
export type CreditApplication = typeof creditApplications.$inferSelect;

// Multilinks - social media and video links for /links page
export const multilinks = pgTable("multilinks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull().default("link"), // instagram, youtube, facebook, twitter, linkedin, video, link
  position: integer("position").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Leads - registration form submissions
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  name: text("name"),
  phone: text("phone"),
  interest: text("interest").notNull(), // fraccion, vivirla, ganar, broker, lastminute, aportar, vender
  message: text("message"),
  status: text("status").default("nuevo"), // nuevo, contactado, en_proceso, cerrado
  source: text("source").default("web"),
  emailSent: boolean("email_sent").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true, updatedAt: true, emailSent: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export const insertMultilinkSchema = createInsertSchema(multilinks).omit({ id: true, createdAt: true });
export type InsertMultilink = z.infer<typeof insertMultilinkSchema>;
export type Multilink = typeof multilinks.$inferSelect;

// Conversations for Alix AI chat
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Messages in conversations
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Users - registered users for the platform
// Note: password field stores the 4-digit PIN (hashed) for simple authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  country: text("country").notNull().default("México"),
  password: text("password").notNull(),
  interests: jsonb("interests").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  primaryInterest: text("primary_interest"),
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"),
  referralLevel: integer("referral_level").default(0),
  status: text("status").default("lead"),
  source: text("source").default("web"),
  notes: text("notes"),
  emailVerified: boolean("email_verified").default(false),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true, lastLogin: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Referral commissions tracking
export const referralCommissions = pgTable("referral_commissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  level: integer("level").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  transactionType: text("transaction_type").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReferralCommissionSchema = createInsertSchema(referralCommissions).omit({ id: true, createdAt: true });
export type InsertReferralCommission = z.infer<typeof insertReferralCommissionSchema>;
export type ReferralCommission = typeof referralCommissions.$inferSelect;

// API Keys for external integrations (e.g. ALIX)
export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  permissions: jsonb("permissions").$type<string[]>().notNull().default(sql`'["read","write"]'::jsonb`),
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ApiKey = typeof apiKeys.$inferSelect;

// ========== ECOSYSTEM TABLES ==========

export const platforms = pgTable("platforms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull().default("external"),
  baseUrl: text("base_url"),
  allowedOrigins: jsonb("allowed_origins").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  description: text("description"),
  contactEmail: text("contact_email"),
  status: text("status").default("active"),
  lastHeartbeat: timestamp("last_heartbeat"),
  metadata: jsonb("metadata").$type<Record<string, any>>().default(sql`'{}'::jsonb`),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const platformApiKeys = pgTable("platform_api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platformId: varchar("platform_id").notNull().references(() => platforms.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  scopes: jsonb("scopes").$type<string[]>().notNull().default(sql`'["read"]'::jsonb`),
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const webhooks = pgTable("webhooks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platformId: varchar("platform_id").notNull().references(() => platforms.id, { onDelete: 'cascade' }),
  url: text("url").notNull(),
  secret: text("secret").notNull(),
  events: jsonb("events").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  isActive: boolean("is_active").default(true),
  failCount: integer("fail_count").default(0),
  lastDelivery: timestamp("last_delivery"),
  lastStatus: integer("last_status"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ecosystemEvents = pgTable("ecosystem_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  event: text("event").notNull(),
  sourcePlatform: text("source_platform").notNull().default("fractional_living"),
  payload: jsonb("payload").$type<Record<string, any>>().notNull().default(sql`'{}'::jsonb`),
  delivered: boolean("delivered").default(false),
  deliveredTo: jsonb("delivered_to").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlatformSchema = createInsertSchema(platforms).omit({ id: true, createdAt: true, lastHeartbeat: true });
export const insertPlatformApiKeySchema = createInsertSchema(platformApiKeys).omit({ id: true, createdAt: true, lastUsed: true });
export const insertWebhookSchema = createInsertSchema(webhooks).omit({ id: true, createdAt: true, lastDelivery: true, lastStatus: true, failCount: true });
export const insertEcosystemEventSchema = createInsertSchema(ecosystemEvents).omit({ id: true, createdAt: true });

export type Platform = typeof platforms.$inferSelect;
export type InsertPlatform = z.infer<typeof insertPlatformSchema>;
export type PlatformApiKey = typeof platformApiKeys.$inferSelect;
export type InsertPlatformApiKey = z.infer<typeof insertPlatformApiKeySchema>;
export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
export type EcosystemEvent = typeof ecosystemEvents.$inferSelect;
export type InsertEcosystemEvent = z.infer<typeof insertEcosystemEventSchema>;
