import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, Star, Trash } from 'lucide-react-native';
import { deletePrayer, getAllPrayers } from '@/lib/user_prayers';

type Prayer = {
    id: string;
    title: string;
    description: string;
    date: string | Date;
    category: string;
    isFavorite: boolean;
    isAnswered: boolean;
};

type Category = {
    id: string;
    name: string;
};

type PrayerListProps = {
    filteredPrayers: Prayer[];
    PRAYER_CATEGORIES: Category[];
    onToggleFavorite: (id: string) => void;
    onToggleAnswered: (id: string) => void;
    setPrayers: React.Dispatch<React.SetStateAction<Prayer[]>>;
};

const PrayerList: React.FC<PrayerListProps> = ({
    filteredPrayers,
    PRAYER_CATEGORIES,
    onToggleFavorite,
    onToggleAnswered,
    setPrayers
}) => {

    const handleDelete = (id: string) => {
        deletePrayer(id);
        const updatedPrayers = getAllPrayers();
        setPrayers(updatedPrayers)
    }

    return (
        <>
            {filteredPrayers.map((prayer: Prayer) => (
                <View key={prayer.id} style={styles.prayerCard}>
                    <View style={styles.prayerHeader}>
                        <View style={styles.prayerTitleContainer}>
                            <Text style={styles.prayerTitle}>{prayer.title}</Text>
                            <Text style={styles.prayerDate}>
                                {new Date(prayer.date).toLocaleDateString()}
                            </Text>
                        </View>
                        <View style={styles.prayerActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => onToggleFavorite(prayer.id)}
                            >
                                <Star
                                    size={18}
                                    color={prayer.isFavorite ? '#B45309' : '#94A3B8'}
                                    fill={prayer.isFavorite ? '#B45309' : 'transparent'}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => onToggleAnswered(prayer.id)}
                            >
                                <Check
                                    size={18}
                                    color={prayer.isAnswered ? '#047857' : '#94A3B8'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.prayerDescription}>{prayer.description}</Text>

                    <View style={styles.prayerFooter}>
                        <View style={styles.prayerCategory}>
                            <Text style={styles.prayerCategoryText}>
                                {PRAYER_CATEGORIES.find((c: Category) => c.id === prayer.category)?.name}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDelete(prayer.id)}
                        >
                            <Trash size={16} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    prayerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
    },
    prayerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    prayerTitleContainer: {
        flex: 1,
    },
    prayerTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        color: '#1E293B',
        marginBottom: 4,
    },
    prayerDate: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#94A3B8',
    },
    prayerActions: {
        flexDirection: 'row',
    },
    actionButton: {
        marginLeft: 16,
    },
    prayerDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
        marginBottom: 16,
    },
    prayerFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    prayerCategory: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    prayerCategoryText: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: '#64748B',
    },
    deleteButton: {
        padding: 8,
    },
    addButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#1E3A8A',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    }
});

export default PrayerList;