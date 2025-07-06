import React from 'react';

export interface BaseComponentProps {
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Standard hook return pattern for consistency across all custom hooks
 * SSMR: Provides consistent interface while maintaining flexibility
 */
export interface BaseHookReturn<TState, TActions> {
  /** Current state values */
  state: TState;
  /** Available actions */
  actions: TActions;
  /** Hook status information */
  status: {
    isInitialized: boolean;
    error?: string | null;
  };
}
