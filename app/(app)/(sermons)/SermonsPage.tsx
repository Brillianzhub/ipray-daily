import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Linking,
    ActivityIndicator,
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useSermons } from '@/lib/api/sermonsApi';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns/format';


interface Sermon {
    id: string | number;
    title: string;
    preacher: string;
    source: string;
    description?: string;
    url: string;
    date_published: string;
    message?: string;
}

const SermonsPage: React.FC = () => {
    const { category, title } = useLocalSearchParams<{
        category?: string;
        title?: string;
    }>();

    const navigation = useNavigation<any>();

    const { sermons, fetchSermonsByCategory, isLoading, error } = useSermons();

    const [expandedId, setExpandedId] = useState<string | number | null>(null);

    useLayoutEffect(() => {
        if (title) {
            navigation.setOptions({ title });
        }

        if (category) {
            fetchSermonsByCategory(category);
        }
    }, [navigation, title, category]);

    const toggleExpand = (id: string | number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const openYoutube = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMMM d, yyyy');
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text>Error loading sermons: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {sermons.length === 0 ? (
                <Text style={styles.emptyText}>No sermons found in this category</Text>
            ) : (
                <FlatList
                    data={sermons ?? []}
                    keyExtractor={(item: Sermon) => item.id.toString()}
                    renderItem={({ item }: { item: Sermon }) => (
                        <View style={styles.sermonItemContainer}>
                            <View style={styles.sermonHeader}>
                                <TouchableOpacity
                                    style={styles.youtubeIcon}
                                    onPress={() => openYoutube(item.url)}
                                >
                                    <MaterialIcons name="video-library" size={24} color="#FF0000" />
                                </TouchableOpacity>

                                <View style={styles.sermonTitleContainer}>
                                    <Text style={styles.sermonTitle}>{item.title}</Text>
                                    <Text style={styles.sermonPreacher}>{item.preacher}</Text>
                                </View>

                                <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                                    <MaterialIcons
                                        name={expandedId === item.id ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                        size={24}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>

                            {expandedId === item.id && (
                                <View style={styles.detailsContainer}>
                                    <Text style={styles.detailText}>
                                        <Text style={styles.detailLabel}>Source: </Text>
                                        {item.source}
                                    </Text>
                                    {item.description && (
                                        <>
                                            <Text style={styles.detailLabel}>Description</Text>
                                            <Text style={styles.detailText}>{item.description}</Text>
                                        </>
                                    )}
                                    <Text style={styles.detailText}>
                                        <Text style={styles.detailLabel}>Date Streamed: </Text>
                                        {formatDate(item.date_published)}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </View>
    );
};

export default SermonsPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    sermonItemContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sermonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    youtubeIcon: {
        marginRight: 12,
    },
    sermonTitleContainer: {
        flex: 1,
    },
    sermonTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    sermonPreacher: {
        fontSize: 14,
        color: '#666',
    },
    detailsContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    detailText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
    },
    detailLabel: {
        fontWeight: '600',
        color: '#333',
    },
    separator: {
        height: 8,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
        fontSize: 16,
    },
});