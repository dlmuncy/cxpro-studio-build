import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  Lock, 
  CreditCard, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Copy, 
  GraduationCap, 
  Tag,
  Building2,
  Users,
  FileCheck2,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { PricingPlan, SubscriptionTier, UserSubscription, BillingInvoice } from '../types';
import { getStripeCheckoutUrl } from '../config/stripe';

interface SubscriptionCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription: UserSubscription;
  onUpgrade: (tier: SubscriptionTier) => void;
  initialPlan?: 'student' | 'starter' | 'professional' | 'enterprise';
  onOpenStudentClaimModal?: () => void;
  preappliedPromoCode?: string;
  onOpenLegalModal?: (tab?: 'terms' | 'privacy' | 'ai-disclaimer') => void;
}


export const PRICING_TIERS: PricingPlan[] = [
  {
    id: 'student',
    name: 'Student (Handshake AI - Software & AI Testing)',
    price: 49.99,
    period: '/month',
    badge: 'Software & AI Testing Contractors',
    tierTarget: 'Students & 1099 AI/QA Freelancers',
    analysesPerMonth: '3 Contract Scans / mo',
    features: [
      '3 Full Multi-AI Contract Audits / mo (1099, QA & SOWs)',
      'Uncensored Risk Analysis (All 14+ Vulnerabilities Unlocked)',
      'AI Red-Teaming, RLHF & QA Contractor Risk Detection',
      'IP Assignment & Model Training Carve-Out Protection',
      'AI Hallucination & Software Bug Liability Shields',
      '500+ Software Contractor & Testing Clause Library',
      'Track-Changes DOCX Redlines & Contractor Export'
    ],
    cta: 'Subscribe for $49.99/mo',
    paymentLinkUrl: getStripeCheckoutUrl('student')
  },
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 149,
    period: '/month',
    tierTarget: 'Solo In-House Counsel & Independent Operators',
    features: [
      'Uncensored 360° Multi-AI Risk Engine (All Issues & Dollar Exposure Unlocked)',
      'Consensus Recommendations & 1-Click Interactive Clause Remediation',
      'Track-Changes DOCX & High-Res PDF Redline Exports',
      'Access to 500+ Commercial & SaaS Clause Library with Instant Search',
      'Dedicated Single-User Workspace with Full Historical Audit Archive',
      'Standard Email & Ticket Legal Tech Support'
    ],
    cta: 'Subscribe to Starter',
    paymentLinkUrl: getStripeCheckoutUrl('starter')
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    price: 349,
    period: '/month',
    popular: true,
    tierTarget: 'High-Growth Legal Teams & Consultancies',
    features: [
      'Real-Time 3-AI Multi-Model Consensus (GPT-4 + Claude + Gemini)',
      'Automated Redline Engine with Tracked Changes & Counter-Proposals',
      'Interactive Contract Generator with Custom Clause Injection',
      'Multi-Party Negotiation Risk Scoring & Leverage Balance Analysis',
      '5 Collaborative Team Seats with Role-Based Permissions',
      'Priority 24/7 SLA & Live Multi-Jurisdiction Regulatory Validation'
    ],
    cta: 'Subscribe to Pro',
    paymentLinkUrl: getStripeCheckoutUrl('professional')
  },
  {
    id: 'enterprise',
    name: 'Enterprise Legal Team',
    price: 699,
    period: '/month',
    tierTarget: 'Full Corporate Legal Depts & Global Law Firms',
    features: [
      'Full White-Label Rebranding (Custom Law Firm Name, Logo & PDF Headers)',
      'Custom Firm Clause Repository & Master Playbook Ingestion',
      'Unlimited User Seats & Enterprise Single Sign-On (SSO / SAML)',
      'Full REST API & Webhook Access for Automated Contract Pipelines',
      'Dedicated Account Legal Specialist & Custom AI Fine-Tuning',
      'SOC 2 Type II Compliance, Audit Trails & Custom Data Retention'
    ],
    cta: 'Subscribe to Enterprise',
    paymentLinkUrl: getStripeCheckoutUrl('enterprise')
  }
];

