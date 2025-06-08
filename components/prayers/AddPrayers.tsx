import React from 'react';
import {
    View, Text, TextInput, ScrollView,
    TouchableOpacity, StyleSheet
} from 'react-native';
import { insertPrayer } from '@/lib/user_prayers';
import uuid from 'react-native-uuid'; 

export type Prayer = {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    isAnswered: boolean;
    isFavorite: boolean;
};

type Category = {
    id: string;
    name: string;
};

type PrayerFormProps = {
    newPrayer: Omit<Prayer, 'id' | 'date' | 'isAnswered' | 'isFavorite'>; 
    setNewPrayer: React.Dispatch<React.SetStateAction<PrayerFormProps['newPrayer']>>;
    setIsAddingPrayer: React.Dispatch<React.SetStateAction<boolean>>;
    PRAYER_CATEGORIES: Category[];
    onSavePrayer?: () => void; 
};

const PrayerForm: React.FC<PrayerFormProps> = ({
    newPrayer,
    setNewPrayer,
    setIsAddingPrayer,
    PRAYER_CATEGORIES,
    onSavePrayer
}) => {

    const handleSavePrayer = () => {
        const fullPrayer: Prayer = {
            id: uuid.v4().toString(),
            title: newPrayer.title.trim(),
            description: newPrayer.description.trim(),
            category: newPrayer.category || 'requests',
            date: new Date().toISOString(),
            isAnswered: false,
            isFavorite: false,
        };

        insertPrayer(fullPrayer);

        if (onSavePrayer) onSavePrayer();
        setIsAddingPrayer(false);
    };

    return (
        <View style={styles.addPrayerCard}>
            <Text style={styles.addPrayerTitle}>Add New Prayer</Text>

            <TextInput
                style={styles.input}
                placeholder="Prayer Title"
                value={newPrayer.title}
                onChangeText={(text) => setNewPrayer(prev => ({ ...prev, title: text }))}
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Prayer Details"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={newPrayer.description}
                onChangeText={(text) => setNewPrayer(prev => ({ ...prev, description: text }))}
            />

            <Text style={styles.categoryLabel}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
                {PRAYER_CATEGORIES.filter((c) => c.id !== 'all').map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categorySelectorItem,
                            newPrayer.category === category.id && styles.selectedCategorySelectorItem
                        ]}
                        onPress={() => setNewPrayer(prev => ({ ...prev, category: category.id }))}
                    >
                        <Text
                            style={[
                                styles.categorySelectorText,
                                newPrayer.category === category.id && styles.selectedCategorySelectorText
                            ]}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.addPrayerButtons}>
                <TouchableOpacity
                    style={[styles.addPrayerButton, styles.cancelButton]}
                    onPress={() => setIsAddingPrayer(false)}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.addPrayerButton, styles.saveButton]}
                    onPress={handleSavePrayer}
                >
                    <Text style={styles.saveButtonText}>Save Prayer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    addPrayerCard: {
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
    addPrayerTitle: {
        fontFamily: 'Cormorant-Bold',
        fontSize: 20,
        color: '#1E293B',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#334155',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    categoryLabel: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#64748B',
        marginBottom: 8,
    },
    categorySelector: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    categorySelectorItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
    },
    selectedCategorySelectorItem: {
        backgroundColor: '#1E3A8A',
    },
    categorySelectorText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#64748B',
    },
    selectedCategorySelectorText: {
        color: '#FFFFFF',
    },
    addPrayerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addPrayerButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F1F5F9',
        marginRight: 8,
    },
    saveButton: {
        backgroundColor: '#1E3A8A',
        marginLeft: 8,
    },
    cancelButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#64748B',
    },
    saveButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#FFFFFF',
    },
});

export default PrayerForm;