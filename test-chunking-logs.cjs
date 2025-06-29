// SSMR Chunking Progress Test
// Purpose: Generate test data for chunking progress verification

// Test data - large text that should trigger chunking progress
const largeText1 = `CONFIDENTIALITY AGREEMENT BETWEEN PARTIES
This confidentiality agreement is entered into on [DATE] between PAGAC Chicken Tenders Holdings I Pty Limited (ACN 634 495 275) (Target or you) and Blackstone Singapore Pte. Ltd. (us or we) whether furnished before on after the date hereof in connection with your consideration of our possible participation in a potential transaction with you (the Information or Confidential Information). ` + 
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(200);

const largeText2 = `CONFIDENTIALITY AGREEMENT BETWEEN PARTIES
This confidentiality agreement is entered into on [DIFFERENT DATE] between PAGAC Corporation Holdings II Pty Limited (ACN 634 495 275) (Target or you) and Different Investment Pte. Ltd. (us or we) whether furnished before or after the date hereof in connection with your consideration of our possible participation in a potential transaction with you (the Information or Confidential Information). ` + 
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '.repeat(200);

// Count tokens to verify threshold
const tokens1 = largeText1.split(/\s+/).length;
const tokens2 = largeText2.split(/\s+/).length;
const totalTokens = tokens1 + tokens2;

console.log('🔢 TOKEN COUNT ANALYSIS:');
console.log(`Text 1 tokens: ${tokens1}`);
console.log(`Text 2 tokens: ${tokens2}`);
console.log(`Total tokens: ${totalTokens}`);
console.log(`Threshold: 1000`);
console.log(`Should trigger chunking: ${totalTokens > 1000}`);

console.log('\n📝 Starting chunking progress test...');

// Instructions for manual testing
console.log('\n🧪 MANUAL TEST INSTRUCTIONS:');
console.log('1. Copy the text below into the Original text area:');
console.log('---START TEXT 1---');
console.log(largeText1.substring(0, 500) + '...');
console.log('---END TEXT 1---');

console.log('\n2. Copy the text below into the Revised text area:');
console.log('---START TEXT 2---');
console.log(largeText2.substring(0, 500) + '...');
console.log('---END TEXT 2---');

console.log('\n3. Make sure Auto-Compare (Zap button) is ENABLED');
console.log('4. Check the browser console for these messages:');
console.log('   - 🧪 Starting comparison with progressCallback: true');
console.log('   - 🔧 chunkingProgress.enabled: true');
console.log('   - 🎯 MyersAlgorithm.compare called with progressCallback: true');
console.log('   - 🔢 Token count analysis');
console.log('   - 📊 Calling progressCallback messages');
console.log('   - 🔄 CHUNKING PROGRESS messages');

console.log('\n5. Check the UI for purple progress bar with Zap icon');
console.log('6. Progress should show: 0% → 25% → 90% → 100%');

console.log('\n💾 Test texts saved to clipboard-ready format above.');
console.log('📁 Debug logs will be written to: chunking-test.log');
