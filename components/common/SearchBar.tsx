import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontSizes, Radii } from '@/constants/theme';
import { PlayerAvatar } from './PlayerAvatar';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Spieler suchen',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Ionicons name="arrow-forward" size={18} color={Colors.primaryText} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.searchBackground,
    borderRadius: Radii.card,
    marginHorizontal: 20,
    height: 48,
  },
  input: {
    flex: 1,
    color: Colors.primaryText,
    fontSize: FontSizes.body,
    paddingHorizontal: 16,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.secondaryText,
    opacity: 0.3,
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: Colors.searchBackground,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: Colors.primaryText,
    fontSize: FontSizes.playerName,
    fontWeight: '700',
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
