import type { Attraction } from "@shared/schema";

const imageMap: Record<string, string> = {};

export function getAttractionImage(imagePath: string): string {
  return imageMap[imagePath] || imagePath;
}

export const governorates = [
  { id: "muscat", nameAr: "محافظة مسقط" },
  { id: "dakhiliyah", nameAr: "محافظة الداخلية" },
  { id: "wusta", nameAr: "محافظة الوسطى" },
  { id: "dhofar", nameAr: "محافظة ظفار" },
  { id: "north_batinah", nameAr: "محافظة شمال الباطنة" },
  { id: "south_batinah", nameAr: "محافظة جنوب الباطنة" },
  { id: "north_sharqiyah", nameAr: "محافظة شمال الشرقية" },
  { id: "south_sharqiyah", nameAr: "محافظة جنوب الشرقية" },
  { id: "dhahirah", nameAr: "محافظة الظاهرة" },
  { id: "musandam", nameAr: "محافظة مسندم" },
  { id: "buraimi", nameAr: "محافظة البريمي" },
];

export const categories = [
  { id: "markets", nameAr: "الأسواق التجارية" },
  { id: "entertainment", nameAr: "الأماكن الترفيهية" },
  { id: "heritage", nameAr: "الأماكن التراثية" },
  { id: "nature", nameAr: "الأماكن الطبيعية" },
  { id: "wadis", nameAr: "الأودية" },
  { id: "hotels", nameAr: "الفنادق" },
  { id: "restaurants", nameAr: "المطاعم" },
];

export const wilayatsByGovernorate: Record<string, string[]> = {
  muscat: ["ولاية مسقط", "ولاية مطرح", "ولاية بوشر", "ولاية السيب", "ولاية العامرات", "ولاية قريات"],
  dakhiliyah: ["ولاية نزوى", "ولاية بهلاء", "ولاية منح", "ولاية سمائل", "ولاية إزكي", "ولاية ادم", "ولاية الحمراء", "ولاية الجبل الاخضر"],
  wusta: ["ولاية محوت", "ولاية هيما", "ولاية الجازر", "ولاية الدقم"],
  dhofar: ["ولاية صلالة", "ولاية طاقة", "ولاية مرباط", "ولاية سدح", "ولاية رخيوت", "ولاية ضلكوت", "ولاية المزيونة", "ولاية شليم وجزر الحلانيات", "ولاية ثمريت", "ولاية مقشن"],
  north_batinah: ["ولاية صحار", "ولاية شناص", "ولاية لوى", "ولاية صحم", "ولاية الخابورة", "ولاية السويق"],
  south_batinah: ["ولاية الرستاق", "ولاية العوابي", "ولاية نخل", "ولاية وادي المعاول", "ولاية بركاء", "ولاية المصنعة"],
  north_sharqiyah: ["ولاية إبراء", "ولاية المضيبي", "ولاية بدية", "ولاية القابل", "ولاية وادي بني خالد", "ولاية دماء والطائيين"],
  south_sharqiyah: ["ولاية صور", "ولاية الكامل والوافي", "ولاية جعلان بني بو حسن", "ولاية جعلان بني بو علي", "ولاية مصيرة"],
  dhahirah: ["ولاية عبري", "ولاية ينقل", "ولاية ضنك"],
  musandam: ["ولاية خصب", "ولاية بخا", "ولاية دبا", "ولاية مدحا"],
  buraimi: ["ولاية البريمي", "ولاية محضة", "ولاية السنينة"],
};

export const attractions: Attraction[] = [
  {
    id: "1",
    name: "شاطئ القرم",
    nameAr: "شاطئ القرم",
    description: "من الشواطئ الرملية التي تجذب العائلات للتنزه على الشاطئ والاستمتاع بالأجواء البحرية الهادئة.",
    governorate: "محافظة مسقط",
    governorateId: "muscat",
    wilayat: "ولاية بوشر",
    category: "nature",
    image: "",
    mapUrl: null,
    rating: "4.5"
  },
  {
    id: "2",
    name: "سوق مطرح",
    nameAr: "سوق مطرح",
    description: "أحد أقدم وأشهر الأسواق العُمانية. يضم المتاجر التي تبيع المصنوعات الحرفية العُمانية كالخناجر والنحاسيات والبخور والعطور التقليدية.",
    governorate: "محافظة مسقط",
    governorateId: "muscat",
    wilayat: "ولاية مطرح",
    category: "markets",
    image: "",
    mapUrl: null,
    rating: "4.8"
  },
  {
    id: "3",
    name: "وادي الخوض",
    nameAr: "وادي الخوض",
    description: "وادٍ طبيعي جميل يتكوّن من برك مائية وعيون مياه ثابتة. مكان مثالي للاسترخاء والتمتع بالطبيعة.",
    governorate: "محافظة مسقط",
    governorateId: "muscat",
    wilayat: "ولاية السيب",
    category: "wadis",
    image: "",
    mapUrl: null,
    rating: "4.3"
  },
  {
    id: "4",
    name: "فندق أفاني مسقط",
    nameAr: "فندق أفاني مسقط",
    description: "فندق 4 نجوم محلي مرموق صُمِّم على الطراز العُماني الأنيق. فندق يحرص على تقديم ضيافة عمانية أصيلة مع خدمات حديثة.",
    governorate: "محافظة مسقط",
    governorateId: "muscat",
    wilayat: "ولاية السيب",
    category: "hotels",
    image: "",
    mapUrl: null,
    rating: "4.4"
  },
  {
    id: "5",
    name: "مطعم كارجين",
    nameAr: "مطعم كارجين",
    description: "مطعم محلي مشهور بأجوائه العُمانية التقليدية، ويقدم المأكولات المصنوعة منزليًا بنكهات عمانية أصيلة.",
    governorate: "محافظة مسقط",
    governorateId: "muscat",
    wilayat: "ولاية مسقط",
    category: "restaurants",
    image: "",
    mapUrl: null,
    rating: "4.6"
  },
  {
    id: "6",
    name: "منتزه القرم الطبيعي",
    nameAr: "منتزه القرم الطبيعي",
    description: "أكبر حديقة عامة في مسقط. يجمع بين المناظر الخضراء الشاسعة والهندسة المعمارية الجمالية. مكان مثالي للعائلات.",
    governorate: "محافظة مسقط",
    governorateId: "muscat",
    wilayat: "ولاية بوشر",
    category: "entertainment",
    image: "",
    mapUrl: null,
    rating: "4.7"
  },
  {
    id: "7",
    name: "قلعة مطرح",
    nameAr: "قلعة مطرح",
    description: "قلعة تاريخية تراثية تقع على تلال جبال الحجر المطلة على ميناء السلطان قابوس. تعكس التاريخ العريق لسلطنة عُمان.",
    governorate: "محافظة مسقط",
    governorateId: "muscat",
    wilayat: "ولاية مطرح",
    category: "heritage",
    image: "",
    mapUrl: null,
    rating: "4.5"
  }
];
