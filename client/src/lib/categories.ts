import type { Category } from "@shared/schema";

export const categories: Category[] = [
  {
    id: "attractions",
    title: "Tourist Places",
    titleAr: "الأماكن السياحية",
    icon: "MapPin",
    description: "اكتشف أجمل المعالم السياحية",
    color: "from-amber-600/80 to-amber-800/90",
  },
  {
    id: "hotels",
    title: "Hotels",
    titleAr: "الفنادق",
    icon: "Building2",
    description: "أفضل أماكن الإقامة",
    color: "from-stone-600/80 to-stone-800/90",
  },
  {
    id: "restaurants",
    title: "Restaurants",
    titleAr: "المطاعم",
    icon: "UtensilsCrossed",
    description: "تذوق ألذ المأكولات",
    color: "from-orange-600/80 to-orange-800/90",
  },
  {
    id: "hiking",
    title: "Hiking Trips",
    titleAr: "رحلات الهايكنق",
    icon: "Mountain",
    description: "مغامرات في الطبيعة",
    color: "from-emerald-700/80 to-emerald-900/90",
  },
  {
    id: "taxis",
    title: "Taxis",
    titleAr: "سيارات الأجرة",
    icon: "Car",
    description: "تنقل بسهولة وراحة",
    color: "from-yellow-600/80 to-yellow-800/90",
  },
  {
    id: "shoumatak",
    title: "Shoumatak",
    titleAr: "شومتك",
    icon: "Sparkles",
    description: "خطط رحلتك المثالية",
    color: "from-primary/80 to-primary/95",
  },
];
