import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    ListRenderItemInfo,
} from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSermons } from '@/lib/api/sermonsApi';
import { MaterialIcons } from '@expo/vector-icons';

type Category = {
    id: number;
    name: string;
    description?: string;
    video_count: number;
};

const SermonCollections: React.FC = () => {
    const router = useRouter();
    const {
        categories,
        isLoading,
        error,
        fetchSermonsByCategory,
    } = useSermons();

    useLayoutEffect(() => {
        // Not strictly necessary unless using a custom header
    }, []);

    const handleCategoryPress = async (category: Category) => {
        const sermons = await fetchSermonsByCategory(category.name);

        router.push({
            pathname: '/SermonsPage',
            params: {
                category: category.name,
                title: category.name,
                initialSermons: JSON.stringify(sermons), 
            },
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Categories</Text>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#0284c7" />
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <MaterialIcons name="error-outline" size={40} color="#FF3D00" />
                    <Text style={styles.errorText}>Error loading categories</Text>
                </View>
            ) : categories.length === 0 ? (
                <View style={styles.center}>
                    <MaterialIcons name="folder-off" size={40} color="#888" />
                    <Text style={styles.emptyText}>No categories found</Text>
                </View>
            ) : (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }: ListRenderItemInfo<Category>) => (
                        <TouchableOpacity
                            onPress={() => handleCategoryPress(item)}
                            style={styles.categoryItem}
                        >
                            <View style={styles.categoryContent}>
                                <MaterialIcons
                                    name="folder"
                                    size={24}
                                    color="#0284c7"
                                    style={styles.categoryIcon}
                                />
                                <View style={styles.textContainer}>
                                    <View style={styles.categoryHeader}>
                                        <Text style={styles.categoryName}>{item.name}</Text>
                                        <View style={styles.videoCountContainer}>
                                            <MaterialIcons name="video-library" size={16} color="#666" />
                                            <Text style={styles.videoCountText}>
                                                {item.video_count}
                                            </Text>
                                        </View>
                                    </View>
                                    {item.description && (
                                        <Text
                                            style={styles.categoryDescription}
                                            numberOfLines={2}
                                        >
                                            {item.description}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#888" />
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </View>
    );
};

export default SermonCollections;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 45,
        fontSize: 16,
        color: '#333',
    },
    clearIcon: {
        padding: 5,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    listContainer: {
        paddingBottom: 20,
    },
    categoryItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryIcon: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    videoCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    videoCountText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    categoryDescription: {
        fontSize: 14,
        color: '#666',
    },
    separator: {
        height: 12,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 10,
        color: '#888',
        fontSize: 16,
    },
    errorText: {
        marginTop: 10,
        color: '#FF3D00',
        fontSize: 16,
    },
});