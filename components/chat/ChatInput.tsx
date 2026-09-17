import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes, Radii, Spacing } from '@/constants/theme';
import { GlassSurface } from '@/components/common/GlassSurface';
import { v } from '@/constants/layout';

const STRINGS = {
  placeholder: 'Stelle deine Frage',
  comparison: 'Spieler Vergleich',
};

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  comparisonMode: boolean;
  onToggleComparison: () => void;
}

/**
 * Frage-Karte aus Figma Node 1:145 (170 px hoch, transluzentes Weiss).
 * Die Pill stammt im Design aus dem Material-3-Kit (Node 205:864).
 */
export function ChatInput({
  value,
  onChangeText,
  onSend,
  comparisonMode,
  onToggleComparison,
}: ChatInputProps) {
  const canSend = value.trim().length > 0;

  return (
    <GlassSurface
      radius={Radii.card}
      fill={Colors.glassCard}
      style={styles.container}
      contentStyle={styles.content}
    >
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={STRINGS.placeholder}
        placeholderTextColor={Colors.secondaryText}
        multiline
      />

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.pill, comparisonMode && styles.pillActive]}
          onPress={onToggleComparison}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityState={{ selected: comparisonMode }}
        >
          <Ionicons
            name={comparisonMode ? 'close' : 'add'}
            size={15}
            color={comparisonMode ? Colors.tabActiveText : Colors.comparePillText}
          />
          <Text style={[styles.pillLabel, comparisonMode && styles.pillLabelActive]}>
            {STRINGS.comparison}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={onSend}
          disabled={!canSend}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Frage senden"
        >
          <Ionicons name="arrow-up" size={18} color={Colors.iconButtonIcon} />
        </TouchableOpacity>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  container: {
    height: v(170),
  },
  content: {
    paddingHorizontal: Spacing.cardPaddingX - 1,
    paddingTop: Spacing.cardPaddingY - 1,
    paddingBottom: 11,
  },
  input: {
    flex: 1,
    color: Colors.primaryText,
    fontFamily: Fonts.interMedium,
    fontSize: FontSizes.body,
    padding: 0,
    textAlignVertical: 'top',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 32,
    paddingHorizontal: 16,
    borderRadius: Radii.pill,
    backgroundColor: Colors.comparePillBackground,
  },
  pillActive: {
    backgroundColor: Colors.tabActive,
  },
  pillLabel: {
    color: Colors.comparePillText,
    fontFamily: Fonts.interMedium,
    fontSize: FontSizes.comparePill,
    letterSpacing: 0.1,
  },
  pillLabelActive: {
    color: Colors.tabActiveText,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.iconButtonBackground,
  },
});
