import fs from 'fs';
import { MyersAlgorithm } from './src/algorithms/MyersAlgorithm.js';

// Test cases that previously had boundary fragment issues
const testCases = [
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

// Run tests
console.log("Testing boundary fragment fix in Myers algorithm...\n");

testCases.forEach(test => {
  console.log(`Test: ${test.description}`);
  console.log(`Original: "${test.original}"`);
  console.log(`Revised: "${test.revised}"`);
  
  // Run the diff algorithm
  const algorithm = new MyersAlgorithm();
  const changes = algorithm.diff(test.original, test.revised);
  
  // Log the changes
  console.log("\nDiff changes:");
  changes.forEach((change, i) => {
    console.log(`Change ${i+1}:`, JSON.stringify(change, null, 2));
  });
  
  // Check for boundary fragments
  const hasBoundaryFragments = changes.some(change => 
    (change.type === 'unchanged' && change.content && change.content.length < 3) ||
    (change.type === 'changed' && 
     ((change.originalContent && change.originalContent.length < 3) || 
      (change.revisedContent && change.revisedContent.length < 3)))
  );
  
  console.log("\nResult:", hasBoundaryFragments ? "❌ Has boundary fragments" : "✅ No boundary fragments");
  console.log("-".repeat(50));
});