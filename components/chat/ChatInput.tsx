import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontSizes, Radii } from '@/constants/theme';

const STRINGS = {
  placeholder: 'Stelle deine Frage',
  comparisonOn: 'Spieler Vergleich',
  comparisonOff: 'Spieler Vergleich',
};

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  comparisonMode: boolean;
  onToggleComparison: () => void;
}

export function ChatInput({
  value,
  onChangeText,
  onSend,
  comparisonMode,
  onToggleComparison,
}: ChatInputProps) {
  const [height, setHeight] = useState(0);
  const canSend = value.trim().length > 0;

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { height: Math.min(Math.max(44, height), 120) }]}
        value={value}
        onChangeText={onChangeText}
        onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
        placeholder={STRINGS.placeholder}
        placeholderTextColor={Colors.secondaryText}
        multiline
      />
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.chip, comparisonMode && styles.chipActive]}
          onPress={onToggleComparison}
          activeOpacity={0.7}
        >
          <Ionicons
            name={comparisonMode ? 'close' : 'add'}
            size={14}
            color={comparisonMode ? Colors.tabActiveText : Colors.primaryText}
          />
          <Text style={[styles.chipText, comparisonMode && styles.chipTextActive]}>
            {comparisonMode ? STRINGS.comparisonOn : STRINGS.comparisonOff}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-up" size={18} color={Colors.tabActiveText} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radii.card,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 10,
  },
  input: {
    color: Colors.primaryText,
    fontSize: FontSizes.body,
    textAlignVertical: 'top',
    paddingTop: 6,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.searchBackground,
  },
  chipActive: {
    backgroundColor: Colors.tabActive,
    borderColor: Colors.tabActive,
  },
  chipText: {
    color: Colors.primaryText,
    fontSize: FontSizes.statLabel + 1,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.tabActiveText,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.tabActive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.35,
  },
});
