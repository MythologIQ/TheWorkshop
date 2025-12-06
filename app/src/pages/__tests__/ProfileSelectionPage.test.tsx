import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ProfileSelectionPage from '../ProfileSelectionPage';
import { PreferencesProvider } from '../../runtime/context/preferencesContext';
import { createProfile, getActiveProfileId, getProfiles } from '../../runtime/store/profileStore';

const clearStorage = () => {
  if (typeof globalThis?.localStorage !== 'undefined') {
    globalThis.localStorage.clear();
  }
};

describe('ProfileSelectionPage', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('selects an existing profile and signals completion', () => {
    const onClose = vi.fn();
    const newProfile = createProfile({ displayName: 'Kiddo', ageBand: 'young_creators' });
    render(
      <PreferencesProvider>
        <ProfileSelectionPage onClose={onClose} />
      </PreferencesProvider>,
    );

    const buttons = screen.getAllByRole('button', { name: /continue as this profile/i });
    fireEvent.click(buttons[1]);
    expect(onClose).toHaveBeenCalled();
    expect(getActiveProfileId()).toBe(newProfile.id);
  });

  it('can create a profile from the form', () => {
    const onClose = vi.fn();
    render(
      <PreferencesProvider>
        <ProfileSelectionPage onClose={onClose} />
      </PreferencesProvider>,
    );

    const nameInput = screen.getByLabelText(/Profile name/i);
    fireEvent.change(nameInput, { target: { value: 'Scout' } });
    const createButton = screen.getByRole('button', { name: /Create profile/i });
    fireEvent.click(createButton);

    expect(onClose).toHaveBeenCalled();
    const profiles = getProfiles();
    expect(profiles.some((profile) => profile.displayName === 'Scout')).toBe(true);
  });
});
