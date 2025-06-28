const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create test images directory
const testImageDir = path.join(__dirname, 'images');
if (!fs.existsSync(testImageDir)) {
  fs.mkdirSync(testImageDir, { recursive: true });
  console.log('📁 Created test images directory');
}

// Create English contract image
function createEnglishContract() {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  // White background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 800, 600);
  
  // Black text
  ctx.fillStyle = 'black';
  ctx.font = 'bold 28px Arial';
  ctx.fillText('BUSINESS CONTRACT', 50, 50);
  
  ctx.font = '20px Arial';
  ctx.fillText('This agreement is entered into between:', 50, 120);
  ctx.fillText('Party A: TechCorp Inc.', 50, 160);
  ctx.fillText('Party B: ClientCorp Ltd.', 50, 200);
  
  ctx.font = 'bold 22px Arial';
  ctx.fillText('TERMS AND CONDITIONS:', 50, 280);
  
  ctx.font = '18px Arial';
  ctx.fillText('1. Payment terms: Net 30 days from invoice date', 50, 320);
  ctx.fillText('2. Services to be provided as outlined in Exhibit A', 50, 350);
  ctx.fillText('3. Both parties agree to maintain confidentiality', 50, 380);
  ctx.fillText('4. This agreement shall be governed by the laws', 50, 410);
  ctx.fillText('   of the State of California', 50, 440);
  
  ctx.font = 'bold 20px Arial';
  ctx.fillText('WHEREAS, the parties wish to enter into this', 50, 500);
  ctx.fillText('agreement for mutual benefit and consideration.', 50, 530);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(testImageDir, 'english-contract.png'), buffer);
  console.log('✅ Created: english-contract.png');
}

// Create Chinese contract image
function createChineseContract() {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  // White background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 800, 600);
  
  // Black text
  ctx.fillStyle = 'black';
  ctx.font = 'bold 28px "Microsoft YaHei", Arial';
  ctx.fillText('商业合同', 50, 50);
  
  ctx.font = '20px "Microsoft YaHei", Arial';
  ctx.fillText('本协议由以下双方签署：', 50, 120);
  ctx.fillText('甲方：科技发展有限公司', 50, 160);
  ctx.fillText('乙方：客户服务有限公司', 50, 200);
  
  ctx.font = 'bold 22px "Microsoft YaHei", Arial';
  ctx.fillText('条款和条件：', 50, 280);
  
  ctx.font = '18px "Microsoft YaHei", Arial';
  ctx.fillText('第一条：付款条件为收到发票后三十天内付清', 50, 320);
  ctx.fillText('第二条：按照附件A中概述的内容提供服务', 50, 350);
  ctx.fillText('第三条：双方同意保守商业机密', 50, 380);
  ctx.fillText('第四条：本协议受加利福尼亚州法律管辖', 50, 410);
  
  ctx.font = 'bold 20px "Microsoft YaHei", Arial';
  ctx.fillText('鉴于双方希望为了共同利益和对价', 50, 480);
  ctx.fillText('签订本协议。', 50, 510);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(testImageDir, 'chinese-contract.png'), buffer);
  console.log('✅ Created: chinese-contract.png');
}

// Create bilingual contract image
function createBilingualContract() {
  const canvas = createCanvas(800, 700);
  const ctx = canvas.getContext('2d');
  
  // White background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 800, 700);
  
  // Black text
  ctx.fillStyle = 'black';
  ctx.font = 'bold 26px Arial';
  ctx.fillText('COMMERCIAL AGREEMENT / 商业协议', 50, 50);
  
  ctx.font = '18px Arial';
  ctx.fillText('This agreement is between / 本协议签署双方为：', 50, 110);
  ctx.fillText('Party A: TechCorp Inc.', 50, 150);
  ctx.fillText('甲方：科技公司', 50, 180);
  ctx.fillText('Party B: ClientCorp Ltd.', 50, 220);
  ctx.fillText('乙方：客户公司', 50, 250);
  
  ctx.font = 'bold 20px Arial';
  ctx.fillText('Terms and Conditions / 条款与条件：', 50, 320);
  
  ctx.font = '16px Arial';
  ctx.fillText('1. Payment terms / 付款条件:', 50, 360);
  ctx.fillText('   Net 30 days / 净30天付款', 70, 385);
  ctx.fillText('2. Delivery schedule / 交付时间表:', 50, 420);
  ctx.fillText('   As mutually agreed / 双方协商确定', 70, 445);
  ctx.fillText('3. Confidentiality / 保密条款:', 50, 480);
  ctx.fillText('   Both parties agree / 双方同意保密', 70, 505);
  
  ctx.font = 'bold 18px Arial';
  ctx.fillText('WHEREAS both parties wish to establish', 50, 570);
  ctx.fillText('鉴于双方希望建立长期合作关系', 50, 600);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(testImageDir, 'bilingual-contract.png'), buffer);
  console.log('✅ Created: bilingual-contract.png');
}

// Create legal document with paragraphs
function createLegalDocument() {
  const canvas = createCanvas(800, 800);
  const ctx = canvas.getContext('2d');
  
  // White background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 800, 800);
  
  // Black text
  ctx.fillStyle = 'black';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('SERVICE AGREEMENT', 50, 40);
  
  ctx.font = '16px Arial';
  ctx.fillText('WHEREAS, Company desires to engage Contractor to provide', 50, 100);
  ctx.fillText('certain services as described herein; and', 50, 125);
  
  ctx.fillText('WHEREAS, Contractor represents that it has the expertise', 50, 170);
  ctx.fillText('and capability to perform such services;', 50, 195);
  
  ctx.fillText('NOW THEREFORE, in consideration of the mutual covenants', 50, 240);
  ctx.fillText('contained herein, the parties agree as follows:', 50, 265);
  
  ctx.font = 'bold 18px Arial';
  ctx.fillText('Article 1: SCOPE OF SERVICES', 50, 320);
  
  ctx.font = '16px Arial';
  ctx.fillText('The Contractor shall provide professional consulting', 50, 355);
  ctx.fillText('services as described in Exhibit A attached hereto.', 50, 380);
  
  ctx.font = 'bold 18px Arial';
  ctx.fillText('Article 2: COMPENSATION', 50, 430);
  
  ctx.font = '16px Arial';
  ctx.fillText('Payment shall be made within thirty (30) days of', 50, 465);
  ctx.fillText('receipt of invoice by Company.', 50, 490);
  
  ctx.font = 'bold 18px Arial';
  ctx.fillText('Article 3: TERM', 50, 540);
  
  ctx.font = '16px Arial';
  ctx.fillText('This Agreement shall commence on the Effective Date', 50, 575);
  ctx.fillText('and shall continue until terminated by either party.', 50, 600);
  
  ctx.font = 'bold 18px Arial';
  ctx.fillText('IN WITNESS WHEREOF, the parties have executed', 50, 670);
  ctx.fillText('this Agreement as of the date first written above.', 50, 700);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(testImageDir, 'legal-document.png'), buffer);
  console.log('✅ Created: legal-document.png');
}

// Create all test images
async function createAllTestImages() {
  console.log('🎨 Creating test images...');
  
  try {
    createEnglishContract();
    createChineseContract();
    createBilingualContract();
    createLegalDocument();
    
    console.log('🎉 All test images created successfully!');
    console.log(`📁 Images saved in: ${testImageDir}`);
  } catch (error) {
    console.error('❌ Error creating test images:', error);
  }
}

// Run if called directly
if (require.main === module) {
  createAllTestImages();
}

module.exports = { createAllTestImages };
