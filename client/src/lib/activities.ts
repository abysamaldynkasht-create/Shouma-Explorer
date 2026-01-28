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
}

export const activities: Activity[] = [];
