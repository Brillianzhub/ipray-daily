import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import { Share2, BookOpen } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { usePrayerDatabase, Prayer } from '@/hooks/usePrayers';

import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { parseScriptureReference, getVersesRange } from '@/lib/database';


const DailyPrayerCard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [verseText, setVerseText] = useState<string>('');

  const { getDailyFeaturedPrayer } = usePrayerDatabase();

  const router = useRouter();


  useEffect(() => {
    if (!prayer) return;

    const loadVerse = async () => {
      const ref = parseScriptureReference(prayer?.prayer_scripture);
      if (ref) {
        const { book, chapter, verseStart, verseEnd } = ref;
        const verses = await getVersesRange(book, chapter, verseStart, verseEnd);
        const combined = verses.map(v => `${v.text}`).join(' ');
        setVerseText(combined);
      }
    };

    loadVerse();
  }, [prayer?.prayer_scripture]);


  useEffect(() => {
    const loadPrayer = async () => {
      try {
        const prayer = await getDailyFeaturedPrayer();
        setPrayer(prayer);
      } catch (error) {
        console.error('Error loading prayer:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPrayer();
  }, []);


  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleShare = async () => {
    if (!prayer) return;

    const message = `IPray Daily - ${formattedDate}\n\nCategory: ${prayer.prayer_category}\n\n"${prayer.prayer}"\n\n${verseText} - ${prayer.prayer_scripture}`;

    try {
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleReadInContext = () => {
    if (prayer?.prayer_scripture) {
      router.push({
        pathname: '/(app)/(tabs)/bible',
        params: {
          reference: prayer.prayer_scripture
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


      <View style={styles.dateContainer}>
        <MaterialIcons name="date-range" size={20} color="#0284c7" />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <View style={styles.categoryContainer}>
        <MaterialIcons name="category" size={20} color="#0284c7" />
        <Text style={styles.categoryText}>
          {prayer?.prayer_category
            ?.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </Text>
      </View>

      <View style={styles.prayerContainer}>
        <MaterialIcons name="format-quote" size={24} color="#0284c7" />
        <Text style={styles.prayerText}>
          {prayer?.prayer}
        </Text>
      </View>

      <View style={styles.bibleContainer}>
        <FontAwesome name="book" size={20} color="#0284c7" />
        <Text style={styles.bibleText}>
          {verseText} -{' '}
          <Text style={{ color: '#F59E0B' }}>
            {prayer?.prayer_scripture}
          </Text>
        </Text>
      </View>


      <View style={styles.footer}>
        <BookOpen size={16} color="#0284c7" />
        <TouchableOpacity style={styles.readMoreButton} onPress={handleReadInContext}>
          <Text style={styles.reference}>Read in Context</Text>
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontFamily: 'Cormorant-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginLeft: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 18,
    color: '#4B5563',
    marginLeft: 8,
  },
  prayerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  prayerText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 18,
    color: '#334155',
    lineHeight: 28,
    marginBottom: 16,
    textAlign: 'justify',
    marginLeft: 8,
    flex: 1,
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
  bibleContainer: {
    flexDirection: 'row',
  },
  bibleText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 18,
    color: '#334155',
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12
  },
  reference: {
    fontFamily: 'Cormorant-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
    color: '#0284c7',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0284c7',
    marginLeft: 4,
  },
});

export default DailyPrayerCard;
