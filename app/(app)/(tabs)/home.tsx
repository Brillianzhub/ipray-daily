import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, AppState, AppStateStatus, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { BookOpen, X, Music } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DailyPrayerCard from '@/components/home/DailyPrayerCard';
import FeaturedContent from '@/components/home/FeaturedContent';
import { useAppTheme } from '@/hooks/useAppTheme';
import DailyDevotional from '@/components/home/DailyDevotional';
import { useDevotion } from '@/lib/api/devotionApi';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useStats from '@/lib/api/statsApi';
import { countHymns } from '@/lib/hymns';
import { DatabaseService } from '@/lib/prayers';

export default function HomeScreen() {
  const colors = useAppTheme();
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
  const [hymnCount, setHymnCount] = useState<number | null>(null);
  const [prayerCount, setPrayerCount] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
  });

  const handleAddEvent = () => {
    setIsAddEventModalVisible(false);
    setNewEvent({ title: '', date: '', time: '', location: '' });
  };
  const router = useRouter();

  const { devotion, fetchDevotionByDate, isLoading, error } = useDevotion();
  const { stats, loading } = useStats();

  useEffect(() => {
    const hymnStat = async () => {
      try {
        const hymnStat = await countHymns();
        const prayerStat = await DatabaseService.countPrayers();
        setHymnCount(hymnStat)
        setPrayerCount(prayerStat)
      } catch (error) {
        console.log("Failed to fetch hymn count", error)
      }
    };

    hymnStat();
  }, [])


  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    fetchDevotionByDate(today);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const newToday = new Date().toISOString().split('T')[0];
        fetchDevotionByDate(newToday);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [fetchDevotionByDate]);


  const handleReadMore = () => {
    router.replace({
      pathname: '/Devotion'
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeText, { color: colors.text.secondary }]}>Welcome back,</Text>
        <Text style={[styles.nameText, { color: colors.primary }]}>David</Text>

        <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.statItem}>
            <MaterialIcons name="video-library" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.primary }]}>{stats?.sermons}+</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Sermons</Text>
          </View>

          <View style={styles.statItem}>
            <BookOpen size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.primary }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Bible Versions</Text>
          </View>

          <View style={styles.statItem}>
            <Music size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.primary }]}>{hymnCount}+</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Hymns</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons name="hands-pray" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.primary }]}>{prayerCount}+</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Prayers</Text>
          </View>
        </View>
      </View>

      <DailyPrayerCard />

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Today's Devotional</Text>
        <TouchableOpacity
          onPress={() => router.push({
            pathname: '/(app)/(devotion)/TimeTable'
          })}
        >
          <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>

      <DailyDevotional
        colors={colors}
        onReadMore={handleReadMore}
        devotion={devotion ?? undefined}
      />

      <FeaturedContent />

      <Modal
        visible={isAddEventModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddEventModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Add New Event</Text>
              <TouchableOpacity
                onPress={() => setIsAddEventModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Event Title</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.background,
                  color: colors.text.primary,
                  borderColor: colors.border
                }]}
                placeholder="Enter event title"
                placeholderTextColor={colors.text.secondary}
                value={newEvent.title}
                onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Date</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.background,
                  color: colors.text.primary,
                  borderColor: colors.border
                }]}
                placeholder="MM/DD/YYYY"
                placeholderTextColor={colors.text.secondary}
                value={newEvent.date}
                onChangeText={(text) => setNewEvent({ ...newEvent, date: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Time</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.background,
                  color: colors.text.primary,
                  borderColor: colors.border
                }]}
                placeholder="HH:MM AM/PM"
                placeholderTextColor={colors.text.secondary}
                value={newEvent.time}
                onChangeText={(text) => setNewEvent({ ...newEvent, time: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Location</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.background,
                  color: colors.text.primary,
                  borderColor: colors.border
                }]}
                placeholder="Enter location"
                placeholderTextColor={colors.text.secondary}
                value={newEvent.location}
                onChangeText={(text) => setNewEvent({ ...newEvent, location: text })}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={() => setIsAddEventModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text.secondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton, { backgroundColor: colors.primary }]}
                onPress={handleAddEvent}
              >
                <Text style={styles.addButtonText}>Add Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  nameText: {
    fontFamily: 'Cormorant-Bold',
    fontSize: 28,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    marginTop: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Cormorant-Bold',
    fontSize: 20,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  devotionalCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  devotionalImage: {
    width: '100%',
    height: 160,
  },
  devotionalContent: {
    padding: 16,
  },
  devotionalTitle: {
    fontFamily: 'Cormorant-Bold',
    fontSize: 20,
    marginBottom: 8,
  },
  devotionalDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  readMoreButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  readMoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  upcomingContainer: {
    marginTop: 16,
  },
  eventHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  addEventText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  eventCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  eventDateContainer: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
  },
  eventMonth: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  eventDay: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  eventDetails: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  eventTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 2,
  },
  eventLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Cormorant-Bold',
    fontSize: 24,
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  addButton: {
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});