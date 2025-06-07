import { colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

export function useAppTheme() {
  const { theme } = useTheme();
  return colors[theme];
}