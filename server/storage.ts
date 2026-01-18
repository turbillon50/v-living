import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, and, gte, lt, sql } from "drizzle-orm";
import * as schema from "@shared/schema";
import type { 
  Property, 
  InsertProperty,
  PreBooking,
  InsertPreBooking,
  Announcement,
  InsertAnnouncement,
  Subscriber,
  InsertSubscriber,
  NavButton,
  InsertNavButton,
  Experience,
  InsertExperience,
  Service,
  InsertService,
  Category,
  InsertCategory,
  SiteSetting
} from "@shared/schema";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export interface IStorage {
  // Properties
  getProperties(): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | undefined>;
  getPropertiesByCategory(category: string): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;
  duplicateProperty(id: string): Promise<Property | undefined>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<void>;
  
  // Experiences
  getExperiences(): Promise<Experience[]>;
  getExperienceById(id: string): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: string): Promise<void>;
  
  // Services
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  deleteService(id: string): Promise<void>;
  
  // Pre-bookings
  createPreBooking(preBooking: InsertPreBooking): Promise<PreBooking>;
  getAllPreBookings(): Promise<PreBooking[]>;
  getActivePreBookings(propertyId: string): Promise<PreBooking[]>;
  getPreBookingsByEmail(email: string): Promise<PreBooking[]>;
  cleanExpiredBookings(): Promise<void>;

  // Announcements
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;

  // Subscribers
  getSubscribers(): Promise<Subscriber[]>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;

  // Nav Buttons
  getNavButtons(): Promise<NavButton[]>;
  getNavButtonsByType(type: string): Promise<NavButton[]>;
  createNavButton(button: InsertNavButton): Promise<NavButton>;
  updateNavButton(id: string, button: Partial<InsertNavButton>): Promise<NavButton | undefined>;
  deleteNavButton(id: string): Promise<void>;
  
  // Site Settings (CMS texts)
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  upsertSiteSetting(key: string, value: string): Promise<SiteSetting>;
  deleteSiteSetting(key: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Properties
  async getProperties(): Promise<Property[]> {
    return db.select().from(schema.properties);
  }

  async getPropertyById(id: string): Promise<Property | undefined> {
    const results = await db
      .select()
      .from(schema.properties)
      .where(eq(schema.properties.id, id))
      .limit(1);
    return results[0];
  }

  async getPropertiesByCategory(category: string): Promise<Property[]> {
    return db
      .select()
      .from(schema.properties)
      .where(eq(schema.properties.category, category));
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const results = await db
      .insert(schema.properties)
      .values(property as any)
      .returning();
    return results[0];
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const results = await db
      .update(schema.properties)
      .set(property as any)
      .where(eq(schema.properties.id, id))
      .returning();
    return results[0];
  }

  async deleteProperty(id: string): Promise<void> {
    await db.delete(schema.properties).where(eq(schema.properties.id, id));
  }

  async incrementViewCount(id: string): Promise<void> {
    await db
      .update(schema.properties)
      .set({ viewCount: sql`COALESCE(${schema.properties.viewCount}, 0) + 1` })
      .where(eq(schema.properties.id, id));
  }

  async duplicateProperty(id: string): Promise<Property | undefined> {
    const original = await this.getPropertyById(id);
    if (!original) return undefined;
    
    const { id: _, createdAt, ...propertyData } = original;
    const duplicated = await this.createProperty({
      ...propertyData,
      title: `${original.title} (Copia)`,
      viewCount: 0,
    } as InsertProperty);
    return duplicated;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return db.select().from(schema.categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const results = await db.insert(schema.categories).values(category as any).returning();
    return results[0];
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const results = await db.update(schema.categories).set(category as any).where(eq(schema.categories.id, id)).returning();
    return results[0];
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(schema.categories).where(eq(schema.categories.id, id));
  }

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    return db.select().from(schema.experiences);
  }

  async getExperienceById(id: string): Promise<Experience | undefined> {
    const results = await db
      .select()
      .from(schema.experiences)
      .where(eq(schema.experiences.id, id))
      .limit(1);
    return results[0];
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const results = await db
      .insert(schema.experiences)
      .values(experience as any)
      .returning();
    return results[0];
  }

  async updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience | undefined> {
    const results = await db
      .update(schema.experiences)
      .set(experience as any)
      .where(eq(schema.experiences.id, id))
      .returning();
    return results[0];
  }

  async deleteExperience(id: string): Promise<void> {
    await db.delete(schema.experiences).where(eq(schema.experiences.id, id));
  }

  // Services
  async getServices(): Promise<Service[]> {
    return db.select().from(schema.services);
  }

  async createService(service: InsertService): Promise<Service> {
    const results = await db
      .insert(schema.services)
      .values(service as any)
      .returning();
    return results[0];
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(schema.services).where(eq(schema.services.id, id));
  }

  // Pre-bookings
  async createPreBooking(preBooking: InsertPreBooking): Promise<PreBooking> {
    const results = await db
      .insert(schema.preBookings)
      .values(preBooking as any)
      .returning();
    return results[0];
  }

  async getActivePreBookings(propertyId: string): Promise<PreBooking[]> {
    return db
      .select()
      .from(schema.preBookings)
      .where(
        and(
          eq(schema.preBookings.propertyId, propertyId),
          gte(schema.preBookings.expiresAt, new Date())
        )
      );
  }

  async getPreBookingsByEmail(email: string): Promise<PreBooking[]> {
    return db
      .select()
      .from(schema.preBookings)
      .where(
        and(
          eq(schema.preBookings.email, email),
          gte(schema.preBookings.expiresAt, new Date())
        )
      );
  }

  async cleanExpiredBookings(): Promise<void> {
    await db
      .delete(schema.preBookings)
      .where(lt(schema.preBookings.expiresAt, new Date()));
  }

  async getAllPreBookings(): Promise<PreBooking[]> {
    return db.select().from(schema.preBookings);
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return db.select().from(schema.announcements);
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const results = await db
      .insert(schema.announcements)
      .values(announcement as any)
      .returning();
    return results[0];
  }

  // Subscribers
  async getSubscribers(): Promise<Subscriber[]> {
    return db.select().from(schema.subscribers);
  }

  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const results = await db
      .insert(schema.subscribers)
      .values(subscriber as any)
      .returning();
    return results[0];
  }

  // Nav Buttons
  async getNavButtons(): Promise<NavButton[]> {
    return db.select().from(schema.navButtons);
  }

  async getNavButtonsByType(type: string): Promise<NavButton[]> {
    return db.select().from(schema.navButtons).where(eq(schema.navButtons.type, type));
  }

  async createNavButton(button: InsertNavButton): Promise<NavButton> {
    const results = await db.insert(schema.navButtons).values(button as any).returning();
    return results[0];
  }

  async updateNavButton(id: string, button: Partial<InsertNavButton>): Promise<NavButton | undefined> {
    const results = await db.update(schema.navButtons).set(button as any).where(eq(schema.navButtons.id, id)).returning();
    return results[0];
  }

  async deleteNavButton(id: string): Promise<void> {
    await db.delete(schema.navButtons).where(eq(schema.navButtons.id, id));
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSetting[]> {
    return db.select().from(schema.siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const results = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, key)).limit(1);
    return results[0];
  }

  async upsertSiteSetting(key: string, value: string): Promise<SiteSetting> {
    const existing = await this.getSiteSetting(key);
    if (existing) {
      const results = await db.update(schema.siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(schema.siteSettings.key, key))
        .returning();
      return results[0];
    } else {
      const results = await db.insert(schema.siteSettings)
        .values({ key, value })
        .returning();
      return results[0];
    }
  }

  async deleteSiteSetting(key: string): Promise<void> {
    await db.delete(schema.siteSettings).where(eq(schema.siteSettings.key, key));
  }
}

export const storage = new DatabaseStorage();
