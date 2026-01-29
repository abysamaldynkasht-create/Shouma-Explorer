import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, questionnaireSchema, insertRestaurantReviewSchema, type Itinerary, type ItineraryDay } from "@shared/schema";
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
      const { text, attractionName, location, voice = "alloy" } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const enrichedResponse = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `أنت مرشد سياحي خبير في سلطنة عُمان. مهمتك إنشاء نص صوتي غني ومثير للاهتمام عن المعالم السياحية العُمانية. 
            
قواعد مهمة:
- استخدم اللغة العربية الفصحى البسيطة
- أضف معلومات تاريخية وثقافية مثيرة
- اذكر نصائح للزوار
- اذكر أفضل أوقات الزيارة إن أمكن
- اجعل النص ممتعاً وحماسياً كأنك مرشد سياحي حقيقي
- لا تتجاوز 150 كلمة`
          },
          {
            role: "user",
            content: `أنشئ نصاً صوتياً مرشداً سياحياً عن هذا المكان:
            
الاسم: ${attractionName || "معلم سياحي"}
الموقع: ${location || "عُمان"}
الوصف الأساسي: ${text}

أضف معلومات إضافية مثيرة للاهتمام وتفاصيل تاريخية وثقافية ونصائح للزوار.`
          }
        ],
        max_tokens: 500,
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

function generateItinerary(params: ItineraryParams): Itinerary {
  const { duration, budget, interests, mealPreference, governorates } = params;

  const budgetTitles: Record<string, string> = {
    low: "رحلة اقتصادية مميزة",
    medium: "رحلة متوازنة ومريحة",
    high: "رحلة فاخرة راقية",
    luxury: "رحلة استثنائية فاخرة",
  };

  const attractions = getAttractions(budget, interests);
  const restaurants = getRestaurants(budget, mealPreference);
  const hotels = getHotels(budget);

  const days: ItineraryDay[] = [];

  for (let i = 1; i <= Math.min(duration, 7); i++) {
    const dayAttractions = attractions.slice((i - 1) * 2, i * 2);
    const dayRestaurant = restaurants[(i - 1) % restaurants.length];
    const dayHotel = hotels[(i - 1) % hotels.length];

    const activities = [
      {
        time: "08:00",
        activity: "إفطار في الفندق",
        location: dayHotel,
        type: "hotel" as const,
      },
      {
        time: "10:00",
        activity: dayAttractions[0] || "جولة حرة",
        location: "المنطقة السياحية",
        type: "attraction" as const,
      },
      {
        time: "13:00",
        activity: "غداء",
        location: dayRestaurant,
        type: "restaurant" as const,
      },
      {
        time: "15:00",
        activity: dayAttractions[1] || "استكشاف المنطقة",
        location: "وسط المدينة",
        type: "attraction" as const,
      },
      {
        time: "19:00",
        activity: "عشاء",
        location: restaurants[(i) % restaurants.length],
        type: "restaurant" as const,
      },
      {
        time: "21:00",
        activity: "العودة للفندق",
        location: dayHotel,
        type: "hotel" as const,
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

function getAttractions(budget: string, interests: string[]): string[] {
  const allAttractions = {
    culture: ["زيارة المتحف الوطني", "جولة في القصر التاريخي", "استكشاف الحي القديم", "زيارة المسجد الكبير"],
    nature: ["رحلة إلى الجبال", "جولة في الحديقة الوطنية", "شاطئ البحر", "وادي الزهور"],
    adventure: ["رحلة سفاري", "تسلق الجبال", "الغوص", "التزلج على الرمال"],
    relaxation: ["سبا وعلاجات", "حمام تقليدي", "جلسة يوغا", "تأمل في الطبيعة"],
    shopping: ["السوق التقليدي", "مول التسوق الكبير", "البازار القديم", "شارع التسوق"],
    food: ["جولة الطعام المحلي", "دروس الطبخ", "سوق المأكولات", "تذوق الحلويات"],
  };

  let attractions: string[] = [];
  
  if (interests.length === 0) {
    Object.values(allAttractions).forEach(arr => attractions.push(...arr));
  } else {
    interests.forEach(interest => {
      const key = interest as keyof typeof allAttractions;
      if (allAttractions[key]) {
        attractions.push(...allAttractions[key]);
      }
    });
  }

  if (budget === "luxury" || budget === "high") {
    attractions = attractions.map(a => `${a} (VIP)`);
  }

  return attractions;
}

function getRestaurants(budget: string, mealPreference: string): string[] {
  const restaurants: Record<string, Record<string, string[]>> = {
    local: {
      low: ["مطعم البيت الشعبي", "مطعم الأصالة", "مطعم الحارة"],
      medium: ["مطعم التراث", "مطعم الديوان", "مطعم المجلس"],
      high: ["مطعم النخبة", "مطعم الملوك", "مطعم الأمراء"],
      luxury: ["مطعم القصر الملكي", "مطعم السلطان", "مطعم الدرة"],
    },
    international: {
      low: ["مطعم عالمي", "كافيه انترناشونال", "بيتزا هاوس"],
      medium: ["مطعم فيوجن", "لا تيراسا", "ذا غريل"],
      high: ["مطعم بوليفارد", "لو شاتو", "ذا بالاس"],
      luxury: ["نوبو", "زوما", "بيير غانيير"],
    },
    mixed: {
      low: ["مطعم متنوع", "كافيه الحي", "مطعم الساحة"],
      medium: ["مطعم الواحة", "ذا ميكس", "كافيه بيسترو"],
      high: ["مطعم الجاردن", "ذا لاونج", "سكاي دايننق"],
      luxury: ["أتيليه", "إيليت دايننق", "ذا بينتهاوس"],
    },
  };

  const preference = mealPreference || "mixed";
  const budgetLevel = budget || "medium";

  return restaurants[preference]?.[budgetLevel] || restaurants.mixed.medium;
}

function getHotels(budget: string): string[] {
  const hotels: Record<string, string[]> = {
    low: ["فندق الضيافة", "نزل المسافر", "فندق الراحة"],
    medium: ["فندق النخيل", "فندق الواحة", "فندق الشرق"],
    high: ["فندق الريتز", "فندق الفور سيزونز", "فندق الهيلتون"],
    luxury: ["فندق البرج", "فندق الأرماني", "فندق السبع نجوم"],
  };

  return hotels[budget] || hotels.medium;
}
