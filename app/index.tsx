import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes } from '@/constants/theme';

/**
 * Opening Screen - Figma Node 1:9.
 * Logo sitzt nicht exakt mittig, sondern 78 px oberhalb der Frame-Mitte.
 */
export default function OpeningScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/(tabs)'), 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <Text style={styles.logoFootball}>Football</Text>
        <Text style={styles.logoAI}>AI</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 11,
    marginBottom: 157, // 2 x 78.5 px Versatz nach oben gegenueber der Mitte
  },
  logoFootball: {
    fontFamily: Fonts.interRegular,
    fontSize: FontSizes.logoSplash,
    color: Colors.logoMuted,
  },
  logoAI: {
    fontFamily: Fonts.interItalic,
    fontSize: FontSizes.logoSplash,
    color: Colors.primaryText,
  },
});
