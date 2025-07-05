/**
 * Mock Document Generation Utilities
 * 
 * These functions generate test legal documents for performance testing and demos.
 * Used by the Performance Demo Scenarios in the ComparisonInterface component.
 */

export type DocumentSize = 'small' | 'medium' | 'monster';
export type DiffComplexity = 'few' | 'many' | 'extreme';

/**
 * Generates a mock legal document of specified size for testing purposes
 */
export const createMockDocument = (size: DocumentSize, targetLength: number, isRevised: boolean = false): string => {
  const paragraphs = [
    "This legal document establishes the terms and conditions governing the relationship between the parties hereto. The agreement shall remain in effect for the duration specified herein, subject to the terms and conditions set forth below.",
    "Whereas the Company desires to engage the Contractor to provide certain services as described in Exhibit A attached hereto and incorporated by reference; and whereas the Contractor represents that it has the necessary skills, experience, and resources to perform such services;",
    "Now, therefore, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:",
    "The Contractor shall perform the services described in the Statement of Work with due care and in accordance with the highest professional standards. All work shall be completed in a timely manner and shall meet or exceed industry standards.",
    "Compensation shall be paid according to the schedule set forth in Exhibit B. Payment terms are net thirty (30) days from receipt of invoice. Late payments may incur interest charges at the rate of 1.5% per month.",
    "This Agreement shall be governed by the laws of [STATE/JURISDICTION] without regard to its conflict of laws principles. Any disputes arising under this Agreement shall be resolved through binding arbitration.",
    "Either party may terminate this Agreement upon thirty (30) days written notice to the other party. Upon termination, all outstanding obligations shall survive, including but not limited to payment obligations and confidentiality provisions.",
    "The Contractor acknowledges that it may have access to confidential information of the Company. All such information shall be maintained in strict confidence and shall not be disclosed to any third party without prior written consent.",
    "This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements relating to the subject matter hereof. No modification shall be effective unless in writing and signed by both parties.",
    "If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be deemed modified to the minimum extent necessary to make it valid and enforceable."
  ];

  let content = '';
  const baseRepeats = Math.ceil(targetLength / 2000); // Estimate repeats needed
  
  for (let i = 0; i < baseRepeats; i++) {
    for (const paragraph of paragraphs) {
      if (isRevised && Math.random() > 0.7) {
        // Add some variations for revised versions
        content += paragraph.replace(/Company/g, 'Corporation')
                            .replace(/Contractor/g, 'Service Provider')
                            .replace(/thirty \(30\)/g, 'sixty (60)')
                            .replace(/1\.5%/g, '2.0%') + '\n\n';
      } else {
        content += paragraph + '\n\n';
      }
      
      if (content.length >= targetLength) break;
    }
    if (content.length >= targetLength) break;
  }
  
  // Trim to target length
  return content.substring(0, targetLength);
};

/**
 * Creates a modified version of a document with controlled complexity changes
 */
export const createMockDiff = (complexity: DiffComplexity, originalDoc: string): string => {
  let revisedDoc = originalDoc;
  
  switch (complexity) {
    case 'few':
      // Make 5-10 small changes
      revisedDoc = originalDoc.replace(/Company/g, 'Corporation')
                              .replace(/Agreement/g, 'Contract')
                              .replace(/thirty \(30\)/g, 'sixty (60)')
                              .replace(/1\.5%/g, '2.0%')
                              .replace(/binding arbitration/g, 'mediation followed by arbitration');
      break;
      
    case 'many':
      // Make 50-100 changes throughout
      revisedDoc = originalDoc.replace(/Company/g, 'Corporation')
                              .replace(/Contractor/g, 'Service Provider')
                              .replace(/Agreement/g, 'Contract')
                              .replace(/thirty \(30\)/g, 'sixty (60)')
                              .replace(/1\.5%/g, '2.0%')
                              .replace(/the parties/g, 'both parties')
                              .replace(/shall be/g, 'will be')
                              .replace(/herein/g, 'in this document')
                              .replace(/thereof/g, 'of this agreement')
                              .replace(/binding arbitration/g, 'mediation followed by arbitration')
                              .replace(/written notice/g, 'written notification')
                              .replace(/confidential information/g, 'proprietary and confidential information')
                              .replace(/in writing/g, 'in written form')
                              .replace(/full force and effect/g, 'complete force and effect')
                              .replace(/STATE\/JURISDICTION/g, 'NEW YORK');
      break;
      
    case 'extreme':
      // Massive changes - almost completely rewritten
      revisedDoc = originalDoc.replace(/Company/g, 'Enterprise Corporation')
                              .replace(/Contractor/g, 'Independent Service Provider')
                              .replace(/Agreement/g, 'Master Service Contract')
                              .replace(/thirty \(30\)/g, 'ninety (90)')
                              .replace(/1\.5%/g, '3.5%')
                              .replace(/the parties/g, 'all contracting parties')
                              .replace(/shall be/g, 'must be')
                              .replace(/will be/g, 'shall be')
                              .replace(/herein/g, 'within this comprehensive document')
                              .replace(/thereof/g, 'pertaining to this binding agreement')
                              .replace(/binding arbitration/g, 'mandatory mediation followed by binding arbitration')
                              .replace(/written notice/g, 'formal written notification via certified mail')
                              .replace(/confidential information/g, 'highly sensitive proprietary and confidential information')
                              .replace(/in writing/g, 'documented in written form with notarized signatures')
                              .replace(/full force and effect/g, 'complete and binding force and legal effect')
                              .replace(/STATE\/JURISDICTION/g, 'DELAWARE')
                              .replace(/legal document/g, 'comprehensive legal instrument')
                              .replace(/terms and conditions/g, 'detailed terms, conditions, and stipulations')
                              .replace(/services/g, 'professional consulting services')
                              .replace(/payment/g, 'monetary compensation')
                              .replace(/invoice/g, 'detailed billing statement');
      
      // Add additional content for extreme test
      revisedDoc += '\n\nADDITIONAL PROVISIONS:\n\n';
      revisedDoc += 'The parties acknowledge that this agreement represents a significant business relationship requiring ongoing communication and collaboration. Both parties commit to maintaining the highest standards of professional conduct throughout the term of this agreement.\n\n';
      revisedDoc += 'FORCE MAJEURE: Neither party shall be liable for any failure or delay in performance under this Agreement which is due to circumstances beyond the reasonable control of such party, including but not limited to acts of God, war, terrorism, pandemic, government regulations, or natural disasters.\n\n';
      revisedDoc += 'DATA PROTECTION: Both parties agree to comply with all applicable data protection laws and regulations, including but not limited to GDPR, CCPA, and any other relevant privacy legislation in effect during the term of this agreement.';
      break;
  }
  
  return revisedDoc;
};
