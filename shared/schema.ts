import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  role: text("role").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  website: text("website"),
  businessName: text("business_name"),
  categories: text("categories").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adCampaigns = pgTable("ad_campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hosterId: varchar("hoster_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  htmlSnippet: text("html_snippet"),
  category: text("category").notNull(),
  targetUrl: text("target_url"),
  budget: real("budget").notNull(),
  spent: real("spent").default(0).notNull(),
  costPerClick: real("cost_per_click"),
  costPerImpression: real("cost_per_impression"),
  pricingModel: text("pricing_model").notNull(),
  status: text("status").notNull().default("active"),
  impressions: integer("impressions").default(0).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const developerEarnings = pgTable("developer_earnings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  developerId: varchar("developer_id").notNull().references(() => users.id),
  adCampaignId: varchar("ad_campaign_id").notNull().references(() => adCampaigns.id),
  totalEarned: real("total_earned").default(0).notNull(),
  impressions: integer("impressions").default(0).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  lastPayout: timestamp("last_payout"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adInteractions = pgTable("ad_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adCampaignId: varchar("ad_campaign_id").notNull().references(() => adCampaigns.id),
  developerId: varchar("developer_id").references(() => users.id),
  interactionType: text("interaction_type").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAdCampaignSchema = createInsertSchema(adCampaigns).omit({
  id: true,
  spent: true,
  impressions: true,
  clicks: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const insertDeveloperEarningSchema = createInsertSchema(developerEarnings).omit({
  id: true,
  totalEarned: true,
  impressions: true,
  clicks: true,
  lastPayout: true,
  createdAt: true,
});

export const insertAdInteractionSchema = createInsertSchema(adInteractions).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAdCampaign = z.infer<typeof insertAdCampaignSchema>;
export type AdCampaign = typeof adCampaigns.$inferSelect;

export type InsertDeveloperEarning = z.infer<typeof insertDeveloperEarningSchema>;
export type DeveloperEarning = typeof developerEarnings.$inferSelect;

export type InsertAdInteraction = z.infer<typeof insertAdInteractionSchema>;
export type AdInteraction = typeof adInteractions.$inferSelect;

export type UserRole = "hoster" | "developer";
export type AdStatus = "active" | "paused" | "stopped" | "completed";
export type PricingModel = "cpc" | "cpm";
export type AdCategory = "Tech" | "AI" | "Crypto" | "Gaming" | "Finance" | "Education" | "Health" | "Entertainment";
