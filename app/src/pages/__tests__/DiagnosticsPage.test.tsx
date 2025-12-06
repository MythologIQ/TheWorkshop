import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DiagnosticsPage from '../DiagnosticsPage';
import { PreferencesProvider } from '../../runtime/context/preferencesContext';

describe('DiagnosticsPage', () => {
  it('renders telemetry cards and controls', () => {
    render(
      <MemoryRouter>
        <PreferencesProvider>
          <DiagnosticsPage />
        </PreferencesProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText(/Session count/i)).toBeTruthy();
    expect(screen.getByText(/Projects created/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Reset metrics/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Disable telemetry/i })).toBeTruthy();
  });
});
