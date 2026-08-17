export type ContractType = 
  | 'NDA' 
  | 'MSA' 
  | 'SaaS Subscription' 
  | 'Employment' 
  | 'Independent Contractor' 
  | 'Software License' 
  | 'Partnership' 
  | 'Real Estate Lease' 
  | 'General Commercial';

export type RiskSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ClauseInventoryItem {
  section: string;
  title: string;
  summary: string;
  riskLevel: RiskSeverity;
}

export interface GPT4StructureAnalysis {
  documentClassification: ContractType;
  parties: { name: string; role: string }[];
  keyTerms: {
    label: string;
    value: string;
    category: 'Term' | 'Financial' | 'Deliverables' | 'Termination' | 'Governing Law' | 'General';
  }[];
  clauseInventory: ClauseInventoryItem[];
  missingStandardClauses: string[];
  businessObjective: string;
  valueExchange: string;
  negotiationLeverage: 'Client Favorable' | 'Counterparty Favorable' | 'Balanced';
}

export interface RiskProvision {
  id: string;
  clauseTitle: string;
  sectionReference: string;
  severity: RiskSeverity;
  scoreImpact: number; // e.g. 15 points
  explanation: string;
  potentialConsequence: string;
  recommendedAction: string;
  aiAgreementCount: number; // 1, 2, or 3 models
  detectedBy: ('GPT-4' | 'Claude' | 'Gemini')[];
}

export type RiskItem = RiskProvision;

export interface ComplianceGap {
  id: string;
  framework: string;
  status: 'Compliant' | 'Non-Compliant' | 'Partially Compliant' | 'Warning' | 'Unknown' | string;
  severity: RiskSeverity;
  description: string;
  remediationStep: string;
}

export interface ClaudeRiskAnalysis {
  overallRiskCategory: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical Risk';
  riskScore: number; // 0 - 100
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  risks: RiskProvision[];
  complianceGaps: ComplianceGap[];
}

export interface ClauseMatch {
  clauseId: string;
  clauseTitle: string;
  originalText: string;
  libraryEquivalent: string;
  similarityScore: number; // 0 - 100
  qualityAssessment: 'Stronger than Standard' | 'Standard' | 'Weaker than Standard' | 'Ambiguous';
  improvements: string[];
  alternativeSuggestions: (string | { title: string; text: string; favorability?: string; tradeOffs?: string })[];
}

export interface GeminiClauseAnalysis {
  clauseMatches: ClauseMatch[];
  languageSimplificationSuggestions: {
    originalJargon: string;
    plainLanguageAlternative: string;
    reason: string;
  }[];
  structuralImprovements: string[];
  enforceabilityWarnings: string[];
}

export interface ConsensusRecommendation {
  id: string;
  title: string;
  description: string;
  scoreReductionPotential: number; // e.g. 15 points
  modelsAgree: ('GPT-4' | 'Claude' | 'Gemini')[];
  confidenceLevel: 'High Confidence (3 Models)' | 'Moderate Confidence (2 Models)' | 'Requires Human Verification (1 Model)';
  proposedTextChange: {
    current: string;
    proposed: string;
  };
}

export interface ContractAnalysisResult {
  analysisId: string;
  contractId: string;
  filename: string;
  uploadedAt: string;
  overallRiskScore: number; // 0 - 100
  confidenceInterval: string; // e.g. "94% ± 3%"
  percentileRanking: number; // e.g. 78 -> "Riskier than 78% of SaaS contracts"
  gpt4Analysis: GPT4StructureAnalysis;
  claudeAnalysis: ClaudeRiskAnalysis;
  geminiAnalysis: GeminiClauseAnalysis;
  consensusRecommendations: ConsensusRecommendation[];
  categoryScores: {
    liability: number;
    termination: number;
    intellectualProperty: number;
    compliance: number;
    financial: number;
  };
  summaryText: string;
}

export interface ContractRecord {
  id: string;
  filename: string;
  contractType: ContractType;
  uploadedAt: string;
  status: 'Completed' | 'Analyzing' | 'Failed';
  riskScore?: number;
  textCount?: number;
  rawText: string;
  analysis?: ContractAnalysisResult;
}

export interface ClauseLibraryItem {
  id: string;
  category: string;
  title: string;
  text: string;
  industry: string[];
  jurisdiction: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  favorability: 'Vendor-favorable' | 'Customer-favorable' | 'Balanced' | 'Discloser-favorable';
  alternatives: string[]; // clause ids
  tags: string[];
  usageCount: number;
  lastUpdated: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultClauses: string[];
  fields: {
    key: string;
    label: string;
    type: 'text' | 'date' | 'number' | 'select' | 'textarea';
    options?: string[];
    required: boolean;
    defaultValue?: string;
  }[];
}

export interface PricingPlan {
  id: 'student' | 'starter' | 'professional' | 'enterprise';
  name: string;
  price: number;
  period: string;
  popular?: boolean;
  tierTarget?: string;
  analysesPerMonth?: string; // Only displayed for Student (3/mo)
  features: string[];
  cta: string;
  paymentLinkUrl?: string;
  badge?: string;
}

export type SubscriptionTier = 'free' | 'student' | 'starter' | 'professional' | 'enterprise';

export interface UserSubscription {
  tier: SubscriptionTier;
  status: 'active' | 'trial' | 'free_scan_used' | 'unsubscribed';
  planName: string;
  scansUsed: number;
  scansTotal: number;
  renewalDate?: string;
  paymentLink?: string;
  discountApplied?: string;
}

export interface StudentLead {
  id: string;
  fullName: string;
  email: string;
  university?: string;
  handshakeProfile?: string;
  contractorRole?: string; // e.g. "AI Model Tester / RLHF Evaluator", "Software QA Contractor"
  discountCode: string;
  claimedAt: string;
  status: 'sent' | 'redeemed';
}

export interface WhiteLabelConfig {
  enabled: boolean;
  firmName: string;
  logoUrl?: string;
  primaryColor: string;
  customFooterText: string;
}

export interface BillingInvoice {
  id: string;
  transactionId: string;
  planId: SubscriptionTier;
  planName: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'annual';
  cardLast4: string;
  cardBrand: string;
  issuedAt: string;
  status: 'paid' | 'pending';
}

export interface DispatchedEmail {
  id: string;
  type: 'student_voucher' | 'payment_receipt';
  to: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  htmlContent: string;
  voucherCode?: string;
  invoiceId?: string;
}
