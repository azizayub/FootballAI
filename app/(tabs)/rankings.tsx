import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header, HEADER_CONTENT_HEIGHT } from '@/components/common/Header';
import { FadeBlur } from '@/components/common/FadeBlur';
import { PlayerSearchDropdown, SearchBar } from '@/components/common/SearchBar';
import { TAB_BAR_BOTTOM_GAP, TAB_BAR_HEIGHT } from '@/components/common/TabBar';
import { PositionFilter } from '@/components/rankings/PositionFilter';
import { RankingCard } from '@/components/rankings/RankingCard';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes, Spacing } from '@/constants/theme';
import { v } from '@/constants/layout';
import { DUMMY_SEARCH_PLAYERS } from '@/constants/dummyData';
import { useRankings } from '@/hooks/useRankings';
import { PlayerPosition } from '@/types/player';

const STRINGS = {
  positionTitle: 'Position',
  rankingsLabel: 'Rankings',
};

/** Abstand Avatar-Unterkante -> Suchleiste, gleich wie auf dem Home Screen. */
const HEADER_TO_SEARCH = v(58);
const BLUR_OVERHANG = v(40);

/** Rankings Screen - Figma Node 205:878 (aufgeklappt 256:138). */
export default function RankingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState<PlayerPosition>('ST');
  const [expandedRank, setExpandedRank] = useState<number | null>(null);

  const rankings = useRankings(position);

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

  const handleChangePosition = (next: PlayerPosition) => {
    setPosition(next);
    // Eine aufgeklappte Rechnung gehoert zur alten Liste - beim Wechsel zu.
    setExpandedRank(null);
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

        <Text style={styles.positionTitle}>{STRINGS.positionTitle}</Text>

        <View style={styles.filterSlot}>
          <PositionFilter value={position} onChange={handleChangePosition} />
        </View>

        <Text style={styles.rankingsLabel}>{STRINGS.rankingsLabel}</Text>

        <View style={styles.list}>
          {rankings.map((entry) => (
            <RankingCard
              key={entry.player.id}
              entry={entry}
              position={position}
              expanded={expandedRank === entry.rank}
              onToggle={() =>
                setExpandedRank((current) => (current === entry.rank ? null : entry.rank))
              }
              onPressPlayer={() => router.push(`/player/${entry.player.id}`)}
            />
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
  positionTitle: {
    marginTop: v(39),
    color: Colors.primaryText,
    fontFamily: Fonts.interSemiBold,
    fontSize: FontSizes.sectionTitle,
  },
  filterSlot: {
    marginTop: v(25),
  },
  rankingsLabel: {
    marginTop: v(22),
    textAlign: 'right',
    color: Colors.secondaryText,
    fontFamily: Fonts.robotoMedium,
    fontSize: FontSizes.body,
  },
  list: {
    marginTop: v(7),
    gap: v(10),
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
