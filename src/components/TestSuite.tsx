import React, { useState } from 'react';
import { Play, ChevronDown, ChevronRight, FileText, CheckCircle, XCircle } from 'lucide-react';
import { MyersAlgorithm } from '../algorithms/MyersAlgorithm';
import { ComparisonResult } from '../types';

interface TestCase {
  id: string;
  name: string;
  description: string;
  category: string;
  originalText: string;
  revisedText: string;
  expectedChanges?: {
    additions: number;
    deletions: number;
    description: string;
  };
}

const TEST_CASES: TestCase[] = [
  {
    id: 'address-substitution-test',
    name: 'Address Substitution - Karpathy Test',
    description: 'Test case for Karpathy-inspired chunking with address substitutions',
    category: 'Structured Data',
    originalText: `Apple Inc., a California corporation with its principal place of business at One Apple Park Way, Cupertino, California 95014, United States ("Apple"), and Taiwan Semiconductor Manufacturing Company Limited, a Taiwan corporation with its principal place of business at No. 8, Li-Hsin Road 6, Hsinchu Science Park, Hsinchu 30078, Taiwan ("Primary Supplier")`,
    revisedText: `Apple Inc., a California corporation with its principal place of business at One Apple Park Way, Redmond, Washington 98052, United States ("Apple"), and Taiwan Semiconductor Manufacturing Company Limited, a Taiwan corporation with its principal place of business at 2200 Mission College Boulevard, Santa Clara, California 95054, United States ("Primary Supplier")`
  },
  {
    id: 'nda-basic',
    name: 'NDA - Basic Terms Amendment',
    description: 'Simple confidentiality agreement with term changes',
    category: 'Confidentiality',
    originalText: `This Non-Disclosure Agreement ("Agreement") is entered into on January 15, 2024, between TechCorp Inc., a Delaware corporation ("Disclosing Party"), and DataSoft LLC, a California limited liability company ("Receiving Party").

The Receiving Party agrees to hold in confidence all Confidential Information disclosed by the Disclosing Party for a period of three (3) years from the date of disclosure. Confidential Information includes all technical data, trade secrets, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances, or other business information.

This Agreement shall be governed by the laws of the State of Delaware. Any disputes arising under this Agreement shall be resolved through binding arbitration in Wilmington, Delaware.`,
    revisedText: `This Non-Disclosure Agreement ("Agreement") is entered into on January 15, 2024, between TechCorp Inc., a Delaware corporation ("Disclosing Party"), and DataSoft LLC, a California limited liability company ("Receiving Party").

The Receiving Party agrees to hold in confidence all Confidential Information disclosed by the Disclosing Party for a period of five (5) years from the date of disclosure. Confidential Information includes all technical data, trade secrets, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances, proprietary algorithms, or other business information.

This Agreement shall be governed by the laws of the State of California. Any disputes arising under this Agreement shall be resolved through binding arbitration in San Francisco, California.`
  },
  {
    id: 'contract-payment',
    name: 'Service Agreement - Payment Terms',
    description: 'Professional services contract with payment modifications',
    category: 'Commercial',
    originalText: `WHEREAS, Client desires to engage Contractor to provide software development services; and WHEREAS, Contractor has the expertise and resources to perform such services;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows: Contractor shall provide software development services as described in Exhibit A attached hereto. Client shall pay Contractor a total fee of $50,000, payable in monthly installments of $10,000 over five (5) months, with the first payment due within thirty (30) days of execution of this Agreement.

Either party may terminate this Agreement upon thirty (30) days written notice. Upon termination, Client shall pay Contractor for all services performed through the date of termination at the rate of $150 per hour.`,
    revisedText: `WHEREAS, Client desires to engage Contractor to provide software development and consulting services; and WHEREAS, Contractor has the expertise and resources to perform such services;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows: Contractor shall provide software development services as described in Exhibit A attached hereto. Client shall pay Contractor a total fee of $75,000, payable in bi-weekly installments of $6,250 over twelve (12) installments, with the first payment due within fifteen (15) days of execution of this Agreement.

Either party may terminate this Agreement upon fourteen (14) days written notice. Upon termination, Client shall pay Contractor for all services performed through the date of termination at the rate of $175 per hour.`
  },
  {
    id: 'lease-commercial',
    name: 'Commercial Lease - Rent Escalation',
    description: 'Office lease with rent and term modifications',
    category: 'Real Estate',
    originalText: `Landlord hereby leases to Tenant, and Tenant hereby leases from Landlord, the premises located at 123 Business Park Drive, Suite 400, comprising approximately 2,500 square feet of office space ("Premises").

The initial term of this Lease shall be three (3) years, commencing on March 1, 2024, and ending on February 28, 2027. The base rent for the first year shall be $5,000 per month, increasing by 3% annually thereafter. Tenant shall also pay its proportionate share of operating expenses, estimated at $8.50 per square foot annually.

Tenant may renew this Lease for one (1) additional term of two (2) years upon ninety (90) days written notice, provided Tenant is not in default. The renewal rent shall be determined by fair market value at the time of renewal.`,
    revisedText: `Landlord hereby leases to Tenant, and Tenant hereby leases from Landlord, the premises located at 123 Business Park Drive, Suite 400, comprising approximately 3,200 square feet of office space ("Premises").

The initial term of this Lease shall be five (5) years, commencing on March 1, 2024, and ending on February 28, 2029. The base rent for the first year shall be $6,500 per month, increasing by 2.5% annually thereafter. Tenant shall also pay its proportionate share of operating expenses, estimated at $9.25 per square foot annually.

Tenant may renew this Lease for two (2) additional terms of three (3) years each upon one hundred twenty (120) days written notice, provided Tenant is not in default. The renewal rent shall be determined by fair market value at the time of renewal, but shall not exceed 105% of the then-current rent.`
  },
  {
    id: 'employment-termination',
    name: 'Employment Agreement - Termination Clause',
    description: 'Executive employment contract with severance changes',
    category: 'Employment',
    originalText: `Employee shall serve as Chief Technology Officer of the Company, reporting directly to the Chief Executive Officer. Employee's annual base salary shall be $180,000, payable in accordance with the Company's standard payroll practices.

This Agreement may be terminated by the Company at any time with or without cause upon thirty (30) days written notice. In the event of termination without cause, Employee shall be entitled to severance pay equal to six (6) months of base salary, payable in a lump sum within sixty (60) days of termination.

Employee agrees that for a period of twelve (12) months following termination of employment, Employee shall not directly or indirectly compete with the Company or solicit any employees, customers, or clients of the Company.`,
    revisedText: `Employee shall serve as Chief Technology Officer of the Company, reporting directly to the Chief Executive Officer. Employee's annual base salary shall be $200,000, payable in accordance with the Company's standard payroll practices, plus an annual performance bonus of up to 25% of base salary.

This Agreement may be terminated by the Company at any time with or without cause upon sixty (60) days written notice. In the event of termination without cause, Employee shall be entitled to severance pay equal to twelve (12) months of base salary, payable in equal monthly installments over twelve months following termination.

Employee agrees that for a period of eighteen (18) months following termination of employment, Employee shall not directly or indirectly compete with the Company within the same geographic market or solicit any employees, customers, or clients of the Company.`
  },
  {
    id: 'merger-conditions',
    name: 'Merger Agreement - Closing Conditions',
    description: 'M&A transaction with modified closing conditions',
    category: 'M&A',
    originalText: `The obligations of Buyer to consummate the transactions contemplated hereby are subject to the satisfaction or waiver of the following conditions: (a) the representations and warranties of Seller shall be true and correct in all material respects as of the Closing Date; (b) Seller shall have performed all covenants and agreements required to be performed by it hereunder prior to the Closing; and (c) no Material Adverse Effect shall have occurred with respect to Seller.

Seller shall deliver to Buyer at Closing: (i) certificates representing all outstanding shares of the Company, duly endorsed for transfer; (ii) resignations of all directors and officers of the Company; and (iii) a certificate of the Secretary of the Company certifying resolutions of the board of directors approving the transaction.

The Purchase Price shall be $2,500,000, subject to adjustment for working capital as set forth in Schedule 2.1. The Purchase Price shall be paid by wire transfer of immediately available funds to accounts designated by Seller.`,
    revisedText: `The obligations of Buyer to consummate the transactions contemplated hereby are subject to the satisfaction or waiver of the following conditions: (a) the representations and warranties of Seller shall be true and correct in all material respects as of the Closing Date; (b) Seller shall have performed all covenants and agreements required to be performed by it hereunder prior to the Closing; (c) no Material Adverse Effect shall have occurred with respect to Seller; and (d) Buyer shall have completed satisfactory due diligence review of the Company's financial records and customer contracts.

Seller shall deliver to Buyer at Closing: (i) certificates representing all outstanding shares of the Company, duly endorsed for transfer; (ii) resignations of all directors and officers of the Company except for the Chief Executive Officer who shall remain; (iii) a certificate of the Secretary of the Company certifying resolutions of the board of directors approving the transaction; and (iv) executed employment agreements for key employees as identified in Schedule 3.2.

The Purchase Price shall be $3,200,000, subject to adjustment for working capital and outstanding debt as set forth in Schedule 2.1. The Purchase Price shall be paid 80% by wire transfer of immediately available funds at Closing and 20% held in escrow for twelve months to secure indemnification obligations.`
  },
  {
    id: 'license-software',
    name: 'Software License - Usage Rights',
    description: 'Enterprise software license with scope modifications',
    category: 'Technology',
    originalText: `Licensor hereby grants to Licensee a non-exclusive, non-transferable license to use the Software solely for Licensee's internal business operations. The license permits installation and use on up to fifty (50) workstations within Licensee's primary facility located in Chicago, Illinois.

The term of this License Agreement shall be two (2) years from the Effective Date, automatically renewable for successive one-year periods unless either party provides ninety (90) days written notice of non-renewal. The annual license fee is $25,000, payable in advance.

Licensee shall not: (a) modify, adapt, or create derivative works of the Software; (b) reverse engineer, decompile, or disassemble the Software; or (c) distribute, sublicense, or transfer the Software to any third party without Licensor's prior written consent.`,
    revisedText: `Licensor hereby grants to Licensee a non-exclusive, non-transferable license to use the Software for Licensee's internal business operations and for providing services to Licensee's clients. The license permits installation and use on up to one hundred (100) workstations within Licensee's facilities located in Chicago, Illinois and Milwaukee, Wisconsin.

The term of this License Agreement shall be three (3) years from the Effective Date, automatically renewable for successive two-year periods unless either party provides one hundred twenty (120) days written notice of non-renewal. The annual license fee is $40,000, payable quarterly in advance.

Licensee shall not: (a) modify, adapt, or create derivative works of the Software except as necessary for integration with Licensee's existing systems; (b) reverse engineer, decompile, or disassemble the Software; or (c) distribute, sublicense, or transfer the Software to any third party without Licensor's prior written consent, except to Licensee's subsidiaries and affiliates.`
  },
  {
    id: 'partnership-profit',
    name: 'Partnership Agreement - Profit Distribution',
    description: 'Business partnership with allocation changes',
    category: 'Partnership',
    originalText: `The Partners agree to contribute the following to the Partnership: Partner A shall contribute $100,000 in cash and Partner B shall contribute equipment valued at $75,000. The total initial capital of the Partnership shall be $175,000.

Profits and losses of the Partnership shall be allocated as follows: Partner A shall receive 60% of all profits and losses, and Partner B shall receive 40% of all profits and losses. Distributions shall be made quarterly based on available cash flow as determined by the Managing Partner.

Either Partner may withdraw from the Partnership upon six (6) months written notice. Upon withdrawal, the withdrawing Partner shall receive their capital account balance as determined by an independent valuation, payable over twenty-four (24) months without interest.`,
    revisedText: `The Partners agree to contribute the following to the Partnership: Partner A shall contribute $150,000 in cash and Partner B shall contribute equipment and intellectual property valued at $100,000. The total initial capital of the Partnership shall be $250,000.

Profits and losses of the Partnership shall be allocated as follows: Partner A shall receive 55% of all profits and losses, and Partner B shall receive 45% of all profits and losses. Distributions shall be made monthly based on available cash flow as determined by unanimous consent of the Partners.

Either Partner may withdraw from the Partnership upon twelve (12) months written notice. Upon withdrawal, the withdrawing Partner shall receive their capital account balance as determined by an independent valuation, payable over thirty-six (36) months with interest at the prime rate plus 2%.`
  },
  {
    id: 'loan-security',
    name: 'Loan Agreement - Security Provisions',
    description: 'Commercial loan with collateral modifications',
    category: 'Finance',
    originalText: `Lender agrees to loan Borrower the principal sum of $500,000 ("Loan") at an interest rate of 6.5% per annum. The Loan shall be repaid in sixty (60) equal monthly installments of principal and interest, with the first payment due thirty (30) days after the date hereof.

As security for the Loan, Borrower grants to Lender a first priority security interest in all of Borrower's inventory, accounts receivable, and equipment. Borrower shall maintain insurance on all collateral in amounts satisfactory to Lender with Lender named as loss payee.

Borrower represents and warrants that: (a) it has full corporate power and authority to execute this Agreement; (b) the execution and performance of this Agreement will not violate any other agreement to which Borrower is a party; and (c) its financial statements are true and correct in all material respects.`,
    revisedText: `Lender agrees to loan Borrower the principal sum of $750,000 ("Loan") at an interest rate of 7.25% per annum. The Loan shall be repaid in seventy-two (72) equal monthly installments of principal and interest, with the first payment due forty-five (45) days after the date hereof.

As security for the Loan, Borrower grants to Lender a first priority security interest in all of Borrower's inventory, accounts receivable, equipment, and real property located at 456 Industrial Boulevard. Borrower shall maintain insurance on all collateral in amounts satisfactory to Lender with Lender named as additional insured and loss payee.

Borrower represents and warrants that: (a) it has full corporate power and authority to execute this Agreement; (b) the execution and performance of this Agreement will not violate any other agreement to which Borrower is a party; (c) its financial statements are true and correct in all material respects; and (d) there are no pending or threatened legal proceedings against Borrower that could materially affect its ability to repay the Loan.`
  },
  {
    id: 'supply-delivery',
    name: 'Supply Agreement - Delivery Terms',
    description: 'Manufacturing supply contract with logistics changes',
    category: 'Supply Chain',
    originalText: `Supplier agrees to manufacture and deliver to Buyer the products described in Exhibit A ("Products") in accordance with the specifications and delivery schedule set forth therein. All Products shall be delivered FOB Supplier's facility in Detroit, Michigan.

Delivery shall be made in weekly shipments of no less than 1,000 units per shipment. Buyer shall provide Supplier with rolling twelve-week forecasts, with the first four weeks being firm orders. Supplier shall maintain sufficient inventory to meet Buyer's requirements.

In the event of late delivery, Supplier shall pay liquidated damages of $500 per day for each day of delay. Buyer may terminate this Agreement immediately if Supplier fails to deliver conforming Products for more than ten (10) consecutive days.`,
    revisedText: `Supplier agrees to manufacture and deliver to Buyer the products described in Exhibit A ("Products") in accordance with the specifications and delivery schedule set forth therein. All Products shall be delivered FOB Buyer's facility in Cleveland, Ohio, with Supplier responsible for all shipping costs and insurance.

Delivery shall be made in bi-weekly shipments of no less than 2,500 units per shipment. Buyer shall provide Supplier with rolling sixteen-week forecasts, with the first six weeks being firm orders. Supplier shall maintain sufficient inventory to meet Buyer's requirements plus a 15% safety stock.

In the event of late delivery, Supplier shall pay liquidated damages of $1,000 per day for each day of delay. Buyer may terminate this Agreement immediately if Supplier fails to deliver conforming Products for more than five (5) consecutive business days, or may source Products from alternative suppliers at Supplier's expense.`
  },
  {
    id: 'ip-assignment',
    name: 'IP Assignment - Scope and Exceptions',
    description: 'Intellectual property assignment with carve-outs',
    category: 'Intellectual Property',
    originalText: `Employee hereby assigns to Company all right, title, and interest in and to any and all inventions, discoveries, improvements, and innovations ("Inventions") conceived, developed, or reduced to practice by Employee during the term of employment, whether alone or with others.

This assignment includes all Inventions that: (a) relate to Company's business or research; (b) result from work performed for Company; or (c) are developed using Company's equipment, supplies, facilities, or confidential information. Employee shall promptly disclose all such Inventions to Company in writing.

Employee retains ownership of inventions that are developed entirely on Employee's own time without use of Company resources and that do not relate to Company's business or research. Employee has listed all such prior inventions on Schedule A attached hereto.`,
    revisedText: `Employee hereby assigns to Company all right, title, and interest in and to any and all inventions, discoveries, improvements, innovations, and works of authorship ("Inventions") conceived, developed, or reduced to practice by Employee during the term of employment, whether alone or with others.

This assignment includes all Inventions that: (a) relate to Company's current or reasonably anticipated business or research; (b) result from work performed for Company; (c) are developed using Company's equipment, supplies, facilities, or confidential information; or (d) are suggested by or result from Employee's work for Company. Employee shall promptly disclose all such Inventions to Company in writing and execute any documents necessary to perfect Company's rights.

Employee retains ownership of inventions that are developed entirely on Employee's own time without use of Company resources, do not relate to Company's business or research, and do not compete with Company's products or services. Employee has listed all such prior inventions on Schedule A attached hereto and agrees to update this list annually.`
  }
];

