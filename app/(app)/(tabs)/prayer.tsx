import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Check, Plus, Star, Trash } from 'lucide-react-native';

const PRAYER_CATEGORIES = [
  { id: 'all', name: 'All Prayers' },
  { id: 'gratitude', name: 'Gratitude' },
  { id: 'requests', name: 'Requests' },
  { id: 'family', name: 'Family' },
  { id: 'health', name: 'Health' },
];

const SAMPLE_PRAYERS = [
  { 
    id: '1', 
    title: 'Healing for Sarah', 
    description: 'Please pray for Sarah\'s recovery after surgery.', 
    category: 'health',
    date: '2025-03-15',
    isAnswered: false,
    isFavorite: true
  },
  { 
    id: '2', 
    title: 'New Job Opportunity', 
    description: 'Guidance for the upcoming job interview on Monday.', 
    category: 'requests',
    date: '2025-03-10',
    isAnswered: false,
    isFavorite: false
  },
  { 
    id: '3', 
    title: 'Family Reunion', 
    description: 'For travel safety and harmony during our family gathering.', 
    category: 'family',
    date: '2025-03-08',
    isAnswered: false,
    isFavorite: false
  },
  { 
    id: '4', 
    title: 'Thankful for Friends', 
    description: 'Grateful for the support of friends during difficult times.', 
    category: 'gratitude',
    date: '2025-03-05',
    isAnswered: true,
    isFavorite: true
  },
];

export default function PrayerScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddingPrayer, setIsAddingPrayer] = useState(false);
  const [newPrayer, setNewPrayer] = useState({ title: '', description: '', category: 'requests' });
  
  const filteredPrayers = selectedCategory === 'all' 
    ? SAMPLE_PRAYERS 
    : SAMPLE_PRAYERS.filter(prayer => prayer.category === selectedCategory);
  
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {PRAYER_CATEGORIES.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{SAMPLE_PRAYERS.length}</Text>
          <Text style={styles.statLabel}>Total Prayers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{SAMPLE_PRAYERS.filter(p => p.isAnswered).length}</Text>
          <Text style={styles.statLabel}>Answered</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{SAMPLE_PRAYERS.filter(p => p.isFavorite).length}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>
      
      <ScrollView style={styles.prayersContainer} contentContainerStyle={styles.prayersContent}>
        {isAddingPrayer ? (
          <View style={styles.addPrayerCard}>
            <Text style={styles.addPrayerTitle}>Add New Prayer</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Prayer Title"
              value={newPrayer.title}
              onChangeText={(text) => setNewPrayer({...newPrayer, title: text})}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Prayer Details"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={newPrayer.description}
              onChangeText={(text) => setNewPrayer({...newPrayer, description: text})}
            />
            
            <Text style={styles.categoryLabel}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
              {PRAYER_CATEGORIES.filter(c => c.id !== 'all').map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categorySelectorItem,
                    newPrayer.category === category.id && styles.selectedCategorySelectorItem
                  ]}
                  onPress={() => setNewPrayer({...newPrayer, category: category.id})}
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
                onPress={() => {
                  // Add prayer logic would go here
                  setIsAddingPrayer(false);
                }}
              >
                <Text style={styles.saveButtonText}>Save Prayer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {filteredPrayers.map(prayer => (
              <View key={prayer.id} style={styles.prayerCard}>
                <View style={styles.prayerHeader}>
                  <View style={styles.prayerTitleContainer}>
                    <Text style={styles.prayerTitle}>{prayer.title}</Text>
                    <Text style={styles.prayerDate}>{new Date(prayer.date).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.prayerActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Star size={18} color={prayer.isFavorite ? '#B45309' : '#94A3B8'} fill={prayer.isFavorite ? '#B45309' : 'transparent'} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.actionButton}>
                      <Check size={18} color={prayer.isAnswered ? '#047857' : '#94A3B8'} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.prayerDescription}>{prayer.description}</Text>
                
                <View style={styles.prayerFooter}>
                  <View style={styles.prayerCategory}>
                    <Text style={styles.prayerCategoryText}>
                      {PRAYER_CATEGORIES.find(c => c.id === prayer.category)?.name}
                    </Text>
                  </View>
                  
                  <TouchableOpacity style={styles.deleteButton}>
                    <Trash size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
      
      {!isAddingPrayer && (
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddingPrayer(true)}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1E3A8A',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  prayersContainer: {
    flex: 1,
  },
  prayersContent: {
    padding: 16,
    paddingBottom: 80,
  },
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
  },
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