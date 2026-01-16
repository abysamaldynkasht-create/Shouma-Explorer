import type { Attraction } from "@shared/schema";

const imageMap: Record<string, string> = {};

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

export const attractions: Attraction[] = [];
