import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
// import Animated from 'react-native-reanimated';
import { parseScriptureReference, getVersesRange } from '@/lib/database';
import { Prayer } from '@/lib/prayers';
import { Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = width * 0.8;
const CARD_MARGIN = 10;
const SPACER_WIDTH = (width - CARD_WIDTH) / 2 - CARD_MARGIN;


type Props = {
    item: Prayer;
    scale: Animated.AnimatedInterpolation<string | number>;
    opacity: Animated.AnimatedInterpolation<string | number>;
};

const PrayerCard = ({ item, scale, opacity }: Props) => {
    const [verseText, setVerseText] = useState<string>('');


    useEffect(() => {
        const loadVerse = async () => {
            const ref = parseScriptureReference(item.prayer_scripture);
            if (ref) {
                const { book, chapter, verseStart, verseEnd } = ref;
                const verses = await getVersesRange(book, chapter, verseStart, verseEnd);
                const combined = verses.map(v => `${v.text}`).join(' ');
                setVerseText(combined);
            }
        };

        loadVerse();
    }, [item.prayer_scripture]);

    return (
        <Animated.View style={[styles.prayerCard, { transform: [{ scale }], opacity }]}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
            >
                <View style={styles.bibleVerseContainer}>
                    <Text style={styles.bibleVerseText}>
                        <Text style={{ color: '#F59E0B' }}>{item.prayer_scripture}</Text>
                        {verseText ? ` - ${verseText}` : ''}
                    </Text>
                </View>
                <Text style={styles.prayerText}>{item.prayer}</Text>
            </ScrollView>
        </Animated.View>
    );
};

export default PrayerCard;

const styles = StyleSheet.create({
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
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bibleVerseContainer: {},
    bibleVerseText: {
        fontFamily: 'Cormorant-Regular',
        fontSize: 20,
        color: '#334155',
        fontStyle: 'italic',
        textAlign: 'justify',
    },
    verseText: {
        fontFamily: 'Cormorant-Regular',
        fontSize: 18,
        color: '#334155',
        flex: 1,
        lineHeight: 28,
    },
    prayerText: {
        fontFamily: 'Cormorant-Regular',
        fontSize: 22,
        color: '#4B5563',
        lineHeight: 28,
        marginTop: 16,
        textAlign: 'justify',
    },
})