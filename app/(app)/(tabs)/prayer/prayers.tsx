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
import React, {
    useLayoutEffect,
    useEffect,
    useState,
    useRef,
} from 'react';
import { usePrayer } from '@/lib/api/prayerApi';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = width * 0.8;
const CARD_MARGIN = 10;
const SPACER_WIDTH = (width - CARD_WIDTH) / 2 - CARD_MARGIN;

const SWIPE_LEFT_ICON = require('../../../../assets/images/swipe-left.gif');
const SWIPE_RIGHT_ICON = require('../../../../assets/images/swipe-left.gif');

interface Prayer {
    id: number;
    text: string;
    prayer_long?: string;
    bible_verse: string;
    bible_quotation: string;
}

const Prayers = () => {
    const { title } = useLocalSearchParams<{ title?: string }>();
    // const navigation = useNavigation();
    const { isLoading, defaultPrayers, fetchPrayersByCategory } = usePrayer();

    const [refreshing, setRefreshing] = useState(false);
    const scrollX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (title) {
            fetchPrayersByCategory(title);
        }
    }, [title]);

    const onRefresh = async () => {
        setRefreshing(true);
        if (title) {
            await fetchPrayersByCategory(title);
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

        return (
            <Animated.View style={[styles.prayerCard, { transform: [{ scale }], opacity }]}>
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                >
                    <View style={styles.bibleVerseContainer}>
                        <Text style={styles.bibleVerseText}>
                            {item.bible_verse} -{' '}
                            <Text style={{ color: '#F59E0B' }}>{item.bible_quotation}</Text>
                        </Text>
                    </View>
                    <Text style={styles.prayerText}>{item.text}</Text>
                    {item.prayer_long && (
                        <Text style={styles.prayerLongText}>{item.prayer_long}</Text>
                    )}
                </ScrollView>
            </Animated.View>
        );
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
                data={defaultPrayers}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
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
    prayerCard: {
        width: CARD_WIDTH,
        height: height * 0.7,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: CARD_MARGIN,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    bibleVerseContainer: {},
    bibleVerseText: {
        fontFamily: 'Inter-Regular',
        fontSize: 18,
        color: '#4B5563',
        fontStyle: 'italic',
        textAlign: 'justify',
    },
    prayerText: {
        fontFamily: 'Inter-Regular',
        fontSize: 18,
        color: '#4B5563',
        lineHeight: 28,
        marginTop: 16,
        textAlign: 'justify',
    },
    prayerLongText: {
        marginTop: 12,
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#6B7280',
        fontStyle: 'italic',
        lineHeight: 24,
        textAlign: 'center',
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
