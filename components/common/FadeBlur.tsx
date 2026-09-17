import { StyleSheet, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface FadeBlurProps {
  /** Gesamthoehe des Blur-Bereichs inklusive Ausblendung. */
  height: number;
  /** Ab welchem Anteil der Hoehe die Ausblendung beginnt (0-1). */
  fadeStart?: number;
  intensity?: number;
}

/**
 * Weicher Uebergang am oberen Rand: der Inhalt, der unter die fixierte
 * Kopfzeile scrollt, wird unscharf und blendet nach unten aus - statt hart
 * abgeschnitten zu werden.
 *
 * Eine einzelne BlurView haette wieder eine harte Unterkante. Deshalb liegt
 * sie in einer Maske, deren Verlauf von deckend nach transparent geht: wo die
 * Maske transparent wird, verschwindet auch der Blur.
 */
export function FadeBlur({ height, fadeStart = 0.55, intensity = 60 }: FadeBlurProps) {
  return (
    <MaskedView
      style={[styles.container, { height }]}
      pointerEvents="none"
      maskElement={
        <LinearGradient
          colors={['#000000', '#000000', 'transparent']}
          locations={[0, fadeStart, 1]}
          style={styles.fill}
        />
      }
    >
      <BlurView tint="dark" intensity={intensity} style={styles.fill} />
      {/* Leichte Abdunklung, damit Logo und Avatar lesbar bleiben. */}
      <View style={[styles.fill, styles.shade]} />
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shade: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
});
