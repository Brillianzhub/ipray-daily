import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Category {
    prayer_category: string;
}

interface PrayerCategoriesProps {
    categories: Category[];
    onSelectCategory: (categoryName: string) => void;
}

const PrayerCategories: React.FC<PrayerCategoriesProps> = ({ categories, onSelectCategory }) => {
    const [showAll, setShowAll] = useState(false);

    const getRandomColor = () => {
        const colors = ['#F59E0B', '#3B82F6', '#EC4899', '#10B981', '#8B5CF6', '#6366F1'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const visibleCategories = showAll ? categories : categories.slice(0, 9);

    return (
        <View style={styles.categoriesContainer}>
            <View style={styles.categoryHeader}>
                <Text style={styles.sectionTitle}>Categories</Text>
                {categories.length > 9 && (
                    <TouchableOpacity style={styles.viewAllButton} onPress={() => setShowAll(!showAll)}>
                        <Text style={styles.viewAllText}>{showAll ? 'View Less' : 'View All'}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.categoryGrid}>
                {visibleCategories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.categoryCard}
                        onPress={() => onSelectCategory(category.prayer_category)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: getRandomColor() }]}>
                            <Text style={styles.iconText}>
                                {category.prayer_category.slice(0, 3).toUpperCase()}
                            </Text>
                        </View>
                        <Text style={styles.categoryTitle}>
                            {category.prayer_category
                                .toLowerCase()
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};



const styles = StyleSheet.create({
    categoriesContainer: {
        // padding: 20,
        marginVertical: 20
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        color: '#1F2937',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#6B4E71',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryCard: {
        width: '28%',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconText: {
        fontFamily: 'Inter-Bold',
        fontSize: 12,
        color: '#FFFFFF',
    },
    categoryTitle: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#4B5563',
        textAlign: 'center',
    },
    loader: {
        marginTop: 20,
    },
});

export default PrayerCategories;
