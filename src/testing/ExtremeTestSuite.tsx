import React, { useState } from 'react';
import { Play, ChevronDown, ChevronRight, Zap, CheckCircle, XCircle, AlertTriangle, Flame, Clock, TrendingUp } from 'lucide-react';
import { MyersAlgorithm } from '../algorithms/MyersAlgorithm';
import { ComparisonResult } from '../types';

interface ExtremeTestCase {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Extreme' | 'Ultra' | 'Nightmare';
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

const EXTREME_TEST_CASES: ExtremeTestCase[] = [
  {
    id: 'mega-merger-agreement',
    name: 'Mega-Merger Agreement with Complex Conditions',
    description: 'Massive merger agreement with multiple parties, complex conditions, and extensive cross-references',
    category: 'M&A Transactions',
    difficulty: 'Ultra',
    complexity: {
      wordCount: 850,
      sentenceCount: 12,
      expectedChanges: 45,
      nestingDepth: 6
    },
    originalText: `This Agreement and Plan of Merger ("Agreement") is entered into as of December 15, 2023, among TechCorp International Inc., a Delaware corporation ("Parent"), TechCorp Acquisition Sub Inc., a Delaware corporation and wholly owned subsidiary of Parent ("Merger Sub"), and InnovateTech Solutions LLC, a Delaware limited liability company ("Company"), and the Members of the Company listed on Schedule A hereto (the "Members"). WHEREAS, the Board of Directors of Parent (the "Parent Board"), at a meeting duly called and held on December 10, 2023, has (i) determined that this Agreement and the transactions contemplated hereby, including the merger of Merger Sub with and into the Company (the "Merger"), with the Company surviving as a wholly owned subsidiary of Parent, are advisable and in the best interests of Parent and its stockholders, (ii) approved this Agreement and the transactions contemplated hereby, and (iii) resolved to recommend that the stockholders of Parent approve the issuance of shares of Parent Common Stock to the Members pursuant to this Agreement; and WHEREAS, the Members, holding not less than 75% of the outstanding Membership Interests of the Company, have executed and delivered to Parent written consents approving this Agreement and the transactions contemplated hereby. NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows: 1. THE MERGER. Subject to the terms and conditions of this Agreement and in accordance with the Delaware General Corporation Law (the "DGCL") and the Delaware Limited Liability Company Act (the "DLLCA"), at the Effective Time (as defined below), Merger Sub shall be merged with and into the Company, whereupon the separate existence of Merger Sub shall cease, and the Company shall continue as the surviving entity (the "Surviving Company") and as a wholly owned subsidiary of Parent. 2. CLOSING CONDITIONS. The obligations of each party to consummate the Merger are subject to the satisfaction or waiver (where permissible) of the following conditions: (a) no Governmental Entity shall have enacted, issued, promulgated, enforced or entered any Law or Order (whether temporary, preliminary or permanent) that is in effect and restrains, enjoins or otherwise prohibits consummation of the Merger; (b) all waiting periods (and any extensions thereof) applicable to the consummation of the Merger under the Hart-Scott-Rodino Antitrust Improvements Act of 1976, as amended (the "HSR Act"), shall have expired or been terminated; (c) Parent shall have received all required approvals from its stockholders for the issuance of Parent Common Stock pursuant to this Agreement; (d) the Company shall have received all required consents from its Members; (e) the representations and warranties of each party contained in this Agreement shall be true and correct in all material respects (or, in the case of representations and warranties qualified by materiality or Material Adverse Effect, true and correct in all respects) as of the date of this Agreement and as of the Closing Date as though made on and as of the Closing Date (except to the extent such representations and warranties expressly relate to an earlier date, in which case as of such earlier date); (f) each party shall have performed in all material respects all obligations and covenants required to be performed by it under this Agreement at or prior to the Closing; and (g) since the date of this Agreement, there shall not have occurred any Material Adverse Effect with respect to the Company. 3. PURCHASE PRICE. In consideration for the Merger, at the Effective Time, each outstanding Membership Interest of the Company shall be converted into the right to receive (i) $12.50 in cash (the "Cash Consideration") and (ii) 0.75 shares of Parent Common Stock (the "Stock Consideration"), subject to adjustment as provided in Section 3.2 hereof. The aggregate consideration payable to the Members shall not exceed $500,000,000 in cash and 15,000,000 shares of Parent Common Stock.`,
    revisedText: `This Agreement and Plan of Merger ("Agreement") is entered into as of January 20, 2024, among TechCorp Global Holdings Inc., a Delaware corporation ("Parent"), TechCorp Acquisition Sub LLC, a Delaware limited liability company and wholly owned subsidiary of Parent ("Merger Sub"), and InnovateTech Solutions LLC, a Delaware limited liability company ("Company"), and the Members of the Company listed on Schedule A hereto (the "Members"). WHEREAS, the Board of Directors of Parent (the "Parent Board"), at a meeting duly called and held on January 15, 2024, has (i) determined that this Agreement and the transactions contemplated hereby, including the merger of Merger Sub with and into the Company (the "Merger"), with the Company surviving as a wholly owned subsidiary of Parent, are advisable and in the best interests of Parent and its stockholders, (ii) approved this Agreement and the transactions contemplated hereby, and (iii) resolved to recommend that the stockholders of Parent approve the issuance of shares of Parent Common Stock to the Members pursuant to this Agreement; and WHEREAS, the Members, holding not less than 80% of the outstanding Membership Interests of the Company, have executed and delivered to Parent written consents approving this Agreement and the transactions contemplated hereby. NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows: 1. THE MERGER. Subject to the terms and conditions of this Agreement and in accordance with the Delaware General Corporation Law (the "DGCL") and the Delaware Limited Liability Company Act (the "DLLCA"), at the Effective Time (as defined below), Merger Sub shall be merged with and into the Company, whereupon the separate existence of Merger Sub shall cease, and the Company shall continue as the surviving entity (the "Surviving Company") and as a wholly owned subsidiary of Parent. 2. CLOSING CONDITIONS. The obligations of each party to consummate the Merger are subject to the satisfaction or waiver (where permissible) of the following conditions: (a) no Governmental Entity shall have enacted, issued, promulgated, enforced or entered any Law or Order (whether temporary, preliminary or permanent) that is in effect and restrains, enjoins or otherwise prohibits consummation of the Merger; (b) all waiting periods (and any extensions thereof) applicable to the consummation of the Merger under the Hart-Scott-Rodino Antitrust Improvements Act of 1976, as amended (the "HSR Act"), shall have expired or been terminated; (c) Parent shall have received all required approvals from its stockholders for the issuance of Parent Common Stock pursuant to this Agreement; (d) the Company shall have received all required consents from its Members; (e) the representations and warranties of each party contained in this Agreement shall be true and correct in all material respects (or, in the case of representations and warranties qualified by materiality or Material Adverse Effect, true and correct in all respects) as of the date of this Agreement and as of the Closing Date as though made on and as of the Closing Date (except to the extent such representations and warranties expressly relate to an earlier date, in which case as of such earlier date); (f) each party shall have performed in all material respects all obligations and covenants required to be performed by it under this Agreement at or prior to the Closing; and (g) since the date of this Agreement, there shall not have occurred any Material Adverse Effect with respect to the Company. 3. PURCHASE PRICE. In consideration for the Merger, at the Effective Time, each outstanding Membership Interest of the Company shall be converted into the right to receive (i) $15.00 in cash (the "Cash Consideration") and (ii) 0.85 shares of Parent Common Stock (the "Stock Consideration"), subject to adjustment as provided in Section 3.2 hereof. The aggregate consideration payable to the Members shall not exceed $750,000,000 in cash and 20,000,000 shares of Parent Common Stock.`,
    expectedBehavior: {
      description: 'Should handle massive document with multiple entity changes, date updates, percentage modifications, and financial term adjustments while preserving complex legal structure',
      criticalFeatures: [
        'Entity name changes (TechCorp International→Global Holdings)',
        'Entity type changes (Inc.→LLC for Merger Sub)',
        'Date substitutions throughout document',
        'Percentage threshold changes (75%→80%)',
        'Financial consideration adjustments'
      ],
      performanceExpectations: 'Should complete in under 200ms despite document complexity',
      edgeCases: [
        'Multiple entity references with different changes',
        'Complex nested parenthetical structures',
        'Mixed financial and percentage substitutions',
        'Long legal clauses with multiple conditions'
      ]
    },
    stressTestAspects: [
      'Very long document processing',
      'Multiple simultaneous entity changes',
      'Complex legal clause structures',
      'Mixed numerical and textual substitutions',
      'Nested parenthetical references',
      'Cross-reference preservation'
    ]
  },
  {
    id: 'international-joint-venture',
    name: 'International Joint Venture with Multi-Jurisdictional Compliance',
    description: 'Complex international joint venture agreement spanning multiple jurisdictions with extensive regulatory compliance requirements',
    category: 'International Joint Ventures',
    difficulty: 'Nightmare',
    complexity: {
      wordCount: 920,
      sentenceCount: 15,
      expectedChanges: 55,
      nestingDepth: 7
    },
    originalText: `This International Joint Venture Agreement ("Agreement") is entered into as of March 1, 2024, among TechVentures USA Inc., a Delaware corporation with its principal place of business at 1234 Technology Drive, Suite 500, San Francisco, California 94105, United States ("US Party"), TechVentures Europe B.V., a private company with limited liability (besloten vennootschap met beperkte aansprakelijkheid) organized under the laws of the Netherlands, with its registered office at Strawinskylaan 3127, 1077 ZX Amsterdam, The Netherlands, registered with the Dutch Chamber of Commerce under number 12345678 ("European Party"), and TechVentures Asia Pte. Ltd., a private company limited by shares incorporated under the laws of Singapore, with its registered office at 1 Raffles Place, #40-02 One Raffles Place, Singapore 048616, company registration number 201234567M ("Asian Party") (each a "Party" and collectively the "Parties"). WHEREAS, each Party desires to establish a joint venture company (the "JV Company") to develop, manufacture, and distribute advanced semiconductor technologies in the global market; and WHEREAS, the Parties have agreed to contribute certain assets, intellectual property, and expertise to the JV Company in accordance with the terms set forth herein; and WHEREAS, the Parties intend that the JV Company shall be subject to the regulatory oversight of multiple jurisdictions including but not limited to: (i) the Securities and Exchange Commission and the Committee on Foreign Investment in the United States (CFIUS) in the United States; (ii) the European Securities and Markets Authority (ESMA) and national competent authorities under the Markets in Financial Instruments Directive II (MiFID II) in the European Union; (iii) the Monetary Authority of Singapore (MAS) and the Competition and Consumer Commission of Singapore (CCCS) in Singapore; (iv) the China Securities Regulatory Commission (CSRC) and the State Administration for Market Regulation (SAMR) in the People's Republic of China; and (v) the Financial Services Agency (FSA) and the Japan Fair Trade Commission (JFTC) in Japan. NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the Parties agree as follows: 1. FORMATION OF JOINT VENTURE. The Parties shall establish the JV Company as a private company limited by shares under the laws of Singapore, with an initial authorized share capital of SGD 100,000,000 divided into 100,000,000 ordinary shares of SGD 1.00 each. The JV Company shall be named "Global Semiconductor Technologies Pte. Ltd." and shall have its registered office in Singapore. 2. CAPITAL CONTRIBUTIONS. The initial capital contributions of the Parties shall be as follows: (a) US Party shall contribute USD 50,000,000 in cash and certain intellectual property rights valued at USD 25,000,000, for a total contribution of USD 75,000,000, representing a 37.5% equity interest in the JV Company; (b) European Party shall contribute EUR 40,000,000 in cash (equivalent to approximately USD 43,200,000 at the exchange rate of 1.08 USD/EUR as of the date hereof) and manufacturing facilities in Germany valued at EUR 20,000,000 (equivalent to approximately USD 21,600,000), for a total contribution equivalent to USD 64,800,000, representing a 32.4% equity interest in the JV Company; and (c) Asian Party shall contribute SGD 45,000,000 in cash (equivalent to approximately USD 33,750,000 at the exchange rate of 0.75 USD/SGD as of the date hereof) and distribution networks in Southeast Asia valued at SGD 20,000,000 (equivalent to approximately USD 15,000,000), for a total contribution equivalent to USD 48,750,000, representing a 24.375% equity interest in the JV Company, with the remaining 5.625% to be held in reserve for future strategic investors. 3. GOVERNANCE STRUCTURE. The JV Company shall be governed by a Board of Directors consisting of seven (7) members: (a) US Party shall have the right to appoint three (3) directors; (b) European Party shall have the right to appoint two (2) directors; (c) Asian Party shall have the right to appoint two (2) directors; and (d) certain decisions requiring unanimous consent of all directors including but not limited to: (i) approval of annual budgets exceeding SGD 50,000,000; (ii) entry into material contracts with a value exceeding SGD 10,000,000; (iii) acquisition or disposal of assets with a value exceeding SGD 25,000,000; (iv) incurrence of indebtedness exceeding SGD 15,000,000; and (v) amendments to the constitutional documents of the JV Company. 4. REGULATORY COMPLIANCE. Each Party acknowledges and agrees that the JV Company and its operations shall be subject to extensive regulatory requirements in multiple jurisdictions, and each Party shall cooperate fully in ensuring compliance with all applicable laws and regulations, including but not limited to export control laws (including the Export Administration Regulations of the United States, Council Regulation (EC) No 428/2009 of the European Union, and the Strategic Goods (Control) Act of Singapore), anti-money laundering laws, data protection regulations (including the General Data Protection Regulation (EU) 2016/679 and the Personal Data Protection Act 2012 of Singapore), and competition laws in each relevant jurisdiction.`,
    revisedText: `This International Joint Venture Agreement ("Agreement") is entered into as of April 15, 2024, among TechVentures USA LLC, a Delaware limited liability company with its principal place of business at 5678 Innovation Boulevard, Suite 800, Austin, Texas 78701, United States ("US Party"), TechVentures Europe S.A., a public limited company (société anonyme) organized under the laws of Luxembourg, with its registered office at 2-4 Rue Eugène Ruppert, L-2453 Luxembourg, Luxembourg, registered with the Luxembourg Register of Commerce and Companies under number B123456 ("European Party"), and TechVentures Asia Holdings Ltd., a company incorporated under the laws of Hong Kong, with its registered office at 45/F, Two International Finance Centre, 8 Finance Street, Central, Hong Kong, company registration number 1234567 ("Asian Party") (each a "Party" and collectively the "Parties"). WHEREAS, each Party desires to establish a joint venture company (the "JV Company") to develop, manufacture, and distribute advanced quantum computing technologies in the global market; and WHEREAS, the Parties have agreed to contribute certain assets, intellectual property, and expertise to the JV Company in accordance with the terms set forth herein; and WHEREAS, the Parties intend that the JV Company shall be subject to the regulatory oversight of multiple jurisdictions including but not limited to: (i) the Securities and Exchange Commission and the Committee on Foreign Investment in the United States (CFIUS) in the United States; (ii) the European Securities and Markets Authority (ESMA) and national competent authorities under the Markets in Financial Instruments Directive II (MiFID II) in the European Union; (iii) the Securities and Futures Commission (SFC) and the Competition Commission in Hong Kong; (iv) the China Securities Regulatory Commission (CSRC) and the State Administration for Market Regulation (SAMR) in the People's Republic of China; and (v) the Financial Services Agency (FSA) and the Japan Fair Trade Commission (JFTC) in Japan. NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the Parties agree as follows: 1. FORMATION OF JOINT VENTURE. The Parties shall establish the JV Company as a company limited by shares under the laws of Hong Kong, with an initial authorized share capital of HKD 800,000,000 divided into 800,000,000 ordinary shares of HKD 1.00 each. The JV Company shall be named "Global Quantum Technologies Limited" and shall have its registered office in Hong Kong. 2. CAPITAL CONTRIBUTIONS. The initial capital contributions of the Parties shall be as follows: (a) US Party shall contribute USD 75,000,000 in cash and certain intellectual property rights valued at USD 35,000,000, for a total contribution of USD 110,000,000, representing a 40% equity interest in the JV Company; (b) European Party shall contribute EUR 50,000,000 in cash (equivalent to approximately USD 54,000,000 at the exchange rate of 1.08 USD/EUR as of the date hereof) and manufacturing facilities in Luxembourg valued at EUR 25,000,000 (equivalent to approximately USD 27,000,000), for a total contribution equivalent to USD 81,000,000, representing a 35% equity interest in the JV Company; and (c) Asian Party shall contribute HKD 200,000,000 in cash (equivalent to approximately USD 25,600,000 at the exchange rate of 0.128 USD/HKD as of the date hereof) and distribution networks in Asia-Pacific valued at HKD 150,000,000 (equivalent to approximately USD 19,200,000), for a total contribution equivalent to USD 44,800,000, representing a 20% equity interest in the JV Company, with the remaining 5% to be held in reserve for employee stock option plans. 3. GOVERNANCE STRUCTURE. The JV Company shall be governed by a Board of Directors consisting of nine (9) members: (a) US Party shall have the right to appoint four (4) directors; (b) European Party shall have the right to appoint three (3) directors; (c) Asian Party shall have the right to appoint two (2) directors; and (d) certain decisions requiring unanimous consent of all directors including but not limited to: (i) approval of annual budgets exceeding HKD 400,000,000; (ii) entry into material contracts with a value exceeding HKD 80,000,000; (iii) acquisition or disposal of assets with a value exceeding HKD 200,000,000; (iv) incurrence of indebtedness exceeding HKD 120,000,000; and (v) amendments to the constitutional documents of the JV Company. 4. REGULATORY COMPLIANCE. Each Party acknowledges and agrees that the JV Company and its operations shall be subject to extensive regulatory requirements in multiple jurisdictions, and each Party shall cooperate fully in ensuring compliance with all applicable laws and regulations, including but not limited to export control laws (including the Export Administration Regulations of the United States, Council Regulation (EC) No 428/2009 of the European Union, and the Import and Export Ordinance of Hong Kong), anti-money laundering laws, data protection regulations (including the General Data Protection Regulation (EU) 2016/679 and the Personal Data (Privacy) Ordinance of Hong Kong), and competition laws in each relevant jurisdiction.`,
    expectedBehavior: {
      description: 'Should handle massive international document with complete jurisdiction changes, entity transformations, currency conversions, and regulatory framework updates',
      criticalFeatures: [
        'Complete jurisdiction changes (Singapore→Hong Kong, Netherlands→Luxembourg)',
        'Entity type transformations (Inc.→LLC, B.V.→S.A., Pte. Ltd.→Holdings Ltd.)',
        'Technology focus change (semiconductor→quantum computing)',
        'Currency and amount substitutions across multiple currencies',
        'Regulatory authority updates for new jurisdictions'
      ],
      performanceExpectations: 'Should complete in under 250ms despite extreme complexity',
      edgeCases: [
        'Multiple currency conversions with exchange rates',
        'Complex entity type changes across jurisdictions',
        'Regulatory authority substitutions',
        'Mixed address format changes',
        'Percentage and numerical threshold updates'
      ]
    },
    stressTestAspects: [
      'Extremely long document with complex structure',
      'Multiple simultaneous jurisdiction changes',
      'Complex financial calculations across currencies',
      'Regulatory framework substitutions',
      'Mixed entity type transformations',
      'International address format changes',
      'Cross-jurisdictional legal terminology'
    ]
  },
  {
    id: 'complex-derivatives-agreement',
    name: 'Complex Financial Derivatives Master Agreement',
    description: 'Comprehensive derivatives trading agreement with complex mathematical formulas and risk management provisions',
    category: 'Financial Derivatives',
    difficulty: 'Ultra',
    complexity: {
      wordCount: 780,
      sentenceCount: 11,
      expectedChanges: 40,
      nestingDepth: 5
    },
    originalText: `This ISDA Master Agreement (Multicurrency-Cross Border) ("Agreement") is entered into as of February 14, 2024, between Goldman Sachs International, a company incorporated in England and Wales with company number 2263951 and having its registered office at Plumtree Court, 25 Shoe Lane, London EC4A 4AU, United Kingdom, acting through its London branch ("Party A"), and TechCorp Financial Services Ltd., a company incorporated under the laws of the Cayman Islands with company number MC-123456 and having its registered office at c/o Maples Corporate Services Limited, PO Box 309, Ugland House, Grand Cayman KY1-1104, Cayman Islands ("Party B"). This Agreement governs all Transactions entered into between the parties on or after the date hereof, including but not limited to interest rate swaps, currency swaps, credit default swaps, equity swaps, commodity swaps, and other derivative transactions as may be agreed upon by the parties from time to time. The parties acknowledge that all Transactions shall be subject to the following calculation methodologies and risk management provisions: 1. INTEREST RATE CALCULATIONS. For all interest rate derivative Transactions, the floating rate shall be calculated based on the following formula: Floating Rate = Reference Rate + Spread, where (a) Reference Rate shall be the London Interbank Offered Rate (LIBOR) for the relevant currency and tenor as published by ICE Benchmark Administration Limited at 11:00 AM London time on each Rate Setting Date, provided that if LIBOR is unavailable or discontinued, the Reference Rate shall be the applicable fallback rate as determined in accordance with the ISDA 2020 IBOR Fallbacks Protocol; (b) Spread shall be 125 basis points for USD transactions, 150 basis points for EUR transactions, 175 basis points for GBP transactions, and 200 basis points for JPY transactions; and (c) the calculation shall be performed using the Actual/360 day count convention for USD, EUR, and JPY transactions, and the Actual/365 day count convention for GBP transactions. 2. CREDIT RISK MITIGATION. The parties agree to the following credit support arrangements: (a) Party A shall post initial margin equal to 8% of the notional amount of all outstanding Transactions, with a minimum threshold of USD 5,000,000 and a minimum transfer amount of USD 500,000; (b) Party B shall post initial margin equal to 12% of the notional amount of all outstanding Transactions, with a minimum threshold of USD 2,000,000 and a minimum transfer amount of USD 250,000; (c) variation margin shall be calculated daily based on the mark-to-market value of all outstanding Transactions using the following formula: VM = Σ(MTM_i × Notional_i) - Previous VM, where MTM_i represents the mark-to-market value per unit notional for Transaction i; and (d) all margin calculations shall be performed using the Standard Initial Margin Model (SIMM) methodology as published by ISDA, with a confidence level of 99% and a holding period of 10 business days. 3. NETTING AND CLOSE-OUT PROVISIONS. Upon the occurrence of an Event of Default or Termination Event, the non-defaulting party may designate an Early Termination Date and calculate the Close-out Amount using the following methodology: Close-out Amount = Σ(Replacement Cost_i + Legal Costs + Administrative Costs), where Replacement Cost for each Transaction shall be determined by obtaining quotations from at least three (3) Reference Market-makers for the cost of entering into replacement transactions with substantially equivalent economic terms, provided that if fewer than three quotations are available, the Close-out Amount may be determined using the non-defaulting party's internal valuation models, subject to the requirement that such models be consistent with prevailing market standards and practices. 4. GOVERNING LAW AND DISPUTE RESOLUTION. This Agreement shall be governed by and construed in accordance with English law. Any dispute arising out of or in connection with this Agreement, including any question regarding its existence, validity, or termination, shall be referred to and finally resolved by arbitration under the Rules of the London Court of International Arbitration (LCIA), which Rules are deemed to be incorporated by reference into this clause. The number of arbitrators shall be three (3), with each party appointing one arbitrator and the third arbitrator (who shall act as chairman) being appointed by the two party-appointed arbitrators. The seat of arbitration shall be London, England, and the language of the arbitration shall be English.`,
    revisedText: `This ISDA Master Agreement (Multicurrency-Cross Border) ("Agreement") is entered into as of March 20, 2024, between J.P. Morgan Securities plc, a company incorporated in England and Wales with company number 3065357 and having its registered office at 25 Bank Street, Canary Wharf, London E14 5JP, United Kingdom, acting through its London branch ("Party A"), and TechCorp Financial Holdings Ltd., a company incorporated under the laws of the British Virgin Islands with company number BVI-789012 and having its registered office at c/o Trident Trust Company (BVI) Limited, Trident Chambers, P.O. Box 146, Road Town, Tortola VG1110, British Virgin Islands ("Party B"). This Agreement governs all Transactions entered into between the parties on or after the date hereof, including but not limited to interest rate swaps, currency swaps, credit default swaps, equity swaps, commodity swaps, and other derivative transactions as may be agreed upon by the parties from time to time. The parties acknowledge that all Transactions shall be subject to the following calculation methodologies and risk management provisions: 1. INTEREST RATE CALCULATIONS. For all interest rate derivative Transactions, the floating rate shall be calculated based on the following formula: Floating Rate = Reference Rate + Spread, where (a) Reference Rate shall be the Secured Overnight Financing Rate (SOFR) for USD transactions, the Euro Short-Term Rate (€STR) for EUR transactions, the Sterling Overnight Index Average (SONIA) for GBP transactions, and the Tokyo Overnight Average Rate (TONAR) for JPY transactions, as published by the respective central banks at 9:00 AM local time on each Rate Setting Date, provided that if any such rate is unavailable or discontinued, the Reference Rate shall be the applicable fallback rate as determined in accordance with the ISDA 2021 Interest Rate Benchmark Reform Protocol; (b) Spread shall be 150 basis points for USD transactions, 175 basis points for EUR transactions, 200 basis points for GBP transactions, and 225 basis points for JPY transactions; and (c) the calculation shall be performed using the Actual/360 day count convention for USD, EUR, and JPY transactions, and the Actual/365 day count convention for GBP transactions. 2. CREDIT RISK MITIGATION. The parties agree to the following credit support arrangements: (a) Party A shall post initial margin equal to 10% of the notional amount of all outstanding Transactions, with a minimum threshold of USD 7,500,000 and a minimum transfer amount of USD 750,000; (b) Party B shall post initial margin equal to 15% of the notional amount of all outstanding Transactions, with a minimum threshold of USD 3,000,000 and a minimum transfer amount of USD 300,000; (c) variation margin shall be calculated daily based on the mark-to-market value of all outstanding Transactions using the following formula: VM = Σ(MTM_i × Notional_i) - Previous VM, where MTM_i represents the mark-to-market value per unit notional for Transaction i; and (d) all margin calculations shall be performed using the Standard Initial Margin Model (SIMM) methodology as published by ISDA, with a confidence level of 99.5% and a holding period of 15 business days. 3. NETTING AND CLOSE-OUT PROVISIONS. Upon the occurrence of an Event of Default or Termination Event, the non-defaulting party may designate an Early Termination Date and calculate the Close-out Amount using the following methodology: Close-out Amount = Σ(Replacement Cost_i + Legal Costs + Administrative Costs), where Replacement Cost for each Transaction shall be determined by obtaining quotations from at least five (5) Reference Market-makers for the cost of entering into replacement transactions with substantially equivalent economic terms, provided that if fewer than five quotations are available, the Close-out Amount may be determined using the non-defaulting party's internal valuation models, subject to the requirement that such models be consistent with prevailing market standards and practices and validated by an independent third party. 4. GOVERNING LAW AND DISPUTE RESOLUTION. This Agreement shall be governed by and construed in accordance with New York law. Any dispute arising out of or in connection with this Agreement, including any question regarding its existence, validity, or termination, shall be referred to and finally resolved by arbitration under the Commercial Arbitration Rules of the American Arbitration Association (AAA), which Rules are deemed to be incorporated by reference into this clause. The number of arbitrators shall be three (3), with each party appointing one arbitrator and the third arbitrator (who shall act as chairman) being appointed by the AAA. The seat of arbitration shall be New York, New York, and the language of the arbitration shall be English.`,
    expectedBehavior: {
      description: 'Should handle complex financial derivatives document with benchmark rate transitions, mathematical formula updates, and institutional changes',
      criticalFeatures: [
        'Institution name changes (Goldman Sachs→J.P. Morgan)',
        'Benchmark rate transitions (LIBOR→SOFR, etc.)',
        'Spread adjustments across multiple currencies',
        'Margin percentage and threshold changes',
        'Arbitration venue and rules changes'
      ],
      performanceExpectations: 'Should complete in under 180ms despite mathematical complexity',
      edgeCases: [
        'Complex mathematical formulas with variables',
        'Multiple currency-specific rate changes',
        'Percentage and basis point modifications',
        'Institutional address and registration changes',
        'Legal framework substitutions'
      ]
    },
    stressTestAspects: [
      'Complex financial mathematical formulas',
      'Multiple simultaneous rate benchmark changes',
      'Institutional entity substitutions',
      'Mixed percentage and numerical changes',
      'Legal framework and jurisdiction changes',
      'Technical financial terminology'
    ]
  },
  {
    id: 'pharmaceutical-licensing-mega',
    name: 'Mega Pharmaceutical Licensing Agreement with Clinical Trial Provisions',
    description: 'Comprehensive pharmaceutical licensing agreement with complex clinical trial milestones and regulatory pathways',
    category: 'Pharmaceutical Licensing',
    difficulty: 'Nightmare',
    complexity: {
      wordCount: 950,
      sentenceCount: 16,
      expectedChanges: 60,
      nestingDepth: 8
    },
    originalText: `This Exclusive License and Development Agreement ("Agreement") is entered into as of May 10, 2024, between BioPharma Innovations Inc., a Delaware corporation with its principal place of business at 123 Research Drive, Cambridge, Massachusetts 02142, United States ("Licensor"), and Global Therapeutics Ltd., a company incorporated under the laws of England and Wales with company number 12345678 and having its registered office at 1 London Bridge Street, London SE1 9GF, United Kingdom ("Licensee"). WHEREAS, Licensor has developed and owns certain proprietary compounds, including but not limited to BPI-2024-001 (a novel KRAS G12C inhibitor), BPI-2024-002 (a selective CDK4/6 inhibitor), and BPI-2024-003 (a next-generation PD-L1 antibody), along with related intellectual property, know-how, and regulatory data packages (collectively, the "Licensed Technology"); and WHEREAS, Licensee desires to obtain an exclusive license to develop, manufacture, and commercialize pharmaceutical products incorporating the Licensed Technology in the Territory (as defined below) for the treatment of oncological indications; and WHEREAS, the parties wish to establish a comprehensive development program with specific clinical and regulatory milestones to advance the Licensed Technology through Phase I, Phase II, and Phase III clinical trials and ultimately to regulatory approval and commercial launch. NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows: 1. GRANT OF LICENSE. Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee an exclusive license under the Licensed Technology to research, develop, manufacture, have manufactured, use, import, export, offer for sale, sell, and otherwise commercialize Licensed Products in the Territory for the treatment of the following oncological indications: (a) non-small cell lung cancer (NSCLC) with KRAS G12C mutations; (b) hormone receptor-positive, HER2-negative advanced or metastatic breast cancer; (c) triple-negative breast cancer; (d) colorectal cancer with microsatellite instability-high (MSI-H) or mismatch repair deficient (dMMR) tumors; and (e) such other oncological indications as may be agreed upon by the parties in writing. The "Territory" shall mean all countries and territories worldwide, excluding the United States, Canada, and Mexico. 2. DEVELOPMENT MILESTONES AND PAYMENTS. Licensee shall use commercially reasonable efforts to achieve the following development milestones and shall make the corresponding milestone payments to Licensor: (a) Initiation of Phase I clinical trial for BPI-2024-001 in NSCLC patients within 18 months of the Effective Date: USD 5,000,000; (b) Completion of Phase I dose escalation and determination of recommended Phase II dose (RP2D) for BPI-2024-001 within 36 months of the Effective Date: USD 10,000,000; (c) Initiation of Phase II clinical trial for BPI-2024-001 in NSCLC patients within 48 months of the Effective Date: USD 15,000,000; (d) Achievement of primary endpoint in Phase II clinical trial demonstrating objective response rate (ORR) of at least 35% in NSCLC patients with KRAS G12C mutations: USD 25,000,000; (e) Initiation of Phase III clinical trial for BPI-2024-001 in NSCLC patients within 72 months of the Effective Date: USD 40,000,000; (f) Submission of Marketing Authorization Application (MAA) to the European Medicines Agency (EMA) for BPI-2024-001 in NSCLC indication: USD 60,000,000; (g) Receipt of marketing approval from EMA for BPI-2024-001 in NSCLC indication: USD 80,000,000; and (h) First commercial sale of Licensed Product containing BPI-2024-001 in the Territory: USD 100,000,000. 3. REGULATORY RESPONSIBILITIES. Licensee shall be solely responsible for all regulatory activities in the Territory, including but not limited to: (a) preparation and submission of Investigational New Drug (IND) applications or Clinical Trial Applications (CTAs) to appropriate regulatory authorities; (b) conduct of all clinical trials in accordance with Good Clinical Practice (GCP) guidelines, International Council for Harmonisation (ICH) guidelines, and applicable local regulations; (c) preparation and submission of Marketing Authorization Applications (MAAs) to the European Medicines Agency (EMA), Medicines and Healthcare products Regulatory Agency (MHRA) in the United Kingdom, Pharmaceuticals and Medical Devices Agency (PMDA) in Japan, National Medical Products Administration (NMPA) in China, and other relevant regulatory authorities in the Territory; (d) maintenance of all regulatory approvals and compliance with post-marketing surveillance requirements; and (e) pharmacovigilance activities and adverse event reporting in accordance with applicable regulations. 4. MANUFACTURING AND SUPPLY. During the development phase, Licensor shall supply Licensee with clinical trial material for BPI-2024-001, BPI-2024-002, and BPI-2024-003 at a transfer price equal to Licensor's fully burdened manufacturing cost plus 15%. Upon regulatory approval and commercial launch, Licensee shall have the right to manufacture Licensed Products itself or through third-party contract manufacturers, provided that all manufacturing activities comply with current Good Manufacturing Practice (cGMP) requirements and other applicable quality standards. Licensee shall pay Licensor a supply price equal to 65% of Net Sales for the first USD 500,000,000 in annual Net Sales, 60% of Net Sales for annual Net Sales between USD 500,000,001 and USD 1,000,000,000, and 55% of Net Sales for annual Net Sales exceeding USD 1,000,000,000. 5. ROYALTY PAYMENTS. In consideration for the rights granted hereunder, Licensee shall pay Licensor the following royalties on Net Sales of Licensed Products in the Territory: (a) 8% of Net Sales for Licensed Products containing BPI-2024-001 as the sole active pharmaceutical ingredient; (b) 6% of Net Sales for Licensed Products containing BPI-2024-002 as the sole active pharmaceutical ingredient; (c) 4% of Net Sales for Licensed Products containing BPI-2024-003 as the sole active pharmaceutical ingredient; (d) 12% of Net Sales for Licensed Products containing any combination of two or more of the foregoing compounds; and (e) such royalty rates shall be subject to reduction by 50% upon expiration of the last-to-expire patent covering the applicable Licensed Product in each country, and shall terminate entirely upon expiration of all patent protection and regulatory exclusivity for such Licensed Product in such country.`,
    revisedText: `This Exclusive License and Development Agreement ("Agreement") is entered into as of June 25, 2024, between BioPharma Innovations LLC, a Delaware limited liability company with its principal place of business at 456 Innovation Way, Boston, Massachusetts 02115, United States ("Licensor"), and European Therapeutics S.A., a public limited company incorporated under the laws of France with company number 123456789 and having its registered office at 15 Avenue des Champs-Élysées, 75008 Paris, France ("Licensee"). WHEREAS, Licensor has developed and owns certain proprietary compounds, including but not limited to BPI-2024-004 (a novel KRAS G12D inhibitor), BPI-2024-005 (a selective CDK2/4/6 inhibitor), and BPI-2024-006 (a bispecific PD-1/LAG-3 antibody), along with related intellectual property, know-how, and regulatory data packages (collectively, the "Licensed Technology"); and WHEREAS, Licensee desires to obtain an exclusive license to develop, manufacture, and commercialize pharmaceutical products incorporating the Licensed Technology in the Territory (as defined below) for the treatment of oncological and autoimmune indications; and WHEREAS, the parties wish to establish a comprehensive development program with specific clinical and regulatory milestones to advance the Licensed Technology through Phase I, Phase II, and Phase III clinical trials and ultimately to regulatory approval and commercial launch. NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows: 1. GRANT OF LICENSE. Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee an exclusive license under the Licensed Technology to research, develop, manufacture, have manufactured, use, import, export, offer for sale, sell, and otherwise commercialize Licensed Products in the Territory for the treatment of the following indications: (a) non-small cell lung cancer (NSCLC) with KRAS G12D mutations; (b) hormone receptor-positive, HER2-negative advanced or metastatic breast cancer; (c) triple-negative breast cancer; (d) colorectal cancer with microsatellite instability-high (MSI-H) or mismatch repair deficient (dMMR) tumors; (e) rheumatoid arthritis; (f) inflammatory bowel disease; and (g) such other oncological and autoimmune indications as may be agreed upon by the parties in writing. The "Territory" shall mean all countries and territories in Europe, Asia-Pacific, and Latin America, excluding the United States, Canada, and Mexico. 2. DEVELOPMENT MILESTONES AND PAYMENTS. Licensee shall use commercially reasonable efforts to achieve the following development milestones and shall make the corresponding milestone payments to Licensor: (a) Initiation of Phase I clinical trial for BPI-2024-004 in NSCLC patients within 12 months of the Effective Date: USD 7,500,000; (b) Completion of Phase I dose escalation and determination of recommended Phase II dose (RP2D) for BPI-2024-004 within 30 months of the Effective Date: USD 15,000,000; (c) Initiation of Phase II clinical trial for BPI-2024-004 in NSCLC patients within 42 months of the Effective Date: USD 22,500,000; (d) Achievement of primary endpoint in Phase II clinical trial demonstrating objective response rate (ORR) of at least 40% in NSCLC patients with KRAS G12D mutations: USD 35,000,000; (e) Initiation of Phase III clinical trial for BPI-2024-004 in NSCLC patients within 66 months of the Effective Date: USD 55,000,000; (f) Submission of Marketing Authorization Application (MAA) to the European Medicines Agency (EMA) for BPI-2024-004 in NSCLC indication: USD 75,000,000; (g) Receipt of marketing approval from EMA for BPI-2024-004 in NSCLC indication: USD 100,000,000; and (h) First commercial sale of Licensed Product containing BPI-2024-004 in the Territory: USD 125,000,000. 3. REGULATORY RESPONSIBILITIES. Licensee shall be solely responsible for all regulatory activities in the Territory, including but not limited to: (a) preparation and submission of Investigational New Drug (IND) applications or Clinical Trial Applications (CTAs) to appropriate regulatory authorities; (b) conduct of all clinical trials in accordance with Good Clinical Practice (GCP) guidelines, International Council for Harmonisation (ICH) guidelines, and applicable local regulations; (c) preparation and submission of Marketing Authorization Applications (MAAs) to the European Medicines Agency (EMA), Agence nationale de sécurité du médicament et des produits de santé (ANSM) in France, Bundesinstitut für Arzneimittel und Medizinprodukte (BfArM) in Germany, Pharmaceuticals and Medical Devices Agency (PMDA) in Japan, National Medical Products Administration (NMPA) in China, and other relevant regulatory authorities in the Territory; (d) maintenance of all regulatory approvals and compliance with post-marketing surveillance requirements; and (e) pharmacovigilance activities and adverse event reporting in accordance with applicable regulations. 4. MANUFACTURING AND SUPPLY. During the development phase, Licensor shall supply Licensee with clinical trial material for BPI-2024-004, BPI-2024-005, and BPI-2024-006 at a transfer price equal to Licensor's fully burdened manufacturing cost plus 20%. Upon regulatory approval and commercial launch, Licensee shall have the right to manufacture Licensed Products itself or through third-party contract manufacturers, provided that all manufacturing activities comply with current Good Manufacturing Practice (cGMP) requirements and other applicable quality standards. Licensee shall pay Licensor a supply price equal to 70% of Net Sales for the first USD 750,000,000 in annual Net Sales, 65% of Net Sales for annual Net Sales between USD 750,000,001 and USD 1,500,000,000, and 60% of Net Sales for annual Net Sales exceeding USD 1,500,000,000. 5. ROYALTY PAYMENTS. In consideration for the rights granted hereunder, Licensee shall pay Licensor the following royalties on Net Sales of Licensed Products in the Territory: (a) 10% of Net Sales for Licensed Products containing BPI-2024-004 as the sole active pharmaceutical ingredient; (b) 8% of Net Sales for Licensed Products containing BPI-2024-005 as the sole active pharmaceutical ingredient; (c) 6% of Net Sales for Licensed Products containing BPI-2024-006 as the sole active pharmaceutical ingredient; (d) 15% of Net Sales for Licensed Products containing any combination of two or more of the foregoing compounds; and (e) such royalty rates shall be subject to reduction by 40% upon expiration of the last-to-expire patent covering the applicable Licensed Product in each country, and shall terminate entirely upon expiration of all patent protection and regulatory exclusivity for such Licensed Product in such country.`,
    expectedBehavior: {
      description: 'Should handle massive pharmaceutical document with compound changes, entity transformations, indication expansions, milestone adjustments, and complex financial term modifications',
      criticalFeatures: [
        'Entity type change (Inc.→LLC) and address updates',
        'Compound designation changes (001→004, 002→005, 003→006)',
        'Target mutation changes (G12C→G12D)',
        'Indication scope expansion (oncological→oncological and autoimmune)',
        'Milestone payment amount increases and timeline adjustments',
        'Royalty percentage increases across all tiers'
      ],
      performanceExpectations: 'Should complete in under 300ms despite extreme document complexity',
      edgeCases: [
        'Multiple compound designation changes throughout document',
        'Complex milestone payment schedule modifications',
        'Percentage and financial threshold adjustments',
        'Regulatory authority name changes',
        'Territory definition modifications',
        'Mixed indication type expansions'
      ]
    },
    stressTestAspects: [
      'Extremely long pharmaceutical document',
      'Multiple compound designation changes',
      'Complex milestone payment modifications',
      'Regulatory authority substitutions',
      'Mixed percentage and financial changes',
      'Technical pharmaceutical terminology',
      'Nested conditional payment structures',
      'Multi-jurisdictional regulatory references'
    ]
  },
  {
    id: 'infrastructure-construction-mega',
    name: 'Mega Infrastructure Construction Agreement with Environmental Compliance',
    description: 'Massive infrastructure construction contract with complex environmental compliance, safety protocols, and multi-phase delivery schedules',
    category: 'Infrastructure Construction',
    difficulty: 'Ultra',
    complexity: {
      wordCount: 890,
      sentenceCount: 14,
      expectedChanges: 50,
      nestingDepth: 6
    },
    originalText: `This Engineering, Procurement, and Construction Agreement ("Agreement") is entered into as of July 1, 2024, among Metropolitan Transportation Authority of New York, a public benefit corporation organized under the laws of the State of New York with its principal office at 2 Broadway, New York, New York 10004 ("Owner"), Bechtel Corporation, a Delaware corporation with its principal place of business at 50 Beale Street, San Francisco, California 94105 ("Prime Contractor"), and Skanska USA Civil Inc., a New York corporation with its principal place of business at 1065 Avenue of the Americas, New York, New York 10018 ("Subcontractor") (collectively, the "Parties"). This Agreement governs the design, engineering, procurement, construction, testing, and commissioning of the Second Avenue Subway Phase 2 Extension Project, consisting of the construction of approximately 1.5 miles of new subway tunnel, three (3) new underground stations at 106th Street, 116th Street, and 125th Street, associated track work, signal systems, ventilation systems, and electrical infrastructure (the "Project"). The Project shall be constructed in accordance with the following specifications and requirements: 1. SCOPE OF WORK. The Project shall include but not be limited to: (a) excavation of approximately 8,000 linear feet of tunnel using tunnel boring machine (TBM) technology with an internal diameter of 21.5 feet; (b) construction of three (3) underground stations with platform lengths of 515 feet each, designed to accommodate 10-car trains with a maximum capacity of 1,200 passengers per car; (c) installation of 1.5 miles of standard gauge (4 feet 8.5 inches) track with concrete ties and continuous welded rail; (d) installation of Communications-Based Train Control (CBTC) signaling system compatible with existing Line 4/5/6 infrastructure; (e) construction of ventilation systems with a minimum capacity of 500,000 cubic feet per minute (CFM) for emergency smoke evacuation; (f) installation of electrical systems including 27kV traction power, 480V auxiliary power, emergency lighting, and fire alarm systems; and (g) all associated civil, mechanical, electrical, and architectural work necessary for a fully operational subway extension. 2. CONTRACT PRICE AND PAYMENT SCHEDULE. The total contract price for the Project shall be USD 4,500,000,000 (Four Billion Five Hundred Million Dollars), payable according to the following schedule: (a) 15% upon execution of this Agreement and commencement of preliminary design work: USD 675,000,000; (b) 25% upon completion of final design and issuance of construction permits: USD 1,125,000,000; (c) 35% upon completion of tunnel excavation and rough construction of all three stations: USD 1,575,000,000; (d) 20% upon completion of track installation, signaling systems, and mechanical/electrical systems: USD 900,000,000; and (e) 5% upon final testing, commissioning, and acceptance by Owner: USD 225,000,000. 3. PERFORMANCE SCHEDULE. Prime Contractor shall complete the Project in accordance with the following milestone schedule: (a) Completion of environmental impact assessment and receipt of all required permits within 12 months of the Effective Date; (b) Completion of final design and engineering drawings within 24 months of the Effective Date; (c) Commencement of tunnel excavation within 30 months of the Effective Date; (d) Completion of tunnel excavation and station shell construction within 60 months of the Effective Date; (e) Completion of track installation and systems integration within 78 months of the Effective Date; and (f) Final testing, commissioning, and project completion within 84 months of the Effective Date. Time is of the essence, and Prime Contractor shall pay liquidated damages of USD 100,000 per day for each day of delay beyond the scheduled completion date. 4. ENVIRONMENTAL COMPLIANCE. The Project shall be constructed in full compliance with all applicable environmental laws and regulations, including but not limited to: (a) the National Environmental Policy Act (NEPA) and all associated environmental impact assessments; (b) the Clean Air Act and all air quality monitoring requirements during construction; (c) the Clean Water Act and all stormwater management and groundwater protection measures; (d) the Resource Conservation and Recovery Act (RCRA) for proper handling and disposal of hazardous materials; (e) New York State Environmental Quality Review Act (SEQRA) and all state-specific environmental requirements; (f) New York City Environmental Quality Review (CEQR) and all local environmental compliance measures; and (g) all noise ordinances and vibration control measures to minimize impact on surrounding residential and commercial properties. Prime Contractor shall maintain continuous environmental monitoring throughout the construction period and shall submit monthly environmental compliance reports to Owner and all relevant regulatory agencies. 5. SAFETY AND QUALITY REQUIREMENTS. All work shall be performed in accordance with the highest industry safety standards, including but not limited to: (a) Occupational Safety and Health Administration (OSHA) regulations for construction work in confined spaces and underground environments; (b) Federal Transit Administration (FTA) safety requirements for rail transit construction projects; (c) American Public Transportation Association (APTA) safety standards for subway construction; (d) New York State Department of Labor safety regulations; and (e) Metropolitan Transportation Authority safety protocols and procedures. Prime Contractor shall maintain an Experience Modification Rate (EMR) of no greater than 0.85 throughout the project duration and shall achieve a Total Recordable Incident Rate (TRIR) of no greater than 2.0 incidents per 200,000 work hours.`,
    revisedText: `This Engineering, Procurement, and Construction Agreement ("Agreement") is entered into as of August 15, 2024, among Los Angeles County Metropolitan Transportation Authority, a public agency organized under the laws of the State of California with its principal office at One Gateway Plaza, Los Angeles, California 90012 ("Owner"), Turner Construction Company, a New York corporation with its principal place of business at 375 Hudson Street, New York, New York 10014 ("Prime Contractor"), and Kiewit Infrastructure West Co., a Delaware corporation with its principal place of business at 1550 Mike Fahey Street, Omaha, Nebraska 68102 ("Subcontractor") (collectively, the "Parties"). This Agreement governs the design, engineering, procurement, construction, testing, and commissioning of the Purple Line Extension Phase 3 Project, consisting of the construction of approximately 2.6 miles of new subway tunnel, four (4) new underground stations at Wilshire/La Cienega, Wilshire/Fairfax, Wilshire/La Brea, and Wilshire/Highland, associated track work, signal systems, ventilation systems, and electrical infrastructure (the "Project"). The Project shall be constructed in accordance with the following specifications and requirements: 1. SCOPE OF WORK. The Project shall include but not be limited to: (a) excavation of approximately 13,700 linear feet of tunnel using tunnel boring machine (TBM) technology with an internal diameter of 23.5 feet; (b) construction of four (4) underground stations with platform lengths of 600 feet each, designed to accommodate 6-car trains with a maximum capacity of 1,500 passengers per car; (c) installation of 2.6 miles of standard gauge (4 feet 8.5 inches) track with concrete ties and continuous welded rail; (d) installation of Communications-Based Train Control (CBTC) signaling system compatible with existing Purple Line infrastructure; (e) construction of ventilation systems with a minimum capacity of 750,000 cubic feet per minute (CFM) for emergency smoke evacuation; (f) installation of electrical systems including 34.5kV traction power, 480V auxiliary power, emergency lighting, and fire alarm systems; and (g) all associated civil, mechanical, electrical, and architectural work necessary for a fully operational subway extension. 2. CONTRACT PRICE AND PAYMENT SCHEDULE. The total contract price for the Project shall be USD 6,200,000,000 (Six Billion Two Hundred Million Dollars), payable according to the following schedule: (a) 12% upon execution of this Agreement and commencement of preliminary design work: USD 744,000,000; (b) 28% upon completion of final design and issuance of construction permits: USD 1,736,000,000; (c) 40% upon completion of tunnel excavation and rough construction of all four stations: USD 2,480,000,000; (d) 15% upon completion of track installation, signaling systems, and mechanical/electrical systems: USD 930,000,000; and (e) 5% upon final testing, commissioning, and acceptance by Owner: USD 310,000,000. 3. PERFORMANCE SCHEDULE. Prime Contractor shall complete the Project in accordance with the following milestone schedule: (a) Completion of environmental impact assessment and receipt of all required permits within 18 months of the Effective Date; (b) Completion of final design and engineering drawings within 30 months of the Effective Date; (c) Commencement of tunnel excavation within 36 months of the Effective Date; (d) Completion of tunnel excavation and station shell construction within 72 months of the Effective Date; (e) Completion of track installation and systems integration within 90 months of the Effective Date; and (f) Final testing, commissioning, and project completion within 96 months of the Effective Date. Time is of the essence, and Prime Contractor shall pay liquidated damages of USD 150,000 per day for each day of delay beyond the scheduled completion date. 4. ENVIRONMENTAL COMPLIANCE. The Project shall be constructed in full compliance with all applicable environmental laws and regulations, including but not limited to: (a) the National Environmental Policy Act (NEPA) and all associated environmental impact assessments; (b) the Clean Air Act and all air quality monitoring requirements during construction; (c) the Clean Water Act and all stormwater management and groundwater protection measures; (d) the Resource Conservation and Recovery Act (RCRA) for proper handling and disposal of hazardous materials; (e) California Environmental Quality Act (CEQA) and all state-specific environmental requirements; (f) Los Angeles Municipal Code environmental compliance measures and all local environmental requirements; and (g) all noise ordinances and vibration control measures to minimize impact on surrounding residential and commercial properties. Prime Contractor shall maintain continuous environmental monitoring throughout the construction period and shall submit bi-weekly environmental compliance reports to Owner and all relevant regulatory agencies. 5. SAFETY AND QUALITY REQUIREMENTS. All work shall be performed in accordance with the highest industry safety standards, including but not limited to: (a) Occupational Safety and Health Administration (OSHA) regulations for construction work in confined spaces and underground environments; (b) Federal Transit Administration (FTA) safety requirements for rail transit construction projects; (c) American Public Transportation Association (APTA) safety standards for subway construction; (d) California Division of Occupational Safety and Health (Cal/OSHA) safety regulations; and (e) Los Angeles County Metropolitan Transportation Authority safety protocols and procedures. Prime Contractor shall maintain an Experience Modification Rate (EMR) of no greater than 0.75 throughout the project duration and shall achieve a Total Recordable Incident Rate (TRIR) of no greater than 1.5 incidents per 200,000 work hours.`,
    expectedBehavior: {
      description: 'Should handle massive infrastructure document with complete project changes, entity substitutions, technical specification updates, and financial restructuring',
      criticalFeatures: [
        'Complete project change (Second Avenue Subway→Purple Line Extension)',
        'Authority changes (MTA New York→LA Metro)',
        'Contractor substitutions (Bechtel→Turner, Skanska→Kiewit)',
        'Technical specification updates (tunnel diameter, station count, etc.)',
        'Financial restructuring (contract price, payment schedule)',
        'Timeline and milestone adjustments'
      ],
      performanceExpectations: 'Should complete in under 220ms despite massive document complexity',
      edgeCases: [
        'Multiple entity and address changes',
        'Complex technical specification modifications',
        'Financial amount and percentage changes',
        'Timeline and milestone adjustments',
        'Regulatory framework substitutions',
        'Safety standard threshold changes'
      ]
    },
    stressTestAspects: [
      'Extremely long infrastructure document',
      'Multiple entity and contractor changes',
      'Complex technical specification modifications',
      'Large financial amount substitutions',
      'Timeline and milestone restructuring',
      'Regulatory compliance framework changes',
      'Safety standard threshold adjustments',
      'Mixed measurement and percentage changes'
    ]
  },
  {
    id: 'technology-transfer-ultra',
    name: 'Ultra-Complex Technology Transfer Agreement with IP Portfolio',
    description: 'Comprehensive technology transfer agreement involving multiple patent portfolios, trade secrets, and international licensing arrangements',
    category: 'Technology Transfer',
    difficulty: 'Nightmare',
    complexity: {
      wordCount: 820,
      sentenceCount: 13,
      expectedChanges: 45,
      nestingDepth: 7
    },
    originalText: `This Technology Transfer and Licensing Agreement ("Agreement") is entered into as of September 5, 2024, among Massachusetts Institute of Technology, a Massachusetts corporation with its principal place of business at 77 Massachusetts Avenue, Cambridge, Massachusetts 02139, United States ("MIT"), Stanford University, a California corporation with its principal place of business at 450 Serra Mall, Stanford, California 94305, United States ("Stanford"), and QuantumTech Innovations Inc., a Delaware corporation with its principal place of business at 2000 University Avenue, Palo Alto, California 94301, United States ("Licensee"). This Agreement governs the transfer and licensing of certain breakthrough quantum computing technologies, artificial intelligence algorithms, and related intellectual property developed jointly by MIT and Stanford (collectively, the "Licensed Technology"). The Licensed Technology includes but is not limited to: (a) Patent Portfolio QC-2024-001 comprising 47 issued patents and 23 pending patent applications related to quantum error correction algorithms, quantum gate optimization, and quantum-classical hybrid computing architectures; (b) Patent Portfolio AI-2024-002 comprising 62 issued patents and 31 pending patent applications related to neural network architectures, machine learning optimization algorithms, and quantum machine learning interfaces; (c) Trade Secret Portfolio TS-2024-003 comprising proprietary manufacturing processes for quantum processors, specialized quantum control software, and calibration methodologies for quantum systems operating at temperatures below 10 millikelvin; and (d) Know-how and technical documentation including but not limited to design specifications, testing protocols, quality control procedures, and operational manuals for quantum computing systems with coherence times exceeding 100 microseconds and gate fidelities above 99.9%. 1. GRANT OF RIGHTS. Subject to the terms and conditions hereof, MIT and Stanford hereby grant to Licensee: (a) an exclusive license under Patent Portfolio QC-2024-001 to make, have made, use, sell, offer for sale, import, and export quantum computing systems and related products in the Field of Use (as defined below) throughout the Territory; (b) a non-exclusive license under Patent Portfolio AI-2024-002 to develop, manufacture, and commercialize artificial intelligence software and hardware products that interface with quantum computing systems; (c) access to Trade Secret Portfolio TS-2024-003 under strict confidentiality obligations and limited to use in connection with the development and manufacture of Licensed Products; and (d) a perpetual, irrevocable license to use all Know-how and technical documentation for the purposes of developing, manufacturing, testing, and commercializing Licensed Products. The "Field of Use" shall be limited to: (i) quantum computing systems for commercial and research applications with qubit counts between 50 and 1,000 qubits; (ii) quantum software development platforms and programming languages; (iii) quantum simulation and optimization applications for financial modeling, drug discovery, and materials science; and (iv) quantum-enhanced artificial intelligence and machine learning applications. The "Territory" shall mean the United States, Canada, European Union member states, United Kingdom, Japan, South Korea, Australia, and New Zealand. 2. FINANCIAL TERMS. In consideration for the rights granted hereunder, Licensee shall pay the following: (a) an upfront license fee of USD 50,000,000 payable within 30 days of execution of this Agreement; (b) annual minimum royalties of USD 5,000,000 beginning in the second year after the first commercial sale of a Licensed Product; (c) running royalties equal to 4.5% of Net Sales for quantum computing hardware products, 3.0% of Net Sales for quantum software products, and 6.0% of Net Sales for integrated quantum-AI systems; (d) milestone payments totaling USD 75,000,000 upon achievement of specific technical and commercial milestones including: (i) demonstration of quantum advantage in a commercially relevant application: USD 15,000,000; (ii) achievement of 500-qubit quantum processor with 99.95% gate fidelity: USD 20,000,000; (iii) first commercial sale of Licensed Product: USD 10,000,000; (iv) cumulative Net Sales of USD 100,000,000: USD 15,000,000; and (v) cumulative Net Sales of USD 500,000,000: USD 15,000,000; and (e) equity participation whereby MIT and Stanford shall collectively receive 2.5% of the fully diluted equity of Licensee, with anti-dilution protection and tag-along rights. 3. DEVELOPMENT AND COMMERCIALIZATION OBLIGATIONS. Licensee shall use commercially reasonable efforts to develop and commercialize Licensed Products and shall meet the following minimum performance requirements: (a) invest at least USD 25,000,000 annually in research and development activities related to the Licensed Technology; (b) employ at least 50 full-time equivalent researchers and engineers working on Licensed Technology development; (c) establish manufacturing capabilities sufficient to produce at least 100 quantum computing systems annually by the end of the fifth year following the Effective Date; (d) achieve first commercial sale of a Licensed Product within 36 months of the Effective Date; (e) achieve cumulative Net Sales of at least USD 50,000,000 within 60 months of the Effective Date; and (f) maintain ISO 9001:2015 quality management certification and implement quantum-specific quality control procedures approved by MIT and Stanford. 4. INTELLECTUAL PROPERTY MANAGEMENT. The parties agree to the following intellectual property management provisions: (a) MIT and Stanford shall retain ownership of all Background IP and shall be responsible for prosecution and maintenance of Patent Portfolio QC-2024-001 and Patent Portfolio AI-2024-002 at their own expense; (b) Licensee shall have the right to participate in patent prosecution decisions and shall reimburse MIT and Stanford for 50% of all patent prosecution and maintenance costs for patents within the Field of Use; (c) all improvements, modifications, and derivative works developed by Licensee shall be jointly owned by all three parties, with each party having the right to practice such improvements without obligation to the others; (d) Licensee shall have the first right to enforce patents against third-party infringers, with MIT and Stanford having the right to join such enforcement actions; and (e) any recoveries from patent enforcement shall be shared as follows: 40% to MIT, 40% to Stanford, and 20% to Licensee, after deduction of reasonable enforcement costs.`,
    revisedText: `This Technology Transfer and Licensing Agreement ("Agreement") is entered into as of October 20, 2024, among California Institute of Technology, a California corporation with its principal place of business at 1200 East California Boulevard, Pasadena, California 91125, United States ("Caltech"), University of Chicago, an Illinois corporation with its principal place of business at 5801 South Ellis Avenue, Chicago, Illinois 60637, United States ("UChicago"), and QuantumTech Global Ltd., a Delaware corporation with its principal place of business at 3000 Sand Hill Road, Menlo Park, California 94025, United States ("Licensee"). This Agreement governs the transfer and licensing of certain breakthrough quantum sensing technologies, quantum networking protocols, and related intellectual property developed jointly by Caltech and UChicago (collectively, the "Licensed Technology"). The Licensed Technology includes but is not limited to: (a) Patent Portfolio QS-2024-004 comprising 58 issued patents and 29 pending patent applications related to quantum sensing algorithms, quantum magnetometry, and quantum-enhanced imaging systems; (b) Patent Portfolio QN-2024-005 comprising 71 issued patents and 37 pending patent applications related to quantum communication protocols, quantum key distribution, and quantum internet infrastructure; (c) Trade Secret Portfolio TS-2024-006 comprising proprietary manufacturing processes for quantum sensors, specialized quantum networking hardware, and calibration methodologies for quantum sensing systems operating at room temperature with sensitivity below 10^-18 Tesla; and (d) Know-how and technical documentation including but not limited to design specifications, testing protocols, quality control procedures, and operational manuals for quantum sensing systems with measurement precision exceeding 10^-15 meters and quantum communication systems with key generation rates above 1 Mbps. 1. GRANT OF RIGHTS. Subject to the terms and conditions hereof, Caltech and UChicago hereby grant to Licensee: (a) an exclusive license under Patent Portfolio QS-2024-004 to make, have made, use, sell, offer for sale, import, and export quantum sensing systems and related products in the Field of Use (as defined below) throughout the Territory; (b) a non-exclusive license under Patent Portfolio QN-2024-005 to develop, manufacture, and commercialize quantum networking hardware and software products that interface with quantum sensing systems; (c) access to Trade Secret Portfolio TS-2024-006 under strict confidentiality obligations and limited to use in connection with the development and manufacture of Licensed Products; and (d) a perpetual, irrevocable license to use all Know-how and technical documentation for the purposes of developing, manufacturing, testing, and commercializing Licensed Products. The "Field of Use" shall be limited to: (i) quantum sensing systems for medical imaging, geological surveying, and defense applications with sensitivity levels below 10^-16 Tesla; (ii) quantum networking infrastructure and quantum internet protocols; (iii) quantum-enhanced navigation and timing systems for autonomous vehicles and satellite applications; and (iv) quantum-secured communication systems for financial institutions and government agencies. The "Territory" shall mean worldwide, excluding China, Russia, Iran, and North Korea. 2. FINANCIAL TERMS. In consideration for the rights granted hereunder, Licensee shall pay the following: (a) an upfront license fee of USD 75,000,000 payable within 45 days of execution of this Agreement; (b) annual minimum royalties of USD 8,000,000 beginning in the second year after the first commercial sale of a Licensed Product; (c) running royalties equal to 5.5% of Net Sales for quantum sensing hardware products, 4.0% of Net Sales for quantum networking software products, and 7.5% of Net Sales for integrated quantum sensing-networking systems; (d) milestone payments totaling USD 100,000,000 upon achievement of specific technical and commercial milestones including: (i) demonstration of quantum sensing advantage in medical imaging applications: USD 20,000,000; (ii) achievement of room-temperature quantum sensor with 10^-18 Tesla sensitivity: USD 25,000,000; (iii) first commercial sale of Licensed Product: USD 15,000,000; (iv) cumulative Net Sales of USD 150,000,000: USD 20,000,000; and (v) cumulative Net Sales of USD 750,000,000: USD 20,000,000; and (e) equity participation whereby Caltech and UChicago shall collectively receive 3.5% of the fully diluted equity of Licensee, with anti-dilution protection and tag-along rights. 3. DEVELOPMENT AND COMMERCIALIZATION OBLIGATIONS. Licensee shall use commercially reasonable efforts to develop and commercialize Licensed Products and shall meet the following minimum performance requirements: (a) invest at least USD 40,000,000 annually in research and development activities related to the Licensed Technology; (b) employ at least 75 full-time equivalent researchers and engineers working on Licensed Technology development; (c) establish manufacturing capabilities sufficient to produce at least 500 quantum sensing systems annually by the end of the fourth year following the Effective Date; (d) achieve first commercial sale of a Licensed Product within 30 months of the Effective Date; (e) achieve cumulative Net Sales of at least USD 75,000,000 within 54 months of the Effective Date; and (f) maintain ISO 9001:2015 quality management certification and implement quantum-specific quality control procedures approved by Caltech and UChicago. 4. INTELLECTUAL PROPERTY MANAGEMENT. The parties agree to the following intellectual property management provisions: (a) Caltech and UChicago shall retain ownership of all Background IP and shall be responsible for prosecution and maintenance of Patent Portfolio QS-2024-004 and Patent Portfolio QN-2024-005 at their own expense; (b) Licensee shall have the right to participate in patent prosecution decisions and shall reimburse Caltech and UChicago for 60% of all patent prosecution and maintenance costs for patents within the Field of Use; (c) all improvements, modifications, and derivative works developed by Licensee shall be jointly owned by all three parties, with each party having the right to practice such improvements without obligation to the others; (d) Licensee shall have the first right to enforce patents against third-party infringers, with Caltech and UChicago having the right to join such enforcement actions; and (e) any recoveries from patent enforcement shall be shared as follows: 35% to Caltech, 35% to UChicago, and 30% to Licensee, after deduction of reasonable enforcement costs.`,
    expectedBehavior: {
      description: 'Should handle ultra-complex technology transfer document with complete technology focus changes, institution substitutions, patent portfolio updates, and comprehensive financial restructuring',
      criticalFeatures: [
        'Institution changes (MIT→Caltech, Stanford→UChicago)',
        'Technology focus shift (quantum computing→quantum sensing/networking)',
        'Patent portfolio redesignations (QC/AI→QS/QN)',
        'Technical specification updates (coherence times→sensitivity levels)',
        'Financial term increases across all categories',
        'Performance requirement adjustments'
      ],
      performanceExpectations: 'Should complete in under 250ms despite extreme technical complexity',
      edgeCases: [
        'Multiple institution and address changes',
        'Complex patent portfolio redesignations',
        'Technical specification unit changes',
        'Financial amount and percentage increases',
        'Performance metric modifications',
        'Territory definition changes'
      ]
    },
    stressTestAspects: [
      'Ultra-complex technology transfer document',
      'Multiple institution substitutions',
      'Complex patent portfolio changes',
      'Technical specification modifications',
      'Large financial restructuring',
      'Performance requirement adjustments',
      'Mixed technical and financial terminology',
      'Complex intellectual property provisions'
    ]
  },
  {
    id: 'energy-project-financing-mega',
    name: 'Mega Energy Project Financing with Environmental Credits',
    description: 'Massive renewable energy project financing agreement with complex environmental credit mechanisms and multi-tranche funding structure',
    category: 'Energy Project Financing',
    difficulty: 'Ultra',
    complexity: {
      wordCount: 860,
      sentenceCount: 12,
      expectedChanges: 48,
      nestingDepth: 6
    },
    originalText: `This Project Finance Agreement ("Agreement") is entered into as of November 1, 2024, among Renewable Energy Development Corporation, a Delaware corporation with its principal place of business at 1000 Green Energy Drive, Austin, Texas 78701, United States ("Borrower"), JPMorgan Chase Bank, N.A., a national banking association with its principal office at 383 Madison Avenue, New York, New York 10179, United States, as Administrative Agent and Lead Arranger ("Administrative Agent"), Bank of America, N.A., a national banking association, as Syndication Agent, and the financial institutions listed on Schedule I hereto as Lenders (collectively, the "Lenders"). This Agreement provides for the financing of the Desert Sun Solar Project, a 500 megawatt (MW) utility-scale solar photovoltaic power generation facility to be constructed in Riverside County, California, including associated transmission infrastructure, energy storage systems, and environmental mitigation measures (the "Project"). The Project financing structure consists of the following tranches: 1. FACILITY STRUCTURE. The Lenders agree to provide financing in the aggregate principal amount of USD 1,200,000,000, consisting of: (a) Tranche A Term Loan in the principal amount of USD 800,000,000 with a tenor of 18 years and an interest rate of SOFR + 275 basis points, secured by a first priority lien on all Project assets; (b) Tranche B Subordinated Loan in the principal amount of USD 250,000,000 with a tenor of 20 years and an interest rate of SOFR + 450 basis points, subordinated to Tranche A; (c) Letter of Credit Facility in the amount of USD 100,000,000 to support construction and performance guarantees; and (d) Working Capital Facility in the amount of USD 50,000,000 with a tenor of 5 years for operational expenses and maintenance reserves. The Project is expected to generate approximately 1,200,000 megawatt-hours (MWh) of clean electricity annually, sufficient to power approximately 180,000 homes, and will result in the avoidance of approximately 600,000 metric tons of CO2 emissions per year. 2. ENVIRONMENTAL CREDITS AND REVENUE STREAMS. The Project shall generate multiple revenue streams including: (a) Power Purchase Agreement (PPA) with Southern California Edison Company for the sale of 400 MW of generation capacity at a fixed price of USD 45.50 per MWh for a term of 25 years, escalating at 2.5% annually; (b) Renewable Energy Certificates (RECs) sales expected to generate approximately USD 8,000,000 annually based on current California REC prices of USD 6.67 per MWh; (c) Federal Investment Tax Credit (ITC) equal to 30% of qualified project costs, estimated at USD 450,000,000; (d) California Solar Initiative (CSI) rebates and incentives estimated at USD 25,000,000; (e) Carbon offset credits under the California Cap-and-Trade Program expected to generate USD 12,000,000 annually based on current carbon credit prices of USD 20.00 per metric ton of CO2; and (f) Ancillary services revenue from grid stabilization and frequency regulation estimated at USD 3,000,000 annually. 3. CONSTRUCTION AND PERFORMANCE REQUIREMENTS. Borrower shall construct the Project in accordance with the following specifications: (a) Solar photovoltaic modules with a minimum efficiency rating of 21.5% and a performance warranty of 25 years with no more than 0.5% annual degradation; (b) Central inverters with a minimum efficiency rating of 98.5% and a 20-year warranty; (c) Single-axis tracking systems to optimize solar irradiance capture with a minimum 25% increase in energy yield compared to fixed-tilt systems; (d) Battery Energy Storage System (BESS) with a capacity of 200 MWh using lithium-ion technology with a minimum round-trip efficiency of 90% and a 15-year warranty; (e) 230 kV transmission line extending 15 miles to connect to the existing electrical grid at the Devers Substation; and (f) Environmental mitigation measures including habitat restoration of 500 acres, wildlife corridors, and a USD 10,000,000 environmental mitigation fund. The Project shall achieve Commercial Operation Date (COD) no later than December 31, 2027, with liquidated damages of USD 50,000 per day for delays beyond such date. 4. FINANCIAL COVENANTS AND RATIOS. Borrower shall maintain the following financial ratios and covenants throughout the term of this Agreement: (a) Debt Service Coverage Ratio (DSCR) of not less than 1.30:1.00, calculated as the ratio of Net Cash Flow Available for Debt Service to Total Debt Service for the preceding 12-month period; (b) Loan Life Coverage Ratio (LLCR) of not less than 1.40:1.00, calculated as the net present value of projected Net Cash Flow Available for Debt Service over the remaining term of the loans divided by the outstanding principal balance of all loans; (c) Project Life Coverage Ratio (PLCR) of not less than 1.60:1.00, calculated as the net present value of projected Net Cash Flow Available for Debt Service over the entire 25-year PPA term divided by the outstanding principal balance of all loans; (d) Minimum Debt Service Reserve Account balance equal to six months of projected debt service payments; and (e) Major Maintenance Reserve Account with annual deposits of USD 8.00 per kW of installed capacity, escalating at 3% annually. 5. INSURANCE AND RISK MITIGATION. Borrower shall maintain comprehensive insurance coverage including: (a) All-risk property insurance covering the full replacement cost of the Project, with a minimum coverage amount of USD 1,500,000,000; (b) Business interruption insurance covering lost revenue for a period of 24 months with a minimum coverage amount of USD 200,000,000; (c) General liability insurance with minimum coverage of USD 50,000,000 per occurrence and USD 100,000,000 in the aggregate; (d) Environmental liability insurance with minimum coverage of USD 25,000,000; and (e) Performance and payment bonds during construction equal to 100% of the construction contract value, provided by surety companies rated A- or better by A.M. Best.`,
    revisedText: `This Project Finance Agreement ("Agreement") is entered into as of December 10, 2024, among Clean Energy Infrastructure LLC, a Delaware limited liability company with its principal place of business at 2500 Renewable Way, Denver, Colorado 80202, United States ("Borrower"), Wells Fargo Bank, N.A., a national banking association with its principal office at 420 Montgomery Street, San Francisco, California 94104, United States, as Administrative Agent and Lead Arranger ("Administrative Agent"), Citibank, N.A., a national banking association, as Syndication Agent, and the financial institutions listed on Schedule I hereto as Lenders (collectively, the "Lenders"). This Agreement provides for the financing of the Mountain Wind Energy Project, a 750 megawatt (MW) utility-scale wind power generation facility to be constructed in Weld County, Colorado, including associated transmission infrastructure, energy storage systems, and environmental mitigation measures (the "Project"). The Project financing structure consists of the following tranches: 1. FACILITY STRUCTURE. The Lenders agree to provide financing in the aggregate principal amount of USD 1,800,000,000, consisting of: (a) Tranche A Term Loan in the principal amount of USD 1,200,000,000 with a tenor of 20 years and an interest rate of SOFR + 300 basis points, secured by a first priority lien on all Project assets; (b) Tranche B Subordinated Loan in the principal amount of USD 375,000,000 with a tenor of 22 years and an interest rate of SOFR + 475 basis points, subordinated to Tranche A; (c) Letter of Credit Facility in the amount of USD 150,000,000 to support construction and performance guarantees; and (d) Working Capital Facility in the amount of USD 75,000,000 with a tenor of 7 years for operational expenses and maintenance reserves. The Project is expected to generate approximately 2,400,000 megawatt-hours (MWh) of clean electricity annually, sufficient to power approximately 360,000 homes, and will result in the avoidance of approximately 1,200,000 metric tons of CO2 emissions per year. 2. ENVIRONMENTAL CREDITS AND REVENUE STREAMS. The Project shall generate multiple revenue streams including: (a) Power Purchase Agreement (PPA) with Xcel Energy Inc. for the sale of 600 MW of generation capacity at a fixed price of USD 52.75 per MWh for a term of 30 years, escalating at 2.8% annually; (b) Renewable Energy Certificates (RECs) sales expected to generate approximately USD 16,000,000 annually based on current Colorado REC prices of USD 6.67 per MWh; (c) Federal Production Tax Credit (PTC) equal to USD 27.50 per MWh for the first 10 years of operation, estimated at USD 660,000,000 over the credit period; (d) Colorado Renewable Energy Standard (RES) compliance payments estimated at USD 40,000,000; (e) Carbon offset credits under the Regional Greenhouse Gas Initiative (RGGI) expected to generate USD 24,000,000 annually based on current carbon credit prices of USD 20.00 per metric ton of CO2; and (f) Ancillary services revenue from grid stabilization and frequency regulation estimated at USD 6,000,000 annually. 3. CONSTRUCTION AND PERFORMANCE REQUIREMENTS. Borrower shall construct the Project in accordance with the following specifications: (a) Wind turbines with a minimum capacity factor of 45% and a performance warranty of 25 years with availability guarantees of 97%; (b) Turbine generators with a minimum efficiency rating of 95% and a 20-year warranty; (c) Advanced blade pitch control systems to optimize wind capture with variable speed operation; (d) Battery Energy Storage System (BESS) with a capacity of 300 MWh using lithium-ion technology with a minimum round-trip efficiency of 92% and a 15-year warranty; (e) 345 kV transmission line extending 25 miles to connect to the existing electrical grid at the Comanche Substation; and (f) Environmental mitigation measures including habitat restoration of 750 acres, wildlife corridors, and a USD 15,000,000 environmental mitigation fund. The Project shall achieve Commercial Operation Date (COD) no later than June 30, 2028, with liquidated damages of USD 75,000 per day for delays beyond such date. 4. FINANCIAL COVENANTS AND RATIOS. Borrower shall maintain the following financial ratios and covenants throughout the term of this Agreement: (a) Debt Service Coverage Ratio (DSCR) of not less than 1.35:1.00, calculated as the ratio of Net Cash Flow Available for Debt Service to Total Debt Service for the preceding 12-month period; (b) Loan Life Coverage Ratio (LLCR) of not less than 1.45:1.00, calculated as the net present value of projected Net Cash Flow Available for Debt Service over the remaining term of the loans divided by the outstanding principal balance of all loans; (c) Project Life Coverage Ratio (PLCR) of not less than 1.65:1.00, calculated as the net present value of projected Net Cash Flow Available for Debt Service over the entire 30-year PPA term divided by the outstanding principal balance of all loans; (d) Minimum Debt Service Reserve Account balance equal to nine months of projected debt service payments; and (e) Major Maintenance Reserve Account with annual deposits of USD 12.00 per kW of installed capacity, escalating at 3.5% annually. 5. INSURANCE AND RISK MITIGATION. Borrower shall maintain comprehensive insurance coverage including: (a) All-risk property insurance covering the full replacement cost of the Project, with a minimum coverage amount of USD 2,250,000,000; (b) Business interruption insurance covering lost revenue for a period of 36 months with a minimum coverage amount of USD 300,000,000; (c) General liability insurance with minimum coverage of USD 75,000,000 per occurrence and USD 150,000,000 in the aggregate; (d) Environmental liability insurance with minimum coverage of USD 40,000,000; and (e) Performance and payment bonds during construction equal to 100% of the construction contract value, provided by surety companies rated A- or better by A.M. Best.`,
    expectedBehavior: {
      description: 'Should handle massive energy financing document with complete project type changes, financial institution substitutions, technology specification updates, and comprehensive financial restructuring',
      criticalFeatures: [
        'Complete project change (Desert Sun Solar→Mountain Wind Energy)',
        'Technology shift (solar→wind) with all related specifications',
        'Financial institution changes (JPMorgan→Wells Fargo, BofA→Citi)',
        'Location change (California→Colorado) with regulatory implications',
        'Financial restructuring (loan amounts, terms, ratios)',
        'Environmental credit mechanism changes (ITC→PTC)'
      ],
      performanceExpectations: 'Should complete in under 230ms despite massive financial complexity',
      edgeCases: [
        'Complete technology platform changes',
        'Multiple financial institution substitutions',
        'Complex financial ratio and covenant adjustments',
        'Environmental credit mechanism changes',
        'Geographic and regulatory framework shifts',
        'Insurance coverage amount increases'
      ]
    },
    stressTestAspects: [
      'Massive energy project financing document',
      'Complete technology platform substitution',
      'Multiple financial institution changes',
      'Complex financial structuring modifications',
      'Environmental credit mechanism changes',
      'Geographic and regulatory shifts',
      'Technical specification transformations',
      'Insurance and risk mitigation adjustments'
    ]
  },
  {
    id: 'aerospace-defense-contract-ultra',
    name: 'Ultra-Complex Aerospace Defense Contract with Security Clearances',
    description: 'Comprehensive aerospace defense contract with classified technology, security clearance requirements, and international export controls',
    category: 'Aerospace Defense',
    difficulty: 'Nightmare',
    complexity: {
      wordCount: 940,
      sentenceCount: 17,
      expectedChanges: 65,
      nestingDepth: 8
    },
    originalText: `This Defense Contract Agreement ("Agreement") is entered into as of January 15, 2025, between the United States Department of Defense, acting through the United States Air Force, with offices at 1670 Air Force Pentagon, Washington, DC 20330-1670 ("Government"), and Lockheed Martin Corporation, a Maryland corporation with its principal place of business at 6801 Rockledge Drive, Bethesda, Maryland 20817, United States ("Contractor"). This Agreement governs the development, manufacture, testing, and delivery of the Next-Generation Fighter Aircraft System (NGFAS), designated as the F-35A Lightning II Block 4 upgrade program, including advanced avionics, stealth technology, weapons systems integration, and associated support equipment (the "System"). The System shall incorporate the following classified technologies and capabilities: (a) Advanced Electronically Scanned Array (AESA) radar system with a detection range of 200+ nautical miles and simultaneous tracking of 50+ targets; (b) Distributed Aperture System (DAS) providing 360-degree infrared coverage with threat detection and missile warning capabilities; (c) Electro-Optical Targeting System (EOTS) with high-resolution imaging and laser designation capabilities for precision strikes; (d) Advanced Electronic Warfare (EW) suite including radar jamming, communications disruption, and cyber warfare capabilities; (e) Integrated Mission Systems (IMS) with artificial intelligence-enhanced threat assessment and autonomous engagement protocols; and (f) Stealth technology incorporating radar-absorbing materials (RAM) and signature reduction techniques classified at the SECRET level under the National Industrial Security Program (NISP). 1. SECURITY REQUIREMENTS. All work performed under this Agreement shall comply with the following security requirements: (a) Contractor personnel shall maintain appropriate security clearances: Top Secret/Sensitive Compartmented Information (TS/SCI) clearances for 25 key personnel, Secret clearances for 150 personnel, and Confidential clearances for 300 personnel; (b) All classified work shall be performed in facilities accredited at the appropriate security level by the Defense Security Service (DSS), including Sensitive Compartmented Information Facilities (SCIFs) for TS/SCI work; (c) Contractor shall implement and maintain security procedures in accordance with the National Industrial Security Program Operating Manual (NISPOM), DoD 5220.22-M, and applicable Intelligence Community Directives (ICDs); (d) All classified information shall be marked, handled, stored, and transmitted in accordance with Executive Order 13526 and implementing directives; (e) Foreign national access to classified information is strictly prohibited except as specifically authorized in writing by the Government Security Officer (GSO); and (f) Contractor shall conduct annual security training for all personnel and maintain detailed security incident reporting procedures. 2. EXPORT CONTROL COMPLIANCE. The System and related technical data are subject to extensive export control regulations, and Contractor shall ensure full compliance with: (a) International Traffic in Arms Regulations (ITAR), 22 CFR Parts 120-130, administered by the Department of State Directorate of Defense Trade Controls (DDTC); (b) Export Administration Regulations (EAR), 15 CFR Parts 730-774, administered by the Department of Commerce Bureau of Industry and Security (BIS); (c) Foreign Assets Control Regulations administered by the Department of Treasury Office of Foreign Assets Control (OFAC); (d) Technology Transfer Control Plans (TTCP) for any international cooperation or technology sharing arrangements; and (e) Special access controls for Controlled Unclassified Information (CUI) and For Official Use Only (FOUO) technical data. Contractor shall obtain all required export licenses and shall not transfer any technical data or defense articles to foreign persons without prior written authorization from the appropriate Government authority. 3. PERFORMANCE SPECIFICATIONS. The System shall meet or exceed the following performance requirements: (a) Maximum speed of Mach 1.6 with supercruise capability at Mach 1.2 without afterburner; (b) Combat radius of 650 nautical miles with internal fuel and 4,000 pounds of internal weapons payload; (c) Maximum g-force tolerance of +9g/-3g with full weapons load; (d) Radar cross-section (RCS) of less than 0.001 square meters in X-band frequencies when viewed from frontal aspect; (e) Mission availability rate of 80% with a mean time between failures (MTBF) of 6.5 hours for mission-critical systems; (f) Electromagnetic compatibility (EMC) compliance with MIL-STD-461G for all electronic systems; (g) Environmental qualification to MIL-STD-810H for operation in temperatures from -65°F to +160°F, humidity up to 95%, and altitude up to 50,000 feet; and (h) Cybersecurity compliance with NIST Cybersecurity Framework and DoD Instruction 8500.01 for all software and network-connected systems. 4. CONTRACT VALUE AND PAYMENT SCHEDULE. The total contract value shall be USD 15,750,000,000 (Fifteen Billion Seven Hundred Fifty Million Dollars) for the development, production, and delivery of 125 aircraft systems over a period of 8 years, payable according to the following schedule: (a) 10% upon contract award and initiation of preliminary design: USD 1,575,000,000; (b) 20% upon completion of Critical Design Review (CDR) and approval of production plans: USD 3,150,000,000; (c) 30% upon completion of first flight testing and initial operational test and evaluation (IOT&E): USD 4,725,000,000; (d) 25% upon delivery of first 50 production aircraft and achievement of Initial Operational Capability (IOC): USD 3,937,500,000; (e) 10% upon delivery of remaining 75 aircraft and achievement of Full Operational Capability (FOC): USD 1,575,000,000; and (f) 5% upon completion of all deliveries and final acceptance by the Government: USD 787,500,000. 5. INTELLECTUAL PROPERTY AND DATA RIGHTS. The Government shall receive the following data rights and intellectual property: (a) Unlimited rights to all technical data and computer software developed exclusively with Government funding; (b) Government Purpose Rights to technical data and computer software developed with mixed funding (Government and Contractor); (c) Limited rights to proprietary technical data and computer software developed exclusively at private expense, with the right to use such data for Government purposes only; (d) Rights to all inventions and patents developed under this contract, with the Government receiving a royalty-free license for Government use; and (e) Special licensing arrangements for foreign military sales (FMS) and cooperative development programs with allied nations, subject to appropriate technology transfer controls and export licensing requirements. 6. TESTING AND ACCEPTANCE. The System shall undergo comprehensive testing including: (a) Component-level testing of all subsystems in accordance with applicable military standards and specifications; (b) Integration testing to verify system-level performance and interoperability; (c) Environmental testing including temperature, humidity, vibration, shock, and electromagnetic interference (EMI) testing; (d) Flight testing including envelope expansion, performance validation, and weapons integration testing; (e) Cybersecurity testing including penetration testing, vulnerability assessments, and compliance verification; (f) Operational testing conducted by Government test pilots and operational units; and (g) Live fire testing and evaluation (LFT&E) to assess survivability and lethality in combat scenarios. All testing shall be conducted in accordance with MIL-STD-882E for system safety and DoD-STD-2167A for software development and testing.`,
    revisedText: `This Defense Contract Agreement ("Agreement") is entered into as of February 28, 2025, between the United States Department of Defense, acting through the United States Navy, with offices at 2000 Navy Pentagon, Washington, DC 20350-2000 ("Government"), and Boeing Defense, Space & Security, a Delaware corporation with its principal place of business at 100 North Riverside Plaza, Chicago, Illinois 60606, United States ("Contractor"). This Agreement governs the development, manufacture, testing, and delivery of the Advanced Naval Strike Aircraft System (ANSAS), designated as the F/A-18F Super Hornet Block III+ upgrade program, including advanced avionics, electronic warfare systems, weapons systems integration, and associated support equipment (the "System"). The System shall incorporate the following classified technologies and capabilities: (a) Next-Generation Active Electronically Scanned Array (AESA) radar system with a detection range of 250+ nautical miles and simultaneous tracking of 75+ targets; (b) Advanced Infrared Search and Track (IRST) system providing 360-degree infrared coverage with threat detection and missile warning capabilities; (c) Multi-Function Advanced Data Link (MADL) with high-resolution imaging and laser designation capabilities for precision strikes; (d) Next-Generation Electronic Warfare (EW) suite including advanced radar jamming, communications disruption, and cyber warfare capabilities; (e) Integrated Combat Systems (ICS) with artificial intelligence-enhanced threat assessment and autonomous engagement protocols; and (f) Advanced signature reduction technology incorporating next-generation radar-absorbing materials (RAM) and electromagnetic signature reduction techniques classified at the TOP SECRET level under the National Industrial Security Program (NISP). 1. SECURITY REQUIREMENTS. All work performed under this Agreement shall comply with the following security requirements: (a) Contractor personnel shall maintain appropriate security clearances: Top Secret/Sensitive Compartmented Information (TS/SCI) clearances for 35 key personnel, Secret clearances for 200 personnel, and Confidential clearances for 400 personnel; (b) All classified work shall be performed in facilities accredited at the appropriate security level by the Defense Counterintelligence and Security Agency (DCSA), including Sensitive Compartmented Information Facilities (SCIFs) for TS/SCI work; (c) Contractor shall implement and maintain security procedures in accordance with the National Industrial Security Program Operating Manual (NISPOM), DoD 5220.22-M, and applicable Intelligence Community Directives (ICDs); (d) All classified information shall be marked, handled, stored, and transmitted in accordance with Executive Order 13526 and implementing directives; (e) Foreign national access to classified information is strictly prohibited except as specifically authorized in writing by the Government Security Officer (GSO); and (f) Contractor shall conduct quarterly security training for all personnel and maintain detailed security incident reporting procedures. 2. EXPORT CONTROL COMPLIANCE. The System and related technical data are subject to extensive export control regulations, and Contractor shall ensure full compliance with: (a) International Traffic in Arms Regulations (ITAR), 22 CFR Parts 120-130, administered by the Department of State Directorate of Defense Trade Controls (DDTC); (b) Export Administration Regulations (EAR), 15 CFR Parts 730-774, administered by the Department of Commerce Bureau of Industry and Security (BIS); (c) Foreign Assets Control Regulations administered by the Department of Treasury Office of Foreign Assets Control (OFAC); (d) Technology Transfer Control Plans (TTCP) for any international cooperation or technology sharing arrangements; and (e) Special access controls for Controlled Unclassified Information (CUI) and For Official Use Only (FOUO) technical data. Contractor shall obtain all required export licenses and shall not transfer any technical data or defense articles to foreign persons without prior written authorization from the appropriate Government authority. 3. PERFORMANCE SPECIFICATIONS. The System shall meet or exceed the following performance requirements: (a) Maximum speed of Mach 1.8 with supercruise capability at Mach 1.4 without afterburner; (b) Combat radius of 750 nautical miles with internal fuel and 6,000 pounds of internal weapons payload; (c) Maximum g-force tolerance of +9g/-4g with full weapons load; (d) Radar cross-section (RCS) of less than 0.0005 square meters in X-band frequencies when viewed from frontal aspect; (e) Mission availability rate of 85% with a mean time between failures (MTBF) of 8.0 hours for mission-critical systems; (f) Electromagnetic compatibility (EMC) compliance with MIL-STD-461H for all electronic systems; (g) Environmental qualification to MIL-STD-810H for operation in temperatures from -65°F to +160°F, humidity up to 95%, and altitude up to 55,000 feet; and (h) Cybersecurity compliance with NIST Cybersecurity Framework 2.0 and DoD Instruction 8500.01 for all software and network-connected systems. 4. CONTRACT VALUE AND PAYMENT SCHEDULE. The total contract value shall be USD 22,500,000,000 (Twenty-Two Billion Five Hundred Million Dollars) for the development, production, and delivery of 180 aircraft systems over a period of 10 years, payable according to the following schedule: (a) 8% upon contract award and initiation of preliminary design: USD 1,800,000,000; (b) 22% upon completion of Critical Design Review (CDR) and approval of production plans: USD 4,950,000,000; (c) 35% upon completion of first flight testing and initial operational test and evaluation (IOT&E): USD 7,875,000,000; (d) 25% upon delivery of first 75 production aircraft and achievement of Initial Operational Capability (IOC): USD 5,625,000,000; (e) 7% upon delivery of remaining 105 aircraft and achievement of Full Operational Capability (FOC): USD 1,575,000,000; and (f) 3% upon completion of all deliveries and final acceptance by the Government: USD 675,000,000. 5. INTELLECTUAL PROPERTY AND DATA RIGHTS. The Government shall receive the following data rights and intellectual property: (a) Unlimited rights to all technical data and computer software developed exclusively with Government funding; (b) Government Purpose Rights to technical data and computer software developed with mixed funding (Government and Contractor); (c) Limited rights to proprietary technical data and computer software developed exclusively at private expense, with the right to use such data for Government purposes only; (d) Rights to all inventions and patents developed under this contract, with the Government receiving a royalty-free license for Government use; and (e) Special licensing arrangements for foreign military sales (FMS) and cooperative development programs with allied nations, subject to appropriate technology transfer controls and export licensing requirements. 6. TESTING AND ACCEPTANCE. The System shall undergo comprehensive testing including: (a) Component-level testing of all subsystems in accordance with applicable military standards and specifications; (b) Integration testing to verify system-level performance and interoperability; (c) Environmental testing including temperature, humidity, vibration, shock, and electromagnetic interference (EMI) testing; (d) Flight testing including envelope expansion, performance validation, and weapons integration testing; (e) Cybersecurity testing including penetration testing, vulnerability assessments, and compliance verification; (f) Operational testing conducted by Government test pilots and operational units; and (g) Live fire testing and evaluation (LFT&E) to assess survivability and lethality in combat scenarios. All testing shall be conducted in accordance with MIL-STD-882E for system safety and DoD-STD-2167A for software development and testing.`,
    expectedBehavior: {
      description: 'Should handle ultra-complex defense contract with complete program changes, contractor substitutions, technical specification upgrades, and massive financial restructuring',
      criticalFeatures: [
        'Service branch change (Air Force→Navy)',
        'Contractor substitution (Lockheed Martin→Boeing)',
        'Aircraft program change (F-35A→F/A-18F)',
        'Technical system upgrades across all specifications',
        'Security clearance requirement increases',
        'Contract value increase and restructuring'
      ],
      performanceExpectations: 'Should complete in under 350ms despite extreme defense contract complexity',
      edgeCases: [
        'Multiple military service and contractor changes',
        'Complex technical specification upgrades',
        'Security clearance and classification level changes',
        'Massive financial restructuring with new payment schedules',
        'Military standard and regulation updates',
        'Performance requirement enhancements'
      ]
    },
    stressTestAspects: [
      'Ultra-complex defense contract document',
      'Complete military program transformation',
      'Major contractor and service branch changes',
      'Extensive technical specification upgrades',
      'Security clearance and classification modifications',
      'Massive financial restructuring',
      'Military standard and regulation updates',
      'Complex performance requirement changes',
      'Multi-level classification handling'
    ]
  },
  {
    id: 'global-supply-chain-ultra',
    name: 'Ultra-Complex Global Supply Chain Master Agreement',
    description: 'Comprehensive global supply chain agreement with multi-tier suppliers, complex logistics, and international trade compliance',
    category: 'Global Supply Chain',
    difficulty: 'Nightmare',
    complexity: {
      wordCount: 880,
      sentenceCount: 15,
      expectedChanges: 55,
      nestingDepth: 7
    },
    originalText: `This Global Supply Chain Master Agreement ("Agreement") is entered into as of March 10, 2025, among Apple Inc., a California corporation with its principal place of business at One Apple Park Way, Cupertino, California 95014, United States ("Buyer"), Foxconn Technology Group, a Taiwan corporation with its principal place of business at No. 2, Zihyou Street, Tucheng District, New Taipei City 236, Taiwan ("Primary Supplier"), Samsung Electronics Co., Ltd., a South Korean corporation with its principal place of business at 129 Samsung-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do 16677, South Korea ("Secondary Supplier"), and TSMC (Taiwan Semiconductor Manufacturing Company Limited), a Taiwan corporation with its principal place of business at No. 8, Li-Hsin Road 6, Hsinchu Science Park, Hsinchu 30078, Taiwan ("Tertiary Supplier") (collectively, the "Suppliers"). This Agreement governs the global supply chain for the production and delivery of consumer electronics components, including but not limited to semiconductors, display panels, battery systems, camera modules, and final assembly services for the iPhone 16 Pro product line and associated accessories (the "Products"). The global supply chain network encompasses manufacturing facilities, logistics hubs, and distribution centers across the following regions: (a) Asia-Pacific: Primary manufacturing facilities in Shenzhen, China (Foxconn), Gumi, South Korea (Samsung), and Hsinchu, Taiwan (TSMC), with secondary facilities in Vietnam, Thailand, and Malaysia; (b) Europe: Distribution centers in Dublin, Ireland, and logistics hubs in the Netherlands and Germany for European market supply; (c) Americas: Final assembly facilities in Austin, Texas, and distribution centers in California, with logistics support from facilities in Mexico and Brazil; and (d) Emerging Markets: Regional distribution centers in India, Turkey, and South Africa to support growing market demand. 1. SUPPLY CHAIN STRUCTURE AND CAPACITY. The Suppliers shall provide the following production capacity and supply chain services: (a) Primary Supplier (Foxconn) shall provide final assembly services with a capacity of 150,000 units per day across three shifts, quality control testing, packaging, and initial logistics coordination; (b) Secondary Supplier (Samsung) shall provide OLED display panels with a monthly capacity of 25,000,000 units, camera sensor modules with a capacity of 30,000,000 units monthly, and NAND flash memory components; (c) Tertiary Supplier (TSMC) shall provide A18 Pro system-on-chip (SoC) processors manufactured using 3-nanometer process technology with a monthly capacity of 20,000,000 units and advanced packaging services; (d) Tier 2 suppliers shall provide battery cells (CATL - 15,000,000 units monthly), aluminum chassis components (Catcher Technology - 10,000,000 units monthly), and precision mechanical components; and (e) Tier 3 suppliers shall provide raw materials including rare earth elements, lithium, cobalt, and specialized alloys sourced from certified conflict-free suppliers. 2. LOGISTICS AND TRANSPORTATION. The global logistics network shall operate according to the following specifications: (a) Ocean freight: Primary shipping routes from Asia to Long Beach, California (14-day transit), Rotterdam, Netherlands (21-day transit), and Felixstowe, UK (23-day transit) using container vessels with minimum capacity of 10,000 TEU; (b) Air freight: Express delivery services for high-priority components and finished goods using dedicated cargo aircraft with delivery times of 48 hours from Asia to North America and 72 hours to Europe; (c) Ground transportation: Dedicated truck fleets for regional distribution with GPS tracking, temperature control for sensitive components, and security protocols for high-value shipments; (d) Warehousing: Automated distribution centers with minimum storage capacity of 500,000 square feet, robotic picking systems, and inventory management systems integrated with Buyer's enterprise resource planning (ERP) systems; and (e) Last-mile delivery: Partnership with regional carriers for consumer delivery with tracking capabilities and delivery confirmation systems. 3. QUALITY CONTROL AND COMPLIANCE. All Suppliers shall maintain the following quality standards and compliance requirements: (a) ISO 9001:2015 quality management system certification with annual third-party audits; (b) ISO 14001:2015 environmental management system certification with quarterly environmental impact assessments; (c) OHSAS 18001 occupational health and safety management system certification with monthly safety audits; (d) Conflict minerals compliance in accordance with Section 1502 of the Dodd-Frank Act and OECD Due Diligence Guidance; (e) Responsible Business Alliance (RBA) Code of Conduct compliance with annual on-site audits and corrective action plans; (f) Statistical process control (SPC) with Six Sigma methodology achieving defect rates below 3.4 parts per million (PPM); and (g) Traceability systems enabling component-level tracking from raw materials through final delivery to end customers. 4. PRICING AND PAYMENT TERMS. The pricing structure and payment terms shall be as follows: (a) Primary Supplier assembly services: USD 45.00 per unit for standard configuration, USD 52.00 per unit for Pro Max configuration, with quarterly price reviews based on volume commitments and material cost fluctuations; (b) Secondary Supplier display panels: USD 85.00 per OLED panel for 6.1-inch displays, USD 110.00 per panel for 6.7-inch displays, with annual price reductions of 5% subject to technology improvements; (c) Tertiary Supplier SoC processors: USD 120.00 per A18 Pro chip, USD 95.00 per A18 chip, with pricing tied to semiconductor industry benchmarks and yield improvements; (d) Payment terms: Net 45 days from delivery acceptance with early payment discounts of 2% for payments within 15 days; (e) Volume commitments: Minimum annual volumes of 75,000,000 units for iPhone 16 Pro, 45,000,000 units for iPhone 16 Pro Max, with penalties of 5% price increase for volume shortfalls exceeding 10%; and (f) Currency hedging: All transactions denominated in USD with quarterly foreign exchange rate adjustments for non-USD cost components. 5. INTELLECTUAL PROPERTY AND TECHNOLOGY TRANSFER. The parties agree to the following intellectual property arrangements: (a) Buyer retains all rights to product designs, specifications, and proprietary technologies provided to Suppliers; (b) Suppliers grant Buyer non-exclusive rights to manufacturing process improvements developed during the performance of this Agreement; (c) Joint development projects for next-generation technologies shall result in shared intellectual property rights with licensing terms to be negotiated separately; (d) Technology transfer restrictions: Suppliers shall not share Buyer's proprietary information with competitors or use such information for non-Buyer products without written consent; and (e) Trade secret protection: All parties shall implement appropriate safeguards to protect confidential information including employee confidentiality agreements, secure data transmission protocols, and physical security measures. 6. RISK MANAGEMENT AND BUSINESS CONTINUITY. The supply chain shall incorporate comprehensive risk management measures: (a) Dual sourcing for all critical components with secondary suppliers capable of assuming 100% of volume within 90 days; (b) Strategic inventory reserves: 45-day supply of finished goods, 60-day supply of critical components, and 90-day supply of long-lead-time materials; (c) Force majeure planning: Detailed contingency plans for natural disasters, political instability, trade disputes, and pandemic-related disruptions; (d) Cybersecurity: Implementation of advanced threat detection systems, regular penetration testing, and compliance with NIST Cybersecurity Framework; (e) Insurance coverage: Comprehensive supply chain insurance including business interruption, cargo insurance, and cyber liability coverage with minimum limits of USD 1,000,000,000; and (f) Regular business continuity testing: Quarterly simulations of supply chain disruption scenarios with documented response procedures and recovery time objectives.`,
    revisedText: `This Global Supply Chain Master Agreement ("Agreement") is entered into as of April 25, 2025, among Microsoft Corporation, a Washington corporation with its principal place of business at One Microsoft Way, Redmond, Washington 98052, United States ("Buyer"), Quanta Computer Inc., a Taiwan corporation with its principal place of business at No. 4, Wen Ming 1st Street, Guishan District, Taoyuan City 333, Taiwan ("Primary Supplier"), LG Electronics Inc., a South Korean corporation with its principal place of business at 128 Yeoui-daero, Yeongdeungpo-gu, Seoul 07336, South Korea ("Secondary Supplier"), and Intel Corporation, a Delaware corporation with its principal place of business at 2200 Mission College Boulevard, Santa Clara, California 95054, United States ("Tertiary Supplier") (collectively, the "Suppliers"). This Agreement governs the global supply chain for the production and delivery of enterprise computing hardware, including but not limited to processors, memory modules, storage systems, networking equipment, and final assembly services for the Surface Pro 11 product line and associated enterprise accessories (the "Products"). The global supply chain network encompasses manufacturing facilities, logistics hubs, and distribution centers across the following regions: (a) Asia-Pacific: Primary manufacturing facilities in Taoyuan, Taiwan (Quanta), Seoul, South Korea (LG), and Penang, Malaysia (Intel), with secondary facilities in Singapore, Philippines, and India; (b) Europe: Distribution centers in Amsterdam, Netherlands, and logistics hubs in Poland and Czech Republic for European market supply; (c) Americas: Final assembly facilities in Guadalajara, Mexico, and distribution centers in Washington State, with logistics support from facilities in Canada and Costa Rica; and (d) Emerging Markets: Regional distribution centers in Brazil, Egypt, and Nigeria to support growing enterprise market demand. 1. SUPPLY CHAIN STRUCTURE AND CAPACITY. The Suppliers shall provide the following production capacity and supply chain services: (a) Primary Supplier (Quanta) shall provide final assembly services with a capacity of 200,000 units per day across four shifts, quality control testing, packaging, and initial logistics coordination; (b) Secondary Supplier (LG) shall provide OLED display panels with a monthly capacity of 35,000,000 units, advanced camera sensor modules with a capacity of 40,000,000 units monthly, and high-speed memory components; (c) Tertiary Supplier (Intel) shall provide Intel Core Ultra processors manufactured using 4-nanometer process technology with a monthly capacity of 30,000,000 units and advanced packaging services; (d) Tier 2 suppliers shall provide battery cells (BYD - 20,000,000 units monthly), magnesium alloy chassis components (Foxconn - 15,000,000 units monthly), and precision mechanical components; and (e) Tier 3 suppliers shall provide raw materials including rare earth elements, lithium, cobalt, and specialized alloys sourced from certified conflict-free suppliers. 2. LOGISTICS AND TRANSPORTATION. The global logistics network shall operate according to the following specifications: (a) Ocean freight: Primary shipping routes from Asia to Seattle, Washington (12-day transit), Hamburg, Germany (19-day transit), and Southampton, UK (21-day transit) using container vessels with minimum capacity of 15,000 TEU; (b) Air freight: Express delivery services for high-priority components and finished goods using dedicated cargo aircraft with delivery times of 36 hours from Asia to North America and 60 hours to Europe; (c) Ground transportation: Dedicated truck fleets for regional distribution with GPS tracking, temperature control for sensitive components, and security protocols for high-value shipments; (d) Warehousing: Automated distribution centers with minimum storage capacity of 750,000 square feet, robotic picking systems, and inventory management systems integrated with Buyer's enterprise resource planning (ERP) systems; and (e) Last-mile delivery: Partnership with regional carriers for enterprise delivery with tracking capabilities and delivery confirmation systems. 3. QUALITY CONTROL AND COMPLIANCE. All Suppliers shall maintain the following quality standards and compliance requirements: (a) ISO 9001:2015 quality management system certification with semi-annual third-party audits; (b) ISO 14001:2015 environmental management system certification with monthly environmental impact assessments; (c) ISO 45001:2018 occupational health and safety management system certification with bi-weekly safety audits; (d) Conflict minerals compliance in accordance with Section 1502 of the Dodd-Frank Act and OECD Due Diligence Guidance; (e) Responsible Business Alliance (RBA) Code of Conduct compliance with semi-annual on-site audits and corrective action plans; (f) Statistical process control (SPC) with Six Sigma methodology achieving defect rates below 2.5 parts per million (PPM); and (g) Traceability systems enabling component-level tracking from raw materials through final delivery to end customers. 4. PRICING AND PAYMENT TERMS. The pricing structure and payment terms shall be as follows: (a) Primary Supplier assembly services: USD 65.00 per unit for standard configuration, USD 78.00 per unit for Pro configuration, with monthly price reviews based on volume commitments and material cost fluctuations; (b) Secondary Supplier display panels: USD 125.00 per OLED panel for 13-inch displays, USD 155.00 per panel for 15-inch displays, with annual price reductions of 7% subject to technology improvements; (c) Tertiary Supplier processors: USD 180.00 per Intel Core Ultra chip, USD 145.00 per Intel Core chip, with pricing tied to semiconductor industry benchmarks and yield improvements; (d) Payment terms: Net 30 days from delivery acceptance with early payment discounts of 3% for payments within 10 days; (e) Volume commitments: Minimum annual volumes of 50,000,000 units for Surface Pro 11, 25,000,000 units for Surface Pro 11 Enterprise, with penalties of 7% price increase for volume shortfalls exceeding 15%; and (f) Currency hedging: All transactions denominated in USD with monthly foreign exchange rate adjustments for non-USD cost components. 5. INTELLECTUAL PROPERTY AND TECHNOLOGY TRANSFER. The parties agree to the following intellectual property arrangements: (a) Buyer retains all rights to product designs, specifications, and proprietary technologies provided to Suppliers; (b) Suppliers grant Buyer non-exclusive rights to manufacturing process improvements developed during the performance of this Agreement; (c) Joint development projects for next-generation technologies shall result in shared intellectual property rights with licensing terms to be negotiated separately; (d) Technology transfer restrictions: Suppliers shall not share Buyer's proprietary information with competitors or use such information for non-Buyer products without written consent; and (e) Trade secret protection: All parties shall implement appropriate safeguards to protect confidential information including employee confidentiality agreements, secure data transmission protocols, and physical security measures. 6. RISK MANAGEMENT AND BUSINESS CONTINUITY. The supply chain shall incorporate comprehensive risk management measures: (a) Dual sourcing for all critical components with secondary suppliers capable of assuming 100% of volume within 60 days; (b) Strategic inventory reserves: 60-day supply of finished goods, 75-day supply of critical components, and 120-day supply of long-lead-time materials; (c) Force majeure planning: Detailed contingency plans for natural disasters, political instability, trade disputes, and pandemic-related disruptions; (d) Cybersecurity: Implementation of advanced threat detection systems, regular penetration testing, and compliance with NIST Cybersecurity Framework 2.0; (e) Insurance coverage: Comprehensive supply chain insurance including business interruption, cargo insurance, and cyber liability coverage with minimum limits of USD 1,500,000,000; and (f) Regular business continuity testing: Monthly simulations of supply chain disruption scenarios with documented response procedures and recovery time objectives.`,
    expectedBehavior: {
      description: 'Should handle ultra-complex global supply chain document with complete buyer changes, supplier substitutions, product line transformations, and comprehensive operational restructuring',
      criticalFeatures: [
        'Complete buyer change (Apple→Microsoft)',
        'Product line transformation (iPhone→Surface Pro)',
        'All supplier substitutions (Foxconn→Quanta, Samsung→LG, TSMC→Intel)',
        'Geographic hub relocations and capacity changes',
        'Pricing structure and payment term modifications',
        'Quality standard and compliance requirement updates'
      ],
      performanceExpectations: 'Should complete in under 280ms despite extreme supply chain complexity',
      edgeCases: [
        'Multiple entity and geographic changes',
        'Complete product line and technology transformations',
        'Complex capacity and volume commitment changes',
        'Pricing structure and payment term modifications',
        'Quality standard and audit frequency changes',
        'Risk management and inventory level adjustments'
      ]
    },
    stressTestAspects: [
      'Ultra-complex global supply chain document',
      'Complete buyer and product line transformation',
      'Multiple supplier and geographic changes',
      'Complex capacity and logistics modifications',
      'Comprehensive pricing and payment restructuring',
      'Quality standard and compliance updates',
      'Risk management and inventory adjustments',
      'Multi-tier supplier network changes',
      'International trade and logistics modifications'
    ]
  }
];

interface ExtremeTestSuiteProps {
  onLoadTest: (originalText: string, revisedText: string) => void;
}

export const ExtremeTestSuite: React.FC<ExtremeTestSuiteProps> = ({ onLoadTest }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [runningTests, setRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: ComparisonResult & { executionTime: number } }>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const difficulties = ['All', 'Extreme', 'Ultra', 'Nightmare'];
  const categories = ['All', ...Array.from(new Set(EXTREME_TEST_CASES.map(test => test.category)))];
  
  const filteredTests = EXTREME_TEST_CASES.filter(test => 
    (selectedDifficulty === 'All' || test.difficulty === selectedDifficulty) &&
    (selectedCategory === 'All' || test.category === selectedCategory)
  );

  const runAllTests = async () => {
    setRunningTests(true);
    const results: { [key: string]: ComparisonResult & { executionTime: number } } = {};
    
    for (const testCase of EXTREME_TEST_CASES) {
      try {
        const startTime = performance.now();
        const result = MyersAlgorithm.compare(testCase.originalText, testCase.revisedText);
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        results[testCase.id] = { ...result, executionTime };
        
        // Longer delay for extreme tests to show progress
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Extreme test ${testCase.id} failed:`, error);
      }
    }
    
    setTestResults(results);
    setRunningTests(false);
  };

  const runSingleTest = async (testCase: ExtremeTestCase) => {
    try {
      const startTime = performance.now();
      const result = MyersAlgorithm.compare(testCase.originalText, testCase.revisedText);
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      setTestResults(prev => ({ 
        ...prev, 
        [testCase.id]: { ...result, executionTime }
      }));
    } catch (error) {
      console.error(`Extreme test ${testCase.id} failed:`, error);
    }
  };

  const getTestStatus = (testId: string) => {
    const result = testResults[testId];
    if (!result) return 'pending';
    
    // More sophisticated status based on extreme complexity
    if (result.stats.totalChanges === 0) return 'warning';
    if (result.executionTime > 300) return 'slow';
    if (result.executionTime > 150) return 'medium';
    return 'passed';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Extreme': return 'bg-red-100 text-red-800 border-red-300';
      case 'Ultra': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Nightmare': return 'bg-black text-white border-gray-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'medium': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'slow': return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getComplexityMetrics = () => {
    const totalWords = EXTREME_TEST_CASES.reduce((sum, test) => sum + test.complexity.wordCount, 0);
    const avgWords = Math.round(totalWords / EXTREME_TEST_CASES.length);
    const totalExpectedChanges = EXTREME_TEST_CASES.reduce((sum, test) => sum + test.complexity.expectedChanges, 0);
    const avgChanges = Math.round(totalExpectedChanges / EXTREME_TEST_CASES.length);
    
    return { totalWords, avgWords, totalExpectedChanges, avgChanges };
  };

  const complexityMetrics = getComplexityMetrics();

  return (
    <div className="bg-gradient-to-r from-red-50 via-purple-50 to-indigo-50 border-2 border-red-300 rounded-lg overflow-hidden mb-6">
      <div 
        className="bg-gradient-to-r from-red-100 via-purple-100 to-indigo-100 border-b-2 border-red-300 p-4 cursor-pointer hover:from-red-200 hover:via-purple-200 hover:to-indigo-200 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-red-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-red-600" />
            )}
            <Flame className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
                Extreme Stress Test Suite
                <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                  ULTRA-COMPLEX TESTING
                </span>
              </h3>
              <p className="text-sm text-red-700">
                10 ultra-complex, longer test cases designed to push the algorithm to its absolute limits
              </p>
              <div className="flex items-center gap-4 mt-1 text-xs text-red-600">
                <span>📊 Avg: {complexityMetrics.avgWords} words, {complexityMetrics.avgChanges} expected changes</span>
                <span>🔥 Total: {complexityMetrics.totalWords.toLocaleString()} words across all tests</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                ⚠️ This extreme testing module is completely segregated and removable before production
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {Object.keys(testResults).length > 0 && (
              <div className="text-sm text-red-700 bg-white/50 px-3 py-1 rounded-lg">
                {Object.keys(testResults).length}/{EXTREME_TEST_CASES.length} extreme tests completed
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                runAllTests();
              }}
              disabled={runningTests}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
            >
              <Flame className="w-4 h-4" />
              {runningTests ? 'Running Extreme Tests...' : 'Run All Extreme Tests'}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          {/* Filter Controls */}
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Filter by Difficulty Level:
                </label>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        selectedDifficulty === difficulty
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-red-700 hover:bg-red-100 border border-red-200'
                      }`}
                    >
                      {difficulty}
                      {difficulty !== 'All' && (
                        <span className="ml-1 text-xs opacity-75">
                          ({EXTREME_TEST_CASES.filter(t => t.difficulty === difficulty).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Filter by Category:
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 3).map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-red-700 hover:bg-red-100 border border-red-200'
                      }`}
                    >
                      {category}
                      {category !== 'All' && (
                        <span className="ml-1 text-xs opacity-75">
                          ({EXTREME_TEST_CASES.filter(t => t.category === category).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {categories.length > 3 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.slice(3).map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          selectedCategory === category
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-red-700 hover:bg-red-100 border border-red-200'
                        }`}
                      >
                        {category}
                        <span className="ml-1 text-xs opacity-75">
                          ({EXTREME_TEST_CASES.filter(t => t.category === category).length})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Test Cases Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTests.map((testCase) => {
              const result = testResults[testCase.i];
              const status = getTestStatus(testCase.id);
              
              return (
                <div key={testCase.id} className="bg-white border-2 border-red-100 rounded-lg p-5 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{testCase.name}</h4>
                        {result && getStatusIcon(status)}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(testCase.difficulty)}`}>
                          {testCase.difficulty}
                        </span>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          {testCase.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{testCase.description}</p>
                      
                      {/* Complexity Metrics */}
                      <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div><strong>Words:</strong> {testCase.complexity.wordCount.toLocaleString()}</div>
                          <div><strong>Sentences:</strong> {testCase.complexity.sentenceCount}</div>
                          <div><strong>Expected Changes:</strong> {testCase.complexity.expectedChanges}</div>
                          <div><strong>Nesting Depth:</strong> {testCase.complexity.nestingDepth}</div>
                        </div>
                      </div>
                      
                      {/* Stress Test Aspects */}
                      <div className="mb-3">
                        <h5 className="text-xs font-medium text-red-700 mb-1">Extreme Stress Aspects:</h5>
                        <div className="flex flex-wrap gap-1">
                          {testCase.stressTestAspects.slice(0, 4).map((aspect, index) => (
                            <span key={index} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded">
                              {aspect}
                            </span>
                          ))}
                          {testCase.stressTestAspects.length > 4 && (
                            <span className="text-xs text-red-500">
                              +{testCase.stressTestAspects.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Results */}
                      {result && (
                        <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-2 rounded">
                          <div className="grid grid-cols-2 gap-2">
                            <div>Changes: +{result.stats.additions} -{result.stats.deletions}</div>
                            <div>Substitutions: {result.stats.changed}</div>
                            <div>Total elements: {result.stats.additions + result.stats.deletions + result.stats.unchanged + result.stats.changed}</div>
                            <div className={`font-medium ${result.executionTime > 200 ? 'text-red-600' : result.executionTime > 100 ? 'text-orange-600' : 'text-green-600'}`}>
                              Execution: {result.executionTime.toFixed(1)}ms
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            Performance: {testCase.expectedBehavior.performanceExpectations}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => onLoadTest(testCase.originalText, testCase.revisedText)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Load Extreme Test
                    </button>
                    <button
                      onClick={() => runSingleTest(testCase)}
                      className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                    >
                      Test
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Extreme Test Results Summary */}
          {Object.keys(testResults).length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-red-50 via-purple-50 to-indigo-50 rounded-lg border-2 border-red-200">
              <h4 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Extreme Test Results Analysis
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div className="bg-white p-3 rounded border border-red-100">
                  <div className="text-red-600 font-medium">Extreme Tests</div>
                  <div className="text-2xl font-bold text-red-800">{Object.keys(testResults).length}</div>
                  <div className="text-xs text-red-500">of {EXTREME_TEST_CASES.length} ultra-complex</div>
                </div>
                <div className="bg-white p-3 rounded border border-red-100">
                  <div className="text-red-600 font-medium">Avg Execution</div>
                  <div className="text-2xl font-bold text-red-800">
                    {Object.values(testResults).length > 0 
                      ? (Object.values(testResults).reduce((sum, r) => sum + r.executionTime, 0) / Object.values(testResults).length).toFixed(1)
                      : '0'
                    }ms
                  </div>
                  <div className="text-xs text-red-500">per extreme test</div>
                </div>
                <div className="bg-white p-3 rounded border border-red-100">
                  <div className="text-red-600 font-medium">Total Changes</div>
                  <div className="text-2xl font-bold text-red-800">
                    {Object.values(testResults).reduce((sum, r) => sum + r.stats.totalChanges, 0)}
                  </div>
                  <div className="text-xs text-red-500">across all extreme tests</div>
                </div>
                <div className="bg-white p-3 rounded border border-red-100">
                  <div className="text-red-600 font-medium">Substitutions</div>
                  <div className="text-2xl font-bold text-red-800">
                    {Object.values(testResults).reduce((sum, r) => sum + r.stats.changed, 0)}
                  </div>
                  <div className="text-xs text-red-500">intelligent groupings</div>
                </div>
              </div>
              
              {/* Performance Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded border border-red-100">
                  <h5 className="text-sm font-medium text-red-700 mb-2">Performance Distribution</h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-green-600 font-medium">Fast (&lt;100ms):</span>
                      <span>{Object.values(testResults).filter(r => r.executionTime < 100).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600 font-medium">Medium (100-200ms):</span>
                      <span>{Object.values(testResults).filter(r => r.executionTime >= 100 && r.executionTime < 200).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-600 font-medium">Slow (200-300ms):</span>
                      <span>{Object.values(testResults).filter(r => r.executionTime >= 200 && r.executionTime < 300).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600 font-medium">Very Slow (&gt;300ms):</span>
                      <span>{Object.values(testResults).filter(r => r.executionTime >= 300).length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded border border-red-100">
                  <h5 className="text-sm font-medium text-red-700 mb-2">Complexity Handling</h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Total Words Processed:</span>
                      <span className="font-medium">{Object.keys(testResults).reduce((sum, id) => {
                        const test = EXTREME_TEST_CASES.find(t => t.id === id);
                        return sum + (test ? test.complexity.wordCount : 0);
                      }, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Changes per Test:</span>
                      <span className="font-medium">
                        {Object.values(testResults).length > 0 
                          ? (Object.values(testResults).reduce((sum, r) => sum + r.stats.totalChanges, 0) / Object.values(testResults).length).toFixed(1)
                          : '0'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Execution Time:</span>
                      <span className="font-medium">
                        {Object.values(testResults).length > 0 
                          ? Math.max(...Object.values(testResults).map(r => r.executionTime)).toFixed(1)
                          : '0'
                        }ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning Notice */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-yellow-800">Extreme Testing Module Notice</h5>
                <p className="text-sm text-yellow-700 mt-1">
                  This Extreme Test Suite contains ultra-complex, longer test cases designed to push the algorithm to its absolute limits. 
                  It is completely segregated from the main application and can be easily removed before production deployment.
                </p>
                <p className="text-xs text-yellow-600 mt-2">
                  <strong>File Location:</strong> <code>src/testing/ExtremeTestSuite.tsx</code> - Remove entire testing directory for production.
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  <strong>Performance Note:</strong> These tests are intentionally complex and may take longer to execute than typical use cases.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};