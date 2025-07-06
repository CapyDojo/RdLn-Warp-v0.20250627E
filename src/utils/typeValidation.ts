/**
 * PHASE 2.2: Type Validation Utilities
 * Runtime type validation and conversion utilities for enhanced type safety
 * 
 * SSMR Implementation:
 * - Safe: Non-breaking validation utilities
 * - Step-by-step: Gradual adoption across components
 * - Modular: Self-contained validation logic
 * - Reversible: Easy to disable validation in production
 */

import { 
  DocumentText, 
  NormalizedText, 
  MemorySize, 
  CacheKey, 
  SafeUrl,
  PerformanceTimestamp,
  ValidatedDocument,
  DocumentValidation,
  isDocumentText,
  isNormalizedText,
  isMemorySize,
  isCacheKey,
  isSafeUrl,
  createDocumentText,
  createNormalizedText,
  createMemorySize,
  createCacheKey,
  createSafeUrl,
  createPerformanceTimestamp
} from '../types/enhancedTypes';

// ========================================
// Document Validation
// ========================================

/**
 * Validates document content and returns detailed validation results
 */
export function validateDocument(content: string): DocumentValidation {
  const errors: DocumentValidation['errors'] = [];
  
  // Check basic constraints
  if (content.length === 0) {
    errors.push({
      code: 'EMPTY_DOCUMENT',
      message: 'Document is empty',
      severity: 'warning'
    });
  }
  
  if (content.length > 50_000_000) { // 50MB limit
    errors.push({
      code: 'DOCUMENT_TOO_LARGE',
      message: 'Document exceeds maximum size limit (50MB)',
      severity: 'error'
    });
  }
  
  // Check for control characters
  const controlCharRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;
  const hasControlCharacters = controlCharRegex.test(content);
  if (hasControlCharacters) {
    errors.push({
      code: 'CONTROL_CHARACTERS',
      message: 'Document contains control characters that may cause issues',
      severity: 'warning'
    });
  }
  
  // Check encoding issues
  const encodingIssues = /[\uFFFD\uFEFF]/.test(content);
  if (encodingIssues) {
    errors.push({
      code: 'ENCODING_ISSUES',
      message: 'Document contains encoding issues (replacement characters)',
      severity: 'warning'
    });
  }
  
  // Estimate complexity
  const lineCount = content.split('\n').length;
  const characterCount = content.length;
  let estimatedComplexity: DocumentValidation['metadata']['estimatedComplexity'];
  
  if (characterCount > 1_000_000 || lineCount > 10_000) {
    estimatedComplexity = 'extreme';
  } else if (characterCount > 100_000 || lineCount > 1_000) {
    estimatedComplexity = 'high';
  } else if (characterCount > 10_000 || lineCount > 100) {
    estimatedComplexity = 'medium';
  } else {
    estimatedComplexity = 'low';
  }
  
  // Add complexity warnings
  if (estimatedComplexity === 'extreme') {
    errors.push({
      code: 'EXTREME_COMPLEXITY',
      message: 'Document is extremely large and may cause performance issues',
      severity: 'warning'
    });
  }
  
  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
    metadata: {
      characterCount,
      lineCount,
      estimatedComplexity,
      hasControlCharacters
    }
  };
}

/**
 * Creates a validated document with comprehensive checks
 */
export function createValidatedDocument(
  content: string,
  sourceType: ValidatedDocument['sourceType'] = 'user_input'
): ValidatedDocument | null {
  const validation = validateDocument(content);
  
  if (!validation.isValid) {
    return null;
  }
  
  const documentText = createDocumentText(content);
  if (!documentText) {
    return null;
  }
  
  // Create a simple hash for the document
  const hashInput = `${content.length}_${sourceType}_${Date.now()}`;
  const hash = createCacheKey(hashInput.replace(/[^a-zA-Z0-9_-]/g, '_'));
  if (!hash) {
    return null;
  }
  
  return {
    content: documentText,
    validation,
    createdAt: createPerformanceTimestamp(),
    hash,
    sourceType
  };
}

// ========================================
// Memory and Performance Validation
// ========================================

/**
 * Validates and creates memory size with safety checks
 */
export function validateMemorySize(bytes: number | unknown): MemorySize | null {
  if (typeof bytes !== 'number') {
    return null;
  }
  
  if (bytes < 0 || !Number.isFinite(bytes)) {
    return null;
  }
  
  // Reasonable memory limits (1TB max)
  if (bytes > 1_000_000_000_000) {
    return null;
  }
  
  return createMemorySize(bytes);
}

/**
 * Gets current memory usage if available
 */
export function getCurrentMemoryUsage(): MemorySize | null {
  try {
    const memoryInfo = (performance as any)?.memory;
    if (memoryInfo?.usedJSHeapSize) {
      return validateMemorySize(memoryInfo.usedJSHeapSize);
    }
  } catch {
    // Memory API not available or failed
  }
  return null;
}

// ========================================
// URL and Resource Validation
// ========================================

/**
 * Validates and creates safe URL with security checks
 */
