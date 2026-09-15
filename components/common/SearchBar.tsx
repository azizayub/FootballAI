import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontSizes, Radii } from '@/constants/theme';

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
