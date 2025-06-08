import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';

const About = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>About IPray Daily</Text>
                </View>
                
                <View style={styles.contentBlock}>
                    <Text style={styles.paragraph}>
                        IPray Daily is your spiritual companion designed to deepen your relationship with God through prayer, scripture, and worship.
                    </Text>
                    
                    <Text style={styles.paragraph}>
                        Our mission is to help believers maintain a consistent prayer life, grow in biblical understanding, and keep Christ at the center of their daily walk.
                    </Text>
                </View>

                <View style={styles.contentBlock}>
                    <Text style={styles.sectionTitle}>Features</Text>
                    <View style={styles.bulletContainer}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Curated prayers for every need and season of life</Text>
                    </View>
                    <View style={styles.bulletContainer}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Inspirational sermons covering foundational Christian topics</Text>
                    </View>
                    <View style={styles.bulletContainer}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Timeless hymns to nourish your soul and lift your worship</Text>
                    </View>
                    <View style={styles.bulletContainer}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Multiple Bible translations (KJV, NIV, AMP) for deeper study</Text>
                    </View>
                    <View style={styles.bulletContainer}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Daily devotionals to keep you grounded in God's Word</Text>
                    </View>
                </View>

                <View style={styles.contentBlock}>
                    <Text style={styles.paragraph}>
                        Whether you're beginning your day, facing challenges, or seeking quiet moments with God, IPray Daily provides the spiritual resources you need to stay connected to your faith.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>"So whether you eat or drink or whatever you do, do it all for the glory of God."</Text>
                    <Text style={styles.footerVerse}>1 Corinthians 10:31</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default About;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    contentBlock: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2c3e50',
        textAlign: 'center',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#34495e',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 12,
    },
    bulletContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bullet: {
        fontSize: 16,
        color: '#3498db',
        marginRight: 8,
        lineHeight: 24,
    },
    bulletText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#34495e',
        flex: 1,
    },
    footer: {
        marginTop: 32,
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: 4,
        lineHeight: 22,
    },
    footerVerse: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7f8c8d',
        textAlign: 'center',
    },
});