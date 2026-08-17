import { ClauseLibraryItem, ContractTemplate, ContractRecord, ContractAnalysisResult } from '../types';

export const SEED_CLAUSES: ClauseLibraryItem[] = [
  // INDEMNIFICATION
  {
    id: 'INDEM-001',
    category: 'Indemnification',
    title: 'Mutual Indemnification - Balanced Standard',
    text: 'Each party shall indemnify, defend, and hold harmless the other party, its officers, directors, employees, and agents from and against any third-party claims, liabilities, damages, and costs (including reasonable attorneys fees) arising out of or resulting from the indemnifying party\'s material breach of this Agreement, gross negligence, or willful misconduct.',
    industry: ['Technology', 'SaaS', 'General'],
    jurisdiction: ['US-General', 'California', 'New York', 'Delaware'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: ['INDEM-002', 'INDEM-003'],
    tags: ['mutual', 'third-party-claims', 'reasonable-costs', 'material-breach'],
    usageCount: 1247,
    lastUpdated: '2026-01-15'
  },
  {
    id: 'INDEM-002',
    category: 'Indemnification',
    title: 'Vendor-Favorable Limited Indemnification',
    text: 'Vendor shall indemnify Customer solely against third-party claims alleging that the Software infringes a valid US patent or copyright, provided Customer provides prompt written notice of the claim, sole control of defense to Vendor, and reasonable cooperation.',
    industry: ['SaaS', 'Software', 'Technology'],
    jurisdiction: ['US-General', 'California', 'New York'],
    riskLevel: 'Medium',
    favorability: 'Vendor-favorable',
    alternatives: ['INDEM-001', 'INDEM-003'],
    tags: ['ip-infringement-only', 'vendor-favorable', 'sole-control', 'prompt-notice'],
    usageCount: 890,
    lastUpdated: '2026-01-10'
  },
  {
    id: 'INDEM-003',
    category: 'Indemnification',
    title: 'Customer-Favorable Broad Indemnification',
    text: 'Supplier shall defend, indemnify, and hold Customer harmless from any and all claims, demands, losses, attorney fees, expenses, or obligations arising directly or indirectly out of any act, omission, performance, or breach by Supplier, its subcontractors, or agents under this Agreement.',
    industry: ['General', 'Real Estate', 'Healthcare', 'Corporate'],
    jurisdiction: ['US-General', 'Texas', 'New York', 'UK'],
    riskLevel: 'High',
    favorability: 'Customer-favorable',
    alternatives: ['INDEM-001'],
    tags: ['broad-indemnity', 'uncapped', 'customer-favorable', 'subcontractor-coverage'],
    usageCount: 654,
    lastUpdated: '2025-12-20'
  },
  {
    id: 'INDEM-004',
    category: 'Indemnification',
    title: 'IP Infringement Defense & Carve-Out',
    text: 'If the Service becomes or is likely to become subject to an infringement claim, Provider shall at its option and expense: (a) procure for Customer the right to continue using the Service; (b) modify the Service to be non-infringing; or (c) terminate the Subscription and refund pro-rata prepaid fees.',
    industry: ['SaaS', 'Technology'],
    jurisdiction: ['US-General', 'EU', 'California'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: ['INDEM-002'],
    tags: ['ip-carveout', 'remediation', 'pro-rata-refund'],
    usageCount: 1102,
    lastUpdated: '2026-01-05'
  },

  // LIMITATION OF LIABILITY
  {
    id: 'LIMIT-001',
    category: 'Limitation of Liability',
    title: 'Mutual Liability Cap - 12 Months Fees',
    text: 'Except for liability arising from gross negligence, willful misconduct, or indemnification obligations hereunder, neither party\'s aggregate liability arising out of or related to this Agreement shall exceed the total amounts paid or payable by Customer under this Agreement in the twelve (12) months preceding the event giving rise to liability.',
    industry: ['SaaS', 'Technology', 'General'],
    jurisdiction: ['US-General', 'California', 'Delaware', 'UK'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: ['LIMIT-002', 'LIMIT-003'],
    tags: ['liability-cap', '12-months-fees', 'carve-outs', 'mutual'],
    usageCount: 1850,
    lastUpdated: '2026-01-18'
  },
  {
    id: 'LIMIT-002',
    category: 'Limitation of Liability',
    title: 'Consequential Damages Waiver',
    text: 'To the maximum extent permitted by applicable law, in no event shall either party be liable to the other for any indirect, incidental, special, consequential, punitive, or loss of profits or revenue damages arising out of or in connection with this Agreement.',
    industry: ['SaaS', 'Software', 'Real Estate', 'Healthcare'],
    jurisdiction: ['US-General', 'EU', 'UK'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: ['LIMIT-001'],
    tags: ['consequential-damages', 'waiver', 'loss-of-profits'],
    usageCount: 2100,
    lastUpdated: '2026-01-20'
  },
  {
    id: 'LIMIT-003',
    category: 'Limitation of Liability',
    title: 'Fixed Dollar Amount Cap ($50,000)',
    text: 'Vendor\'s cumulative liability for all claims arising under this Agreement shall be limited to $50,000 or the total amounts paid by Customer in the preceding six months, whichever is lower.',
    industry: ['SaaS', 'Startups'],
    jurisdiction: ['US-General', 'California'],
    riskLevel: 'Medium',
    favorability: 'Vendor-favorable',
    alternatives: ['LIMIT-001'],
    tags: ['fixed-cap', 'vendor-favorable'],
    usageCount: 420,
    lastUpdated: '2025-11-30'
  },

  // TERMINATION & RENEWAL
  {
    id: 'TERM-001',
    category: 'Termination and Renewal',
    title: 'Auto-Renewal with 30-Day Notice Window',
    text: 'This Agreement shall automatically renew for successive one (1) year periods unless either party provides written notice of non-renewal at least thirty (30) days prior to the expiration of the then-current initial term or renewal term.',
    industry: ['SaaS', 'Subscription'],
    jurisdiction: ['US-General', 'California', 'New York'],
    riskLevel: 'Medium',
    favorability: 'Vendor-favorable',
    alternatives: ['TERM-002', 'TERM-003'],
    tags: ['auto-renewal', '30-day-notice', 'evergreen'],
    usageCount: 1430,
    lastUpdated: '2026-01-12'
  },
  {
    id: 'TERM-002',
    category: 'Termination and Renewal',
    title: 'Termination for Convenience - 30 Days',
    text: 'Either party may terminate this Agreement for convenience, without cause, upon providing thirty (30) days prior written notice to the other party.',
    industry: ['General', 'Independent Contractor', 'Consulting'],
    jurisdiction: ['US-General', 'California', 'UK'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: ['TERM-001'],
    tags: ['termination-for-convenience', 'no-cause', 'mutual'],
    usageCount: 1620,
    lastUpdated: '2026-01-14'
  },
  {
    id: 'TERM-003',
    category: 'Termination and Renewal',
    title: 'Termination for Cause - 15 Day Cure Period',
    text: 'Either party may terminate this Agreement immediately upon written notice if the other party materially breaches any provision of this Agreement and fails to cure such breach within fifteen (15) days after receipt of written notice specifying the breach.',
    industry: ['SaaS', 'MSA', 'Employment'],
    jurisdiction: ['US-General', 'Delaware', 'EU'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: ['TERM-002'],
    tags: ['material-breach', 'cure-period', 'immediate-termination'],
    usageCount: 1790,
    lastUpdated: '2026-01-16'
  },

  // INTELLECTUAL PROPERTY
  {
    id: 'IP-001',
    category: 'Intellectual Property',
    title: 'Pre-Existing IP & Work Product Assignment',
    text: 'Client retains sole ownership of all pre-existing IP. Contractor hereby assigns and agrees to assign to Client all right, title, and interest in and to all Work Product, deliverables, code, designs, and inventions created by Contractor in performance of the Services.',
    industry: ['Software', 'Consulting', 'Employment'],
    jurisdiction: ['US-General', 'California', 'New York'],
    riskLevel: 'Low',
    favorability: 'Customer-favorable',
    alternatives: ['IP-002'],
    tags: ['work-for-hire', 'ip-assignment', 'pre-existing-ip'],
    usageCount: 1540,
    lastUpdated: '2026-01-19'
  },
  {
    id: 'IP-002',
    category: 'Intellectual Property',
    title: 'SaaS License Grant & Customer Data Ownership',
    text: 'Provider grants Customer a non-exclusive, non-transferable, world-wide right during the Term to access and use the SaaS Service. Customer retains all ownership and rights in and to Customer Data provided or generated through the Service.',
    industry: ['SaaS', 'Cloud'],
    jurisdiction: ['US-General', 'EU', 'California'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: ['IP-001'],
    tags: ['saas-license', 'customer-data', 'non-exclusive'],
    usageCount: 1980,
    lastUpdated: '2026-01-21'
  },

  // CONFIDENTIALITY & NDA
  {
    id: 'CONF-001',
    category: 'Confidentiality & Non-Disclosure',
    title: 'Mutual Standard Confidentiality (3 Year Term)',
    text: 'Recipient agrees to hold Discloser\'s Confidential Information in strict confidence and protect it with at least the same degree of care it uses for its own confidential information. Confidential Information shall not be disclosed to any third party for a period of three (3) years from disclosure.',
    industry: ['General', 'Technology', 'Healthcare', 'Real Estate'],
    jurisdiction: ['US-General', 'California', 'New York', 'UK', 'EU'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: ['CONF-002'],
    tags: ['mutual-nda', '3-year-term', 'standard-care'],
    usageCount: 2300,
    lastUpdated: '2026-01-22'
  },
  {
    id: 'CONF-002',
    category: 'Confidentiality & Non-Disclosure',
    title: 'Trade Secret Perpetual Non-Disclosure',
    text: 'Confidential Information qualifying as a trade secret under applicable law shall remain confidential indefinitely or for as long as such information remains a trade secret under applicable law.',
    industry: ['Software', 'Tech', 'Healthcare'],
    jurisdiction: ['US-General', 'Delaware'],
    riskLevel: 'Low',
    favorability: 'Discloser-favorable',
    alternatives: ['CONF-001'],
    tags: ['trade-secret', 'perpetual', 'indefinite-protection'],
    usageCount: 1150,
    lastUpdated: '2026-01-11'
  },

  // PAYMENT TERMS
  {
    id: 'PAY-001',
    category: 'Payment Terms',
    title: 'Net 30 Days with 1.5% Late Interest',
    text: 'Invoices shall be payable within thirty (30) days from invoice date. Overdue amounts shall accrue interest at the rate of 1.5% per month or the maximum rate permitted by law, whichever is lower.',
    industry: ['General', 'SaaS', 'Consulting'],
    jurisdiction: ['US-General', 'UK'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: ['PAY-002'],
    tags: ['net-30', 'late-interest', 'invoicing'],
    usageCount: 1670,
    lastUpdated: '2026-01-08'
  },
  {
    id: 'PAY-002',
    category: 'Payment Terms',
    title: 'Net 60 Days / Right of Setoff',
    text: 'Payment is due within sixty (60) days. Customer reserves the right to set off any amounts owed by Vendor against payments due to Vendor under this Agreement.',
    industry: ['Corporate', 'Retail', 'Real Estate'],
    jurisdiction: ['US-General', 'Texas'],
    riskLevel: 'Medium',
    favorability: 'Customer-favorable',
    alternatives: ['PAY-001'],
    tags: ['net-60', 'setoff-rights', 'customer-favorable'],
    usageCount: 510,
    lastUpdated: '2025-12-18'
  },

  // WARRANTIES
  {
    id: 'WARR-001',
    category: 'Warranties and Representations',
    title: 'Standard Service Level & Performance Warranty',
    text: 'Vendor warrants that the Services will be performed in a professional, workmanlike manner in compliance with industry standards and materially in accordance with published specifications.',
    industry: ['SaaS', 'Software', 'Services'],
    jurisdiction: ['US-General', 'Delaware'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: ['WARR-002'],
    tags: ['workmanlike', 'industry-standards', 'service-warranty'],
    usageCount: 1420,
    lastUpdated: '2026-01-17'
  },

  // DISPUTE RESOLUTION
  {
    id: 'DISP-001',
    category: 'Dispute Resolution',
    title: 'Binding AAA Arbitration & Class Action Waiver',
    text: 'Any dispute arising under this Agreement shall be resolved through binding individual arbitration administered by the American Arbitration Association (AAA) in Delaware. Both parties waive any right to participate in class actions.',
    industry: ['SaaS', 'Fintech', 'General'],
    jurisdiction: ['US-General', 'Delaware'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: [],
    tags: ['arbitration', 'aaa-rules', 'class-action-waiver'],
    usageCount: 1890,
    lastUpdated: '2026-01-20'
  },

  // FORCE MAJEURE
  {
    id: 'FORCE-001',
    category: 'Force Majeure',
    title: 'Standard Unforeseen Events Clause',
    text: 'Neither party shall be liable for delay or failure in performance resulting from acts of God, war, terrorism, epidemics, labor disputes, or failure of public utilities, provided prompt written notice is given.',
    industry: ['General', 'Real Estate', 'Logistics'],
    jurisdiction: ['US-General', 'EU', 'UK'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: [],
    tags: ['force-majeure', 'acts-of-god', 'epidemic'],
    usageCount: 2210,
    lastUpdated: '2026-01-23'
  },

  // GOVERNING LAW
  {
    id: 'GOV-001',
    category: 'Governing Law',
    title: 'State of Delaware Law & Exclusive Forum',
    text: 'This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of laws principles. Venue shall lie exclusively in state or federal courts in New Castle County, Delaware.',
    industry: ['General', 'SaaS', 'Startups'],
    jurisdiction: ['Delaware', 'US-General'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: [],
    tags: ['delaware-law', 'exclusive-venue', 'governing-law'],
    usageCount: 2450,
    lastUpdated: '2026-01-24'
  },

  // SOFTWARE & AI TESTING CONTRACTOR CLAUSES (HANDSHAKE AI SPECIALIZATION)
  {
    id: 'AI-TEST-001',
    category: 'Software & AI Testing',
    title: 'AI Testing Contractor Liability & Hallucination Defense',
    text: 'Contractor provides AI model evaluation, prompt red-teaming, and software testing services on an "as-is" advisory basis. In no event shall Contractor be liable for generative model hallucinations, third-party user interactions, security vulnerabilities, or algorithmic errors occurring within Client\'s production systems.',
    industry: ['AI & Machine Learning', 'Software QA', '1099 Contractor'],
    jurisdiction: ['US-General', 'California', 'Delaware'],
    riskLevel: 'Low',
    favorability: 'Vendor-favorable',
    alternatives: ['LIMIT-001'],
    tags: ['ai-hallucination-defense', 'red-teaming', 'contractor-protection', 'qa-testing'],
    usageCount: 3120,
    lastUpdated: '2026-02-01'
  },
  {
    id: 'AI-TEST-002',
    category: 'Software & AI Testing',
    title: 'Pre-Existing Evaluation Tool & Benchmark Script Carve-Out',
    text: 'Contractor retains all rights, title, and ownership in Contractor\'s pre-existing prompt libraries, automated test harness scripts, evaluation methodologies, and benchmark datasets. Client receives an irrevocable, non-exclusive license to use the final written test reports and red-team findings deliverable.',
    industry: ['AI & Machine Learning', 'Software QA', 'Independent Contractor'],
    jurisdiction: ['US-General', 'California', 'New York'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: ['IP-001'],
    tags: ['background-ip', 'test-scripts', 'evaluation-tools', 'prompt-library'],
    usageCount: 2840,
    lastUpdated: '2026-02-01'
  },
  {
    id: 'AI-TEST-003',
    category: 'Software & AI Testing',
    title: 'Software QA Deliverables Acceptance & 5-Day Review Window',
    text: 'Client shall have five (5) business days following delivery of QA test suites, test run results, or bug reports to review and provide written notice of material non-conformance. In the absence of written notice within such period, deliverables shall be deemed conclusively accepted and payable.',
    industry: ['Software QA', 'DevOps', 'Consulting'],
    jurisdiction: ['US-General', 'Delaware'],
    riskLevel: 'Low',
    favorability: 'Balanced',
    alternatives: ['WARR-001'],
    tags: ['qa-acceptance', '5-day-review', 'deemed-accepted', 'bug-reporting'],
    usageCount: 1950,
    lastUpdated: '2026-01-28'
  },
  {
    id: 'AI-TEST-004',
    category: 'Software & AI Testing',
    title: 'Non-Exclusivity & Multi-Client AI Testing Permitted',
    text: 'Client acknowledges Contractor is an independent contractor. Nothing in this Agreement shall restrict Contractor from performing software testing, prompt engineering, RLHF evaluation, or quality assurance services for other clients or AI platforms, provided Contractor does not disclose Client\'s Confidential Information.',
    industry: ['AI & Machine Learning', 'Software QA', 'Gig & 1099'],
    jurisdiction: ['US-General', 'California', 'Texas'],
    riskLevel: 'Low',
    favorability: 'Vendor-favorable',
    alternatives: [],
    tags: ['non-exclusivity', 'moonlighting', 'multi-client', 'handshake-freelance'],
    usageCount: 2610,
    lastUpdated: '2026-02-02'
  }
];

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'template-nda',
    name: 'Mutual Non-Disclosure Agreement (NDA)',
    category: 'Confidentiality',
    description: 'Standard bi-directional non-disclosure contract suitable for discussions, partnerships, M&A, or software evaluations.',
    defaultClauses: ['CONF-001', 'CONF-002', 'LIMIT-002', 'DISP-001', 'GOV-001'],
    fields: [
      { key: 'partyA', label: 'Disclosing/Receiving Party A (Company)', type: 'text', required: true, defaultValue: 'Apex Innovations Inc.' },
      { key: 'partyB', label: 'Disclosing/Receiving Party B (Counterparty)', type: 'text', required: true, defaultValue: 'Nexus Technologies LLC' },
      { key: 'purpose', label: 'Purpose of Disclosure', type: 'text', required: true, defaultValue: 'Evaluation of potential commercial partnership and software technology integration' },
      { key: 'termYears', label: 'Confidentiality Term (Years)', type: 'select', options: ['1 Year', '2 Years', '3 Years', '5 Years', 'Perpetual'], required: true, defaultValue: '3 Years' },
      { key: 'jurisdiction', label: 'Governing Law State', type: 'select', options: ['Delaware', 'California', 'New York', 'Texas', 'UK Law'], required: true, defaultValue: 'Delaware' }
    ]
  },
  {
    id: 'template-msa',
    name: 'Master Service Agreement (MSA)',
    category: 'Commercial Services',
    description: 'Comprehensive framework contract governing ongoing professional, engineering, or SaaS consulting services.',
    defaultClauses: ['INDEM-001', 'LIMIT-001', 'TERM-002', 'IP-001', 'PAY-001', 'WARR-001', 'GOV-001'],
    fields: [
      { key: 'clientName', label: 'Client Company Name', type: 'text', required: true, defaultValue: 'Global Enterprise Solutions Corp.' },
      { key: 'providerName', label: 'Service Provider Name', type: 'text', required: true, defaultValue: 'CXPro Studio LLC' },
      { key: 'serviceScope', label: 'Scope of Services Summary', type: 'textarea', required: true, defaultValue: 'AI-assisted contract analysis, legal workflow automation, and custom model tuning.' },
      { key: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Net 15', 'Net 30', 'Net 60', '50% Upfront, 50% Completion'], required: true, defaultValue: 'Net 30' },
      { key: 'liabilityCap', label: 'Liability Cap Limit', type: 'select', options: ['12 Months Fees Paid', '24 Months Fees Paid', '$100,000 Fixed Cap', '$1,000,000 Fixed Cap'], required: true, defaultValue: '12 Months Fees Paid' }
    ]
  },
  {
    id: 'template-saas',
    name: 'SaaS Subscription Agreement',
    category: 'Software & Cloud',
    description: 'Enterprise B2B SaaS agreement covering cloud service access, data privacy, uptime SLAs, and subscription renewals.',
    defaultClauses: ['IP-002', 'TERM-001', 'LIMIT-001', 'INDEM-002', 'PAY-001', 'DISP-001'],
    fields: [
      { key: 'vendorName', label: 'SaaS Vendor Name', type: 'text', required: true, defaultValue: 'CXPro Technologies Inc.' },
      { key: 'subscriberName', label: 'Subscriber Company', type: 'text', required: true, defaultValue: 'Vanguard Legal Group Partners' },
      { key: 'tier', label: 'Subscription Tier', type: 'select', options: ['Starter ($199/mo)', 'Professional ($349/mo)', 'Enterprise ($499/mo)'], required: true, defaultValue: 'Professional ($349/mo)' },
      { key: 'userSeats', label: 'Authorized User Seats', type: 'number', required: true, defaultValue: '10' },
      { key: 'slaTarget', label: 'Uptime SLA Commitment', type: 'select', options: ['99.5%', '99.9%', '99.99%'], required: true, defaultValue: '99.9%' }
    ]
  },
  {
    id: 'template-contractor',
    name: 'Independent Contractor Agreement',
    category: 'Employment & Talent',
    description: 'Clear contractor agreement with full IP work-for-hire assignment, non-solicitation, and tax status protection.',
    defaultClauses: ['IP-001', 'CONF-001', 'TERM-002', 'LIMIT-002', 'GOV-001'],
    fields: [
      { key: 'companyName', label: 'Hiring Company', type: 'text', required: true, defaultValue: 'HyperScale AI Inc.' },
      { key: 'contractorName', label: 'Contractor Full Name / Entity', type: 'text', required: true, defaultValue: 'Jane Doe, Esq.' },
      { key: 'hourlyRate', label: 'Compensation / Rate', type: 'text', required: true, defaultValue: '$175 / hour' },
      { key: 'deliverables', label: 'Key Deliverables', type: 'textarea', required: true, defaultValue: 'Contract review taxonomy development, clause risk validation, and audit review.' }
    ]
  },
  {
    id: 'template-ai-qa-contractor',
    name: 'AI Model Testing & Software QA Contractor Agreement (Handshake AI)',
    category: 'AI & Software QA',
    description: 'Specialized 1099 contractor agreement for AI prompt evaluators, RLHF red-teamers, and software QA testers with hallucination liability shield and background script carve-outs.',
    defaultClauses: ['AI-TEST-001', 'AI-TEST-002', 'AI-TEST-003', 'AI-TEST-004', 'CONF-001', 'PAY-001', 'GOV-001'],
    fields: [
      { key: 'companyName', label: 'Hiring AI / Tech Company', type: 'text', required: true, defaultValue: 'Frontier AI Labs Inc.' },
      { key: 'contractorName', label: 'Contractor Full Name', type: 'text', required: true, defaultValue: 'Alex Rivera (Handshake Member)' },
      { key: 'testingFocus', label: 'Testing & QA Scope', type: 'select', options: ['AI Prompt Red-Teaming & Safety Benchmarking', 'RLHF Human Feedback & Alignment Annotation', 'Automated Software QA & SDET Test Automation', 'Model Evaluation & Edge-Case Vulnerability Probing'], required: true, defaultValue: 'AI Prompt Red-Teaming & Safety Benchmarking' },
      { key: 'hourlyRate', label: 'Hourly Compensation Rate', type: 'text', required: true, defaultValue: '$125.00 / hour' },
      { key: 'acceptanceWindow', label: 'Deliverable Review Window', type: 'select', options: ['3 Business Days', '5 Business Days (Recommended)', '10 Business Days'], required: true, defaultValue: '5 Business Days (Recommended)' }
    ]
  }
];

export const SAMPLE_ANALYZED_CONTRACTS: ContractRecord[] = [
  {
    id: 'contract-sample-01',
    filename: 'Vendor_SaaS_Enterprise_Agreement_Draft.docx',
    contractType: 'SaaS Subscription',
    uploadedAt: '2026-07-24 14:20',
    status: 'Completed',
    riskScore: 78,
    textCount: 3420,
    rawText: `MASTER SAAS SUBSCRIPTION AGREEMENT
This Master SaaS Subscription Agreement ("Agreement") is entered into as of January 1, 2026 by and between CloudMatrix Inc. ("Provider") and Meridian Law Partners LLP ("Customer").

1. SAAS SERVICE & LICENSE
Provider grants Customer a limited, non-exclusive license to access the CloudMatrix Platform. Customer shall not attempt to reverse engineer, copy, or create derivative works.

2. FEES & AUTO-RENEWAL
Customer shall pay an annual subscription fee of $45,000. This Agreement shall AUTOMATICALLY RENEW for consecutive 1-year terms unless Customer provides written cancellation notice AT LEAST 120 DAYS prior to renewal date. Failure to provide 120 days notice will result in full 100% annual renewal charge with an automatic 15% price increase.

3. UNLIMITED INDEMNIFICATION BY CUSTOMER
Customer shall defend, indemnify, and hold harmless Provider and its affiliates against any and all losses, liability, damages, regulatory fines, and legal fees arising out of Customer's data, use of platform, or alleged violation of third party IP, WITH NO FINANCIAL LIMIT OR CAP.

4. LIMITATION OF PROVIDER LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY LAW, PROVIDER'S TOTAL CUMULATIVE LIABILITY FOR ALL CLAIMS OF ANY KIND SHALL BE LIMITED TO $100 TOTAL. IN NO EVENT SHALL PROVIDER BE LIABLE FOR DATA LOSS, SECURITY BREACHES, OR SYSTEM OUTAGES.

5. INTELLECTUAL PROPERTY & DATA RIGHTS
Provider shall own all rights, title, and interest in all feedback, customer modifications, aggregated customer data, and telemetry. Provider reserves the right to monetize and publish anonymized customer metrics.

6. GOVERNING LAW & JURISDICTION
This Agreement is governed by the laws of the State of New York. Any disputes shall be litigated exclusively in state courts located in New York County.`,
    analysis: {
      analysisId: 'analysis-sample-01',
      contractId: 'contract-sample-01',
      filename: 'Vendor_SaaS_Enterprise_Agreement_Draft.docx',
      uploadedAt: '2026-07-24 14:20',
      overallRiskScore: 78,
      confidenceInterval: '96% ± 2%',
      percentileRanking: 82, // Riskier than 82% of commercial agreements
      summaryText: 'HIGH RISK AGREEMENT: Contains severely asymmetric provisions including a $100 liability cap for Provider versus unlimited indemnification for Customer, an aggressive 120-day auto-renewal deadline with mandatory 15% price hike, and Provider data monetization rights.',
      categoryScores: {
        liability: 92,
        termination: 75,
        intellectualProperty: 68,
        compliance: 65,
        financial: 88
      },
      gpt4Analysis: {
        documentClassification: 'SaaS Subscription',
        parties: [
          { name: 'CloudMatrix Inc.', role: 'Provider / Vendor' },
          { name: 'Meridian Law Partners LLP', role: 'Customer / Subscriber' }
        ],
        keyTerms: [
          { label: 'Effective Date', value: 'January 1, 2026', category: 'Term' },
          { label: 'Annual Fee', value: '$45,000 / year', category: 'Financial' },
          { label: 'Auto-Renewal Notice', value: '120 days prior (15% price increase)', category: 'Termination' },
          { label: 'Provider Liability Cap', value: '$100 Maximum Aggregate', category: 'Financial' },
          { label: 'Governing Law', value: 'New York State', category: 'Governing Law' }
        ],
        clauseInventory: [
          { section: 'Section 1', title: 'SaaS Service & License', summary: 'Grants non-exclusive license; restricts reverse engineering.', riskLevel: 'Low' },
          { section: 'Section 2', title: 'Fees & Auto-Renewal', summary: '120-day notice requirement for non-renewal + automatic 15% price escalator.', riskLevel: 'High' },
          { section: 'Section 3', title: 'Customer Indemnification', summary: 'Uncapped, one-sided indemnification imposed on Customer.', riskLevel: 'Critical' },
          { section: 'Section 4', title: 'Limitation of Provider Liability', summary: '$100 nominal liability cap for Provider across all claims including outages.', riskLevel: 'Critical' },
          { section: 'Section 5', title: 'IP & Data Rights', summary: 'Provider retains ownership of telemetry and customer modifications.', riskLevel: 'Medium' }
        ],
        missingStandardClauses: [
          'Service Level Agreement (SLA) & Uptime Guarantee',
          'Data Processing Addendum (GDPR / CCPA Data Protection)',
          'Mutual Confidentiality & Security Standards',
          'Force Majeure Exception Clause'
        ],
        businessObjective: 'B2B enterprise SaaS platform subscription for Meridian Law Partners.',
        valueExchange: 'Customer pays $45,000/yr for platform access; Provider offers basic access with minimal operational risk.',
        negotiationLeverage: 'Counterparty Favorable'
      },
      claudeAnalysis: {
        overallRiskCategory: 'High Risk',
        riskScore: 78,
        highRiskCount: 4,
        mediumRiskCount: 3,
        lowRiskCount: 2,
        risks: [
          {
            id: 'risk-1',
            clauseTitle: 'Limitation of Liability ($100 Nominal Cap)',
            sectionReference: 'Section 4',
            severity: 'Critical',
            scoreImpact: 25,
            explanation: 'Provider limits total liability to $100 regardless of breach severity, security breach, or platform outage.',
            potentialConsequence: 'If Provider suffers a catastrophic data leak or prolonged system downtime, Customer cannot recover damages.',
            recommendedAction: 'Negotiate mutual liability cap equal to 12 months fees paid ($45,000) with carve-outs for data security breaches.',
            aiAgreementCount: 3,
            detectedBy: ['GPT-4', 'Claude', 'Gemini']
          },
          {
            id: 'risk-2',
            clauseTitle: 'Aggressive 120-Day Auto-Renewal & 15% Price Escalator',
            sectionReference: 'Section 2',
            severity: 'High',
            scoreImpact: 15,
            explanation: '120 days is an unusually long notice window; failing to notify traps Customer for another year at +15% pricing.',
            potentialConsequence: 'Accidental lock-in to an unwanted renewal cycle with forced fee increase.',
            recommendedAction: 'Reduce notice window to standard 30 days and cap annual price increases to max 5% or CPI index.',
            aiAgreementCount: 3,
            detectedBy: ['GPT-4', 'Claude', 'Gemini']
          },
          {
            id: 'risk-3',
            clauseTitle: 'Customer Telemetry & Feedback Commercialization',
            sectionReference: 'Section 5',
            severity: 'Medium',
            scoreImpact: 8,
            explanation: 'Provider reserves broad rights to monetize aggregated customer usage metrics and retain feedback IP.',
            potentialConsequence: 'Competitors may infer firm workflow patterns from published benchmarks.',
            recommendedAction: 'Clarify that telemetry must be strictly anonymized with no client identifier linkage.',
            aiAgreementCount: 2,
            detectedBy: ['GPT-4', 'Gemini']
          },
          {
            id: 'risk-4',
            clauseTitle: 'Uncapped One-Sided Customer Indemnification',
            sectionReference: 'Section 3',
            severity: 'Critical',
            scoreImpact: 22,
            explanation: 'Customer indemnifies Provider for all claims without any financial cap or threshold.',
            potentialConsequence: 'Exposes Customer to unlimited financial liability for third-party litigation or regulatory disputes.',
            recommendedAction: 'Cap indemnification obligations to the policy limits or 12 months fees, and make indemnification mutual.',
            aiAgreementCount: 3,
            detectedBy: ['GPT-4', 'Claude', 'Gemini']
          },
          {
            id: 'risk-5',
            clauseTitle: 'Absence of Service Level Agreement (SLA) & Uptime Warranty',
            sectionReference: 'Section 1',
            severity: 'High',
            scoreImpact: 14,
            explanation: 'No minimum availability commitment is provided in the agreement.',
            potentialConsequence: 'Provider cannot be held in default even if the platform is down for weeks.',
            recommendedAction: 'Demand 99.9% uptime SLA with tiered fee credits for outages exceeding 1 hour.',
            aiAgreementCount: 3,
            detectedBy: ['GPT-4', 'Claude', 'Gemini']
          },
          {
            id: 'risk-6',
            clauseTitle: 'Unilateral Modification of Service Terms Without Notice',
            sectionReference: 'Section 1.4',
            severity: 'High',
            scoreImpact: 12,
            explanation: 'Vendor may alter platform functionality or deprecate core APIs without prior notice.',
            potentialConsequence: 'Loss of mission-critical legal workflow integrations without recourse.',
            recommendedAction: 'Require 60 days advance written notice for any material feature deprecations.',
            aiAgreementCount: 2,
            detectedBy: ['Claude', 'Gemini']
          },
          {
            id: 'risk-7',
            clauseTitle: 'Non-Mutual Attorney Fee Shifting Clause',
            sectionReference: 'Section 6.2',
            severity: 'Medium',
            scoreImpact: 7,
            explanation: 'Only Provider is entitled to recover attorney fees upon prevailing in dispute.',
            potentialConsequence: 'Unequal financial exposure during arbitration or litigation.',
            recommendedAction: 'Convert to standard mutual prevailing party fee recovery provision.',
            aiAgreementCount: 3,
            detectedBy: ['GPT-4', 'Claude', 'Gemini']
          },
          {
            id: 'risk-8',
            clauseTitle: 'Ambiguous Audit & Security Inspection Carve-Out',
            sectionReference: 'Section 5.3',
            severity: 'Low',
            scoreImpact: 4,
            explanation: 'Does not specify independent third-party SOC2 verification schedules.',
            potentialConsequence: 'Customer security team cannot independently verify SOC2 Type II audit reports.',
            recommendedAction: 'Add annual SOC2 Type II report provision upon written request.',
            aiAgreementCount: 2,
            detectedBy: ['Claude', 'GPT-4']
          }
        ],
        complianceGaps: [
          {
            id: 'comp-1',
            framework: 'GDPR',
            status: 'Non-Compliant',
            severity: 'High',
            description: 'Lacks Article 28 Data Processing Agreement (DPA) required when processing personal data in SaaS.',
            remediationStep: 'Attach standard Data Processing Addendum with Standard Contractual Clauses (SCCs).'
          },
          {
            id: 'comp-2',
            framework: 'CCPA',
            status: 'Warning',
            severity: 'Medium',
            description: 'Section 5 allows monetization of customer data without service provider restrictions.',
            remediationStep: 'Add explicit prohibition on selling or sharing Customer Personal Information.'
          },
          {
            id: 'comp-3',
            framework: 'HIPAA',
            status: 'Warning',
            severity: 'Medium',
            description: 'No Business Associate Agreement (BAA) included for PHI data handling.',
            remediationStep: 'Incorporate standard BAA addendum if healthcare records are stored.'
          }
        ]
      },
      geminiAnalysis: {
        clauseMatches: [
          {
            clauseId: 'LIMIT-001',
            clauseTitle: 'Limitation of Liability',
            originalText: 'PROVIDER\'S TOTAL CUMULATIVE LIABILITY ... SHALL BE LIMITED TO $100 TOTAL.',
            libraryEquivalent: 'Except for gross negligence... aggregate liability shall not exceed 12 months fees paid.',
            similarityScore: 35,
            qualityAssessment: 'Weaker than Standard',
            improvements: [
              'Replace nominal $100 cap with 12 months fees paid ($45,000)',
              'Exclude data breach and confidentiality from liability cap'
            ],
            alternativeSuggestions: [
              {
                title: 'Mutual 12 Months Cap (Recommended)',
                text: 'Neither party\'s aggregate liability shall exceed the total fees paid under this Agreement in the twelve (12) months preceding the claim.',
                favorability: 'Balanced',
                tradeOffs: 'Provides fair coverage while limiting catastrophic exposure for both parties.'
              }
            ]
          },
          {
            clauseId: 'INDEM-001',
            clauseTitle: 'Mutual Indemnification',
            originalText: 'Customer shall defend, indemnify, and hold harmless Provider... WITH NO FINANCIAL LIMIT OR CAP.',
            libraryEquivalent: 'Each party shall indemnify, defend, and hold harmless the other party against material breach.',
            similarityScore: 42,
            qualityAssessment: 'Weaker than Standard',
            improvements: [
              'Make indemnification reciprocal',
              'Cap indemnification to insurance policy limits'
            ],
            alternativeSuggestions: [
              {
                title: 'Standard Mutual Indemnity',
                text: 'Each party shall defend and indemnify the other against third-party claims arising from gross negligence or material breach.',
                favorability: 'Balanced',
                tradeOffs: 'Standard market terms for SaaS enterprise agreements.'
              }
            ]
          },
          {
            clauseId: 'TERM-001',
            clauseTitle: 'Renewal Notice Period',
            originalText: 'AUTOMATICALLY RENEW for consecutive 1-year terms unless notice AT LEAST 120 DAYS prior...',
            libraryEquivalent: 'Automatically renews unless written notice provided at least thirty (30) days prior.',
            similarityScore: 60,
            qualityAssessment: 'Weaker than Standard',
            improvements: ['Shorten 120-day notice to 30 days', 'Cap renewal price increase at 5%'],
            alternativeSuggestions: [
              {
                title: '30-Day Notice Standard Window',
                text: 'Agreement renews for successive 1-year periods unless either party provides 30 days prior written notice.',
                favorability: 'Balanced',
                tradeOffs: 'Eliminates unexpected renewal traps.'
              }
            ]
          }
        ],
        languageSimplificationSuggestions: [
          {
            originalJargon: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW...',
            plainLanguageAlternative: 'Subject to applicable laws, total damages are limited to...',
            reason: 'All-caps boilerplate reduces readability without adding enforceability in modern jurisdictions.'
          }
        ],
        structuralImprovements: [
          'Add a dedicated Security & Backup exhibit',
          'Include standard Force Majeure provision'
        ],
        enforceabilityWarnings: [
          'A $100 nominal liability cap on a $45,000 contract may be deemed unconscionable or unenforceable in New York courts under U.C.C. § 2-719.'
        ]
      },
      consensusRecommendations: [
        {
          id: 'rec-1',
          title: 'Replace $100 Liability Cap with 12 Months Fees Cap',
          description: 'All 3 AI models identified Section 4 as unconscionably one-sided.',
          scoreReductionPotential: 25,
          modelsAgree: ['GPT-4', 'Claude', 'Gemini'],
          confidenceLevel: 'High Confidence (3 Models)',
          proposedTextChange: {
            current: 'PROVIDER\'S TOTAL CUMULATIVE LIABILITY FOR ALL CLAIMS OF ANY KIND SHALL BE LIMITED TO $100 TOTAL.',
            proposed: 'Except for gross negligence or data breach, Provider\'s total liability shall not exceed the fees paid by Customer in the preceding 12 months ($45,000).'
          }
        },
        {
          id: 'rec-2',
          title: 'Reduce Auto-Renewal Notice to 30 Days & Cap Price Escalation',
          description: 'Shorten notice period from 120 days to 30 days and cap annual increase at 5%.',
          scoreReductionPotential: 15,
          modelsAgree: ['GPT-4', 'Claude', 'Gemini'],
          confidenceLevel: 'High Confidence (3 Models)',
          proposedTextChange: {
            current: 'AT LEAST 120 DAYS prior to renewal date... automatic 15% price increase.',
            proposed: 'at least thirty (30) days prior to the expiration date. Any annual price increase shall not exceed 5%.'
          }
        },
        {
          id: 'rec-3',
          title: 'Make Indemnification Mutual & Capped',
          description: 'Balance indemnification between Provider and Customer.',
          scoreReductionPotential: 22,
          modelsAgree: ['GPT-4', 'Claude', 'Gemini'],
          confidenceLevel: 'High Confidence (3 Models)',
          proposedTextChange: {
            current: 'Customer shall defend, indemnify, and hold harmless Provider... WITH NO FINANCIAL LIMIT OR CAP.',
            proposed: 'Each party shall defend and indemnify the other party against third-party claims arising from gross negligence or material breach, subject to the limitation of liability cap herein.'
          }
        },
        {
          id: 'rec-4',
          title: 'Incorporate 99.9% Uptime Service Level Agreement',
          description: 'Add mandatory availability commitment with recurring fee credit remedies.',
          scoreReductionPotential: 12,
          modelsAgree: ['GPT-4', 'Claude', 'Gemini'],
          confidenceLevel: 'High Confidence (3 Models)',
          proposedTextChange: {
            current: '[No SLA or Uptime Guarantee in Section 1]',
            proposed: 'Provider warrants that the Service will achieve 99.9% Monthly Uptime. In the event of unexcused downtime exceeding 0.1%, Customer shall receive a 10% credit on the monthly subscription fee.'
          }
        },
        {
          id: 'rec-5',
          title: 'Attach GDPR & CCPA Data Processing Agreement (DPA)',
          description: 'Incorporate Article 28 statutory privacy safeguards and EU Standard Contractual Clauses.',
          scoreReductionPotential: 18,
          modelsAgree: ['Claude', 'Gemini'],
          confidenceLevel: 'Moderate Confidence (2 Models)',
          proposedTextChange: {
            current: '[No Data Protection Addendum Attached]',
            proposed: 'The parties agree to execute and incorporate Exhibit B (Data Processing Agreement) with Standard Contractual Clauses governing all personal data processing.'
          }
        }
      ]
    }
  },
  {
    id: 'contract-sample-02',
    filename: 'Mutual_NDA_Standard_Apex_Technologies.docx',
    contractType: 'NDA',
    uploadedAt: '2026-07-24 11:05',
    status: 'Completed',
    riskScore: 18,
    textCount: 1850,
    rawText: `MUTUAL NON-DISCLOSURE AGREEMENT
This Mutual Non-Disclosure Agreement ("Agreement") is made this 15th day of January, 2026, by and between Apex Innovations Inc. and Nexus Technologies LLC.

1. CONFIDENTIAL INFORMATION
Confidential Information includes technical data, software code, customer lists, and financial projections disclosed by either party.

2. OBLIGATIONS & STANDARD OF CARE
Recipient shall protect Confidential Information with at least the same degree of care it uses to protect its own confidential information of like nature, but no less than reasonable care.

3. TERM
This Agreement shall remain in effect for a term of three (3) years from the Effective Date.

4. GOVERNING LAW
This Agreement shall be governed by Delaware law.`,
    analysis: {
      analysisId: 'analysis-sample-02',
      contractId: 'contract-sample-02',
      filename: 'Mutual_NDA_Standard_Apex_Technologies.docx',
      uploadedAt: '2026-07-24 11:05',
      overallRiskScore: 18,
      confidenceInterval: '98% ± 1%',
      percentileRanking: 15, // Safer than 85% of NDAs
      summaryText: 'LOW RISK AGREEMENT: Well-balanced mutual non-disclosure agreement with standard 3-year term, reasonable standard of care, and Delaware governing law.',
      categoryScores: {
        liability: 15,
        termination: 10,
        intellectualProperty: 20,
        compliance: 15,
        financial: 10
      },
      gpt4Analysis: {
        documentClassification: 'NDA',
        parties: [
          { name: 'Apex Innovations Inc.', role: 'Disclosing & Receiving Party' },
          { name: 'Nexus Technologies LLC', role: 'Disclosing & Receiving Party' }
        ],
        keyTerms: [
          { label: 'Effective Date', value: 'January 15, 2026', category: 'Term' },
          { label: 'Confidentiality Term', value: '3 Years', category: 'Term' },
          { label: 'Governing Law', value: 'Delaware', category: 'Governing Law' }
        ],
        clauseInventory: [
          { section: 'Section 1', title: 'Confidential Information', summary: 'Standard comprehensive definition.', riskLevel: 'Low' },
          { section: 'Section 2', title: 'Obligations & Standard of Care', summary: 'Mutual reasonable care standard.', riskLevel: 'Low' },
          { section: 'Section 3', title: 'Term', summary: '3-year mutual term.', riskLevel: 'Low' },
          { section: 'Section 4', title: 'Governing Law', summary: 'Delaware jurisdiction.', riskLevel: 'Low' }
        ],
        missingStandardClauses: [
          'Exclusions from Confidential Information (e.g. Publicly known data)',
          'Permitted Disclosures (Legal / Regulatory Subpoena carve-out)',
          'Return or Destruction of Confidential Materials upon request'
        ],
        businessObjective: 'Mutual exploratory technology discussions.',
        valueExchange: 'Equal protection for both parties.',
        negotiationLeverage: 'Balanced'
      },
      claudeAnalysis: {
        overallRiskCategory: 'Low Risk',
        riskScore: 18,
        highRiskCount: 0,
        mediumRiskCount: 1,
        lowRiskCount: 3,
        risks: [
          {
            id: 'risk-201',
            clauseTitle: 'Missing Standard Exclusions Clause',
            sectionReference: 'Section 1',
            severity: 'Medium',
            scoreImpact: 10,
            explanation: 'Does not explicitly exclude information that becomes publicly available or independently developed.',
            potentialConsequence: 'Technically restricts use of information that is already public or independently created.',
            recommendedAction: 'Add standard 4-part NDA exclusion clause.',
            aiAgreementCount: 3,
            detectedBy: ['GPT-4', 'Claude', 'Gemini']
          }
        ],
        complianceGaps: []
      },
      geminiAnalysis: {
        clauseMatches: [
          {
            clauseId: 'CONF-001',
            clauseTitle: 'Mutual Confidentiality',
            originalText: 'Recipient shall protect Confidential Information with at least the same degree of care...',
            libraryEquivalent: 'Recipient agrees to hold Discloser\'s Confidential Information in strict confidence...',
            similarityScore: 92,
            qualityAssessment: 'Standard',
            improvements: ['Add Return/Destruction clause'],
            alternativeSuggestions: []
          }
        ],
        languageSimplificationSuggestions: [],
        structuralImprovements: ['Add Section 5: Return or Destruction of Materials'],
        enforceabilityWarnings: []
      },
      consensusRecommendations: [
        {
          id: 'rec-201',
          title: 'Add Standard NDA Exclusions & Carve-Outs',
          description: 'Include standard exclusions (public knowledge, prior possession, independent creation).',
          scoreReductionPotential: 8,
          modelsAgree: ['GPT-4', 'Claude', 'Gemini'],
          confidenceLevel: 'High Confidence (3 Models)',
          proposedTextChange: {
            current: 'Confidential Information includes technical data...',
            proposed: 'Confidential Information shall not include information that: (a) is or becomes publicly known; (b) was already known to Recipient; (c) is independently developed without reference to Discloser\'s information; or (d) is required to be disclosed by law.'
          }
        }
      ]
    }
  },
  {
    id: 'contract-sample-03',
    filename: 'AI_RedTeam_QA_Contractor_Agreement_Draft.docx',
    contractType: 'Independent Contractor',
    uploadedAt: '2026-08-02 09:30',
    status: 'Completed',
    riskScore: 84,
    textCount: 2980,
    rawText: `INDEPENDENT CONTRACTOR SERVICES AGREEMENT: AI MODEL EVALUATION & SOFTWARE QA
This Agreement is entered into between NeuralSynth AI Corp. ("Company") and Jordan Miller, 1099 Contractor ("Contractor").

1. SCOPE OF SERVICES
Contractor shall perform AI red-teaming, adversarial prompt testing, safety alignment validation, and automated software QA test suites for Company's LLM fine-tuning pipelines.

2. UNLIMITED CONTRACTOR INDEMNIFICATION FOR MODEL OUTPUTS & DEFECTS
Contractor shall defend, indemnify, and hold harmless Company and its investors from any and all damages, claims, or regulatory penalties arising if Company's commercial model produces hallucinations, security vulnerabilities, or copyright infringement, even if such outputs were not identified during Contractor's testing rounds.

3. FORFEITURE OF ALL PROMPT LIBRARIES & EVALUATION TOOLS
Contractor assigns to Company all right, title, and interest in all testing scripts, prompt libraries, evaluation harnesses, datasets, and background tools created before or during this engagement.

4. 2-YEAR GLOBAL NON-COMPETE FOR ALL AI WORK
For a period of twenty-four (24) months following termination, Contractor shall not perform any AI prompt testing, software QA, or RLHF contracting services for any other AI company, research lab, or freelance platform worldwide.

5. PAYMENT & MILESTONE ACCEPTANCE
Company shall pay Contractor $110/hr. Company reserves sole discretion to withhold payment if testing deliverables do not meet subjective satisfaction metrics, with no fixed review deadline.`,
    analysis: {
      analysisId: 'analysis-sample-03',
      contractId: 'contract-sample-03',
      filename: 'AI_RedTeam_QA_Contractor_Agreement_Draft.docx',
      uploadedAt: '2026-08-02 09:30',
      overallRiskScore: 84,
      confidenceInterval: '97% ± 1.5%',
      percentileRanking: 89, // Higher risk than 89% of contractor agreements
      summaryText: 'EXTREMELY HIGH RISK CONTRACTOR AGREEMENT: Contains toxic 1099 clauses including unlimited contractor indemnification for AI model hallucinations, total forfeiture of personal testing/prompt tools, an unenforceable 2-year worldwide non-compete, and indefinite payment withholding rights.',
      categoryScores: {
        liability: 95,
        termination: 70,
        intellectualProperty: 90,
        compliance: 80,
        financial: 85
      },
      gpt4Analysis: {
        documentClassification: 'Independent Contractor',
        parties: [
          { name: 'NeuralSynth AI Corp.', role: 'Hiring Company' },
          { name: 'Jordan Miller', role: 'Independent Contractor (AI QA & Red Teaming)' }
        ],
        keyTerms: [
          { label: 'Contractor Role', value: 'AI Red-Teaming & Software QA Evaluator', category: 'General' },
          { label: 'Hourly Rate', value: '$110.00 / hour', category: 'Financial' },
          { label: 'Non-Compete Duration', value: '24 Months Worldwide (Restrictive)', category: 'Termination' },
          { label: 'Hallucination Liability', value: 'Unlimited Contractor Indemnity (Toxic)', category: 'General' },
          { label: 'Tool Ownership', value: 'Total Background IP Forfeiture', category: 'Deliverables' }
        ],
        clauseInventory: [
          { section: 'Section 1', title: 'Scope of Services', summary: 'AI prompt red-teaming, safety benchmarking, and QA.', riskLevel: 'Low' },
          { section: 'Section 2', title: 'Unlimited Contractor Indemnification', summary: 'Contractor made liable for client model hallucinations and uncaught vulnerabilities.', riskLevel: 'Critical' },
          { section: 'Section 3', title: 'Tool & Prompt Library Forfeiture', summary: 'Seizes contractor background testing scripts and prompt libraries.', riskLevel: 'Critical' },
          { section: 'Section 4', title: '2-Year Non-Compete', summary: 'Bans contractor from working on any other AI/QA contracting gigs.', riskLevel: 'Critical' },
          { section: 'Section 5', title: 'Payment & Milestone Acceptance', summary: 'Subjective acceptance with no review timeline.', riskLevel: 'High' }
        ],
        missingStandardClauses: [
          'AI Hallucination & Advisory Testing Liability Carve-out',
          'Pre-Existing Tool / Benchmark Script Background IP Carve-out',
          '5-Day Objective Acceptance Review Window (Deemed Acceptance)',
          'Independent Contractor Tax & Non-Exclusivity Protection'
        ],
        businessObjective: 'Retain external contractor for AI safety red-teaming and prompt evaluation.',
        valueExchange: 'Grossly asymmetric: contractor assumes enterprise-scale AI product liability for $110/hr.',
        negotiationLeverage: 'Counterparty Favorable'
      },
      claudeAnalysis: {
        overallRiskCategory: 'Critical Risk',
        riskScore: 84,
        highRiskCount: 4,
        mediumRiskCount: 1,
        lowRiskCount: 0,
        risks: [
          {
            id: 'risk-301',
            clauseTitle: 'Unlimited Hallucination & Defect Indemnity (Section 2)',
            sectionReference: 'Section 2',
            severity: 'Critical',
            scoreImpact: 35,
            explanation: 'Contractor is forced to indemnify the hiring company if their AI model hallucinates or breaches copyright in production.',
            potentialConsequence: 'An individual contractor could be sued for millions of dollars in enterprise AI damages.',
            recommendedAction: 'Replace with standard AI testing advisory carve-out (Clause AI-TEST-001).',
            aiAgreementCount: 3,
            detectedBy: ['GPT-4', 'Claude', 'Gemini']
          },
          {
            id: 'risk-302',
            clauseTitle: 'Background Testing Harness Forfeiture (Section 3)',
            sectionReference: 'Section 3',
            severity: 'Critical',
            scoreImpact: 25,
            explanation: 'Assigns pre-existing prompt evaluation libraries and automated test harnesses to client.',
            potentialConsequence: 'Contractor loses ownership of their own career tools, scripts, and evaluation prompts.',
            recommendedAction: 'Carve out pre-existing evaluation IP and grant client report license only (Clause AI-TEST-002).',
            aiAgreementCount: 3,
            detectedBy: ['GPT-4', 'Claude', 'Gemini']
          },
          {
            id: 'risk-303',
            clauseTitle: '24-Month Global AI Non-Compete (Section 4)',
            sectionReference: 'Section 4',
            severity: 'Critical',
            scoreImpact: 20,
            explanation: 'Prevents contractor from taking any AI QA, testing, or prompt engineering gigs for 2 years.',
            potentialConsequence: 'Destroys contractor ability to freelance on Handshake AI or other platforms.',
            recommendedAction: 'Strike non-compete completely; replace with mutual confidentiality & non-exclusivity (Clause AI-TEST-004).',
            aiAgreementCount: 3,
            detectedBy: ['GPT-4', 'Claude', 'Gemini']
          }
        ],
        complianceGaps: [
          {
            id: 'gap-301',
            framework: 'Local Jurisdiction',
            status: 'Non-Compliant',
            severity: 'High',
            description: '2-year post-termination non-compete for an independent contractor is void and unlawful under California BPC § 16600.',
            remediationStep: 'Strike non-compete and rely on confidentiality agreement.'
          }
        ]
      },
      geminiAnalysis: {
        clauseMatches: [
          {
            clauseId: 'AI-TEST-001',
            clauseTitle: 'AI Testing Contractor Liability & Hallucination Defense',
            originalText: 'Contractor shall defend, indemnify, and hold harmless Company...',
            libraryEquivalent: 'Contractor provides AI model evaluation and testing on an "as-is" advisory basis...',
            similarityScore: 94,
            qualityAssessment: 'Weaker than Standard',
            improvements: ['Insert AI hallucination shield', 'Cap liability to fees paid'],
            alternativeSuggestions: []
          },
          {
            clauseId: 'AI-TEST-002',
            clauseTitle: 'Pre-Existing Evaluation Tool & Benchmark Script Carve-Out',
            originalText: 'Contractor assigns to Company all right, title, and interest in all testing scripts...',
            libraryEquivalent: 'Contractor retains all rights, title, and ownership in pre-existing prompt libraries and test harnesses...',
            similarityScore: 91,
            qualityAssessment: 'Weaker than Standard',
            improvements: ['Preserve contractor prompt tools'],
            alternativeSuggestions: []
          }
        ],
        languageSimplificationSuggestions: [],
        structuralImprovements: ['Add 5-Day Acceptance Clause', 'Add Non-Exclusivity Rider'],
        enforceabilityWarnings: ['Section 4 non-compete is legally unenforceable and creates contractor misclassification risks.']
      },
      consensusRecommendations: [
        {
          id: 'rec-301',
          title: 'Replace Toxic Hallucination Indemnity with AI Testing Shield',
          description: 'Shield contractor from generative model hallucinations and uncaught production vulnerabilities.',
          scoreReductionPotential: 32,
          modelsAgree: ['GPT-4', 'Claude', 'Gemini'],
          confidenceLevel: 'High Confidence (3 Models)',
          proposedTextChange: {
            current: 'Contractor shall defend, indemnify, and hold harmless Company from any damages if model produces hallucinations...',
            proposed: 'Contractor provides AI model evaluation and testing services on an advisory basis. In no event shall Contractor be liable for generative model hallucinations, security vulnerabilities, or algorithmic errors occurring within Company systems.'
          }
        },
        {
          id: 'rec-302',
          title: 'Carve Out Personal Testing Harness & Evaluation Datasets',
          description: 'Retain contractor ownership of personal benchmark scripts, prompt libraries, and QA test harnesses.',
          scoreReductionPotential: 24,
          modelsAgree: ['GPT-4', 'Claude', 'Gemini'],
          confidenceLevel: 'High Confidence (3 Models)',
          proposedTextChange: {
            current: 'Contractor assigns to Company all right, title, and interest in all testing scripts, prompt libraries, and evaluation harnesses...',
            proposed: 'Contractor retains all rights, title, and ownership in Contractor\'s pre-existing prompt libraries, automated test harness scripts, and evaluation methodologies. Company receives an irrevocable license to the final written test reports.'
          }
        },
        {
          id: 'rec-303',
          title: 'Strike 2-Year Non-Compete in Favor of Non-Exclusivity',
          description: 'Ensure contractor remains free to work for other AI clients on Handshake AI and other platforms.',
          scoreReductionPotential: 18,
          modelsAgree: ['GPT-4', 'Claude', 'Gemini'],
          confidenceLevel: 'High Confidence (3 Models)',
          proposedTextChange: {
            current: 'For a period of twenty-four (24) months, Contractor shall not perform any AI prompt testing or software QA for any other company...',
            proposed: 'Company acknowledges Contractor is an independent contractor. Nothing in this Agreement shall restrict Contractor from performing software testing, prompt engineering, RLHF evaluation, or QA services for other clients, provided Confidential Information is protected.'
          }
        }
      ]
    }
  }
];
