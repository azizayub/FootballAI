import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { GlassView } from 'expo-glass-effect';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes, Radii } from '@/constants/theme';
import { GLASS_RIM_WIDTH, GlassSurface } from '@/components/common/GlassSurface';
import { supportsLiquidGlass } from '@/components/common/glassSupport';
import { POSITIONS, POSITION_LABELS } from '@/constants/positions';
import { PlayerPosition } from '@/types/player';

const TRACK_HEIGHT = 44;
const PILL_HEIGHT = 32;
/**
 * Innenhoehe der Spur: die Lichtkante nimmt oben und unten je 1 pt weg. Die
 * Reihe darf keinen Punkt hoeher sein, sonst laesst iOS sie vertikal scrollen
 * und federn.
 */
const INNER_HEIGHT = TRACK_HEIGHT - GLASS_RIM_WIDTH * 2;
const PILL_TOP = (INNER_HEIGHT - PILL_HEIGHT) / 2;
/** Spur-Innenrand, damit die Pille nicht an der Glaskante klebt. */
const TRACK_INSET = 6;
const SLIDE_DURATION = 260;
/** Ab wann der Slider am Ziel "angekommen" ist und das Label scharf wird. */
const ARRIVAL_DELAY = Math.round(SLIDE_DURATION * 0.6);
const LABEL_FADE = 120;

interface PillLayout {
  x: number;
  width: number;
}

interface LayeredLabelProps {
  text: string;
  visible: boolean;
  /** Verzoegerung beim Einblenden bzw. Ausblenden. */
  showDelay: number;
  hideDelay: number;
}

/**
 * Label mit eigener Deckkraft-Animation. Jede Position hat zwei davon - eines
 * unter dem Glas, eines darueber - und die Verzoegerungen legen fest, welches
 * gerade zu sehen ist (siehe PositionFilter).
 */
function LayeredLabel({ text, visible, showDelay, hideDelay }: LayeredLabelProps) {
  const opacity = useSharedValue(visible ? 1 : 0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Beim ersten Rendern ohne Animation - sonst blenden beim Oeffnen des
    // Screens alle Labels einmal ein.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    opacity.value = withDelay(
      visible ? showDelay : hideDelay,
      withTiming(visible ? 1 : 0, { duration: LABEL_FADE })
    );
  }, [visible, showDelay, hideDelay, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.Text style={[styles.label, style]}>{text}</Animated.Text>;
}

interface PositionFilterProps {
  value: PlayerPosition;
  onChange: (position: PlayerPosition) => void;
}

/**
 * Positions-Filter aus Figma Node 336:276: eine Glas-Spur (44 hoch, Radius 39)
 * mit den Positionen darin.
 *
 * Aufbau von hinten nach vorn:
 *   1. Labels UNTER dem Glas - der Slider bricht sie, wenn er darueber gleitet
 *   2. Glas-Slider, wandert auf die aktive Position
 *   3. Labels UEBER dem Glas - nur das aktive ist sichtbar, und zwar scharf
 *
 * Warum doppelt: In Ruhe wuerde das Glas das aktive Label so stark brechen,
 * dass es kaum lesbar ist. Laegen dagegen alle Labels ueber dem Glas, gaebe es
 * beim Gleiten nichts mehr zu brechen und der Liquid-Glass-Effekt waere weg.
 * Deshalb wechselt jedes Label die Ebene: beim Verlassen taucht es sofort
 * unters Glas ab, am Ziel erscheint es erst oben, wenn der Slider ankommt.
 *
 * Gegenueber dem Figma um ZM und TW erweitert - zehn Pillen passen nicht mehr
 * nebeneinander, deshalb scrollt die Reihe horizontal.
 */
