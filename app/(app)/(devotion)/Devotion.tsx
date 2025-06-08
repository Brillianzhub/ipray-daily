import { StyleSheet, Text, View, ScrollView, Platform, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useDevotion } from '@/lib/api/devotionApi';
import NavigationControls from './NavigationControl';
import { router, useLocalSearchParams } from 'expo-router';
import RecommededVideos from './RecommendedVideos';


const Devotional: React.FC = () => {
    const { date } = useLocalSearchParams<{ date?: string }>();

    const parsedDate = date
        ? (typeof date === 'string' ? new Date(date.replace(/\./g, '-')) : new Date())
        : new Date();

    const [currentDate, setCurrentDate] = useState(parsedDate);
    const [refreshing, setRefreshing] = useState(false);

    const { devotion, isLoading, error, fetchDevotionByDate } = useDevotion();

    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    useEffect(() => {
        if (currentDate) {
            fetchDevotionByDate(currentDate.toISOString().split('T')[0]);
        }
    }, [currentDate]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDevotionByDate(currentDate.toISOString().split('T')[0]);
        setRefreshing(false);
    };

    const handleSearch = (date: string) => {
        if (!date) return;
        fetchDevotionByDate(date);
        setCurrentDate(new Date(date));
    };

    const handleNext = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setCurrentDate(nextDate);
        fetchDevotionByDate(nextDate.toISOString().split('T')[0]);
    };

    const handlePrevious = () => {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        setCurrentDate(prevDate);
        fetchDevotionByDate(prevDate.toISOString().split('T')[0]);
    };

    const handleNavToTimeTable = () => {
        router.replace('/TimeTable')
    }

    if (isLoading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F59E0B" />
            </View>
        );
    }

    if (!devotion) {
        return (
            <View style={styles.container}>
                <Text>No devotional data available.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F59E0B']} />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollViewContent}
                >
                    <View style={styles.content}>
                        <Text style={styles.title}>{devotion.title}</Text>
                        <Text style={styles.dateText}>{formattedDate}</Text>
                        <Text style={styles.theme}>Theme: {devotion.theme}</Text>
                        <View style={styles.bibleVerseContainer}>
                            <Text style={styles.bibleVerseText}>{devotion.bible_verse_text}</Text>
                            <Text style={[styles.bibleVerseText, { color: '#F59E0B' }]}>{devotion.bible_verse_reference}</Text>
                        </View>
                        <Text style={styles.devotionText}>{devotion.devotion}</Text>
                        <Text style={styles.sectionHeading}>Reflection Questions:</Text>
                        {devotion.reflectionQuestions?.map((question, index) => (
                            <Text key={index} style={styles.questionText}>
                                {`\u2022 ${question}`}
                            </Text>
                        ))}
                        <Text style={styles.sectionHeading}>Prayer:</Text>
                        <Text style={styles.prayerText}>{devotion.prayer}</Text>
                        <Text style={styles.sectionHeading}>Challenge:</Text>
                        <Text style={styles.challengeText}>{devotion.family_challenge}</Text>
                    </View>

                    <RecommededVideos devotionDate={devotion.devotional_date} />
                </ScrollView>

                <NavigationControls
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onSearch={handleSearch}
                    onTimetable={handleNavToTimeTable}
                    selectedDate={currentDate}
                />
            </View>
        </SafeAreaView>
    );
};

export default Devotional;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F3F4F6', // or whatever background color you want
    },
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        position: 'relative',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 80,
    },
    content: {
        padding: 16,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 22,
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    dateText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 16,
    },
    theme: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#4B5563',
        textAlign: 'center',
        marginBottom: 20,
    },
    bibleVerseContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        ...Platform.select({
            web: {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            default: {
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
        }),
    },
    bibleVerseText: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#4B5563',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    devotionText: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
        marginBottom: 20,
        textAlign: 'justify'
    },
    sectionHeading: {
        fontFamily: 'Inter-Bold',
        fontSize: 18,
        color: '#1F2937',
        marginBottom: 12,
    },
    questionText: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#4B5563',
        marginBottom: 8,
        lineHeight: 24,
        textAlign: 'justify'
    },
    prayerText: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#4B5563',
        fontStyle: 'italic',
        marginBottom: 20,
        lineHeight: 24,
        textAlign: 'justify'
    },
    challengeText: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
        textAlign: 'justify'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    navigationControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});