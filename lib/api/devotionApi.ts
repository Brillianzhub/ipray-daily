import { useState, useEffect } from 'react';
import { getDevotionByDate, getDevotionTimeTable } from './brillianzhub';

export interface Devotion {
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


export interface TimeTable {
    months: Array<{
        id: number;
        name: string;
        videos?: Array<{
            id: string;
            title: string;
            description: string;
            url: string;
        }>;
    }>;
}


interface UseDevotionReturn {
    devotion: Devotion | null;
    timeTable: TimeTable | null;
    isLoading: boolean;
    error: string | null;
    setDevotion: React.Dispatch<React.SetStateAction<Devotion | null>>;
    fetchDevotionByDate: (date: string) => Promise<void>;
    fetchDevotionTimeTable: () => Promise<void>;
}

export const useDevotion = (): UseDevotionReturn => {
    const [devotion, setDevotion] = useState<Devotion | null>(null);
    const [timeTable, setTimeTable] = useState<TimeTable | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDevotionTimeTable = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedTimeTable = await getDevotionTimeTable();
            setTimeTable(fetchedTimeTable);
        } catch (error) {
            setError('Unable to fetch devotion timetable. Please try again later.');
            console.error('Error fetching timetable:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDevotionByDate = async (date: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getDevotionByDate(date);
            setDevotion(response);
        } catch (error) {
            setError('Unable to fetch devotion for this date. Please try again later.');
            console.error('Error fetching devotion:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDevotionTimeTable();
    }, []);

    return {
        devotion,
        timeTable,
        isLoading,
        error,
        setDevotion,
        fetchDevotionByDate,
        fetchDevotionTimeTable
    };
};
