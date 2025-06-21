import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Share } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { ChevronLeft, CreditCard as Edit3, Save, X, Share2, Trash2, Tag, Calendar, Heart } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { insertNotes, updateNote, getAllNotes, Note, deleteNote, toggleFavorite } from '@/lib/notes';


const NOTE_CATEGORIES = [
    { id: 'sermon', name: 'Sermons', color: '#1E3A8A' },
    { id: 'meeting', name: 'Meetings', color: '#059669' },
    { id: 'study', name: 'Bible Study', color: '#7C3AED' },
    { id: 'prayer', name: 'Prayer', color: '#DC2626' },
    { id: 'personal', name: 'Personal', color: '#EA580C' },
];


export default function NoteDetail() {
    const { id, edit } = useLocalSearchParams();
    const router = useRouter();
    const colors = useAppTheme();

    const [notes, setNotes] = useState<Note[]>([])

    const numericNoteId = id ? parseInt(id as string, 10) : undefined;

    const note = notes.find(n => n.id === numericNoteId);
    const [isEditing, setIsEditing] = useState(edit === 'true');
    const [editedTitle, setEditedTitle] = useState(note?.title || '');
    const [editedContent, setEditedContent] = useState(note?.content || '');
    const [editedCategory, setEditedCategory] = useState(note?.category || 'personal');
    const [editedTags, setEditedTags] = useState(note?.tags.join(', ') || '');
    const [isFavorite, setIsFavorite] = useState(note?.is_favorite || false);

    const contentInputRef = useRef<TextInput>(null);

    const loadNotes = async () => {
        try {
            const results = await getAllNotes();
            setNotes(results);
        } catch (err) {
            console.error('Failed to load notes:', err);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadNotes();
        }, [])
    );


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
        backButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        backText: {
            fontFamily: 'Inter-Medium',
            fontSize: 16,
            color: colors.primary,
            marginLeft: 4,
        },
        headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        actionButton: {
            padding: 8,
            marginLeft: 8,
        },
        content: {
            flex: 1,
        },
        noteContainer: {
            padding: 16,
        },
        titleContainer: {
            marginBottom: 16,
        },
        titleInput: {
            fontFamily: 'Cormorant-Bold',
            fontSize: 28,
            color: colors.text.primary,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingVertical: 8,
            marginBottom: 8,
        },
        title: {
            fontFamily: 'Cormorant-Bold',
            fontSize: 28,
            color: colors.text.primary,
            marginBottom: 8,
        },
        metadata: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: 16,
        },
        categoryBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            marginRight: 12,
            marginBottom: 8,
        },
        categoryText: {
            fontFamily: 'Inter-Medium',
            fontSize: 14,
            marginLeft: 4,
        },
        dateContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        dateText: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: colors.text.secondary,
            marginLeft: 4,
        },
        favoriteButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            backgroundColor: colors.background,
            marginLeft: 'auto',
        },
        favoriteText: {
            fontFamily: 'Inter-Medium',
            fontSize: 14,
            color: colors.text.secondary,
            marginLeft: 4,
        },
        contentContainer: {
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
        contentInput: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: colors.text.primary,
            lineHeight: 24,
            textAlignVertical: 'top',
            minHeight: 200,
        },
        contentText: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: colors.text.primary,
            lineHeight: 24,
        },
        editingSection: {
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
            marginBottom: 16,
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
            paddingVertical: 8,
            backgroundColor: colors.background,
        },
        tagsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: 16,
        },
        tag: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 12,
            backgroundColor: colors.primary + '15',
            marginRight: 8,
            marginBottom: 8,
        },
        tagText: {
            fontFamily: 'Inter-Medium',
            fontSize: 12,
            color: colors.primary,
            marginLeft: 4,
        },
        saveButton: {
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            marginHorizontal: 16,
            marginBottom: 16,
        },
        saveButtonText: {
            fontFamily: 'Inter-Bold',
            fontSize: 16,
            color: '#FFFFFF',
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        errorText: {
            fontFamily: 'Inter-Medium',
            fontSize: 16,
            color: colors.text.secondary,
        },
    });

    if (!note) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <ChevronLeft size={24} color={colors.primary} />
                        <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: colors.text.secondary }]}>Note not found</Text>
                </View>
            </View>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCategoryInfo = (categoryId: string) => {
        return NOTE_CATEGORIES.find(cat => cat.id === categoryId) || NOTE_CATEGORIES[0];
    };

    const handleSave = () => {
        if (!editedTitle.trim()) {
            Alert.alert('Error', 'Please enter a title for your note.');
            return;
        }

        // Here you would implement the actual save logic
        console.log('Saving note:', {
            title: editedTitle,
            content: editedContent,
            category: editedCategory,
            tags: editedTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        });

        setIsEditing(false);
        Alert.alert('Success', 'Note saved successfully!');
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${note.title}\n\n${note.content}`,
                title: note.title,
            });
        } catch (error) {
            console.error('Error sharing note:', error);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        // Here you would implement the actual delete logic
                        console.log('Deleting note:', id);
                        router.back();
                    }
                }
            ]
        );
    };

    const categoryInfo = getCategoryInfo(isEditing ? editedCategory : note.category);



    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        if (isEditing) {
                            Alert.alert(
                                'Discard Changes',
                                'Are you sure you want to discard your changes?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Discard',
                                        style: 'destructive',
                                        onPress: () => {
                                            setIsEditing(false);
                                            setEditedTitle(note.title);
                                            setEditedContent(note.content);
                                            setEditedCategory(note.category);
                                            setEditedTags(note.tags.join(', '));
                                        }
                                    }
                                ]
                            );
                        } else {
                            router.back();
                        }
                    }}
                    style={styles.backButton}
                >
                    {isEditing ? (
                        <>
                            <X size={24} color={colors.primary} />
                            <Text style={styles.backText}>Cancel</Text>
                        </>
                    ) : (
                        <>
                            <ChevronLeft size={24} color={colors.primary} />
                            <Text style={styles.backText}>Back</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    {!isEditing && (
                        <>
                            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                                <Share2 size={20} color={colors.text.secondary} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={() => setIsEditing(true)}>
                                <Edit3 size={20} color={colors.text.secondary} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                                <Trash2 size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.noteContainer}>
                <View style={styles.titleContainer}>
                    {isEditing ? (
                        <TextInput
                            style={styles.titleInput}
                            value={editedTitle}
                            onChangeText={setEditedTitle}
                            placeholder="Note title..."
                            placeholderTextColor={colors.text.secondary}
                            multiline
                        />
                    ) : (
                        <Text style={styles.title}>{note.title}</Text>
                    )}
                </View>

                <View style={styles.metadata}>
                    <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color + '15' }]}>
                        <Tag size={14} color={categoryInfo.color} />
                        <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
                            {categoryInfo.name}
                        </Text>
                    </View>

                    <View style={styles.dateContainer}>
                        <Calendar size={14} color={colors.text.secondary} />
                        <Text style={styles.dateText}>{formatDate(note.date)}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => setIsFavorite(!isFavorite)}
                    >
                        <Heart
                            size={16}
                            color={isFavorite ? '#EF4444' : colors.text.secondary}
                            fill={isFavorite ? '#EF4444' : 'transparent'}
                        />
                        <Text style={styles.favoriteText}>
                            {isFavorite ? 'Favorited' : 'Add to Favorites'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {isEditing && (
                    <View style={styles.editingSection}>
                        <Text style={styles.sectionTitle}>Category</Text>
                        <View style={styles.categorySelector}>
                            {NOTE_CATEGORIES.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        styles.categoryOption,
                                        editedCategory === category.id && styles.selectedCategoryOption
                                    ]}
                                    onPress={() => setEditedCategory(category.id)}
                                >
                                    <Text
                                        style={[
                                            styles.categoryOptionText,
                                            editedCategory === category.id && styles.selectedCategoryOptionText
                                        ]}
                                    >
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.sectionTitle}>Tags (comma separated)</Text>
                        <TextInput
                            style={styles.tagsInput}
                            value={editedTags}
                            onChangeText={setEditedTags}
                            placeholder="faith, service, community..."
                            placeholderTextColor={colors.text.secondary}
                        />
                    </View>
                )}

                <View style={styles.contentContainer}>
                    {isEditing ? (
                        <TextInput
                            ref={contentInputRef}
                            style={styles.contentInput}
                            value={editedContent}
                            onChangeText={setEditedContent}
                            placeholder="Start writing your note..."
                            placeholderTextColor={colors.text.secondary}
                            multiline
                            textAlignVertical="top"
                        />
                    ) : (
                        <Text style={styles.contentText}>{note.content}</Text>
                    )}
                </View>

                {!isEditing && note.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {note.tags.map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <Tag size={12} color={colors.primary} />
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {isEditing && (
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Note</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}