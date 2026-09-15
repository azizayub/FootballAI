import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontSizes, Radii } from '@/constants/theme';

// expo-router bringt seit SDK 57 eigene Bottom-Tabs-Typen mit, die nicht mehr
// deckungsgleich mit denen aus @react-navigation/bottom-tabs sind. Den Prop-Typ
// deshalb aus dem Navigator selbst ableiten statt ihn direkt zu importieren.
type TabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>
>[0];

export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.container}>
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
              style={[styles.tab, isFocused && styles.tabActive]}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={label}
            >
              <Text
                style={[
                  styles.tabText,
                  isFocused ? styles.tabTextActive : styles.tabTextInactive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: Radii.pill,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: Radii.pill,
  },
  tabActive: {
    backgroundColor: Colors.tabActive,
  },
  tabText: {
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.tabActiveText,
  },
  tabTextInactive: {
    color: Colors.tabInactiveText,
  },
});
