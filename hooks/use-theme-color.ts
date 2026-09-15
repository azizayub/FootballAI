import { Colors } from '@/constants/colors';

export function useThemeColor(colorName: keyof typeof Colors): string {
  return Colors[colorName];
}
