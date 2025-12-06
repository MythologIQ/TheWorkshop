import React, { useMemo, useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { useProfiles } from '../runtime/hooks/useProfiles';

const PROFILE_COLORS = [
  { id: 'rose', label: 'Rose', value: '#F472B6' },
  { id: 'violet', label: 'Violet', value: '#A855F7' },
  { id: 'ember', label: 'Ember', value: '#FB923C' },
  { id: 'sky', label: 'Sky', value: '#38BDF8' },
  { id: 'mint', label: 'Mint', value: '#34D399' },
];

interface ProfileSelectionPageProps {
  onClose?: () => void;
}

const ProfileSelectionPage: React.FC<ProfileSelectionPageProps> = ({ onClose }) => {
  const translation = useTranslation();
  const {
    profiles,
    activeProfile,
    createProfile,
    setActiveProfileId,
  } = useProfiles();
  const [name, setName] = useState('');
  const [color, setColor] = useState(PROFILE_COLORS[0].value);
  const canCreate = Boolean(name.trim());

  const sortedProfiles = useMemo(
    () => [...profiles].sort((a, b) => (a.displayName.localeCompare(b.displayName))),
    [profiles],
  );

  const handleSelectProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    onClose?.();
  };

  const handleCreateProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreate) return;
    const profile = createProfile({ displayName: name.trim(), color });
    setName('');
    setColor(PROFILE_COLORS[0].value);
    setActiveProfileId(profile.id);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-auto bg-slate-900/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={translation.profiles.selectionHeading}
    >
      <div className="mx-auto w-full max-w-5xl space-y-6 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-900/30">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            {translation.profiles.suggestionLabel}
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">{translation.profiles.selectionHeading}</h1>
          <p className="text-sm text-slate-500">{translation.profiles.selectionDescription}</p>
          {activeProfile && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: activeProfile.color }} />
              <span>
                {translation.profiles.activeLabel}: <span className="font-semibold">{activeProfile.displayName}</span>
              </span>
            </div>
          )}
        </header>

        <section className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {sortedProfiles.map((profile) => {
              const isActive = profile.id === activeProfile?.id;
              return (
                <article
                  key={profile.id}
                  className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm shadow-slate-200"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold uppercase tracking-[0.3em] text-white"
                        style={{ backgroundColor: profile.color || '#CBD5F5' }}
                        aria-hidden="true"
                      >
                        {profile.displayName
                          .split(' ')
                          .map((word) => word.charAt(0))
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{profile.displayName}</p>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                          {isActive ? translation.profiles.activeLabel : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectProfile(profile.id)}
                      className="rounded-full border border-fuchsia-500 bg-fuchsia-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-500 transition hover:bg-fuchsia-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
                      aria-pressed={isActive}
                    >
                      {translation.profiles.continueButton}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <form
          className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-200"
          onSubmit={handleCreateProfile}
        >
          <header className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {translation.profiles.createHeading}
            </p>
            <p className="text-sm text-slate-500">{translation.profiles.createColorHelp}</p>
          </header>
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700" htmlFor="profile-name">
              {translation.profiles.createNameLabel}
            </label>
            <input
              id="profile-name"
              name="profileName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">{translation.profiles.createColorLabel}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PROFILE_COLORS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500 ${
                    color === option.value ? 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-500' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                  aria-pressed={color === option.value}
                >
                  <span
                    className="inline-flex h-3 w-3 rounded-full border border-slate-300"
                    style={{ backgroundColor: option.value }}
                  />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={!canCreate}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:border-fuchsia-400 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
          >
            {translation.profiles.createButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSelectionPage;
