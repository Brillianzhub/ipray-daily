import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { fetchHymnDetails, HymnWithStanzas } from '@/lib/hymns';


export default function HymnDetail() {
    const { id } = useLocalSearchParams();
    const [hymn, setHymn] = useState<HymnWithStanzas | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadHymn = async () => {
            try {
                setLoading(true);
                const hymnId = Number(id);
                if (isNaN(hymnId)) {
                    throw new Error('Invalid hymn ID');
                }

                const hymnData = await fetchHymnDetails(hymnId);
                if (!hymnData) {
                    throw new Error('Hymn not found');
                }
                setHymn(hymnData);
            } catch (err) {
                console.error('Error loading hymn:', err);
                setError(err instanceof Error ? err.message : 'Failed to load hymn');
            } finally {
                setLoading(false);
            }
        };

        loadHymn();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }


    if (!hymn) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Hymn not found</Text>
            </View>
        );
    }

    return (
        <Animated.View
            style={styles.container}
            entering={FadeIn.duration(300)}
        >
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={styles.content}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                >
                    <Text style={styles.title}>{hymn.title}</Text>

                    <Text style={styles.author}>
                        {[hymn.author, hymn.year].filter(Boolean).join(', ')}
                    </Text>

                    {hymn.stanzas.map((stanza, stanzaIndex) => (
                        <View key={stanzaIndex} style={styles.stanzaContainer}>
                            <Text style={styles.stanzaNumber}>
                                {stanza.stanza_number}.
                            </Text>

                            <View style={styles.stanza}>
                                {stanza.text.split('\n').map((line: string, lineIndex: number) => (
                                    <Text key={lineIndex} style={styles.lyricLine}>
                                        {line || '\u00A0'}
                                    </Text>
                                ))}
                            </View>

                            {hymn.has_chorus && stanzaIndex === 0 && hymn.chorus && (
                                <View style={styles.chorusContainer}>
                                    <Text style={styles.chorusLabel}>Chorus:</Text>
                                    <View style={styles.chorus}>
                                        {hymn.chorus.split('\n').map((line: string, lineIndex: number) => (
                                            <Text key={lineIndex} style={styles.chorusLine}>
                                                {line || '\u00A0'}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}

                </ScrollView>
            </View>

        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#1E3A8A',
        marginLeft: 4,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontFamily: 'Cormorant-Bold',
        fontSize: 26,
        color: '#1E293B',
        marginBottom: 8,
        textAlign: 'center',
    },
    author: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#64748B',
        marginBottom: 24,
        textAlign: 'center',
    },

    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    navButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#1E3A8A',
    },
    navButtonTextDisabled: {
        color: '#94A3B8',
    },
    errorText: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
        marginTop: 24,
    },

    stanzaContainer: {
        marginBottom: 24,
    },

    stanzaNumber: {
        fontFamily: 'Cormorant-Bold',
        fontSize: 18,
        color: '#64748B',
        textAlign: 'left',
        marginBottom: 4,
    },

    lyricLine: {
        fontFamily: 'Cormorant-Regular',
        fontSize: 20,
        color: '#334155',
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 2,
    },

    stanza: {
        marginBottom: 12,
    },

    chorusContainer: {
        marginVertical: 8,
        // paddingHorizontal: 20,
    },

    chorusLabel: {
        fontFamily: 'Cormorant-Bold',
        fontSize: 16,
        color: '#1E3A8A',
        textAlign: 'center',
        marginBottom: 8,
    },

    chorus: {
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        paddingVertical: 12,
    },

    chorusLine: {
        fontFamily: 'Cormorant-Regular',
        fontSize: 22,
        lineHeight: 20,
        textAlign: 'center',
        color: '#334155',
    },


});

