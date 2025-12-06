import { buildDefaultProfile, buildProfile, DEFAULT_PROFILE_ID, type AgeBand, type Profile, type ProfileId } from '../../domain/profile';

const STORAGE_KEY = 'workshop.profiles';
const ACTIVE_KEY = 'workshop.activeProfileId';

const storageAvailable = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const safeParseProfiles = (raw: string | null): Profile[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Fall through to empty list.
  }
  return [];
};

const persistProfiles = (profiles: Profile[]) => {
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch {
    // Ignore storage errors.
  }
};

const persistActiveId = (id: ProfileId) => {
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    // Ignore storage errors.
  }
};

const ensureDefaultProfile = (profiles: Profile[]): Profile[] => {
  if (profiles.some((profile) => profile.id === DEFAULT_PROFILE_ID)) {
    return profiles;
  }
  return [buildDefaultProfile(), ...profiles];
};

const loadProfiles = (): { profiles: Profile[]; activeId: ProfileId } => {
  const stored = safeParseProfiles(storageAvailable() ? window.localStorage.getItem(STORAGE_KEY) : null);
  const profiles = ensureDefaultProfile(stored);
  const rawActive = storageAvailable() ? window.localStorage.getItem(ACTIVE_KEY) : null;
  const activeId = rawActive && profiles.some((profile) => profile.id === rawActive) ? rawActive : DEFAULT_PROFILE_ID;
  return { profiles, activeId };
};

let { profiles, activeId } = loadProfiles();
persistProfiles(profiles);
persistActiveId(activeId);

const listeners = new Set<() => void>();

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

export const getProfiles = (): Profile[] => profiles;

export const getActiveProfileId = (): ProfileId => activeId;

export const getActiveProfile = (): Profile => profiles.find((profile) => profile.id === activeId) ?? buildDefaultProfile();

export const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const createProfile = (payload: {
  displayName?: string;
  ageBand?: AgeBand;
  avatarId?: string;
  color?: string;
}): Profile => {
  const profile = buildProfile(
    {
      displayName: payload.displayName,
      ageBand: payload.ageBand,
      avatarId: payload.avatarId,
      color: payload.color,
    },
    {},
  );
  profiles = [...profiles, profile];
  persistProfiles(profiles);
  setActiveProfileId(profile.id);
  return profile;
};

export const updateProfile = (id: ProfileId, patch: Partial<Omit<Profile, 'id' | 'createdAt'>>): Profile | null => {
  const index = profiles.findIndex((profile) => profile.id === id);
  if (index === -1) return null;
  const existing = profiles[index];
  const updated: Profile = {
    ...existing,
    displayName: patch.displayName ?? existing.displayName,
    avatarId: patch.avatarId ?? existing.avatarId,
    color: patch.color ?? existing.color,
    ageBand: patch.ageBand ?? existing.ageBand,
    updatedAt: new Date().toISOString(),
  };
  profiles = [...profiles];
  profiles[index] = updated;
  persistProfiles(profiles);
  notify();
  return updated;
};

export const deleteProfile = (id: ProfileId): boolean => {
  if (id === DEFAULT_PROFILE_ID) return false;
  const remaining = profiles.filter((profile) => profile.id !== id);
  if (remaining.length === profiles.length) return false;
  profiles = ensureDefaultProfile(remaining);
  persistProfiles(profiles);
  if (activeId === id) {
    const fallback = profiles.find((profile) => profile.id !== id) ?? profiles[0];
    setActiveProfileId(fallback.id);
  } else {
    notify();
  }
  return true;
};

export const setActiveProfileId = (id: ProfileId): void => {
  if (profiles.some((profile) => profile.id === id)) {
    activeId = id;
    persistActiveId(id);
    notify();
  }
};
