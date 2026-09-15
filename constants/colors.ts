/**
 * Farbwerte 1:1 aus Figma "Football AI" (File FhfNURvKqq9mkpc7y2feLg).
 * Das neue Design arbeitet mit transluzenten Weiss-Overlays auf Schwarz
 * statt mit festen Grautoenen - deshalb sind mehrere Werte rgba statt hex.
 */
export const Colors = {
  background: '#000000',

  // Karten-Flaechen
  cardBackground: '#1B1B1B',              // Chat-Karten (Node 205:4 / 205:10 / 216:1334)
  glassCard: 'rgba(255,255,255,0.08)',    // Frage-Karte (Node 1:145)
  searchBackground: 'rgba(187,187,187,0.08)', // Suchleiste (Node 1:176)
  inputBackground: 'rgba(255,255,255,0.08)',

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
  tabInactiveText: '#1A1A1A',             // Labels-Vibrant-Controls/Primary
  tabBarFallback: 'rgba(235,235,235,0.72)', // wenn Liquid Glass nicht verfuegbar

  // Runde Icon-Buttons (Node 205:156 / 205:406)
  iconButtonBackground: '#FFFFFF',
  iconButtonIcon: '#1A1A1A',

  // aus PRD 6.1 uebernommen - im Figma (noch) nicht designt
  ratingBadge: '#34C759',
  comparisonBlue: '#3B82F6',
  comparisonRed: '#EF4444',
  rankingFirst: '#FF3B30',
  rankingSecond: '#FF6B35',
  rankingThird: '#FF9500',

  border: 'rgba(255,255,255,0.10)',
  divider: 'rgba(255,255,255,0.18)',      // Trenner in der Suchleiste (Node 1:178)
};
