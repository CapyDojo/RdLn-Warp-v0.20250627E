/**
 * Test Suite Type Definitions
 * 
 * This file contains all type definitions used by the test suite components,
 * including test case interfaces, result types, and component props.
 */

import { ComparisonResult } from './index';

/** Test case interface with expected validation */
export interface TestCase {
  /** Unique identifier for the test case */
  id: string;
  /** Human-readable test case name */
  name: string;
  /** Detailed description of what the test validates */
  description: string;
  /** Category for organizing related tests */
  category: string;
  /** Original text content for comparison */
  originalText: string;
  /** Revised text content for comparison */
  revisedText: string;
  /** Optional expected results for validation */
  expectedChanges?: {
    /** Expected number of additions */
    additions: number;
    /** Expected number of deletions */
    deletions: number;
    /** Description of expected changes */
    description: string;
  };
}

/** Test result with timing and status information */
export interface TestResult extends ComparisonResult {
  /** Test case identifier */
  testId: string;
  /** Execution timestamp */
  timestamp: number;
  /** Execution duration in milliseconds */
  duration: number;
  /** Test execution status */
  status: 'passed' | 'failed' | 'running' | 'pending';
  /** Error message if test failed */
  error?: string;
}

/** Test execution summary statistics */
export interface TestSummary {
  /** Total number of tests executed */
  totalTests: number;
  /** Number of passed tests */
  passedTests: number;
  /** Number of failed tests */
  failedTests: number;
  /** Average number of changes across all tests */
  averageChanges: number;
  /** Total substitutions found across all tests */
  totalSubstitutions: number;
  /** Overall execution duration */
  totalDuration: number;
  /** Status of special Karpathy test */
  karpathyTestStatus: 'passed' | 'failed' | 'pending';
}

/** Category filter option */
export interface CategoryFilter {
  /** Category name */
  name: string;
  /** Number of tests in this category */
  count: number;
  /** Whether this category is currently selected */
  selected: boolean;
}

/** Test suite component props */
export interface TestSuiteProps {
  /** Callback to load a specific test case into the main interface */
  onLoadTest: (originalText: string, revisedText: string) => void;
  /** Optional initial category filter */
  initialCategory?: string;
  /** Optional callback for test completion events */
  onTestComplete?: (result: TestResult) => void;
}

/** Test case card component props */
export interface TestCaseCardProps {
  /** Test case data */
  testCase: TestCase;
  /** Test result if available */
  result?: TestResult;
  /** Whether the test is currently running */
  isRunning: boolean;
  /** Callback to load this test case */
  onLoad: (originalText: string, revisedText: string) => void;
  /** Callback to run this test case */
  onRun: (testCase: TestCase) => void;
}

/** Test results panel component props */
export interface TestResultsPanelProps {
  /** Collection of test results by test ID */
  results: Record<string, TestResult>;
  /** Summary statistics */
  summary: TestSummary;
  /** Whether tests are currently running */
  isRunning: boolean;
}

/** Test category selector props */
export interface CategorySelectorProps {
  /** Available categories with counts */
  categories: CategoryFilter[];
  /** Currently selected category */
  selectedCategory: string;
  /** Callback for category selection */
  onCategoryChange: (category: string) => void;
}

/** Test runner configuration */
export interface TestRunnerConfig {
  /** Whether to run tests in parallel */
  parallel: boolean;
  /** Maximum concurrent test executions */
  maxConcurrency: number;
  /** Timeout for individual test execution in milliseconds */
  testTimeout: number;
  /** Whether to stop on first failure */
  stopOnFailure: boolean;
}

/** Test validation result */
export interface TestValidationResult {
  /** Whether the test passed validation */
  passed: boolean;
  /** Validation message */
  message: string;
  /** Expected vs actual comparison details */
  details?: {
    expected: any;
    actual: any;
    difference: string;
  };
}
