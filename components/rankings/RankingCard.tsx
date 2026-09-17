import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes, Radii } from '@/constants/theme';
import { RankedPlayer } from '@/types/stats';
import { RankingCardExpanded } from './RankingCardExpanded';

const COLLAPSED_HEIGHT = 52;
const AVATAR_SIZE = 33;

/** Ab Platz 4 ist die Karte einfarbig dunkelgrau (Figma Node 210:106). */
const GRADIENT_RANKS = 3;

/**
 * Platz 1 bis 3 teilen sich denselben Verlauf (Figma Node 205:893), er wird
 * pro Platz schwaecher: Platz 1 voll deckend, Platz 2 zu 75 %, Platz 3 zu 50 %.
 */
const RANK_OPACITY = [1, 0.75, 0.5];

function gradientColors(rank: number) {
  const alpha = RANK_OPACITY[rank - 1] ?? 1;
  return Colors.rankingGradient.map((hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }) as unknown as [string, string, string];
}

interface RankingCardProps {
  entry: RankedPlayer;
  expanded: boolean;
  onToggle: () => void;
  onPressPlayer: () => void;
}

/**
 * Ein Eintrag der Rankings-Liste (Figma Node 205:878, aufgeklappt 256:138).
 *
 * Zwei Tap-Ziele, wie in PRD 5.6 beschrieben: der Karten-Body fuehrt zum
 * Spieler, die Platzierung rechts klappt die Score-Rechnung auf und zu.
 */
export function RankingCard({ entry, expanded, onToggle, onPressPlayer }: RankingCardProps) {
  const { player, rank, score, rows } = entry;
  const isTop = rank <= GRADIENT_RANKS;

  const content = (
    <View style={styles.inner}>
      <View style={styles.headerRow}>
        <Pressable style={styles.body} onPress={onPressPlayer} accessibilityRole="button">
          <View style={styles.avatar}>
            <Image source={{ uri: player.photo }} style={styles.avatarImage} />
          </View>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {player.name}
            </Text>
            {isTop ? (
              <View style={styles.metaRow}>
                <Image source={{ uri: player.team.logo }} style={styles.clubLogo} />
                <Text style={styles.flag}>{player.nationalityFlag}</Text>
              </View>
            ) : (
              <Text style={styles.meta} numberOfLines={1}>
                {`${player.team.name} ${player.nationality}`}
              </Text>
            )}
          </View>
        </Pressable>

        <Pressable
          onPress={onToggle}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={
            expanded ? `Score von ${player.name} schliessen` : `Score von ${player.name} zeigen`
          }
          accessibilityState={{ expanded }}
        >
          <Text style={styles.rank}>{rank}</Text>
        </Pressable>
      </View>

      {expanded && (
        <>
          <RankingCardExpanded rows={rows} total={score} />
          <Pressable
            style={styles.chevron}
            onPress={onToggle}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Score schliessen"
          >
            <Ionicons name="chevron-up" size={14} color={Colors.primaryText} />
          </Pressable>
        </>
      )}
    </View>
  );

  return (
    <Animated.View
      layout={LinearTransition.duration(220)}
      style={[styles.card, expanded && styles.cardExpanded]}
    >
      {isTop ? (
        <LinearGradient
          colors={gradientColors(rank)}
          locations={Colors.rankingGradientStops as unknown as [number, number, number]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.fill}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.fill, styles.plainFill]}>{content}</View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.card,
    overflow: 'hidden',
  },
  cardExpanded: {
    overflow: 'visible',
    borderRadius: Radii.card,
    // Figma "Blur + Shadow Big": die aufgeklappte Karte hebt sich von der Liste ab.
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 12,
  },
  fill: {
    borderRadius: Radii.card,
    overflow: 'hidden',
  },
  plainFill: {
    backgroundColor: Colors.cardBackground,
  },
  inner: {
    paddingLeft: 12,
    paddingRight: 22,
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: COLLAPSED_HEIGHT,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Colors.primaryText,
    overflow: 'hidden',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: Colors.primaryText,
    fontFamily: Fonts.interSemiBold,
    fontSize: FontSizes.rankingName,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clubLogo: {
    width: 14,
    height: 14,
  },
  flag: {
    fontSize: FontSizes.rankingMeta,
  },
  meta: {
    color: Colors.rankingCardMeta,
    fontFamily: Fonts.interRegular,
    fontSize: FontSizes.rankingMeta,
  },
  rank: {
    color: Colors.primaryText,
    fontFamily: Fonts.interBold,
    fontSize: FontSizes.rankingRank,
  },
  chevron: {
    alignSelf: 'flex-end',
    paddingTop: 2,
    paddingBottom: 10,
  },
});
