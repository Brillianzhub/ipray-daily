// types.ts
export interface Category {
  id: number;
  title: string;
  featured: boolean;
  image: string | null;
}

export interface PrayerPoint {
  id: number;
  title: string; // <- add this
  text: string;
  bible_verse: string;
  bible_quotation: string;
  prayer_long?: string;
  content: string;
  category: {
    title: string;
  };
}

