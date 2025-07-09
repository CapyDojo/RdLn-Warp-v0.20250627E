import React, { useEffect, useState } from 'react';
import { MyersAlgorithm } from '../algorithms/MyersAlgorithm';
import { DiffChange } from '../types';

// Test cases that previously had boundary fragment issues
const TEST_CASES = [
  {
    original: "Company",
    revised: "Corporation",
    description: "Company → Corporation (prefix issue)"
  },
  {
    original: "Contractor",
    revised: "Service Provider",
    description: "Contractor → Service Provider (suffix issue)"
  }
];

const BoundaryFragmentTest: React.FC = () => {
  const [results, setResults] = useState<Array<{
    description: string;
    original: string;
    revised: string;
    changes: DiffChange[];
    hasBoundaryFragments: boolean;
  }>>([]);

  useEffect(() => {
    const runTests = async () => {
      const testResults = [];
      
      for (const test of TEST_CASES) {
        // Run the diff algorithm
        const result = await MyersAlgorithm.compare(test.original, test.revised);
        
        // Check for boundary fragments
        const hasBoundaryFragments = result.changes.some(change => 
          (change.type === 'unchanged' && change.content && change.content.length < 3) ||
          (change.type === 'changed' && 
           ((change.originalContent && change.originalContent.length < 3) || 
            (change.revisedContent && change.revisedContent.length < 3)))
        );
        
        testResults.push({
          description: test.description,
          original: test.original,
          revised: test.revised,
          changes: result.changes,
          hasBoundaryFragments
        });
      }
      
      setResults(testResults);
    };
    
    runTests();
  }, []);

  // Helper function to render a change
  const renderChange = (change: DiffChange) => {
    switch (change.type) {
      case 'unchanged':
        return <span key={change.index}>{change.content}</span>;
      case 'added':
        return <span key={change.index} className="bg-green-200 text-green-800 border border-green-300">{change.content}</span>;
      case 'removed':
        return <span key={change.index} className="bg-red-200 text-red-800 border border-red-300 line-through">{change.content}</span>;
      case 'changed':
        return (
          <React.Fragment key={change.index}>
            <span className="bg-red-200 text-red-800 border border-red-300 line-through">{change.originalContent}</span>
            <span className="bg-green-200 text-green-800 border border-green-300">{change.revisedContent}</span>
          </React.Fragment>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Boundary Fragment Fix Test</h1>
      
      {results.length === 0 ? (
        <div className="text-center p-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>Running tests...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{result.description}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-medium mb-1">Original:</h3>
                  <div className="p-2 bg-gray-100 rounded">{result.original}</div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Revised:</h3>
                  <div className="p-2 bg-gray-100 rounded">{result.revised}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-1">Diff Result:</h3>
                <div className="p-3 bg-white border rounded">
                  {result.changes.map(renderChange)}
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="font-medium mr-2">Boundary Fragments:</span>
                {result.hasBoundaryFragments ? (
                  <span className="text-red-600 font-bold">❌ FOUND</span>
                ) : (
                  <span className="text-green-600 font-bold">✅ NONE</span>
                )}
              </div>
              
              <div className="mt-4 text-sm">
                <h3 className="font-medium mb-1">Raw Changes:</h3>
                <pre className="p-2 bg-gray-100 rounded overflow-auto text-xs">
                  {JSON.stringify(result.changes, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoundaryFragmentTest;