import { Platform, TextStyle } from 'react-native';

/**
 * Schriftfamilien exakt so, wie sie im Figma-File verwendet werden.
 * Inter, Instrument Serif und Roboto kommen als Webfont mit (expo-font),
 * SF Pro ist die iOS-Systemschrift und faellt auf Android auf Roboto zurueck.
 */
export const Fonts = {
  interRegular: 'Inter_400Regular',
  interItalic: 'Inter_400Regular_Italic',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
  serifItalic: 'InstrumentSerif_400Regular_Italic',
  robotoMedium: 'Roboto_500Medium',
  // "Rankings" in der Tab-Bar ist im Figma SF Pro Medium.
  sfProMedium: Platform.select({ ios: undefined, default: 'Roboto_500Medium' }),
} as const;

/** Schriftgroessen aus Figma (Frame 430x932). */
export const FontSizes = {
  logoSplash: 44,
  logoHeader: 25,
  greeting: 40,
  subGreeting: 16,
  sectionTitle: 18,
  body: 16,
  comparePill: 13,
  tabLabel: 14,
  statLabel: 11,
  statValue: 18,
};

/** Eckenradien aus Figma. */
export const Radii = {
  searchBar: 39,
  card: 15,
  pill: 100,
  tabBar: 28,
  tabPill: 20,
  avatar: 9999,
  button: 15,
};

/**
 * Abstaende auf 4er-Raster normalisiert. Im Figma schwanken die Werte
 * (28/33 px Seitenrand, 18/21/31 px Innenabstand) - hier vereinheitlicht.
 */
export const Spacing = {
  screen: 28,        // Seitenrand fuer Suchleiste, Karten und Textbloecke
  logoInset: 44,     // Logo sitzt im Design bewusst weiter eingerueckt
  cardPaddingX: 20,
  cardPaddingY: 20,
  gap: 16,
};

/** Wiederkehrende Textstile, damit die Screens nur noch komponieren. */
export const TextStyles: Record<string, TextStyle> = {
  greeting: { fontFamily: Fonts.serifItalic, fontSize: FontSizes.greeting },
  sectionTitle: { fontFamily: Fonts.interSemiBold, fontSize: FontSizes.sectionTitle },
  body: { fontFamily: Fonts.interMedium, fontSize: FontSizes.body },
  bodySemiBold: { fontFamily: Fonts.interSemiBold, fontSize: FontSizes.body },
  roboto: { fontFamily: Fonts.robotoMedium, fontSize: FontSizes.body },
};
