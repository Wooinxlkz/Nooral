import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";

export const devFailedLoginsTable = pgTable("dev_failed_logins", {
  id: serial("id").primaryKey(),
  attemptedName: text("attempted_name"),
  ip: text("ip"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});

export const devActivityLogTable = pgTable("dev_activity_log", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  details: text("details"),
  devName: text("dev_name"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});

export const featureFlagsTable = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  flagName: text("flag_name").notNull().unique(),
  enabled: boolean("enabled").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const announcementsTable = pgTable("announcements", {
  id: serial("id").primaryKey(),
  messageEn: text("message_en"),
  messageAr: text("message_ar"),
  active: boolean("active").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const feedbackTable = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  name: text("name"),
  email: text("email"),
  country: text("country"),
  type: text("type").notNull().default("general"),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  devNote: text("dev_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const broadcastLogTable = pgTable("broadcast_log", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  recipientType: text("recipient_type").notNull(),
  recipientCount: integer("recipient_count").notNull().default(0),
  bodyPreview: text("body_preview"),
  sentBy: text("sent_by"),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

export type DevFailedLogin = typeof devFailedLoginsTable.$inferSelect;
export type DevActivityLog = typeof devActivityLogTable.$inferSelect;
export type FeatureFlag = typeof featureFlagsTable.$inferSelect;
export type Announcement = typeof announcementsTable.$inferSelect;
export type Feedback = typeof feedbackTable.$inferSelect;
export type BroadcastLog = typeof broadcastLogTable.$inferSelect;
