import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Save, Tag } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { insertNotes } from '@/lib/notes';


const NOTE_CATEGORIES = [
    { id: 'sermon', name: 'Sermons', color: '#1E3A8A' },
    { id: 'meeting', name: 'Meetings', color: '#059669' },
    { id: 'study', name: 'Bible Study', color: '#7C3AED' },
    { id: 'prayer', name: 'Prayer', color: '#DC2626' },
    { id: 'personal', name: 'Personal', color: '#EA580C' },
];

export default function NewNote() {
    const router = useRouter();
    const colors = useAppTheme();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('personal');
    const [tags, setTags] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const titleInputRef = useRef<TextInput>(null);
    const contentInputRef = useRef<TextInput>(null);

    useEffect(() => {
        setTimeout(() => {
            titleInputRef.current?.focus();
        }, 100);
    }, []);


    const handleSaveNote = () => {
        if (!category) return;

        if (!title.trim()) {
            Alert.alert('Missing Title', 'Please enter a title for your note.');
            titleInputRef.current?.focus();
            return;
        }

        if (!content.trim()) {
            Alert.alert('Empty Note', 'Please add some content to your note.');
            contentInputRef.current?.focus();
            return;
        }

        setIsSaving(true);

        const newNote = {
            title: title.trim(),
            content: content.trim(),
            category,
            date: new Date().toISOString(),
            tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
            is_favorite: false,
        };

        try {
            insertNotes([newNote]);
            Alert.alert(
                'Note Saved!',
                'Your note has been saved successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (err) {
            console.error('Error saving note:', err);
            Alert.alert('Error', 'Failed to save note. Please try again.');
        } finally {
            setIsSaving(false)
        }
    };


    const handleDiscard = () => {
        if (title.trim() || content.trim()) {
            Alert.alert(
                'Discard Note',
                'Are you sure you want to discard this note? All changes will be lost.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => router.back()
                    }
                ]
            );
        } else {
            router.back();
        }
    };

    const getCategoryInfo = (categoryId: string) => {
        return NOTE_CATEGORIES.find(cat => cat.id === categoryId) || NOTE_CATEGORIES[0];
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.surface,
        },
        headerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
        },
        cancelButton: {
            backgroundColor: colors.background,
        },
        saveButton: {
            backgroundColor: colors.primary,
        },
        disabledSaveButton: {
            backgroundColor: colors.text.secondary,
            opacity: 0.5,
        },
        headerButtonText: {
            fontFamily: 'Inter-Medium',
            fontSize: 16,
            marginLeft: 4,
        },
        cancelButtonText: {
            color: colors.text.secondary,
        },
        saveButtonText: {
            color: '#FFFFFF',
        },
        content: {
            flex: 1,
        },
        formContainer: {
            padding: 16,
        },
        titleContainer: {
            marginBottom: 20,
        },
        titleInput: {
            fontFamily: 'Cormorant-Bold',
            fontSize: 28,
            color: colors.text.primary,
            borderBottomWidth: 2,
            borderBottomColor: colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 4,
        },
        section: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        sectionTitle: {
            fontFamily: 'Inter-Bold',
            fontSize: 16,
            color: colors.text.primary,
            marginBottom: 12,
        },
        categorySelector: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        categoryOption: {
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 16,
            marginRight: 8,
            marginBottom: 8,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
        },
        selectedCategoryOption: {
            borderColor: colors.primary,
            backgroundColor: colors.primary + '15',
        },
        categoryOptionText: {
            fontFamily: 'Inter-Medium',
            fontSize: 14,
            color: colors.text.secondary,
        },
        selectedCategoryOptionText: {
            color: colors.primary,
        },
        tagsInput: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: colors.text.primary,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: colors.background,
            minHeight: 44,
        },
        tagsHint: {
            fontFamily: 'Inter-Regular',
            fontSize: 12,
            color: colors.text.secondary,
            marginTop: 6,
            fontStyle: 'italic',
        },
        contentInput: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: colors.text.primary,
            lineHeight: 24,
            textAlignVertical: 'top',
            minHeight: 200,
        },
        quickActions: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.surface,
        },
        quickActionButton: {
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 16,
        },
        quickActionText: {
            fontFamily: 'Inter-Medium',
            fontSize: 12,
            color: colors.text.secondary,
            marginTop: 4,
        },
        wordCount: {
            textAlign: 'center',
            fontFamily: 'Inter-Regular',
            fontSize: 12,
            color: colors.text.secondary,
            paddingVertical: 8,
        },
    });

    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const canSave = title.trim() && content.trim() && !isSaving;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.headerButton, styles.cancelButton]}
                    onPress={handleDiscard}
                >
                    <X size={20} color={colors.text.secondary} />
                    <Text style={[styles.headerButtonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.headerButton,
                        styles.saveButton,
                        !canSave && styles.disabledSaveButton
                    ]}
                    onPress={handleSaveNote}
                    disabled={!canSave}
                >
                    <Save size={20} color="#FFFFFF" />
                    <Text style={[styles.headerButtonText, styles.saveButtonText]}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.formContainer}>
                <View style={styles.titleContainer}>
                    <TextInput
                        ref={titleInputRef}
                        style={styles.titleInput}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Note title..."
                        placeholderTextColor={colors.text.secondary}
                        returnKeyType="next"
                        onSubmitEditing={() => contentInputRef.current?.focus()}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Category</Text>
                    <View style={styles.categorySelector}>
                        {NOTE_CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryOption,
                                    category === cat.id && styles.selectedCategoryOption
                                ]}
                                onPress={() => setCategory(cat.id)}
                            >
                                <Text
                                    style={[
                                        styles.categoryOptionText,
                                        category === cat.id && styles.selectedCategoryOptionText
                                    ]}
                                >
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tags</Text>
                    <TextInput
                        style={styles.tagsInput}
                        value={tags}
                        onChangeText={setTags}
                        placeholder="faith, service, community..."
                        placeholderTextColor={colors.text.secondary}
                        returnKeyType="next"
                        onSubmitEditing={() => contentInputRef.current?.focus()}
                    />
                    <Text style={styles.tagsHint}>
                        Separate tags with commas to help organize and find your notes later
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Content</Text>
                    <TextInput
                        ref={contentInputRef}
                        style={styles.contentInput}
                        value={content}
                        onChangeText={setContent}
                        placeholder="Start writing your note here..."
                        placeholderTextColor={colors.text.secondary}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {content.trim() && (
                    <Text style={styles.wordCount}>
                        {wordCount} {wordCount === 1 ? 'word' : 'words'}
                    </Text>
                )}
            </ScrollView>

            <View style={styles.quickActions}>
                <TouchableOpacity
                    style={styles.quickActionButton}
                    onPress={() => {
                        const bulletPoint = content ? '\n• ' : '• ';
                        setContent(content + bulletPoint);
                        contentInputRef.current?.focus();
                    }}
                >
                    <Text style={styles.quickActionText}>• Bullet</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quickActionButton}
                    onPress={() => {
                        const timestamp = new Date().toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        const timeNote = content ? `\n[${timestamp}] ` : `[${timestamp}] `;
                        setContent(content + timeNote);
                        contentInputRef.current?.focus();
                    }}
                >
                    <Text style={styles.quickActionText}>🕐 Time</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quickActionButton}
                    onPress={() => {
                        const actionItem = content ? '\n☐ ' : '☐ ';
                        setContent(content + actionItem);
                        contentInputRef.current?.focus();
                    }}
                >
                    <Text style={styles.quickActionText}>☐ Task</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}