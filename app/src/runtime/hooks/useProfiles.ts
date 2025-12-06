import { useSyncExternalStore } from 'react';
import {
  createProfile,
  deleteProfile,
  getActiveProfile,
  getActiveProfileId,
  getProfiles,
  setActiveProfileId,
  subscribe,
  updateProfile,
} from '../store/profileStore';

export const useProfiles = () => {
  const profiles = useSyncExternalStore(subscribe, getProfiles, () => []);
  const activeProfileId = useSyncExternalStore(subscribe, getActiveProfileId, () => '');
  const activeProfile = useSyncExternalStore(subscribe, getActiveProfile, () => null);

  return {
    profiles,
    activeProfile,
    activeProfileId,
    createProfile,
    updateProfile,
    deleteProfile,
    setActiveProfileId,
  };
};
