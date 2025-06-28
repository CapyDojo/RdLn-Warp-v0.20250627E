/**
 * Test document fixtures for OCR testing
 * 
 * Note: In a real implementation, you would replace these with actual test images.
 * For this example, we're using simple base64 encoded images.
 */

export interface TestDocument {
  id: string;
  name: string;
  description: string;
  imageData: string; // base64 encoded image
  expectedText: string;
  expectedLanguages: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  documentType: 'contract' | 'invoice' | 'letter' | 'form' | 'technical' | 'handwritten';
  quality: 'high' | 'medium' | 'low';
}

// Simple test images - in production, replace with real document scans
const SAMPLE_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export const TEST_DOCUMENTS: TestDocument[] = [
  // English Documents
  {
    id: 'eng-001',
    name: 'Simple English Contract',
    description: 'Basic English contract with clear text',
    imageData: SAMPLE_IMAGE_BASE64,
    expectedText: `CONTRACT AGREEMENT

This agreement is made between Party A and Party B.

1. Terms and Conditions
   The parties agree to the following terms.

2. Payment Terms
   Payment shall be made within 30 days.

3. Termination
   This contract may be terminated with notice.`,
    expectedLanguages: ['eng'],
    difficulty: 'easy',
    documentType: 'contract',
    quality: 'high'
  },

  {
    id: 'eng-002',
    name: 'Technical Manual',
    description: 'Technical documentation with complex layout',
    imageData: SAMPLE_IMAGE_BASE64,
    expectedText: `TECHNICAL SPECIFICATIONS

Model: XYZ-123
Version: 2.1.0

Installation Instructions:
1. Download the software
2. Run the installer
3. Follow the setup wizard

Configuration Parameters:
- Port: 8080
- Timeout: 30s
- Memory: 512MB`,
    expectedLanguages: ['eng'],
    difficulty: 'medium',
    documentType: 'technical',
    quality: 'high'
  },

  // Chinese Documents
  {
    id: 'chi-001',
    name: 'Chinese Contract (Simplified)',
    description: 'Chinese contract in simplified characters',
    imageData: SAMPLE_IMAGE_BASE64,
    expectedText: `合同协议

甲方和乙方达成以下协议。

第一条 总则
双方同意遵守以下条款。

第二条 付款条件
应在30天内付款。

第三条 终止条款
本合同可通过通知终止。`,
    expectedLanguages: ['chi_sim'],
    difficulty: 'easy',
    documentType: 'contract',
    quality: 'high'
  },

  {
    id: 'chi-002',
    name: 'Chinese Contract (Traditional)',
    description: 'Chinese contract in traditional characters',
    imageData: SAMPLE_IMAGE_BASE64,
    expectedText: `合同協議

甲方和乙方達成以下協議。

第一條 總則
雙方同意遵守以下條款。

第二條 付款條件
應在30天內付款。

第三條 終止條款
本合同可通過通知終止。`,
    expectedLanguages: ['chi_tra'],
    difficulty: 'easy',
    documentType: 'contract',
    quality: 'high'
  },

  // Multi-language Documents
  {
    id: 'multi-001',
    name: 'English-Chinese Contract',
    description: 'Bilingual contract with English and Chinese',
    imageData: SAMPLE_IMAGE_BASE64,
    expectedText: `CONTRACT AGREEMENT 合同协议

This agreement is made between Party A and Party B.
本协议由甲方和乙方签署。

1. Terms and Conditions 条款和条件
   The parties agree to the following terms.
   双方同意以下条款。

2. Payment Terms 付款条件
   Payment shall be made within 30 days.
   应在30天内付款。`,
    expectedLanguages: ['eng', 'chi_sim'],
    difficulty: 'medium',
    documentType: 'contract',
    quality: 'high'
  },

  {
    id: 'multi-002',
    name: 'English-Chinese-Russian Document',
    description: 'Trilingual document with complex layout',
    imageData: SAMPLE_IMAGE_BASE64,
    expectedText: `INTERNATIONAL AGREEMENT
国际协议
МЕЖДУНАРОДНОЕ СОГЛАШЕНИЕ

Party A shall provide services.
甲方应提供服务。
Сторона А должна предоставить услуги.

Terms and Conditions:
条款和条件：
Условия:

1. Payment in USD
   以美元付款
   Оплата в долларах США`,
    expectedLanguages: ['eng', 'chi_sim', 'rus'],
    difficulty: 'hard',
    documentType: 'contract',
    quality: 'high'
  },

  // Quality Variants
  {
    id: 'qual-001',
    name: 'Poor Quality Scan',
    description: 'Low quality scan with noise and artifacts',
    imageData: SAMPLE_IMAGE_BASE64,
    expectedText: `This is a poor quality document.
Some text may be illegible.
OCR accuracy will be lower.`,
    expectedLanguages: ['eng'],
    difficulty: 'hard',
    documentType: 'letter',
    quality: 'low'
  },

  {
    id: 'qual-002',
    name: 'Medium Quality Document',
    description: 'Medium quality scan with some compression artifacts',
    imageData: SAMPLE_IMAGE_BASE64,
    expectedText: `This document has medium quality.
Most text should be readable.
Some minor OCR errors expected.`,
    expectedLanguages: ['eng'],
    difficulty: 'medium',
    documentType: 'letter',
    quality: 'medium'
  },

  // Complex Layout Documents
  {
    id: 'layout-001',
    name: 'Multi-Column Invoice',
    description: 'Invoice with complex table layout',
    imageData: SAMPLE_IMAGE_BASE64,
    expectedText: `INVOICE #12345

Bill To:                    Ship To:
John Smith                  Jane Doe
123 Main St                 456 Oak Ave
City, State 12345          City, State 67890

Item        Qty    Price    Total
Widget A    2      $10.00   $20.00
Widget B    1      $15.00   $15.00
                   
Subtotal:                   $35.00
Tax:                        $3.50
Total:                      $38.50`,
    expectedLanguages: ['eng'],
    difficulty: 'hard',
    documentType: 'invoice',
    quality: 'high'
  },

  // Handwritten Text
  {
    id: 'hand-001',
    name: 'Handwritten Note',
    description: 'Mixed handwritten and printed text',
    imageData: SAMPLE_IMAGE_BASE64,
    expectedText: `Meeting Notes - January 15, 2024

Attendees:
- John Smith (handwritten)
- Jane Doe (handwritten)

Action Items:
1. Review contract terms
2. Schedule follow-up meeting
3. Send proposal to client`,
    expectedLanguages: ['eng'],
    difficulty: 'hard',
    documentType: 'form',
    quality: 'medium'
  }
];

/**
 * Get test documents by criteria
 */
export function getTestDocumentsByLanguage(languages: string[]): TestDocument[] {
  return TEST_DOCUMENTS.filter(doc => 
    languages.some(lang => doc.expectedLanguages.includes(lang))
  );
}

export function getTestDocumentsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): TestDocument[] {
  return TEST_DOCUMENTS.filter(doc => doc.difficulty === difficulty);
}

export function getTestDocumentsByType(documentType: TestDocument['documentType']): TestDocument[] {
  return TEST_DOCUMENTS.filter(doc => doc.documentType === documentType);
}

export function getTestDocumentsByQuality(quality: 'high' | 'medium' | 'low'): TestDocument[] {
  return TEST_DOCUMENTS.filter(doc => doc.quality === quality);
}

/**
 * Create test image file from document
 */
export function createTestImageFromDocument(document: TestDocument): File {
  const byteCharacters = atob(document.imageData.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/png' });
  
  return new File([blob], `${document.id}.png`, { type: 'image/png' });
}
