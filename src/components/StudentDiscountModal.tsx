import React, { useState } from 'react';
import { 
  GraduationCap, 
  Mail, 
  User, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Copy, 
  CheckCircle2, 
  Lock, 
  Terminal, 
  Cpu, 
  Bug, 
  ShieldAlert, 
  Code2,
  ExternalLink,
  Eye,
  FileCheck
} from 'lucide-react';
import { StudentLead } from '../types';

interface StudentDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyStudentCode: (lead: StudentLead) => void;
}

export const StudentDiscountModal: React.FC<StudentDiscountModalProps> = ({
  isOpen,
  onClose,
  onApplyStudentCode
}) => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [university, setUniversity] = useState<string>('');
  const [handshakeProfile, setHandshakeProfile] = useState<string>('');
  const [contractorRole, setContractorRole] = useState<string>('AI Model Tester / RLHF Evaluator');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [claimedLead, setClaimedLead] = useState<StudentLead | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [emailDeliveryInfo, setEmailDeliveryInfo] = useState<{ subject: string; htmlPreview: string; sentAt: string } | null>(null);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMessage('Please enter both your full name and valid contact email.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address (e.g. your .edu or personal email).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const fallbackLead: StudentLead = {
      id: 'stu_' + Date.now(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      university: university.trim() || 'Handshake Student / Contractor',
      handshakeProfile: handshakeProfile.trim(),
      contractorRole: contractorRole.trim(),
      discountCode: 'HANDSHAKE49',
      claimedAt: new Date().toISOString(),
      status: 'sent'
    };

    try {
      const response = await fetch('/api/students/claim-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          university: university.trim(),
          handshakeProfile: handshakeProfile.trim(),
          contractorRole: contractorRole.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.lead) {
          setClaimedLead(data.lead);
        } else {
          setClaimedLead(fallbackLead);
        }

        if (data.emailDelivery) {
          setEmailDeliveryInfo(data.emailDelivery);
        }
      } else {
        setClaimedLead(fallbackLead);
      }
    } catch (err) {
      console.warn('Backend endpoint unavailable, applying client-side student claim:', err);
      setClaimedLead(fallbackLead);
    } finally {
      try {
        const existingRaw = localStorage.getItem('cxpro_student_leads');
        const existing: StudentLead[] = existingRaw ? JSON.parse(existingRaw) : [];
        existing.push(fallbackLead);
        localStorage.setItem('cxpro_student_leads', JSON.stringify(existing));
      } catch (storageErr) {
        console.error('Storage error:', storageErr);
      }
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('HANDSHAKE49');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRedeemAndProceed = () => {
    if (claimedLead) {
      onApplyStudentCode(claimedLead);
    } else {
      onApplyStudentCode({
        id: 'stu_' + Date.now(),
        fullName: fullName.trim() || 'Software/AI Contractor',
        email: email.trim() || 'contractor@handshake.edu',
        contractorRole: contractorRole.trim(),
        discountCode: 'HANDSHAKE49',
        claimedAt: new Date().toISOString(),
        status: 'redeemed'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-mono">
      <div className="bg-white dark:bg-[#181818] border border-[#D1D1D1] dark:border-[#333333] rounded max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-8 relative">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#D1D1D1] dark:border-[#333333] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-[#F97316] flex items-center justify-center text-white font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-sans flex items-center gap-1.5 flex-wrap">
                <span>Handshake AI • Software & AI Testing</span>
                <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[9px] rounded uppercase font-mono">
                  $49.99 / mo • 3 Scans/mo
                </span>
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                EXCLUSIVE CONTRACTOR & STUDENT AUDIT SUITE • 3 MULTI-AI CONTRACT AUDITS PER MONTH
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-black dark:hover:text-white text-xs font-bold uppercase"
          >
            ✕
          </button>
        </div>

        {!claimedLead ? (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {errorMessage && (
              <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            {/* VALUE PROPOSITION BOX */}
            <div className="p-3 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 border border-[#F97316]/30 rounded space-y-2">
              <div className="flex items-center space-x-1.5 text-slate-900 dark:text-slate-100 font-bold uppercase text-[11px] font-sans">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Essential 1099 Protections for AI & QA Contractors</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                <li className="flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>AI Hallucination Liability Shields</span>
                </li>
                <li className="flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Background Prompt IP Carve-Out</span>
                </li>
                <li className="flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>5-Day Deemed QA Acceptance</span>
                </li>
                <li className="flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Multi-Client Freelance Rights</span>
                </li>
              </ul>
            </div>

            {/* FORM INPUTS */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Contractor / Student Role
                </label>
                <select
                  value={contractorRole}
                  onChange={(e) => setContractorRole(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-xs font-mono focus:outline-hidden focus:border-[#F97316]"
                >
                  <option value="AI Model Tester / RLHF Evaluator">AI Model Tester / RLHF Evaluator (1099 Freelance)</option>
                  <option value="Software QA & SDET Contractor">Software QA & SDET Contractor (Contract / SOW)</option>
                  <option value="Freelance AI/ML Engineer">Freelance AI/ML Engineer & Prompt Specialist</option>
                  <option value="Computer Science / Law Student">Computer Science / Law Student (Academic)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jordan Miller"
                    className="w-full px-2.5 py-1.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-xs font-mono focus:outline-hidden focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Email Address (For Voucher Delivery) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan@handshake.edu or personal"
                    className="w-full px-2.5 py-1.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-xs font-mono focus:outline-hidden focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    University / Program <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. Berkeley / MIT / Handshake Cohort"
                    className="w-full px-2.5 py-1.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-xs font-mono focus:outline-hidden focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Handshake Handle <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={handshakeProfile}
                    onChange={(e) => setHandshakeProfile(e.target.value)}
                    placeholder="e.g. @jordan-miller"
                    className="w-full px-2.5 py-1.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-xs font-mono focus:outline-hidden focus:border-[#F97316]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#D1D1D1] dark:border-[#333333] flex items-center justify-between gap-2">
              <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Instant $49.99 Code & Email Voucher Dispatch</span>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded text-xs font-bold uppercase text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-2xs flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Issuing Code & Dispatching Email...</span>
                  ) : (
                    <>
                      <span>Get $49.99 Contractor Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* SUCCESS VOUCHER STATE */
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded space-y-2 text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-emerald-800 dark:text-emerald-300 uppercase font-sans text-sm">
                Software & AI Contractor Voucher Dispatched!
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Your Handshake AI Contractor voucher code has been registered for <strong>{claimedLead.email}</strong> and dispatched to your email address.
              </p>
            </div>

            {/* VOUCHER CARD */}
            <div className="p-3.5 bg-[#F8F8F8] dark:bg-[#202020] border border-dashed border-[#F97316] rounded space-y-2.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                <span>Handshake AI Promo Code</span>
                <span className="text-emerald-500">66% Off Contractor Rate</span>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-[#151515] p-2.5 rounded border border-[#D1D1D1] dark:border-[#333333]">
                <span className="text-lg font-extrabold text-[#F97316] tracking-wider font-mono">
                  {claimedLead.discountCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded bg-[#F1F1F1] dark:bg-[#252525] text-slate-700 dark:text-slate-200 text-[10px] font-bold uppercase hover:bg-slate-200 flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <div className="flex flex-col sm:flex-row justify-between text-[10px] text-slate-500 dark:text-slate-400 gap-1">
                <span>Registered To: <strong>{claimedLead.fullName}</strong></span>
                <span>Quota: <strong className="text-[#F97316]">3 Contracts / Month</strong></span>
                <span>Rate: <strong className="text-emerald-600 dark:text-emerald-400">$49.99/mo</strong></span>
              </div>
            </div>

            {/* EMAIL PREVIEW BUTTON */}
            {emailDeliveryInfo && (
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="text-[11px] text-blue-800 dark:text-blue-300 font-bold">
                    Official email voucher sent to {claimedLead.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmailPreviewModal(true)}
                  className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase flex items-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>View Sent Email</span>
                </button>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="space-y-2 pt-2 border-t border-[#D1D1D1] dark:border-[#333333]">
              <button
                type="button"
                onClick={handleRedeemAndProceed}
                className="w-full py-2.5 px-4 rounded bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-2xs transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Apply $49.99 Contractor Rate to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white uppercase"
              >
                Close & Keep Browsing
              </button>
            </div>
          </div>
        )}
      </div>

      {/* EMAIL PREVIEW POPUP */}
      {showEmailPreviewModal && emailDeliveryInfo && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181818] border border-[#D1D1D1] dark:border-[#333333] rounded-lg max-w-2xl w-full p-5 shadow-2xl space-y-3 font-sans">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#F97316]" />
                <span className="font-bold text-sm text-[#1A1A1A] dark:text-white">
                  Dispatched Email Voucher: {emailDeliveryInfo.subject}
                </span>
              </div>
              <button
                onClick={() => setShowEmailPreviewModal(false)}
                className="text-slate-400 hover:text-black dark:hover:text-white text-xs font-bold uppercase"
              >
                ✕ Close
              </button>
            </div>

            <div 
              className="p-4 bg-slate-50 dark:bg-[#111111] rounded border text-xs max-h-[60vh] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: emailDeliveryInfo.htmlPreview }}
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                Dispatched at {new Date(emailDeliveryInfo.sentAt).toLocaleTimeString()}
              </span>
              <button
                onClick={() => {
                  setShowEmailPreviewModal(false);
                  handleRedeemAndProceed();
                }}
                className="px-4 py-1.5 rounded bg-[#F97316] text-white text-xs font-bold uppercase"
              >
                Redeem Code in Checkout →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
