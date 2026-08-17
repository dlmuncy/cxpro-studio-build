import React, { useState } from 'react';
import { Sliders, Check, Shield } from 'lucide-react';
import { WhiteLabelConfig } from '../types';

interface WhiteLabelModalProps {
  config: WhiteLabelConfig;
  onSave: (newConfig: WhiteLabelConfig) => void;
  onClose: () => void;
}

export const WhiteLabelModal: React.FC<WhiteLabelModalProps> = ({ config, onSave, onClose }) => {
  const [enabled, setEnabled] = useState(config.enabled);
  const [firmName, setFirmName] = useState(config.firmName);
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor);
  const [customFooterText, setCustomFooterText] = useState(config.customFooterText);

  const handleSave = () => {
    onSave({
      enabled,
      firmName: firmName.trim() || 'Custom Law Firm',
      primaryColor,
      customFooterText
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
      <div className="bg-white dark:bg-[#1A1A1A] rounded max-w-lg w-full p-5 border border-[#D1D1D1] dark:border-[#333333] shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#D1D1D1] dark:border-[#333333] pb-3">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 bg-[#F97316]"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-sans">White-Label Firm Rebranding</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold font-mono">
            [ESC]
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          REBRAND CXPRO WITH YOUR LAW FIRM IDENTITY FOR CLIENT EXPORTS AND TEAM AUDIT REPORTS.
        </p>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333]">
            <div>
              <span className="font-bold text-[#1A1A1A] dark:text-white block font-sans">ENABLE FIRM REBRANDING</span>
              <span className="text-[10px] text-slate-400 font-mono">APPLY CUSTOM FIRM HEADER ACROSS AUDIT REPORTS</span>
            </div>
            <input
              type="checkbox"
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
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              placeholder="e.g. Smith & Associates Law LLP"
              className="w-full px-2.5 py-1.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
              Custom Footer / Confidentiality Header
            </label>
            <input
              type="text"
              value={customFooterText}
              onChange={(e) => setCustomFooterText(e.target.value)}
              placeholder="e.g. Attorney-Client Privileged & Confidential"
              className="w-full px-2.5 py-1.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-xs font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#D1D1D1] dark:border-[#333333]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#F97316] hover:bg-orange-600 text-white shadow-2xs flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
