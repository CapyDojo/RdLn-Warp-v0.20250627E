import React, { useState } from 'react';
import { Play, ChevronDown, ChevronRight, Zap, Target, Clock, BarChart3 } from 'lucide-react';

interface AdvancedTestCase {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Hard' | 'Expert' | 'Extreme';
  complexity: {
    wordCount: number;
    sentenceCount: number;
    expectedChanges: number;
    nestingDepth: number;
  };
  originalText: string;
  revisedText: string;
  expectedBehavior: {
    description: string;
    criticalFeatures: string[];
    performanceExpectations: string;
    edgeCases: string[];
  };
  stressTestAspects: string[];
}

const ADVANCED_TEST_CASES: AdvancedTestCase[] = [
  {
    id: 'corporate-structure-complex',
    name: 'Corporate Structure - Multi-Entity Ownership Chain',
    description: 'Complex corporate ownership structure with multiple subsidiaries and percentage changes',
    category: 'Corporate Structure',
    difficulty: 'Hard',
    complexity: {
      wordCount: 420,
      sentenceCount: 18,
      expectedChanges: 28,
      nestingDepth: 4
    },
    originalText: `TechGlobal Holdings Inc., a Delaware corporation ("Parent"), owns 85% of the outstanding shares of TechGlobal Operations LLC, a California limited liability company ("Operations"), which in turn owns 60% of TechGlobal Manufacturing Corp., a Texas corporation ("Manufacturing"). Manufacturing owns 100% of TechGlobal Distribution Ltd., a Nevada corporation ("Distribution").

Parent also directly owns 45% of TechGlobal Research & Development Partnership, a Delaware limited partnership ("R&D Partnership"), with the remaining 55% owned by Dr. Sarah Chen and Dr. Michael Rodriguez as general partners. The R&D Partnership holds exclusive licensing rights to Patent Portfolio A, comprising 127 patents related to advanced semiconductor manufacturing processes.

Operations maintains a controlling interest in TechGlobal International Holdings B.V., a Netherlands corporation ("International"), owning 75% of the issued share capital. International owns 90% of TechGlobal Europe GmbH, a German corporation ("Europe"), and 80% of TechGlobal Asia Pte. Ltd., a Singapore corporation ("Asia").

The consolidated revenue for the fiscal year ending December 31, 2023, was $2.4 billion, with Operations contributing $1.2 billion, Manufacturing contributing $800 million, and International contributing $400 million. EBITDA margins were 18.5% for Operations, 12.3% for Manufacturing, and 22.1% for International.`,
    revisedText: `TechGlobal Holdings Inc., a Delaware corporation ("Parent"), owns 92% of the outstanding shares of TechGlobal Operations LLC, a California limited liability company ("Operations"), which in turn owns 75% of TechGlobal Manufacturing Corp., a Texas corporation ("Manufacturing"). Manufacturing owns 100% of TechGlobal Distribution Ltd., a Nevada corporation ("Distribution").

Parent also directly owns 60% of TechGlobal Research & Development Partnership, a Delaware limited partnership ("R&D Partnership"), with the remaining 40% owned by Dr. Sarah Chen, Dr. Michael Rodriguez, and Dr. Jennifer Liu as general partners. The R&D Partnership holds exclusive licensing rights to Patent Portfolio A and Patent Portfolio B, comprising 184 patents related to advanced semiconductor manufacturing processes and quantum computing applications.

Operations maintains a controlling interest in TechGlobal International Holdings B.V., a Netherlands corporation ("International"), owning 85% of the issued share capital. International owns 95% of TechGlobal Europe GmbH, a German corporation ("Europe"), and 90% of TechGlobal Asia Pte. Ltd., a Singapore corporation ("Asia").

The consolidated revenue for the fiscal year ending December 31, 2024, was $3.1 billion, with Operations contributing $1.5 billion, Manufacturing contributing $1.0 billion, and International contributing $600 million. EBITDA margins were 21.2% for Operations, 15.8% for Manufacturing, and 25.4% for International.`,
    expectedBehavior: {
      description: 'Should handle percentage changes, entity additions, and financial figure modifications while preserving corporate structure formatting',
      criticalFeatures: ['Percentage substitutions', 'Financial figure changes', 'Entity name additions', 'Date updates'],
      performanceExpectations: 'Should complete in <100ms given moderate complexity',
      edgeCases: ['Multiple percentage changes in single sentence', 'Currency and decimal formatting', 'Corporate entity abbreviations']
    },
    stressTestAspects: ['Nested corporate structures', 'Financial precision', 'Entity relationship mapping']
  },
  {
    id: 'financial-precision-complex',
    name: 'Financial Agreement - Precision Calculations',
    description: 'Complex financial calculations with multiple currencies and precise decimal requirements',
    category: 'Financial',
    difficulty: 'Expert',
    complexity: {
      wordCount: 380,
      sentenceCount: 15,
      expectedChanges: 32,
      nestingDepth: 5
    },
    originalText: `The Loan Agreement provides for a principal amount of $15,000,000.00 (fifteen million dollars) at a variable interest rate equal to the 3-month LIBOR plus 275 basis points, with a floor of 3.25% per annum and a ceiling of 8.75% per annum. Interest shall be calculated on the basis of a 360-day year and actual days elapsed.

The Borrower shall pay a commitment fee of 0.50% per annum on the undrawn portion of the facility, payable quarterly in arrears. Additionally, an upfront arrangement fee of $150,000 (one hundred fifty thousand dollars) shall be paid upon execution of this Agreement.

Currency hedging requirements: The Borrower must maintain hedging coverage for at least 75% of its EUR exposure (currently €12,500,000) and 60% of its GBP exposure (currently £8,750,000). The hedging instruments must have a minimum remaining term of 18 months.

Financial covenants include: (i) minimum debt service coverage ratio of 1.35:1, tested quarterly; (ii) maximum total leverage ratio of 4.25:1, tested quarterly; (iii) minimum tangible net worth of $45,000,000; and (iv) minimum liquidity of $5,000,000 at all times.

Default interest rate shall be 2.00% per annum above the otherwise applicable interest rate. Late payment fees of $2,500 per occurrence shall apply for payments more than 5 business days overdue.`,
    revisedText: `The Loan Agreement provides for a principal amount of $22,500,000.00 (twenty-two million five hundred thousand dollars) at a variable interest rate equal to the 3-month SOFR plus 325 basis points, with a floor of 3.75% per annum and a ceiling of 9.25% per annum. Interest shall be calculated on the basis of a 365-day year and actual days elapsed.

The Borrower shall pay a commitment fee of 0.75% per annum on the undrawn portion of the facility, payable monthly in arrears. Additionally, an upfront arrangement fee of $225,000 (two hundred twenty-five thousand dollars) shall be paid upon execution of this Agreement.

Currency hedging requirements: The Borrower must maintain hedging coverage for at least 85% of its EUR exposure (currently €18,750,000) and 70% of its GBP exposure (currently £12,250,000). The hedging instruments must have a minimum remaining term of 24 months.

Financial covenants include: (i) minimum debt service coverage ratio of 1.50:1, tested monthly; (ii) maximum total leverage ratio of 3.75:1, tested monthly; (iii) minimum tangible net worth of $60,000,000; and (iv) minimum liquidity of $7,500,000 at all times.

Default interest rate shall be 2.50% per annum above the otherwise applicable interest rate. Late payment fees of $5,000 per occurrence shall apply for payments more than 3 business days overdue.`,
    expectedBehavior: {
      description: 'Should precisely handle financial calculations, currency symbols, and decimal precision without rounding errors',
      criticalFeatures: ['Multi-currency handling', 'Decimal precision', 'Financial ratios', 'Percentage calculations'],
      performanceExpectations: 'Should complete in 100-150ms due to precision requirements',
      edgeCases: ['Currency symbol placement', 'Decimal alignment', 'Ratio formatting', 'Basis point calculations']
    },
    stressTestAspects: ['Financial precision', 'Multi-currency complexity', 'Ratio calculations']
  },
  {
    id: 'legal-citations-complex',
    name: 'Legal Document - Complex Citations and Cross-References',
    description: 'Legal document with extensive citations, cross-references, and statutory amendments',
    category: 'Legal Citations',
    difficulty: 'Expert',
    complexity: {
      wordCount: 450,
      sentenceCount: 16,
      expectedChanges: 35,
      nestingDepth: 6
    },
    originalText: `Pursuant to Section 10(b) of the Securities Exchange Act of 1934, 15 U.S.C. § 78j(b), and Rule 10b-5 promulgated thereunder, 17 C.F.R. § 240.10b-5, the Company shall maintain disclosure controls and procedures as defined in Rules 13a-15(e) and 15d-15(e) under the Exchange Act.

The Company's obligations under the Sarbanes-Oxley Act of 2002, Pub. L. 107-204, 116 Stat. 745 (codified in scattered sections of 15 U.S.C.), specifically Section 302 (15 U.S.C. § 7241) and Section 404 (15 U.S.C. § 7262), require certification of financial statements and assessment of internal controls over financial reporting.

In accordance with the Dodd-Frank Wall Street Reform and Consumer Protection Act, Pub. L. 111-203, 124 Stat. 1376 (2010), particularly Section 951 (codified at 15 U.S.C. § 78n-1), the Company shall provide shareholders with advisory votes on executive compensation as required by Rule 14a-21 under the Exchange Act, 17 C.F.R. § 240.14a-21.

The Company must comply with Regulation FD, 17 C.F.R. §§ 243.100-243.103, which prohibits selective disclosure of material nonpublic information. Additionally, compliance with Regulation G, 17 C.F.R. §§ 244.100-244.102, is required for any non-GAAP financial measures disclosed publicly.

Reference is made to the Company's Form 10-K filed with the SEC on March 15, 2023 (File No. 001-12345), specifically Item 1A (Risk Factors) and Item 9A (Controls and Procedures), which are incorporated herein by reference pursuant to Item 12 of Form 8-K.`,
    revisedText: `Pursuant to Section 10(b) of the Securities Exchange Act of 1934, 15 U.S.C. § 78j(b), and Rule 10b-5 promulgated thereunder, 17 C.F.R. § 240.10b-5, the Company shall maintain disclosure controls and procedures as defined in Rules 13a-15(e) and 15d-15(e) under the Exchange Act, as amended by the FAST Act of 2015.

The Company's obligations under the Sarbanes-Oxley Act of 2002, Pub. L. 107-204, 116 Stat. 745 (codified in scattered sections of 15 U.S.C.), specifically Section 302 (15 U.S.C. § 7241), Section 404 (15 U.S.C. § 7262), and Section 906 (18 U.S.C. § 1350), require certification of financial statements, assessment of internal controls over financial reporting, and CEO/CFO certifications.

In accordance with the Dodd-Frank Wall Street Reform and Consumer Protection Act, Pub. L. 111-203, 124 Stat. 1376 (2010), particularly Section 951 (codified at 15 U.S.C. § 78n-1) and Section 953 (codified at 15 U.S.C. § 78n-2), the Company shall provide shareholders with advisory votes on executive compensation as required by Rule 14a-21 under the Exchange Act, 17 C.F.R. § 240.14a-21, and disclose CEO pay ratios.

The Company must comply with Regulation FD, 17 C.F.R. §§ 243.100-243.103, which prohibits selective disclosure of material nonpublic information. Additionally, compliance with Regulation G, 17 C.F.R. §§ 244.100-244.102, and Regulation S-K Item 10(e), 17 C.F.R. § 229.10(e), is required for any non-GAAP financial measures disclosed publicly.

Reference is made to the Company's Form 10-K filed with the SEC on March 28, 2024 (File No. 001-12345), specifically Item 1A (Risk Factors), Item 7 (MD&A), and Item 9A (Controls and Procedures), which are incorporated herein by reference pursuant to Item 12 of Form 8-K and Rule 12b-23 under the Exchange Act.`,
    expectedBehavior: {
      description: 'Should handle complex legal citations, USC references, CFR citations, and cross-references while maintaining legal formatting precision',
      criticalFeatures: ['Legal citation formatting', 'Cross-reference preservation', 'Statutory section additions', 'Date and filing number changes'],
      performanceExpectations: 'Should complete in 100-150ms despite citation complexity',
      edgeCases: ['Nested parenthetical citations', 'Multiple USC references', 'CFR section formatting', 'Form filing references']
    },
    stressTestAspects: ['Legal citation complexity', 'Cross-reference integrity', 'Statutory formatting']
  },
  {
    id: 'international-multi-jurisdiction',
    name: 'International Agreement - Multi-Jurisdictional Compliance',
    description: 'Complex international agreement with multiple jurisdictions and regulatory frameworks',
    category: 'International',
    difficulty: 'Extreme',
    complexity: {
      wordCount: 480,
      sentenceCount: 19,
      expectedChanges: 42,
      nestingDepth: 7
    },
    originalText: `This International Distribution Agreement ("Agreement") shall be governed by and construed in accordance with the laws of England and Wales, with disputes resolved through arbitration under the LCIA Arbitration Rules 2020 in London, England. The arbitration shall be conducted in English, with three arbitrators appointed in accordance with Article 5 of the LCIA Rules.

The Distributor shall comply with all applicable laws and regulations in the Territory, including but not limited to: (i) the General Data Protection Regulation (EU) 2016/679 ("GDPR") and the UK Data Protection Act 2018; (ii) the Consumer Rights Act 2015 (UK) and Consumer Protection from Unfair Trading Regulations 2008; (iii) the Competition Act 1998 (UK) and Articles 101 and 102 of the Treaty on the Functioning of the European Union; and (iv) applicable anti-bribery and corruption laws including the UK Bribery Act 2010 and the U.S. Foreign Corrupt Practices Act.

For operations in the European Union, the Distributor must maintain compliance with: (a) the Medical Device Regulation (EU) 2017/745 for medical device products; (b) the Machinery Directive 2006/42/EC for industrial equipment; (c) the RoHS Directive 2011/65/EU for electronic products; and (d) the REACH Regulation (EC) No 1907/2006 for chemical substances.

Tax obligations shall be governed by the applicable Double Taxation Treaties, specifically the UK-Germany Double Taxation Convention (2010), the UK-France Double Taxation Convention (2008), and the UK-Netherlands Double Taxation Convention (2008). Transfer pricing documentation must comply with OECD Guidelines and local country requirements.

Intellectual property protection shall be maintained through registrations under the Madrid Protocol, the Paris Convention, and applicable national laws. Patent protection shall be sought in accordance with the European Patent Convention and the Patent Cooperation Treaty.

Currency exchange rate fluctuations exceeding 5% in any 30-day period shall trigger renegotiation of pricing terms. All payments shall be made in GBP unless otherwise specified, with EUR and USD alternatives available for transactions exceeding £500,000.`,
    revisedText: `This International Distribution Agreement ("Agreement") shall be governed by and construed in accordance with the laws of Singapore, with disputes resolved through arbitration under the SIAC Arbitration Rules 2016 in Singapore. The arbitration shall be conducted in English, with a sole arbitrator for disputes under SGD 2,000,000 and three arbitrators for larger disputes, appointed in accordance with Rule 13 of the SIAC Rules.

The Distributor shall comply with all applicable laws and regulations in the Territory, including but not limited to: (i) the Personal Data Protection Act 2012 (Singapore) and applicable ASEAN data protection frameworks; (ii) the Consumer Protection (Fair Trading) Act (Singapore) and Competition Act (Singapore); (iii) the Competition Act (Singapore) and applicable ASEAN competition laws; and (iv) applicable anti-bribery and corruption laws including the Prevention of Corruption Act (Singapore) and the U.S. Foreign Corrupt Practices Act.

For operations in the Asia-Pacific region, the Distributor must maintain compliance with: (a) the Health Sciences Authority regulations for medical device products; (b) applicable machinery safety standards under SPRING Singapore; (c) the Environmental Protection and Management Act for electronic waste; and (d) the Environmental Public Health Act for chemical substances and hazardous materials.

Tax obligations shall be governed by the applicable Double Taxation Treaties, specifically the Singapore-Australia Double Taxation Agreement (2009), the Singapore-Japan Double Taxation Agreement (2019), and the Singapore-China Double Taxation Agreement (2009). Transfer pricing documentation must comply with OECD Guidelines and ASEAN Transfer Pricing Guidelines.

Intellectual property protection shall be maintained through registrations under the Madrid Protocol, the Paris Convention, WIPO treaties, and applicable national laws. Patent protection shall be sought in accordance with the Patent Cooperation Treaty and regional patent systems including ARIPO and OAPI.

Currency exchange rate fluctuations exceeding 3% in any 30-day period shall trigger renegotiation of pricing terms. All payments shall be made in SGD unless otherwise specified, with USD and EUR alternatives available for transactions exceeding SGD 750,000.`,
    expectedBehavior: {
      description: 'Should handle jurisdiction changes, regulatory framework substitutions, and international treaty references while maintaining legal precision',
      criticalFeatures: ['Jurisdiction substitutions', 'Regulatory framework changes', 'Treaty reference updates', 'Currency and threshold modifications'],
      performanceExpectations: 'Should complete in 150-200ms due to international complexity',
      edgeCases: ['Multi-jurisdictional references', 'Treaty citation formatting', 'Currency symbol handling', 'Regulatory code formatting']
    },
    stressTestAspects: ['International legal complexity', 'Multi-jurisdictional compliance', 'Regulatory framework mapping']
  },
  {
    id: 'technical-specifications-complex',
    name: 'Technical Specification - Precision Engineering Requirements',
    description: 'Detailed technical specifications with precise measurements and engineering tolerances',
    category: 'Technical',
    difficulty: 'Hard',
    complexity: {
      wordCount: 390,
      sentenceCount: 17,
      expectedChanges: 29,
      nestingDepth: 4
    },
    originalText: `The manufactured components shall conform to the following technical specifications: Housing dimensions of 127.5mm (±0.05mm) length × 89.2mm (±0.03mm) width × 34.7mm (±0.02mm) height, with surface finish Ra ≤ 0.8μm and flatness tolerance of 0.01mm across all mounting surfaces.

Material specifications require aerospace-grade aluminum alloy 7075-T6 with minimum tensile strength of 572 MPa, yield strength of 503 MPa, and elongation of 11%. The material must be certified to AMS 4045 and ASTM B209 standards, with full material traceability documentation.

Electrical specifications include: operating voltage range of 24VDC ±10%, maximum current consumption of 2.5A at full load, input impedance of 10kΩ ±5%, and operating temperature range of -40°C to +85°C with storage temperature range of -55°C to +125°C.

Environmental testing requirements per MIL-STD-810H: vibration testing per Method 514.7 (20Hz to 2000Hz, 1.0g RMS), shock testing per Method 516.7 (30g peak, 11ms duration), temperature cycling per Method 503.6 (100 cycles, -40°C to +85°C), and humidity testing per Method 507.6 (95% RH at 60°C for 240 hours).

Quality assurance requires 100% dimensional inspection using coordinate measuring machines (CMM) with accuracy of ±0.001mm, electrical testing at 100% production volume, and statistical process control (SPC) with Cpk ≥ 1.33 for all critical dimensions.

Packaging requirements specify anti-static bags rated for Class 1 ESD protection, foam inserts with compression set <10% after 22 hours at 70°C, and shipping containers rated for 2g acceleration in all axes during transport.`,
    revisedText: `The manufactured components shall conform to the following technical specifications: Housing dimensions of 152.4mm (±0.03mm) length × 101.6mm (±0.02mm) width × 38.1mm (±0.015mm) height, with surface finish Ra ≤ 0.6μm and flatness tolerance of 0.008mm across all mounting surfaces.

Material specifications require aerospace-grade aluminum alloy 7075-T651 with minimum tensile strength of 586 MPa, yield strength of 517 MPa, and elongation of 13%. The material must be certified to AMS 4045, ASTM B209, and AS9100 standards, with full material traceability documentation and DFARS compliance.

Electrical specifications include: operating voltage range of 28VDC ±8%, maximum current consumption of 3.2A at full load, input impedance of 12kΩ ±3%, and operating temperature range of -55°C to +95°C with storage temperature range of -65°C to +150°C.

Environmental testing requirements per MIL-STD-810H: vibration testing per Method 514.8 (5Hz to 2500Hz, 1.2g RMS), shock testing per Method 516.8 (40g peak, 6ms duration), temperature cycling per Method 503.7 (150 cycles, -55°C to +95°C), and humidity testing per Method 507.7 (98% RH at 65°C for 336 hours).

Quality assurance requires 100% dimensional inspection using coordinate measuring machines (CMM) with accuracy of ±0.0005mm, electrical testing at 100% production volume, and statistical process control (SPC) with Cpk ≥ 1.67 for all critical dimensions and Ppk ≥ 1.33 for all other dimensions.

Packaging requirements specify anti-static bags rated for Class 0 ESD protection, foam inserts with compression set <8% after 22 hours at 70°C, and shipping containers rated for 3g acceleration in all axes during transport with ISTA 3A certification.`,
    expectedBehavior: {
      description: 'Should handle precise technical measurements, engineering tolerances, and specification changes while maintaining decimal precision',
      criticalFeatures: ['Measurement precision', 'Engineering tolerances', 'Technical standard references', 'Specification updates'],
      performanceExpectations: 'Should complete in <100ms for technical precision',
      edgeCases: ['Decimal precision in measurements', 'Engineering notation', 'Standard reference formatting', 'Unit symbol placement']
    },
    stressTestAspects: ['Technical precision', 'Measurement accuracy', 'Engineering standard compliance']
  },
  {
    id: 'conditional-logic-complex',
    name: 'Contract - Complex Conditional Logic and Nested Clauses',
    description: 'Contract with deeply nested conditional clauses and complex logical structures',
    category: 'Conditional Logic',
    difficulty: 'Expert',
    complexity: {
      wordCount: 440,
      sentenceCount: 12,
      expectedChanges: 38,
      nestingDepth: 8
    },
    originalText: `If (i) the Company achieves EBITDA of at least $50 million for the fiscal year ending December 31, 2024, and (ii) the Company maintains a debt-to-equity ratio of no more than 2.5:1 throughout such fiscal year, and (iii) no Material Adverse Effect has occurred, then the Investor shall have the right (but not the obligation) to purchase additional shares equal to 15% of the Company's then-outstanding common stock at a price per share equal to the lesser of (A) 85% of the average closing price of the Company's common stock for the 30 trading days immediately preceding the exercise date, or (B) $45.00 per share, provided that such purchase right must be exercised within 90 days after the Company delivers audited financial statements for such fiscal year.

Notwithstanding the foregoing, if during the measurement period (x) the Company completes an acquisition with a purchase price exceeding $25 million, or (y) the Company issues debt securities with an aggregate principal amount exceeding $100 million, or (z) the Company declares or pays any dividend or distribution to shareholders (other than stock dividends), then the EBITDA threshold shall be increased to $65 million and the debt-to-equity ratio threshold shall be decreased to 2.0:1, unless (I) such acquisition is approved by at least 75% of the independent directors, and (II) the Company maintains minimum cash reserves of $20 million throughout the measurement period, and (III) the Company's credit rating from at least two nationally recognized statistical rating organizations remains at or above BB-.

Furthermore, in the event that the Company's stock price falls below $30.00 per share for 20 consecutive trading days during the measurement period, the purchase price shall be adjusted to the lesser of (1) 80% of the average closing price for the 45 trading days immediately preceding the exercise date, or (2) $40.00 per share, but only if the Company has not implemented a stock repurchase program of at least $10 million during such 20-day period.`,
    revisedText: `If (i) the Company achieves EBITDA of at least $75 million for the fiscal year ending December 31, 2024, and (ii) the Company maintains a debt-to-equity ratio of no more than 2.0:1 throughout such fiscal year, and (iii) no Material Adverse Effect has occurred, and (iv) the Company maintains minimum revenue growth of 15% year-over-year, then the Investor shall have the right (but not the obligation) to purchase additional shares equal to 20% of the Company's then-outstanding common stock at a price per share equal to the lesser of (A) 90% of the average closing price of the Company's common stock for the 45 trading days immediately preceding the exercise date, or (B) $52.50 per share, provided that such purchase right must be exercised within 120 days after the Company delivers audited financial statements for such fiscal year.

Notwithstanding the foregoing, if during the measurement period (x) the Company completes an acquisition with a purchase price exceeding $40 million, or (y) the Company issues debt securities with an aggregate principal amount exceeding $150 million, or (z) the Company declares or pays any dividend or distribution to shareholders (other than stock dividends or dividends not exceeding $0.25 per share), then the EBITDA threshold shall be increased to $90 million and the debt-to-equity ratio threshold shall be decreased to 1.75:1, unless (I) such acquisition is approved by at least 80% of the independent directors, and (II) the Company maintains minimum cash reserves of $35 million throughout the measurement period, and (III) the Company's credit rating from at least two nationally recognized statistical rating organizations remains at or above BB, and (IV) the Company has not violated any financial covenant under its existing credit facilities.

Furthermore, in the event that the Company's stock price falls below $35.00 per share for 15 consecutive trading days during the measurement period, the purchase price shall be adjusted to the lesser of (1) 85% of the average closing price for the 60 trading days immediately preceding the exercise date, or (2) $47.50 per share, but only if the Company has not implemented a stock repurchase program of at least $25 million during such 15-day period and has maintained its quarterly dividend payments.`,
    expectedBehavior: {
      description: 'Should handle deeply nested conditional logic, complex parenthetical structures, and multiple threshold changes while preserving logical flow',
      criticalFeatures: ['Nested conditional preservation', 'Parenthetical structure integrity', 'Threshold value changes', 'Logical operator handling'],
      performanceExpectations: 'Should complete in 100-150ms despite logical complexity',
      edgeCases: ['Deeply nested parentheses', 'Multiple conditional operators', 'Complex threshold comparisons', 'Logical flow preservation']
    },
    stressTestAspects: ['Conditional logic complexity', 'Nested structure integrity', 'Logical operator handling']
  },
  {
    id: 'document-structure-complex',
    name: 'Master Agreement - Complex Document Structure with Schedules',
    description: 'Master agreement with complex cross-references to schedules, exhibits, and attachments',
    category: 'Document Structure',
    difficulty: 'Hard',
    complexity: {
      wordCount: 410,
      sentenceCount: 16,
      expectedChanges: 31,
      nestingDepth: 5
    },
    originalText: `This Master Services Agreement ("Agreement") incorporates by reference the following schedules and exhibits: Schedule A (Statement of Work), Schedule B (Service Level Agreements), Schedule C (Pricing and Payment Terms), Schedule D (Data Security Requirements), Exhibit 1 (Technical Specifications), Exhibit 2 (Acceptance Criteria), Exhibit 3 (Change Control Procedures), and Exhibit 4 (Disaster Recovery Plan).

The services described in Schedule A shall be performed in accordance with the service levels set forth in Schedule B, with performance measured against the metrics defined in Section 3.2 of Schedule B and reported monthly as specified in Exhibit 2, Section 4.1. Any failure to meet the service levels shall result in service credits as calculated pursuant to the formula in Schedule C, Section 2.3.

Pricing for the services shall be as set forth in Schedule C, with invoicing procedures detailed in Schedule C, Section 1.4. Payment terms are Net 30 days from invoice date, with late payment charges of 1.5% per month as specified in Schedule C, Section 1.6. All pricing is subject to annual adjustment as provided in Schedule C, Section 3.1, based on the Consumer Price Index published by the Bureau of Labor Statistics.

The Contractor shall maintain data security measures as specified in Schedule D, including but not limited to the requirements set forth in Schedule D, Sections 2.1 through 2.8, and shall provide quarterly compliance reports as detailed in Schedule D, Section 4.2. Any security breach must be reported within 24 hours as required by Schedule D, Section 5.1.

Technical specifications for the deliverables are set forth in Exhibit 1, with acceptance testing procedures detailed in Exhibit 2, Sections 1.1 through 1.5. Any changes to the technical specifications must be processed through the change control procedures outlined in Exhibit 3, with approval required from both parties' technical representatives as identified in Exhibit 3, Section 2.2.

In the event of a disaster or business interruption, the parties shall follow the procedures set forth in Exhibit 4, including the recovery time objectives specified in Exhibit 4, Section 3.1, and the communication protocols detailed in Exhibit 4, Section 4.3.`,
    revisedText: `This Master Services Agreement ("Agreement") incorporates by reference the following schedules and exhibits: Schedule A (Statement of Work), Schedule B (Service Level Agreements), Schedule C (Pricing and Payment Terms), Schedule D (Data Security Requirements), Schedule E (Compliance and Regulatory Requirements), Exhibit 1 (Technical Specifications), Exhibit 2 (Acceptance Criteria), Exhibit 3 (Change Control Procedures), Exhibit 4 (Disaster Recovery Plan), and Exhibit 5 (Environmental and Sustainability Standards).

The services described in Schedule A shall be performed in accordance with the service levels set forth in Schedule B, with performance measured against the metrics defined in Section 3.2 and Section 3.4 of Schedule B and reported bi-weekly as specified in Exhibit 2, Section 4.1. Any failure to meet the service levels shall result in service credits as calculated pursuant to the formula in Schedule C, Section 2.3, with additional penalties as outlined in Schedule B, Section 5.2.

Pricing for the services shall be as set forth in Schedule C, with invoicing procedures detailed in Schedule C, Section 1.4. Payment terms are Net 45 days from invoice date, with late payment charges of 1.25% per month as specified in Schedule C, Section 1.6. All pricing is subject to semi-annual adjustment as provided in Schedule C, Section 3.1, based on the Consumer Price Index published by the Bureau of Labor Statistics and the Producer Price Index for relevant service categories.

The Contractor shall maintain data security measures as specified in Schedule D, including but not limited to the requirements set forth in Schedule D, Sections 2.1 through 2.12, and shall provide monthly compliance reports as detailed in Schedule D, Section 4.2. Any security breach must be reported within 12 hours as required by Schedule D, Section 5.1, with additional notification requirements per Schedule E, Section 3.4.

Technical specifications for the deliverables are set forth in Exhibit 1, with acceptance testing procedures detailed in Exhibit 2, Sections 1.1 through 1.8. Any changes to the technical specifications must be processed through the change control procedures outlined in Exhibit 3, with approval required from both parties' technical representatives and project managers as identified in Exhibit 3, Section 2.2 and Section 2.4.

In the event of a disaster or business interruption, the parties shall follow the procedures set forth in Exhibit 4, including the recovery time objectives specified in Exhibit 4, Section 3.1, the recovery point objectives in Exhibit 4, Section 3.2, and the communication protocols detailed in Exhibit 4, Section 4.3.`,
    expectedBehavior: {
      description: 'Should handle complex document cross-references, schedule additions, and section reference updates while maintaining document structure integrity',
      criticalFeatures: ['Cross-reference preservation', 'Schedule and exhibit additions', 'Section reference updates', 'Document structure maintenance'],
      performanceExpectations: 'Should complete in <100ms for document structure complexity',
      edgeCases: ['Multiple cross-references in single sentence', 'Nested section references', 'Schedule and exhibit formatting', 'Reference numbering consistency']
    },
    stressTestAspects: ['Document structure complexity', 'Cross-reference integrity', 'Schedule management']
  },
  {
    id: 'regulatory-compliance-matrix',
    name: 'Regulatory Compliance Matrix',
    description: 'Complex regulatory compliance requirements with multiple jurisdictions',
    category: 'Regulatory',
    difficulty: 'Expert',
    complexity: {
      wordCount: 460,
      sentenceCount: 18,
      expectedChanges: 41,
      nestingDepth: 6
    },
    originalText: `The Company shall maintain compliance with: (i) all applicable provisions of the Bank Secrecy Act (31 U.S.C. §§ 5311-5332) and implementing regulations (31 C.F.R. Chapter X); (ii) the USA PATRIOT Act (Pub. L. 107-56) and related anti-money laundering requirements; (iii) OFAC sanctions programs administered under 31 C.F.R. Parts 500-599; (iv) the Foreign Corrupt Practices Act (15 U.S.C. §§ 78dd-1, et seq.); (v) applicable data protection laws including GDPR (EU) 2016/679 for European operations; and (vi) SOX compliance requirements under Sections 302, 404, and 906 of the Sarbanes-Oxley Act.`,
    revisedText: `The Company shall maintain compliance with: (i) all applicable provisions of the Bank Secrecy Act (31 U.S.C. §§ 5311-5332) and implementing regulations (31 C.F.R. Chapter X); (ii) the USA PATRIOT Act (Pub. L. 107-56) and related anti-money laundering requirements; (iii) OFAC sanctions programs administered under 31 C.F.R. Parts 500-599; (iv) the Foreign Corrupt Practices Act (15 U.S.C. §§ 78dd-1, et seq.); (v) applicable data protection laws including GDPR (EU) 2016/679 for European operations and CCPA (Cal. Civ. Code § 1798.100 et seq.) for California operations; (vi) SOX compliance requirements under Sections 302, 404, and 906 of the Sarbanes-Oxley Act; and (vii) applicable provisions of the Dodd-Frank Act (Pub. L. 111-203) including Volcker Rule compliance.`,
    expectedBehavior: {
      description: 'Should handle regulatory requirement additions and modifications while preserving legal citation formatting',
      criticalFeatures: ['Regulatory citation formatting', 'Legal reference preservation', 'Compliance requirement additions', 'Statutory section formatting'],
      performanceExpectations: 'Should complete in 100-150ms due to regulatory complexity',
      edgeCases: ['Multiple USC references', 'CFR citation formatting', 'Public law references', 'State law citations']
    },
    stressTestAspects: ['Regulatory complexity', 'Legal citation integrity', 'Compliance framework mapping']
  },
  {
    id: 'mathematical-formulas-complex',
    name: 'Financial Model - Complex Mathematical Formulas',
    description: 'Financial agreement with complex mathematical formulas and calculations',
    category: 'Mathematical',
    difficulty: 'Extreme',
    complexity: {
      wordCount: 420,
      sentenceCount: 14,
      expectedChanges: 36,
      nestingDepth: 7
    },
    originalText: `The Performance Fee shall be calculated as follows: PF = max(0, 0.20 × (NAV_end - NAV_start - HWM) × S), where PF is the Performance Fee, NAV_end is the Net Asset Value at the end of the calculation period, NAV_start is the Net Asset Value at the beginning of the calculation period, HWM is the High Water Mark, and S is the number of shares outstanding.

The Hurdle Rate calculation shall be: HR = (1 + r)^(t/365) - 1, where r is the annual hurdle rate of 8.0%, and t is the number of days in the calculation period. The Performance Fee is only payable if the portfolio return exceeds the Hurdle Rate.

Risk-adjusted return shall be measured using the Sharpe Ratio: SR = (R_p - R_f) / σ_p, where R_p is the portfolio return, R_f is the risk-free rate (currently 2.5%), and σ_p is the standard deviation of portfolio returns calculated over a rolling 36-month period.

The Value at Risk (VaR) calculation shall use the parametric method: VaR = -μ + z_α × σ × √t, where μ is the expected return, z_α is the critical value at the 95% confidence level (1.645), σ is the volatility, and t is the time horizon in years. The portfolio VaR shall not exceed 3.0% of NAV on any given day.

Maximum Drawdown (MDD) shall be calculated as: MDD = max((Peak_i - Trough_j) / Peak_i) for all i ≤ j, where Peak_i is the highest NAV up to time i, and Trough_j is the lowest NAV from time i to time j. If MDD exceeds 15%, additional risk management procedures shall be implemented.`,
    revisedText: `The Performance Fee shall be calculated as follows: PF = max(0, 0.25 × (NAV_end - NAV_start - HWM) × S × CF), where PF is the Performance Fee, NAV_end is the Net Asset Value at the end of the calculation period, NAV_start is the Net Asset Value at the beginning of the calculation period, HWM is the High Water Mark, S is the number of shares outstanding, and CF is the Crystallization Factor (0.85 for partial crystallization).

The Hurdle Rate calculation shall be: HR = (1 + r)^(t/365) - 1, where r is the annual hurdle rate of 6.5%, and t is the number of days in the calculation period. The Performance Fee is only payable if the portfolio return exceeds the Hurdle Rate plus a margin of 1.5%.

Risk-adjusted return shall be measured using the Information Ratio: IR = (R_p - R_b) / TE, where R_p is the portfolio return, R_b is the benchmark return, and TE is the tracking error calculated as the standard deviation of (R_p - R_b) over a rolling 24-month period.

The Value at Risk (VaR) calculation shall use the Monte Carlo simulation method with 10,000 iterations: VaR = -Percentile(Simulated_Returns, 1-α), where α is the confidence level of 99% (z_α = 2.326), and the portfolio VaR shall not exceed 2.5% of NAV on any given day, with stress testing at 99.5% confidence level.

Maximum Drawdown (MDD) shall be calculated as: MDD = max((Peak_i - Trough_j) / Peak_i) for all i ≤ j, where Peak_i is the highest NAV up to time i, and Trough_j is the lowest NAV from time i to time j. If MDD exceeds 12%, mandatory risk reduction procedures shall be implemented, and if MDD exceeds 18%, investor notification is required within 24 hours.`,
    expectedBehavior: {
      description: 'Should handle complex mathematical formulas, variable definitions, and calculation modifications while preserving mathematical notation',
      criticalFeatures: ['Mathematical formula preservation', 'Variable definition handling', 'Calculation parameter changes', 'Mathematical notation integrity'],
      performanceExpectations: 'Should complete in 150-200ms due to mathematical complexity',
      edgeCases: ['Mathematical notation formatting', 'Variable subscript handling', 'Formula structure preservation', 'Percentage and decimal precision']
    },
    stressTestAspects: ['Mathematical formula complexity', 'Variable definition integrity', 'Calculation precision']
  }
];

