import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, and, gte, lt } from "drizzle-orm";
import * as schema from "@shared/schema";
import type { 
  Property, 
  InsertProperty,
  PreBooking,
  InsertPreBooking,
  Announcement,
  InsertAnnouncement,
  Subscriber,
  InsertSubscriber
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
      .values([property])
      .returning();
    return results[0];
  }

  // Pre-bookings
  async createPreBooking(preBooking: InsertPreBooking): Promise<PreBooking> {
    const results = await db
      .insert(schema.preBookings)
      .values([preBooking])
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
      .values([announcement])
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
      .values([subscriber])
      .returning();
    return results[0];
  }
}

export const storage = new DatabaseStorage();
