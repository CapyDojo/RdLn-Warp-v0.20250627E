// Generate medium-sized test documents for performance testing
// Target: ~50k characters with ~10k changes (reasonable size for UI testing)

function generateMediumDocument() {
  const baseContract = `
This MERGER AGREEMENT ("Agreement") is entered into as of March 15, 2024, among TechCorp International Inc., a Delaware corporation ("Parent"), TechCorp Acquisition Sub Inc., a Delaware corporation and wholly owned subsidiary of Parent ("Merger Sub"), and InnovateTech Solutions LLC, a Delaware limited liability company ("Company").

RECITALS

WHEREAS, the Board of Directors of Parent has determined that this Agreement and the transactions contemplated hereby are in the best interests of Parent and its stockholders;

WHEREAS, the Members, holding not less than 75% of the outstanding Membership Interests of the Company, have executed and delivered to Parent written consents approving this Agreement;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

ARTICLE 1 - THE MERGER

1.1 The Merger. Subject to the terms and conditions of this Agreement, at the Effective Time, Merger Sub shall be merged with and into the Company, whereupon the separate existence of Merger Sub shall cease, and the Company shall continue as the surviving entity and as a wholly owned subsidiary of Parent.

ARTICLE 2 - CLOSING CONDITIONS

2.1 Conditions. The obligations of each party to effect the Merger are subject to the satisfaction of the following conditions:
(a) No Governmental Entity shall have enacted any Law that restrains or prohibits consummation of the Merger;
(b) All waiting periods under the Hart-Scott-Rodino Antitrust Improvements Act shall have expired;
(c) Parent shall have received all required approvals from its stockholders;
(d) The Company shall have received all required consents from its Members representing at least 75% of the outstanding Membership Interests.

ARTICLE 3 - PURCHASE PRICE

3.1 Merger Consideration. Each outstanding Membership Interest shall be converted into the right to receive:
(a) $12.50 in cash (the "Cash Consideration"); and
(b) 0.75 shares of Parent Common Stock (the "Stock Consideration").

3.2 Aggregate Consideration Cap. The aggregate consideration shall not exceed $500,000,000 in cash and 15,000,000 shares of Parent Common Stock.
`;

  // Create more detailed subsections
  let originalDocument = '';
  let revisedDocument = '';
  
  const articles = [
    'REPRESENTATIONS AND WARRANTIES',
    'COVENANTS',
    'INDEMNIFICATION',
    'TAX MATTERS',
    'EMPLOYEE BENEFITS',
    'TERMINATION',
    'GENERAL PROVISIONS'
  ];
  
  const clauseTemplates = [
    'The Company hereby represents and warrants to Parent that all information provided is accurate',
    'From the date of this Agreement until the Effective Time, the Company shall conduct its business in the ordinary course',
    'The Members hereby agree to indemnify and hold harmless Parent and its affiliates',
    'For purposes of this Agreement, the following tax-related provisions shall apply',
    'The Company maintains employee benefit plans that comply with applicable law',
    'This Agreement may be terminated under certain specified circumstances',
    'All notices and communications shall be in writing and delivered as specified herein'
  ];
  
  // Generate multiple copies with variations
  for (let copy = 0; copy < 3; copy++) {
    let currentOriginal = baseContract;
    let currentRevised = baseContract;
    
    // Add detailed articles
    articles.forEach((article, articleIndex) => {
      const articleNum = articleIndex + 4;
      currentOriginal += `\n\nARTICLE ${articleNum} - ${article}\n\n`;
      currentRevised += `\n\nARTICLE ${articleNum} - ${article}\n\n`;
      
      // Add multiple detailed clauses
      for (let clause = 1; clause <= 8; clause++) {
        const clauseNum = `${articleNum}.${clause}`;
        const template = clauseTemplates[articleIndex % clauseTemplates.length];
        
        // Original version with specific terms
        const originalClause = `${clauseNum} ${template} as of December 31, 2023, with liability not exceeding $10,000,000, and claims must be brought within 12 months. TechCorp International Inc. shall provide notice within 30 days, and disputes shall be resolved in New York, New York under AAA rules. The effective date shall be January 1, 2024, and the term shall be 5 years with automatic renewal provisions.`;
        
        // Revised version with multiple strategic changes
        const revisedClause = `${clauseNum} ${template} as of March 31, 2024, with liability not exceeding $15,000,000, and claims must be brought within 18 months. TechCorp Global Holdings Inc. shall provide notice within 45 days, and disputes shall be resolved in Delaware, Delaware under ICC rules. The effective date shall be April 1, 2024, and the term shall be 7 years with optional renewal provisions.`;
        
        currentOriginal += `${originalClause}\n\n`;
        currentRevised += `${revisedClause}\n\n`;
      }
    });
    
    // Add schedules with realistic data
    const schedules = ['A', 'B', 'C', 'D'];
    schedules.forEach(schedule => {
      currentOriginal += `\nSCHEDULE ${schedule}\n\n`;
      currentRevised += `\nSCHEDULE ${schedule}\n\n`;
      
      for (let item = 1; item <= 5; item++) {
        const originalItem = `${item}. Entity: TechCorp International Inc., Address: 123 Tech Street, San Francisco, CA 94105, Employees: 500, Revenue: $50,000,000, Founded: 2010, Contact: info@techcorp.com, Phone: (555) 123-4567`;
        const revisedItem = `${item}. Entity: TechCorp Global Holdings Inc., Address: 456 Innovation Blvd, Austin, TX 78701, Employees: 750, Revenue: $75,000,000, Founded: 2010, Contact: contact@techcorp-global.com, Phone: (555) 987-6543`;
        
        currentOriginal += `${originalItem}\n`;
        currentRevised += `${revisedItem}\n`;
      }
    });
    
    originalDocument += currentOriginal + '\n\n';
    revisedDocument += currentRevised + '\n\n';
  }
  
  console.log('Generated medium documents:');
  console.log(`Original length: ${originalDocument.length} characters`);
  console.log(`Revised length: ${revisedDocument.length} characters`);
  
  // Count approximate number of changes
  const originalWords = originalDocument.split(/\s+/);
  const revisedWords = revisedDocument.split(/\s+/);
  const minLength = Math.min(originalWords.length, revisedWords.length);
  let changeCount = 0;
  
  for (let i = 0; i < minLength; i++) {
    if (originalWords[i] !== revisedWords[i]) {
      changeCount++;
    }
  }
  
  console.log(`Approximate changes: ${changeCount}`);
  console.log(`Original word count: ${originalWords.length}`);
  console.log(`Revised word count: ${revisedWords.length}`);
  
  return {
    original: originalDocument,
    revised: revisedDocument,
    stats: {
      originalLength: originalDocument.length,
      revisedLength: revisedDocument.length,
      originalWords: originalWords.length,
      revisedWords: revisedWords.length,
      approximateChanges: changeCount
    }
  };
}

// Generate and output the test case
const testCase = generateMediumDocument();

console.log('\n=== MEDIUM TEST CASE FOR PERFORMANCE TESTING ===\n');
console.log('STATS:', JSON.stringify(testCase.stats, null, 2));

// Write to files for easier testing
import fs from 'fs';
fs.writeFileSync('medium-test-original.txt', testCase.original);
fs.writeFileSync('medium-test-revised.txt', testCase.revised);
console.log('\n✅ Medium test files written: medium-test-original.txt and medium-test-revised.txt');
