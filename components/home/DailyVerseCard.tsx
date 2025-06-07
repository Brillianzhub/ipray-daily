import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Share2, BookOpen } from 'lucide-react-native';

export default function DailyVerseCard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verse of the Day</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={18} color="#64748B" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.verse}>
        "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
      </Text>
      
      <View style={styles.footer}>
        <Text style={styles.reference}>John 3:16</Text>
        <TouchableOpacity style={styles.readMoreButton}>
          <BookOpen size={16} color="#1E3A8A" />
          <Text style={styles.readMoreText}>Read in Context</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Cormorant-Bold',
    fontSize: 18,
    color: '#1E293B',
  },
  shareButton: {
    padding: 4,
  },
  verse: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 18,
    color: '#334155',
    lineHeight: 28,
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reference: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#1E3A8A',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E3A8A',
    marginLeft: 4,
  },
});