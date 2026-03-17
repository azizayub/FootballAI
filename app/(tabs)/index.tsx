import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { DUMMY_CHATS } from '../../constants/dummyData';
import { Chat } from '../../types/chat';

function Logo() {
  return (
    <Text style={styles.logo}>
      <Text style={styles.logoFootball}>Football</Text>
      <Text style={styles.logoAI}> AI</Text>
    </Text>
  );
}

function Avatar() {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>M</Text>
    </View>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.searchInput}
        placeholder="Spieler suchen"
        placeholderTextColor={Colors.secondaryText}
        value={query}
        onChangeText={setQuery}
      />
      <View style={styles.searchDivider} />
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

function ChatCard({ chat }: { chat: Chat }) {
  return (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() => router.push(`/chat/${chat.id}` as any)}
      activeOpacity={0.7}
    >
      <Text style={styles.chatCardTitle}>{chat.title}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [question, setQuestion] = useState('');
  const [comparisonMode, setComparisonMode] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Logo />
          <Avatar />
        </View>

        {/* Suchleiste */}
        <SearchBar />

        {/* Begrüßung */}
        <View style={styles.greeting}>
          <Text style={styles.greetingName}>Hi Max</Text>
          <Text style={styles.greetingSubtitle}>Welche Debatte beenden wir heute?</Text>
        </View>

        {/* Chat-Eingabefeld */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.questionInput}
            placeholder="Stelle deine Frage"
            placeholderTextColor={Colors.secondaryText}
            value={question}
            onChangeText={setQuestion}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <View style={styles.inputActions}>
            <TouchableOpacity
              style={[styles.compareChip, comparisonMode && styles.compareChipActive]}
              onPress={() => setComparisonMode((v) => !v)}
              activeOpacity={0.7}
            >
              <Text style={[styles.compareChipText, comparisonMode && styles.compareChipTextActive]}>
                {comparisonMode ? '✕ Spieler Vergleich' : '+ Spieler Vergleich'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => router.push('/chat/new' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.sendButtonText}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat-Historie */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Deine Chats</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>Siehe alle</Text>
            </TouchableOpacity>
          </View>
          {DUMMY_CHATS.map((chat) => (
            <ChatCard key={chat.id} chat={chat} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {},
  logoFootball: {
    color: Colors.secondaryText,
    fontSize: 20,
    fontWeight: '200',
  },
  logoAI: {
    color: Colors.primaryText,
    fontSize: 20,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },

  // Suchleiste
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.searchBackground,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: Colors.primaryText,
    fontSize: 15,
  },
  searchDivider: {
    width: 1,
    height: 22,
    backgroundColor: Colors.border,
    marginHorizontal: 10,
  },
  searchButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: Colors.primaryText,
    fontSize: 16,
  },

  // Begrüßung
  greeting: {
    gap: 4,
  },
  greetingName: {
    color: Colors.primaryText,
    fontSize: 26,
    fontWeight: '700',
  },
  greetingSubtitle: {
    color: Colors.secondaryText,
    fontSize: 15,
  },

  // Eingabefeld
  inputCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    minHeight: 130,
  },
  questionInput: {
    color: Colors.primaryText,
    fontSize: 15,
    flex: 1,
    minHeight: 70,
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compareChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compareChipActive: {
    backgroundColor: Colors.primaryText,
    borderColor: Colors.primaryText,
  },
  compareChipText: {
    color: Colors.secondaryText,
    fontSize: 13,
    fontWeight: '500',
  },
  compareChipTextActive: {
    color: Colors.background,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '700',
  },

  // Chat-Historie
  historySection: {
    gap: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    color: Colors.primaryText,
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    color: Colors.secondaryText,
    fontSize: 14,
  },
  chatCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 16,
  },
  chatCardTitle: {
    color: Colors.primaryText,
    fontSize: 15,
    fontWeight: '500',
  },
});
