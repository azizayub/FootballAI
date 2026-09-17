import { Dimensions } from 'react-native';

/** Groesse des Figma-Frames "Football AI" (iPhone Pro Max). */
export const DESIGN_WIDTH = 430;
export const DESIGN_HEIGHT = 932;

const { height } = Dimensions.get('window');

/**
 * Das Design ist fuer 932 pt Hoehe gezeichnet. Kuerzere Geraete (iPhone Pro:
 * 874 pt) haben rund 58 pt weniger Platz - der Inhalt wuerde sonst unter die
 * Tab-Bar rutschen. Das vertikale Raster wird deshalb proportional gestaucht.
 * Groessere Geraete werden nicht gestreckt, dort gilt das Design 1:1.
 */
export const vScale = Math.min(1, height / DESIGN_HEIGHT);

/** Rechnet einen vertikalen Designwert auf die Geraetehoehe um. */
export const v = (value: number) => Math.round(value * vScale);
