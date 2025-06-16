// components/WelcomeCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface WelcomeCardProps {
    title: string;
    verse: string;
    subtext?: string;
    praiseText?: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
    title = "LET THE REDEEMED OF THE LORD SAY SO...",
    verse = "Psalm 107:2",
    subtext = "Declare God's faithfulness in your life today. Speak His promises and watch them come to pass.",
    praiseText = "Hallelujah!"
}) => {
    return (
        <View style={styles.welcomeCard}>
            <LinearGradient
                colors={['#0284c7', '#00a3e0']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardVerse}>{verse}</Text>

                <View style={styles.cardDivider} />

                <Text style={styles.cardSubtext}>{subtext}</Text>

                <View style={styles.praiseContainer}>
                    <MaterialCommunityIcons name="hands-pray" size={24} color="#fff" />
                    <Text style={styles.praiseText}>{praiseText}</Text>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    welcomeCard: {
        borderRadius: 16,
        marginBottom: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        overflow: 'hidden',
    },
    cardGradient: {
        padding: 24,
        paddingVertical: 32,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 32,
        fontFamily: 'serif',
    },
    cardVerse: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
    cardDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginVertical: 16,
        width: '40%',
        alignSelf: 'center',
    },
    cardSubtext: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 16,
    },
    praiseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    praiseText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default WelcomeCard;