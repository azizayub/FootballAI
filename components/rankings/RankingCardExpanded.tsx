import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes } from '@/constants/theme';
import { formatFactor, formatScore } from '@/lib/rankings';
import { ScoreRow } from '@/types/stats';

const STRINGS = {
  categories: 'Kategorien',
  count: 'Anzahl',
  factor: 'Faktor',
  score: 'Score',
  total: 'Score',
};

interface RankingCardExpandedProps {
  rows: ScoreRow[];
  total: number;
  /** Schrift- und Linienfarbe - auf der weissen Torwart-Karte dunkel. */
  textColor?: string;
  lineColor?: string;
}

/**
 * Score-Tabelle im aufgeklappten Ranking-Eintrag (Figma Node 256:138).
 * Legt die Rechnung aus PRD 7.4 offen: Kategorie, Anzahl, Faktor, Score.
 */
export function RankingCardExpanded({
  rows,
  total,
  textColor = Colors.primaryText,
  lineColor = Colors.rankingTableLine,
}: RankingCardExpandedProps) {
  const text = { color: textColor };
  const line = { borderBottomColor: lineColor };

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, text, styles.categoryCell]}>{STRINGS.categories}</Text>
        <Text style={[styles.headerCell, text, styles.numberCell]}>{STRINGS.count}</Text>
        <Text style={[styles.headerCell, text, styles.numberCell]}>{STRINGS.factor}</Text>
        <Text style={[styles.headerCell, text, styles.numberCell]}>{STRINGS.score}</Text>
      </View>

      {rows.map((row) => (
        <View key={row.label} style={[styles.row, line]}>
          <Text style={[styles.cell, text, styles.categoryCell]} numberOfLines={1}>
            {row.label}
          </Text>
          <Text style={[styles.cell, text, styles.numberCell]}>{formatScore(row.count)}</Text>
          <Text style={[styles.cell, text, styles.numberCell]}>{formatFactor(row.factor)}</Text>
          <Text style={[styles.cell, text, styles.numberCell]}>{formatScore(row.score)}</Text>
        </View>
      ))}

      <View style={styles.totalRow}>
        <Text style={[styles.totalCell, text, styles.categoryCell]}>{STRINGS.total}</Text>
        <View style={styles.numberCell} />
        <View style={styles.numberCell} />
        <Text style={[styles.totalCell, text, styles.numberCell]}>{formatScore(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    marginTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.rankingTableLine,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  headerCell: {
    color: Colors.primaryText,
    fontFamily: Fonts.interRegular,
    fontSize: FontSizes.scoreHeader,
  },
  cell: {
    color: Colors.primaryText,
    fontFamily: Fonts.interRegular,
    fontSize: FontSizes.scoreRow,
  },
  totalCell: {
    color: Colors.primaryText,
    fontFamily: Fonts.interMedium,
    fontSize: FontSizes.scoreRow,
  },
  categoryCell: {
    flex: 1,
  },
  numberCell: {
    width: 56,
  },
});
