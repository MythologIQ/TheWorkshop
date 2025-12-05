import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { stations, stationByRoute } from '../../domain/stations';
import { useUIStore } from '../../stores/uiStore';

export const StationNav: React.FC = () => {
  const location = useLocation();
  const { activeStation, setActiveStation } = useUIStore();

  useEffect(() => {
    const station = stationByRoute(location.pathname);
    if (station && station.key !== activeStation) {
      setActiveStation(station.key);
    }
  }, [location.pathname, activeStation, setActiveStation]);

  return (
    <nav aria-label="Stations" className="flex flex-col gap-2 p-3 text-sm">
      {stations.map((station) => (
        <NavLink
          key={station.key}
          to={station.route}
          className={({ isActive }) =>
            [
              'flex items-center gap-2 rounded-lg px-3 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
              isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-700 hover:bg-slate-100',
            ].join(' ')
          }
          aria-label={station.name}
        >
          <span aria-hidden="true">{station.icon || '⬢'}</span>
          <span className="flex flex-col">
            <span className="font-semibold leading-tight">{station.name}</span>
            <span className="text-xs text-slate-500 leading-tight">{station.themeName}</span>
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default StationNav;