export function validateUrl(url: string | unknown): SafeUrl | null {
  if (typeof url !== 'string') {
    return null;
  }
  
  // Basic length check
  if (url.length > 2048) { // Standard URL length limit
    return null;
  }
  
  // Check for dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = url.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      // Allow data: URLs but validate them separately
      if (protocol === 'data:' && validateDataUrl(url)) {
        break;
      } else if (protocol !== 'data:') {
        return null;
      }
    }
  }
  
  return createSafeUrl(url);
}

/**
 * Validates data URLs for safety
 */
function validateDataUrl(url: string): boolean {
  try {
    // Basic data URL format check
    const dataUrlRegex = /^data:([a-zA-Z0-9][a-zA-Z0-9\/+;=\-]*),(.*)$/;
    const match = url.match(dataUrlRegex);
    
    if (!match) {
      return false;
    }
    
    const [, mimeType, data] = match;
    
    // Allow only safe MIME types
    const safeMimeTypes = [
      'text/plain',
      'text/csv',
      'application/json',
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/webp'
    ];
    
    const baseMimeType = mimeType.split(';')[0].toLowerCase();
    return safeMimeTypes.includes(baseMimeType);
  } catch {
    return false;
  }
}

// ========================================
// Text Processing Validation
// ========================================

/**
 * Validates and normalizes text content
 */
export function validateAndNormalizeText(text: string | unknown): NormalizedText | null {
  if (typeof text !== 'string') {
    return null;
  }
  
  // Basic length check (reasonable limit for normalized text)
  if (text.length > 10_000_000) { // 10MB limit for normalized text
    return null;
  }
  
  try {
    return createNormalizedText(text);
  } catch {
    return null;
  }
}

/**
 * Validates text for specific purposes (comparison, display, etc.)
 */
export function validateTextForPurpose(
  text: string,
  purpose: 'comparison' | 'display' | 'storage' | 'transmission'
): { isValid: boolean; issues: string[]; recommendations: string[] } {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Common validations
  if (text.length === 0) {
    issues.push('Text is empty');
  }
  
  // Purpose-specific validations
  switch (purpose) {
    case 'comparison':
      if (text.length > 5_000_000) { // 5MB for comparison
        issues.push('Text too large for efficient comparison');
        recommendations.push('Consider breaking into smaller chunks');
      }
      if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(text)) {
        issues.push('Contains control characters that may affect comparison');
        recommendations.push('Remove or replace control characters');
      }
      break;
      
    case 'display':
      if (text.length > 1_000_000) { // 1MB for display
        issues.push('Text too large for efficient display');
        recommendations.push('Consider pagination or virtual scrolling');
      }
      if (/[\uFFFD]/.test(text)) {
        issues.push('Contains replacement characters that will appear as \uFFFD');
        recommendations.push('Check original encoding and re-import if possible');
      }
      break;
      
    case 'storage':
      if (text.length > 50_000_000) { // 50MB for storage
        issues.push('Text exceeds storage limits');
        recommendations.push('Use compression or external storage');
      }
      break;
      
    case 'transmission':
      if (text.length > 10_000_000) { // 10MB for transmission
        issues.push('Text too large for efficient transmission');
        recommendations.push('Use chunked transmission or compression');
      }
      break;
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  };
}

// ========================================
// Cache Key Validation
// ========================================

/**
 * Validates and creates cache key with collision detection
 */
export function validateAndCreateCacheKey(
  input: string,
  prefix?: string,
  maxLength: number = 255
): CacheKey | null {
  if (typeof input !== 'string') {
    return null;
  }
  
  // Sanitize input
  let key = input.replace(/[^a-zA-Z0-9_-]/g, '_');
  
  // Add prefix if provided
  if (prefix) {
    key = `${prefix}_${key}`;
  }
  
  // Truncate if too long
  if (key.length > maxLength) {
    // Keep the end part which is more likely to be unique
    const hashPart = key.slice(-32); // Last 32 chars
    const prefixPart = key.slice(0, maxLength - 33); // Leave room for hash + underscore
    key = `${prefixPart}_${hashPart}`;
  }
  
  return createCacheKey(key);
}

// ========================================
// Development Mode Helpers
// ========================================

/**
 * Runtime type checking for development mode
 */
export function devTypeCheck<T>(
  value: unknown,
  validator: (value: unknown) => value is T,
  context: string
): T | null {
  if (process.env.NODE_ENV === 'development') {
    if (!validator(value)) {
      console.warn(`Type validation failed in ${context}:`, {
        value,
        type: typeof value,
        expected: validator.name
      });
      return null;
    }
  }
  return value as T;
}

/**
 * Performance timing for type operations
 */
export function measureTypeOperation<T>(
  name: string,
  operation: () => T
): { result: T; duration: number } {
  const start = performance.now();
  const result = operation();
  const duration = performance.now() - start;
  
  if (process.env.NODE_ENV === 'development' && duration > 10) {
    console.warn(`Slow type operation detected: ${name} took ${duration.toFixed(2)}ms`);
  }
  
  return { result, duration };
}
