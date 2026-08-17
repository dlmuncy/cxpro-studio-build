import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { AnalysisResultsView } from './components/AnalysisResultsView';
import { ClauseLibraryView } from './components/ClauseLibraryView';
import { ContractGeneratorView } from './components/ContractGeneratorView';
import { WhiteLabelModal } from './components/WhiteLabelModal';
import { SubscriptionCheckoutModal } from './components/SubscriptionCheckoutModal';
import { StudentDiscountModal } from './components/StudentDiscountModal';
import { TermsAndPrivacyModal } from './components/TermsAndPrivacyModal';
import { ContractRecord, ClauseLibraryItem, WhiteLabelConfig, UserSubscription, SubscriptionTier, StudentLead } from './types';
import { SAMPLE_ANALYZED_CONTRACTS } from './data/seedData';
import { AIOrchestrator } from './services/aiOrchestrator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard' | 'analysis' | 'library' | 'generator'>('landing');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [contracts, setContracts] = useState<ContractRecord[]>(SAMPLE_ANALYZED_CONTRACTS);
  const [selectedContractId, setSelectedContractId] = useState<string>(SAMPLE_ANALYZED_CONTRACTS[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [clauseToInsert, setClauseToInsert] = useState<ClauseLibraryItem | null>(null);

  // Legal & Compliance Modal State
  const [showLegalModal, setShowLegalModal] = useState<boolean>(false);
  const [legalDefaultTab, setLegalDefaultTab] = useState<'terms' | 'privacy' | 'ai-disclaimer'>('terms');

  const handleOpenLegalModal = (tab: 'terms' | 'privacy' | 'ai-disclaimer' = 'terms') => {
    setLegalDefaultTab(tab);
    setShowLegalModal(true);
  };


  // User subscription state: persistent with localStorage + query param sync
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    try {
      const saved = localStorage.getItem('cxpro_user_subscription');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      tier: 'free',
      status: 'free_scan_used',
      planName: 'Free Scan Tier',
      scansUsed: 1,
      scansTotal: 1
    };
  });
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [initialSelectedPlan, setInitialSelectedPlan] = useState<'student' | 'starter' | 'professional' | 'enterprise'>('professional');
  const [preappliedPromoCode, setPreappliedPromoCode] = useState<string>('');
  const [paymentSuccessBanner, setPaymentSuccessBanner] = useState<string | null>(null);

  // Student Discount Modal state
  const [showStudentModal, setShowStudentModal] = useState<boolean>(false);
  const [claimedStudentLead, setClaimedStudentLead] = useState<StudentLead | null>(null);

  // White label config
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>({
    enabled: false,
    firmName: 'Meridian Legal Partners',
    primaryColor: '#1e3a8a',
    customFooterText: 'Attorney-Client Privileged & Confidential'
  });
  const [showWhiteLabelModal, setShowWhiteLabelModal] = useState<boolean>(false);

  // Check for Stripe Checkout Success Redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('session') === 'success' || params.get('payment_success') === 'true';
    const tierParam = (params.get('tier') || 'professional') as SubscriptionTier;

    if (isSuccess && ['student', 'starter', 'professional', 'enterprise'].includes(tierParam)) {
      handleUpgradeSubscription(tierParam);
      setPaymentSuccessBanner(`🎉 Welcome to ${tierParam.toUpperCase()}! Your subscription is now fully active.`);
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => setPaymentSuccessBanner(null), 10000);
    }
  }, []);

  // Sync Dark mode HTML class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  const handleOpenSubscriptionModal = (planId: 'student' | 'starter' | 'professional' | 'enterprise' = 'professional') => {
    setInitialSelectedPlan(planId);
    setShowSubscriptionModal(true);
  };

  const handleOpenStudentModal = () => {
    setShowStudentModal(true);
  };

  const handleApplyStudentCode = (lead: StudentLead) => {
    setClaimedStudentLead(lead);
    setPreappliedPromoCode('HANDSHAKE49');
    setInitialSelectedPlan('student');
    setShowSubscriptionModal(true);
  };

  const handleUpgradeSubscription = (tier: SubscriptionTier) => {
    const planNames: Record<SubscriptionTier, string> = {
      free: 'Free Tier',
      student: 'Student (Handshake AI - Software & AI Testing)',
      starter: 'Starter Plan',
      professional: 'Professional Plan',
      enterprise: 'Enterprise Team'
    };
    const scanTotals: Record<SubscriptionTier, number> = {
      free: 1,
      student: 3,
      starter: 9999,
      professional: 9999,
      enterprise: 9999
    };

    const newSubscription: UserSubscription = {
      tier,
      status: 'active',
      planName: planNames[tier],
      scansUsed: 1,
      scansTotal: scanTotals[tier],
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      discountApplied: tier === 'student' ? 'HANDSHAKE49 ($49.99/mo • 3 Scans/mo)' : undefined
    };

    setSubscription(newSubscription);
    try {
      localStorage.setItem('cxpro_user_subscription', JSON.stringify(newSubscription));
    } catch (e) {}
  };

  // Upload or paste contract text handler
  const handleUploadContract = async (file: File | null, pastedText: string, filename: string) => {
    setIsAnalyzing(true);
    setActiveTab('dashboard');

    let textContent = pastedText;
    let docName = filename || 'Uploaded_Contract.txt';

    if (file) {
      try {
        textContent = await file.text();
      } catch (e) {
        console.warn('File reading error, using simulated parser:', e);
        textContent = `CONTRACT DOCUMENT: ${file.name}\nUploaded file size: ${file.size} bytes.\nSample content: THIS AGREEMENT is made between Disclosing Party and Receiving Party.`;
      }
    }

    if (!textContent || textContent.trim().length === 0) {
      textContent = `STANDARD COMMERCIAL AGREEMENT\nEffective Date: ${new Date().toISOString().substring(0, 10)}\n\n1. OBLIGATIONS & SERVICES\nVendor agrees to perform services according to specs.\n\n2. INDEMNIFICATION & LIABILITY\nCustomer agrees to indemnify Vendor with unlimited liability.\n\n3. TERMINATION\nAuto-renews for 1 year terms unless notice provided 120 days prior.`;
    }

    try {
      // Call Multi-AI Orchestrator
      const analysisResult = await AIOrchestrator.analyzeContractText(textContent, docName);

      const newRecord: ContractRecord = {
        id: analysisResult.contractId,
        filename: docName,
        contractType: analysisResult.gpt4Analysis.documentClassification,
        uploadedAt: analysisResult.uploadedAt,
        status: 'Completed',
        riskScore: analysisResult.overallRiskScore,
        textCount: textContent.length,
        rawText: textContent,
        analysis: analysisResult
      };

      setContracts(prev => [newRecord, ...prev]);
      setSelectedContractId(newRecord.id);
      setSubscription(prev => ({
        ...prev,
        scansUsed: prev.scansUsed + 1
      }));
      setActiveTab('analysis');
    } catch (err) {
      console.error('Failed to run Multi-AI analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectContract = (contractId: string) => {
    setSelectedContractId(contractId);
    setActiveTab('analysis');
  };

  const handleInsertClauseIntoGenerator = (clause: ClauseLibraryItem) => {
    setClauseToInsert(clause);
    setActiveTab('generator');
  };

  const handleAuditGeneratedContract = (contractText: string, filename: string) => {
    handleUploadContract(null, contractText, filename);
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] dark:bg-[#121212] text-[#1A1A1A] dark:text-slate-100 font-sans transition-colors flex flex-col justify-between selection:bg-[#F97316] selection:text-white">
      <div>
        {/* NAVBAR */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          whiteLabel={whiteLabel}
          onOpenWhiteLabelModal={() => setShowWhiteLabelModal(true)}
          currentSubscription={subscription}
          onOpenSubscriptionModal={() => handleOpenSubscriptionModal('professional')}
          onOpenStudentModal={handleOpenStudentModal}
        />

        {/* PAYMENT SUCCESS TOAST BANNER */}
        {paymentSuccessBanner && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-center text-xs font-mono font-bold flex items-center justify-center space-x-2 shadow-md animate-bounce">
            <span>{paymentSuccessBanner}</span>
            <button 
              onClick={() => setPaymentSuccessBanner(null)} 
              className="ml-2 text-white/80 hover:text-white underline text-[10px]"
            >
              [Dismiss]
            </button>
          </div>
        )}

        {/* MAIN VIEW ROUTING */}
        <main className="pb-12">
          {activeTab === 'landing' && (
            <LandingPage
              onStartTrial={() => setActiveTab('dashboard')}
              onSelectPlan={(plan) => handleOpenSubscriptionModal(plan)}
              onOpenStudentModal={handleOpenStudentModal}
              onOpenLegalModal={handleOpenLegalModal}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              contracts={contracts}
              onUploadContract={handleUploadContract}
              onSelectContract={handleSelectContract}
              onNavigateToTab={setActiveTab}
              isAnalyzing={isAnalyzing}
              currentSubscription={subscription}
              onOpenSubscriptionModal={() => handleOpenSubscriptionModal('student')}
            />
          )}

          {activeTab === 'analysis' && selectedContract && selectedContract.analysis && (
            <AnalysisResultsView
              analysis={selectedContract.analysis}
              onBackToDashboard={() => setActiveTab('dashboard')}
              onNavigateToGeneratorWithText={(summary) => {
                setActiveTab('generator');
              }}
              currentSubscription={subscription}
              onOpenSubscriptionModal={handleOpenSubscriptionModal}
            />
          )}

          {activeTab === 'library' && (
            <ClauseLibraryView onInsertIntoGenerator={handleInsertClauseIntoGenerator} />
          )}

          {activeTab === 'generator' && (
            <ContractGeneratorView
              initialClauseToInsert={clauseToInsert}
              onAuditGeneratedContract={handleAuditGeneratedContract}
            />
          )}
        </main>
      </div>

      {/* FOOTER & STATUS BAR */}
      <div>
        <footer className="border-t border-[#D1D1D1] dark:border-[#222222] bg-white dark:bg-[#1A1A1A] py-4 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1 font-mono">
            <p className="font-bold text-[#1A1A1A] dark:text-slate-200 uppercase font-sans">
              {whiteLabel.enabled ? whiteLabel.firmName : 'CXPRO'} — MULTI-AI LEGAL CONTRACT AUDITOR & REDLINE ENGINE
            </p>
            <p className="text-[10px] text-slate-400">
              {whiteLabel.enabled ? whiteLabel.customFooterText : 'POWERED BY GPT-4o, CLAUDE 3.5 & GEMINI 1.5 PRO • 500+ CLAUSE BENCHMARKS'}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3 text-[10px] text-slate-400">
              <button
                type="button"
                onClick={() => handleOpenLegalModal('terms')}
                className="hover:text-[#F97316] underline"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleOpenLegalModal('privacy')}
                className="hover:text-[#F97316] underline"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleOpenLegalModal('ai-disclaimer')}
                className="hover:text-[#F97316] underline"
              >
                AI Safety Disclaimer
              </button>
            </div>
          </div>
        </footer>

        {/* SYSTEM STATUS BAR FOOTER */}
        <div className="h-6 bg-[#1A1A1A] text-white flex items-center justify-between px-4 text-[9px] font-mono border-t border-[#333333]">
          <div className="flex gap-4 items-center">
            <span className="text-[#F97316]">ENGINE: CXPRO MULTI-AI v4.2</span>
            <span className="opacity-40">|</span>
            <span className="text-emerald-400">TIER: {subscription.planName.toUpperCase()}</span>
            {subscription.discountApplied && (
              <>
                <span className="opacity-40">|</span>
                <span className="text-amber-400 font-bold">DISCOUNT: {subscription.discountApplied}</span>
              </>
            )}
            <span className="opacity-40 hidden sm:inline">|</span>
            <span className="hidden sm:inline">ENCRYPTION: AES-256 ACTIVE</span>
          </div>
          <div className="flex gap-4 items-center">
            <button
              type="button"
              onClick={() => handleOpenLegalModal('terms')}
              className="text-slate-400 hover:text-white underline cursor-pointer"
            >
              LEGAL & PRIVACY (T&C)
            </button>
            <span className="opacity-40">|</span>
            <span className="text-emerald-400">STATUS: ALL SYSTEMS OPERATIONAL</span>
            <span className="opacity-40 hidden md:inline">|</span>
            <span className="hidden md:inline">TIME: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* WHITE LABEL REBRANDING MODAL */}
      {showWhiteLabelModal && (
        <WhiteLabelModal
          config={whiteLabel}
          currentSubscription={subscription}
          onUpgradeToEnterprise={() => handleOpenSubscriptionModal('enterprise')}
          onSave={(newConf) => setWhiteLabel(newConf)}
          onClose={() => setShowWhiteLabelModal(false)}
        />
      )}

      {/* SUBSCRIPTION & PAYMENT CHECKOUT MODAL */}
      <SubscriptionCheckoutModal
        isOpen={showSubscriptionModal}
        onClose={() => {
          setShowSubscriptionModal(false);
          setPreappliedPromoCode('');
        }}
        currentSubscription={subscription}
        onUpgrade={handleUpgradeSubscription}
        initialPlan={initialSelectedPlan}
        onOpenStudentClaimModal={() => {
          setShowSubscriptionModal(false);
          setShowStudentModal(true);
        }}
        preappliedPromoCode={preappliedPromoCode}
        onOpenLegalModal={handleOpenLegalModal}
      />

      {/* HANDSHAKE AI STUDENT DISCOUNT CAPTURE MODAL */}
      <StudentDiscountModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        onApplyStudentCode={handleApplyStudentCode}
      />

      {/* TERMS OF SERVICE, PRIVACY & AI DISCLAIMER MODAL */}
      <TermsAndPrivacyModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        defaultTab={legalDefaultTab}
      />
    </div>
  );
}

