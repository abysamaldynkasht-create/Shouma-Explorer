import activityCamelRidingImg from "@/assets/activity-camel-riding.png";
import horseRidingSeebImg from "@/assets/horse-riding-seeb.png";
import khareefDhofarImg from "@/assets/khareef-dhofar.png";
import muscatNightsImg from "@/assets/muscat-nights.png";
import potteryNizwaImg from "@/assets/pottery-nizwa.png";

export interface ActivityBranch {
  name: string;
  nameAr: string;
  mapUrl: string;
}

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
  branches?: ActivityBranch[];
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
  {
    id: "khareef-dhofar",
    name: "Khareef Dhofar Season",
    nameAr: "موسم خريف ظفار",
    description: "Khareef Dhofar is one of the most beautiful tourist seasons in the Sultanate of Oman, occurring annually from late June to early September. During this period, Dhofar Governorate transforms into a rare natural painting, where fog and green color cover the mountains and plains, and temperatures drop compared to other areas of the Sultanate. The season features light rain and continuous drizzle, moderate and refreshing weather, natural waterfalls and seasonal springs, and various cultural and tourist events in Salalah and surrounding areas. Khareef Dhofar attracts visitors from inside and outside the Sultanate to enjoy nature, fresh air, and heritage experiences.",
    descriptionAr: "يُعد موسم خريف ظفار من أجمل المواسم السياحية في سلطنة عُمان، ويأتي سنويًا من نهاية يونيو إلى بداية سبتمبر. خلال هذه الفترة تتحول محافظة ظفار إلى لوحة طبيعية نادرة، حيث يكسو الضباب واللون الأخضر الجبال والسهول، وتنخفض درجات الحرارة مقارنة ببقية مناطق السلطنة. يتميّز الخريف بأمطار خفيفة ورذاذ مستمر، أجواء معتدلة ومنعشة، شلالات طبيعية وعيون ماء موسمية، فعاليات ثقافية وسياحية متنوعة في صلالة والمناطق المحيطة. ويجذب موسم خريف ظفار الزوار من داخل السلطنة وخارجها للاستمتاع بالطبيعة، والهواء النقي، والتجارب التراثية، مما يجعله واحدًا من أهم المواسم السياحية في المنطقة.",
    location: "صلالة، محافظة ظفار",
    region: "محافظة ظفار",
    duration: "يونيو - سبتمبر",
    price: "موسم سنوي",
    image: khareefDhofarImg,
    rating: 4.9,
    includes: ["طبيعة خضراء", "أمطار خفيفة", "شلالات طبيعية", "فعاليات ثقافية", "أجواء معتدلة"],
    mapUrl: "https://maps.app.goo.gl/NcYLwNDFoyS6c1319",
  },
  {
    id: "muscat-nights",
    name: "Muscat Nights Festival",
    nameAr: "مهرجان ليالي مسقط",
    description: "Muscat Nights is one of the largest and most popular annual festivals in the Sultanate of Oman. It features entertainment shows, cultural activities, traditional crafts, food courts, games, and family-friendly events. The festival takes place at multiple locations across Muscat with various branches offering unique experiences.",
    descriptionAr: "ليالي مسقط هو أحد أكبر وأشهر المهرجانات السنوية في سلطنة عُمان. يتضمن عروضاً ترفيهية وأنشطة ثقافية وحرف تقليدية ومناطق للأطعمة وألعاب وفعاليات عائلية متنوعة. يُقام المهرجان في مواقع متعددة في مسقط مع فروع مختلفة تقدم تجارب فريدة.",
    location: "مواقع متعددة، محافظة مسقط",
    region: "محافظة مسقط",
    duration: "يناير - فبراير",
    price: "دخول مجاني",
    image: muscatNightsImg,
    rating: 4.8,
    includes: ["عروض ترفيهية", "أنشطة ثقافية", "حرف تقليدية", "مناطق طعام", "ألعاب للأطفال"],
    branches: [
      { name: "Qurum Natural Park", nameAr: "فرع متنزه القرم الطبيعي", mapUrl: "https://maps.app.goo.gl/D72Fu6tEnpsD35aE7" },
      { name: "Royal Opera House", nameAr: "فرع دار الأوبرا السلطانية", mapUrl: "https://maps.app.goo.gl/bQckzMTczwfawfSQ7" },
      { name: "Wadi Al Khoud", nameAr: "فرع وادي الخوض", mapUrl: "https://maps.app.goo.gl/3Zbn8LnwCetre5Ue7" },
      { name: "Sur Al Hadid", nameAr: "فرع سور الحديد", mapUrl: "https://maps.app.goo.gl/qPP7U14noVcZvH3C6" },
      { name: "Quriyat", nameAr: "فرع قريات", mapUrl: "https://maps.app.goo.gl/PjULcAecnnjDDDQP9" },
      { name: "Al Amarat Park", nameAr: "فرع متنزه العامرات", mapUrl: "https://maps.app.goo.gl/Kbr31kLwSWUVoTEFA" },
      { name: "Oman Automobile Association", nameAr: "فرع الجمعية العمانية للسيارات", mapUrl: "https://maps.app.goo.gl/xSnmAPjdGaTK1un6A" },
    ],
  },
  {
    id: "pottery-nizwa",
    name: "Pottery Making in Nizwa",
    nameAr: "صناعة الفخار في نزوى",
    description: "Experience the ancient art of pottery making in Nizwa, one of Oman's most historic cities. Learn traditional techniques from local artisans and create your own pottery pieces. This hands-on activity offers a unique glimpse into Omani heritage and craftsmanship.",
    descriptionAr: "استمتع بتجربة فن صناعة الفخار العريق في نزوى، إحدى أعرق المدن العُمانية. تعلّم التقنيات التقليدية من الحرفيين المحليين وصنع قطع الفخار الخاصة بك. هذا النشاط العملي يوفر لمحة فريدة عن التراث والحرف اليدوية العُمانية.",
    location: "نزوى، محافظة الداخلية",
    region: "محافظة الداخلية",
    duration: "2-3 ساعات",
    price: "1-5 ر.ع",
    image: potteryNizwaImg,
    rating: 4.7,
    includes: ["تعليم صناعة الفخار", "المواد الخام", "قطعة تذكارية", "مرشد محلي"],
    mapUrl: "https://maps.app.goo.gl/vBGZoVLbdZRFiC8U7",
  },
];
