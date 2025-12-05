import { StationKey } from './project';

export type StationInfo = {
  key: StationKey;
  name: string;
  themeName: string;
  route: string;
  icon?: string;
};

export const stations: StationInfo[] = [
  { key: 'idea', name: 'Design Dock', themeName: 'Idea Station', route: '/station/idea', icon: '💡' },
  { key: 'build', name: 'Assembly Bay', themeName: 'Build Station', route: '/station/build', icon: '🛠️' },
  { key: 'test', name: 'Diagnostics Corridor', themeName: 'Test Station', route: '/station/test', icon: '🧪' },
  { key: 'memory', name: 'Stellar Archive', themeName: 'Memory Station', route: '/station/memory', icon: '📚' },
  { key: 'reflect', name: 'Orbiter Bridge', themeName: 'Reflect Station', route: '/station/reflect', icon: '🔭' },
  { key: 'share', name: 'Broadcast Deck', themeName: 'Share Station', route: '/station/share', icon: '📡' },
  { key: 'replay', name: 'Time Tunnels', themeName: 'Replay Station', route: '/station/replay', icon: '⏪' },
];

export const stationByKey = (key: StationKey): StationInfo | undefined =>
  stations.find((s) => s.key === key);

export const stationByRoute = (path: string): StationInfo | undefined =>
  stations.find((s) => path.startsWith(s.route));
