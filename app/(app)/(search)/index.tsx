import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { searchVerses, Verse } from '@/lib/database';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Verse[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchOptions, setSearchOptions] = useState({
        exactPhrase: false,
        matchAllWords: false,
        version: 'KJV' as const,
    });
    const searchTimeoutRef = useRef<number | null>(null);

    // Debounced search with 500ms delay
    // In your useEffect:
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);

        // Clear existing timeout
        if (searchTimeoutRef.current !== null) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const searchResults = await searchVerses(query, 50, searchOptions.version, {
                    exactPhrase: searchOptions.exactPhrase,
                    matchAllWords: searchOptions.matchAllWords
                });
                setResults(searchResults);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        }, 500) as unknown as number; // Type assertion if needed

        // Cleanup
        return () => {
            if (searchTimeoutRef.current !== null) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [query, searchOptions]);

    const handleSearchOptionToggle = (option: keyof typeof searchOptions) => {
        setSearchOptions(prev => ({
            ...prev,
            [option]: !prev[option],
            // Ensure mutually exclusive options
            ...(option === 'exactPhrase' && { matchAllWords: false }),
            ...(option === 'matchAllWords' && { exactPhrase: false }),
        }));
    };

    const handleVersePress = (verse: Verse) => {
        Keyboard.dismiss();
        // Navigate to verse or show details
        console.log('Selected verse:', verse);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search Bible verses..."
                value={query}
                onChangeText={setQuery}
                style={styles.input}
                returnKeyType="search"
                clearButtonMode="while-editing"
            />

            {/* Search Options Toggle */}
            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={[styles.optionButton, searchOptions.exactPhrase && styles.activeOption]}
                    onPress={() => handleSearchOptionToggle('exactPhrase')}
                >
                    <Text style={styles.optionText}>Exact Phrase</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionButton, searchOptions.matchAllWords && styles.activeOption]}
                    onPress={() => handleSearchOptionToggle('matchAllWords')}
                >
                    <Text style={styles.optionText}>All Words</Text>
                </TouchableOpacity>

                {/* Add version selector if needed */}
            </View>

            {/* Loading Indicator */}
            {loading && <ActivityIndicator style={styles.loader} color="#1E3A8A" />}

            {/* Results */}
            {!loading && results.length > 0 && (
                <Text style={styles.resultsCount}>
                    {results.length} {results.length === 1 ? 'result' : 'results'}
                </Text>
            )}


            <FlatList
                data={results}
                keyExtractor={(item) => `${item.book_name}-${item.chapter_number}-${item.verse_number}`}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() => handleVersePress(item)}
                    >
                        <Text style={styles.verseReference}>
                            {item.book_name} {item.chapter_number}:{item.verse_number}
                        </Text>
                        <Text style={styles.verseText}>{item.text}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.resultsContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                    !loading && query.length >= 2 ? (
                        <Text style={styles.noResults}>No results found</Text>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    input: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    optionsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    optionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: '#E2E8F0',
    },
    activeOption: {
        backgroundColor: '#2563EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    optionText: {
        fontSize: 14,
        color: '#1E293B',
    },
    activeOptionText: {
        color: '#FFFFFF',
    },
    resultsContainer: {
        paddingBottom: 16,
    },
    resultItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    verseReference: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 4,
    },
    verseText: {
        fontSize: 16,
        color: '#1E293B',
        lineHeight: 22,
    },
    loader: {
        marginVertical: 8,
    },
    resultsCount: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 8,
    },
    noResults: {
        textAlign: 'center',
        color: '#64748B',
        marginTop: 16,
    },
});