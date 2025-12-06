import { newId } from './id';

export type ProfileId = string;

export type AgeBand = 'toddlers' | 'young_creators' | 'tweens' | 'teens';

export interface Profile {
  id: ProfileId;
  displayName: string;
  avatarId?: string;
  color?: string;
  ageBand: AgeBand;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PROFILE_ID: ProfileId = 'profile-default';

const now = () => new Date().toISOString();

const ensureName = (value?: string): string => (value && value.trim().length > 0 ? value.trim() : 'Creator');

export const buildProfile = (
  payload: Partial<Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>>,
  overrides?: { id?: ProfileId },
): Profile => {
  const timestamp = now();
  return {
    id: overrides?.id ?? newId('profile'),
    displayName: ensureName(payload.displayName),
    ageBand: payload.ageBand ?? 'young_creators',
    avatarId: payload.avatarId,
    color: payload.color,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const buildDefaultProfile = (): Profile =>
  buildProfile(
    {
      displayName: 'First Creator',
      ageBand: 'young_creators',
    },
    { id: DEFAULT_PROFILE_ID },
  );
