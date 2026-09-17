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
import { Header } from '@/components/common/Header';
import { PlayerSearchDropdown, SearchBar } from '@/components/common/SearchBar';
import { ChatInput } from '@/components/chat/ChatInput';
import { TAB_BAR_BOTTOM_GAP, TAB_BAR_HEIGHT } from '@/components/common/TabBar';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes, Radii, Spacing } from '@/constants/theme';
import { DUMMY_CHATS, DUMMY_SEARCH_PLAYERS } from '@/constants/dummyData';

const STRINGS = {
  greeting: (name: string) => `Hi ${name}`,
  subGreeting: 'Welche Debatte beenden wir heute?',
  chatsTitle: 'Deine Chats',
  seeAll: 'Siehe alle',
};

const USER_NAME = 'Aziz';

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
      <Header />

      <View style={styles.searchSlot}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            // Platz fuer die schwebende Tab-Bar inklusive Safe Area.
            { paddingBottom: insets.bottom + TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_GAP + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

        {isSearching && (
          <>
            <Pressable style={styles.overlayBackdrop} onPress={() => setSearch('')} />
            <View style={styles.overlayDropdown}>
              <PlayerSearchDropdown
                results={searchResults}
                onSelect={handleSelectPlayer}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchSlot: {
    marginTop: 36,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
  },
  greeting: {
    marginTop: 28,
    color: Colors.primaryText,
    fontFamily: Fonts.serifItalic,
    fontSize: FontSizes.greeting,
  },
  subGreeting: {
    marginTop: 12,
    color: Colors.secondaryText,
    fontFamily: Fonts.interMedium,
    fontSize: FontSizes.subGreeting,
  },
  questionSlot: {
    marginTop: 32,
  },
  chatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 44,
    marginBottom: 16,
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
    gap: 16,
  },
  chatCard: {
    height: 64,
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
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayDropdown: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
