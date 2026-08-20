import React, { useState } from 'react';
import { Shield, Sparkles, CheckCircle, ArrowRight, Zap, Calculator, Scale, Layers, Award, FileCheck, ExternalLink, Lock, Check, GraduationCap, Tag } from 'lucide-react';
import { PRICING_TIERS } from './SubscriptionCheckoutModal';

interface LandingPageProps {
  onStartTrial: () => void;
  onSelectPlan: (plan: 'student' | 'starter' | 'professional' | 'enterprise') => void;
  onOpenStudentModal?: () => void;
  onOpenLegalModal?: (tab?: 'terms' | 'privacy' | 'ai-disclaimer') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartTrial,
  onSelectPlan,
  onOpenStudentModal,
  onOpenLegalModal
}) => {

  // ROI Calculator state
  const [attorneysCount, setAttorneysCount] = useState<number>(3);
  const [hourlyRate, setHourlyRate] = useState<number>(350);
  const [contractsPerWeek, setContractsPerWeek] = useState<number>(8);

  const hoursSavedPerWeek = Math.round(contractsPerWeek * 1.8 * (attorneysCount / 2));
  const weeklyDollarsSaved = hoursSavedPerWeek * hourlyRate;
  const annualDollarsSaved = weeklyDollarsSaved * 50;

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#121212] text-[#1A1A1A] dark:text-slate-100 transition-colors font-mono">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#D1D1D1] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-blue-50 border border-blue-200 text-[#007BFF] text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#007BFF] animate-pulse" />
              <span>CXPRO.SITE MULTI-MODEL CONSENSUS ENGINE</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1A1A] uppercase font-sans leading-tight">
              Don't Sign Blind. <span className="text-[#007BFF]">See What's Hiding.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-mono">
              Built for AI testers, model trainers, and QA professionals. cxpro.site runs three independent AI models in parallel to analyze any contract or terms of service, flag hidden risks, and give you a clear risk score before you sign. No copy-paste needed with our browser extension.
            </p>


            {/* CTA Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onStartTrial}
                className="w-full sm:w-auto px-6 py-3 rounded bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Audit Sample Contract (Free Scan)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectPlan('professional')}
                className="w-full sm:w-auto px-6 py-3 rounded bg-white text-[#1A1A1A] font-bold text-xs uppercase tracking-wider border border-[#D1D1D1] hover:bg-[#F1F1F1] transition-all flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 text-[#007BFF]" />
                <span>View Subscription Plans</span>
              </button>

              {onOpenStudentModal && (
                <button
                  onClick={onOpenStudentModal}
                  className="w-full sm:w-auto px-4 py-3 rounded bg-amber-50 text-amber-700 border border-amber-400 hover:bg-amber-100 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
                >
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  <span>AI Tester / QA Pro ($49.99)</span>
                </button>
              )}
            </div>

            {/* Trust indicators */}
            <div className="pt-8 border-t border-[#D1D1D1]/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-[11px] text-slate-600">SOC2 & GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-[#007BFF] flex-shrink-0" />
                <span className="text-[11px] text-slate-600">98.4% Consensus Accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="text-[11px] text-slate-600">500+ Vetted Clauses</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span className="text-[11px] text-slate-600">DOCX Redlines Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE AI ENGINES OVERVIEW */}
      <section className="py-12 bg-[#F1F1F1] dark:bg-[#151515] border-b border-[#D1D1D1] dark:border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-xl font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-sans">
              How It Works
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Three independent AI models analyze your contract simultaneously. When they agree, you know the risk is real.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white dark:bg-[#1E1E1E] p-6 rounded border border-[#D1D1D1] dark:border-[#333333] shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded border border-[#D1D1D1] dark:border-[#333333] bg-white dark:bg-[#181818] space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
                  <Layers className="w-4 h-4" />
                  <span>Model A: Structural Analysis</span>
                </div>
                <h4 className="font-bold text-xs text-[#1A1A1A] dark:text-white uppercase font-sans">Structure & Intent</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Extracts commercial terms, auto-renewals, missing mandatory clauses, and party leverage dynamics.</p>
              </div>

              <div className="p-3.5 rounded border border-[#D1D1D1] dark:border-[#333333] bg-white dark:bg-[#181818] space-y-1.5">
                <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase">
                  <Shield className="w-4 h-4" />
                  <span>Model B: Risk Detection</span>
                </div>
                <h4 className="font-bold text-xs text-[#1A1A1A] dark:text-white uppercase font-sans">Risk & Compliance</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Quantifies 0-100 liability risk scores, flags one-sided indemnification, and audits GDPR / CCPA gaps.</p>
              </div>

              <div className="p-3.5 rounded border border-[#D1D1D1] dark:border-[#333333] bg-white dark:bg-[#181818] space-y-1.5">
                <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase">
                  <Scale className="w-4 h-4" />
                  <span>Model C: Clause Quality</span>
                </div>
                <h4 className="font-bold text-xs text-[#1A1A1A] dark:text-white uppercase font-sans">Clause Comparison</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Cross-checks provisions against 500+ library rules and provides 1-click watertight replacement rewrites.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI TESTER & QA PROFESSIONAL DISCOUNT SECTION */}
      <section className="py-10 bg-amber-50/50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#1C1C1C] border border-amber-300 dark:border-amber-800/60 rounded p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>AI Tester & QA Pro Discount</span>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-sans">
                Contract Defense for AI Testers & QA Pros: <span className="text-[#F97316] font-mono">$49.99/mo</span>
                <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400 font-mono">(3 Scans/mo)</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
                Working on 1099 software QA, AI prompt red-teaming, model benchmarking, or RLHF data testing? Protect yourself from uncapped hallucination indemnity, unreasonable bug liability, and IP forfeitures with voucher <strong className="text-[#F97316]">HANDSHAKE49</strong> (66% off — 3 Multi-AI contract audits per month).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto flex-shrink-0">
              {onOpenStudentModal && (
                <button
                  type="button"
                  onClick={onOpenStudentModal}
                  className="px-5 py-2.5 rounded bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-2xs transition-all flex items-center justify-center space-x-2"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Claim $49.99 Contractor Code</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onSelectPlan('student')}
                className="px-5 py-2 rounded bg-[#F1F1F1] dark:bg-[#2A2A2A] hover:bg-[#E5E5E5] text-[#1A1A1A] dark:text-slate-200 font-bold text-xs uppercase tracking-wider border border-[#D1D1D1] dark:border-[#333333] flex items-center justify-center space-x-2"
              >
                <span>Instant Stripe Checkout ($49.99)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR SECTION */}
      <section className="py-12 bg-white dark:bg-[#1A1A1A] border-b border-[#D1D1D1] dark:border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-xl font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-sans">
              Calculate Your Legal Team's ROI
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              cxpro.site saves an average of 15-20 hours per week per attorney while reducing catastrophic breach risk.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[#F8F8F8] dark:bg-[#202020] p-5 sm:p-6 rounded border border-[#D1D1D1] dark:border-[#333333] shadow-xs">
            {/* Inputs */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase text-[11px]">
                  Attorneys / Legal Reviewers: <span className="text-[#F97316] font-bold">{attorneysCount}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={attorneysCount}
                  onChange={(e) => setAttorneysCount(parseInt(e.target.value))}
                  className="w-full accent-[#F97316] cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase text-[11px]">
                  Average Billing Rate ($/hr): <span className="text-[#F97316] font-bold">${hourlyRate}/hr</span>
                </label>
                <input
                  type="range"
                  min="150"
                  max="800"
                  step="25"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className="w-full accent-[#F97316] cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase text-[11px]">
                  Contracts Reviewed / Week: <span className="text-[#F97316] font-bold">{contractsPerWeek}</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={contractsPerWeek}
                  onChange={(e) => setContractsPerWeek(parseInt(e.target.value))}
                  className="w-full accent-[#F97316] cursor-pointer"
                />
              </div>
            </div>

            {/* Results Display */}
            <div className="bg-white dark:bg-[#181818] p-5 rounded border border-[#D1D1D1] dark:border-[#333333] space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Weekly Time Saved</span>
                <span className="text-2xl font-extrabold text-[#1A1A1A] dark:text-white font-mono">{hoursSavedPerWeek} Hours</span>
              </div>

              <div className="pt-2 border-t border-[#D1D1D1]/60 dark:border-[#333333]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Annual Value & Fee Savings</span>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  ${annualDollarsSaved.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Based on standard 50-week operating year</span>
              </div>

              <button
                onClick={() => onSelectPlan('professional')}
                className="w-full py-2 px-3 rounded bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-2xs transition-all"
              >
                Unlock Full Analysis Engine
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING & SUBSCRIPTION PLANS */}
      <section className="py-12 bg-[#F8F8F8] dark:bg-[#151515] border-b border-[#D1D1D1] dark:border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-xl font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-sans">
              cxpro.site Subscription Plans & Payment Options
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select a plan below to activate real-time Multi-AI redlining and unblur all contract risk provisions.
            </p>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {PRICING_TIERS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded bg-white dark:bg-[#1E1E1E] border p-4 shadow-sm flex flex-col justify-between ${
                  plan.id === 'student'
                    ? 'border-[#F97316]/60 bg-amber-50/10 dark:bg-amber-950/10'
                    : plan.popular
                    ? 'border-[#F97316] ring-1 ring-[#F97316]'
                    : 'border-[#D1D1D1] dark:border-[#333333]'
                }`}
              >
                {plan.badge ? (
                  <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded bg-emerald-600 text-white text-[8px] font-bold uppercase tracking-wider shadow-xs">
                    {plan.badge}
                  </div>
                ) : plan.popular ? (
                  <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded bg-[#F97316] text-white text-[8px] font-bold uppercase tracking-wider shadow-xs">
                    Most Popular
                  </div>
                ) : null}

                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-[#1A1A1A] dark:text-white font-sans truncate">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-2xl font-black text-[#1A1A1A] dark:text-white font-mono">
                        ${plan.price.toFixed(plan.id === 'student' ? 2 : 0)}
                      </span>
                      <span className="text-slate-500 text-xs ml-1 font-mono">/mo</span>
                    </div>

                    {/* Show quota for student only, or target audience for other tiers */}
                    {plan.id === 'student' ? (
                      <span className="text-[10px] text-[#F97316] font-bold block mt-0.5 font-mono">
                        {plan.analysesPerMonth}
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono block mt-0.5">
                        {plan.tierTarget}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-1.5 text-[10px] text-slate-600 dark:text-slate-300 pt-2 border-t border-[#D1D1D1]/60 dark:border-[#333333]">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start space-x-1.5 leading-tight">
                        <Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 space-y-2 pt-3 border-t border-[#D1D1D1]/60 dark:border-[#333333]">
                  <button
                    onClick={() => onSelectPlan(plan.id)}
                    className={`w-full py-2 px-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                      plan.popular || plan.id === 'student'
                        ? 'bg-[#F97316] hover:bg-orange-600 text-white shadow-2xs'
                        : 'bg-[#F1F1F1] dark:bg-[#2A2A2A] hover:bg-[#E5E5E5] text-[#1A1A1A] dark:text-slate-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE FOOTER & COMPLIANCE SECTION */}
      <footer className="border-t border-[#D1D1D1] dark:border-[#333333] bg-[#F1F1F1] dark:bg-[#151515] py-8 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded bg-[#F97316] text-white flex items-center justify-center font-bold text-[10px]">
                CX
              </div>
              <span className="font-bold text-[#1A1A1A] dark:text-white uppercase font-sans">cxpro.site</span>
            </div>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              © {new Date().getFullYear()} cxpro.site. All rights reserved.
            </span>

          </div>

          {/* LEGAL & COMPLIANCE LINKS */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => onOpenLegalModal?.('terms')}
              className="hover:text-[#F97316] transition-colors underline underline-offset-2"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => onOpenLegalModal?.('privacy')}
              className="hover:text-[#F97316] transition-colors underline underline-offset-2"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onOpenLegalModal?.('ai-disclaimer')}
              className="hover:text-[#F97316] transition-colors underline underline-offset-2"
            >
              AI Safety & Disclaimer
            </button>
            <a
              href="mailto:support@cxpro.site"
              className="hover:text-[#F97316] transition-colors flex items-center gap-1 text-slate-500 font-bold"
            >
              support@cxpro.site
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

