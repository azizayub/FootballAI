/**
 * Farbwerte 1:1 aus Figma "Football AI" (File FhfNURvKqq9mkpc7y2feLg).
 * Das neue Design arbeitet mit transluzenten Weiss-Overlays auf Schwarz
 * statt mit festen Grautoenen - deshalb sind mehrere Werte rgba statt hex.
 */
export const Colors = {
  background: '#000000',

  // Karten-Flaechen
  cardBackground: '#1B1B1B',              // Chat-Karten (Node 205:4 / 205:10 / 216:1334)
  glassCard: 'rgba(255,255,255,0.08)',    // Frage-Karte (Node 1:145), Fallback-Fill
  searchBackground: 'rgba(187,187,187,0.08)', // Suchleiste (Node 1:176), Fallback-Fill
  inputBackground: 'rgba(255,255,255,0.08)',
  // Liquid Glass hellt von sich aus auf. Die Figma-Fills als Tint zu nehmen
  // macht die Flaechen viel zu hell - deshalb ein dunkler Tint fuers Glas.
  glassTint: 'rgba(12,12,12,0.55)',

  // Text
  primaryText: '#FFFFFF',
  secondaryText: '#888888',               // Node 1:131 / 1:177 / 205:166 / 205:874
  logoMuted: 'rgba(255,255,255,0.11)',    // "Football" im Logo (Node 1:17 / 202:13)

  // Spieler-Vergleich-Pill (Node 205:864, Material-3-Kit)
  comparePillBackground: 'rgba(0,0,0,0.85)',
  comparePillText: 'rgba(246,246,246,0.48)',

  // Tab-Bar (Node 216:1280-1283, Apple iOS-26-Kit)
  tabActive: '#FFFFFF',
  tabActiveText: '#000000',
  tabActivePill: '#000000',               // Slider-Fallback ohne Liquid Glass
  tabInactiveText: '#1A1A1A',             // Labels-Vibrant-Controls/Primary
  // Die Kapsel ist im Design weiss mit leichtem Verlauf; Glas steckt nur im
  // Slider, der auf den aktiven Tab wandert.
  tabBarCapsuleTop: 'rgba(255,255,255,0.98)',
  tabBarCapsuleBottom: 'rgba(198,198,198,0.92)',
  tabSliderTint: 'rgba(255,255,255,0.10)',
  tabSliderEdge: 'rgba(255,255,255,0.38)',

  // Runde Icon-Buttons (Node 205:156 / 205:406)
  iconButtonBackground: '#FFFFFF',
  iconButtonIcon: '#1A1A1A',

  // aus PRD 6.1 uebernommen - im Figma (noch) nicht designt
  ratingBadge: '#34C759',
  comparisonBlue: '#3B82F6',
  comparisonRed: '#EF4444',

  // Ranking-Karten Platz 1-3: Verlauf links->rechts, pro Platz schwaecher
  // deckend. Die Farbe haengt am Mannschaftsteil der gewaehlten Position.
  // Rot ist der Verlauf aus dem Figma (Node 205:893); Blau und Gruen sind nach
  // demselben Muster gebaut - Grundton, hellere Mitte, Farbverschiebung am Ende.
  // Auf Weiss (Torwart) braucht der Text dunkle Schrift.
  rankingThemes: {
    attack: {
      gradient: ['#0A3DFF', '#2A6BFF', '#00A6FF'],
      text: '#FFFFFF',
      line: 'rgba(255,255,255,0.6)',
    },
    midfield: {
      gradient: ['#00A63E', '#16C25B', '#7ACC00'],
      text: '#FFFFFF',
      line: 'rgba(255,255,255,0.6)',
    },
    defense: {
      gradient: ['#FF0005', '#FB1F3C', '#FF4800'],
      text: '#FFFFFF',
      line: 'rgba(255,255,255,0.6)',
    },
    goalkeeper: {
      gradient: ['#FFFFFF', '#F0F0F0', '#D6D6D6'],
      text: '#1A1A1A',
      line: 'rgba(26,26,26,0.35)',
    },
  },
  rankingGradientStops: [0, 0.47115, 1] as const,
  rankingCardMeta: '#E6E6E6',            // "Club Land" (Node 210:102)
  rankingTableLine: 'rgba(255,255,255,0.6)',

  // Positions-Filter (Figma Node 336:276 / 336:278)
  filterTrack: 'rgba(187,187,187,0.08)',
  filterActive: 'rgba(187,187,187,0.17)',   // Fallback-Fill ohne Liquid Glass
  filterSliderTint: 'rgba(255,255,255,0.10)',
  filterSliderEdge: 'rgba(255,255,255,0.38)',

  border: 'rgba(255,255,255,0.10)',
  divider: 'rgba(255,255,255,0.18)',      // Trenner in der Suchleiste (Node 1:178)
};
