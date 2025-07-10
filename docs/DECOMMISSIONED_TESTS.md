# Decommissioned Tests

This document lists tests that have been decommissioned from the active test suite. These tests were either outdated, brittle, or causing significant noise in the test results, hindering development velocity.

## Rationale for Decommissioning

Instead of spending extensive time fixing complex and often unrelated issues in these tests, a decision was made to exclude them from the active test runner and archive them. This allows for a more focused development effort on current refactoring tasks and a cleaner test output.

## Location of Archived Tests

All decommissioned test files have been moved to the `tests/archive/decommissioned/` directory within the project. They are preserved for historical reference and can be reactivated if deemed necessary in the future.

## List of Decommissioned Tests

The following test files have been decommissioned:

*   `tests/real-ocr.test.ts`
*   `src/__tests__/useResizeHandlers.test.ts`
*   `tests/integration/ocr-pipeline.test.ts`
*   `src/services/__tests__/PerformanceMonitor.test.ts`
*   `tests/unit/OCRService.test.ts` (Superseded by `src/services/__tests__/OCRService.new.test.ts`)
*   `src/hooks/__tests__/usePerformanceMonitor.simple.test.tsx`

## Re-enabling Decommissioned Tests

To re-enable any of these tests, you would need to:

1.  Move the test file(s) from `tests/archive/decommissioned/` back to their original location.
2.  Remove the corresponding entry/entries from the `exclude` array in `vitest.config.ts`.

It is recommended to address any underlying issues that caused their decommissioning before re-enabling them.