import type { Hotel } from "@shared/schema";
import sixSensesImg from "@/assets/six-senses-hotel.png";

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "فندق الحواس الست",
    nameAr: "فندق الحواس الست",
    description: "يعتبر منتجع \"الحواس الست خليج زيغي\" أحد أفخم المنتجعات في الشرق الأوسط. يتميز بتصميمه الذي يشبه القرى العمانية التقليدية مع لمسات من الرفاهية العصرية. يقع بين الجبال الشاهقة وشاطئ رملي خاص ومياه فيروزية. يوفر تجارب فريدة مثل الوصول إلى الفندق عبر الطيران الشراعي، ويضم فللاً خاصة بمسابح مستقلة ومركزاً صحياً (سبا) حائزاً على جوائز عالمية.",
    city: "ولاية دبا",
    region: "محافظة مسندم",
    image: sixSensesImg,
    gallery: [],
    amenities: ["سبا", "مسبح خاص", "شاطئ خاص", "مطاعم", "واي فاي"],
    rating: 5,
    pricePerNight: 500,
    stars: 5,
    phone: "",
    mapUrl: "https://maps.app.goo.gl/4ASSWXq1DQiQcuds6?g_st=ic"
  }
];
