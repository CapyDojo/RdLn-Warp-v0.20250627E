/**
 * SSMR CHUNKING: Test Script to Verify Chunking Progress
 * 
 * This script tests the chunking progress functionality by generating
 * large text samples that will trigger the progress callback.
 */

// Generate large text to trigger chunking progress (>5000 characters)
const generateLargeText = (size = 6000) => {
  const words = [
    'agreement', 'contract', 'party', 'obligation', 'consideration', 'termination',
    'liability', 'indemnification', 'confidentiality', 'representation', 'warranty',
    'amendment', 'modification', 'breach', 'default', 'remedy', 'dispute', 'arbitration',
    'jurisdiction', 'governing', 'law', 'clause', 'provision', 'section', 'paragraph',
    'whereas', 'therefore', 'hereby', 'notwithstanding', 'furthermore', 'moreover'
  ];
  
  let text = '';
  let currentSize = 0;
  let sentenceLength = 0;
  
  while (currentSize < size) {
    const word = words[Math.floor(Math.random() * words.length)];
    
    if (sentenceLength === 0) {
      // Start new sentence with capital
      text += word.charAt(0).toUpperCase() + word.slice(1);
      sentenceLength++;
    } else if (sentenceLength < 15) {
      // Continue sentence
      text += ' ' + word;
      sentenceLength++;
    } else {
      // End sentence
      text += '. ';
      sentenceLength = 0;
      
      // Occasionally add paragraph break
      if (Math.random() < 0.1) {
        text += '\n\n';
      }
    }
    
    currentSize = text.length;
  }
  
  return text + '.';
};

// Test data for chunking
const testOriginal = generateLargeText(6000);
const testRevised = generateLargeText(6200);

console.log('Generated test data:');
console.log('Original text length:', testOriginal.length);
console.log('Revised text length:', testRevised.length);
console.log('Expected to trigger chunking progress: YES (>1000 tokens)');

// Export for use in browser
if (typeof window !== 'undefined') {
  window.CHUNKING_TEST_DATA = {
    original: testOriginal,
    revised: testRevised
  };
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    original: testOriginal,
    revised: testRevised
  };
}
