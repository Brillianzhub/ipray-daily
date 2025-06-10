import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface Comment {
    id: number;
    verse_id: number;
    comment: string;
    created_at: string;
}

interface CommentModalProps {
    visible: boolean;
    onClose: () => void;
    comment: Comment | null;
}

export default function ReadCommentModal({ visible, onClose, comment }: CommentModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Comment</Text>
                    <Text style={styles.modalContent}>{comment?.comment || 'No comment available'}</Text>
                    {comment?.created_at && (
                        <Text style={styles.commentDate}>
                            {new Date(comment.created_at).toLocaleDateString()}
                        </Text>
                    )}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        // alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalContent: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'left',
        marginBottom: 10,
        color: '#1e3a8a',
    },
    commentDate: {
        fontSize: 12,
        color: '#64748b',
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#0284c7',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        alignItems: 'center'
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
