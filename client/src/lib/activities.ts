import activityCamelRidingImg from "@/assets/activity-camel-riding.png";
import horseRidingSeebImg from "@/assets/horse-riding-seeb.png";

export interface Activity {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  location: string;
  region: string;
  duration: string;
  price: string;
  image: string;
  rating: number;
  includes: string[];
  provider?: string;
  phone?: string;
  mapUrl?: string;
}

export const activities: Activity[] = [
  {
    id: "camel-riding-bidiya",
    name: "Camel Riding in Bidiya Sands",
    nameAr: "ركوب الجمال في رمال بدية",
    description: "Experience the traditional Omani way of desert travel with a memorable camel ride through the stunning Bidiya sand dunes.",
    descriptionAr: "استمتع بتجربة السفر العماني التقليدي في الصحراء مع رحلة لا تُنسى على ظهر الجمال عبر كثبان رمال بدية الخلابة.",
    location: "بدية، محافظة شمال الشرقية",
    region: "محافظة شمال الشرقية",
    duration: "1-2 ساعة",
    price: "15-25 ر.ع",
    image: activityCamelRidingImg,
    rating: 4.8,
    includes: ["ركوب الجمال", "مرشد محلي", "صور تذكارية"],
    mapUrl: "https://maps.app.goo.gl/JQkZ43c6Nvps8wjo9",
  },
  {
    id: "horse-riding-seeb",
    name: "Horse Riding on Seeb Beach",
    nameAr: "ركوب الخيل على شاطئ السيب",
    description: "Enjoy a scenic horseback ride along the beautiful Seeb beach. Perfect for beginners and experienced riders alike.",
    descriptionAr: "استمتع بركوب الخيل على طول شاطئ السيب الجميل. مناسب للمبتدئين والفرسان ذوي الخبرة.",
    location: "السيب، محافظة مسقط",
    region: "محافظة مسقط",
    duration: "1 ساعة",
    price: "10-20 ر.ع",
    image: horseRidingSeebImg,
    rating: 4.7,
    includes: ["ركوب الخيل", "مدرب محترف", "معدات السلامة"],
    phone: "9781 7171",
    mapUrl: "https://maps.app.goo.gl/7PJ69Jbr1Mfu2cn38",
  },
];
