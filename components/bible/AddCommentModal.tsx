import { useState } from 'react';
import {
    Modal,
    TextInput,
    Button,
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { addComment, updateComment } from '@/lib/user_db';

type CommentModalProps = {
    visible: boolean;
    onClose: () => void;
    verseId: number;
    existingComment?: { id: number; text: string } | null;
};

export default function CommentModal({
    visible,
    onClose,
    verseId,
    existingComment,
}: CommentModalProps) {
    const [commentText, setCommentText] = useState(existingComment?.text || '');

    const handleSave = () => {
        if (existingComment) {
            updateComment(existingComment.id, commentText);
        } else {
            addComment(verseId, commentText);
        }
        setCommentText('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.label}>
                        {existingComment ? 'Edit Comment' : 'Add Comment'}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your comment"
                        multiline
                        value={commentText}
                        onChangeText={setCommentText}
                    />
                    <View style={styles.buttonRow}>
                        <Button title="Cancel" onPress={onClose} />
                        <Button title="Save" onPress={handleSave} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 20,
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        padding: 8,
        marginBottom: 12,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
