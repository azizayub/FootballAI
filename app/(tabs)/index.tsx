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
import { Header } from '@/components/common/Header';
import { PlayerSearchDropdown, SearchBar } from '@/components/common/SearchBar';
import { ChatInput } from '@/components/chat/ChatInput';
import { Colors } from '@/constants/colors';
import { FontSizes, Radii } from '@/constants/theme';
import { DUMMY_CHATS, DUMMY_SEARCH_PLAYERS } from '@/constants/dummyData';

const STRINGS = {
  greeting: (name: string) => `Hi ${name}`,
  subGreeting: 'Welche Debatte beenden wir heute?',
  chatsTitle: 'Deine Chats',
  seeAll: 'Siehe alle',
};

const USER_NAME = 'Aziz';

export default function HomeScreen() {
  const router = useRouter();
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
      <SearchBar value={search} onChangeText={setSearch} />

      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.greetingBlock}>
            <Text style={styles.greeting}>{STRINGS.greeting(USER_NAME)}</Text>
            <Text style={styles.subGreeting}>{STRINGS.subGreeting}</Text>
          </View>

          <KeyboardAvoidingView
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
  body: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  greetingBlock: {
    marginTop: 28,
    marginBottom: 20,
    gap: 4,
  },
  greeting: {
    color: Colors.primaryText,
    fontSize: FontSizes.greeting,
    fontWeight: '700',
  },
  subGreeting: {
    color: Colors.secondaryText,
    fontSize: FontSizes.body + 2,
  },
  chatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 12,
  },
  chatsTitle: {
    color: Colors.primaryText,
    fontSize: FontSizes.sectionTitle,
    fontWeight: '700',
  },
  seeAll: {
    color: Colors.secondaryText,
    fontSize: FontSizes.body,
  },
  chatList: {
    gap: 10,
  },
  chatCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Radii.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  chatTitle: {
    color: Colors.primaryText,
    fontSize: FontSizes.body + 1,
    fontWeight: '500',
  },
  overlayBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayDropdown: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
