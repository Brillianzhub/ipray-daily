import { StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useDevotion } from '@/lib/api/devotionApi';
import { MaterialIcons } from '@expo/vector-icons';


// Define types for the video object
interface Video {
    id: string;
    title: string;
    description: string;
    url: string;
}

interface Month {
    id: number;
    videos?: Video[];
}

interface TimeTable {
    months?: Month[];
}

interface RecommededVideosProps {
    devotionDate: string | Date;
}

const RecommededVideos: React.FC<RecommededVideosProps> = ({ devotionDate }) => {
    const { timeTable } = useDevotion() as { timeTable: TimeTable };
    const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

    const date = new Date(devotionDate);
    const month = date.getMonth() + 1;

    const currentMonth = timeTable?.months?.find(m => m.id === month);
    const recommendedVideos = currentMonth?.videos || [];

    const openInYouTube = (url: string): void => {
        Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
    };

    const toggleDescription = (videoId: string): void => {
        setExpandedDescriptions(prevState => ({
            ...prevState,
            [videoId]: !prevState[videoId],
        }));
    };

    const truncateText = (text: string, maxLength: number): string => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recommended Video Messages</Text>
            {recommendedVideos.length > 0 ? (
                recommendedVideos.map(video => (
                    <View key={video.id} style={styles.videoContainer}>
                        <Text style={styles.videoTitle}>{video.title}</Text>
                        <Text style={styles.videoDescription}>
                            {expandedDescriptions[video.id] ? video.description : truncateText(video.description, 100)}
                        </Text>
                        {video.description.length > 100 && (
                            <TouchableOpacity
                                style={styles.readMoreButton}
                                onPress={() => toggleDescription(video.id)}
                            >
                                <Text style={styles.readMoreText}>
                                    {expandedDescriptions[video.id] ? 'Read Less' : 'Read More'}
                                </Text>
                            </TouchableOpacity>
                        )}
                        <View style={styles.videoActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => openInYouTube(video.url)}
                            >
                                <MaterialIcons name="play-circle" size={24} color="#FF0000" />
                                <Text style={styles.actionText}>Watch Video</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            ) : (
                <Text>No recommended videos for this month.</Text>
            )}
        </View>
    );
};

export default RecommededVideos;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    videoContainer: {
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 16,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    videoDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    readMoreButton: {
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    readMoreText: {
        fontSize: 14,
        color: '#0284c7',
        fontWeight: '500',
    },
    videoActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    actionText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#0284c7',
    },
});