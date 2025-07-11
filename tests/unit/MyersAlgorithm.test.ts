import { describe, it, expect } from 'vitest';
import { MyersAlgorithm } from '../../src/algorithms/MyersAlgorithm';

describe('MyersAlgorithm', () => {
  describe('preciseChunking with ENABLE_GENERAL_SUBSTITUTION_GROUPING', () => {

    const originalText = 'This ISDA Master Agreement is made between Goldman Sachs International, a company incorporated in England and Wales...';
    const revisedText = 'This ISDA Master Agreement is made between J.P. Morgan Securities plc, a company incorporated in England and Wales...';

    it('should group consecutive removed/added tokens into contiguous blocks when the flag is ON', () => {
      // Enable the feature flag for this test
      MyersAlgorithm.FEATURE_FLAGS.ENABLE_GENERAL_SUBSTITUTION_GROUPING = true;

      const diff = MyersAlgorithm.diff(originalText, revisedText);
      const changes = diff.changes;

      // Find the relevant change blocks
      const removedBlock = changes.find(c => c.type === 'removed' && c.content.includes('Goldman Sachs International'));
      const addedBlock = changes.find(c => c.type === 'added' && c.content.includes('J.P. Morgan Securities plc'));

      expect(removedBlock).toBeDefined();
      expect(removedBlock?.content.trim()).toBe('Goldman Sachs International');

      expect(addedBlock).toBeDefined();
      expect(addedBlock?.content.trim()).toBe('J.P. Morgan Securities plc');

      // Ensure it did NOT create a single 'changed' block
      const changedBlock = changes.find(c => c.type === 'changed');
      expect(changedBlock).toBeUndefined();

      // Reset flag
      MyersAlgorithm.FEATURE_FLAGS.ENABLE_GENERAL_SUBSTITUTION_GROUPING = false;
    });

    it('should create a single substitution block when the flag is OFF', () => {
      // Ensure the feature flag is disabled for this test
      MyersAlgorithm.FEATURE_FLAGS.ENABLE_GENERAL_SUBSTITUTION_GROUPING = false;

      const diff = MyersAlgorithm.diff(originalText, revisedText);
      const changes = diff.changes;

      // Find the 'changed' block
      const changedBlock = changes.find(c => c.type === 'changed');

      expect(changedBlock).toBeDefined();
      expect(changedBlock?.originalContent?.trim()).toBe('Goldman Sachs International');
      expect(changedBlock?.revisedContent?.trim()).toBe('J.P. Morgan Securities plc');

      // Ensure it did NOT create separate removed/added blocks
      const removedBlock = changes.find(c => c.type === 'removed');
      const addedBlock = changes.find(c => c.type === 'added');
      expect(removedBlock).toBeUndefined();
      expect(addedBlock).toBeUndefined();
    });
  });
});
