import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassView } from 'expo-glass-effect';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes, Radii } from '@/constants/theme';
import { v } from '@/constants/layout';
import { supportsLiquidGlass } from './glassSupport';

// expo-router bringt seit SDK 57 eigene Bottom-Tabs-Typen mit, die nicht mehr
// deckungsgleich mit denen aus @react-navigation/bottom-tabs sind. Den Prop-Typ
// deshalb aus dem Navigator selbst ableiten statt ihn direkt zu importieren.
type TabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>
>[0];


export const TAB_BAR_HEIGHT = v(56);
export const TAB_BAR_BOTTOM_GAP = 8;

const INNER_PADDING = 8;
const SLIDER_HEIGHT = TAB_BAR_HEIGHT - INNER_PADDING * 2;

type TabLayout = { x: number; width: number };

/**
 * Tab-Bar aus Figma Node 216:1280-1283.
 * Die Kapsel ist weiss; Liquid Glass steckt nur im Slider, der beim Wechsel
 * auf den aktiven Tab wandert.
 */
export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const [layouts, setLayouts] = useState<Record<number, TabLayout>>({});

  const sliderX = useSharedValue(0);
  const sliderWidth = useSharedValue(0);
  const activeLayout = layouts[state.index];

  useEffect(() => {
    if (!activeLayout) return;
    const config = { duration: 260 };
    sliderX.value = withTiming(activeLayout.x, config);
    sliderWidth.value = withTiming(activeLayout.width, config);
  }, [activeLayout, sliderX, sliderWidth]);

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sliderX.value }],
    width: sliderWidth.value,
  }));

  const handleLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setLayouts((prev) => {
      const known = prev[index];
      if (known && known.x === x && known.width === width) return prev;
      return { ...prev, [index]: { x, width } };
    });
  };

  return (
    <View
      style={[styles.wrapper, { paddingBottom: insets.bottom + TAB_BAR_BOTTOM_GAP }]}
      pointerEvents="box-none"
    >
      <LinearGradient
        colors={[Colors.tabBarCapsuleTop, Colors.tabBarCapsuleBottom]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.capsule}
      >
        {activeLayout ? (
          <Animated.View style={[styles.slider, sliderStyle]} pointerEvents="none">
            {supportsLiquidGlass ? (
              <GlassView
                style={styles.sliderSurface}
                glassEffectStyle="regular"
                colorScheme="dark"
                tintColor={Colors.tabSliderTint}
              />
            ) : (
              <View style={[styles.sliderSurface, styles.sliderFallback]} />
            )}
          </Animated.View>
        ) : null}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = (options.title ?? route.name) as string;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              onLayout={handleLayout(index)}
              style={styles.tab}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={label}
            >
              <Text
                style={[styles.tabLabel, isFocused ? styles.tabLabelActive : styles.tabLabelInactive]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    height: TAB_BAR_HEIGHT,
    padding: INNER_PADDING,
    borderRadius: Radii.tabBar,
  },
  slider: {
    position: 'absolute',
    top: INNER_PADDING,
    left: 0,
    height: SLIDER_HEIGHT,
  },
  sliderSurface: {
    flex: 1,
    borderRadius: Radii.tabPill,
    overflow: 'hidden',
  },
  sliderFallback: {
    backgroundColor: Colors.tabActivePill,
  },
  tab: {
    height: SLIDER_HEIGHT,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontFamily: Fonts.sfProMedium,
    fontSize: FontSizes.tabLabel,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Colors.primaryText,
  },
  tabLabelInactive: {
    color: Colors.tabInactiveText,
  },
});
