import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

type CreationLabStampProps = {
  className?: string;
};

const CreationLabStamp: React.FC<CreationLabStampProps> = ({ className }) => {
  const { creationLab } = useTranslation();

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-center text-xs uppercase tracking-[0.3em] text-slate-500 shadow-sm shadow-slate-200 ${className ?? ''}`}
    >
      <p className="text-[11px] font-semibold text-slate-900">{creationLab.brandName}</p>
      <p className="text-[10px] leading-tight text-slate-500">{creationLab.stamp}</p>
    </div>
  );
};

export default CreationLabStamp;
