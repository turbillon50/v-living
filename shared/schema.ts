import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
