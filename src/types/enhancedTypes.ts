/**
 * PHASE 2.2: Enhanced Type System
 * Branded types and domain-specific constraints for improved type safety
 * 
 * SSMR Implementation:
 * - Safe: Non-breaking additions to existing types
 * - Step-by-step: Gradual migration from generic types
 * - Modular: Self-contained type definitions
 * - Reversible: Easy to fall back to original types
 */

// ========================================
// Branded Types for Domain Safety
// ========================================

/**
 * Branded type helper for creating opaque types
 */
type Brand<T, B> = T & { readonly __brand: B };

/**
 * Document text with validation constraints
 */
export type DocumentText = Brand<string, 'DocumentText'>;

/**
 * Error ID for tracking and correlation
 */
export type ErrorId = Brand<string, 'ErrorId'>;

/**
 * Language code validated against supported languages
 */
export type ValidatedLanguageCode = Brand<string, 'ValidatedLanguageCode'>;

/**
 * Theme name that matches available themes
 */
export type ThemeName = Brand<string, 'ThemeName'>;

/**
 * Configuration key that ensures type safety
 */
export type ConfigKey = Brand<string, 'ConfigKey'>;

/**
 * Safe URL string that has been validated
 */
export type SafeUrl = Brand<string, 'SafeUrl'>;

/**
 * Normalized text content (trimmed, sanitized)
 */
export type NormalizedText = Brand<string, 'NormalizedText'>;

/**
 * Performance timestamp for accurate measurements
 */
export type PerformanceTimestamp = Brand<number, 'PerformanceTimestamp'>;

/**
 * Memory size in bytes
 */
export type MemorySize = Brand<number, 'MemorySize'>;

/**
 * Cache key with hash validation
 */
export type CacheKey = Brand<string, 'CacheKey'>;

// ========================================
// Document Processing Types
// ========================================

/**
 * Document validation result with detailed feedback
 */
export interface DocumentValidation {
  readonly isValid: boolean;
  readonly errors: ReadonlyArray<{
    readonly code: string;
    readonly message: string;
    readonly severity: 'error' | 'warning' | 'info';
    readonly position?: { start: number; end: number };
  }>;
  readonly metadata: {
    readonly characterCount: number;
    readonly lineCount: number;
    readonly estimatedComplexity: 'low' | 'medium' | 'high' | 'extreme';
    readonly detectedEncoding?: string;
    readonly hasControlCharacters: boolean;
  };
}

/**
 * Safe document wrapper with validation
 */
export interface ValidatedDocument {
  readonly content: DocumentText;
  readonly validation: DocumentValidation;
  readonly createdAt: PerformanceTimestamp;
  readonly hash: CacheKey;
  readonly sourceType: 'user_input' | 'file_upload' | 'ocr_result' | 'paste' | 'api';
}

/**
 * Processing options with constraints
 */
export interface ProcessingOptions {
  readonly maxLength?: number;
  readonly timeout?: number;
  readonly preserveFormatting: boolean;
  readonly enableCaching: boolean;
  readonly priority: 'low' | 'normal' | 'high';
  readonly abortSignal?: AbortSignal;
}

// ========================================
// Enhanced Comparison Types
// ========================================

/**
 * Change position with precise boundaries
 */
export interface ChangePosition {
  readonly start: number;
  readonly end: number;
  readonly line: number;
  readonly column: number;
}

/**
 * Enhanced diff change with additional metadata
 */
export interface EnhancedDiffChange {
  readonly id: string;
  readonly type: 'added' | 'removed' | 'unchanged' | 'changed';
  readonly content: NormalizedText;
  readonly originalContent?: NormalizedText;
  readonly revisedContent?: NormalizedText;
  readonly position: ChangePosition;
  readonly confidence: number; // 0-1 confidence score
  readonly context?: {
    readonly before: string;
    readonly after: string;
  };
  readonly metadata: {
    readonly importance: 'critical' | 'major' | 'minor' | 'cosmetic';
    readonly category: 'content' | 'formatting' | 'structure' | 'punctuation';
    readonly isManuallyReviewed?: boolean;
  };
}

/**
 * Enhanced comparison result with rich metadata
 */
export interface EnhancedComparisonResult {
  readonly changes: ReadonlyArray<EnhancedDiffChange>;
  readonly stats: {
    readonly additions: number;
    readonly deletions: number;
    readonly unchanged: number;
    readonly changed: number;
    readonly totalChanges: number;
    readonly significantChanges: number; // Critical + Major changes
    readonly difficultyScore: number; // 0-100 scale
  };
  readonly performance: {
    readonly processingTime: number;
    readonly memoryUsage?: MemorySize;
    readonly cacheHit: boolean;
  };
  readonly quality: {
    readonly confidence: number; // Overall confidence score
    readonly completeness: number; // How complete the comparison is
    readonly reliability: number; // How reliable the results are
  };
}

// ========================================
// Error Handling Types
// ========================================

/**
 * Detailed error context for debugging and monitoring
 */
export interface DetailedErrorContext {
  readonly component?: string;
  readonly function?: string;
  readonly operation?: string;
  readonly timestamp: PerformanceTimestamp;
  readonly userAgent?: string;
  readonly url?: SafeUrl;
  readonly state?: Record<string, unknown>;
  readonly performance?: {
    readonly memory?: MemorySize;
    readonly timing?: Record<string, number>;
  };
}

/**
 * Recovery strategy for errors
 */
