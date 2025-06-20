import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = screenWidth - CARD_MARGIN * 2;

const images = {
  sermons: require('../../assets/images/banner.jpg'),
  nations: require('../../assets/images/banner3.jpg'),
  churches: require('../../assets/images/banner2.jpg'),
  revival: require('../../assets/images/banner3.jpg'),
};

const FEATURED_CONTENT = [
  {
    id: '1',
    title: 'Sermon Collections',
    link: '/(sermons)',
    type: 'Sermons',
    image: images.sermons,
  },
  {
    id: '2',
    title: 'Prayer for Nations',
    link: '/(sermons)',
    type: 'Intercession',
    image: images.nations,
  },
  {
    id: '3',
    title: 'Prayer for Churches',
    link: '/(sermons)',
    type: 'Intercession',
    image: images.churches,
  },
  {
    id: '4',
    title: 'Prayers for Revival',
    link: '/(sermons)',
    type: 'Intercession',
    image: images.revival,
  },
];


export default function FeaturedContent() {

  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalItems = FEATURED_CONTENT.length;

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffset / (CARD_WIDTH + CARD_MARGIN));
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newIndex = (currentIndex + 1) % totalItems;
      setCurrentIndex(newIndex);
      scrollViewRef.current?.scrollTo({
        x: newIndex * (CARD_WIDTH + CARD_MARGIN),
        animated: true,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, totalItems]);


  return (
    <View style={[styles.container, { marginHorizontal: -16 }]}>
      <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
        <Text style={styles.sectionTitle}>Featured</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {FEATURED_CONTENT.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { width: CARD_WIDTH, marginHorizontal: CARD_MARGIN / 2 }]}
            onPress={() => router.push(item.link as any)}
          >
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardType}>{item.type}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
              <View style={styles.counterContainer}>
                <Text style={styles.counterText}>
                  {`${(index % totalItems) + 1}/${totalItems}`}
                </Text>
              </View>
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
    overflow: 'visible',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Cormorant-Bold',
    fontSize: 20,
    color: '#1E293B',
  },
  scrollContent: {
    paddingHorizontal: CARD_MARGIN / 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  textContainer: {
    flex: 1,
  },
  counterContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  counterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
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