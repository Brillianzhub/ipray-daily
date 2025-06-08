import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useMemo } from 'react';
import { useDevotion } from '@/lib/api/devotionApi';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

// Define interfaces based on your data structure
interface DailyReading {
  date: string;
  title: string;
  scripture: string;
}

interface Month {
  id: number;
  name: string;
  theme: string;
  daily_readings: DailyReading[];
}

interface TimeTableType {
  year: number;
  theme: string;
  months: Month[];
}

const TimeTable: React.FC = () => {
  const { timeTable } = useDevotion();
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({});
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  if (!timeTable) return <Text>Loading...</Text>;

  const typedTimeTable = timeTable as TimeTableType;

  const toggleMonth = (id: number) => {
    setExpandedMonths((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{typedTimeTable.year} - {typedTimeTable.theme}</Text>
      <FlatList
        data={typedTimeTable.months}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: month }) => (
          <View style={styles.monthContainer}>
            <TouchableOpacity onPress={() => toggleMonth(month.id)} style={styles.monthHeader}>
              <View style={styles.monthInfo}>
                <Text style={styles.monthTitle}>{month.name}</Text>
                <Text style={styles.monthTheme}>{month.theme}</Text>
              </View>
              <AntDesign name={expandedMonths[month.id] ? 'minus' : 'plus'} size={18} color="black" />
            </TouchableOpacity>
            {expandedMonths[month.id] && (
              <View style={styles.readingsContainer}>
                {month.daily_readings.length > 0 ? (
                  month.daily_readings.map((reading, index) => (
                    <View key={index} style={styles.readingRow}>
                      <Text style={styles.dateText}>{reading.date}</Text>
                      <View style={styles.progressBarContainer}>
                        {index < month.daily_readings.length - 1 && (
                          <View
                            style={[
                              styles.progressBar,
                              reading.date < today
                                ? styles.pastProgress
                                : reading.date === today
                                  ? styles.currentProgress
                                  : styles.futureProgress,
                            ]}
                          />
                        )}
                        <View
                          style={[
                            styles.node,
                            reading.date < today
                              ? styles.pastNode
                              : reading.date === today
                                ? styles.currentNode
                                : null,
                          ]}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.themeContainer}
                        onPress={() =>
                          router.push({
                            pathname: '/Devotion',
                            params: { date: reading.date },
                          })
                        }
                      >
                        <Text style={styles.themeText}>
                          {reading.title} ({reading.scripture})
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noReadingText}>Content not available at the moment</Text>
                )}
              </View>
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TimeTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  monthContainer: {
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  monthInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  monthTheme: {
    fontSize: 14,
    color: 'gray',
    flexShrink: 1,
  },
  readingsContainer: {
    marginTop: 8,
  },
  readingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    width: 80,
    fontSize: 14,
  },
  progressBarContainer: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    width: 2,
    height: 40,
    position: 'absolute',
    top: 5,
  },
  pastProgress: {
    backgroundColor: '#0284c7',
  },
  currentProgress: {
    backgroundColor: '#e0e0e0',
  },
  futureProgress: {
    backgroundColor: '#e0e0e0',
  },
  node: {
    width: 10,
    height: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ccc',
    position: 'absolute',
  },
  pastNode: {
    borderColor: '#0284c7',
    backgroundColor: '#0284c7',
  },
  currentNode: {
    borderColor: '#0284c7',
    backgroundColor: '#0284c7',
  },
  themeContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  themeText: {
    fontSize: 14,
  },
  noReadingText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'gray',
  },
});
