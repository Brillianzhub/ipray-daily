import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
    Animated,
    ScrollView,
    Image,
    ListRenderItem,
} from 'react-native';
import { Prayer } from '@/lib/prayers';
import { usePrayerDatabase } from '@/hooks/usePrayers';


import React, {
    useLayoutEffect,
    useEffect,
    useState,
    useRef,
} from 'react';
import PrayerCard from '@/components/prayers/PrayerCards';

import { ArrowLeft, ArrowRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = width * 0.8;
const CARD_MARGIN = 10;
const SPACER_WIDTH = (width - CARD_WIDTH) / 2 - CARD_MARGIN;



const Prayers = () => {
    const { category } = useLocalSearchParams<{ category?: string }>();
    const [prayers, setPrayers] = useState<Prayer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState(false);
    const scrollX = useRef(new Animated.Value(0)).current;
    const { fetchPrayersByCategory } = usePrayerDatabase();


    const fetchPrayers = async () => {
        try {
            if (!refreshing) setIsLoading(true);
            const fetchedPrayers = await fetchPrayersByCategory(category as string);
            setPrayers(fetchedPrayers || []);
        } catch (error) {
            console.error('Error fetching prayers:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (typeof category === 'string') {
            fetchPrayers();
        }
    }, [category]);

    const onRefresh = async () => {
        setRefreshing(true);
        if (category) {
            const fetchedPrayers = await fetchPrayersByCategory(category);
            setPrayers(fetchedPrayers || []);
        }
        setRefreshing(false);
    };

    const renderItem: ListRenderItem<Prayer> = ({ item, index }) => {

        const inputRange = [
            (index - 1) * (CARD_WIDTH + CARD_MARGIN * 2),
            index * (CARD_WIDTH + CARD_MARGIN * 2),
            (index + 1) * (CARD_WIDTH + CARD_MARGIN * 2),
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
        });

        return <PrayerCard item={item} scale={scale} opacity={opacity} />;
    };

    if (isLoading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F59E0B" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.swipeIconLeft}>
                <ArrowLeft size={24} color="#F59E0B" />
            </View>
            <Animated.FlatList
                data={prayers}
                renderItem={renderItem}
                keyExtractor={(item) => item.prayer_number.toString()}
                horizontal
                pagingEnabled
                snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#F59E0B']}
                        progressViewOffset={20}
                    />
                }
                ListEmptyComponent={
                    <Text style={styles.noPrayersText}>No prayers found for this category.</Text>
                }
                contentContainerStyle={styles.flatListContainer}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.swipeIconRight}>
                <ArrowRight size={24} color="#F59E0B" />
            </View>
        </View>
    );
};

export default Prayers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatListContainer: {
        paddingHorizontal: SPACER_WIDTH,
        alignItems: 'center',
    },

    noPrayersText: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    swipeIconLeft: {
        position: 'absolute',
        left: 10,
        zIndex: 1,
    },
    swipeIconRight: {
        position: 'absolute',
        right: 10,
        zIndex: 1,
    },
    swipeIcon: {
        width: 24,
        height: 24,
        tintColor: '#F59E0B',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


