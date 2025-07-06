import React from 'react';
import { ErrorId, PerformanceTimestamp } from './enhancedTypes';

/**
 * Enhanced base component props with type safety
 */
export interface BaseComponentProps {
  style?: React.CSSProperties;
  className?: string;
  /** Optional data test ID for testing */
  'data-testid'?: string;
  /** Component identification for error tracking */
  componentId?: string;
}

/**
 * Enhanced hook return pattern with better error handling and status tracking
 * SSMR: Provides consistent interface while maintaining flexibility
 */
export interface BaseHookReturn<TState, TActions> {
  /** Current state values */
  readonly state: TState;
  /** Available actions */
  readonly actions: TActions;
  /** Hook status information */
  readonly status: {
    readonly isInitialized: boolean;
    readonly isLoading: boolean;
    readonly error?: {
      readonly id: ErrorId;
      readonly message: string;
      readonly timestamp: PerformanceTimestamp;
      readonly canRetry: boolean;
    } | null;
    readonly lastUpdated: PerformanceTimestamp;
  };
  /** Performance metadata */
  readonly performance?: {
    readonly initializationTime: number;
    readonly lastOperationTime: number;
    readonly totalOperations: number;
  };
}
