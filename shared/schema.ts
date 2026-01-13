import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const questionnaireSchema = z.object({
  duration: z.number().min(1).max(30),
  budget: z.enum(["low", "medium", "high", "luxury"]),
  interests: z.array(z.string()),
  groupSize: z.number().min(1).max(20),
  preferredActivities: z.array(z.string()),
  accommodation: z.enum(["hotel", "resort", "apartment", "hostel"]),
  mealPreference: z.enum(["local", "international", "mixed"]),
});

export type QuestionnaireData = z.infer<typeof questionnaireSchema>;

export interface ItineraryDay {
  day: number;
  title: string;
  activities: {
    time: string;
    activity: string;
    location: string;
    type: "attraction" | "restaurant" | "hotel" | "transport";
  }[];
}

export interface Itinerary {
  id: string;
  title: string;
  duration: number;
  budget: string;
  days: ItineraryDay[];
}

export interface Category {
  id: string;
  title: string;
  titleAr: string;
  icon: string;
  description: string;
  color: string;
}

export interface Attraction {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  city: string;
  region: string;
  image: string;
  gallery: string[];
  tags: string[];
  rating: number;
  priceTier: "free" | "low" | "medium" | "high";
}
