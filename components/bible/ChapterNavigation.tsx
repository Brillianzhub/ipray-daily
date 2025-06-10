// components/ChapterNavigation.tsx
import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react-native';
import { BibleBook } from '@/lib/database';

interface ChapterNavigationProps {
    selectedBook: BibleBook | null;
    selectedChapter: number | null;
    bibleBooks: BibleBook[];
    isTransitioning: boolean;
    handlePreviousChapter: () => void;
    handleNextChapter: () => void;
    hasReachedBottom: boolean;
    handleMarkComplete: () => void;
    isChapterCompleted: boolean;
}

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
    selectedBook,
    selectedChapter,
    bibleBooks,
    isTransitioning,
    handlePreviousChapter,
    handleNextChapter,
    hasReachedBottom,
    handleMarkComplete,
    isChapterCompleted
}) => {
    const isAtFirstChapter =
        !selectedChapter ||
        (selectedChapter <= 1 && (!selectedBook || bibleBooks[0]?.id === selectedBook.id));

    const isAtLastChapter =
        !selectedChapter ||
        !selectedBook ||
        (selectedChapter >= selectedBook.chapters &&
            bibleBooks[bibleBooks.length - 1]?.id === selectedBook.id);

    return (
        <View style={styles.navigation}>
            {hasReachedBottom ? (
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        isChapterCompleted && styles.completedButton
                    ]}
                    onPress={handleMarkComplete}
                    activeOpacity={0.8}
                    disabled={isChapterCompleted}
                >
                    <CheckCircle size={20} color="#FFFFFF" style={styles.completeIcon} />
                    <Text style={styles.completeButtonText}>
                        {isChapterCompleted ? 'Completed' : 'Mark as Complete'}
                    </Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.chapterButtonsContainer}>
                    <TouchableOpacity
                        style={[styles.navButton, isAtFirstChapter && styles.disabledButton]}
                        onPress={handlePreviousChapter}
                        disabled={isAtFirstChapter || isTransitioning}
                    >
                        {isTransitioning ? (
                            <ActivityIndicator color="#0284c7" />
                        ) : (
                            <ChevronLeft size={24} color="#0284c7" />
                        )}
                    </TouchableOpacity>

                    <View style={styles.chapterInfo}>
                        <Text style={styles.chapterText}>
                            {selectedBook?.name} {selectedChapter}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.navButton, isAtLastChapter && styles.disabledButton]}
                        onPress={handleNextChapter}
                        disabled={isAtLastChapter || isTransitioning}
                    >
                        {isTransitioning ? (
                            <ActivityIndicator color="#0284c7" />
                        ) : (
                            <ChevronRight size={24} color="#0284c7" />
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default ChapterNavigation;

const styles = StyleSheet.create({
    navigation: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    chapterButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navButton: {
        padding: 12,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#cbd5e1',
    },
    chapterInfo: {
        alignItems: 'center',
    },
    chapterText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#334155',
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#0284c7',
        borderRadius: 8,
    },
    completeButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#FFFFFF',
        marginLeft: 8,
    },
    completeIcon: {
        marginRight: 8,
    },
    completedButton: {
        backgroundColor: '#10b981',
    },
});