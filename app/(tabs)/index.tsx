import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header, HEADER_CONTENT_HEIGHT } from '@/components/common/Header';
import { FadeBlur } from '@/components/common/FadeBlur';
import { PlayerSearchDropdown, SearchBar } from '@/components/common/SearchBar';
import { ChatInput } from '@/components/chat/ChatInput';
import { TAB_BAR_BOTTOM_GAP, TAB_BAR_HEIGHT } from '@/components/common/TabBar';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes, Radii, Spacing } from '@/constants/theme';
import { v } from '@/constants/layout';
import { DUMMY_CHATS, DUMMY_SEARCH_PLAYERS } from '@/constants/dummyData';

const STRINGS = {
  greeting: (name: string) => `Hi ${name}`,
  subGreeting: 'Welche Debatte beenden wir heute?',
  chatsTitle: 'Deine Chats',
  seeAll: 'Siehe alle',
};

const USER_NAME = 'Aziz';

/** Abstand Avatar-Unterkante -> Suchleiste (Figma: 142 - 84). */
const HEADER_TO_SEARCH = v(58);
/** Wie weit der Blur unter die Kopfzeile reicht, bevor er ausblendet. */
const BLUR_OVERHANG = v(40);

/** Home Screen - Figma Node 1:82. */
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [question, setQuestion] = useState('');
  const [comparisonMode, setComparisonMode] = useState(false);

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query.length === 0) return [];
    return DUMMY_SEARCH_PLAYERS.filter((player) =>
      player.name.toLowerCase().includes(query)
    );
  }, [search]);

  const isSearching = searchResults.length > 0;
  const headerHeight = insets.top + HEADER_CONTENT_HEIGHT;

  const handleSelectPlayer = (playerId: number) => {
    setSearch('');
    router.push(`/player/${playerId}`);
  };

  const handleSend = () => {
    if (question.trim().length === 0) return;
    setQuestion('');
    router.push('/chat/new');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + HEADER_TO_SEARCH,
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_GAP + v(32),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SearchBar value={search} onChangeText={setSearch} />

        <Text style={styles.greeting}>{STRINGS.greeting(USER_NAME)}</Text>
        <Text style={styles.subGreeting}>{STRINGS.subGreeting}</Text>

        <KeyboardAvoidingView
          style={styles.questionSlot}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ChatInput
            value={question}
            onChangeText={setQuestion}
            onSend={handleSend}
            comparisonMode={comparisonMode}
            onToggleComparison={() => setComparisonMode((prev) => !prev)}
          />
        </KeyboardAvoidingView>

        <View style={styles.chatsHeader}>
          <Text style={styles.chatsTitle}>{STRINGS.chatsTitle}</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>{STRINGS.seeAll}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chatList}>
          {DUMMY_CHATS.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatCard}
              onPress={() => router.push(`/chat/${chat.id}`)}
              activeOpacity={0.7}
            >
              <Text style={styles.chatTitle} numberOfLines={1}>
                {chat.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Fixiert ueber dem Inhalt: weicher Blur-Uebergang, darauf die Kopfzeile. */}
      <FadeBlur height={headerHeight + BLUR_OVERHANG} />
      <View style={styles.headerSlot} pointerEvents="box-none">
        <Header />
      </View>

      {isSearching && (
        <>
          <Pressable style={styles.overlayBackdrop} onPress={() => setSearch('')} />
          <View style={[styles.overlayDropdown, { top: headerHeight + HEADER_TO_SEARCH + v(58) }]}>
            <PlayerSearchDropdown results={searchResults} onSelect={handleSelectPlayer} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
  },
  headerSlot: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  greeting: {
    marginTop: v(36),
    color: Colors.primaryText,
    fontFamily: Fonts.serifItalic,
    fontSize: FontSizes.greeting,
  },
  subGreeting: {
    // Im Figma sitzt die Unterzeile direkt unter der Begruessung (1 px).
    marginTop: v(1),
    color: Colors.secondaryText,
    fontFamily: Fonts.interMedium,
    fontSize: FontSizes.subGreeting,
  },
  questionSlot: {
    marginTop: v(36),
  },
  chatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: v(52),
    marginBottom: v(16),
  },
  chatsTitle: {
    color: Colors.primaryText,
    fontFamily: Fonts.interSemiBold,
    fontSize: FontSizes.sectionTitle,
  },
  seeAll: {
    color: Colors.secondaryText,
    fontFamily: Fonts.robotoMedium,
    fontSize: FontSizes.body,
  },
  chatList: {
    gap: v(16),
  },
  chatCard: {
    height: v(63),
    justifyContent: 'center',
    paddingHorizontal: Spacing.cardPaddingX,
    borderRadius: Radii.card,
    backgroundColor: Colors.cardBackground,
  },
  chatTitle: {
    color: Colors.secondaryText,
    fontFamily: Fonts.interSemiBold,
    fontSize: FontSizes.body,
  },
  overlayBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayDropdown: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
