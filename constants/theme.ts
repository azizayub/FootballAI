import { Platform } from 'react-native';

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});

export const FontSizes = {
  logoText: 22,
  greeting: 26,
  sectionTitle: 18,
  playerName: 16,
  body: 14,
  statLabel: 11,
  statValue: 18,
};

export const Radii = {
  card: 14,
  button: 14,
  avatar: 9999,
  pill: 20,
};
