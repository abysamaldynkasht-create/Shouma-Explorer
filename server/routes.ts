import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, questionnaireSchema, insertRestaurantReviewSchema, insertGroupTripRequestSchema, type Itinerary, type ItineraryDay } from "@shared/schema";
import { z } from "zod";
import { textToSpeechStream } from "./replit_integrations/audio/client";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "بيانات غير صالحة" });
      }

      const existingUser = await storage.getUserByUsername(result.data.username);
      if (existingUser) {
        return res.status(409).json({ message: "اسم المستخدم موجود بالفعل" });
      }

      const user = await storage.createUser(result.data);
      return res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "حدث خطأ في الخادم" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "بيانات غير صالحة" });
      }

      const user = await storage.getUserByUsername(result.data.username);
      if (!user) {
        return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }

      if (user.password !== result.data.password) {
        return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }

      return res.json({ id: user.id, username: user.username });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "حدث خطأ في الخادم" });
    }
  });

  app.get("/api/restaurants/:id/reviews", async (req, res) => {
    try {
      const { id } = req.params;
      const reviews = await storage.getRestaurantReviews(id);
      return res.json(reviews);
    } catch (error) {
      console.error("Get reviews error:", error);
      return res.status(500).json({ message: "حدث خطأ في جلب التقييمات" });
    }
  });

  app.post("/api/restaurants/:id/reviews", async (req, res) => {
    try {
      const { id } = req.params;
      const result = insertRestaurantReviewSchema.safeParse({
        ...req.body,
        restaurantId: id
      });
      
      if (!result.success) {
        return res.status(400).json({ message: "بيانات غير صالحة", errors: result.error.errors });
      }

      const review = await storage.createRestaurantReview(result.data);
      return res.status(201).json(review);
    } catch (error) {
      console.error("Create review error:", error);
      return res.status(500).json({ message: "حدث خطأ في إضافة التقييم" });
    }
  });

  app.post("/api/voice-guide", async (req, res) => {
    try {
      const { text, attractionName, location, voice = "alloy", language = "ar" } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const isArabic = language === "ar" || language === "fa";
      
      const systemPrompt = isArabic 
        ? `أنت مرشد سياحي خبير في سلطنة عُمان. مهمتك إنشاء نص صوتي غني ومثير للاهتمام عن المعالم السياحية العُمانية. 
            
قواعد مهمة:
- استخدم اللغة العربية الفصحى البسيطة
- أضف معلومات تاريخية وثقافية مثيرة
- اذكر نصائح للزوار
- اذكر أفضل أوقات الزيارة إن أمكن
- اجعل النص ممتعاً وحماسياً كأنك مرشد سياحي حقيقي
- لا تتجاوز 150 كلمة`
        : `You are an expert tour guide specializing in the Sultanate of Oman. Your task is to create rich, engaging audio narration about Omani tourist attractions.

Important rules:
- Use clear, simple English
- Add interesting historical and cultural information
- Provide tips for visitors
- Mention the best times to visit if applicable
- Make the text engaging and enthusiastic like a real tour guide
- Keep it under 150 words`;

      const userPrompt = isArabic
        ? `أنشئ نصاً صوتياً مرشداً سياحياً عن هذا المكان:
            
الاسم: ${attractionName || "معلم سياحي"}
الموقع: ${location || "عُمان"}
الوصف الأساسي: ${text}

أضف معلومات إضافية مثيرة للاهتمام وتفاصيل تاريخية وثقافية ونصائح للزوار.`
        : `Create an audio tour guide script about this place:
            
Name: ${attractionName || "Tourist Attraction"}
Location: ${location || "Oman"}
Basic description: ${text}

Add interesting additional information, historical and cultural details, and tips for visitors.`;

      const enrichedResponse = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_completion_tokens: 500,
      });

      const enrichedText = enrichedResponse.choices[0]?.message?.content || text;
      
      const stream = await textToSpeechStream(enrichedText, voice);
      
      for await (const audioChunk of stream) {
        res.write(`data: ${JSON.stringify({ type: "audio", data: audioChunk })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Voice guide error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ type: "error", error: "Failed to generate audio" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to generate voice guide" });
      }
    }
  });

  app.get("/api/itinerary", async (req, res) => {
    try {
      const duration = parseInt(req.query.duration as string) || 3;
      const budget = (req.query.budget as string) || "medium";
      const groupSize = parseInt(req.query.groupSize as string) || 2;
      const interests = ((req.query.interests as string) || "").split(",").filter(Boolean);
      const accommodation = (req.query.accommodation as string) || "hotel";
      const hotelPreference = (req.query.hotelPreference as string) || "single";
      const mealPreference = (req.query.mealPreference as string) || "mixed";
      const governorates = ((req.query.governorates as string) || "").split(",").filter(Boolean);

      const itinerary = generateItinerary({
        duration,
        budget,
        groupSize,
        interests,
        accommodation,
        hotelPreference,
        mealPreference,
        governorates,
      });

      return res.json(itinerary);
    } catch (error) {
      console.error("Itinerary error:", error);
      return res.status(500).json({ message: "حدث خطأ في إنشاء الجدول" });
    }
  });

  app.post("/api/group-trips", async (req, res) => {
    try {
      const result = insertGroupTripRequestSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "بيانات غير صالحة", errors: result.error.errors });
      }
      const tripRequest = await storage.createGroupTripRequest(result.data);
      return res.status(201).json(tripRequest);
    } catch (error) {
      console.error("Group trip request error:", error);
      return res.status(500).json({ message: "حدث خطأ في حفظ الطلب" });
    }
  });

  app.get("/api/group-trips", async (_req, res) => {
    try {
      const requests = await storage.getGroupTripRequests();
      return res.json(requests);
    } catch (error) {
      console.error("Get group trips error:", error);
      return res.status(500).json({ message: "حدث خطأ في جلب الطلبات" });
    }
  });

  return httpServer;
}

interface ItineraryParams {
  duration: number;
  budget: string;
  groupSize: number;
  interests: string[];
  accommodation: string;
  hotelPreference: string;
  mealPreference: string;
  governorates: string[];
}

interface GeoItem {
  id: string;
  name: string;
  location: string;
  category?: string;
  governorateId?: string;
  lat: number;
  lng: number;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearest<T extends GeoItem>(target: GeoItem, items: T[], exclude: Set<string>): T | null {
  let best: T | null = null;
  let bestDist = Infinity;
  for (const item of items) {
    if (exclude.has(item.id)) continue;
    const dist = haversineDistance(target.lat, target.lng, item.lat, item.lng);
    if (dist < bestDist) {
      bestDist = dist;
      best = item;
    }
  }
  return best;
}

const appAttractions: GeoItem[] = [
  { id: "1", name: "شاطئ القرم", location: "محافظة مسقط", category: "nature", governorateId: "muscat", lat: 23.6071, lng: 58.4942 },
  { id: "2", name: "سوق مطرح", location: "محافظة مسقط", category: "markets", governorateId: "muscat", lat: 23.6193, lng: 58.5713 },
  { id: "7", name: "قلعة نزوى", location: "محافظة الداخلية", category: "heritage", governorateId: "dakhiliyah", lat: 22.9320, lng: 57.5292 },
  { id: "4", name: "منتزه القرم الطبيعي", location: "محافظة مسقط", category: "nature", governorateId: "muscat", lat: 23.5992, lng: 58.4156 },
  { id: "5", name: "قلعة مطرح", location: "محافظة مسقط", category: "heritage", governorateId: "muscat", lat: 23.6225, lng: 58.5695 },
  { id: "25", name: "شاطئ المغسيل", location: "محافظة ظفار", category: "nature", governorateId: "dhofar", lat: 16.8415, lng: 53.7635 },
  { id: "8", name: "وادي الغول", location: "محافظة الداخلية", category: "nature", governorateId: "dakhiliyah", lat: 23.1250, lng: 57.3500 },
  { id: "6", name: "جبل الأخضر", location: "محافظة الداخلية", category: "nature", governorateId: "dakhiliyah", lat: 23.0742, lng: 57.6517 },
  { id: "43", name: "رمال وهيبة", location: "محافظة شمال الشرقية", category: "entertainment", governorateId: "north_sharqiyah", lat: 22.3500, lng: 58.5000 },
  { id: "9", name: "سوق نزوى التقليدي", location: "محافظة الداخلية", category: "markets", governorateId: "dakhiliyah", lat: 22.9315, lng: 57.5283 },
  { id: "22", name: "شلالات وادي دربات", location: "محافظة ظفار", category: "nature", governorateId: "dhofar", lat: 17.1100, lng: 54.4300 },
  { id: "3", name: "وادي الخوض", location: "محافظة مسقط", category: "wadis", governorateId: "muscat", lat: 23.5451, lng: 58.0872 },
  { id: "34", name: "مسفاة العبريين", location: "محافظة الداخلية", category: "heritage", governorateId: "dakhiliyah", lat: 23.1350, lng: 57.3100 },
  { id: "10", name: "حديقة فلج دارس", location: "محافظة الداخلية", category: "entertainment", governorateId: "dakhiliyah", lat: 22.9251, lng: 57.5350 },
  { id: "14", name: "قلعة صحار", location: "محافظة شمال الباطنة", category: "heritage", governorateId: "north_batinah", lat: 24.3636, lng: 56.7485 },
  { id: "49", name: "خور شم", location: "محافظة مسندم", category: "nature", governorateId: "musandam", lat: 26.1800, lng: 56.2300 },
  { id: "50", name: "قلعة خصب", location: "محافظة مسندم", category: "heritage", governorateId: "musandam", lat: 26.1760, lng: 56.2480 },
  { id: "48", name: "الرحلات البحرية في الخيران", location: "محافظة مسندم", category: "entertainment", governorateId: "musandam", lat: 26.1850, lng: 56.2350 },
  { id: "62", name: "سلك انزالقي خصب", location: "محافظة مسندم", category: "entertainment", governorateId: "musandam", lat: 26.1790, lng: 56.2400 },
  { id: "63", name: "شاطئ بصة", location: "محافظة مسندم", category: "nature", governorateId: "musandam", lat: 26.1650, lng: 56.2500 },
  { id: "64", name: "خور نجد", location: "محافظة مسندم", category: "wadis", governorateId: "musandam", lat: 26.1500, lng: 56.2700 },
  { id: "67", name: "جبل الرحيم", location: "محافظة مسندم", category: "nature", governorateId: "musandam", lat: 26.1400, lng: 56.2200 },
  { id: "66", name: "حصن الكمازرة", location: "محافظة مسندم", category: "heritage", governorateId: "musandam", lat: 26.2000, lng: 56.2600 },
  { id: "61", name: "مركز لولو التجاري", location: "محافظة مسندم", category: "markets", governorateId: "musandam", lat: 26.1770, lng: 56.2470 },
  { id: "65", name: "حديقة خصب العامة", location: "محافظة مسندم", category: "entertainment", governorateId: "musandam", lat: 26.1740, lng: 56.2450 },
];

const appHotels: GeoItem[] = [
  { id: "1", name: "فندق الحواس الست", location: "محافظة مسندم", governorateId: "musandam", lat: 26.1600, lng: 56.2550 },
  { id: "2", name: "مخيم ألف ليلة", location: "محافظة شمال الشرقية", governorateId: "north_sharqiyah", lat: 22.3600, lng: 58.4900 },
  { id: "3", name: "فندق شانغريلا مسقط", location: "محافظة مسقط", governorateId: "muscat", lat: 23.5400, lng: 58.6400 },
  { id: "4", name: "منتجع أنتارا الجبل الأخضر", location: "محافظة الداخلية", governorateId: "dakhiliyah", lat: 23.0750, lng: 57.6600 },
  { id: "5", name: "فندق W مسقط", location: "محافظة مسقط", governorateId: "muscat", lat: 23.6100, lng: 58.4200 },
  { id: "6", name: "فندق كمبينسكي الموج", location: "محافظة مسقط", governorateId: "muscat", lat: 23.6400, lng: 58.2700 },
  { id: "7", name: "فندق الفيصل", location: "محافظة ظفار", governorateId: "dhofar", lat: 17.0178, lng: 54.0825 },
  { id: "8", name: "فندق سنتارا صلالة", location: "محافظة ظفار", governorateId: "dhofar", lat: 16.9990, lng: 54.1200 },
];

const appRestaurants: GeoItem[] = [
  { id: "1", name: "قهوة البرج", location: "محافظة جنوب الباطنة", governorateId: "south_batinah", lat: 23.4850, lng: 57.9500 },
  { id: "2", name: "لاجونا", location: "محافظة مسقط", governorateId: "muscat", lat: 23.5960, lng: 58.4100 },
  { id: "3", name: "بيت المضغوط", location: "محافظة مسقط", governorateId: "muscat", lat: 23.5800, lng: 58.4000 },
  { id: "4", name: "مطاعم خوان", location: "محافظة مسقط", governorateId: "muscat", lat: 23.5950, lng: 58.4500 },
  { id: "5", name: "بين القصورين", location: "محافظة مسقط", governorateId: "muscat", lat: 23.6050, lng: 58.5400 },
  { id: "6", name: "ذا ريستورانت", location: "محافظة مسقط", governorateId: "muscat", lat: 23.5870, lng: 58.4250 },
  { id: "7", name: "ذكريات", location: "محافظة مسقط", governorateId: "muscat", lat: 23.6100, lng: 58.5000 },
  { id: "8", name: "شواء مسقط", location: "محافظة مسقط", governorateId: "muscat", lat: 23.6000, lng: 58.4700 },
  { id: "11", name: "مطعم ومطبخ عين الخليج", location: "محافظة شمال الشرقية", governorateId: "north_sharqiyah", lat: 22.5700, lng: 58.1200 },
  { id: "12", name: "مطعم بن عتيق للمأكولات العمانية", location: "محافظة ظفار", governorateId: "dhofar", lat: 17.0170, lng: 54.0900 },
];

function findNearestWithinRadius<T extends GeoItem>(target: GeoItem, items: T[], exclude: Set<string>, maxDistKm: number): T | null {
  let best: T | null = null;
  let bestDist = Infinity;
  for (const item of items) {
    if (exclude.has(item.id)) continue;
    const dist = haversineDistance(target.lat, target.lng, item.lat, item.lng);
    if (dist <= maxDistKm && dist < bestDist) {
      bestDist = dist;
      best = item;
    }
  }
  return best;
}

function generateItinerary(params: ItineraryParams): Itinerary {
  const { duration, budget, hotelPreference, governorates } = params;
  const singleHotelMode = hotelPreference !== "multiple";

  const budgetTitles: Record<string, string> = {
    low: "رحلة اقتصادية مميزة",
    medium: "رحلة متوازنة ومريحة",
    high: "رحلة فاخرة راقية",
    luxury: "رحلة استثنائية فاخرة",
  };

  const filteredAttractions = governorates.length > 0
    ? appAttractions.filter(a => a.governorateId && governorates.includes(a.governorateId))
    : appAttractions;
  const filteredHotels = governorates.length > 0
    ? appHotels.filter(h => h.governorateId && governorates.includes(h.governorateId))
    : appHotels;
  const filteredRestaurants = governorates.length > 0
    ? appRestaurants.filter(r => r.governorateId && governorates.includes(r.governorateId))
    : appRestaurants;

  const attractions = filteredAttractions.length > 0 ? filteredAttractions : appAttractions;
  const hotels = filteredHotels.length > 0 ? filteredHotels : appHotels;
  const restaurants = filteredRestaurants.length > 0 ? filteredRestaurants : appRestaurants;

  const usedAttractions = new Set<string>();
  const usedRestaurants = new Set<string>();
  const days: ItineraryDay[] = [];
  const numDays = Math.min(duration, 7);

  const govGroups: Record<string, GeoItem[]> = {};
  for (const a of attractions) {
    const gov = a.governorateId || "other";
    if (!govGroups[gov]) govGroups[gov] = [];
    govGroups[gov].push(a);
  }

  const sortedGovs = Object.entries(govGroups)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([gov]) => gov);

  const dayGovAssignments: string[] = [];
  let govIdx = 0;
  for (let i = 0; i < numDays; i++) {
    const gov = sortedGovs[govIdx % sortedGovs.length];
    const available = (govGroups[gov] || []).filter(a => !usedAttractions.has(a.id));
    if (available.length >= 2 || i >= sortedGovs.length) {
      dayGovAssignments.push(gov);
      available.slice(0, 2).forEach(a => usedAttractions.add(a.id));
      govIdx++;
    } else if (available.length === 1) {
      dayGovAssignments.push(gov);
      available.forEach(a => usedAttractions.add(a.id));
      govIdx++;
    } else {
      govIdx++;
      i--;
      if (govIdx > sortedGovs.length * 3) {
        dayGovAssignments.push(sortedGovs[0]);
        break;
      }
    }
  }
  usedAttractions.clear();

  let fixedHotel: GeoItem | null = null;
  if (singleHotelMode) {
    const allDayGovs = new Set(dayGovAssignments);
    const govHotels = hotels.filter(h => h.governorateId && allDayGovs.has(h.governorateId));
    if (govHotels.length > 0) {
      const govCenter: GeoItem = {
        id: "center", name: "", location: "",
        lat: attractions.reduce((s, a) => s + a.lat, 0) / attractions.length,
        lng: attractions.reduce((s, a) => s + a.lng, 0) / attractions.length,
      };
      fixedHotel = findNearest(govCenter, govHotels, new Set());
    }
    if (!fixedHotel) {
      fixedHotel = findNearest(
        { id: "c", name: "", location: "", lat: attractions[0].lat, lng: attractions[0].lng },
        hotels,
        new Set()
      ) || hotels[0];
    }
  }

  const usedHotels = new Set<string>();
  const MAX_CLUSTER_RADIUS = 80;

  for (let i = 0; i < numDays; i++) {
    const dayGov = dayGovAssignments[i] || sortedGovs[i % sortedGovs.length];
    const govAttractions = govGroups[dayGov] || [];

    let anchor = govAttractions.find(a => !usedAttractions.has(a.id));
    if (!anchor) {
      anchor = attractions.find(a => !usedAttractions.has(a.id));
    }
    if (!anchor) {
      usedAttractions.clear();
      anchor = govAttractions[0] || attractions[0];
    }
    usedAttractions.add(anchor.id);

    const attr1 = anchor;
    let attr2 = findNearestWithinRadius(attr1, govAttractions, usedAttractions, MAX_CLUSTER_RADIUS);
    if (!attr2) {
      attr2 = findNearestWithinRadius(attr1, attractions, usedAttractions, MAX_CLUSTER_RADIUS);
    }
    if (!attr2) {
      attr2 = findNearest(attr1, attractions, usedAttractions);
    }
    if (!attr2) {
      attr2 = attractions.find(a => a.id !== attr1.id) || attr1;
    }
    usedAttractions.add(attr2.id);

    const dayCenter: GeoItem = {
      id: "center", name: "", location: "",
      lat: (attr1.lat + attr2.lat) / 2,
      lng: (attr1.lng + attr2.lng) / 2,
    };

    let hotel: GeoItem;
    if (singleHotelMode && fixedHotel) {
      hotel = fixedHotel;
    } else {
      let h = findNearestWithinRadius(dayCenter, hotels, usedHotels, MAX_CLUSTER_RADIUS);
      if (!h) {
        h = findNearestWithinRadius(dayCenter, appHotels, usedHotels, MAX_CLUSTER_RADIUS);
      }
      if (!h) {
        h = findNearest(dayCenter, hotels, usedHotels);
      }
      if (!h) {
        h = findNearest(dayCenter, appHotels, usedHotels);
      }
      if (!h) {
        usedHotels.clear();
        h = findNearest(dayCenter, hotels, new Set()) || hotels[0];
      }
      hotel = h;
      usedHotels.add(hotel.id);
    }

    let restaurant1 = findNearestWithinRadius(attr1, restaurants, usedRestaurants, MAX_CLUSTER_RADIUS);
    if (!restaurant1) {
      restaurant1 = findNearestWithinRadius(attr1, appRestaurants, usedRestaurants, MAX_CLUSTER_RADIUS);
    }
    if (!restaurant1) {
      restaurant1 = findNearest(attr1, restaurants, usedRestaurants);
    }
    if (!restaurant1) {
      usedRestaurants.clear();
      restaurant1 = findNearest(attr1, restaurants, new Set()) || restaurants[0];
    }
    usedRestaurants.add(restaurant1.id);

    let restaurant2 = findNearestWithinRadius(attr2, restaurants, usedRestaurants, MAX_CLUSTER_RADIUS);
    if (!restaurant2) {
      restaurant2 = findNearestWithinRadius(attr2, appRestaurants, usedRestaurants, MAX_CLUSTER_RADIUS);
    }
    if (!restaurant2) {
      restaurant2 = findNearest(attr2, restaurants, usedRestaurants);
    }
    if (!restaurant2) {
      restaurant2 = restaurants.find(r => r.id !== restaurant1.id) || restaurant1;
    }
    if (restaurant2.id !== restaurant1.id) {
      usedRestaurants.add(restaurant2.id);
    }

    const distAttr = haversineDistance(attr1.lat, attr1.lng, attr2.lat, attr2.lng);
    const travelMin = Math.max(15, Math.round(distAttr / 60 * 60));

    const activities = [
      {
        time: "08:00",
        activity: "إفطار في الفندق",
        location: hotel.name,
        type: "hotel" as const,
        itemId: hotel.id,
        description: `${hotel.location}`,
      },
      {
        time: "10:00",
        activity: `زيارة ${attr1.name}`,
        location: attr1.location,
        type: "attraction" as const,
        itemId: attr1.id,
        description: `${Math.round(haversineDistance(hotel.lat, hotel.lng, attr1.lat, attr1.lng))} كم من الفندق`,
      },
      {
        time: "13:00",
        activity: "غداء",
        location: restaurant1.name,
        type: "restaurant" as const,
        itemId: restaurant1.id,
        description: `${Math.round(haversineDistance(attr1.lat, attr1.lng, restaurant1.lat, restaurant1.lng))} كم من ${attr1.name}`,
      },
      {
        time: `${14 + Math.floor(travelMin / 60)}:${String(travelMin % 60).padStart(2, '0')}`,
        activity: `استكشاف ${attr2.name}`,
        location: attr2.location,
        type: "attraction" as const,
        itemId: attr2.id,
        description: `${Math.round(distAttr)} كم من ${attr1.name} (~${travelMin} دقيقة)`,
      },
      {
        time: "19:00",
        activity: "عشاء",
        location: restaurant2.name,
        type: "restaurant" as const,
        itemId: restaurant2.id,
        description: `${Math.round(haversineDistance(attr2.lat, attr2.lng, restaurant2.lat, restaurant2.lng))} كم من ${attr2.name}`,
      },
      {
        time: "21:00",
        activity: "العودة للفندق",
        location: hotel.name,
        type: "hotel" as const,
        itemId: hotel.id,
        description: `${Math.round(haversineDistance(attr2.lat, attr2.lng, hotel.lat, hotel.lng))} كم`,
      },
    ];

    const dayTitlesByGov: Record<string, string[]> = {
      muscat: ["استكشاف مسقط", "جمال العاصمة", "يوم في مسقط"],
      dakhiliyah: ["تراث الداخلية", "قلاع ووديان", "يوم في نزوى"],
      dhofar: ["سحر ظفار", "خريف صلالة", "طبيعة ظفار"],
      musandam: ["جمال مسندم", "أفيورد العرب", "بحر مسندم"],
      north_batinah: ["ساحل الباطنة", "تاريخ صحار"],
      north_sharqiyah: ["صحراء الشرقية", "رمال وهيبة"],
    };

    const dayTitlesGeneral = [
      "الوصول والاستكشاف",
      "يوم المعالم التاريخية",
      "مغامرة في الطبيعة",
      "التسوق والترفيه",
      "الثقافة والفنون",
      "الاسترخاء والتجديد",
      "الوداع والمغادرة",
    ];

    const govTitles = dayTitlesByGov[dayGov];
    const dayTitle = govTitles
      ? govTitles[i % govTitles.length]
      : dayTitlesGeneral[i % dayTitlesGeneral.length];

    days.push({
      day: i + 1,
      title: dayTitle,
      activities,
    });
  }

  return {
    id: `itinerary-${Date.now()}`,
    title: budgetTitles[budget] || "رحلتك المخصصة",
    duration,
    budget,
    governorates,
    days,
  };
}
