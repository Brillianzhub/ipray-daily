// components/ChapterNavigation.tsx
import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { BibleBook } from '@/lib/database';


interface ChapterNavigationProps {
    selectedBook: BibleBook | null;
    selectedChapter: number | null;
    bibleBooks: BibleBook[];
    isTransitioning: boolean;
    handlePreviousChapter: () => void;
    handleNextChapter: () => void;
}

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
    selectedBook,
    selectedChapter,
    bibleBooks,
    isTransitioning,
    handlePreviousChapter,
    handleNextChapter
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
            <TouchableOpacity
                style={[styles.navButton, isAtFirstChapter && styles.disabledButton]}
                onPress={handlePreviousChapter}
                disabled={isAtFirstChapter || isTransitioning}
            >
                {isTransitioning ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.navButtonText}>
                        {selectedChapter && selectedChapter > 1 ? 'Previous Chapter' : 'Previous Book'}
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.navButton, isAtLastChapter && styles.disabledButton]}
                onPress={handleNextChapter}
                disabled={isAtLastChapter || isTransitioning}
            >
                {isTransitioning ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.navButtonText}>
                        {selectedChapter && selectedBook && selectedChapter < selectedBook.chapters
                            ? 'Next Chapter'
                            : 'Next Book'}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default ChapterNavigation;

const styles = StyleSheet.create({
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    navButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#cbd5e1',
    },
    navButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#0284c7',
    },
});
