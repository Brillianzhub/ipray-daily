
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { Plus } from 'lucide-react-native';

import PrayerCategories from '@/components/prayers/PrayerCategories';
import PrayerForm from '@/components/prayers/AddPrayers';
import PrayerList from '@/components/prayers/PersonalPrayers';
import { getAllPrayers } from '@/lib/user_prayers';
import { useRouter } from 'expo-router';
import { Category } from '@/lib/prayers';
import WelcomeCard from '@/components/prayers/WelcomeCard';
import { usePrayerDatabase } from '@/hooks/usePrayers';


const PRAYER_CATEGORIES = [
    { id: 'all', name: 'All Prayers' },
    { id: 'gratitude', name: 'Gratitude' },
    { id: 'requests', name: 'Requests' },
    { id: 'family', name: 'Family' },
    { id: 'health', name: 'Health' },
];

type Prayer = {
    id: string;
    title: string;
    description: string;
    date: string | Date;
    category: string;
    isFavorite: boolean;
    isAnswered: boolean;
};


export default function PrayerScreen() {
    const [isAddingPrayer, setIsAddingPrayer] = useState(false);
    const [newPrayer, setNewPrayer] = useState({ title: '', description: '', category: 'requests' });
    const [prayers, setPrayers] = React.useState<Prayer[]>([]);

    const [categories, setCategories] = useState<Category[]>([]);
    const [featuredPrayers, setFeaturedPrayers] = useState<Prayer[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const {
        fetchCategories,
        fetchFeaturedPrayers,
    } = usePrayerDatabase();


    useEffect(() => {
        const loadPrayers = async () => {
            try {
                const dbPrayers = await getAllPrayers();
                setPrayers(dbPrayers);
            } catch (err) {
                console.error('Failed to load prayers:', err);
            }
        };

        loadPrayers();
    }, []);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [fetchedCategories, fetchedFeatured] = await Promise.all([
                    fetchCategories(),
                    fetchFeaturedPrayers()
                ]);

                setCategories(fetchedCategories);
                // setFeaturedPrayers(fetchedFeatured);
            } catch (err) {
                setError('Failed to load data. Please try again later.');
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);


    const handleToggleFavorite = (id: string) => {
        setPrayers(prev => prev.map(prayer =>
            prayer.id === id ? { ...prayer, isFavorite: !prayer.isFavorite } : prayer
        ));
    };

    const handleToggleAnswered = (id: string) => {
        setPrayers(prev => prev.map(prayer =>
            prayer.id === id ? { ...prayer, isAnswered: !prayer.isAnswered } : prayer
        ));
    };


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <ScrollView
                style={styles.prayersContainer}
                contentContainerStyle={styles.prayersContent}
                showsVerticalScrollIndicator={false}
            >
                <WelcomeCard
                    title="LET THE REDEEMED OF THE LORD SAY SO..."
                    verse="Psalm 107:2"
                    subtext="In times of trouble, God is our ever-present help"
                    praiseText="Amen!"
                />
                <PrayerCategories
                    categories={categories}
                    onSelectCategory={(category) => {
                        router.push({
                            pathname: '/prayer/prayers',
                            params: {
                                category: category
                            }
                        });
                    }}
                />
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Personal Requests</Text>
                </View>
                {isAddingPrayer ? (
                    <PrayerForm
                        newPrayer={newPrayer}
                        setNewPrayer={setNewPrayer}
                        setIsAddingPrayer={setIsAddingPrayer}
                        PRAYER_CATEGORIES={PRAYER_CATEGORIES}
                        onSavePrayer={async () => {
                            setIsAddingPrayer(false);
                            try {
                                const updatedPrayers = await getAllPrayers();
                                setPrayers(updatedPrayers);
                            } catch (err) {
                                console.error('Error fetching prayers after save:', err);
                            }
                        }}
                    />
                ) : (
                    <>
                        <PrayerList
                            filteredPrayers={prayers}
                            PRAYER_CATEGORIES={PRAYER_CATEGORIES}
                            onToggleFavorite={handleToggleFavorite}
                            onToggleAnswered={handleToggleAnswered}
                            setPrayers={setPrayers}
                        />
                    </>
                )}
            </ScrollView>

            {!isAddingPrayer && (
                <TouchableOpacity style={styles.addButton} onPress={() => setIsAddingPrayer(true)}>
                    <Plus size={24} color="#FFFFFF" />
                </TouchableOpacity>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        paddingBottom: Platform.OS === 'android' ? 20 : 0,
    },
    categoriesContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
    },
    selectedCategory: {
        backgroundColor: '#1E3A8A',
    },
    categoryText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#64748B',
    },
    prayersContainer: {
        flex: 1,
    },
    prayersContent: {
        padding: 16,
        paddingBottom: 80,
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
        backgroundColor: '#0284c7',
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
    },
    sectionContainer: {
        marginVertical: 10,
    },
    sectionTitle: {
        fontFamily: 'Cormorant-Bold',
        fontSize: 20,
    },
});