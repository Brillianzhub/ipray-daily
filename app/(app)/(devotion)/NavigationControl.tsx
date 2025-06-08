import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

interface NavigationControlsProps {
    onNext: () => void;
    onPrevious: () => void;
    onSearch: (date: string) => void;
    onTimetable: () => void;
    selectedDate: Date;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
    onNext,
    onPrevious,
    onSearch,
    onTimetable,
    selectedDate,
}) => {
    const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);

    const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
        setDatePickerVisible(false);

        if (event.type === 'set' && date) {
            onSearch(date.toISOString().split('T')[0]);
        }
    };

    return (
        <View style={styles.container}>
            {/* Previous Button */}
            <TouchableOpacity style={styles.button} onPress={onPrevious}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Timetable Button */}
            <TouchableOpacity style={styles.button} onPress={onTimetable}>
                <MaterialIcons name="list" size={24} color="black" />
            </TouchableOpacity>

            {/* Search Button */}
            <TouchableOpacity style={styles.button} onPress={() => setDatePickerVisible(true)}>
                <MaterialIcons name="search" size={24} color="black" />
            </TouchableOpacity>

            {/* Next Button */}
            <TouchableOpacity style={styles.button} onPress={onNext}>
                <MaterialIcons name="arrow-forward" size={24} color="black" />
            </TouchableOpacity>

            {isDatePickerVisible && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    button: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default NavigationControls;
