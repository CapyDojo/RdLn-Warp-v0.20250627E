import React from 'react';
import { createMockDocument, createMockDiff } from '../utils/mockDocuments';

interface PerformanceDemoCardProps {
  /** Whether to show the performance demo card */
  visible?: boolean;
  /** Callback when a test scenario is loaded */
  onLoadTest: (originalText: string, revisedText: string) => void;
}

/**
 * Performance Demo Card Component
 * 
 * Provides test buttons for different document sizes and change complexities.
 * Extracted from ComparisonInterface for better modularity and reusability.
 */
export const PerformanceDemoCard: React.FC<PerformanceDemoCardProps> = ({ 
  visible = true,
  onLoadTest
}) => {
  if (!visible) return null;

  const handleTestScenario = (
    size: 'small' | 'medium' | 'large' | 'monster',
    targetLength: number,
    complexity: 'few' | 'many' | 'extreme'
  ) => {
    const original = createMockDocument(size, targetLength, false);
    const revised = createMockDiff(complexity, original);
    onLoadTest(original, revised);
  };

  return (
    <div className="glass-panel border border-theme-accent-200 rounded-lg p-6 mb-6 shadow-lg transition-all duration-300">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-theme-primary-900 mb-2">🚀 Performance Demo Scenarios</h3>
        <p className="text-sm text-theme-neutral-600">
          Test different rendering strategies with realistic document sizes and change complexities.
          Watch the intelligent strategy selection in action!
        </p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1: Few Changes */}
        <button
          onClick={() => handleTestScenario('small', 5000, 'few')}
          className="enhanced-button bg-theme-primary-600 text-white rounded-lg hover:bg-theme-primary-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          📄 Small Doc, Few Changes
        </button>
        <button
          onClick={() => handleTestScenario('medium', 15000, 'few')}
          className="enhanced-button bg-theme-primary-600 text-white rounded-lg hover:bg-theme-primary-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          📑 Medium Doc, Few Changes
        </button>
        <button
          onClick={() => handleTestScenario('large', 200000, 'few')}
          className="enhanced-button bg-theme-primary-600 text-white rounded-lg hover:bg-theme-primary-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          📚 Large Doc, Few Changes
        </button>
        <button
          onClick={() => handleTestScenario('monster', 500000, 'few')}
          className="enhanced-button bg-theme-primary-600 text-white rounded-lg hover:bg-theme-primary-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          🏢 Monster Doc, Few Changes
        </button>
        
        {/* Row 2: Many/Extreme Changes */}
        <button
          onClick={() => handleTestScenario('small', 5000, 'many')}
          className="enhanced-button bg-theme-accent-600 text-white rounded-lg hover:bg-theme-accent-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          📄 Small Doc, Many Changes
        </button>
        <button
          onClick={() => handleTestScenario('medium', 15000, 'many')}
          className="enhanced-button bg-theme-accent-600 text-white rounded-lg hover:bg-theme-accent-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          📑 Medium Doc, Many Changes
        </button>
        <button
          onClick={() => handleTestScenario('large', 200000, 'many')}
          className="enhanced-button bg-theme-accent-600 text-white rounded-lg hover:bg-theme-accent-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          📚 Large Doc, Many Changes
        </button>
        <button
          onClick={() => handleTestScenario('monster', 500000, 'extreme')}
          className="enhanced-button bg-theme-accent-600 text-white rounded-lg hover:bg-theme-accent-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          🚀 Monster Doc, Crazy Changes
        </button>
      </div>
      
      <div className="mt-4 text-xs text-center text-theme-neutral-500">
        💡 <strong>Tip:</strong> Enable Live Compare to see real-time strategy selection and performance metrics
      </div>
    </div>
  );
};
