import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes, Radii, Spacing } from '@/constants/theme';
import { GlassSurface } from './GlassSurface';
import { PlayerAvatar } from './PlayerAvatar';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

/** Suchleiste aus Figma Node 1:176 - Pill, 58 px hoch, Radius 39. */
export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Spieler suchen',
}: SearchBarProps) {
  return (
    <GlassSurface
      radius={Radii.searchBar}
      fill={Colors.searchBackground}
      style={styles.container}
      contentStyle={styles.content}
    >
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.secondaryText}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      <View style={styles.divider} />
      <TouchableOpacity
        style={styles.button}
        onPress={onSubmit}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Suchen"
      >
        <Ionicons name="arrow-forward" size={18} color={Colors.iconButtonIcon} />
      </TouchableOpacity>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 58,
    marginHorizontal: Spacing.screen,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.screen - 1,
    paddingRight: 11,
  },
  input: {
    flex: 1,
    color: Colors.primaryText,
    fontFamily: Fonts.robotoMedium,
    fontSize: FontSizes.body,
    padding: 0,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.divider,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.iconButtonBackground,
  },
});

interface PlayerSearchResult {
  id: number;
  name: string;
  nationalityFlag: string;
  photo: string;
  team: { name: string; logo: string };
}

interface PlayerSearchDropdownProps {
  results: PlayerSearchResult[];
  onSelect: (playerId: number) => void;
}

export function PlayerSearchDropdown({ results, onSelect }: PlayerSearchDropdownProps) {
  if (results.length === 0) return null;

  return (
    <View style={dropdownStyles.container}>
      {results.map((player, index) => (
        <TouchableOpacity
          key={player.id}
          style={[dropdownStyles.row, index > 0 && dropdownStyles.rowBorder]}
          onPress={() => onSelect(player.id)}
          activeOpacity={0.7}
        >
          <PlayerAvatar uri={player.photo} size={40} />
          <View style={dropdownStyles.info}>
            <Text style={dropdownStyles.name}>{player.name}</Text>
            <View style={dropdownStyles.metaRow}>
              <Image source={{ uri: player.team.logo }} style={dropdownStyles.clubLogo} />
              <Text style={dropdownStyles.flag}>{player.nationalityFlag}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const dropdownStyles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.screen,
    marginTop: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.cardPaddingX,
    paddingVertical: 12,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: Colors.primaryText,
    fontFamily: Fonts.interSemiBold,
    fontSize: FontSizes.body,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clubLogo: {
    width: 16,
    height: 16,
  },
  flag: {
    fontSize: 14,
  },
});
