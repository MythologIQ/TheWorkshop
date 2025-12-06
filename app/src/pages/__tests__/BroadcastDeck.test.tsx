import React from 'react';
import { render, screen } from '@testing-library/react';
import BroadcastDeckPage from '../BroadcastDeck';
import { PreferencesProvider } from '../../runtime/context/preferencesContext';

describe('BroadcastDeckPage', () => {
  it('shows the Creation Lab stamp', () => {
    render(
      <PreferencesProvider>
        <BroadcastDeckPage />
      </PreferencesProvider>,
    );
    expect(screen.getByText(/Created in the MythologIQ Creation Lab/i)).toBeTruthy();
  });
});
