/**
 * PHASE 2: Error Handling Standardization
 * Centralized error handling system for consistent error management across the application
 * 
 * SSMR Implementation:
 * - Safe: Non-breaking additions to existing error handling
 * - Step-by-step: Progressive adoption across components
 * - Modular: Self-contained error handling utilities
 * - Reversible: Easy to disable/revert individual features
 */

import React from 'react';
import { BaseComponentProps } from './types/baseTypes';

// ========================================
// Core Error Types
// ========================================

export enum ErrorCategory {
  SYSTEM = 'SYSTEM',
  USER_INPUT = 'USER_INPUT', 
  NETWORK = 'NETWORK',
  OCR = 'OCR',
  ALGORITHM = 'ALGORITHM',
  STORAGE = 'STORAGE',
  THEME = 'THEME',
  UNEXPECTED = 'UNEXPECTED'
}

export enum ErrorSeverity {
  LOW = 'LOW',       // Non-critical, app continues normally
  MEDIUM = 'MEDIUM', // Affects functionality but recoverable
  HIGH = 'HIGH',     // Critical functionality affected
  CRITICAL = 'CRITICAL' // App may be unusable
}

export interface AppError {
  id: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  technical: string;
  context?: Record<string, any>;
  timestamp: number;
  stack?: string;
  retry?: () => Promise<void> | void;
  recover?: () => Promise<void> | void;
}

// ========================================
// Error Factory Functions
// ========================================

export class ErrorFactory {
  private static generateId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static createSystemError(
    message: string,
    userMessage: string,
    context?: Record<string, any>,
    severity: ErrorSeverity = ErrorSeverity.HIGH
  ): AppError {
    return {
      id: this.generateId(),
      category: ErrorCategory.SYSTEM,
      severity,
      message,
      userMessage,
      technical: message,
      context,
      timestamp: Date.now()
    };
  }

  static createOCRError(
    message: string, 
    userMessage: string,
    context?: Record<string, any>,
    retry?: () => Promise<void>
  ): AppError {
    return {
      id: this.generateId(),
      category: ErrorCategory.OCR,
      severity: ErrorSeverity.MEDIUM,
      message,
      userMessage,
      technical: message,
      context,
      timestamp: Date.now(),
      retry
    };
  }

  static createAlgorithmError(
    message: string,
    userMessage: string,
    context?: Record<string, any>,
    severity: ErrorSeverity = ErrorSeverity.HIGH
  ): AppError {
    return {
      id: this.generateId(),
      category: ErrorCategory.ALGORITHM,
      severity,
      message,
      userMessage,
      technical: message,
      context,
      timestamp: Date.now()
    };
  }

  static createUserInputError(
    message: string,
    userMessage: string,
    context?: Record<string, any>
  ): AppError {
    return {
      id: this.generateId(),
      category: ErrorCategory.USER_INPUT,
      severity: ErrorSeverity.LOW,
      message,
      userMessage,
      technical: message,
      context,
      timestamp: Date.now()
    };
  }

  static createNetworkError(
    message: string,
    userMessage: string,
    context?: Record<string, any>,
    retry?: () => Promise<void>
  ): AppError {
    return {
      id: this.generateId(),
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      message,
      userMessage,
      technical: message,
      context,
      timestamp: Date.now(),
      retry
    };
  }

  static fromJavaScriptError(
    error: Error,
    category: ErrorCategory = ErrorCategory.UNEXPECTED,
    userMessage?: string,
    context?: Record<string, any>
  ): AppError {
    let severity = ErrorSeverity.MEDIUM;
    let finalUserMessage = userMessage;

    // Auto-categorize common errors
    if (error.message.includes('memory') || error.message.includes('Maximum')) {
      category = ErrorCategory.SYSTEM;
      severity = ErrorSeverity.HIGH;
      finalUserMessage = finalUserMessage || 'System resources are low. Please try with smaller files or refresh the page.';
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      category = ErrorCategory.NETWORK;
      severity = ErrorSeverity.MEDIUM;
      finalUserMessage = finalUserMessage || 'Network connection issue. Please check your connection and try again.';
    } else if (error.message.includes('OCR') || error.message.includes('Tesseract')) {
      category = ErrorCategory.OCR;
      severity = ErrorSeverity.MEDIUM;
      finalUserMessage = finalUserMessage || 'Text recognition failed. Please try a different image or format.';
    }

    return {
      id: this.generateId(),
      category,
      severity,
      message: error.message,
      userMessage: finalUserMessage || 'An unexpected error occurred. Please try again.',
      technical: error.message,
      context: {
        ...context,
        errorName: error.name,
        errorConstructor: error.constructor.name
      },
      timestamp: Date.now(),
      stack: error.stack
    };
  }
}