export interface ErrorRecoveryStrategy {
  readonly canRecover: boolean;
  readonly actions: ReadonlyArray<{
    readonly type: 'retry' | 'fallback' | 'reset' | 'reload';
    readonly description: string;
    readonly automatic: boolean;
    readonly timeout?: number;
  }>;
  readonly preventionAdvice?: string;
}

/**
 * Enhanced error with recovery capabilities
 */
export interface EnhancedError {
  readonly id: ErrorId;
  readonly category: 'system' | 'user_input' | 'network' | 'ocr' | 'algorithm' | 'storage' | 'theme' | 'unexpected';
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly message: string;
  readonly userMessage: string;
  readonly technicalDetails: string;
  readonly context: DetailedErrorContext;
  readonly recovery: ErrorRecoveryStrategy;
  readonly timestamp: PerformanceTimestamp;
  readonly stack?: string;
  readonly related?: ReadonlyArray<ErrorId>;
}

// ========================================
// Configuration Types
// ========================================

/**
 * Type-safe configuration value
 */
export type ConfigValue = string | number | boolean | ReadonlyArray<unknown> | Record<string, unknown>;

/**
 * Configuration schema with validation
 */
export interface ConfigSchema {
  readonly key: ConfigKey;
  readonly defaultValue: ConfigValue;
  readonly validator: (value: unknown) => value is ConfigValue;
  readonly description: string;
  readonly category: 'ui' | 'system' | 'cache' | 'storage' | 'development' | 'features' | 'environment';
  readonly isSecret: boolean;
  readonly environment?: 'development' | 'production' | 'test';
}

/**
 * Runtime configuration with type safety
 */
export interface TypedConfiguration {
  readonly get: <T extends ConfigValue>(key: ConfigKey) => T;
  readonly set: <T extends ConfigValue>(key: ConfigKey, value: T) => void;
  readonly validate: (key: ConfigKey, value: unknown) => boolean;
  readonly getSchema: (key: ConfigKey) => ConfigSchema | undefined;
  readonly getAllKeys: () => ReadonlyArray<ConfigKey>;
}

// ========================================
// Performance Types
// ========================================

/**
 * Performance measurement with context
 */
export interface PerformanceMeasurement {
  readonly name: string;
  readonly startTime: PerformanceTimestamp;
  readonly endTime: PerformanceTimestamp;
  readonly duration: number;
  readonly memoryBefore?: MemorySize;
  readonly memoryAfter?: MemorySize;
  readonly memoryDelta?: MemorySize;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Performance monitor for tracking operations
 */
export interface PerformanceMonitor {
  readonly start: (name: string, metadata?: Record<string, unknown>) => void;
  readonly end: (name: string) => PerformanceMeasurement | undefined;
  readonly measure: <T>(name: string, operation: () => T) => Promise<{ result: T; measurement: PerformanceMeasurement }>;
  readonly getHistory: (limit?: number) => ReadonlyArray<PerformanceMeasurement>;
  readonly clearHistory: () => void;
}

// ========================================
// Type Utilities and Guards
// ========================================

/**
 * Type guard for checking if a string is a valid document text
 */
export function isDocumentText(value: unknown): value is DocumentText {
  return typeof value === 'string' && value.length >= 0 && value.length <= 50_000_000; // 50MB limit
}

/**
 * Type guard for checking if a string is a normalized text
 */
export function isNormalizedText(value: unknown): value is NormalizedText {
  return typeof value === 'string' && value === value.trim() && !value.includes('\r');
}

/**
 * Type guard for checking if a number is a valid memory size
 */
export function isMemorySize(value: unknown): value is MemorySize {
  return typeof value === 'number' && value >= 0 && Number.isFinite(value);
}

/**
 * Type guard for checking if a string is a valid cache key
 */
export function isCacheKey(value: unknown): value is CacheKey {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]+$/.test(value) && value.length <= 255;
}

/**
 * Type guard for checking if a string is a safe URL
 */
export function isSafeUrl(value: unknown): value is SafeUrl {
  try {
    if (typeof value !== 'string') return false;
    const url = new URL(value);
    return ['http:', 'https:', 'data:'].includes(url.protocol);
  } catch {
    return false;
  }
}

// ========================================
// Factory Functions
// ========================================

/**
 * Create a validated document from raw text
 */
export function createDocumentText(text: string): DocumentText | null {
  if (!isDocumentText(text)) return null;
  return text as DocumentText;
}

/**
 * Create a normalized text from raw string
 */
export function createNormalizedText(text: string): NormalizedText {
  const normalized = text.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return normalized as NormalizedText;
}

/**
 * Create a performance timestamp
 */
export function createPerformanceTimestamp(): PerformanceTimestamp {
  return performance.now() as PerformanceTimestamp;
}

/**
 * Create a memory size from bytes
 */
export function createMemorySize(bytes: number): MemorySize | null {
  if (!isMemorySize(bytes)) return null;
  return bytes as MemorySize;
}

/**
 * Create a cache key from string
 */
export function createCacheKey(key: string): CacheKey | null {
  if (!isCacheKey(key)) return null;
  return key as CacheKey;
}

/**
 * Create a safe URL from string
 */
export function createSafeUrl(url: string): SafeUrl | null {
  if (!isSafeUrl(url)) return null;
  return url as SafeUrl;
}

// ========================================
// Readonly Utilities
// ========================================

/**
 * Deep readonly type for immutable objects
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Non-empty array type
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Exact type for preventing excess properties
 */
export type Exact<T, U extends T> = T & Record<Exclude<keyof U, keyof T>, never>;

/**
 * Optional with required properties
 */
export type PartialWithRequired<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Union to intersection type conversion
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