export const SubscriptionCheckoutModal: React.FC<SubscriptionCheckoutModalProps> = ({
  isOpen,
  onClose,
  currentSubscription,
  onUpgrade,
  initialPlan = 'professional',
  onOpenStudentClaimModal,
  preappliedPromoCode,
  onOpenLegalModal
}) => {

  const [selectedPlanId, setSelectedPlanId] = useState<'student' | 'starter' | 'professional' | 'enterprise'>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  // Promo code state
  const [promoInput, setPromoInput] = useState<string>(preappliedPromoCode || '');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(preappliedPromoCode ? 'HANDSHAKE49' : null);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPlanId(initialPlan);
      setBillingCycle('annual');
      setIsRedirecting(false);
      setPromoInput(preappliedPromoCode || '');
      setAppliedPromo(preappliedPromoCode ? 'HANDSHAKE49' : null);
      setPromoMessage(preappliedPromoCode ? { text: 'Handshake AI $49.99 Student Discount Applied!' } : null);
    }
  }, [isOpen, initialPlan, preappliedPromoCode]);

  if (!isOpen) return null;

  const handleApplyPromoCode = () => {
    const clean = promoInput.trim().toUpperCase();
    if (clean === 'HANDSHAKE49' || clean === 'HANDSHAKE' || clean === 'STUDENT49' || clean === 'HANDSHAKEAI') {
      setAppliedPromo('HANDSHAKE49');
      setSelectedPlanId('student');
      setPromoMessage({ text: 'Success! Handshake AI $49.99/mo Student & Contractor Discount Applied.' });
    } else if (clean === '') {
      setAppliedPromo(null);
      setPromoMessage(null);
    } else {
      setPromoMessage({ text: 'Invalid promo code. Enter HANDSHAKE49 or claim your verified student voucher.', isError: true });
    }
  };

  const selectedPlan = PRICING_TIERS.find(p => p.id === selectedPlanId) || PRICING_TIERS[2];
  
  // Calculate price taking into account student tier and annual discount
  let calculatedPrice = selectedPlan.price;
  if (selectedPlan.id !== 'student' && billingCycle === 'annual') {
    calculatedPrice = Math.round(selectedPlan.price * 0.8);
  } else if (selectedPlan.id === 'student' || appliedPromo === 'HANDSHAKE49') {
    calculatedPrice = 49.99;
  }

  // Handle direct redirect to Stripe Checkout
  const handleProceedToStripe = () => {
    setIsRedirecting(true);
    const checkoutUrl = getStripeCheckoutUrl(selectedPlan.id);
    
    // Redirect to the Stripe Hosted Checkout Page
    setTimeout(() => {
      window.location.href = checkoutUrl;
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-mono">
      <div className="bg-white dark:bg-[#181818] border border-[#D1D1D1] dark:border-[#333333] rounded max-w-5xl w-full p-4 sm:p-6 shadow-2xl space-y-4 my-8 relative">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#D1D1D1] dark:border-[#333333] pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#F97316] flex items-center justify-center text-white font-bold text-xs">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-sans">
                Upgrade CXPro Multi-AI Legal Suite
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                OFFICIAL STRIPE ENCRYPTED BILLING • INSTANT ACCESS TO UNBLURRED AUDITS & REDLINES
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded border border-[#D1D1D1] dark:border-[#333333] flex items-center justify-center text-slate-500 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#252525]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CURRENT SUBSCRIPTION BANNER & PROMO CODE */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 p-2.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Current Tier:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              currentSubscription.tier === 'free' 
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' 
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            }`}>
              {currentSubscription.tier === 'free' ? 'Free Audit Tier (3 Sample Issues Only)' : `${currentSubscription.planName} Active`}
            </span>
          </div>

          {/* PROMO CODE BOX */}
          <div className="flex items-center space-x-1.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-52">
              <Tag className="w-3 h-3 absolute left-2 top-2 text-slate-400" />
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                placeholder="Promo Code (HANDSHAKE49)"
                className="w-full pl-6 pr-2 py-1 rounded bg-white dark:bg-[#181818] border border-[#D1D1D1] dark:border-[#333333] text-[11px] font-mono text-[#1A1A1A] dark:text-white uppercase focus:outline-hidden focus:border-[#F97316]"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyPromoCode}
              className="px-2.5 py-1 rounded bg-[#1A1A1A] dark:bg-[#333333] hover:bg-black text-white text-[10px] font-bold uppercase"
            >
              Apply
            </button>
          </div>

          {/* BILLING FREQUENCY TOGGLE */}
          <div className="flex items-center space-x-1 bg-white dark:bg-[#1A1A1A] p-0.5 rounded border border-[#D1D1D1] dark:border-[#333333] text-[11px]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-2.5 py-1 rounded transition-all font-bold uppercase ${
                billingCycle === 'monthly'
                  ? 'bg-[#F97316] text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-2.5 py-1 rounded transition-all font-bold uppercase flex items-center space-x-1 ${
                billingCycle === 'annual'
                  ? 'bg-[#F97316] text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <span>Annual</span>
              <span className="text-[9px] bg-emerald-500 text-white px-1 rounded">20% OFF</span>
            </button>
          </div>
        </div>

        {promoMessage && (
          <div className={`p-2 rounded text-[11px] font-mono flex items-center space-x-2 ${
            promoMessage.isError
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
          }`}>
            <span>{promoMessage.isError ? '✕' : '✓'}</span>
            <span>{promoMessage.text}</span>
          </div>
        )}

        {/* PRICING TIERS SELECTOR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRICING_TIERS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            let price = plan.price;
            if (plan.id !== 'student' && billingCycle === 'annual') {
              price = Math.round(plan.price * 0.8);
            }

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative p-3.5 rounded border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#F97316] bg-orange-50/20 dark:bg-orange-950/20 ring-1 ring-[#F97316]'
                    : plan.id === 'student'
                    ? 'border-[#F97316]/50 bg-amber-50/10 dark:bg-amber-950/10 hover:border-[#F97316]'
                    : 'border-[#D1D1D1] dark:border-[#333333] bg-white dark:bg-[#1A1A1A] hover:border-slate-400 dark:hover:border-[#555555]'
                }`}
              >
                {plan.badge ? (
                  <div className="absolute -top-2.5 right-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[8px] font-bold uppercase tracking-wider shadow-xs">
                    {plan.badge}
                  </div>
                ) : plan.popular ? (
                  <div className="absolute -top-2.5 right-2 px-2 py-0.5 rounded bg-[#F97316] text-white text-[8px] font-bold uppercase tracking-wider shadow-xs">
                    Most Popular
                  </div>
                ) : null}

                <div className="space-y-2.5">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-[#1A1A1A] dark:text-white font-sans flex items-center justify-between">
                      <span className="truncate">{plan.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#F97316] shrink-0" />}
                    </h3>
                    
                    <div className="mt-1.5 flex items-baseline">
                      <span className="text-xl font-extrabold text-[#1A1A1A] dark:text-white font-mono">
                        ${price.toFixed(plan.id === 'student' ? 2 : 0)}
                      </span>
                      <span className="text-slate-500 text-xs ml-1 font-mono">/mo</span>
                    </div>

                    {plan.id === 'student' ? (
                      <span className="text-[10px] text-[#F97316] font-bold block mt-0.5">
                        {plan.analysesPerMonth}
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono block mt-0.5">
                        {plan.tierTarget}
                      </span>
                    )}
                  </div>

                  {/* FEATURE LIST */}
                  <ul className="space-y-1 text-[10px] text-slate-600 dark:text-slate-300 pt-2 border-t border-[#D1D1D1]/60 dark:border-[#333333]">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start space-x-1 leading-tight">
                        <Check className="w-2.5 h-2.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlanId(plan.id);
                  }}
                  className={`mt-3 w-full py-1.5 px-2 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isSelected
                      ? 'bg-[#F97316] text-white shadow-2xs'
                      : 'bg-[#F1F1F1] dark:bg-[#252525] text-slate-700 dark:text-slate-300 hover:bg-[#E5E5E5]'
                  }`}
                >
                  {isSelected ? '✓ Selected Plan' : 'Select Tier'}
                </button>
              </div>
            );
          })}
        </div>

        {/* SECURE STRIPE CHECKOUT CALL-TO-ACTION CARD */}
        <div className="p-4 sm:p-5 rounded bg-gradient-to-r from-slate-900 to-black text-white border border-slate-700 shadow-xl space-y-3 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <BadgeCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                  Stripe Encrypted Checkout • {selectedPlan.name}
                </h4>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Pay securely with Credit Card, Debit Card, Apple Pay, or Google Pay via Stripe.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-2xl font-extrabold text-[#F97316] font-mono">
                ${calculatedPrice.toFixed(selectedPlan.id === 'student' ? 2 : 0)}
              </span>
              <span className="text-xs text-slate-400 font-mono"> USD / month</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL</span>
              </span>
              <span>•</span>
              <span>PCI-DSS Level 1</span>
              <span>•</span>
              <span>Cancel Anytime</span>
            </div>

            <button
              type="button"
              disabled={isRedirecting}
              onClick={handleProceedToStripe}
              className="w-full sm:w-auto px-8 py-3 rounded bg-gradient-to-r from-[#F97316] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isRedirecting ? (
                <span>Redirecting to Stripe...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Stripe Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* LEGAL & COMPLIANCE CONSENT NOTICE */}
          <div className="text-[10px] text-slate-400 font-mono text-center sm:text-left border-t border-slate-800/80 pt-2 flex flex-wrap items-center justify-between gap-2">
            <span>
              By proceeding, you agree to CXPro's{' '}
              <button
                type="button"
                onClick={() => onOpenLegalModal?.('terms')}
                className="text-[#F97316] hover:underline font-bold"
              >
                Terms of Service
              </button>
              ,{' '}
              <button
                type="button"
                onClick={() => onOpenLegalModal?.('privacy')}
                className="text-[#F97316] hover:underline font-bold"
              >
                Privacy Policy
              </button>
              , and{' '}
              <button
                type="button"
                onClick={() => onOpenLegalModal?.('ai-disclaimer')}
                className="text-[#F97316] hover:underline font-bold"
              >
                AI Safety Disclaimer
              </button>
              .
            </span>
            <span className="text-emerald-400 font-bold">14-Day Money-Back Guarantee</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-[#D1D1D1] dark:border-[#333333] gap-2">
          <div className="flex items-center space-x-2 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>POWERED BY STRIPE • 14-DAY MONEY-BACK GUARANTEE • INSTANT TIER ACTIVATION</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => onOpenLegalModal?.('terms')}
              className="text-[10px] text-slate-500 hover:text-[#F97316] font-mono underline"
            >
              Legal & Compliance
            </button>
            <button
              onClick={onClose}
              className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-black dark:hover:text-white font-mono"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

