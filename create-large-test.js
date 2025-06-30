// Generate large test documents for performance testing
// Target: ~100k characters with ~20k changes (realistic large legal document scenario)

function generateLargeDocument() {
  const baseContract = `
This AMENDED AND RESTATED MERGER AGREEMENT ("Agreement") is entered into as of March 15, 2024, among TechCorp International Inc., a Delaware corporation ("Parent"), TechCorp Acquisition Sub Inc., a Delaware corporation and wholly owned subsidiary of Parent ("Merger Sub"), and InnovateTech Solutions LLC, a Delaware limited liability company ("Company"), and the Members of the Company listed on Schedule A hereto (the "Members").

RECITALS

WHEREAS, the Board of Directors of Parent (the "Parent Board"), at a meeting duly called and held on March 10, 2024, has (i) determined that this Agreement and the transactions contemplated hereby, including the merger of Merger Sub with and into the Company (the "Merger"), with the Company surviving as a wholly owned subsidiary of Parent, are advisable and in the best interests of Parent and its stockholders, (ii) approved this Agreement and the transactions contemplated hereby, and (iii) resolved to recommend that the stockholders of Parent approve the issuance of shares of Parent Common Stock to the Members pursuant to this Agreement;

WHEREAS, the Members, holding not less than 75% of the outstanding Membership Interests of the Company, have executed and delivered to Parent written consents approving this Agreement and the transactions contemplated hereby;

WHEREAS, concurrently with the execution of this Agreement, Parent, Merger Sub and the Company are entering into various ancillary agreements in connection with the transactions contemplated hereby;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

ARTICLE 1
THE MERGER

1.1 The Merger. Subject to the terms and conditions of this Agreement and in accordance with the Delaware General Corporation Law (the "DGCL") and the Delaware Limited Liability Company Act (the "DLLCA"), at the Effective Time (as defined below), Merger Sub shall be merged with and into the Company, whereupon the separate existence of Merger Sub shall cease, and the Company shall continue as the surviving entity (the "Surviving Company") and as a wholly owned subsidiary of Parent.

1.2 Effective Time. The closing of the Merger (the "Closing") shall take place at 10:00 a.m., Eastern Time, on a date to be specified by the parties, which shall be no later than the second business day after satisfaction or waiver (where permissible) of the last to be satisfied or waived of the conditions set forth in Article 7 (other than those conditions that by their nature are to be satisfied at the Closing, but subject to the satisfaction or waiver of such conditions), at the offices of Kirkland & Ellis LLP, 601 Lexington Avenue, New York, New York 10022, unless another time, date or place is agreed to in writing by the parties hereto.

ARTICLE 2
CLOSING CONDITIONS

2.1 Conditions to Each Party's Obligation to Effect the Merger. The respective obligations of each party to effect the Merger are subject to the satisfaction or waiver (where permissible) of the following conditions:

(a) No Governmental Entity shall have enacted, issued, promulgated, enforced or entered any Law or Order (whether temporary, preliminary or permanent) that is in effect and restrains, enjoins or otherwise prohibits consummation of the Merger;

(b) All waiting periods (and any extensions thereof) applicable to the consummation of the Merger under the Hart-Scott-Rodino Antitrust Improvements Act of 1976, as amended (the "HSR Act"), shall have expired or been terminated;

(c) Parent shall have received all required approvals from its stockholders for the issuance of Parent Common Stock pursuant to this Agreement;

(d) The Company shall have received all required consents from its Members representing at least 75% of the outstanding Membership Interests;

(e) The representations and warranties of each party contained in this Agreement shall be true and correct in all material respects as of the date of this Agreement and as of the Closing Date;

(f) Each party shall have performed in all material respects all obligations and covenants required to be performed by it under this Agreement at or prior to the Closing;

(g) Since the date of this Agreement, there shall not have occurred any Material Adverse Effect with respect to the Company.

ARTICLE 3
PURCHASE PRICE AND PAYMENT

3.1 Merger Consideration. In consideration for the Merger, at the Effective Time, each outstanding Membership Interest of the Company shall be converted into the right to receive:

(a) $12.50 in cash (the "Cash Consideration"); and
(b) 0.75 shares of Parent Common Stock (the "Stock Consideration").

3.2 Aggregate Consideration Cap. The aggregate consideration payable to the Members shall not exceed $500,000,000 in cash and 15,000,000 shares of Parent Common Stock.

3.3 Escrow Arrangements. An amount equal to $25,000,000 of the Cash Consideration and 1,250,000 shares of the Stock Consideration shall be deposited into an escrow account for a period of 18 months to secure certain indemnification obligations of the Members.
`;

  // Repeat and modify the base contract to reach ~100k characters
  let originalDocument = '';
  let revisedDocument = '';
  
  const sections = [
    'ARTICLE 4\nREPRESENTATIONS AND WARRANTIES',
    'ARTICLE 5\nCOVENANTS',
    'ARTICLE 6\nINDEMNIFICATION',
    'ARTICLE 7\nTAX MATTERS',
    'ARTICLE 8\nEMPLOYEE BENEFITS',
    'ARTICLE 9\nTERMINATION',
    'ARTICLE 10\nGENERAL PROVISIONS'
  ];
  
  // Create detailed subsections for each article
  const subsectionTemplates = [
    'The Company hereby represents and warrants to Parent and Merger Sub that, except as set forth in the Company Disclosure Schedule',
    'From the date of this Agreement until the Effective Time, except as otherwise provided in this Agreement',
    'The Members hereby agree to indemnify and hold harmless Parent, the Surviving Company and their respective affiliates',
    'For purposes of this Agreement, the following tax-related definitions shall apply',
    'The Company maintains the employee benefit plans set forth on Schedule',
    'This Agreement may be terminated at any time prior to the Effective Time',
    'All notices, requests, claims, demands and other communications hereunder shall be in writing'
  ];
  
  // Generate multiple iterations with variations
  for (let i = 0; i < 8; i++) {
    let currentOriginal = baseContract;
    let currentRevised = baseContract;
    
    // Add article sections
    sections.forEach((section, sectionIndex) => {
      currentOriginal += `\n\n${section}\n\n`;
      currentRevised += `\n\n${section}\n\n`;
      
      // Add subsections
      for (let j = 1; j <= 15; j++) {
        const subsectionNum = `${sectionIndex + 4}.${j}`;
        const template = subsectionTemplates[sectionIndex % subsectionTemplates.length];
        
        // Original version
        const originalClause = `${subsectionNum} ${template} as of December 31, 2023, and shall continue to be true and correct through the Closing Date. The aggregate liability under this section shall not exceed $10,000,000, and any claims must be brought within 12 months of the Closing Date. TechCorp International Inc. shall provide written notice within 30 days of any potential claim, and all disputes shall be resolved through binding arbitration in New York, New York under the rules of the American Arbitration Association.`;
        
        // Revised version with multiple changes
        const revisedClause = `${subsectionNum} ${template} as of March 31, 2024, and shall continue to be true and correct through the Closing Date. The aggregate liability under this section shall not exceed $15,000,000, and any claims must be brought within 18 months of the Closing Date. TechCorp Global Holdings Inc. shall provide written notice within 45 days of any potential claim, and all disputes shall be resolved through binding arbitration in Delaware, Delaware under the rules of the International Chamber of Commerce.`;
        
        currentOriginal += `\n${originalClause}\n`;
        currentRevised += `\n${revisedClause}\n`;
      }
    });
    
    // Add schedules and exhibits
    const schedules = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    schedules.forEach(schedule => {
      currentOriginal += `\n\nSCHEDULE ${schedule}\n\n`;
      currentRevised += `\n\nSCHEDULE ${schedule}\n\n`;
      
      for (let k = 1; k <= 10; k++) {
        const originalItem = `${k}. Entity: TechCorp International Inc., Address: 123 Tech Street, San Francisco, CA 94105, Founded: 2010, Employees: 500, Revenue: $50,000,000, Valuation: $200,000,000`;
        const revisedItem = `${k}. Entity: TechCorp Global Holdings Inc., Address: 456 Innovation Blvd, Austin, TX 78701, Founded: 2010, Employees: 750, Revenue: $75,000,000, Valuation: $350,000,000`;
        
        currentOriginal += `${originalItem}\n`;
        currentRevised += `${revisedItem}\n`;
      }
    });
    
    originalDocument += currentOriginal + '\n\n';
    revisedDocument += currentRevised + '\n\n';
  }
  
  console.log('Generated documents:');
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
const testCase = generateLargeDocument();

console.log('\n=== COPY THE FOLLOWING FOR TESTING ===\n');
console.log('ORIGINAL DOCUMENT:');
console.log('====================');
console.log(testCase.original.substring(0, 1000) + '...[TRUNCATED FOR DISPLAY]');

console.log('\n\nREVISED DOCUMENT:');
console.log('====================');  
console.log(testCase.revised.substring(0, 1000) + '...[TRUNCATED FOR DISPLAY]');

console.log('\n\n=== STATS ===');
console.log(JSON.stringify(testCase.stats, null, 2));

// Also write to files for easier testing
import fs from 'fs';
fs.writeFileSync('large-test-original.txt', testCase.original);
fs.writeFileSync('large-test-revised.txt', testCase.revised);
console.log('\n✅ Test files written: large-test-original.txt and large-test-revised.txt');
