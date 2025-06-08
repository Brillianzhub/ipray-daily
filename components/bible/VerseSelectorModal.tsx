import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface VerseSelectorModalProps {
    visible: boolean;
    bookName: string;
    chapterNumber: number;
    verseCount: number;
    selectedVerse: number | null;
    onSelect: (verse: number) => void;
    onClose: () => void;
}

const VerseSelectorModal: React.FC<VerseSelectorModalProps> = ({
    visible,
    bookName,
    chapterNumber,
    verseCount,
    selectedVerse,
    onSelect,
    onClose,
}) => {
    // Create array of verses
    const verses = Array.from({ length: verseCount }, (_, i) => i + 1);

    // Group verses into rows of 6
    const verseRows = [];
    for (let i = 0; i < verses.length; i += 6) {
        verseRows.push(verses.slice(i, i + 6));
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
                    <Text style={styles.title}>
                        {bookName} {chapterNumber} - Select Verse
                    </Text>

                    <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {verseRows.map((row, rowIndex) => (
                            <View key={`row-${rowIndex}`} style={styles.verseRow}>
                                {row.map(verseNum => (
                                    <TouchableOpacity
                                        key={verseNum}
                                        style={[
                                            styles.verseButton,
                                            selectedVerse === verseNum && styles.selectedVerseButton
                                        ]}
                                        onPress={() => onSelect(verseNum)}
                                    >
                                        <Text style={[
                                            styles.verseButtonText,
                                            selectedVerse === verseNum && styles.selectedVerseButtonText
                                        ]}>
                                            {verseNum}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
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
        color: '#334155',
    },
    scrollContainer: {
        flexGrow: 0,
        marginBottom: 10,
    },
    scrollContent: {
        paddingBottom: 10,
    },
    verseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    verseButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
    },
    selectedVerseButton: {
        backgroundColor: '#0284c7',
    },
    verseButtonText: {
        fontSize: 16,
        color: '#334155',
    },
    selectedVerseButtonText: {
        color: 'white',
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

export default VerseSelectorModal;