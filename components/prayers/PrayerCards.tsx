import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Share, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Share2, Copy, CircleArrowLeft } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';


import { parseScriptureReference, getVersesRange } from '@/lib/database';
import { Prayer } from '@/lib/prayers';
import { Animated } from 'react-native';
import { useRouter } from 'expo-router';

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

    const router = useRouter();

    const handleShare = async (text: string) => {
        try {
            await Share.share({
                message: text,
                title: 'Faith Declaration'
            });
        } catch (error: any) {
            Alert.alert('Error sharing', error.message);
        }
    };

    const handleCopy = async (text: string) => {
        try {
            await Clipboard.setStringAsync(text);
            Alert.alert('Copied to clipboard');
        } catch (error: any) {
            Alert.alert('Copy failed', error.message);
        }
    };


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
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <CircleArrowLeft size={22} color="#6B7280" />
                    </TouchableOpacity>
                    <View style={styles.rightIconsContainer}>
                        <TouchableOpacity onPress={() => handleShare(
                            `Faith Declaration - ${new Date().toLocaleDateString()}\n\n` +
                            `${item.prayer_scripture}${verseText ? ` - ${verseText}` : ''}\n\n` +
                            `${item.prayer}\n\n` +
                            `IPray Daily`
                        )}>
                            <Share2 size={22} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCopy(
                            `Faith Declaration - ${new Date().toLocaleDateString()}\n\n` +
                            `${item.prayer_scripture}${verseText ? ` - ${verseText}` : ''}\n\n` +
                            `${item.prayer}\n\n` +
                            `IPray Daily`
                        )}>
                            <Copy size={22} color="#6B7280" style={styles.copyIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.categoryContainer}>
                    <MaterialIcons name="category" size={20} color="#0284c7" />
                    <Text style={styles.categoryText}>
                        {item?.prayer_category
                            ?.toLowerCase()
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                    </Text>
                </View>
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
    },
    bibleVerseContainer: {},
    bibleVerseText: {
        fontFamily: 'Cormorant-Regular',
        fontSize: 18,
        color: '#334155',
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
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    rightIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    copyIcon: {
        marginLeft: 10,
    },

    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryText: {
        fontFamily: 'Cormorant-Bold',
        fontSize: 18,
        color: '#4B5563',
        marginLeft: 8,
    },

})