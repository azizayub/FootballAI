import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

// Das Figma nutzt Apples "Button - Liquid Glass - Text" (iOS 26). Wo das native
// Material verfuegbar ist, wird es benutzt - sonst BlurView als Ersatz.
const supportsLiquidGlass = isLiquidGlassAvailable();

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
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]} pointerEvents="box-none">
      {supportsLiquidGlass ? (
        <GlassView style={styles.surface} glassEffectStyle="regular" colorScheme="light">
          {tabs}
        </GlassView>
      ) : (
        <BlurView style={styles.surface} tint="light" intensity={Platform.OS === 'android' ? 0 : 60}>
          <View style={styles.fallbackTint} pointerEvents="none" />
          {tabs}
        </BlurView>
      )}
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
  surface: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    padding: 8,
    borderRadius: Radii.tabBar,
    overflow: 'hidden',
  },
  fallbackTint: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
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
    backgroundColor: Colors.background,
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
