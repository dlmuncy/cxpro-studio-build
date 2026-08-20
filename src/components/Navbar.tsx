import React, { useState } from 'react';
import { ShieldCheck, FileText, Library, FilePlus, Sparkles, Sliders, Moon, Sun, Scale, Menu, X, Plus, Zap, Crown, GraduationCap } from 'lucide-react';
import { WhiteLabelConfig, UserSubscription } from '../types';

interface NavbarProps {
  activeTab: 'landing' | 'dashboard' | 'analysis' | 'library' | 'generator';
  setActiveTab: (tab: 'landing' | 'dashboard' | 'analysis' | 'library' | 'generator') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  whiteLabel: WhiteLabelConfig;
  onOpenWhiteLabelModal: () => void;
  currentSubscription: UserSubscription;
  onOpenSubscriptionModal: () => void;
  onOpenStudentModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  whiteLabel,
  onOpenWhiteLabelModal,
  currentSubscription,
  onOpenSubscriptionModal,
  onOpenStudentModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'landing' | 'dashboard' | 'analysis' | 'library' | 'generator') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const isSubscribed = currentSubscription.tier !== 'free';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D1D1D1] dark:border-[#333333] bg-white dark:bg-[#1A1A1A] transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 md:h-12">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => handleNavClick('landing')}>
            <div className="w-7 h-7 rounded bg-[#007BFF] flex items-center justify-center text-white font-bold text-xs shadow-xs flex-shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-1.5 min-w-0">
              <span className="font-bold text-sm tracking-tight text-[#1A1A1A] dark:text-white uppercase font-sans truncate">
                {whiteLabel.enabled ? whiteLabel.firmName : 'cxpro.site'}
              </span>
              {!whiteLabel.enabled && (
                <span className="hidden sm:inline-block text-[10px] font-mono font-normal opacity-70 uppercase tracking-widest text-[#1A1A1A] dark:text-slate-300">
                  SYSTEM v4.2
                </span>
              )}
            </div>

          </div>

          {/* Desktop Navigation Links (Visible on md and larger screens / landscape) */}
          <nav className="hidden md:flex items-center space-x-1 font-mono">
            <button
              onClick={() => handleNavClick('landing')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold transition-all uppercase tracking-wider flex items-center space-x-1.5 ${
                activeTab === 'landing'
                  ? 'bg-[#007BFF] text-white shadow-2xs'
                  : 'text-[#1A1A1A] dark:text-slate-200 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => handleNavClick('dashboard')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold transition-all uppercase tracking-wider flex items-center space-x-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-[#007BFF] text-white shadow-2xs'
                  : 'text-[#1A1A1A] dark:text-slate-200 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleNavClick('analysis')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold transition-all uppercase tracking-wider flex items-center space-x-1.5 ${
                activeTab === 'analysis'
                  ? 'bg-[#007BFF] text-white shadow-2xs'
                  : 'text-[#1A1A1A] dark:text-slate-200 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Risk Audit</span>
            </button>

            <button
              onClick={() => handleNavClick('library')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold transition-all uppercase tracking-wider flex items-center space-x-1.5 ${
                activeTab === 'library'
                  ? 'bg-[#007BFF] text-white shadow-2xs'
                  : 'text-[#1A1A1A] dark:text-slate-200 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <Library className="w-3.5 h-3.5" />
              <span>Clauses</span>
            </button>

            <button
              onClick={() => handleNavClick('generator')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold transition-all uppercase tracking-wider flex items-center space-x-1.5 ${
                activeTab === 'generator'
                  ? 'bg-[#007BFF] text-white shadow-2xs'
                  : 'text-[#1A1A1A] dark:text-slate-200 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Generator</span>
            </button>
          </nav>

          {/* Right Action Tools & Mobile Menu Button */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* STUDENT / CONTRACTOR PERK LINK */}
            {onOpenStudentModal && (
              <button
                onClick={onOpenStudentModal}
                className="hidden lg:flex items-center space-x-1 px-2 py-1 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded transition-all"
                title="AI Tester & QA Professional Discount ($49.99/mo • 3 Scans/mo)"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>AI Testing $49.99</span>
              </button>
            )}

            {/* SUBSCRIPTION / UPGRADE BUTTON */}
            <button
              onClick={onOpenSubscriptionModal}
              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center space-x-1.5 font-mono shadow-2xs ${
                isSubscribed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-gradient-to-r from-[#007BFF] to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white animate-pulse'
              }`}
            >
              {isSubscribed ? <Crown className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
              <span>{isSubscribed ? currentSubscription.planName.toUpperCase() : 'SUBSCRIBE'}</span>
            </button>

            <button
              onClick={onOpenWhiteLabelModal}
              title="White-Label Branding"
              className="p-1.5 rounded text-[#1A1A1A] dark:text-slate-300 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A] transition-colors"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle theme"
              className="p-1.5 rounded text-[#1A1A1A] dark:text-slate-300 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A] transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={() => handleNavClick('dashboard')}
              className="hidden xl:inline-flex items-center px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded bg-[#007BFF] hover:bg-blue-600 text-white shadow-2xs transition-all font-mono"
            >
              + Audit
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
              className="md:hidden p-1.5 rounded text-[#1A1A1A] dark:text-slate-200 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A] border border-[#D1D1D1] dark:border-[#333333] transition-colors flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#007BFF]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Stacked Navigation Drawer / Burger Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#D1D1D1] dark:border-[#333333] bg-white dark:bg-[#1A1A1A] px-3 py-3 shadow-xl space-y-2 animate-in slide-in-from-top-2 duration-150">
          {/* SUBSCRIPTION PROMPT IN BURGER */}
          <div className="p-2.5 rounded bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-orange-800 dark:text-orange-300 uppercase block font-mono">
                {isSubscribed ? `Plan: ${currentSubscription.planName}` : 'cxpro.site Subscription'}
              </span>

              <span className="text-[10px] text-slate-500 font-mono">
                {isSubscribed ? 'All redlines unlocked' : 'Unlock all blurred issues'}
              </span>
            </div>
            <button
              onClick={() => { onOpenSubscriptionModal(); setIsMobileMenuOpen(false); }}
              className="px-2.5 py-1 rounded bg-[#007BFF] text-white font-bold text-[10px] uppercase font-mono shadow-2xs"
            >
              {isSubscribed ? 'Manage Plan' : 'Subscribe Now'}
            </button>
          </div>

          {/* STUDENT DISCOUNT CALLOUT IN MOBILE DRAWER */}
          {onOpenStudentModal && (
            <button
              onClick={() => { onOpenStudentModal(); setIsMobileMenuOpen(false); }}
              className="w-full p-2 rounded bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-left font-mono"
            >
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  🎓 AI Tester / QA Pro: $49.99/mo
                </span>
              </div>
              <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold">
                CLAIM
              </span>
            </button>
          )}

          <div className="text-[10px] font-mono font-bold uppercase text-slate-400 px-2 tracking-wider">
            Navigation Sections
          </div>

          <nav className="flex flex-col space-y-1 font-mono">
            <button
              onClick={() => handleNavClick('landing')}
              className={`w-full px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === 'landing'
                  ? 'bg-[#007BFF] text-white shadow-2xs'
                  : 'text-[#1A1A1A] dark:text-slate-200 bg-[#F8F8F8] dark:bg-[#222222] hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Overview & ROI</span>
              </div>
              <span className="text-[10px] opacity-75">[01]</span>
            </button>

            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#007BFF] text-white shadow-2xs'
                  : 'text-[#1A1A1A] dark:text-slate-200 bg-[#F8F8F8] dark:bg-[#222222] hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>System Dashboard</span>
              </div>
              <span className="text-[10px] opacity-75">[02]</span>
            </button>

            <button
              onClick={() => handleNavClick('analysis')}
              className={`w-full px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === 'analysis'
                  ? 'bg-[#007BFF] text-white shadow-2xs'
                  : 'text-[#1A1A1A] dark:text-slate-200 bg-[#F8F8F8] dark:bg-[#222222] hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Risk Audit Report</span>
              </div>
              <span className="text-[10px] opacity-75">[03]</span>
            </button>

            <button
              onClick={() => handleNavClick('library')}
              className={`w-full px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === 'library'
                  ? 'bg-[#007BFF] text-white shadow-2xs'
                  : 'text-[#1A1A1A] dark:text-slate-200 bg-[#F8F8F8] dark:bg-[#222222] hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Library className="w-4 h-4" />
                <span>Clause Repository</span>
              </div>
              <span className="text-[10px] opacity-75">[04]</span>
            </button>

            <button
              onClick={() => handleNavClick('generator')}
              className={`w-full px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === 'generator'
                  ? 'bg-[#007BFF] text-white shadow-2xs'
                  : 'text-[#1A1A1A] dark:text-slate-200 bg-[#F8F8F8] dark:bg-[#222222] hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FilePlus className="w-4 h-4" />
                <span>Contract Generator</span>
              </div>
              <span className="text-[10px] opacity-75">[05]</span>
            </button>
          </nav>

          <div className="pt-2 border-t border-[#D1D1D1] dark:border-[#333333] flex items-center justify-between font-mono">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-full py-2 px-3 rounded bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Audit New Contract</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
