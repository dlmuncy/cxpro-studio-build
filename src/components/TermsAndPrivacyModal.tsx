import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  Scale, 
  X, 
  CheckCircle2, 
  HelpCircle, 
  Mail, 
  AlertCircle, 
  ExternalLink,
  RefreshCw,
  Server
} from 'lucide-react';

interface TermsAndPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'terms' | 'privacy' | 'ai-disclaimer';
}

export const TermsAndPrivacyModal: React.FC<TermsAndPrivacyModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'terms'
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'ai-disclaimer'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#181818] border border-[#D1D1D1] dark:border-[#333333] rounded-lg max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="p-4 bg-[#F8F8F8] dark:bg-[#202020] border-b border-[#D1D1D1] dark:border-[#333333] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#F97316]/10 text-[#F97316] rounded">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#1A1A1A] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span>cxpro.site Legal & Compliance Center</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono">
                  v2.4 Live
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Effective Date: August 17, 2026 • cxpro.site
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-[#333333] text-slate-400 hover:text-black dark:hover:text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-[#D1D1D1] dark:border-[#333333] bg-[#F1F1F1] dark:bg-[#1D1D1D] px-4 pt-2 gap-2 text-xs font-bold uppercase tracking-wider font-mono">
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'border-[#F97316] text-[#F97316]'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-[#F97316] text-[#F97316]'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-disclaimer')}
            className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'ai-disclaimer'
                ? 'border-[#F97316] text-[#F97316]'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Safety & Disclaimer</span>
          </button>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          
          {/* TAB 1: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-5">
              <div className="p-3.5 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-orange-900 dark:text-orange-200">
                  <strong>Summary:</strong> By accessing <strong>cxpro.site</strong> (cxpro.site), you agree to these Terms. cxpro.site is an AI-powered legal contract risk auditing and redline analysis platform designed to assist in-house counsel, contractors, legal engineers, and enterprises.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-mono tracking-wide">
                  1. Acceptance & Permitted Use
                </h3>
                <p>
                  By creating an account, selecting a subscription tier, or uploading documents to cxpro.site, you agree to be bound by these Terms of Service. You may use our service solely for lawful contract review, drafting, counter-proposal creation, and risk assessment purposes.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-mono tracking-wide">
                  2. Subscriptions, Billing & Payment Processing
                </h3>
                <p>
                  cxpro.site offers recurring subscription plans (Student/QA $49.99/mo, Starter $149/mo, Professional $349/mo, and Enterprise $699/mo). Payments are processed securely via <strong>Stripe</strong>. Your subscription automatically renews each billing period unless canceled prior to the renewal date.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  <li><strong>Upgrades & Downgrades:</strong> Upgrades take effect immediately with prorated billing.</li>
                  <li><strong>Cancellations:</strong> You may cancel your subscription at any time via your account portal or by emailing support@cxpro.site. Access continues through the end of the active billing cycle.</li>
                  <li><strong>14-Day Money-Back Guarantee:</strong> First-time subscribers are eligible for a full refund within 14 days of initial purchase if unsatisfied with our multi-AI audit accuracy.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-mono tracking-wide">
                  3. Intellectual Property & Customer Ownership
                </h3>
                <p>
                  <strong>You retain 100% full ownership</strong> of all contracts, clauses, prompt templates, redline exports, DOCX files, and proprietary data uploaded to or generated by cxpro.site. cxpro.site claims no ownership rights over your input contracts or redlined output work product.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-mono tracking-wide">
                  4. White-Label Branding Terms (Enterprise Tier)
                </h3>
                <p>
                  Enterprise Tier subscribers are licensed to apply custom law firm names, corporate logos, and custom PDF headers to exported audits and redlines. You represent that you own or have explicit authorization to use all trademarks, logos, and firm designations uploaded.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-mono tracking-wide">
                  5. Limitation of Liability
                </h3>
                <p>
                  To the maximum extent permitted by law, cxpro.site and its operators shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from contract negotiations, commercial disputes, or legal outcomes arising from the use of our software. Total liability is limited to the fees paid by you in the 12 months preceding the claim.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-mono tracking-wide">
                  6. Contact & Legal Notices
                </h3>
                <p>
                  For inquiries regarding billing, enterprise agreements, or terms enforcement, contact:
                  <br />
                  <strong>cxpro.site Legal & Support:</strong> <a href="mailto:support@cxpro.site" className="text-[#F97316] font-bold hover:underline font-mono">support@cxpro.site</a>
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded flex items-start space-x-3">
                <Lock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-900 dark:text-blue-200">
                  <strong>Zero-Training Guarantee:</strong> Your contract data is strictly private. cxpro.site <strong>NEVER</strong> uses your uploaded contracts, redlines, or confidential playbooks to train, retrain, or fine-tune public foundation AI models.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-mono tracking-wide">
                  1. Information We Collect
                </h3>
                <p>
                  We collect minimal information necessary to deliver high-performance contract analysis:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  <li><strong>Account Information:</strong> Email address, name, organization name, and subscription tier.</li>
                  <li><strong>Contract Documents:</strong> Uploaded text, PDF, or DOCX files processed during active audit sessions.</li>
                  <li><strong>Billing Data:</strong> Payment details (credit card number, billing address) are processed directly by <strong>Stripe</strong> via tokenized PCI-DSS Level 1 compliant infrastructure. cxpro.site never stores raw card numbers.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-mono tracking-wide">
                  2. Document Security & Encryption
                </h3>
                <p>
                  All document transmissions between your browser, our servers, and multi-AI validation inference endpoints are protected using <strong>TLS 1.3 in-transit encryption</strong> and <strong>AES-256 at-rest encryption</strong>. Multi-AI consensus requests are routed through dedicated enterprise zero-data-retention APIs.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-mono tracking-wide">
                  3. Data Retention & Deletion
                </h3>
                <p>
                  You have full control over your contract audit history. You may purge scanned contracts and audit trails at any time directly from the cxpro.site dashboard or request a permanent data purge by emailing <span className="font-mono text-[#F97316]">support@cxpro.site</span>.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-mono tracking-wide">
                  4. GDPR & CCPA Compliance
                </h3>
                <p>
                  Under the European Union General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you retain the right to access, rectify, port, or request erasure of your personal data. We do not sell, rent, or monetize your personal data or document contents under any circumstances.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: AI SAFETY & LEGAL DISCLAIMER */}
          {activeTab === 'ai-disclaimer' && (
            <div className="space-y-5">
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded flex items-start space-x-3">
                <Scale className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-900 dark:text-emerald-200">
                  <strong>Legal Technology Disclaimer:</strong> cxpro.site is an autonomous AI-driven contract intelligence and legal engineering platform. cxpro.site does not provide formal legal advice and does not create an attorney-client relationship.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-mono tracking-wide">
                  1. Nature of the Service (AI Co-Pilot & Auditor)
                </h3>
                <p>
                  cxpro.site utilizes multi-model artificial intelligence consensus (combining specialized reasoning models) to identify unfavorable terms, calculate mathematical risk scores, detect liability exposure, and generate redline proposals. While engineered to institutional standards, AI analysis is intended as an assistive productivity tool for legal professionals, founders, and contract negotiators.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-mono tracking-wide">
                  2. Human-in-the-Loop Recommendation
                </h3>
                <p>
                  We recommend that all critical, multi-million dollar, or high-liability agreements undergo final review by qualified in-house counsel or licensed legal professionals admitted to the relevant governing jurisdiction before final signature and execution.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-mono tracking-wide">
                  3. Multi-Model Consensus & Verification
                </h3>
                <p>
                  cxpro.site reduces AI hallucinations and blindspots by cross-evaluating risk findings across multiple frontier models. Each risk score and clause suggestion is evaluated against established commercial contracting benchmarks (e.g. Standard Commercial Code, NVCA, Tech Indemnity Standards, and California/Delaware jurisdictional baselines).
                </p>
              </section>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-[#F8F8F8] dark:bg-[#202020] border-t border-[#D1D1D1] dark:border-[#333333] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-500 font-mono text-[11px]">
            <Mail className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Questions? Inquire at <strong className="text-slate-800 dark:text-slate-200">support@cxpro.site</strong></span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-2xs"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
