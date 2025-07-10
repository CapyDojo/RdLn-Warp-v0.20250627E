# Boundary Fragment Fix

## Problem

The redline output component was showing semantic chunking issues where text was being visually fragmented, showing examples like:

- "Co~~mpany~~rporation" instead of "~~Company~~Corporation"
- "~~Contractor~~ Provider" instead of "~~Contractor~~Service Provider"

This issue only affected the FIRST redlined word (with common opening letters) and LAST redlined word (with common ending characters).

## Root Cause

The issue was in the Myers diff algorithm's `trimCommonPrefixSuffix` method, which was trimming common prefixes and suffixes at the character level without respecting word boundaries. This caused words to be split at the beginning and end of the diff.

Previously, this was being addressed with a post-processing workaround in `RedlineOutput.tsx` using the `mergeBoundaryFragments` function, which attempted to detect and fix these fragmented words after the diff was generated.

## Solution

We fixed the issue at its source by modifying the `trimCommonPrefixSuffix` method in `MyersAlgorithm.ts` to respect word boundaries when trimming. The key changes were:

1. For prefix trimming, we added code to backtrack to the nearest word boundary:
```typescript
// CRITICAL FIX: Backtrack to word boundary for prefix
// This prevents splitting words like "Company" into "Co" + "mpany"
while (prefixLength > 0 &&
       prefixLength < minLength &&
       /\w/.test(originalText[prefixLength - 1]) &&
       /\w/.test(originalText[prefixLength])) {
  prefixLength--;
}
```

2. For suffix trimming, we added similar code to backtrack to the nearest word boundary:
```typescript
// CRITICAL FIX: Backtrack to word boundary for suffix
// This prevents splitting words like "Contractor" into "Contracto" + "r"
while (suffixLength > 0 &&
       suffixLength < maxSuffixLength &&
       /\w/.test(originalText[originalText.length - suffixLength - 1]) &&
       /\w/.test(originalText[originalText.length - suffixLength])) {
  suffixLength--;
}
```

3. We removed the now-unnecessary `mergeBoundaryFragments` function from `RedlineOutput.tsx` since the issue is now fixed at its source.

## Benefits

This solution is more elegant because:
- It fixes the issue at its source rather than applying a post-processing fix
- It's more efficient as it eliminates an extra processing step
- It's more maintainable as it simplifies the code
- It's more reliable as it handles the issue directly in the diff algorithm

## Testing

The fix was tested with specific examples that previously showed the issue:
- "Company" → "Corporation" (prefix issue)
- "Contractor" → "Service Provider" (suffix issue)

The tests confirmed that the words are no longer fragmented in the diff output.