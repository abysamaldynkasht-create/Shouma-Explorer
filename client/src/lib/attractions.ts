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

export const attractions: Attraction[] = [];
