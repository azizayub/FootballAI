import { isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';

/**
 * Liquid Glass darf nur benutzt werden, wenn beide Pruefungen zutreffen:
 * - isLiquidGlassAvailable: die App laeuft ueberhaupt im Liquid-Glass-Design
 * - isGlassEffectAPIAvailable: die API existiert auf diesem Geraet
 *
 * Die zweite Pruefung ist nicht optional - auf einigen iOS-26-Versionen fehlt
 * die API und GlassView stuerzt ab. Siehe expo/expo#40911.
 */
export const supportsLiquidGlass = isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
