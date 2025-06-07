import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Modal,
    Platform,
} from 'react-native';
import { useBibleVersion } from '@/context/BibleVersionContext';
import { BibleVersion } from '@/lib/database';

const versions: BibleVersion[] = ['KJV', 'AMP', 'NIV'];

export const VersionSelector = () => {
    const { version, setVersion } = useBibleVersion();
    const [menuVisible, setMenuVisible] = useState(false);

    const handleVersionSelect = (v: BibleVersion) => {
        setVersion(v);
        setMenuVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                style={styles.button}
            >
                <Text style={styles.buttonText}>{version}</Text>
            </TouchableOpacity>

            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable
                    style={styles.menuOverlay}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.menuContainer}>
                        {versions.map((v) => (
                            <TouchableOpacity
                                key={v}
                                style={[
                                    styles.menuItem,
                                    version === v && styles.selectedMenuItem
                                ]}
                                onPress={() => handleVersionSelect(v)}
                            >
                                <Text style={styles.menuItemText}>{v}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        zIndex: 1,
    },
    button: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    menuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 8,
        width: 100,
        position: 'absolute',
        top: Platform.OS === 'ios' ? 230 : 200,
        right: 10, // Align with the button
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    selectedMenuItem: {
        backgroundColor: '#e0f2fe',
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center'
    },
});