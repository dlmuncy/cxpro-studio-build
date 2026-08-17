import React, { useState } from 'react';
import { Sliders, Check, Shield, Lock, Crown, ArrowRight, Building2, Sparkles } from 'lucide-react';
import { WhiteLabelConfig, UserSubscription } from '../types';

interface WhiteLabelModalProps {
  config: WhiteLabelConfig;
  onSave: (newConfig: WhiteLabelConfig) => void;
  onClose: () => void;
  currentSubscription: UserSubscription;
  onUpgradeToEnterprise: () => void;
}

export const WhiteLabelModal: React.FC<WhiteLabelModalProps> = ({ 
  config, 
  onSave, 
  onClose,
  currentSubscription,
  onUpgradeToEnterprise
}) => {
  const isEnterprise = currentSubscription.tier === 'enterprise';

  const [enabled, setEnabled] = useState(isEnterprise ? config.enabled : false);
  const [firmName, setFirmName] = useState(config.firmName);
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor);
  const [customFooterText, setCustomFooterText] = useState(config.customFooterText);

  const handleSave = () => {
    if (!isEnterprise) {
      onUpgradeToEnterprise();
      return;
    }
    onSave({
      enabled,
      firmName: firmName.trim() || 'Custom Law Firm',
      primaryColor,
      customFooterText
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
      <div className="bg-white dark:bg-[#1A1A1A] rounded max-w-lg w-full p-5 border border-[#D1D1D1] dark:border-[#333333] shadow-2xl space-y-4 relative overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#D1D1D1] dark:border-[#333333] pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#F97316] flex items-center justify-center text-white font-bold text-xs">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-sans">
              White-Label Firm Rebranding
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold font-mono"
          >
            [ESC]
          </button>
        </div>

        {/* ENTERPRISE SUBSCRIPTION PAYWALL GATE */}
        {!isEnterprise ? (
          <div className="p-3.5 rounded bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-300 dark:border-amber-700/60 space-y-2.5">
            <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300">
              <Crown className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-bold text-xs font-sans uppercase tracking-wider">
                Enterprise Legal Team Feature
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
              Custom law firm branding, custom PDF watermarks, and white-label client audit reports are exclusively available on the <strong>Enterprise Legal Team</strong> subscription ($699/mo).
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span>Current Plan: <strong className="uppercase text-[#F97316]">{currentSubscription.planName}</strong></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Includes Unlimited Seats & REST API</span>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center space-x-2">
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="font-bold">Enterprise Plan Active — Custom firm branding enabled for all client exports.</span>
          </div>
        )}

        {/* CONFIGURATION FORM */}
        <div className={`space-y-3 text-xs transition-opacity ${!isEnterprise ? 'opacity-50 pointer-events-none select-none' : ''}`}>
          <div className="flex items-center justify-between p-3 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333]">
            <div>
              <span className="font-bold text-[#1A1A1A] dark:text-white block font-sans">ENABLE FIRM REBRANDING</span>
              <span className="text-[10px] text-slate-400 font-mono">REPLACE CXPRO.SITE LOGO WITH YOUR LAW FIRM IDENTITY</span>
            </div>

            <input
              type="checkbox"
              disabled={!isEnterprise}
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-[#D1D1D1] text-[#F97316] focus:ring-[#F97316] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
              Law Firm / Company Name
            </label>
            <input
              type="text"
              disabled={!isEnterprise}
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              placeholder="e.g. Meridian Legal Partners LLP"
              className="w-full px-2.5 py-1.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
              Custom Footer / Confidentiality Header
            </label>
            <input
              type="text"
              disabled={!isEnterprise}
              value={customFooterText}
              onChange={(e) => setCustomFooterText(e.target.value)}
              placeholder="e.g. Attorney-Client Privileged & Confidential"
              className="w-full px-2.5 py-1.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-xs font-mono"
            />
          </div>
        </div>

        {/* MODAL ACTIONS */}
        <div className="flex items-center justify-between pt-3 border-t border-[#D1D1D1] dark:border-[#333333]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]"
          >
            Close
          </button>

          {!isEnterprise ? (
            <button
              onClick={() => {
                onClose();
                onUpgradeToEnterprise();
              }}
              className="px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#F97316] to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-md flex items-center space-x-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Unlock with Enterprise ($699/mo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#F97316] hover:bg-orange-600 text-white shadow-2xs flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply White-Label Settings</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
