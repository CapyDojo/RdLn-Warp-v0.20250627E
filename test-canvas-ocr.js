import { createCanvas } from 'canvas';
import fs from 'fs';
import { createWorker } from 'tesseract.js';

async function testOCRWithCanvas() {
  console.log('🧪 Testing OCR with Canvas-generated image...');
  
  // Create a simple test image with clear text
  const canvas = createCanvas(800, 200);
  const ctx = canvas.getContext('2d');
  
  // White background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 800, 200);
  
  // Black text with clear font
  ctx.fillStyle = 'black';
  ctx.font = 'bold 32px Arial';
  ctx.fillText('BUSINESS CONTRACT', 50, 60);
  ctx.fillText('This is a test document.', 50, 120);
  
  // Save image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('test-ocr-image.png', buffer);
  console.log('✅ Created test image: test-ocr-image.png');
  
  // Test OCR
  console.log('🔍 Starting OCR test...');
  const worker = await createWorker('eng');
  
  try {
    const { data: { text } } = await worker.recognize('test-ocr-image.png');
    console.log('📝 OCR Result:');
    console.log(text);
    console.log('✅ OCR test completed successfully!');
  } catch (error) {
    console.error('❌ OCR test failed:', error);
  } finally {
    await worker.terminate();
    // Clean up
    fs.unlinkSync('test-ocr-image.png');
  }
}

testOCRWithCanvas();
