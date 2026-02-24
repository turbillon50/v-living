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
  SiteSetting,
  Multilink,
  InsertMultilink,
  ReferralCommission,
  InsertReferralCommission
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
  
  // Users
  getUsers(): Promise<schema.User[]>;
  getUserById(id: string): Promise<schema.User | undefined>;
  getUserByEmail(email: string): Promise<schema.User | undefined>;
  createUser(user: schema.InsertUser): Promise<schema.User>;
  updateUser(id: string, data: Partial<schema.InsertUser>): Promise<schema.User | undefined>;
  updateUserInterests(id: string, interests: string[], primaryInterest?: string): Promise<schema.User | undefined>;
  updateUserStatus(id: string, status: string): Promise<schema.User | undefined>;
  updateUserNotes(id: string, notes: string): Promise<schema.User | undefined>;
  updateUserProfile(id: string, data: { name: string; phone: string; country: string }): Promise<schema.User | undefined>;
  getUsersByStatus(status: string): Promise<schema.User[]>;
  getUsersByInterest(interest: string): Promise<schema.User[]>;
  getUserByReferralCode(code: string): Promise<schema.User | undefined>;
  generateReferralCode(userId: string): Promise<string>;
  getReferralNetwork(userId: string, maxLevel?: number): Promise<{ level: number; users: schema.User[] }[]>;
  getReferralStats(userId: string): Promise<{ totalReferrals: number; networkSize: number; levels: { level: number; count: number }[] }>;
  getCommissions(userId: string): Promise<ReferralCommission[]>;
  createCommission(commission: InsertReferralCommission): Promise<ReferralCommission>;

  // Announcements extended
  updateAnnouncement(id: string, data: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: string): Promise<void>;

  // API Keys
  getApiKeys(): Promise<schema.ApiKey[]>;
  getApiKeyByKey(key: string): Promise<schema.ApiKey | undefined>;
  createApiKey(name: string, key: string): Promise<schema.ApiKey>;
  deactivateApiKey(id: string): Promise<void>;
  updateApiKeyLastUsed(id: string): Promise<void>;

  // Leads
  getLeads(): Promise<schema.Lead[]>;
  updateLead(id: string, data: Partial<schema.InsertLead>): Promise<schema.Lead | undefined>;
  deleteLead(id: string): Promise<void>;

  // Ecosystem - Platforms
  getPlatforms(): Promise<schema.Platform[]>;
  getPlatformById(id: string): Promise<schema.Platform | undefined>;
  getPlatformBySlug(slug: string): Promise<schema.Platform | undefined>;
  createPlatform(platform: schema.InsertPlatform): Promise<schema.Platform>;
  updatePlatform(id: string, data: Partial<schema.InsertPlatform>): Promise<schema.Platform | undefined>;
  deletePlatform(id: string): Promise<void>;
  updatePlatformHeartbeat(id: string, metadata?: Record<string, any>): Promise<void>;

  // Ecosystem - Platform API Keys
  getPlatformApiKeys(platformId: string): Promise<schema.PlatformApiKey[]>;
  getPlatformApiKeyByKey(key: string): Promise<(schema.PlatformApiKey & { platform: schema.Platform }) | undefined>;
  createPlatformApiKey(data: schema.InsertPlatformApiKey): Promise<schema.PlatformApiKey>;
  deactivatePlatformApiKey(id: string): Promise<void>;
  updatePlatformApiKeyLastUsed(id: string): Promise<void>;

  // Ecosystem - Webhooks
  getWebhooks(platformId: string): Promise<schema.Webhook[]>;
  getWebhooksByEvent(event: string): Promise<schema.Webhook[]>;
  createWebhook(data: schema.InsertWebhook): Promise<schema.Webhook>;
  updateWebhook(id: string, data: Partial<schema.InsertWebhook>): Promise<schema.Webhook | undefined>;
  deleteWebhook(id: string): Promise<void>;
  updateWebhookDelivery(id: string, status: number, success: boolean): Promise<void>;

  // Ecosystem - Events
  createEcosystemEvent(data: schema.InsertEcosystemEvent): Promise<schema.EcosystemEvent>;
  updateEcosystemEventDelivery(id: string, deliveredTo: string[]): Promise<void>;
  getRecentEvents(limit?: number): Promise<schema.EcosystemEvent[]>;

  // Real Estate Listings
  getRealEstateListings(): Promise<schema.RealEstateListing[]>;
  getRealEstateListingById(id: string): Promise<schema.RealEstateListing | undefined>;
  getRealEstateListingsByType(propertyType: string): Promise<schema.RealEstateListing[]>;
  createRealEstateListing(listing: schema.InsertRealEstateListing): Promise<schema.RealEstateListing>;
  updateRealEstateListing(id: string, data: Partial<schema.InsertRealEstateListing>): Promise<schema.RealEstateListing | undefined>;
  deleteRealEstateListing(id: string): Promise<void>;

  // Credit Applications
  getCreditApplications(): Promise<schema.CreditApplication[]>;
  createCreditApplication(application: schema.InsertCreditApplication): Promise<schema.CreditApplication>;
  updateCreditApplicationStatus(id: string, status: string): Promise<schema.CreditApplication | undefined>;
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

  // Leads
  async getLeads(): Promise<schema.Lead[]> {
    return db.select().from(schema.leads).orderBy(sql`created_at DESC`);
  }

  async createLead(lead: schema.InsertLead): Promise<schema.Lead> {
    const results = await db.insert(schema.leads).values(lead).returning();
    return results[0];
  }

  async updateLeadStatus(id: string, status: string): Promise<schema.Lead | undefined> {
    const results = await db.update(schema.leads)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.leads.id, id))
      .returning();
    return results[0];
  }

  async markLeadEmailSent(id: string): Promise<void> {
    await db.update(schema.leads)
      .set({ emailSent: true })
      .where(eq(schema.leads.id, id));
  }

  async getLeadsByStatus(status: string): Promise<schema.Lead[]> {
    return db.select().from(schema.leads).where(eq(schema.leads.status, status));
  }

  // Multilinks
  async getMultilinks(): Promise<Multilink[]> {
    return db.select().from(schema.multilinks).orderBy(schema.multilinks.position);
  }

  async createMultilink(data: InsertMultilink): Promise<Multilink> {
    const results = await db.insert(schema.multilinks).values(data).returning();
    return results[0];
  }

  async updateMultilink(id: string, data: Partial<InsertMultilink>): Promise<Multilink | undefined> {
    const results = await db.update(schema.multilinks)
      .set(data)
      .where(eq(schema.multilinks.id, id))
      .returning();
    return results[0];
  }

  async deleteMultilink(id: string): Promise<void> {
    await db.delete(schema.multilinks).where(eq(schema.multilinks.id, id));
  }

  // Users
  async getUsers(): Promise<schema.User[]> {
    return db.select().from(schema.users).orderBy(sql`created_at DESC`);
  }

  async getUserById(id: string): Promise<schema.User | undefined> {
    const results = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return results[0];
  }

  async getUserByEmail(email: string): Promise<schema.User | undefined> {
    const results = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return results[0];
  }

  async createUser(user: schema.InsertUser): Promise<schema.User> {
    const results = await db.insert(schema.users).values(user).returning();
    return results[0];
  }

  async updateUser(id: string, data: Partial<schema.InsertUser>): Promise<schema.User | undefined> {
    const results = await db.update(schema.users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return results[0];
  }

  async updateUserInterests(id: string, interests: string[], primaryInterest?: string): Promise<schema.User | undefined> {
    const results = await db.update(schema.users)
      .set({ interests, primaryInterest, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return results[0];
  }

  async updateUserStatus(id: string, status: string): Promise<schema.User | undefined> {
    const results = await db.update(schema.users)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return results[0];
  }

  async updateUserNotes(id: string, notes: string): Promise<schema.User | undefined> {
    const results = await db.update(schema.users)
      .set({ notes, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return results[0];
  }

  async updateUserProfile(id: string, data: { name: string; phone: string; country: string }): Promise<schema.User | undefined> {
    const results = await db.update(schema.users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return results[0];
  }

  async getUsersByStatus(status: string): Promise<schema.User[]> {
    return db.select().from(schema.users).where(eq(schema.users.status, status));
  }

  async getUsersByInterest(interest: string): Promise<schema.User[]> {
    return db.select().from(schema.users).where(
      sql`${schema.users.interests}::jsonb @> ${JSON.stringify([interest])}::jsonb`
    );
  }

  async getUserByReferralCode(code: string): Promise<schema.User | undefined> {
    const results = await db.select().from(schema.users).where(eq(schema.users.referralCode, code)).limit(1);
    return results[0];
  }

  async generateReferralCode(userId: string): Promise<string> {
    const user = await this.getUserById(userId);
    if (!user) throw new Error("User not found");
    if (user.referralCode) return user.referralCode;

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code: string;
    let exists = true;
    do {
      code = 'FL-';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const existing = await this.getUserByReferralCode(code);
      exists = !!existing;
    } while (exists);

    await db.update(schema.users)
      .set({ referralCode: code, updatedAt: new Date() })
      .where(eq(schema.users.id, userId));

    return code;
  }

  async getReferralNetwork(userId: string, maxLevel: number = 5): Promise<{ level: number; users: schema.User[] }[]> {
    const network: { level: number; users: schema.User[] }[] = [];
    const user = await this.getUserById(userId);
    if (!user || !user.referralCode) return network;

    let currentCodes = [user.referralCode];

    for (let level = 1; level <= maxLevel; level++) {
      if (currentCodes.length === 0) break;
      const levelUsers = await db.select().from(schema.users).where(
        sql`${schema.users.referredBy} IN (${sql.join(currentCodes.map(c => sql`${c}`), sql`, `)})`
      );
      if (levelUsers.length === 0) break;
      network.push({ level, users: levelUsers });
      currentCodes = levelUsers.filter(u => u.referralCode).map(u => u.referralCode!);
    }

    return network;
  }

  async getReferralStats(userId: string): Promise<{ totalReferrals: number; networkSize: number; levels: { level: number; count: number }[] }> {
    const network = await this.getReferralNetwork(userId, 5);
    const levels = network.map(n => ({ level: n.level, count: n.users.length }));
    const networkSize = levels.reduce((sum, l) => sum + l.count, 0);
    const totalReferrals = network.length > 0 ? network[0].users.length : 0;
    return { totalReferrals, networkSize, levels };
  }

  async getCommissions(userId: string): Promise<ReferralCommission[]> {
    return db.select().from(schema.referralCommissions)
      .where(eq(schema.referralCommissions.userId, userId))
      .orderBy(sql`created_at DESC`);
  }

  async createCommission(commission: InsertReferralCommission): Promise<ReferralCommission> {
    const results = await db.insert(schema.referralCommissions).values(commission).returning();
    return results[0];
  }

  // Announcements extended
  async updateAnnouncement(id: string, data: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const results = await db.update(schema.announcements).set(data).where(eq(schema.announcements.id, id)).returning();
    return results[0];
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await db.delete(schema.announcements).where(eq(schema.announcements.id, id));
  }

  // API Keys
  async getApiKeys(): Promise<schema.ApiKey[]> {
    return db.select().from(schema.apiKeys).where(eq(schema.apiKeys.isActive, true));
  }

  async getApiKeyByKey(key: string): Promise<schema.ApiKey | undefined> {
    const results = await db.select().from(schema.apiKeys)
      .where(and(eq(schema.apiKeys.key, key), eq(schema.apiKeys.isActive, true)))
      .limit(1);
    return results[0];
  }

  async createApiKey(name: string, key: string): Promise<schema.ApiKey> {
    const results = await db.insert(schema.apiKeys).values({ name, key }).returning();
    return results[0];
  }

  async deactivateApiKey(id: string): Promise<void> {
    await db.update(schema.apiKeys).set({ isActive: false }).where(eq(schema.apiKeys.id, id));
  }

  async updateApiKeyLastUsed(id: string): Promise<void> {
    await db.update(schema.apiKeys).set({ lastUsed: new Date() }).where(eq(schema.apiKeys.id, id));
  }

  // Leads extended
  async updateLead(id: string, data: Partial<schema.InsertLead>): Promise<schema.Lead | undefined> {
    const results = await db.update(schema.leads).set({ ...data, updatedAt: new Date() }).where(eq(schema.leads.id, id)).returning();
    return results[0];
  }

  async deleteLead(id: string): Promise<void> {
    await db.delete(schema.leads).where(eq(schema.leads.id, id));
  }

  // ========== ECOSYSTEM ==========

  // Platforms
  async getPlatforms(): Promise<schema.Platform[]> {
    return db.select().from(schema.platforms);
  }

  async getPlatformById(id: string): Promise<schema.Platform | undefined> {
    const results = await db.select().from(schema.platforms).where(eq(schema.platforms.id, id)).limit(1);
    return results[0];
  }

  async getPlatformBySlug(slug: string): Promise<schema.Platform | undefined> {
    const results = await db.select().from(schema.platforms).where(eq(schema.platforms.slug, slug)).limit(1);
    return results[0];
  }

  async createPlatform(platform: schema.InsertPlatform): Promise<schema.Platform> {
    const results = await db.insert(schema.platforms).values(platform as any).returning();
    return results[0];
  }

  async updatePlatform(id: string, data: Partial<schema.InsertPlatform>): Promise<schema.Platform | undefined> {
    const results = await db.update(schema.platforms).set(data as any).where(eq(schema.platforms.id, id)).returning();
    return results[0];
  }

  async deletePlatform(id: string): Promise<void> {
    await db.delete(schema.platforms).where(eq(schema.platforms.id, id));
  }

  async updatePlatformHeartbeat(id: string, metadata?: Record<string, any>): Promise<void> {
    const updateData: any = { lastHeartbeat: new Date(), status: 'active' };
    if (metadata) updateData.metadata = metadata;
    await db.update(schema.platforms).set(updateData).where(eq(schema.platforms.id, id));
  }

  // Platform API Keys
  async getPlatformApiKeys(platformId: string): Promise<schema.PlatformApiKey[]> {
    return db.select().from(schema.platformApiKeys).where(eq(schema.platformApiKeys.platformId, platformId));
  }

  async getPlatformApiKeyByKey(key: string): Promise<(schema.PlatformApiKey & { platform: schema.Platform }) | undefined> {
    const results = await db
      .select()
      .from(schema.platformApiKeys)
      .innerJoin(schema.platforms, eq(schema.platformApiKeys.platformId, schema.platforms.id))
      .where(and(eq(schema.platformApiKeys.key, key), eq(schema.platformApiKeys.isActive, true)))
      .limit(1);
    if (!results[0]) return undefined;
    return { ...results[0].platform_api_keys, platform: results[0].platforms };
  }

  async createPlatformApiKey(data: schema.InsertPlatformApiKey): Promise<schema.PlatformApiKey> {
    const results = await db.insert(schema.platformApiKeys).values(data as any).returning();
    return results[0];
  }

  async deactivatePlatformApiKey(id: string): Promise<void> {
    await db.update(schema.platformApiKeys).set({ isActive: false }).where(eq(schema.platformApiKeys.id, id));
  }

  async updatePlatformApiKeyLastUsed(id: string): Promise<void> {
    await db.update(schema.platformApiKeys).set({ lastUsed: new Date() }).where(eq(schema.platformApiKeys.id, id));
  }

  // Webhooks
  async getWebhooks(platformId: string): Promise<schema.Webhook[]> {
    return db.select().from(schema.webhooks).where(eq(schema.webhooks.platformId, platformId));
  }

  async getWebhooksByEvent(event: string): Promise<schema.Webhook[]> {
    return db.select().from(schema.webhooks).where(
      and(
        eq(schema.webhooks.isActive, true),
        sql`${schema.webhooks.events}::jsonb @> ${JSON.stringify([event])}::jsonb`
      )
    );
  }

  async createWebhook(data: schema.InsertWebhook): Promise<schema.Webhook> {
    const results = await db.insert(schema.webhooks).values(data as any).returning();
    return results[0];
  }

  async updateWebhook(id: string, data: Partial<schema.InsertWebhook>): Promise<schema.Webhook | undefined> {
    const results = await db.update(schema.webhooks).set(data as any).where(eq(schema.webhooks.id, id)).returning();
    return results[0];
  }

  async deleteWebhook(id: string): Promise<void> {
    await db.delete(schema.webhooks).where(eq(schema.webhooks.id, id));
  }

  async updateWebhookDelivery(id: string, status: number, success: boolean): Promise<void> {
    if (success) {
      await db.update(schema.webhooks).set({ lastDelivery: new Date(), lastStatus: status, failCount: 0 }).where(eq(schema.webhooks.id, id));
    } else {
      await db.update(schema.webhooks).set({
        lastDelivery: new Date(),
        lastStatus: status,
        failCount: sql`COALESCE(${schema.webhooks.failCount}, 0) + 1`,
      }).where(eq(schema.webhooks.id, id));
    }
  }

  // Ecosystem Events
  async createEcosystemEvent(data: schema.InsertEcosystemEvent): Promise<schema.EcosystemEvent> {
    const results = await db.insert(schema.ecosystemEvents).values(data as any).returning();
    return results[0];
  }

  async updateEcosystemEventDelivery(id: string, deliveredTo: string[]): Promise<void> {
    await db.update(schema.ecosystemEvents)
      .set({ delivered: deliveredTo.length > 0, deliveredTo })
      .where(eq(schema.ecosystemEvents.id, id));
  }

  async getRecentEvents(limit: number = 50): Promise<schema.EcosystemEvent[]> {
    return db.select().from(schema.ecosystemEvents).orderBy(sql`created_at DESC`).limit(limit);
  }

  // Real Estate Listings
  async getRealEstateListings(): Promise<schema.RealEstateListing[]> {
    return db.select().from(schema.realEstateListings).where(eq(schema.realEstateListings.isActive, true));
  }

  async getRealEstateListingById(id: string): Promise<schema.RealEstateListing | undefined> {
    const results = await db.select().from(schema.realEstateListings).where(eq(schema.realEstateListings.id, id)).limit(1);
    return results[0];
  }

  async getRealEstateListingsByType(propertyType: string): Promise<schema.RealEstateListing[]> {
    return db.select().from(schema.realEstateListings).where(
      and(eq(schema.realEstateListings.propertyType, propertyType), eq(schema.realEstateListings.isActive, true))
    );
  }

  async createRealEstateListing(listing: schema.InsertRealEstateListing): Promise<schema.RealEstateListing> {
    const results = await db.insert(schema.realEstateListings).values(listing as any).returning();
    return results[0];
  }

  async updateRealEstateListing(id: string, data: Partial<schema.InsertRealEstateListing>): Promise<schema.RealEstateListing | undefined> {
    const results = await db.update(schema.realEstateListings).set(data as any).where(eq(schema.realEstateListings.id, id)).returning();
    return results[0];
  }

  async deleteRealEstateListing(id: string): Promise<void> {
    await db.delete(schema.realEstateListings).where(eq(schema.realEstateListings.id, id));
  }

  // Credit Applications
  async getCreditApplications(): Promise<schema.CreditApplication[]> {
    return db.select().from(schema.creditApplications).orderBy(sql`created_at DESC`);
  }

  async createCreditApplication(application: schema.InsertCreditApplication): Promise<schema.CreditApplication> {
    const results = await db.insert(schema.creditApplications).values(application as any).returning();
    return results[0];
  }

  async updateCreditApplicationStatus(id: string, status: string): Promise<schema.CreditApplication | undefined> {
    const results = await db.update(schema.creditApplications).set({ status }).where(eq(schema.creditApplications.id, id)).returning();
    return results[0];
  }
}

export const storage = new DatabaseStorage();
