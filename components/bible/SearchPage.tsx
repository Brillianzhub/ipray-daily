import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Verse } from '@/lib/database';
import { handleSearch } from '@/utils/handleSearch';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Verse[]>([]);
    const [loading, setLoading] = useState(false);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search verses..."
                value={query}
                onChangeText={setQuery}
                style={styles.input}
                onSubmitEditing={() => handleSearch(query, setResults, setLoading)}
                returnKeyType="search"
            />

            <FlatList
                data={results}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.resultItem}>
                        <Text style={styles.verseText}>
                            {item.book_name} {item.chapter_number}:{item.verse_number} - {item.text}
                        </Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.resultsContainer}
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
    },
    resultsContainer: {
        paddingBottom: 16,
    },
    resultItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    verseText: {
        fontSize: 14,
        color: '#1E293B',
    },
});