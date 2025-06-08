import { useState, useEffect } from 'react';
import { fetchHymnsFromApi } from './brillianzhub';

export interface Hymn {
  id: number;
  title: string;
  author: string | null;
  year: number | null;
  has_chorus: boolean;
  chorus: string;
  stanzas: {
    stanza_number: number;
    text: string;
  }[];
}

interface UseHymnsReturn {
  hymns: Hymn[] | null;
  isLoading: boolean;
  error: string | null;
  fetchHymns: () => Promise<void>;
}

export const useHymns = (): UseHymnsReturn => {
  const [hymns, setHymns] = useState<Hymn[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHymns = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedHymns = await fetchHymnsFromApi();
      setHymns(fetchedHymns);
    } catch (err) {
      setError('Unable to fetch hymns. Please try again later.');
      console.error('Error fetching hymns:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHymns();
  }, []);

  return {
    hymns,
    isLoading,
    error,
    fetchHymns,
  };
};
