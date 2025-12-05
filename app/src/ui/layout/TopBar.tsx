import React from 'react';
import { stationByKey } from '../../domain/stations';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';

export const TopBar: React.FC = () => {
  const { projects, activeProjectId } = useProjectStore();
  const { activeStation } = useUIStore();
  const project = projects.find((p) => p.id === activeProjectId);
  const station = stationByKey(activeStation);

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
          🛠️
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Current Project</div>
          <div className="text-sm font-semibold text-slate-900">{project?.title || 'No project selected'}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-slate-500">Station</div>
          <div className="text-sm font-semibold text-slate-900">
            {station ? `${station.icon || ''} ${station.name}` : 'Choose a station'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
