// favorites.ts
import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet,SafeAreaView } from 'react-native';
import { getVerseById } from '@/lib/database';
import { getAllFavorites, removeFavorite } from '@/lib/user_db';
import { Trash2 } from 'lucide-react-native';

type Verse = {
    id: number;
    book_name: string;
    chapter_number: number;
    verse_number: number;
    text: string;
};

type FavoriteItem = {
    id: number;
    verse_id: number | null;
    created_at: string;
    verse?: Verse;
};


export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const favoriteItems = getAllFavorites();

                const validFavorites = favoriteItems.filter(item => item.verse_id !== null);

                const favoritesWithVerses = await Promise.all(
                    validFavorites.map(async (fav) => {
                        try {
                            if (fav.verse_id) {
                                const verse = await getVerseById(fav.verse_id);
                                return { ...fav, verse };
                            }
                            return { ...fav, verse: undefined };
                        } catch (e) {
                            console.error(`Error fetching verse ${fav.verse_id}:`, e);
                            return { ...fav, verse: undefined };
                        }
                    })
                );

                const successfulFavorites = favoritesWithVerses.filter(fav => fav.verse !== undefined);

                setFavorites(successfulFavorites);

                if (successfulFavorites.length < favoriteItems.length) {
                    const failedCount = favoriteItems.length - successfulFavorites.length;
                    setError(`${failedCount} favorite(s) could not be loaded`);
                }
            } catch (error) {
                console.error('Error loading favorites:', error);
                setError('Failed to load favorites');
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading favorites...</Text>
            </View>
        );
    }

    if (favorites.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No favorites yet</Text>
            </View>
        );
    }

    const handleRemoveFavorite = (id: number) => {
        removeFavorite(id); // remove from DB
        setFavorites(prev => prev.filter(fav => fav.id !== id)); // update state
    };


    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.verseContainer}>
                        <Text style={styles.reference}>
                            {item.verse?.book_name} {item.verse?.chapter_number}:{item.verse?.verse_number}
                        </Text>
                        <Text style={styles.text}>{item.verse?.text}</Text>
                        <View style={styles.footer}>
                            <Text style={styles.date}>
                                Saved on: {new Date(item.created_at).toLocaleDateString()}
                            </Text>
                            <Trash2
                                size={16}
                                color="#0284c7"
                                style={styles.deleteIcon}
                                onPress={() => handleRemoveFavorite(item.id)}
                            />
                        </View>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    verseContainer: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    reference: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    text: {
        fontSize: 14,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deleteIcon: {
        marginLeft: 8,
    },

});