// ========================================
// Error Manager
// ========================================

export class ErrorManager {
  private static errors: Map<string, AppError> = new Map();
  private static listeners: Set<(error: AppError) => void> = new Set();
  private static isProduction = import.meta.env.PROD;

  // Add error to tracking
  static addError(error: AppError): void {
    this.errors.set(error.id, error);
    
    // Log error based on environment
    if (!this.isProduction) {
      console.error(`[${error.category}:${error.severity}] ${error.message}`, {
        error,
        context: error.context,
        stack: error.stack
      });
    } else {
      // In production, only log critical errors
      if (error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.HIGH) {
        console.error(`[${error.category}] ${error.userMessage}`);
      }
    }

    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.warn('Error listener failed:', listenerError);
      }
    });

    // Auto-cleanup old errors (keep last 50)
    if (this.errors.size > 50) {
      const sortedErrors = Array.from(this.errors.entries())
        .sort(([,a], [,b]) => a.timestamp - b.timestamp);
      const toRemove = sortedErrors.slice(0, this.errors.size - 50);
      toRemove.forEach(([id]) => this.errors.delete(id));
    }
  }

  // Subscribe to error events
  static subscribe(listener: (error: AppError) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Get recent errors
  static getRecentErrors(count: number = 10): AppError[] {
    return Array.from(this.errors.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }

  // Clear errors
  static clearErrors(): void {
    this.errors.clear();
  }

  // Get errors by category
  static getErrorsByCategory(category: ErrorCategory): AppError[] {
    return Array.from(this.errors.values())
      .filter(error => error.category === category)
      .sort((a, b) => b.timestamp - a.timestamp);
  }
}

// ========================================
// Error Handling Utilities
// ========================================

/**
 * Safe async operation wrapper with standardized error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  errorCategory: ErrorCategory,
  userMessage: string,
  context?: Record<string, any>
): Promise<{ success: true; data: T } | { success: false; error: AppError }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const appError = error instanceof Error 
      ? ErrorFactory.fromJavaScriptError(error, errorCategory, userMessage, context)
      : ErrorFactory.createSystemError(
          'Unknown error occurred',
          userMessage,
          { ...context, originalError: error }
        );
    
    ErrorManager.addError(appError);
    return { success: false, error: appError };
  }
}

/**
 * Safe sync operation wrapper with standardized error handling
 */
export function safeSync<T>(
  operation: () => T,
  errorCategory: ErrorCategory,
  userMessage: string,
  context?: Record<string, any>
): { success: true; data: T } | { success: false; error: AppError } {
  try {
    const data = operation();
    return { success: true, data };
  } catch (error) {
    const appError = error instanceof Error 
      ? ErrorFactory.fromJavaScriptError(error, errorCategory, userMessage, context)
      : ErrorFactory.createSystemError(
          'Unknown error occurred',
          userMessage,
          { ...context, originalError: error }
        );
    
    ErrorManager.addError(appError);
    return { success: false, error: appError };
  }
}

/**
 * Retry mechanism with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  errorCategory: ErrorCategory,
  userMessage: string,
  context?: Record<string, any>
): Promise<{ success: true; data: T } | { success: false; error: AppError }> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const data = await operation();
      return { success: true, data };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }
  
  const appError = ErrorFactory.fromJavaScriptError(
    lastError!,
    errorCategory,
    userMessage,
    { ...context, attempts: maxRetries }
  );
  
  ErrorManager.addError(appError);
  return { success: false, error: appError };
}

// ========================================
// React Error Boundary Hook
// ========================================

export interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
}

/**
 * Hook for managing error boundary state
 */
export function useErrorBoundary() {
  const [state, setState] = React.useState<ErrorBoundaryState>({
    hasError: false,
    error: null
  });

  const resetError = () => {
    setState({ hasError: false, error: null });
  };

  const captureError = (error: Error, errorInfo?: any) => {
    const appError = ErrorFactory.fromJavaScriptError(
      error,
      ErrorCategory.UNEXPECTED,
      'A component error occurred. Please refresh the page.',
      errorInfo
    );
    
    ErrorManager.addError(appError);
    setState({ hasError: true, error: appError });
  };

  return {
    ...state,
    resetError,
    captureError
  };
}
