import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Search, Plus, Calendar, Tag, Trash2, CreditCard as Edit3, Filter, Import as SortAsc } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';
import { insertNotes, getAllNotes, deleteNote, Note, toggleFavorite } from '@/lib/notes';

const NOTE_CATEGORIES = [
    { id: 'all', name: 'All Notes', color: '#64748B' },
    { id: 'sermon', name: 'Sermons', color: '#1E3A8A' },
    { id: 'meeting', name: 'Meetings', color: '#059669' },
    { id: 'study', name: 'Bible Study', color: '#7C3AED' },
    { id: 'prayer', name: 'Prayer', color: '#DC2626' },
    { id: 'personal', name: 'Personal', color: '#EA580C' },
];



export default function NotesScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [notes, setNotes] = useState<Note[]>([]);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
    const [showFilters, setShowFilters] = useState(false);
    const router = useRouter();
    const colors = useAppTheme();


    const filteredNotes = notes
        .filter(note => {
            const matchesSearch =
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory =
                selectedCategory === 'all' || note.category === selectedCategory;

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.date).getTime() - new Date(a.date).getTime(); // Newest first
            } else {
                return a.title.localeCompare(b.title); // Alphabetical
            }
        });


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };


    const loadNotes = async () => {
        try {
            const results = await getAllNotes();
            setNotes(results);
        } catch (err) {
            console.error('Failed to load notes:', err);
        }
    };

    // Refresh when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            loadNotes();
        }, [])
    );


    const getCategoryInfo = (categoryId: string) => {
        return NOTE_CATEGORIES.find(cat => cat.id === categoryId) || NOTE_CATEGORIES[0];
    };

    const handleDeleteNote = (noteId: number, noteTitle: string) => {
        Alert.alert(
            'Delete Note',
            `Are you sure you want to delete "${noteTitle}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        try {
                            deleteNote(noteId);
                            console.log('Deleting note:', noteId);
                            router.back();
                        } catch (err) {
                            console.error('Error deleting note:', err);
                        }
                    }
                }
            ]
        );
    };

    const renderNoteItem = ({ item }: { item: Note }) => {
        const categoryInfo = getCategoryInfo(item.category);

        return (
            <TouchableOpacity
                style={[styles.noteItem, { backgroundColor: colors.surface }]}
                onPress={() => router.push(`/notes/${item.id}`)}
            >
                <View style={styles.noteHeader}>
                    <View style={styles.noteTitleContainer}>
                        <Text style={[styles.noteTitle, { color: colors.text.primary }]} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <View style={styles.noteMetadata}>
                            <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color + '15' }]}>
                                <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
                                    {categoryInfo.name}
                                </Text>
                            </View>
                            <Text style={[styles.noteDate, { color: colors.text.secondary }]}>
                                {formatDate(item.date)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.noteActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => router.push(`/notes/${item.id}?edit=true`)}
                        >
                            <Edit3 size={16} color={colors.text.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleDeleteNote(item.id, item.title)}
                        >
                            <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[styles.notePreview, { color: colors.text.secondary }]} numberOfLines={3}>
                    {item.content}
                </Text>

                {item.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {item.tags.slice(0, 3).map((tag, index) => (
                            <View key={index} style={[styles.tag, { backgroundColor: colors.primary + '10' }]}>
                                <Tag size={10} color={colors.primary} />
                                <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
                            </View>
                        ))}
                        {item.tags.length > 3 && (
                            <Text style={[styles.moreTagsText, { color: colors.text.secondary }]}>
                                +{item.tags.length - 3} more
                            </Text>
                        )}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        searchContainer: {
            padding: 16,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        searchRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        searchInputContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderRadius: 12,
            paddingHorizontal: 12,
            marginRight: 12,
        },
        searchIcon: {
            marginRight: 8,
        },
        searchInput: {
            flex: 1,
            paddingVertical: 12,
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: colors.text.primary,
        },
        filterButton: {
            padding: 12,
            borderRadius: 12,
            backgroundColor: colors.background,
        },
        activeFilterButton: {
            backgroundColor: colors.primary,
        },
        sortButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: colors.background,
        },
        sortButtonText: {
            fontFamily: 'Inter-Medium',
            fontSize: 14,
            color: colors.text.secondary,
            marginLeft: 4,
        },
        categoriesContainer: {
            paddingVertical: showFilters ? 12 : 0,
            maxHeight: showFilters ? 200 : 0,
            overflow: 'hidden',
        },
        categoriesScroll: {
            paddingHorizontal: 16,
        },
        categoryButton: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginRight: 8,
            borderRadius: 20,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
        },
        selectedCategory: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        categoryButtonText: {
            fontFamily: 'Inter-Medium',
            fontSize: 14,
            color: colors.text.secondary,
        },
        selectedCategoryText: {
            color: '#FFFFFF',
        },
        statsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        statsText: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: colors.text.secondary,
        },
        notesList: {
            flex: 1,
        },
        notesListContent: {
            padding: 16,
            paddingBottom: 100,
        },
        noteItem: {
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        noteHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        noteTitleContainer: {
            flex: 1,
            marginRight: 12,
        },
        noteTitle: {
            fontFamily: 'Inter-Bold',
            fontSize: 18,
            marginBottom: 6,
        },
        noteMetadata: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        categoryBadge: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            marginRight: 8,
        },
        categoryText: {
            fontFamily: 'Inter-Medium',
            fontSize: 12,
        },
        noteDate: {
            fontFamily: 'Inter-Regular',
            fontSize: 12,
        },
        noteActions: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        actionButton: {
            padding: 8,
            marginLeft: 4,
        },
        notePreview: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            lineHeight: 20,
            marginBottom: 12,
        },
        tagsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        tag: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            marginRight: 6,
            marginBottom: 4,
        },
        tagText: {
            fontFamily: 'Inter-Medium',
            fontSize: 11,
            marginLeft: 4,
        },
        moreTagsText: {
            fontFamily: 'Inter-Regular',
            fontSize: 11,
            fontStyle: 'italic',
        },
        addButton: {
            position: 'absolute',
            bottom: 24,
            right: 24,
            backgroundColor: colors.primary,
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 6,
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 32,
        },
        emptyStateText: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: colors.text.secondary,
            textAlign: 'center',
            marginTop: 16,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchRow}>
                    <View style={styles.searchInputContainer}>
                        <Search size={20} color={colors.text.secondary} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search notes, tags, or content..."
                            placeholderTextColor={colors.text.secondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.filterButton, showFilters && styles.activeFilterButton]}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={20} color={showFilters ? '#FFFFFF' : colors.text.secondary} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setSortBy(sortBy === 'date' ? 'title' : 'date')}
                >
                    <SortAsc size={16} color={colors.text.secondary} />
                    <Text style={styles.sortButtonText}>
                        Sort by {sortBy === 'date' ? 'Date' : 'Title'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.categoriesContainer}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={NOTE_CATEGORIES}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.categoriesScroll}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.categoryButton,
                                    selectedCategory === item.id && styles.selectedCategory
                                ]}
                                onPress={() => setSelectedCategory(item.id)}
                            >
                                <Text
                                    style={[
                                        styles.categoryButtonText,
                                        selectedCategory === item.id && styles.selectedCategoryText
                                    ]}
                                >
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>

            <View style={styles.statsContainer}>
                <Text style={styles.statsText}>
                    {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                </Text>
            </View>

            {filteredNotes.length === 0 ? (
                <View style={styles.emptyState}>
                    <Search size={48} color={colors.text.secondary} />
                    <Text style={styles.emptyStateText}>
                        {searchQuery || selectedCategory !== 'all'
                            ? 'No notes match your search criteria'
                            : 'No notes yet. Tap the + button to create your first note!'
                        }
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredNotes}
                    renderItem={renderNoteItem}
                    keyExtractor={item => item.id.toString()}
                    style={styles.notesList}
                    contentContainerStyle={styles.notesListContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/notes/new')}
            >
                <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}