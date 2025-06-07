import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { Book, ChevronDown, BookOpen, Bookmark, Search, Share2 } from 'lucide-react-native';
import ChapterSelectorModal from '@/components/bible/ChapterSelectorModal';
import VerseSelectorModal from '@/components/bible/VerseSelectorModal';
import { getBibleBooks, Verse, getChapter, BibleVersion } from '@/lib/database';
import { addFavorite, getAllFavorites } from '@/lib/user_db';
import { VersionSelector } from '@/components/bible/VersionSelector';
import { useBibleVersion } from '@/context/BibleVersionContext';

type BibleBook = {
    id: string;
    name: string;
    chapters: number;
    testament: 'old' | 'new';
};


export default function BibleScreen() {
    const scrollViewRef = useRef<ScrollView>(null);

    const [selectedTestament, setSelectedTestament] = useState('all');
    const [showingBookSelector, setShowingBookSelector] = useState(false);
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [bibleBooks, setBibleBooks] = useState<BibleBook[]>([]);

    const [selectedBook, setSelectedBook] = useState<BibleBook>({
        id: 'genesis',
        name: 'Genesis',
        chapters: 50,
        testament: 'old',
    });

    const [selectedChapter, setSelectedChapter] = useState<number>(1);
    const [pressedVerse, setPressedVerse] = useState<Verse | null>(null);
    const [showActions, setShowActions] = useState(false);
    const [showVerseModal, setShowVerseModal] = useState(false);
    const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
    const [verseCount, setVerseCount] = useState(0);

    const { version } = useBibleVersion();

    const [verses, setVerses] = useState<Verse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const books = await getBibleBooks();
                setBibleBooks(books);

                const genesis = books.find(b => b.id === 'genesis');
                if (genesis) {
                    setSelectedBook(genesis);
                }
            } catch (error) {
                console.error('Failed to load Bible books:', error);
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, []);

    const filteredBooks = selectedTestament === 'all'
        ? bibleBooks
        : bibleBooks.filter(book => book.testament === selectedTestament);

    const handleBookSelect = (book: BibleBook) => {
        setSelectedBook(book);
        setSelectedChapter(1);
        setShowChapterModal(true);
        setShowingBookSelector(false);
    };


    const handleChapterSelect = async (chapter: number) => {
        setSelectedChapter(chapter);
        setShowChapterModal(false);

        const verses = await getChapter(selectedBook.name, chapter);
        setVerseCount(verses.length);

        setShowVerseModal(true);
    };

    const handleVerseSelect = (verse: number) => {
        setSelectedVerse(verse);
        setShowVerseModal(false);
    };

    const renderBookItem = ({ item }: { item: BibleBook }) => (
        <TouchableOpacity
            style={styles.bookItem}
            onPress={() => handleBookSelect(item)}
        >
            <Text style={styles.bookName}>{item.name}</Text>
            <Text style={styles.chapterCount}>{item.chapters} chapters</Text>
        </TouchableOpacity>
    );


    useEffect(() => {
        if (selectedVerse && scrollViewRef.current) {
            const verseIndex = verses.findIndex(v => v.verse_number === selectedVerse);
            if (verseIndex >= 0) {
                scrollViewRef.current.scrollTo({
                    y: verseIndex * 80,
                    animated: true
                });
            }
        }
    }, [selectedVerse, verses]);


    const fetchVerses = async (book: string, chapter: number, version: BibleVersion) => {
        try {
            setLoading(true);
            const results = await getChapter(book, chapter, version);
            setVerses(results);
        } catch (error) {
            console.error('Error fetching verses:', error);
            setVerses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedChapter !== null) {
            fetchVerses(selectedBook.name, selectedChapter, version);
        }
    }, [selectedBook, selectedChapter, version]);


    const handlePreviousChapter = async () => {
        if (!selectedBook || !selectedChapter || isTransitioning) return;

        setIsTransitioning(true);

        try {
            if (selectedChapter <= 1) {
                const currentIndex = bibleBooks.findIndex(b => b.id === selectedBook.id);
                if (currentIndex > 0) {
                    const prevBook = bibleBooks[currentIndex - 1];
                    const newChapter = prevBook.chapters;
                    setSelectedBook(prevBook);
                    setSelectedChapter(newChapter);
                    await fetchVerses(selectedBook.name, newChapter, version);
                }
            } else {
                const newChapter = selectedChapter - 1;
                setSelectedChapter(newChapter);
                await fetchVerses(selectedBook.name, selectedChapter, version);
            }
        } catch (error) {
            console.error('Error navigating to previous chapter:', error);
        } finally {
            setIsTransitioning(false);
        }
    };

    const handleNextChapter = async () => {
        if (!selectedBook || !selectedChapter || isTransitioning) return;

        setIsTransitioning(true);

        try {
            if (selectedChapter >= selectedBook.chapters) {
                const currentIndex = bibleBooks.findIndex(b => b.id === selectedBook.id);
                if (currentIndex < bibleBooks.length - 1) {
                    const nextBook = bibleBooks[currentIndex + 1];
                    const newChapter = 1;
                    setSelectedBook(nextBook);
                    setSelectedChapter(newChapter);
                    await fetchVerses(selectedBook.name, newChapter, version);
                }
            } else {
                const newChapter = selectedChapter + 1;
                setSelectedChapter(newChapter);
                await fetchVerses(selectedBook.name, selectedChapter, version);
            }
        } catch (error) {
            console.error('Error navigating to next chapter:', error);
        } finally {
            setIsTransitioning(false);
        }
    };

    const handleAddFavorite = () => {
        if (pressedVerse) {
            addFavorite(pressedVerse.id);
            // setPressedVerse(null);
            setShowActions(false);
        } else {
            console.warn('No verse selected to add to favorites.');
        }
    };


    const handleFetchFavorites = () => {
        const favorites = getAllFavorites();
        console.log('Favorites:', favorites);
    };

    const handleVersePress = (verse: Verse) => {
        // If the same verse is pressed again, deselect it
        if (pressedVerse?.verse_number === verse.verse_number) {
            setPressedVerse(null);
            setShowActions(false);
        }
        // Otherwise, select the new verse
        else {
            setPressedVerse(verse);
            setShowActions(true);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.bookSelector}
                    onPress={() => setShowingBookSelector(!showingBookSelector)}
                >
                    <Book size={20} color="#0284c7" />
                    <Text style={styles.selectedBookText}>{selectedBook.name} {selectedChapter}</Text>
                    <ChevronDown size={20} color="#64748B" />
                </TouchableOpacity>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Search size={20} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleAddFavorite}
                    >
                        <Bookmark size={20} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleFetchFavorites}
                    >
                        <Share2 size={20} color="#64748B" />
                    </TouchableOpacity>
                </View>
            </View>

            {showingBookSelector ? (
                <View style={styles.bookSelectorContainer}>
                    <View style={styles.testamentTabs}>
                        <TouchableOpacity
                            style={[styles.testamentTab, selectedTestament === 'all' && styles.activeTestamentTab]}
                            onPress={() => setSelectedTestament('all')}
                        >
                            <Text style={[styles.testamentTabText, selectedTestament === 'all' && styles.activeTestamentTabText]}>
                                All
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.testamentTab, selectedTestament === 'old' && styles.activeTestamentTab]}
                            onPress={() => setSelectedTestament('old')}
                        >
                            <Text style={[styles.testamentTabText, selectedTestament === 'old' && styles.activeTestamentTabText]}>
                                Old Testament
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.testamentTab, selectedTestament === 'new' && styles.activeTestamentTab]}
                            onPress={() => setSelectedTestament('new')}
                        >
                            <Text style={[styles.testamentTabText, selectedTestament === 'new' && styles.activeTestamentTabText]}>
                                New Testament
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={filteredBooks}
                        renderItem={renderBookItem}
                        keyExtractor={item => item.id}
                        style={styles.booksList}
                        contentContainerStyle={styles.booksListContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            ) : (
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.scriptureContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.verseContainer}>
                        <View style={styles.chapterHeader}>
                            <Text style={styles.chapterTitle}>
                                {selectedBook.name} {selectedChapter}
                            </Text>

                            <VersionSelector />
                            {/* <Text style={{ color: "#0284c7" }}>KJV</Text> */}
                            {/* <BookOpen size={18} color="#0284c7" /> */}
                        </View>

                        {verses.map((verse) => (
                            <TouchableOpacity
                                key={verse.verse_number}
                                onPress={() => handleVersePress(verse)}
                                style={[
                                    styles.verse,
                                    pressedVerse?.verse_number === verse.verse_number && styles.selectedVerse
                                ]}
                            >
                                <Text style={styles.verseNumber}>{verse.verse_number}</Text>
                                <Text style={styles.verseText}>{verse.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )}

            <ChapterSelectorModal
                visible={showChapterModal}
                bookName={selectedBook.name}
                chapterCount={selectedBook.chapters}
                selectedChapter={selectedChapter}
                onSelect={handleChapterSelect}
                onClose={() => setShowChapterModal(false)}
            />

            <VerseSelectorModal
                visible={showVerseModal}
                bookName={selectedBook.name}
                chapterNumber={selectedChapter || 1}
                verseCount={verseCount}
                selectedVerse={selectedVerse}
                onSelect={handleVerseSelect}
                onClose={() => setShowVerseModal(false)}
            />

            {!showingBookSelector && (
                <View style={styles.navigation}>
                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            (!selectedChapter ||
                                (selectedChapter <= 1 &&
                                    (!selectedBook || bibleBooks[0]?.id === selectedBook.id))) && styles.disabledButton
                        ]}
                        onPress={handlePreviousChapter}
                        disabled={!selectedChapter ||
                            (selectedChapter <= 1 &&
                                (!selectedBook || bibleBooks[0]?.id === selectedBook.id)) ||
                            isTransitioning}
                    >
                        {isTransitioning ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.navButtonText}>
                                {selectedChapter && selectedChapter > 1 ?
                                    "Previous Chapter" :
                                    "Previous Book"}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            (!selectedChapter ||
                                !selectedBook ||
                                (selectedChapter >= selectedBook.chapters &&
                                    bibleBooks[bibleBooks.length - 1]?.id === selectedBook.id)) && styles.disabledButton
                        ]}
                        onPress={handleNextChapter}
                        disabled={!selectedChapter ||
                            !selectedBook ||
                            (selectedChapter >= selectedBook.chapters &&
                                bibleBooks[bibleBooks.length - 1]?.id === selectedBook.id) ||
                            isTransitioning}
                    >
                        {isTransitioning ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.navButtonText}>
                                {selectedChapter && selectedBook && selectedChapter < selectedBook.chapters ?
                                    "Next Chapter" :
                                    "Next Book"}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    bookSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    selectedBookText: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#1E293B',
        marginHorizontal: 8,
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 8,
        marginLeft: 8,
    },
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
    bookItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    bookName: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#1E293B',
    },
    chapterCount: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#64748B',
    },
    scriptureContainer: {
        flex: 1,
        padding: 16,
    },
    verseContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
    },
    chapterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    chapterTitle: {
        fontFamily: 'Cormorant-Bold',
        fontSize: 24,
        color: '#1E293B',
    },
    verse: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    verseNumber: {
        fontFamily: 'Inter-Bold',
        fontSize: 14,
        color: '#0284c7',
        width: 24,
        marginRight: 8,
    },
    verseText: {
        fontFamily: 'Cormorant-Regular',
        fontSize: 22,
        color: '#334155',
        flex: 1,
        lineHeight: 28,
    },
    selectedVerse: {
        backgroundColor: '#f0f9ff',
        padding: 10,
        borderRadius: 12
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    navButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#cbd5e1',
    },
    navButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#0284c7',
    },

    chapterSelectorContainer: {
        padding: 10,
        backgroundColor: '#f0f0f0',
    },

    chapterButton: {
        marginRight: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#1E3A8A',
        borderRadius: 5,
    },

    chapterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});