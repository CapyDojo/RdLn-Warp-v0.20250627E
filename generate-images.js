import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createTestImage(imageName, textLines) {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 800, 600);

  // Text style
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';

  // Write each line of text
  textLines.forEach((line, index) => {
    ctx.fillText(line, 50, 50 + (index * 40));
  });

  const buffer = canvas.toBuffer('image/png');
  const imagePath = path.join(__dirname, 'tests', 'images', imageName);

  fs.writeFileSync(imagePath, buffer);
  console.log(`✅ Created image: ${imagePath}`);
}

async function generateImages() {
  try {
    await createTestImage('english-contract.png', [
      'BUSINESS CONTRACT',
      'This agreement is entered into between:',
      'Party A: TechCorp Inc.',
      'Party B: ClientCorp Ltd.',
      'TERMS AND CONDITIONS:',
      'Payment terms: Net 30 days',
      'Services to be provided: Consulting',
    ]);

    await createTestImage('chinese-contract.png', [
      '商业合同',
      '本协议由以下双方签署：',
      '甲方：科技公司',
      '乙方：客户公司',
      '条款和条件：',
      '付款条件：30天内付清',
    ]);

    await createTestImage('bilingual-contract.png', [
      'BILINGUAL CONTRACT',
      'This agreement is signed by:',
      'Party A/甲方: TechCorp Inc.',
      'Party B/乙方: ClientCorp Ltd.',
    ]);

    await createTestImage('legal-document.png', [
      'LEGAL DOCUMENT',
      'WHEREAS, TechCorp wishes to develop...',
      'THEREFORE, the parties agree as follows...',
    ]);

    console.log('✅ All images generated successfully');
  } catch (error) {
    console.error(`❌ Error generating images: ${error.message}`);
  }
}

generateImages();

