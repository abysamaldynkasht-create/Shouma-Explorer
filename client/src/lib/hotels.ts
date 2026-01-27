import type { Hotel } from "@shared/schema";
import sixSensesImg from "@/assets/six-senses-hotel.png";
import thousandNightsImg from "@/assets/thousand-nights-camp.png";
import danaBeachImg from "@/assets/dana-beach-resort.png";
import alNebrasImg from "@/assets/al-nebras-hotel.png";
import avaniImg from "@/assets/avani-hotel.png";
import ihyaLodgeImg from "@/assets/ihya-lodge.png";
import ihyaLodgeRoomImg from "@/assets/ihya-lodge-room.png";

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
  },
  {
    id: "2",
    name: "مخيم ألف ليلة",
    nameAr: "مخيم ألف ليلة",
    description: "يُعد مخيم ألف ليلة تجربة بدوية فاخرة في قلب رمال الشرقية. يوفر المخيم إقامة فريدة تجمع بين بساطة الحياة الصحراوية ووسائل الراحة الحديثة، حيث يضم خياماً على الطراز العربي التقليدي (الشيخ) وغرفاً زجاجية تتيح رؤية النجوم. يوفر المخيم أنشطة مثل ركوب الجمال، والتزلج على الرمال، والسباحة في مسبح وسط الكثبان الرملية، بالإضافة إلى عروض موسيقية شعبية في المساء.",
    city: "ولاية بدية",
    region: "محافظة شمال الشرقية",
    image: thousandNightsImg,
    gallery: [],
    amenities: ["ركوب الجمال", "التزلج على الرمال", "مسبح", "عروض موسيقية", "خيام فاخرة"],
    rating: 5,
    pricePerNight: 200,
    stars: 4,
    phone: "",
    mapUrl: "https://maps.app.goo.gl/g624hiFDU7bdyNim6?g_st=ic"
  },
  {
    id: "3",
    name: "منتجع شاطئ الدانة - الأشخرة",
    nameAr: "منتجع شاطئ الدانة - الأشخرة",
    description: "منتجع شاطئ الدانة - الأشخرة هو وجهة هادئة ومميزة تقع على ساحل بحر العرب. يشتهر المكان بالأجواء اللطيفة والمعتدلة خاصة في فصل الصيف، مما يجعله ملاذاً مثالياً للهروب من الحرارة. يتميز المنتجع بإطلالات مباشرة على المحيط، ويوفر غرفاً وشاليهات مريحة تناسب العائلات والأفراد الباحثين عن الاسترخاء بين صوت الأمواج والرمال الناعمة.",
    city: "ولاية جعلان بني بو علي",
    region: "محافظة جنوب الشرقية",
    image: danaBeachImg,
    gallery: [],
    amenities: ["شاطئ خاص", "شاليهات", "إطلالة على المحيط", "مناسب للعائلات"],
    rating: 4,
    pricePerNight: 150,
    stars: 4,
    phone: "",
    mapUrl: "https://maps.app.goo.gl/D68DxdxgBKmf1hwJ7?g_st=ic"
  },
  {
    id: "4",
    name: "فندق النبراس",
    nameAr: "فندق النبراس",
    description: "يُعد فندق النبراس من المنشآت الفندقية المريحة والحديثة في المنطقة. يقدم خدمات إقامة متكاملة للزوار والمسافرين، ويتميز بموقعه الذي يسهل الوصول منه إلى الخدمات الأساسية في المدينة، مما يجعله خياراً مناسباً لرجال الأعمال والسياح العابرين للمنطقة.",
    city: "ولاية عبري",
    region: "محافظة الظاهرة",
    image: alNebrasImg,
    gallery: [],
    amenities: ["واي فاي", "موقف سيارات", "خدمة الغرف", "استقبال 24 ساعة"],
    rating: 4,
    pricePerNight: 80,
    stars: 3,
    phone: "",
    mapUrl: "https://maps.app.goo.gl/ivxPyTRSnKJtKCWg9?g_st=ic"
  },
  {
    id: "5",
    name: "فندق أفاني مسقط",
    nameAr: "فندق أفاني مسقط",
    description: "يُعد فندق أفاني مسقط من الفنادق العصرية والحديثة التي تجمع بين الراحة والأناقة. يقع في منطقة حيوية وبالقرب من مراكز التسوق الكبرى (مثل سيتي سنتر السيب). يتميز بتصميمه الداخلي الأنيق، ويضم مرافق متنوعة تشمل مسبحاً خارجياً، صالة لياقة بدنية، ومطاعم تقدم أطباقاً عالمية، مما يجعله وجهة مثالية للمسافرين بقصد العمل أو السياحة.",
    city: "ولاية السيب",
    region: "محافظة مسقط",
    image: avaniImg,
    gallery: [],
    amenities: ["مسبح خارجي", "صالة لياقة", "مطاعم عالمية", "واي فاي", "قريب من مراكز التسوق"],
    rating: 4,
    pricePerNight: 120,
    stars: 4,
    phone: "",
    mapUrl: "https://maps.app.goo.gl/ijURp6fbdT9HgDVe7?g_st=ic"
  },
  {
    id: "6",
    name: "نزل إحياء",
    nameAr: "نزل إحياء",
    description: "يُعد \"نُزل إحياء\" تجربة سياحية تراثية فريدة، حيث تم ترميم وتحويل بيوت قديمة في حارة أثرية إلى نزل فندقي يجمع بين عبق الماضي ورفاهية الحاضر. يتميز المكان بتصميمه المعماري العماني التقليدي باستخدام الطين والأخشاب، ويمنح الزوار فرصة للعيش في قلب التاريخ العماني مع الاستمتاع بإطلالات خلابة على المزارع والجبال المحيطة.",
    city: "ولاية نزوى",
    region: "محافظة الداخلية",
    image: ihyaLodgeImg,
    gallery: [ihyaLodgeRoomImg],
    amenities: ["تراث عماني", "إطلالات جبلية", "تصميم تقليدي", "بيئة هادئة"],
    rating: 5,
    pricePerNight: 100,
    stars: 4,
    phone: "",
    mapUrl: "https://maps.app.goo.gl/YjoDQXuPkBVfctkM9?g_st=ic"
  }
];
