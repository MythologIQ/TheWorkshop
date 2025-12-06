import { describe, expect, it } from 'vitest';
import { TRANSLATIONS } from '../translations';

describe('translations', () => {
  it('exposes creation lab copy for each locale', () => {
    for (const translation of Object.values(TRANSLATIONS)) {
      expect(translation.creationLab).toBeDefined();
      expect(translation.creationLab.stamp).toBe('Created in the MythologIQ Creation Lab');
      expect(translation.creationLab.brandName).toBe('MythologIQ Creation Lab');
    }
  });
});
