import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_PROFILE_ID } from '../../../domain/profile';

const clearStorage = () => {
  if (typeof globalThis?.localStorage !== 'undefined') {
    globalThis.localStorage.clear();
  }
};

const loadProfileStore = async () => {
  vi.resetModules();
  clearStorage();
  return import('../profileStore');
};

describe('profileStore', () => {
  it('initializes with the default profile', async () => {
    const { getActiveProfileId, getProfiles } = await loadProfileStore();
    expect(getActiveProfileId()).toBe(DEFAULT_PROFILE_ID);
    expect(getProfiles()).toHaveLength(1);
  });

  it('can create, update, and delete profiles', async () => {
    const { createProfile, getProfiles, getActiveProfileId, updateProfile, deleteProfile } =
      await loadProfileStore();
    const profile = createProfile({ displayName: 'Ada', ageBand: 'tweens' });
    expect(getActiveProfileId()).toBe(profile.id);

    const updated = updateProfile(profile.id, { displayName: 'Ada Lovelace' });
    expect(updated?.displayName).toBe('Ada Lovelace');

    const deleted = deleteProfile(profile.id);
    expect(deleted).toBe(true);
    expect(getProfiles().some((entry) => entry.id === profile.id)).toBe(false);
    expect(getActiveProfileId()).toBe(DEFAULT_PROFILE_ID);
  });
});
