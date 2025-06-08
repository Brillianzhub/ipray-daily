import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import { Share2, BookOpen } from 'lucide-react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

interface PrayerCategory {
  id: number;
  title: string;
}

interface PrayerData {
  id: number;
  text: string;
  bible_verse: string;
  bible_quotation: string;
  category: PrayerCategory;
}

const DailyPrayerCard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [prayer, setPrayer] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const fetchPrayer = async () => {
    try {
      const timezoneOffset = new Date().getTimezoneOffset() / -60;
      const response = await axios.get(`https://www.brillianzhub.com/ipray/prayer-of-the-day/?tz_offset=${timezoneOffset}`);

      if (response.data) {
        setPrayer(response.data as PrayerData);
      } else {
        console.error("Unexpected API response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching prayer:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayer();

    const updatePrayerAtMidnight = () => {
      fetchPrayer();
      setCurrentDate(new Date());
    };

    const now = new Date();
    const timeUntilMidnight = new Date(now).setHours(24, 0, 0, 0) - now.getTime();

    const timeoutId = setTimeout(() => {
      updatePrayerAtMidnight();
      setInterval(updatePrayerAtMidnight, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleShare = async () => {
    if (!prayer) return;

    const message = `IPray Daily - ${formattedDate}\n\nCategory: ${prayer.category.title}\n\n"${prayer.text}"\n\n${prayer.bible_verse} - ${prayer.bible_quotation}`;

    try {
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleReadInContext = () => {
    if (prayer?.bible_quotation) {
      router.push({
        pathname: '/(app)/(tabs)/bible',
        params: {
          reference: prayer.bible_quotation
        }
      })
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0284c7" />;
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prayer of the Day</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      <Text style={styles.prayer}>
        {prayer?.text}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.reference}>{prayer?.bible_quotation}</Text>
        <TouchableOpacity
          style={styles.readMoreButton}
        >
          <TouchableOpacity style={styles.readMoreButton} onPress={handleReadInContext}>
            <BookOpen size={16} color="#1E3A8A" />
            <Text style={styles.readMoreText}>Read in Context</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Cormorant-Bold',
    fontSize: 18,
    color: '#1E293B',
  },
  shareButton: {
    padding: 4,
  },
  prayer: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 18,
    color: '#334155',
    lineHeight: 28,
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reference: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#1E3A8A',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E3A8A',
    marginLeft: 4,
  },
});

export default DailyPrayerCard;
