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
  governorates: z.array(z.string()).optional(),
});

export type QuestionnaireData = z.infer<typeof questionnaireSchema>;

export const governorates = [
  { id: "muscat", nameAr: "محافظة مسقط", nameEn: "Muscat" },
  { id: "dhofar", nameAr: "محافظة ظفار", nameEn: "Dhofar" },
  { id: "dakhiliyah", nameAr: "محافظة الداخلية", nameEn: "Ad Dakhiliyah" },
  { id: "north_batinah", nameAr: "محافظة شمال الباطنة", nameEn: "North Al Batinah" },
  { id: "south_batinah", nameAr: "محافظة جنوب الباطنة", nameEn: "South Al Batinah" },
  { id: "musandam", nameAr: "محافظة مسندم", nameEn: "Musandam" },
  { id: "buraimi", nameAr: "محافظة البريمي", nameEn: "Al Buraimi" },
  { id: "wusta", nameAr: "محافظة الوسطى", nameEn: "Al Wusta" },
  { id: "north_sharqiyah", nameAr: "محافظة شمال الشرقية", nameEn: "North Ash Sharqiyah" },
  { id: "south_sharqiyah", nameAr: "محافظة جنوب الشرقية", nameEn: "South Ash Sharqiyah" },
  { id: "dhahirah", nameAr: "محافظة الظاهرة", nameEn: "Ad Dhahirah" },
];

export interface ItineraryActivity {
  time: string;
  activity: string;
  location: string;
  type: "attraction" | "restaurant" | "hotel" | "transport";
  image?: string;
  description?: string;
  rating?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: ItineraryActivity[];
}

export interface Itinerary {
  id: string;
  title: string;
  duration: number;
  budget: string;
  governorates: string[];
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
  governorate: string;
  governorateId: string;
  wilayat: string;
  category: string;
  image: string;
  mapUrl: string | null;
  rating: string;
  lat?: number;
  lng?: number;
}

export interface RoomOption {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  amenities: string[];
}

export interface HotelReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface RestaurantReview {
  id: string;
  restaurantId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export const insertRestaurantReviewSchema = z.object({
  restaurantId: z.string(),
  userName: z.string().min(2),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5),
});

export type InsertRestaurantReview = z.infer<typeof insertRestaurantReviewSchema>;

export interface Hotel {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  city: string;
  region: string;
  image: string;
  gallery: string[];
  amenities: string[];
  rating: number;
  pricePerNight: number;
  stars: number;
  phone: string;
  mapUrl?: string;
  roomOptions?: RoomOption[];
  reviews?: HotelReview[];
}

export interface Restaurant {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  city: string;
  region: string;
  image: string;
  cuisine: string;
  priceRange: "budget" | "moderate" | "expensive" | "luxury";
  rating: number;
  features: string[];
  mapUrl?: string;
}

export interface Taxi {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  city: string;
  region: string;
  image: string;
  vehicleType: string;
  pricePerKm: number;
  rating: number;
  features: string[];
  phone: string;
  destinations?: string[];
}

export interface HikingTrip {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  location: string;
  region: string;
  image: string;
  gallery: string[];
  difficulty: "easy" | "moderate" | "hard" | "expert";
  duration: string;
  distance: string;
  price: number;
  includes: string[];
  rating: number;
  phone: string;
}
