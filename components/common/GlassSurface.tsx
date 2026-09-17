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
 * Frage-Karte (Node 1:145).
 *
 * Aufbau von hinten nach vorn:
 *   1. LinearGradient - liegt 1 px breit rundum frei und bildet die Lichtkante
 *   2. Backdrop - deckt die Gradient-Flaeche ab, damit der Verlauf NICHT durch
 *      das durchscheinende Glas sichtbar wird und nur die Kante uebrig bleibt
 *   3. Glas - Liquid Glass bzw. BlurView als Ersatz
 *   4. Inhalt
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
      <View style={[styles.inner, { borderRadius: innerRadius }]}>
        <View style={styles.backdrop} pointerEvents="none" />

        {supportsLiquidGlass ? (
          <GlassView
            style={styles.glass}
            glassEffectStyle="clear"
            tintColor={tint}
            isInteractive={interactive}
            pointerEvents="none"
          />
        ) : (
          <BlurView style={styles.glass} tint="dark" intensity={24} pointerEvents="none">
            <View style={[styles.glass, { backgroundColor: fill }]} />
          </BlurView>
        )}

        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    overflow: 'hidden',
  },
  // Blockt den Lichtkanten-Verlauf, damit er nicht durch das Glas durchscheint.
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
  },
  glass: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
  },
});
