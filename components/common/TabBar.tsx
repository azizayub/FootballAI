import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassView } from 'expo-glass-effect';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes } from '@/constants/theme';
import { v } from '@/constants/layout';
import { supportsLiquidGlass } from './glassSupport';
import { FadeBlur } from './FadeBlur';

// expo-router bringt seit SDK 57 eigene Bottom-Tabs-Typen mit, die nicht mehr
// deckungsgleich mit denen aus @react-navigation/bottom-tabs sind. Den Prop-Typ
// deshalb aus dem Navigator selbst ableiten statt ihn direkt zu importieren.
type TabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>
>[0];

// Masse aus Figma Node 216:1280-1283, relativ zur Kapsel.
const CAPSULE_WIDTH = v(210);
const CAPSULE_HEIGHT = v(56);
const SLIDER_WIDTH = v(108);       // Node 216:1281 - volle Hoehe, Text ausgeblendet
const PILL_LEFT = v(14);           // Node 216:1282 - fix, markiert nur "Home"
const PILL_TOP = v(9);
const PILL_WIDTH = v(81);
const PILL_HEIGHT = v(39);
// Die beiden Tabflaechen ergeben zusammen die Kapselbreite; ihre Mitten treffen
// damit die Textpositionen aus dem Figma (54 bzw. 158).
const RANKINGS_TAB_WIDTH = CAPSULE_WIDTH - SLIDER_WIDTH;

export const TAB_BAR_HEIGHT = CAPSULE_HEIGHT;
export const TAB_BAR_BOTTOM_GAP = v(8);

// Wie weit der Blur ueber die Kapsel hinaus nach oben reicht, bevor er
// ausblendet - der Inhalt soll nicht hart hinter der Bar abgeschnitten werden.
const BLUR_OVERHANG = v(56);

/**
 * Tab-Bar aus Figma Node 216:1280-1283.
 *
 * Aufbau von hinten nach vorn:
 *   1. weisse Kapsel mit leichtem Verlauf
 *   2. Glas-Slider ueber voller Hoehe - wandert auf den aktiven Tab und zeigt
 *      damit an, wo man ist
 *   3. schwarze Pille - **fix** auf der linken Seite, gehoert zur Optik von
 *      "Home" und wandert nicht mit; liegt vor dem Slider, damit das Glas sie
 *      nicht bricht
 *   4. Beschriftungen
 */
export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  const sliderX = useSharedValue(0);

  useEffect(() => {
    const target = state.index === 0 ? 0 : CAPSULE_WIDTH - SLIDER_WIDTH;
    sliderX.value = withTiming(target, { duration: 260 });
  }, [state.index, sliderX]);

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sliderX.value }],
  }));

  return (
    <View
      style={[styles.wrapper, { paddingBottom: insets.bottom + TAB_BAR_BOTTOM_GAP }]}
      pointerEvents="box-none"
    >
      {/* Weicher Uebergang, damit scrollender Inhalt hinter der Bar ausblendet. */}
      <FadeBlur
        edge="bottom"
        height={insets.bottom + TAB_BAR_BOTTOM_GAP + TAB_BAR_HEIGHT + BLUR_OVERHANG}
        intensity={45}
        shade={0.22}
      />

      <LinearGradient
        colors={[Colors.tabBarCapsuleTop, Colors.tabBarCapsuleBottom]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.capsule}
      >
        {/* Wandert auf den aktiven Tab. */}
        <Animated.View style={[styles.slider, sliderStyle]} pointerEvents="none">
          {supportsLiquidGlass ? (
            <GlassView
              style={styles.sliderSurface}
              glassEffectStyle="clear"
              tintColor={Colors.tabSliderTint}
            />
          ) : (
            <View style={[styles.sliderSurface, styles.sliderFallback]} />
          )}
        </Animated.View>

        {/* Fix - markiert "Home", unabhaengig vom aktiven Tab.
            Liegt VOR dem Slider: Liquid Glass bricht und vergroessert alles
            dahinter, die Pille wuerde sonst auf Slider-Groesse aufgezogen und
            aufgehellt. Reihenfolge wie im Figma (216:1282 ueber 216:1281). */}
        <View style={styles.homePill} pointerEvents="none" />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = (options.title ?? route.name) as string;
          const isFocused = state.index === index;
          const isHome = index === 0;

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
              style={[styles.tab, { width: isHome ? SLIDER_WIDTH : RANKINGS_TAB_WIDTH }]}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={label}
            >
              {/* Die Textfarben haengen an der festen Pille, nicht an der Auswahl:
                  "Home" steht immer auf Schwarz, "Rankings" immer auf Weiss. */}
              <Text style={[styles.tabLabel, isHome ? styles.labelOnPill : styles.labelOnCapsule]}>
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
    paddingTop: BLUR_OVERHANG,
    backgroundColor: 'transparent',
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    width: CAPSULE_WIDTH,
    height: CAPSULE_HEIGHT,
    borderRadius: CAPSULE_HEIGHT / 2,
  },
  homePill: {
    position: 'absolute',
    left: PILL_LEFT,
    top: PILL_TOP,
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
    backgroundColor: Colors.tabActivePill,
  },
  slider: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SLIDER_WIDTH,
    height: CAPSULE_HEIGHT,
  },
  sliderSurface: {
    flex: 1,
    borderRadius: CAPSULE_HEIGHT / 2,
    borderWidth: 1,
    borderColor: Colors.tabSliderEdge,
    overflow: 'hidden',
  },
  sliderFallback: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  tab: {
    height: CAPSULE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontFamily: Fonts.sfProMedium,
    fontSize: FontSizes.tabLabel,
    fontWeight: '500',
  },
  labelOnPill: {
    color: Colors.primaryText,
  },
  labelOnCapsule: {
    color: Colors.tabInactiveText,
  },
});
