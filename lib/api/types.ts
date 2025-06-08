// types.ts
export interface Category {
  id: number; 
  title: string;
  featured: boolean;
  image: string | null; 
}

export interface PrayerPoint {
    id: number;
    title: string;
    content: string;
    category: {
        title: string;
        // other category properties...
    };
    // other properties...
}