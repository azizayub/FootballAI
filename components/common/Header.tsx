import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes, Spacing } from '@/constants/theme';
import { v } from '@/constants/layout';

const AVATAR_SIZE = v(50);

/** Hoehe der Kopfzeile ohne Safe Area - der Screen braucht sie fuer den Abstand. */
export const HEADER_CONTENT_HEIGHT = AVATAR_SIZE;

interface HeaderProps {
  profileImageUri?: string;
  onPressProfile?: () => void;
}

/**
 * Kopfzeile aus Figma Node 1:82. Liegt fixiert ueber dem Inhalt, deshalb
 * transparent - die Lesbarkeit kommt vom FadeBlur dahinter.
 * Logo und Avatar sitzen auf derselben Mittelachse und buendig zum restlichen
 * Seitenrand.
 */
export function Header({ profileImageUri, onPressProfile }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} pointerEvents="box-none">
      <View style={styles.logo}>
        <Text style={styles.logoFootball}>Football</Text>
        <Text style={styles.logoAI}>AI</Text>
      </View>

      <TouchableOpacity
        style={styles.avatar}
        onPress={onPressProfile}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Profil"
      >
        {profileImageUri ? (
          <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: Spacing.screen,
    paddingRight: Spacing.screen,
    backgroundColor: 'transparent',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  logoFootball: {
    fontFamily: Fonts.interRegular,
    fontSize: FontSizes.logoHeader,
    color: Colors.logoMuted,
  },
  logoAI: {
    fontFamily: Fonts.interItalic,
    fontSize: FontSizes.logoHeader,
    color: Colors.primaryText,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    backgroundColor: Colors.cardBackground,
  },
});
