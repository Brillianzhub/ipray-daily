import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';

interface ChapterSelectorModalProps {
    visible: boolean;
    bookName: string;
    chapterCount: number;
    selectedChapter: number;
    onSelect: (chapter: number) => void;
    onClose: () => void;
}

const ChapterSelectorModal: React.FC<ChapterSelectorModalProps> = ({
    visible,
    bookName,
    chapterCount,
    selectedChapter,
    onSelect,
    onClose,
}) => {
    // Create array of chapters
    const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

    // Group chapters into rows of 6
    const chapterRows = [];
    for (let i = 0; i < chapters.length; i += 6) {
        chapterRows.push(chapters.slice(i, i + 6));
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Select Chapter for {bookName}</Text>

                    <ScrollView
                        style={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {chapterRows.map((row, rowIndex) => (
                            <View key={`row-${rowIndex}`} style={styles.chapterRow}>
                                {row.map(chapterNum => (
                                    <TouchableOpacity
                                        key={chapterNum}
                                        style={[
                                            styles.chapterButton,
                                            selectedChapter === chapterNum && styles.selectedChapterButton
                                        ]}
                                        onPress={() => onSelect(chapterNum)}
                                    >
                                        <Text style={styles.chapterButtonText}>{chapterNum}</Text>
                                    </TouchableOpacity>
                                ))}
                                {/* Fill remaining spaces if row has less than 6 items */}
                                {row.length < 6 && Array(6 - row.length).fill(0).map((_, index) => (
                                    <View key={`empty-${index}`} style={styles.emptyButton} />
                                ))}
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '70%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    scrollContainer: {
        flexGrow: 0,
        marginBottom: 10,
    },
    chapterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    chapterButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
    },
    emptyButton: {
        width: 50,
        height: 50,
    },
    selectedChapterButton: {
        backgroundColor: '#0284c7',
    },
    chapterButtonText: {
        fontSize: 16,
        color: '#000',
    },
    selectedChapterButtonText: {
        color: '#fff',
    },
    closeButton: {
        marginTop: 10,
        padding: 12,
        backgroundColor: '#e2e8f0',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#334155',
        fontWeight: '500',
    },
});

export default ChapterSelectorModal;