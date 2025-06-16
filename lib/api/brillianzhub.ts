import axios from 'axios';
import { PrayerPoint } from './types'

interface Category {
    id: number,
    title: string;
    featured: boolean;
    image: string | null;
}


interface Devotion {
    date: string;
    title: string;
    content: string;
    theme: string;
    bible_verse_text: string;
    bible_verse_reference: string;
    devotion: string;
    reflectionQuestions?: string[];
    prayer: string;
    family_challenge: string;
    devotional_date: string;
}

export interface Sermon {
    id: string | number;
    title: string;
    preacher: string;
    source: string;
    description?: string;
    url: string;
    date_published: string;
}


export interface SermonCategory {
    id: number;
    name: string;
    video_count: number;
}

export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const response = await axios.get<{ results: any[] }>('https://www.brillianzhub.com/ipray/categories/');

        if (response.status !== 200) {
            throw new Error('Error fetching categories: ' + response.statusText);
        }

        const data = response.data.results;

        const filteredData = data.filter(category =>
            category.title !== 'New Testament' &&
            category.title !== 'Old Testament' &&
            category.featured !== true
        );

        const mappedData: Category[] = filteredData.map(item => ({
            id: item.id,               // or item._id or whatever the API uses
            title: item.title,
            image: item.image_url,     // map field name properly
            featured: item.featured,
        }));

        const sortedData = mappedData.sort((a, b) => a.title.localeCompare(b.title));

        return sortedData;
    } catch (error) {
        throw new Error('Error fetching categories: ' + (error as Error).message);
    }
};


export const getFeaturedCategories = async (): Promise<Category[]> => {
    try {
        const response = await axios.get<{ results: Category[] }>('https://www.brillianzhub.com/ipray/categories/');

        if (response.status !== 200) {
            throw new Error('Error fetching categories: ' + response.statusText);
        }

        const data = response.data.results;

        const filteredData = data.filter(category =>
            category.featured !== false
        );

        const sortedData = filteredData.sort((a, b) => a.title.localeCompare(b.title));

        return sortedData;
    } catch (error) {
        throw new Error('Error fetching categories: ' + (error as Error).message);
    }
};

export const getPrayersByCategory = async (category: string): Promise<PrayerPoint[]> => {
    try {
        const response = await axios.get<PrayerPoint[]>(
            `https://www.brillianzhub.com/ipray/prayerpoints/by_category/?category=${category}`
        );

        if (response.status !== 200) {
            throw new Error('Error fetching prayers: ' + response.statusText);
        }

        const data = response.data;
        return data; // already filtered from backend
    } catch (error) {
        throw new Error('Error fetching categories: ' + (error as Error).message);
    }
};

export const getPrayerPointsById = async (prayerId: number): Promise<PrayerPoint> => {
    try {
        const response = await axios.get<PrayerPoint>(`https://www.brillianzhub.com/ipray/prayerpoints/${prayerId}`);

        if (response.status !== 200) {
            throw new Error('Error fetching chapters: ' + response.statusText);
        }

        return response.data;
    } catch (error) {
        throw new Error('Error fetching verse: ' + (error as Error).message);
    }
};

export const getDevotionByDate = async (date: string): Promise<Devotion> => {
    try {
        const response = await axios.get<Devotion>(`https://www.brillianzhub.com/devotion/devotional/${date}/`);

        if (response.status !== 200) {
            throw new Error('Error fetching devotion for date: ' + response.statusText);
        }
        return response.data;
    } catch (error) {
        throw new Error('Error fetching devotion for date: ' + (error as Error).message);
    }
};

export const getPrayerOfTheDay = async (timezoneOffset: number): Promise<PrayerPoint> => {
    try {
        const response = await axios.get<PrayerPoint>(`https://www.brillianzhub.com/ipray/prayer-of-the-day/?tz_offset=${timezoneOffset}`);

        if (response.status !== 200) {
            throw new Error('Error fetching prayer of the day: ' + response.statusText);
        }
        return response.data;
    } catch (error) {
        throw new Error('Error fetching prayer of the day: ' + (error as Error).message);
    }
};

export const getDevotionTimeTable = async (): Promise<any> => {
    try {
        const response = await axios.get(`https://www.brillianzhub.com/devotion/timetable/`);

        if (response.status !== 200) {
            throw new Error('Error fetching time table: ' + response.statusText);
        }
        return response.data;
    } catch (error) {
        throw new Error('Error fetching time table: ' + (error as Error).message);
    }
};

export const getSermons = async (category: string = ''): Promise<Sermon[]> => {
    try {
        const response = await axios.get<Sermon[]>(`https://www.brillianzhub.com/sermons/collections/`, {
            params: {
                q: category
            }
        });

        if (response.status !== 200) {
            throw new Error('Error fetching sermons: ' + response.statusText);
        }

        return response.data;
    } catch (error) {
        throw new Error('Error fetching sermons: ' + (error as Error).message);
    }
};

export const getSermonsCategories = async (): Promise<SermonCategory[]> => {
    try {
        const response = await axios.get<SermonCategory[]>(`https://www.brillianzhub.com/sermons/categories/`);

        if (response.status !== 200) {
            throw new Error('Error fetching categories: ' + response.statusText);
        }
        return response.data;
    } catch (error) {
        throw new Error('Error fetching categories: ' + (error as Error).message);
    }
};