interface TestSuiteProps {
  onLoadTest: (originalText: string, revisedText: string) => void;
}

export const TestSuite: React.FC<TestSuiteProps> = ({ onLoadTest }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [runningTests, setRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: ComparisonResult }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(TEST_CASES.map(test => test.category)))];
  const filteredTests = selectedCategory === 'All' 
    ? TEST_CASES 
    : TEST_CASES.filter(test => test.category === selectedCategory);

  const runAllTests = async () => {
    setRunningTests(true);
    const results: { [key: string]: ComparisonResult } = {};
    
    for (const testCase of TEST_CASES) {
      try {
        const result = MyersAlgorithm.compare(testCase.originalText, testCase.revisedText);
        results[testCase.id] = result;
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Test ${testCase.id} failed:`, error);
      }
    }
    
    setTestResults(results);
    setRunningTests(false);
  };

  const getTestStatus = (testId: string) => {
    const result = testResults[testId];
    if (!result) return 'pending';
    return result.stats.totalChanges > 0 ? 'passed' : 'warning';
  };

  return (
    <div className="glass-panel border border-theme-neutral-300 rounded-lg overflow-hidden mb-6 shadow-lg transition-all duration-300">
      <div 
        className="bg-theme-primary-50 border-b border-theme-primary-200 p-4 cursor-pointer hover:bg-theme-primary-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-theme-primary-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-theme-primary-600" />
            )}
            <FileText className="w-5 h-5 text-theme-primary-600" />
            <div>
              <h3 className="text-lg font-semibold text-theme-primary-900">Legal Document Test Suite</h3>
              <p className="text-sm text-theme-primary-700">
                11 comprehensive test cases including Karpathy-inspired address substitution tests
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {Object.keys(testResults).length > 0 && (
              <div className="text-sm text-theme-primary-700">
                {Object.keys(testResults).length}/{TEST_CASES.length} tests completed
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                runAllTests();
              }}
              disabled={runningTests}
              className="enhanced-button flex items-center gap-2 px-4 py-2 bg-theme-primary-600 text-white rounded-lg hover:bg-theme-primary-700 disabled:bg-theme-neutral-400 transition-all duration-200 text-sm shadow-lg"
            >
              <Play className="w-4 h-4" />
              {runningTests ? 'Running Tests...' : 'Run All Tests'}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-theme-neutral-700">Filter by Category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`subtle-button px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-theme-primary-600 text-white shadow-lg'
                      : 'bg-theme-neutral-100 text-theme-neutral-700 hover:bg-theme-neutral-200'
                  }`}
                >
                  {category}
                  {category !== 'All' && (
                    <span className="ml-1 text-xs opacity-75">
                      ({TEST_CASES.filter(t => t.category === category).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Test Cases */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTests.map((testCase) => {
              const result = testResults[testCase.id];
              const status = getTestStatus(testCase.id);
              
              return (
                <div key={testCase.id} className={`border rounded-lg p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
                  testCase.id === 'address-substitution-test' ? 'border-theme-accent-300 bg-theme-accent-50' : 'border-theme-neutral-200'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-theme-neutral-900">{testCase.name}</h4>
                        {testCase.id === 'address-substitution-test' && (
                          <span className="text-xs bg-theme-accent-200 text-theme-accent-800 px-2 py-1 rounded-full font-medium">
                            KARPATHY TEST
                          </span>
                        )}
                        {result && (
                          <div className="flex items-center gap-1">
                            {status === 'passed' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : status === 'warning' ? (
                              <XCircle className="w-4 h-4 text-yellow-600" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          testCase.category === 'Structured Data' 
                            ? 'bg-theme-accent-100 text-theme-accent-800' 
                            : 'bg-theme-primary-100 text-theme-primary-800'
                        }`}>
                          {testCase.category}
                        </span>
                      </div>
                      <p className="text-sm text-theme-neutral-600 mb-3">{testCase.description}</p>
                      
                      {result && (
                        <div className="text-xs text-theme-neutral-500 space-y-1">
                          <div>Changes: +{result.stats.additions} -{result.stats.deletions} ~{result.stats.changed}</div>
                          <div>Total elements: {result.stats.additions + result.stats.deletions + result.stats.unchanged + result.stats.changed}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => onLoadTest(testCase.originalText, testCase.revisedText)}
                      className="enhanced-button flex-1 px-3 py-2 bg-theme-primary-600 text-white text-sm rounded hover:bg-theme-primary-700 transition-all duration-200 shadow-lg"
                    >
                      Load Test Case
                    </button>
                    <button
                      onClick={() => {
                        const result = MyersAlgorithm.compare(testCase.originalText, testCase.revisedText);
                        setTestResults(prev => ({ ...prev, [testCase.id]: result }));
                      }}
                      className="enhanced-button px-3 py-2 bg-theme-neutral-600 text-white text-sm rounded hover:bg-theme-neutral-700 transition-all duration-200 shadow-lg"
                    >
                      Test
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Test Summary */}
          {Object.keys(testResults).length > 0 && (
            <div className="mt-6 p-4 glass-panel rounded-lg shadow-lg transition-all duration-300">
              <h4 className="font-semibold text-theme-neutral-900 mb-3">Test Results Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-theme-neutral-600">Total Tests</div>
                  <div className="text-xl font-bold text-theme-primary-600">{Object.keys(testResults).length}</div>
                </div>
                <div>
                  <div className="text-theme-neutral-600">Avg Changes</div>
                  <div className="text-xl font-bold text-theme-accent-600">
                    {Math.round(
                      Object.values(testResults).reduce((sum, r) => sum + r.stats.totalChanges, 0) / 
                      Object.keys(testResults).length
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-theme-neutral-600">Total Substitutions</div>
                  <div className="text-xl font-bold text-theme-accent-600">
                    {Object.values(testResults).reduce((sum, r) => sum + r.stats.changed, 0)}
                  </div>
                </div>
                <div>
                  <div className="text-theme-neutral-600">Karpathy Test</div>
                  <div className="text-xl font-bold text-theme-accent-600">
                    {testResults['address-substitution-test'] ? '✅ PASS' : '⏳ PENDING'}
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