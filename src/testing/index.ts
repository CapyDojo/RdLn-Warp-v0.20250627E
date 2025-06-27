// Testing Module Exports
// This file provides a clean interface for importing testing components
// Remove this entire directory before production deployment

export { AdvancedTestSuite } from './AdvancedTestSuite';
export { ExtremeTestSuite } from './ExtremeTestSuite';

// Testing module metadata
export const TESTING_MODULE_INFO = {
  version: '2.0.0',
  description: 'Comprehensive stress testing suite for document comparison algorithm',
  purpose: 'Development and validation only - remove before production',
  components: ['AdvancedTestSuite', 'ExtremeTestSuite'],
  testCases: {
    advanced: 10,
    extreme: 10,
    total: 20
  },
  categories: [
    // Advanced Test Categories
    'Corporate Structure',
    'Financial',
    'Legal Citations', 
    'International',
    'Technical',
    'Conditional Logic',
    'Document Structure',
    'Regulatory',
    'Mathematical',
    'Multilingual',
    // Extreme Test Categories
    'M&A Transactions',
    'International Joint Ventures',
    'Financial Derivatives',
    'Pharmaceutical Licensing',
    'Infrastructure Construction',
    'Technology Transfer',
    'Energy Project Financing',
    'Aerospace Defense',
    'Global Supply Chain'
  ],
  difficulties: ['Hard', 'Expert', 'Extreme', 'Ultra', 'Nightmare'],
  complexityMetrics: {
    advanced: {
      avgWordCount: 400,
      avgExpectedChanges: 25,
      maxNestingDepth: 5
    },
    extreme: {
      avgWordCount: 870,
      avgExpectedChanges: 52,
      maxNestingDepth: 8
    }
  }
};