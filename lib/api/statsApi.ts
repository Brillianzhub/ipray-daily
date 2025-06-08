import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the type for the stats data
interface StatsData {
    hymns: number;
    sermons: number;
    prayer_points: number;
}

const API_URL = 'https://www.brillianzhub.com/ipray/total-stats/';

const useStats = () => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get<StatsData>(API_URL);
                setStats(response.data);
            } catch (err) {
                setError('Failed to fetch statistics');
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
};

export default useStats;