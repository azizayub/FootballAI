import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { GlassView } from 'expo-glass-effect';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes, Radii } from '@/constants/theme';
import { GlassSurface } from '@/components/common/GlassSurface';
import { supportsLiquidGlass } from '@/components/common/glassSupport';
import { POSITIONS, POSITION_LABELS } from '@/constants/positions';
import { PlayerPosition } from '@/types/player';

const TRACK_HEIGHT = 44;
const PILL_HEIGHT = 32;
/** Spur-Innenrand, damit die Pille nicht an der Glaskante klebt. */
const TRACK_INSET = 6;
const SLIDE_DURATION = 260;

interface PillLayout {
  x: number;
  width: number;
}

interface PositionFilterProps {
  value: PlayerPosition;
  onChange: (position: PlayerPosition) => void;
}

/**
 * Positions-Filter aus Figma Node 336:276: eine Glas-Spur (44 hoch, Radius 39)
 * mit den Positionen darin.
 *
 * Aufbau wie bei der Tab-Bar: die Beschriftungen liegen flach in der Spur, der
 * **Glas-Slider wandert darueber** und markiert die Auswahl. Das Glas muss vor
 * der Schrift liegen, nicht dahinter - nur dann bricht und vergroessert es das
 * Label, und genau das ist der Liquid-Glass-Effekt. Laege die Schrift in der
 * Pille, waere hinter dem Glas nur Schwarz und der Effekt unsichtbar.
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
            <Text style={styles.label}>{POSITION_LABELS[position]}</Text>
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
    // Bezugshoehe hat - sonst richtet er sich nach der Hoehe der Pillen.
    height: TRACK_HEIGHT,
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
  slider: {
    position: 'absolute',
    left: 0,
    top: (TRACK_HEIGHT - PILL_HEIGHT) / 2,
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
