import { useState, useEffect } from 'react';
import { getAllCategories, getFeaturedCategories, getPrayersByCategory } from './brillianzhub';
import { Category, PrayerPoint } from './types'

export const usePrayer = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [featuredcategory, setFeaturedcategory] = useState<Category[]>([]);
    const [defaultPrayers, setDefaultPrayers] = useState<PrayerPoint[]>([]);
    const [fetchedPrayers, setFetchedPrayers] = useState<PrayerPoint[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedCategories = await getAllCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            setError('Unable to fetch categories. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // const fetchFeaturedCategories = async (): Promise<void> => {
    //     setIsLoading(true);
    //     setError(null);
    //     try {
    //         const fetchedFeaturedCategories = await getFeaturedCategories();
    //         setFeaturedcategory(fetchedFeaturedCategories);
    //     } catch (error) {
    //         setError('Unable to fetch categories. Please try again later.');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const fetchPrayersByCategory = async (category: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedPrayers: PrayerPoint[] = await getPrayersByCategory(category);
            const reversedPrayers = fetchedPrayers.reverse();
            setDefaultPrayers(reversedPrayers);
        } catch (error) {
            setError('Unable to fetch prayers. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        fetchCategories();
    }, []);

    // useEffect(() => {
    //     fetchFeaturedCategories();
    // }, []);

    return {
        categories,
        isLoading,
        defaultPrayers,
        setDefaultPrayers,
        selectedCategory,
        setSelectedCategory,
        fetchPrayersByCategory,
        fetchedPrayers,
        error
    };
};