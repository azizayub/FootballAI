import { StyleSheet, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface FadeBlurProps {
  /** Gesamthoehe des Blur-Bereichs inklusive Ausblendung. */
  height: number;
  /** An welchem Rand der Blur klebt; ausgeblendet wird zur Screenmitte hin. */
  edge?: 'top' | 'bottom';
  /** Ab welchem Anteil der Hoehe die Ausblendung beginnt (0-1). */
  fadeStart?: number;
  intensity?: number;
  /** Staerke der Abdunklung am deckenden Ende. */
  shade?: number;
}

/**
 * Weicher Uebergang an einer Bildschirmkante: der Inhalt, der unter die
 * fixierte Kopfzeile bzw. hinter die Tab-Bar scrollt, wird unscharf und blendet
 * aus - statt hart abgeschnitten zu werden.
 *
 * Eine einzelne BlurView haette wieder eine harte Kante. Deshalb liegt sie in
 * einer Maske, deren Verlauf von deckend nach transparent geht: wo die Maske
 * transparent wird, verschwindet auch der Blur.
 */
export function FadeBlur({
  height,
  edge = 'top',
  fadeStart = 0.55,
  intensity = 60,
  shade = 0.35,
}: FadeBlurProps) {
  const isTop = edge === 'top';

  // Deckend an der Kante, transparent zur Mitte hin.
  const maskColors = isTop
    ? (['#000000', '#000000', 'transparent'] as const)
    : (['transparent', '#000000', '#000000'] as const);
  const maskLocations = isTop
    ? ([0, fadeStart, 1] as const)
    : ([0, 1 - fadeStart, 1] as const);

  return (
    <MaskedView
      style={[styles.container, { height }, isTop ? styles.atTop : styles.atBottom]}
      pointerEvents="none"
      maskElement={
        <LinearGradient colors={maskColors} locations={maskLocations} style={styles.fill} />
      }
    >
      <BlurView tint="dark" intensity={intensity} style={styles.fill} />
      {/* Leichte Abdunklung, damit der Inhalt davor lesbar bleibt. */}
      <View style={[styles.fill, { backgroundColor: `rgba(0,0,0,${shade})` }]} />
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  atTop: {
    top: 0,
  },
  atBottom: {
    bottom: 0,
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
