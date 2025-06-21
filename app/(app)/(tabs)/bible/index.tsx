import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Book, ChevronDown, BookOpen, Heart, Search, Share2, SquarePen } from 'lucide-react-native';
import ChapterSelectorModal from '@/components/bible/ChapterSelectorModal';
import VerseSelectorModal from '@/components/bible/VerseSelectorModal';
import { getBibleBooks, Verse, getChapter, BibleVersion } from '@/lib/database';
import { addFavorite, getAllFavorites, getCommentsForVerse, Comment, markChapterAsRead, isChapterRead, getAllReadChapters } from '@/lib/user_db';
import { VersionSelector } from '@/components/bible/VersionSelector';
import { useBibleVersion } from '@/context/BibleVersionContext';
import { useLocalSearchParams } from 'expo-router';
import BookSelector from '@/components/bible/BookSelector';
import { ListRenderItemInfo } from 'react-native';
import ChapterNavigation from '@/components/bible/ChapterNavigation';
import { shareVerse } from '@/utils/shareVerse';
import { router } from 'expo-router';
import CommentModal from '@/components/bible/AddCommentModal';
import ReadCommentModal from '@/components/bible/ReadCommentModal';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export interface BibleBook {
    id: string;
    name: string;
    chapters: number;
    testament: 'old' | 'new';
}

