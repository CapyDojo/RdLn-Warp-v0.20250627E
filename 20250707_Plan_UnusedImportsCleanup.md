# SSMR: Unused Imports and Files Cleanup

**Date**: 2025-07-07  
**Branch**: refactor-20250706  
**Methodology**: SSMR (Safe, Step-by-step, Modular, Reversible)  
**Risk Level**: LOW | **Impact**: MEDIUM | **Effort**: LOW

## Overview

Clean up unused imports, backup files, and remove excessive console logging to improve code quality and build performance.

## SSMR Implementation Plan

### SAFE ✅
- [x] Low risk - only removing unused code
- [x] No functional changes to core logic
- [x] Git backup at each step

### STEP-BY-STEP 🔄
1. **Step 1**: Remove obvious backup/unused files (.backup, .ignore)
2. **Step 2**: Clean up excessive console.log statements
3. **Step 3**: Remove unused imports (file by file)
4. **Step 4**: Verify builds and functionality

### MODULAR ✅
- Each file cleaned independently
- Changes can be reverted individually
- Build verification after each step

### REVERSIBLE ✅
- Git commit after each logical step
- Easy rollback with git revert
- No breaking changes

## Files Identified for Cleanup

### 1. Backup/Unused Files (SAFE REMOVAL)
```
src/algorithms/MyersAlgorithm.ts.backup          # Old backup file
src/components/inactive/EnhancedRedlineOutput.tsx.ignore  # Disabled component
```

### 2. Excessive Console Logging
Files with many console.log statements:
- `src/services/LanguageDetectionService.ts` (24 console logs)
- `src/services/OCROrchestrator.ts` (20 console logs)  
- `src/hooks/useComparison.ts` (40+ console logs)
- `src/utils/OCRService.ts` (30+ console logs)
- `src/algorithms/MyersAlgorithm.ts` (17 console logs)

### 3. Development Console Logs
Clean up debug logging in:
- `src/components/ComparisonInterface.tsx`
- `src/hooks/useScrollSync.ts`
- `src/services/BackgroundLanguageLoader.ts`

## Implementation Steps

### Step 1: Remove Backup Files ⏳
**Risk**: NONE - These are unused files

```bash
rm src/algorithms/MyersAlgorithm.ts.backup
rm src/components/inactive/EnhancedRedlineOutput.tsx.ignore
```

### Step 2: Clean Console Logging ⏳
**Risk**: LOW - Remove excessive debug logging

**Strategy**: 
- Keep error logging and warnings
- Remove debug/info console.logs
- Keep performance monitoring logs in dev mode

**Target files** (in order):
1. `MyersAlgorithm.ts` - Remove debug logs
2. `LanguageDetectionService.ts` - Clean debug output
3. `OCROrchestrator.ts` - Remove excessive logging
4. `useComparison.ts` - Clean debug statements
5. `OCRService.ts` - Remove debug logs

### Step 3: Remove Unused Imports ⏳
**Risk**: LOW - TypeScript will catch missing imports

**Process**:
1. Use TypeScript to check for unused imports
2. Remove them file by file
3. Verify build after each file

### Step 4: Verification ⏳
**Risk**: NONE - Testing only

1. `npm run build` - Verify clean build
2. `npx tsc --noEmit` - Check TypeScript
3. Quick functionality test

## Expected Benefits

### Code Quality
- Cleaner, more readable code
- Reduced noise in logs
- Smaller bundle size (minor)

### Developer Experience  
- Faster builds
- Less log clutter during development
- Better code maintainability

### Build Performance
- Fewer files to process
- Reduced bundle overhead
- Cleaner TypeScript compilation

## Current Status

- **Planning**: ✅ Complete
- **Step 1**: ⏳ Ready to start
- **Overall Progress**: 0% - Ready to begin

---

**Next Action**: Execute Step 1 - Remove backup files safely
