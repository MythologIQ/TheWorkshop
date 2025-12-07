import { clampReadingLevel, enforceChildTone, redactDisallowedContent } from '../child_mode_governor';

describe('child mode governor', () => {
  it('tames negative language', () => {
    const original = "Don't stop. You can't fail.";
    const toned = enforceChildTone(original);
    expect(toned).toContain('do');
    expect(toned).toContain('can');
  });

  it('clamps to short, readable sentences', () => {
    const longText =
      'This sentence is intentionally very long to force the guardrail to trim the output and keep it short and readable for children. ' +
      'Another sentence follows with similar length. The third sentence will stay. The fourth sentence gets dropped.';
    const clamped = clampReadingLevel(longText);
    expect(clamped.split('.').length).toBeLessThanOrEqual(4);
    expect(clamped.length).toBeLessThan(200);
  });

  it('redacts disallowed keywords', () => {
    const violent = 'If you kill the dragon, you win.';
    const sanitized = redactDisallowedContent(violent);
    expect(sanitized).toContain('[filtered]');
  });
});
