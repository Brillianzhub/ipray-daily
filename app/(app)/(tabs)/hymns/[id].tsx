import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { SAMPLE_HYMNS } from '@/lib/data';
import { GestureDetector, Gesture, Directions } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function HymnDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const currentIndex = SAMPLE_HYMNS.findIndex(hymn => hymn.id === id);
    const hymn = SAMPLE_HYMNS[currentIndex];

    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < SAMPLE_HYMNS.length - 1;

    const navigateToPrevious = () => {
        if (hasPrevious) {
            router.replace({
                pathname: '/hymns/[id]',
                params: { id: SAMPLE_HYMNS[currentIndex - 1].id }
            });
        }
    };

    const navigateToNext = () => {
        if (hasNext) {
            router.replace({
                pathname: '/hymns/[id]',
                params: { id: SAMPLE_HYMNS[currentIndex + 1].id }
            });
        }
    };

    const swipeGesture = Gesture.Fling()
        .direction(Directions.RIGHT | Directions.LEFT)
        .onEnd((e: any) => {
            const direction = e.direction;
            if (direction === Directions.LEFT && hasNext) {
                navigateToNext();
            } else if (direction === Directions.RIGHT && hasPrevious) {
                navigateToPrevious();
            }
        });

    if (!hymn) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Hymn not found</Text>
            </View>
        );
    }

    return (
        <GestureDetector gesture={swipeGesture}>
            <Animated.View
                style={styles.container}
                entering={FadeIn.duration(300)}
            >
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={styles.content}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                    >
                        <Text style={styles.title}>{hymn.title}</Text>
                        <Text style={styles.author}>
                            {hymn.author}, {hymn.year}
                        </Text>

                        <View style={styles.lyricsContainer}>
                            {hymn.lyrics.map((line, index) => (
                                <Text key={index} style={styles.lyricLine}>
                                    {line || '\u00A0'}
                                </Text>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Navigation Buttons */}
                <View style={styles.navigation}>
                    <TouchableOpacity
                        style={[styles.navButton, !hasPrevious && styles.navButtonDisabled]}
                        onPress={navigateToPrevious}
                        disabled={!hasPrevious}
                    >
                        <ChevronLeft size={20} color={hasPrevious ? "#1E3A8A" : "#94A3B8"} />
                        <Text style={[styles.navButtonText, !hasPrevious && styles.navButtonTextDisabled]}>
                            Previous
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.navButton, !hasNext && styles.navButtonDisabled]}
                        onPress={navigateToNext}
                        disabled={!hasNext}
                    >
                        <Text style={[styles.navButtonText, !hasNext && styles.navButtonTextDisabled]}>
                            Next
                        </Text>
                        <ChevronRight size={20} color={hasNext ? "#1E3A8A" : "#94A3B8"} />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#1E3A8A',
        marginLeft: 4,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontFamily: 'Cormorant-Bold',
        fontSize: 32,
        color: '#1E293B',
        marginBottom: 8,
        textAlign: 'center',
    },
    author: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#64748B',
        marginBottom: 24,
        textAlign: 'center',
    },
    lyricsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    lyricLine: {
        fontFamily: 'Cormorant-Regular',
        fontSize: 20,
        color: '#334155',
        lineHeight: 32,
        marginBottom: 8,
        textAlign: 'center',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    navButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#1E3A8A',
    },
    navButtonTextDisabled: {
        color: '#94A3B8',
    },
    errorText: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
        marginTop: 24,
    },
});