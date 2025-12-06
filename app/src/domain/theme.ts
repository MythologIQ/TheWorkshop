import type { StationKey } from './project';

export type ThemeId = 'starship' | 'forge' | 'tower';

export interface ThemePalette {
  body: string;
  text: string;
  nav: string;
  card: string;
  accent: string;
  border: string;
  activeBg: string;
  activeText: string;
}

export interface ThemeConfig {
  id: ThemeId;
  displayName: string;
  palette: ThemePalette;
  iconSetId: string;
  backgroundGradient: string;
  backgroundAssetIds: string[];
  stationLabelOverrides?: Partial<Record<StationKey, string>>;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  starship: {
    id: 'starship',
    displayName: 'Starship Shipyard',
    palette: {
      body: 'bg-slate-950',
      text: 'text-white',
      nav: 'bg-slate-900',
      card: 'bg-slate-900/70',
      accent: 'text-fuchsia-400',
      border: 'border-slate-800',
      activeBg: 'bg-slate-800',
      activeText: 'text-white',
    },
    iconSetId: 'starship',
    backgroundGradient: 'radial-gradient(circle at 20% 20%, rgba(244,114,182,0.45), transparent 45%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.35), transparent 50%)',
    backgroundAssetIds: ['starship-hull', 'starship-holo'],
  },
  forge: {
    id: 'forge',
    displayName: 'Dwarven Forge',
    palette: {
      body: 'bg-amber-950',
      text: 'text-amber-50',
      nav: 'bg-amber-900',
      card: 'bg-amber-900/80',
      accent: 'text-orange-300',
      border: 'border-orange-700',
      activeBg: 'bg-orange-700/70',
      activeText: 'text-amber-50',
    },
    iconSetId: 'forge',
    backgroundGradient: 'radial-gradient(circle at 30% 20%, rgba(251,191,36,0.45), transparent 40%), radial-gradient(circle at 80% 10%, rgba(249,115,22,0.35), transparent 50%)',
    backgroundAssetIds: ['forge-anvil', 'forge-fire'],
  },
  tower: {
    id: 'tower',
    displayName: 'Wizard Tower',
    palette: {
      body: 'bg-indigo-950',
      text: 'text-indigo-100',
      nav: 'bg-indigo-900',
      card: 'bg-indigo-900/60',
      accent: 'text-cyan-300',
      border: 'border-indigo-700',
      activeBg: 'bg-indigo-800/60',
      activeText: 'text-cyan-50',
    },
    iconSetId: 'tower',
    backgroundGradient: 'radial-gradient(circle at 15% 10%, rgba(14,165,233,0.35), transparent 45%), radial-gradient(circle at 80% 20%, rgba(236,72,153,0.35), transparent 50%)',
    backgroundAssetIds: ['tower-arcane', 'tower-stars'],
  },
};

export const DEFAULT_THEME: ThemeConfig = THEMES.starship;
