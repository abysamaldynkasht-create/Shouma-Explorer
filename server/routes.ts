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
      const mealPreference = (req.query.mealPreference as string) || "mixed";
      const governorates = ((req.query.governorates as string) || "").split(",").filter(Boolean);

      const itinerary = generateItinerary({
        duration,
        budget,
        groupSize,
        interests,
        accommodation,
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
  mealPreference: string;
  governorates: string[];
}

interface AppItem {
  id: string;
  name: string;
  location: string;
  category?: string;
  governorateId?: string;
}

const appAttractions: AppItem[] = [
  { id: "1", name: "شاطئ القرم", location: "محافظة مسقط", category: "nature", governorateId: "muscat" },
  { id: "2", name: "سوق مطرح", location: "محافظة مسقط", category: "markets", governorateId: "muscat" },
  { id: "7", name: "قلعة نزوى", location: "محافظة الداخلية", category: "heritage", governorateId: "dakhiliyah" },
  { id: "4", name: "منتزه القرم الطبيعي", location: "محافظة مسقط", category: "nature", governorateId: "muscat" },
  { id: "5", name: "قلعة مطرح", location: "محافظة مسقط", category: "heritage", governorateId: "muscat" },
  { id: "25", name: "شاطئ المغسيل", location: "محافظة ظفار", category: "nature", governorateId: "dhofar" },
  { id: "8", name: "وادي الغول", location: "محافظة الداخلية", category: "nature", governorateId: "dakhiliyah" },
  { id: "6", name: "جبل الأخضر", location: "محافظة الداخلية", category: "nature", governorateId: "dakhiliyah" },
  { id: "43", name: "رمال وهيبة", location: "محافظة شمال الشرقية", category: "entertainment", governorateId: "north_sharqiyah" },
  { id: "9", name: "سوق نزوى التقليدي", location: "محافظة الداخلية", category: "markets", governorateId: "dakhiliyah" },
  { id: "22", name: "شلالات وادي دربات", location: "محافظة ظفار", category: "nature", governorateId: "dhofar" },
  { id: "3", name: "وادي الخوض", location: "محافظة مسقط", category: "wadis", governorateId: "muscat" },
  { id: "34", name: "مسفاة العبريين", location: "محافظة الداخلية", category: "heritage", governorateId: "dakhiliyah" },
  { id: "10", name: "حديقة فلج دارس", location: "محافظة الداخلية", category: "entertainment", governorateId: "dakhiliyah" },
  { id: "14", name: "قلعة صحار", location: "محافظة شمال الباطنة", category: "heritage", governorateId: "north_batinah" },
  { id: "49", name: "خور شم", location: "محافظة مسندم", category: "nature", governorateId: "musandam" },
  { id: "50", name: "قلعة خصب", location: "محافظة مسندم", category: "heritage", governorateId: "musandam" },
  { id: "48", name: "الرحلات البحرية في الخيران", location: "محافظة مسندم", category: "entertainment", governorateId: "musandam" },
  { id: "62", name: "سلك انزالقي خصب", location: "محافظة مسندم", category: "entertainment", governorateId: "musandam" },
  { id: "63", name: "شاطئ بصة", location: "محافظة مسندم", category: "nature", governorateId: "musandam" },
  { id: "64", name: "خور نجد", location: "محافظة مسندم", category: "wadis", governorateId: "musandam" },
  { id: "67", name: "جبل الرحيم", location: "محافظة مسندم", category: "nature", governorateId: "musandam" },
  { id: "66", name: "حصن الكمازرة", location: "محافظة مسندم", category: "heritage", governorateId: "musandam" },
  { id: "61", name: "مركز لولو التجاري", location: "محافظة مسندم", category: "markets", governorateId: "musandam" },
  { id: "65", name: "حديقة خصب العامة", location: "محافظة مسندم", category: "entertainment", governorateId: "musandam" },
];

const appHotels: AppItem[] = [
  { id: "1", name: "فندق الحواس الست", location: "محافظة مسندم", governorateId: "musandam" },
  { id: "2", name: "مخيم ألف ليلة", location: "محافظة شمال الشرقية", governorateId: "north_sharqiyah" },
  { id: "3", name: "فندق شانغريلا مسقط", location: "محافظة مسقط", governorateId: "muscat" },
  { id: "4", name: "منتجع أنتارا الجبل الأخضر", location: "محافظة الداخلية", governorateId: "dakhiliyah" },
  { id: "5", name: "فندق W مسقط", location: "محافظة مسقط", governorateId: "muscat" },
  { id: "6", name: "فندق كمبينسكي الموج", location: "محافظة مسقط", governorateId: "muscat" },
  { id: "7", name: "فندق الفيصل", location: "محافظة ظفار", governorateId: "dhofar" },
  { id: "8", name: "فندق سنتارا صلالة", location: "محافظة ظفار", governorateId: "dhofar" },
];

const appRestaurants: AppItem[] = [
  { id: "1", name: "قهوة البرج", location: "محافظة جنوب الباطنة", governorateId: "south_batinah" },
  { id: "2", name: "لاجونا", location: "محافظة مسقط", governorateId: "muscat" },
  { id: "3", name: "بيت المضغوط", location: "محافظة مسقط", governorateId: "muscat" },
  { id: "4", name: "مطاعم خوان", location: "محافظة مسقط", governorateId: "muscat" },
  { id: "5", name: "بين القصورين", location: "محافظة مسقط", governorateId: "muscat" },
  { id: "6", name: "ذا ريستورانت", location: "محافظة مسقط", governorateId: "muscat" },
  { id: "7", name: "ذكريات", location: "محافظة مسقط", governorateId: "muscat" },
  { id: "8", name: "شواء مسقط", location: "محافظة مسقط", governorateId: "muscat" },
];

function generateItinerary(params: ItineraryParams): Itinerary {
  const { duration, budget, interests, governorates } = params;

  const budgetTitles: Record<string, string> = {
    low: "رحلة اقتصادية مميزة",
    medium: "رحلة متوازنة ومريحة",
    high: "رحلة فاخرة راقية",
    luxury: "رحلة استثنائية فاخرة",
  };

  // Filter attractions by selected governorates
  const filteredAttractions = governorates.length > 0 
    ? appAttractions.filter(a => a.governorateId && governorates.includes(a.governorateId))
    : appAttractions;
  
  // Filter hotels by selected governorates, fallback to nearest available
  const filteredHotels = governorates.length > 0
    ? appHotels.filter(h => h.governorateId && governorates.includes(h.governorateId))
    : appHotels;
  
  // Filter restaurants by selected governorates, fallback to nearest available  
  const filteredRestaurants = governorates.length > 0
    ? appRestaurants.filter(r => r.governorateId && governorates.includes(r.governorateId))
    : appRestaurants;
  
  // Use filtered data or fallback to all if no matches
  const attractions = filteredAttractions.length > 0 ? filteredAttractions : appAttractions;
  const hotels = filteredHotels.length > 0 ? filteredHotels : appHotels;
  const restaurants = filteredRestaurants.length > 0 ? filteredRestaurants : appRestaurants;

  const days: ItineraryDay[] = [];

  for (let i = 1; i <= Math.min(duration, 7); i++) {
    // Get attractions for this day
    const attr1 = attractions[(i * 2 - 2) % attractions.length];
    const attr2 = attractions[(i * 2 - 1) % attractions.length];
    
    // Find hotel in same governorate as first attraction, or use from list
    const dayGovernorate = attr1.governorateId;
    const sameGovHotels = hotels.filter(h => h.governorateId === dayGovernorate);
    const hotel = sameGovHotels.length > 0 
      ? sameGovHotels[(i - 1) % sameGovHotels.length] 
      : hotels[(i - 1) % hotels.length];
    
    // Find restaurants in same governorate as attractions
    const sameGovRestaurants = restaurants.filter(r => r.governorateId === dayGovernorate);
    const restaurant1 = sameGovRestaurants.length > 0 
      ? sameGovRestaurants[(i * 2 - 2) % sameGovRestaurants.length]
      : restaurants[(i * 2 - 2) % restaurants.length];
    const restaurant2 = sameGovRestaurants.length > 1 
      ? sameGovRestaurants[(i * 2 - 1) % sameGovRestaurants.length]
      : (sameGovRestaurants.length > 0 ? sameGovRestaurants[0] : restaurants[(i * 2 - 1) % restaurants.length]);

    const activities = [
      {
        time: "08:00",
        activity: "إفطار في الفندق",
        location: hotel.name,
        type: "hotel" as const,
        itemId: hotel.id,
      },
      {
        time: "10:00",
        activity: `زيارة ${attr1.name}`,
        location: attr1.location,
        type: "attraction" as const,
        itemId: attr1.id,
      },
      {
        time: "13:00",
        activity: "غداء",
        location: restaurant1.name,
        type: "restaurant" as const,
        itemId: restaurant1.id,
      },
      {
        time: "15:00",
        activity: `استكشاف ${attr2.name}`,
        location: attr2.location,
        type: "attraction" as const,
        itemId: attr2.id,
      },
      {
        time: "19:00",
        activity: "عشاء",
        location: restaurant2.name,
        type: "restaurant" as const,
        itemId: restaurant2.id,
      },
      {
        time: "21:00",
        activity: "العودة للفندق",
        location: hotel.name,
        type: "hotel" as const,
        itemId: hotel.id,
      },
    ];

    const dayTitles = [
      "الوصول والاستكشاف",
      "يوم المعالم التاريخية",
      "مغامرة في الطبيعة",
      "التسوق والترفيه",
      "الثقافة والفنون",
      "الاسترخاء والتجديد",
      "الوداع والمغادرة",
    ];

    days.push({
      day: i,
      title: dayTitles[(i - 1) % dayTitles.length],
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
