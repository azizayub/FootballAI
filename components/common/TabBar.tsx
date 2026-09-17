import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Colors } from '@/constants/colors';
import { Fonts, FontSizes, Radii } from '@/constants/theme';

// expo-router bringt seit SDK 57 eigene Bottom-Tabs-Typen mit, die nicht mehr
// deckungsgleich mit denen aus @react-navigation/bottom-tabs sind. Den Prop-Typ
// deshalb aus dem Navigator selbst ableiten statt ihn direkt zu importieren.
type TabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>
>[0];

// Das Figma nutzt Apples "Button - Liquid Glass - Text" (iOS 26) in der Variante
// mode="Light". Liquid Glass ist adaptiv und bricht den Hintergrund - auf dem
// schwarzen App-Hintergrund waere es also dunkel. Der helle Look aus dem Design
// muss deshalb ueber tintColor erzwungen werden.
const supportsLiquidGlass = isLiquidGlassAvailable();

// Abstand der Bar zur Home-Indicator-Kante.
const BOTTOM_GAP = 8;

export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  const tabs = state.routes.map((route, index) => {
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
        style={[styles.tab, isFocused && styles.tabActive]}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={label}
      >
        <Text style={[styles.tabLabel, isFocused ? styles.tabLabelActive : styles.tabLabelInactive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  });

  return (
    <View
      style={[styles.wrapper, { paddingBottom: insets.bottom + BOTTOM_GAP }]}
      pointerEvents="box-none"
    >
      {supportsLiquidGlass ? (
        <GlassView
          style={styles.surface}
          glassEffectStyle="regular"
          colorScheme="light"
          tintColor={Colors.tabBarTint}
        >
          {tabs}
        </GlassView>
      ) : (
        // Ohne natives Liquid Glass (Android, iOS < 26, Expo Go ohne Dev Build)
        // wird der helle Frost-Look mit BlurView plus Tint nachgebaut.
        <BlurView style={styles.surface} tint="systemThickMaterialLight" intensity={80}>
          <View style={styles.fallbackTint} pointerEvents="none" />
          {tabs}
        </BlurView>
      )}
    </View>
  );
}

/** Gesamthoehe, die der Inhalt unter sich frei lassen muss. */
export const TAB_BAR_HEIGHT = 56;
export const TAB_BAR_BOTTOM_GAP = BOTTOM_GAP;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  surface: {
    flexDirection: 'row',
    alignItems: 'center',
    height: TAB_BAR_HEIGHT,
    padding: 8,
    borderRadius: Radii.tabBar,
    overflow: 'hidden',
  },
  fallbackTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.tabBarFallback,
  },
  tab: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: Radii.tabPill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.tabActivePill,
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
