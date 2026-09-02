import { ThemeDefinition } from '../types/theme';

export const THEMES: ThemeDefinition[] = [
  {
    id: 'midnight-velvet',
    name: 'Midnight Velvet',
    description: 'Elegancki, głęboki fiolet i indygo ze złotymi akcentami i gwiezdnym tłem',
    colors: {
      bgGradient: 'from-slate-950 via-indigo-950 to-purple-950',
      cardBg: 'rgba(15, 23, 42, 0.75)',
      cardBorder: 'rgba(168, 85, 247, 0.25)',
      accentPrimary: '#a855f7', // Purple 500
      accentSecondary: '#eab308', // Gold 500
      textPrimary: '#ffffff',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      glowColor: 'rgba(168, 85, 247, 0.4)',
    },
    particleType: 'stars',
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    description: 'Mocny, klubowy neonowy cyjan i magenta z dynamicznym blaskiem',
    colors: {
      bgGradient: 'from-black via-slate-950 to-zinc-950',
      cardBg: 'rgba(10, 15, 30, 0.85)',
      cardBorder: 'rgba(6, 182, 212, 0.4)',
      accentPrimary: '#06b6d4', // Cyan 500
      accentSecondary: '#ec4899', // Pink 500
      textPrimary: '#ffffff',
      textSecondary: '#a5f3fc',
      textMuted: '#64748b',
      glowColor: 'rgba(6, 182, 212, 0.5)',
    },
    particleType: 'cyber',
  },
  {
    id: 'golden-glamour',
    name: 'Golden Glamour',
    description: 'Luksusowe złoto, bursztyn i czerń idealne na toasty i wielkie jubileusze',
    colors: {
      bgGradient: 'from-zinc-950 via-stone-900 to-amber-950',
      cardBg: 'rgba(28, 25, 23, 0.8)',
      cardBorder: 'rgba(234, 179, 8, 0.35)',
      accentPrimary: '#eab308', // Gold 500
      accentSecondary: '#f97316', // Orange 500
      textPrimary: '#ffffff',
      textSecondary: '#fef08a',
      textMuted: '#a8a29e',
      glowColor: 'rgba(234, 179, 8, 0.45)',
    },
    particleType: 'confetti',
  },
  {
    id: 'retro-sunset',
    name: 'Retro Synthwave 80s',
    description: 'Kultowy klimat lat 80., różowy horyzont, fiolet i ciepły pomarańcz',
    colors: {
      bgGradient: 'from-slate-950 via-purple-950 to-rose-950',
      cardBg: 'rgba(30, 10, 40, 0.8)',
      cardBorder: 'rgba(244, 63, 94, 0.35)',
      accentPrimary: '#f43f5e', // Rose 500
      accentSecondary: '#8b5cf6', // Violet 500
      textPrimary: '#ffffff',
      textSecondary: '#fecdd3',
      textMuted: '#94a3b8',
      glowColor: 'rgba(244, 63, 94, 0.4)',
    },
    particleType: 'bubbles',
  },
  {
    id: 'emerald-luxury',
    name: 'Emerald Club',
    description: 'Głęboki szmaragd i butelkowa zieleń z perłowymi akcentami',
    colors: {
      bgGradient: 'from-slate-950 via-emerald-950 to-teal-950',
      cardBg: 'rgba(6, 44, 34, 0.75)',
      cardBorder: 'rgba(16, 185, 129, 0.3)',
      accentPrimary: '#10b981', // Emerald 500
      accentSecondary: '#14b8a6', // Teal 500
      textPrimary: '#ffffff',
      textSecondary: '#a7f3d0',
      textMuted: '#94a3b8',
      glowColor: 'rgba(16, 185, 129, 0.4)',
    },
    particleType: 'stars',
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Obsidian',
    description: 'Czysta, nowoczesna ciemna stylistyka bez rozpraszających świateł',
    colors: {
      bgGradient: 'from-zinc-950 via-zinc-900 to-black',
      cardBg: 'rgba(24, 24, 27, 0.85)',
      cardBorder: 'rgba(255, 255, 255, 0.15)',
      accentPrimary: '#38bdf8', // Sky 400
      accentSecondary: '#f3f4f6', // Slate 100
      textPrimary: '#ffffff',
      textSecondary: '#e4e4e7',
      textMuted: '#71717a',
      glowColor: 'rgba(255, 255, 255, 0.15)',
    },
    particleType: 'none',
  },
];

export function getThemeById(themeId: string): ThemeDefinition {
  return THEMES.find(t => t.id === themeId) || THEMES[0];
}
