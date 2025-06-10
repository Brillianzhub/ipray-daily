import { BibleBook } from '@/lib/database';
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ListRenderItem } from 'react-native';


interface BookSelectorProps {
    selectedTestament: 'all' | 'old' | 'new';
    setSelectedTestament: (testament: 'all' | 'old' | 'new') => void;
    filteredBooks: BibleBook[];
    renderBookItem: ListRenderItem<BibleBook>;
}

const BookSelector: React.FC<BookSelectorProps> = ({
    selectedTestament,
    setSelectedTestament,
    filteredBooks,
    renderBookItem,
}) => {
    return (
        <View style={styles.bookSelectorContainer}>
            <View style={styles.testamentTabs}>
                <TouchableOpacity
                    style={[
                        styles.testamentTab,
                        selectedTestament === 'all' && styles.activeTestamentTab,
                    ]}
                    onPress={() => setSelectedTestament('all')}
                >
                    <Text
                        style={[
                            styles.testamentTabText,
                            selectedTestament === 'all' && styles.activeTestamentTabText,
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.testamentTab,
                        selectedTestament === 'old' && styles.activeTestamentTab,
                    ]}
                    onPress={() => setSelectedTestament('old')}
                >
                    <Text
                        style={[
                            styles.testamentTabText,
                            selectedTestament === 'old' && styles.activeTestamentTabText,
                        ]}
                    >
                        Old Testament
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.testamentTab,
                        selectedTestament === 'new' && styles.activeTestamentTab,
                    ]}
                    onPress={() => setSelectedTestament('new')}
                >
                    <Text
                        style={[
                            styles.testamentTabText,
                            selectedTestament === 'new' && styles.activeTestamentTabText,
                        ]}
                    >
                        New Testament
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredBooks}
                renderItem={renderBookItem}
                keyExtractor={(item) => item.id}
                style={styles.booksList}
                contentContainerStyle={styles.booksListContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default BookSelector;

const styles = StyleSheet.create({
    bookSelectorContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    testamentTabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    testamentTab: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    activeTestamentTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#0284c7',
    },
    testamentTabText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#64748B',
    },
    activeTestamentTabText: {
        color: '#0284c7',
    },
    booksList: {
        flex: 1,
    },
    booksListContent: {
        padding: 16,
    },
});
