import { useState, useEffect } from 'react';
import {
  getSermonsCategories,
  getSermons,
  SermonCategory,
  Sermon
} from './brillianzhub';

// Optional: you can remove this if `getSermons` always returns Sermon[]
type SermonApiResponse = {
  results: Sermon[];
} | Sermon[];

export const useSermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [categories, setCategories] = useState<SermonCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await getSermonsCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchSermonsByCategory = async (category: string = ''): Promise<Sermon[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getSermons(category) as SermonApiResponse;
      const results = Array.isArray(data) ? data : data.results;
      setSermons(results);
      return results;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load sermons';
      setError(message);
      setSermons([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sermons,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    fetchSermonsByCategory,
    isLoading,
    error,
  };
};
