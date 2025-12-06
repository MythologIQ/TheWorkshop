import { buildPersonaSystemPrompt, getPersonaForStation } from '../ai_personas';

describe('ai_personas', () => {
  it('returns Idea persona by default', () => {
    const persona = getPersonaForStation();
    expect(persona.stationKey).toBe('idea');
    const prompt = buildPersonaSystemPrompt({ stationKey: persona.stationKey });
    expect(prompt).toContain('Design Dock Mentor');
    expect(prompt).toContain('Safety: Follow the Workshop Safety Contract');
    expect(prompt).toContain('Creativity: Honor the Creativity Boundary');
  });

  it('includes action context when provided', () => {
    const prompt = buildPersonaSystemPrompt({ stationKey: 'build', action: 'Create a plan for the active step.' });
    expect(prompt).toContain('Action: Create a plan for the active step.');
    expect(prompt).toContain('Assembly Bay Partner');
  });
});
