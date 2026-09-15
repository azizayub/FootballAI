import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { FontSizes } from '@/constants/theme';

interface HeaderProps {
  profileImageUri?: string;
}

export function Header({ profileImageUri }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.logo}>
        <Text style={styles.logoFootball}>Football</Text>
        <Text style={styles.logoAI}> AI</Text>
      </View>
      <View style={styles.profileContainer}>
        {profileImageUri ? (
          <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoFootball: {
    fontSize: FontSizes.logoText,
    fontWeight: '300',
    color: Colors.secondaryText,
  },
  logoAI: {
    fontSize: FontSizes.logoText,
    fontWeight: '700',
    fontStyle: 'italic',
    color: Colors.primaryText,
  },
  profileContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  profilePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cardBackground,
  },
});
