import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { Search, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useHymns } from '@/lib/api/hymnsApi';

export default function HymnsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const { hymns, isLoading, error, fetchHymns } = useHymns();

    const hymnsWithFavorites = hymns?.map(hymn => ({
        ...hymn,
        favorite: false // You can wire this up to local storage later
    })) || [];

    const filteredHymns = hymnsWithFavorites.filter(hymn => {
        const matchesSearch = hymn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (hymn.author?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? false);
        const matchesFavorite = showFavoritesOnly ? hymn.favorite : true;
        return matchesSearch && matchesFavorite;
    });

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchHymns();
        } catch (err) {
            console.error('Error refreshing hymns:', err);
        } finally {
            setRefreshing(false);
        }
    };

    const renderHymnItem = ({ item }: { item: typeof hymnsWithFavorites[number] }) => (
        <TouchableOpacity
            style={styles.hymnItem}
            onPress={() => router.push({
                pathname: '/hymns/[id]',
                params: { id: item.id.toString() }
            })}
        >
            <View style={styles.hymnContent}>
                <View style={styles.hymnDetails}>
                    <Text style={styles.hymnTitle}>{item.title}</Text>
                    <Text style={styles.hymnAuthor}>{item.author}, {item.year}</Text>
                </View>

                <View style={styles.hymnActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Star
                            size={20}
                            color={item.favorite ? '#B45309' : '#94A3B8'}
                            fill={item.favorite ? '#B45309' : 'transparent'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Search size={20} color="#64748B" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by title or author"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, showFavoritesOnly && styles.filterButtonActive]}
                    onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
                >
                    <Star
                        size={16}
                        color={showFavoritesOnly ? '#B45309' : '#64748B'}
                        fill={showFavoritesOnly ? '#B45309' : 'transparent'}
                    />
                    <Text style={[styles.filterButtonText, showFavoritesOnly && styles.filterButtonTextActive]}>
                        Favorites
                    </Text>
                </TouchableOpacity>

                <Text style={styles.resultCount}>{filteredHymns.length} hymns</Text>
            </View>

            {isLoading && !refreshing ? (
                <ActivityIndicator size="large" color="#6B7280" style={{ marginTop: 20 }} />
            ) : error ? (
                <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
            ) : (
                <FlatList
                    data={filteredHymns}
                    renderItem={renderHymnItem}
                    keyExtractor={item => item.id.toString()}
                    style={styles.hymnsList}
                    contentContainerStyle={styles.hymnsListContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#1E3A8A']}
                            tintColor="#1E3A8A"
                        />
                    }
                />
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    searchContainer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#334155',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
    },
    filterButtonActive: {
        backgroundColor: '#FEF3C7',
    },
    filterButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#64748B',
        marginLeft: 6,
    },
    filterButtonTextActive: {
        color: '#B45309',
    },
    resultCount: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#64748B',
    },
    hymnsList: {
        flex: 1,
    },
    hymnsListContent: {
        padding: 16,
    },
    hymnItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
    },
    hymnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    hymnDetails: {
        flex: 1,
    },
    hymnTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        color: '#1E293B',
        marginBottom: 4,
    },
    hymnAuthor: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#64748B',
    },
    hymnActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        marginLeft: 16,
    },
});