const parseReference = (ref: string) => {
    const match = ref.match(/^([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)/);
    if (!match) return null;
    const [, bookName, chapterStr, verseStr] = match;
    return {
        book: bookName.trim(),
        chapter: parseInt(chapterStr),
        verse: parseInt(verseStr),
    };
};


export default function BibleScreen() {
    const scrollViewRef = useRef<ScrollView>(null);
    const { reference } = useLocalSearchParams();

    const [selectedTestament, setSelectedTestament] = useState<'all' | 'old' | 'new'>('all');

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

    const [favoriteVerseIds, setFavoriteVerseIds] = useState<number[]>([]);
    const [chapterComments, setChapterComments] = useState<Comment[]>([]);

    const { version } = useBibleVersion();

    const [verses, setVerses] = useState<Verse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const [showCommentModal, setShowCommentModal] = useState(false);

    const [showReadCommentModal, setShowReadCommentModal] = useState(false);
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

    const [hasReachedBottom, setHasReachedBottom] = useState(false);
    const [isChapterCompleted, setIsChapterCompleted] = useState(false);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

        const threshold = 10;

        const isAtBottom =
            contentOffset.y + layoutMeasurement.height >= contentSize.height - threshold;

        setHasReachedBottom(isAtBottom);
    };

    useEffect(() => {
        setHasReachedBottom(false);
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [selectedChapter]);

    const handleOpenCommentModal = (comment: Comment) => {
        setSelectedComment(comment);
        setShowReadCommentModal(true);
    };

    const handleCloseCommentModal = () => {
        setSelectedComment(null);
        setShowReadCommentModal(false);
    };

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

    useEffect(() => {
        if (reference && bibleBooks.length > 0) {
            const parsed = parseReference(reference as string);
            if (!parsed) return;

            const { book, chapter, verse } = parsed;

            const matchedBook = bibleBooks.find(b =>
                b.name.toLowerCase() === book.toLowerCase()
            );

            if (matchedBook) {
                setSelectedBook(matchedBook);
                setSelectedChapter(chapter);
                setSelectedVerse(verse);
            }
        }
    }, [reference, bibleBooks]);

    useEffect(() => {
        const checkReadStatus = async () => {
            if (selectedBook?.name && selectedChapter) {
                const isRead = await isChapterRead(selectedBook.name, selectedChapter);
                setIsChapterCompleted(isRead);
            }
        };
        checkReadStatus();
    }, [selectedBook?.name, selectedChapter]);



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


    const renderBookItem = ({ item }: ListRenderItemInfo<BibleBook>) => (
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

    const handleMarkComplete = () => {
        if (!selectedBook || !selectedChapter) return;

        markChapterAsRead(selectedBook.name, selectedChapter);
        setIsChapterCompleted(true); // Update state immediately
        fetchVerses(selectedBook.name, selectedChapter, version); // Keep your refresh logic
    };

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
            handleFetchFavorites();
            setShowActions(false);
            setPressedVerse(null);
        } else {
            console.warn('No verse selected to add to favorites.');
        }
    };

    const handleFetchFavorites = async () => {
        const favorites = await getAllFavorites();
        const validFavorites = favorites
            .filter((fav) => fav.verse_id !== null)
            .map((fav) => fav.verse_id as number);

        setFavoriteVerseIds(validFavorites);
    };

    useEffect(() => {
        handleFetchFavorites();
    }, [selectedBook, selectedChapter]);

    const handleFetchCommentsForChapter = async (chapterVerses: Verse[]) => {
        const allComments = await getCommentsForVerse();
        const verseIds = chapterVerses.map(v => v.id);

        const filtered = allComments.filter(comment => verseIds.includes(comment.verse_id));
        setChapterComments(filtered);
    };

    useEffect(() => {
        if (verses.length > 0) {
            handleFetchCommentsForChapter(verses);
        }
    }, [verses]);


    const handleVersePress = (verse: Verse) => {
        if (pressedVerse?.verse_number === verse.verse_number) {
            setPressedVerse(null);
            setShowActions(false);
        }
        else {
            setPressedVerse(verse);
            setShowActions(true);
        }
    };

    const goToSearch = () => {
        router.push('/(search)' as any);
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

                {!pressedVerse && (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={goToSearch}
                        >
                            <Search size={20} color="#64748B" />
                        </TouchableOpacity>
                        <VersionSelector />
                    </View>
                )}

                {pressedVerse && (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => setShowCommentModal(true)}
                        >
                            <SquarePen size={20} color="#64748B" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleAddFavorite}
                        >
                            <Heart size={20} color="#64748B" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => shareVerse(pressedVerse, () => setPressedVerse(null))}
                        >
                            <Share2 size={20} color="#64748B" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {showingBookSelector ? (
                <BookSelector
                    selectedTestament={selectedTestament}
                    setSelectedTestament={setSelectedTestament}
                    filteredBooks={filteredBooks}
                    renderBookItem={renderBookItem}
                />
            ) : (
                <>
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.scriptureContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        <View style={styles.verseContainer}>
                            <View style={styles.chapterHeader}>
                                <Text style={styles.chapterTitle}>
                                    {selectedBook.name} {selectedChapter}
                                </Text>

                                <BookOpen size={18} color="#0284c7" />
                            </View>

                            {verses.map((verse) => {
                                const verseComments = chapterComments.filter((c) => c.verse_id === verse.id);
                                return (
                                    <TouchableOpacity
                                        key={verse.verse_number}
                                        onPress={() => handleVersePress(verse)}
                                        style={[
                                            styles.verse,
                                            favoriteVerseIds.includes(verse.id) && styles.favoriteVerse,
                                            pressedVerse?.verse_number === verse.verse_number && styles.selectedVerse,
                                        ]}
                                    >
                                        <Text style={styles.verseNumber}>{verse.verse_number}</Text>
                                        <Text style={styles.verseText}>{verse.text}</Text>

                                        {verseComments.length > 0 && (
                                            <TouchableOpacity
                                                onPress={() => handleOpenCommentModal(verseComments[0])}
                                                style={{ marginLeft: 6 }}
                                            >
                                                <Text style={{ fontSize: 16 }}>💬</Text>
                                            </TouchableOpacity>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                </>
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

            {showCommentModal && pressedVerse && typeof pressedVerse.id === 'number' && (
                <CommentModal
                    visible={showCommentModal}
                    onClose={() => setShowCommentModal(false)}
                    verseId={pressedVerse.id}
                />
            )}

            {!showingBookSelector && (
                <ChapterNavigation
                    selectedBook={selectedBook}
                    selectedChapter={selectedChapter}
                    bibleBooks={bibleBooks}
                    isTransitioning={isTransitioning}
                    handlePreviousChapter={handlePreviousChapter}
                    handleNextChapter={handleNextChapter}

                    hasReachedBottom={hasReachedBottom}
                    handleMarkComplete={handleMarkComplete}
                    isChapterCompleted={isChapterCompleted}
                />

            )}
            {showReadCommentModal && (
                <ReadCommentModal
                    visible={showReadCommentModal}
                    onClose={handleCloseCommentModal}
                    comment={selectedComment}
                />
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
    booksList: {
        flex: 1,
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
        position: 'relative'
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
    favoriteVerse: {
        backgroundColor: '#fff7ed',
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

    commentContainer: {
        marginTop: 4,
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: '#38bdf8', // light blue
    },
    commentText: {
        fontStyle: 'italic',
        fontSize: 13,
        color: '#1e3a8a',
    },
    commentDate: {
        fontSize: 11,
        color: '#64748b',
    }
});