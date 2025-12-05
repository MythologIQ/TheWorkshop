import React from 'react';
import { Link } from 'react-router-dom';

const routes = [
  { path: '/dock/idea', label: 'Design Dock' },
  { path: '/bay/build', label: 'Assembly Bay' },
  { path: '/corridor/test', label: 'Diagnostics Corridor' },
  { path: '/vault/memory', label: 'Stellar Archive' },
  { path: '/bridge/reflect', label: 'Orbiter Bridge' },
  { path: '/deck/share', label: 'Broadcast Deck' },
  { path: '/tunnels/replay', label: 'Time Tunnels' },
];

export const NavOverlay: React.FC = () => {
  return (
    <nav className="flex gap-3 flex-wrap p-3 bg-slate-100 text-sm">
      {routes.map((r) => (
        <Link key={r.path} to={r.path} className="hover:underline">
          {r.label}
        </Link>
      ))}
    </nav>
  );
};
