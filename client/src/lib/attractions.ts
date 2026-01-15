import type { Attraction } from "@shared/schema";

import wadiImg1 from "@assets/stock_images/oman_wadi_valley_nat_1af4dc65.jpg";
import nizwaFortImg from "@assets/stock_images/nizwa_fort_oman_hist_ca0d2be9.jpg";
import springImg1 from "@assets/stock_images/oman_natural_spring__a6b99a8c.jpg";
import beachImg1 from "@assets/stock_images/oman_beach_coast_sea_bf5cd867.jpg";

const imageMap: Record<string, string> = {
  "/stock_images/oman_wadi_valley_nat_1af4dc65.jpg": wadiImg1,
  "/stock_images/nizwa_fort_oman_hist_ca0d2be9.jpg": nizwaFortImg,
  "/stock_images/oman_natural_spring__a6b99a8c.jpg": springImg1,
  "/stock_images/oman_beach_coast_sea_bf5cd867.jpg": beachImg1,
};

export function getAttractionImage(imagePath: string): string {
  return imageMap[imagePath] || imagePath;
}

export const governorates = [
  { id: "dakhiliyah", nameAr: "محافظة الداخلية" },
  { id: "wusta", nameAr: "محافظة الوسطى" },
  { id: "north_sharqiyah", nameAr: "محافظة شمال الشرقية" },
  { id: "south_sharqiyah", nameAr: "محافظة جنوب الشرقية" },
];

export const wilayatsByGovernorate: Record<string, string[]> = {
  dakhiliyah: ["ولاية نزوى", "ولاية بهلاء", "ولاية منح", "ولاية سمائل", "ولاية إزكي", "ولاية ادم", "ولاية الحمراء", "ولاية الجبل الاخضر"],
  wusta: ["ولاية محوت", "ولاية هيما", "ولاية الجازر", "ولاية القم"],
  north_sharqiyah: ["ولاية إبراء", "ولاية المضيبي", "ولاية بدية", "ولاية القابل", "ولاية وادي بني خالد", "ولاية دماء والطائين", "ولاية سناو"],
  south_sharqiyah: ["ولاية صور", "ولاية جعلان بني بو علي", "ولاية جعلان بني بوحسن", "ولاية الكامل والوافي", "ولاية مصيرة"],
};

export const attractions: Attraction[] = [
  {
    "id": "1",
    "name": "وادي تنوف",
    "nameAr": "وادي تنوف",
    "description": "يُعد وادي تنوف من أشهر أودية محافظة الداخلية، ويمتاز بتشكيلاته الصخرية العميقة والمجاري المائية الموسمية التي تتدفق بعد الأمطار. يقع الوادي بين جبال عالية تمنحه جمالًا طبيعيًا يجذب محبي الرحلات والتخييم والمشي الجبلي. كما توجد بالقرب منه أطلال تنوف التاريخية التي تُعد نقطة جذب إضافية للزوار.",
    "governorate": "محافظة الداخلية",
    "governorateId": "dakhiliyah",
    "wilayat": "ولاية نزوى",
    "category": "أودية",
    "image": "/stock_images/oman_wadi_valley_nat_1af4dc65.jpg",
    "mapUrl": "https://maps.app.goo.gl/oJfK2xq7pUZH2s7q7",
    "rating": "4.3"
  },
  {
    "id": "2",
    "name": "قلعة نزوى",
    "nameAr": "قلعة نزوى",
    "description": "تعتبر قلعة نزوى من أهم القلاع التاريخية في عمان، بنيت في القرن السابع عشر، وتمتاز ببرجها الضخم وأروقتها التاريخية التي تروي قصة الولاية ودورها التاريخي. تضم القلعة متحفًا يعرض الآثار والتحف القديمة، وتوفر إطلالات بانورامية رائعة على المدينة والجبال المحيطة من أعلى البرج.",
    "governorate": "محافظة الداخلية",
    "governorateId": "dakhiliyah",
    "wilayat": "ولاية نزوى",
    "category": "قلاع وحصون",
    "image": "/stock_images/nizwa_fort_oman_hist_ca0d2be9.jpg",
    "mapUrl": "https://maps.app.goo.gl/KsmQbMKj2t7epLsL8",
    "rating": "4.7"
  },
  {
    "id": "3",
    "name": "عين صبع",
    "nameAr": "عين صبع",
    "description": "عين صبع من العيون الطبيعية المشهورة في نزوى، تقع في منطقة جبلية هادئة وتتميز بمياهها العذبة التي تتدفق بشكل موسمي. يرتادها الزوار للاستمتاع بالأجواء الطبيعية والتقاط الصور. تحيط بها مناظر طبيعية خلابة وصخور جبلية تضفي على المكان سحرًا خاصًا.",
    "governorate": "محافظة الداخلية",
    "governorateId": "dakhiliyah",
    "wilayat": "ولاية نزوى",
    "category": "ينابيع طبيعية",
    "image": "/stock_images/oman_natural_spring__a6b99a8c.jpg",
    "mapUrl": "https://maps.app.goo.gl/qCg8XsQJ6SqPnmAC9",
    "rating": "4.1"
  },
  {
    "id": "4",
    "name": "شاطئ صور",
    "nameAr": "شاطئ صور",
    "description": "يعد شاطئ صور من أجمل الشواطئ في محافظة جنوب الشرقية، يتميز برماله الناعمة ومياهه الصافية الزرقاء. يوفر الشاطئ أجواءً هادئة ومناسبة للسباحة والاسترخاء، كما يمكن للزوار مشاهدة غروب الشمس الرائع والاستمتاع بالمأكولات البحرية الطازجة في المطاعم القريبة.",
    "governorate": "محافظة جنوب الشرقية",
    "governorateId": "south_sharqiyah",
    "wilayat": "ولاية صور",
    "category": "شواطئ",
    "image": "/stock_images/oman_beach_coast_sea_bf5cd867.jpg",
    "mapUrl": "https://maps.app.goo.gl/8v6MwqHLW9jyP6Kv6",
    "rating": "4.5"
  }
];
