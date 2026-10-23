// utils/types/theme.ts
export interface ThemeContextInterface {
  darkTheme: boolean;
  toggleTheme: () => void;
  setDarkTheme: (isDark: boolean) => void;
}
