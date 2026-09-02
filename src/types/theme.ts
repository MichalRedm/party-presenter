export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  colors: {
    bgGradient: string;
    cardBg: string;
    cardBorder: string;
    accentPrimary: string;
    accentSecondary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    glowColor: string;
  };
  particleType: 'none' | 'stars' | 'confetti' | 'bubbles' | 'cyber';
  fontHeading?: string;
  fontBody?: string;
}
