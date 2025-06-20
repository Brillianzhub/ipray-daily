import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ImageSourcePropType } from 'react-native';

interface DailyDevotionalProps {
    colors: {
        surface: string;
        text: {
            primary: string;
            secondary: string;
        };
        primary: string;
    };
    onReadMore?: () => void;
    devotion?: {
        theme?: string;
        devotion?: string;
    };
    imageUrl?: ImageSourcePropType;
}


const DailyDevotional: React.FC<DailyDevotionalProps> = ({
    colors,
    devotion,
    onReadMore,
    imageUrl = require('../../assets/images/banner2.jpg'),
}) => {
    return (
        <View style={[styles.devotionalCard, { backgroundColor: colors.surface }]}>
            <Image source={imageUrl} style={styles.devotionalImage} />
            <View style={styles.devotionalContent}>
                <Text style={[styles.devotionalTitle, { color: colors.text.primary }]}>
                    {devotion?.theme}
                </Text>
                <Text
                    style={[styles.devotionalDescription, { color: colors.text.secondary }]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {devotion?.devotion}
                </Text>
                <TouchableOpacity
                    style={[styles.readMoreButton, { backgroundColor: colors.primary }]}
                    onPress={onReadMore}
                >
                    <Text style={styles.readMoreText}>Read Today's Devotional</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    devotionalCard: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    devotionalImage: {
        width: '100%',
        height: 160,
    },
    devotionalContent: {
        padding: 16,
    },
    devotionalTitle: {
        fontFamily: 'Cormorant-Bold',
        fontSize: 20,
        marginBottom: 8,
    },
    devotionalDescription: {
        fontFamily: 'Cormorant-Regular',
        fontSize: 18,
        lineHeight: 20,
        marginBottom: 16,
    },
    readMoreButton: {
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    readMoreText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#FFFFFF',
    },
});

export default DailyDevotional;
