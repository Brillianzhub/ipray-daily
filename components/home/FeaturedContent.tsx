import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const images = {
  sermons: require('../../assets/images/banner.jpg'),
  nations: require('../../assets/images/banner2.jpg'),
  churches: require('../../assets/images/banner.jpg'),
  revival: require('../../assets/images/banner.jpg'),
};

const FEATURED_CONTENT = [
  {
    id: '1',
    title: 'Categorized Sermon Collections',
    link: '/(sermons)',
    type: 'Sermons',
    image: images.sermons,
  },
  {
    id: '2',
    title: 'Prayer for Nations',
    link: '/(sermons)',
    type: 'Intercession',
    image: images.sermons,
  },
  {
    id: '3',
    title: 'Prayer for Churches',
    link: '/(sermons)',
    type: 'Intercession',
    image: images.sermons,
  },
  {
    id: '4',
    title: 'Prayers for Revival',
    link: '/(sermons)',
    type: 'Intercession',
    image: images.sermons,
  },
];


export default function FeaturedContent() {

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Content</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FEATURED_CONTENT.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => router.push(item.link as any)}
          >
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardType}>{item.type}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Cormorant-Bold',
    fontSize: 20,
    color: '#1E293B',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E3A8A',
  },
  scrollContent: {
    paddingRight: 16,
  },
  card: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 12,
  },
  cardType: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1E293B',
  },
});