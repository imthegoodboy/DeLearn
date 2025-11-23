import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  users,
  adCampaigns,
  developerEarnings,
  adInteractions,
  type User,
  type InsertUser,
  type AdCampaign,
  type InsertAdCampaign,
  type DeveloperEarning,
  type InsertDeveloperEarning,
  type AdInteraction,
  type InsertAdInteraction,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  getAdCampaign(id: string): Promise<AdCampaign | undefined>;
  getAdCampaignsByHosterId(hosterId: string): Promise<AdCampaign[]>;
  getAllActiveAdCampaigns(): Promise<AdCampaign[]>;
  createAdCampaign(campaign: InsertAdCampaign): Promise<AdCampaign>;
  updateAdCampaign(id: string, updates: Partial<AdCampaign>): Promise<AdCampaign | undefined>;
  deleteAdCampaign(id: string): Promise<boolean>;

  getDeveloperEarning(developerId: string, adCampaignId: string): Promise<DeveloperEarning | undefined>;
  getDeveloperEarningsByDeveloperId(developerId: string): Promise<DeveloperEarning[]>;
  createDeveloperEarning(earning: InsertDeveloperEarning): Promise<DeveloperEarning>;
  updateDeveloperEarning(id: string, updates: Partial<DeveloperEarning>): Promise<DeveloperEarning | undefined>;

  createAdInteraction(interaction: InsertAdInteraction): Promise<AdInteraction>;
  getAdInteractionsByAdCampaignId(adCampaignId: string): Promise<AdInteraction[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getAdCampaign(id: string): Promise<AdCampaign | undefined> {
    const [campaign] = await db.select().from(adCampaigns).where(eq(adCampaigns.id, id));
    return campaign || undefined;
  }

  async getAdCampaignsByHosterId(hosterId: string): Promise<AdCampaign[]> {
    return await db.select().from(adCampaigns).where(eq(adCampaigns.hosterId, hosterId));
  }

  async getAllActiveAdCampaigns(): Promise<AdCampaign[]> {
    return await db.select().from(adCampaigns).where(eq(adCampaigns.status, 'active'));
  }

  async createAdCampaign(insertCampaign: InsertAdCampaign): Promise<AdCampaign> {
    const [campaign] = await db.insert(adCampaigns).values(insertCampaign).returning();
    return campaign;
  }

  async updateAdCampaign(id: string, updates: Partial<AdCampaign>): Promise<AdCampaign | undefined> {
    const [campaign] = await db
      .update(adCampaigns)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(adCampaigns.id, id))
      .returning();
    return campaign || undefined;
  }

  async deleteAdCampaign(id: string): Promise<boolean> {
    const result = await db.delete(adCampaigns).where(eq(adCampaigns.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getDeveloperEarning(
    developerId: string,
    adCampaignId: string
  ): Promise<DeveloperEarning | undefined> {
    const [earning] = await db
      .select()
      .from(developerEarnings)
      .where(
        and(
          eq(developerEarnings.developerId, developerId),
          eq(developerEarnings.adCampaignId, adCampaignId)
        )
      );
    return earning || undefined;
  }

  async getDeveloperEarningsByDeveloperId(developerId: string): Promise<DeveloperEarning[]> {
    return await db.select().from(developerEarnings).where(eq(developerEarnings.developerId, developerId));
  }

  async createDeveloperEarning(insertEarning: InsertDeveloperEarning): Promise<DeveloperEarning> {
    const [earning] = await db.insert(developerEarnings).values(insertEarning).returning();
    return earning;
  }

  async updateDeveloperEarning(
    id: string,
    updates: Partial<DeveloperEarning>
  ): Promise<DeveloperEarning | undefined> {
    const [earning] = await db.update(developerEarnings).set(updates).where(eq(developerEarnings.id, id)).returning();
    return earning || undefined;
  }

  async createAdInteraction(insertInteraction: InsertAdInteraction): Promise<AdInteraction> {
    const [interaction] = await db.insert(adInteractions).values(insertInteraction).returning();
    return interaction;
  }

  async getAdInteractionsByAdCampaignId(adCampaignId: string): Promise<AdInteraction[]> {
    return await db.select().from(adInteractions).where(eq(adInteractions.adCampaignId, adCampaignId));
  }
}

export const storage = new DatabaseStorage();