export function PositionFilter({ value, onChange }: PositionFilterProps) {
  const [layouts, setLayouts] = useState<Partial<Record<PlayerPosition, PillLayout>>>({});

  const sliderX = useSharedValue(0);
  const sliderWidth = useSharedValue(0);

  const active = layouts[value];

  useEffect(() => {
    if (!active) return;

    // Beim ersten Messen sofort sitzen, sonst gleitet der Slider beim Oeffnen
    // des Screens von links ins Bild.
    if (sliderWidth.value === 0) {
      sliderX.value = active.x;
      sliderWidth.value = active.width;
      return;
    }

    sliderX.value = withTiming(active.x, { duration: SLIDE_DURATION });
    sliderWidth.value = withTiming(active.width, { duration: SLIDE_DURATION });
  }, [active, sliderX, sliderWidth]);

  const sliderStyle = useAnimatedStyle(() => ({
    width: sliderWidth.value,
    transform: [{ translateX: sliderX.value }],
  }));

  const handlePillLayout = (position: PlayerPosition) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setLayouts((current) => {
      const previous = current[position];
      if (previous && previous.x === x && previous.width === width) return current;
      return { ...current, [position]: { x, width } };
    });
  };

  return (
    <GlassSurface
      radius={Radii.searchBar}
      fill={Colors.filterTrack}
      style={styles.track}
      contentStyle={styles.trackContent}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        alwaysBounceVertical={false}
        directionalLockEnabled
        contentContainerStyle={styles.row}
        keyboardShouldPersistTaps="handled"
      >
        {POSITIONS.map((position) => (
          <Pressable
            key={position}
            style={styles.pill}
            onLayout={handlePillLayout(position)}
            onPress={() => onChange(position)}
            accessibilityRole="button"
            accessibilityState={{ selected: position === value }}
            accessibilityLabel={`Position ${POSITION_LABELS[position]}`}
          >
            <LayeredLabel
              text={POSITION_LABELS[position]}
              visible={position !== value}
              showDelay={0}
              hideDelay={ARRIVAL_DELAY}
            />
          </Pressable>
        ))}

        {/* Liegt VOR den Labels, damit das Glas sie bricht - und laesst Taps
            durch, sonst waere die markierte Position nicht mehr antippbar. */}
        <Animated.View style={[styles.slider, sliderStyle]} pointerEvents="none">
          {supportsLiquidGlass ? (
            <GlassView
              style={styles.sliderSurface}
              glassEffectStyle="clear"
              tintColor={Colors.filterSliderTint}
            />
          ) : (
            <View style={[styles.sliderSurface, styles.sliderFallback]} />
          )}
        </Animated.View>

        {/* Ueber dem Glas: das aktive Label, ungebrochen. Liegt deckungsgleich
            auf dem Label darunter, daher dieselben gemessenen Positionen. */}
        {POSITIONS.map((position) => {
          const layout = layouts[position];
          if (!layout) return null;
          return (
            <View
              key={position}
              style={[styles.topLabel, { left: layout.x, width: layout.width }]}
              pointerEvents="none"
            >
              <LayeredLabel
                text={POSITION_LABELS[position]}
                visible={position === value}
                showDelay={ARRIVAL_DELAY}
                hideDelay={0}
              />
            </View>
          );
        })}
      </ScrollView>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  track: {
    height: TRACK_HEIGHT,
  },
  trackContent: {
    justifyContent: 'center',
  },
  row: {
    // Feste Hoehe, damit der absolut gesetzte Slider eine verlaessliche
    // Bezugshoehe hat - exakt die Innenhoehe, siehe INNER_HEIGHT.
    height: INNER_HEIGHT,
    alignItems: 'center',
    paddingHorizontal: TRACK_INSET,
    gap: 4,
  },
  pill: {
    height: PILL_HEIGHT,
    minWidth: 48,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: Colors.primaryText,
    fontFamily: Fonts.interSemiBold,
    fontSize: FontSizes.body,
  },
  topLabel: {
    position: 'absolute',
    top: PILL_TOP,
    height: PILL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    position: 'absolute',
    left: 0,
    top: PILL_TOP,
    height: PILL_HEIGHT,
  },
  sliderSurface: {
    flex: 1,
    borderRadius: Radii.searchBar,
    borderWidth: 1,
    borderColor: Colors.filterSliderEdge,
    overflow: 'hidden',
  },
  sliderFallback: {
    backgroundColor: Colors.filterActive,
  },
});