interface AdvancedTestSuiteProps {
  onLoadTest: (originalText: string, revisedText: string) => void;
}

export const AdvancedTestSuite: React.FC<AdvancedTestSuiteProps> = ({ onLoadTest }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(ADVANCED_TEST_CASES.map(test => test.category)))];
  const difficulties = ['All', 'Hard', 'Expert', 'Extreme'];

  const filteredTests = ADVANCED_TEST_CASES.filter(test => {
    const categoryMatch = selectedCategory === 'All' || test.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'All' || test.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Hard': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Expert': return 'bg-red-100 text-red-800 border-red-200';
      case 'Extreme': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-teal-100 text-teal-800',
      'bg-cyan-100 text-cyan-800',
      'bg-lime-100 text-lime-800',
      'bg-amber-100 text-amber-800',
      'bg-violet-100 text-violet-800'
    ];
    const index = Math.abs(category.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg overflow-hidden mb-6">
      <div 
        className="bg-gradient-to-r from-purple-100 to-indigo-100 border-b-2 border-purple-200 p-4 cursor-pointer hover:from-purple-200 hover:to-indigo-200 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-purple-700" />
            ) : (
              <ChevronRight className="w-5 h-5 text-purple-700" />
            )}
            <Target className="w-6 h-6 text-purple-700" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-purple-900">Advanced Test Suite</h3>
                <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-semibold rounded-full">
                  TESTING MODULE
                </span>
              </div>
              <p className="text-sm text-purple-800">
                10 challenging test cases designed to stress-test the algorithm with complex legal document patterns
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-purple-700">
                <span>• Hard to Extreme difficulty levels</span>
                <span>• 380-480 words per test</span>
                <span>• 28-42 expected changes</span>
                <span>• Advanced legal structures</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-semibold text-purple-800">
                {ADVANCED_TEST_CASES.length} Advanced Tests
              </div>
              <div className="text-xs text-purple-600">
                Avg: {Math.round(ADVANCED_TEST_CASES.reduce((sum, test) => sum + test.complexity.wordCount, 0) / ADVANCED_TEST_CASES.length)} words
              </div>
            </div>
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 bg-white">
          {/* Filters */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">Filter by Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-300'
                      }`}
                    >
                      {category}
                      {category !== 'All' && (
                        <span className="ml-1 text-xs opacity-75">
                          ({ADVANCED_TEST_CASES.filter(t => t.category === category).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">Filter by Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        selectedDifficulty === difficulty
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-300'
                      }`}
                    >
                      {difficulty}
                      {difficulty !== 'All' && (
                        <span className="ml-1 text-xs opacity-75">
                          ({ADVANCED_TEST_CASES.filter(t => t.difficulty === difficulty).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTests.map((testCase) => (
              <div key={testCase.id} className="border-2 border-purple-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-purple-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-purple-900 text-lg">{testCase.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(testCase.category)}`}>
                        {testCase.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(testCase.difficulty)}`}>
                        {testCase.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">{testCase.description}</p>
                    
                    {/* Complexity Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                      <div className="bg-purple-100 p-2 rounded border border-purple-200">
                        <div className="font-semibold text-purple-800">Words</div>
                        <div className="text-purple-700">{testCase.complexity.wordCount.toLocaleString()}</div>
                      </div>
                      <div className="bg-purple-100 p-2 rounded border border-purple-200">
                        <div className="font-semibold text-purple-800">Expected Changes</div>
                        <div className="text-purple-700">{testCase.complexity.expectedChanges}</div>
                      </div>
                    </div>

                    {/* Expected Behavior */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-purple-800 mb-1">Expected Behavior:</div>
                      <div className="text-xs text-gray-600 mb-2">{testCase.expectedBehavior.description}</div>
                      <div className="text-xs text-gray-500">
                        <strong>Performance:</strong> {testCase.expectedBehavior.performanceExpectations}
                      </div>
                    </div>

                    {/* Critical Features */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-purple-800 mb-1">Critical Features:</div>
                      <div className="flex flex-wrap gap-1">
                        {testCase.expectedBehavior.criticalFeatures.slice(0, 3).map((feature, index) => (
                          <span key={index} className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                            {feature}
                          </span>
                        ))}
                        {testCase.expectedBehavior.criticalFeatures.length > 3 && (
                          <span className="text-xs text-purple-600">
                            +{testCase.expectedBehavior.criticalFeatures.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onLoadTest(testCase.originalText, testCase.revisedText)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium"
                  >
                    Load Test Case
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTests.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-600 font-medium">No tests match the selected filters</p>
              <p className="text-purple-500 text-sm">Try adjusting your category or difficulty filters</p>
            </div>
          )}

          {/* Test Suite Summary */}
          {filteredTests.length > 0 && (
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Advanced Test Suite Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-purple-700 font-medium">Filtered Tests</div>
                  <div className="text-2xl font-bold text-purple-900">{filteredTests.length}</div>
                </div>
                <div>
                  <div className="text-purple-700 font-medium">Avg Word Count</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {Math.round(filteredTests.reduce((sum, t) => sum + t.complexity.wordCount, 0) / filteredTests.length)}
                  </div>
                </div>
                <div>
                  <div className="text-purple-700 font-medium">Avg Expected Changes</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {Math.round(filteredTests.reduce((sum, t) => sum + t.complexity.expectedChanges, 0) / filteredTests.length)}
                  </div>
                </div>
                <div>
                  <div className="text-purple-700 font-medium">Max Nesting Depth</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {Math.max(...filteredTests.map(t => t.complexity.nestingDepth))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};