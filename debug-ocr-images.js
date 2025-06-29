// Debug script to test OCR image reading issues
import fs from 'fs';
import path from 'path';
import { createWorker } from 'tesseract.js';

async function testImageReading() {
  console.log('🔍 Testing OCR image reading issues...\n');
  
  const testImageDir = path.join(process.cwd(), 'tests', 'images');
  const images = fs.readdirSync(testImageDir);
  
  for (const imageName of images) {
    const imagePath = path.join(testImageDir, imageName);
    console.log(`\n📊 Testing: ${imageName}`);
    
    try {
      // Test 1: Check file exists and size
      const stats = fs.statSync(imagePath);
      console.log(`  ✅ File exists: ${stats.size} bytes`);
      
      // Test 2: Read file as buffer
      const buffer = fs.readFileSync(imagePath);
      console.log(`  ✅ Buffer read: ${buffer.length} bytes`);
      
      // Test 3: Check if it's a valid PNG by checking header
      const pngHeader = buffer.subarray(0, 8);
      const expectedPNG = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      const isPNG = pngHeader.equals(expectedPNG);
      console.log(`  ${isPNG ? '✅' : '❌'} PNG header valid: ${isPNG}`);
      if (!isPNG) {
        console.log(`    Expected: ${expectedPNG.toString('hex')}`);
        console.log(`    Actual:   ${pngHeader.toString('hex')}`);
      }
      
      // Test 4: Create File object like in tests
      const blob = new Blob([buffer], { type: 'image/png' });
      const file = new File([blob], imageName, { type: 'image/png' });
      console.log(`  ✅ File object created: ${file.name}, ${file.size} bytes, ${file.type}`);
      
      // Test 5: Try OCR with different methods
      console.log(`  🔄 Testing OCR with File object...`);
      
      try {
        const worker = await createWorker(['eng'], 1, {
          logger: m => {} // Silent
        });
        
        // Method 1: Direct file
        try {
          const result1 = await worker.recognize(file);
          console.log(`  ✅ OCR with File object: "${result1.data.text.substring(0, 50)}..."`);
        } catch (error) {
          console.log(`  ❌ OCR with File object failed: ${error.message}`);
        }
        
        // Method 2: Raw buffer
        try {
          const result2 = await worker.recognize(buffer);
          console.log(`  ✅ OCR with Buffer: "${result2.data.text.substring(0, 50)}..."`);
        } catch (error) {
          console.log(`  ❌ OCR with Buffer failed: ${error.message}`);
        }
        
        // Method 3: File path
        try {
          const result3 = await worker.recognize(imagePath);
          console.log(`  ✅ OCR with file path: "${result3.data.text.substring(0, 50)}..."`);
        } catch (error) {
          console.log(`  ❌ OCR with file path failed: ${error.message}`);
        }
        
        await worker.terminate();
        
      } catch (workerError) {
        console.log(`  ❌ Worker creation failed: ${workerError.message}`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error testing ${imageName}: ${error.message}`);
    }
  }
  
  console.log('\n🏁 Image reading test complete!');
}

// Run the test
testImageReading().catch(console.error);
