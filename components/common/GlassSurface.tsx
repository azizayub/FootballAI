import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassView } from 'expo-glass-effect';
import { Colors } from '@/constants/colors';
import { supportsLiquidGlass } from './glassSupport';


// Der Lichtsaum laeuft von oben links (hell) nach unten rechts (fast weg) und
// macht die Glaskante auf schwarzem Hintergrund ueberhaupt erst sichtbar.
const RIM_COLORS = [
  'rgba(255,255,255,0.40)',
  'rgba(255,255,255,0.12)',
  'rgba(255,255,255,0.03)',
] as const;

const RIM_WIDTH = 1;

interface GlassSurfaceProps {
  children: ReactNode;
  /** Eckenradius der aeusseren Kante. */
  radius: number;
  /** Flaechenfarbe ohne Liquid Glass - im Figma die Fill-Farbe des Nodes. */
  fill?: string;
  /** Tint fuer echtes Liquid Glass. Deutlich dunkler als der Fallback-Fill,
   *  weil das Material selbst schon aufhellt. */
  tint?: string;
  /** Nur setzen, wenn die Flaeche selbst auf Beruehrung reagiert (Apple:
   *  ".interactive() only on elements that respond to user interaction"). */
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

/**
 * Glasflaeche mit Lichtkante, wie im Figma fuer Suchleiste (Node 1:176) und
 * Frage-Karte (Node 1:145). Liquid Glass ist adaptiv und waere auf dem
 * schwarzen Hintergrund unsichtbar - deshalb ein Grundton plus Lichtsaum.
 */
export function GlassSurface({
  children,
  radius,
  fill = Colors.glassCard,
  tint = Colors.glassTint,
  interactive = false,
  style,
  contentStyle,
}: GlassSurfaceProps) {
  const innerRadius = Math.max(radius - RIM_WIDTH, 0);

  return (
    <LinearGradient
      colors={RIM_COLORS}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: radius, padding: RIM_WIDTH }, style]}
    >
      {supportsLiquidGlass ? (
        <GlassView
          style={[styles.inner, { borderRadius: innerRadius }, contentStyle]}
          glassEffectStyle="clear"
          tintColor={tint}
          isInteractive={interactive}
        >
          {children}
        </GlassView>
      ) : (
        <BlurView
          style={[styles.inner, { borderRadius: innerRadius }, contentStyle]}
          tint="dark"
          intensity={24}
        >
          <View style={[styles.fallbackFill, { backgroundColor: fill }]} pointerEvents="none" />
          {children}
        </BlurView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    overflow: 'hidden',
  },
  fallbackFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
