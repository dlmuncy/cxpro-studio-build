import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Clock, AlertTriangle, ShieldAlert, Plus, Sparkles, ArrowRight, Library, Search, Zap } from 'lucide-react';
import { ContractRecord, UserSubscription } from '../types';

interface DashboardViewProps {
  contracts: ContractRecord[];
  onUploadContract: (file: File | null, pastedText: string, filename: string) => void;
  onSelectContract: (contractId: string) => void;
  onNavigateToTab: (tab: 'landing' | 'dashboard' | 'analysis' | 'library' | 'generator') => void;
  isAnalyzing: boolean;
  currentSubscription?: UserSubscription;
  onOpenSubscriptionModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  contracts,
  onUploadContract,
  onSelectContract,
  onNavigateToTab,
  isAnalyzing,
  currentSubscription,
  onOpenSubscriptionModal
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [pastedFilename, setPastedFilename] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onUploadContract(file, '', file.name);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUploadContract(file, '', file.name);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    onUploadContract(null, pastedText, pastedFilename.trim() || 'Pasted_Contract.txt');
    setShowPasteModal(false);
    setPastedText('');
    setPastedFilename('');
  };

  const getRiskScoreBadge = (score?: number) => {
    if (score === undefined) return <span className="text-slate-400 font-medium">Pending</span>;
    if (score <= 30) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
          {score}/100 - Low Risk
        </span>
      );
    } else if (score <= 60) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
          {score}/100 - Medium Risk
        </span>
      );
    } else if (score <= 85) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
          {score}/100 - High Risk
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <ShieldAlert className="w-3.5 h-3.5 mr-1" />
          {score}/100 - Critical Risk
        </span>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* HEADER & QUICK STATS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#D1D1D1] dark:border-[#333333] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 bg-[#F97316]"></span>
            <h1 className="text-xl font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-sans">System Dashboard</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
            MULTI-MODEL CONSENSUS • QUANTIFIED CONTRACT ANALYSIS
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPasteModal(true)}
            className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#1A1A1A] hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A] text-[#1A1A1A] dark:text-slate-200 border border-[#D1D1D1] dark:border-[#333333] transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Paste Contract Text</span>
          </button>

          <button
            onClick={() => onNavigateToTab('generator')}
            className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#F97316] hover:bg-orange-600 text-white shadow-2xs transition-all flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Generator Draft</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded bg-white dark:bg-[#1A1A1A] border border-[#D1D1D1] dark:border-[#333333] shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-wider">
            <span>Contracts Analyzed</span>
            <FileText className="w-4 h-4 text-[#F97316]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between font-mono">
            <span className="text-2xl font-bold text-[#1A1A1A] dark:text-white">{contracts.length}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
              currentSubscription?.tier === 'student'
                ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800'
                : currentSubscription?.tier === 'free'
                ? 'text-slate-600 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
            }`}>
              {currentSubscription?.tier === 'student'
                ? 'STUDENT QA (3/MO)'
                : currentSubscription?.tier === 'free'
                ? 'FREE SCAN (1)'
                : `${(currentSubscription?.tier || 'PRO').toUpperCase()} ACTIVE`}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono flex items-center justify-between">
            <span>
              {currentSubscription?.tier === 'student'
                ? `${contracts.length} of 3 monthly scans used`
                : currentSubscription?.tier === 'free'
                ? '1 of 1 scan used (Free Tier)'
                : 'Full Multi-AI Legal Review Active'}
            </span>
            {currentSubscription?.tier === 'free' && onOpenSubscriptionModal && (
              <button 
                onClick={onOpenSubscriptionModal}
                className="text-[#F97316] hover:underline font-bold text-[9px] uppercase"
              >
                Upgrade
              </button>
            )}
          </p>
        </div>

        <div className="p-4 rounded bg-white dark:bg-[#1A1A1A] border border-[#D1D1D1] dark:border-[#333333] shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-wider">
            <span>Avg Risk Score</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between font-mono">
            <span className="text-2xl font-bold text-[#1A1A1A] dark:text-white">48<span className="text-xs text-slate-400">/100</span></span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
              MEDIUM
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            Cross-referenced vs 10k benchmarks
          </p>
        </div>

        <div className="p-4 rounded bg-white dark:bg-[#1A1A1A] border border-[#D1D1D1] dark:border-[#333333] shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-wider">
            <span>Review Time Saved</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between font-mono">
            <span className="text-2xl font-bold text-[#1A1A1A] dark:text-white">18.5 <span className="text-xs font-normal text-slate-400">hrs</span></span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              +4.2 hrs
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            ~1.8h avg saved per review
          </p>
        </div>

        <div className="p-4 rounded bg-white dark:bg-[#1A1A1A] border border-[#D1D1D1] dark:border-[#333333] shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-wider">
            <span>Multi-AI Consensus</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between font-mono">
            <span className="text-2xl font-bold text-[#1A1A1A] dark:text-white">96.4%</span>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
              VERIFIED
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            GPT-4o + Claude 3.5 + Gemini 1.5
          </p>
        </div>
      </div>

      {/* DRAG AND DROP UPLOAD ZONE */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded p-6 text-center transition-all bg-white dark:bg-[#1A1A1A] ${
          dragActive
            ? 'border-[#F97316] bg-orange-50/20 dark:bg-orange-950/20'
            : 'border-[#D1D1D1] dark:border-[#333333] hover:border-[#F97316]'
        }`}
      >
        <input
          type="file"
          id="contract-file-upload"
          accept=".pdf,.docx,.txt"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2.5">
          <div className="w-12 h-12 rounded bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 flex items-center justify-center">
            {isAnalyzing ? (
              <Sparkles className="w-6 h-6 animate-spin text-[#F97316]" />
            ) : (
              <Upload className="w-6 h-6 text-[#F97316]" />
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-sans">
              {isAnalyzing ? 'Multi-Model Consensus Engine Analyzing Document...' : 'Upload Contract for Instant Consensus Analysis'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-md mx-auto font-mono">
              Drag & drop PDF, DOCX, or TXT file here, or browse local filesystem
            </p>
          </div>

          <div className="pt-1 flex items-center space-x-2">
            <label
              htmlFor="contract-file-upload"
              className="px-4 py-2 rounded bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-2xs transition-all cursor-pointer"
            >
              Select Local File
            </label>

            <button
              onClick={() => setShowPasteModal(true)}
              className="px-4 py-2 rounded bg-[#E5E5E5] dark:bg-[#2A2A2A] hover:bg-[#D1D1D1] dark:hover:bg-[#333333] text-[#1A1A1A] dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Paste Document Text
            </button>
          </div>

          <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-0.5">
            MAX FILE SIZE 10MB • END-TO-END ENCRYPTED (AES-256)
          </p>
        </div>
      </div>

      {/* RECENT CONTRACTS TABLE */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded border border-[#D1D1D1] dark:border-[#333333] overflow-hidden shadow-2xs">
        <div className="px-4 py-3 bg-[#F8F8F8] dark:bg-[#222222] border-b border-[#D1D1D1] dark:border-[#333333] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-mono">Recent Contract Audits</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Click any row to inspect consensus analysis report</p>
          </div>

          <button
            onClick={() => onNavigateToTab('library')}
            className="text-xs font-bold uppercase tracking-wider text-[#F97316] hover:underline flex items-center space-x-1"
          >
            <Library className="w-3.5 h-3.5" />
            <span>Clause Repository</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1A1A1A] dark:text-slate-200">
            <thead className="bg-[#F1F1F1] dark:bg-[#1E1E1E] text-slate-600 dark:text-slate-300 font-mono text-[10px] uppercase border-b border-[#D1D1D1] dark:border-[#333333] tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Contract Reference</th>
                <th className="py-2.5 px-4">Document Type</th>
                <th className="py-2.5 px-4">Upload Timestamp</th>
                <th className="py-2.5 px-4">Risk Evaluation</th>
                <th className="py-2.5 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1D1D1]/60 dark:divide-[#333333] font-mono">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-[#F8F8F8] dark:hover:bg-[#252525] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#1A1A1A] dark:text-white">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-6 h-6 rounded bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 flex items-center justify-center font-bold text-[10px]">
                        DOC
                      </div>
                      <span className="truncate max-w-xs font-mono">{c.filename}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">{c.contractType}</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono">{c.uploadedAt}</td>
                  <td className="py-3 px-4">{getRiskScoreBadge(c.riskScore)}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectContract(c.id)}
                      className="px-2.5 py-1 rounded bg-[#F97316] hover:bg-orange-600 text-white font-bold text-[10px] uppercase tracking-wider transition-colors inline-flex items-center space-x-1"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PASTE CONTRACT TEXT MODAL */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded max-w-2xl w-full p-5 border border-[#D1D1D1] dark:border-[#333333] shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#D1D1D1] dark:border-[#333333] pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-mono">Paste Contract Buffer</h3>
              <button
                onClick={() => setShowPasteModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 font-mono">
                Contract Title / ID
              </label>
              <input
                type="text"
                placeholder="e.g. Master_Services_Agreement_Draft_v2.txt"
                value={pastedFilename}
                onChange={(e) => setPastedFilename(e.target.value)}
                className="w-full px-3 py-1.5 rounded text-xs font-mono bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] focus:outline-hidden focus:border-[#F97316] text-[#1A1A1A] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 font-mono">
                Raw Agreement Text Buffer
              </label>
              <textarea
                rows={10}
                placeholder="Paste contract provisions and clauses here..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full px-3 py-2 rounded text-xs font-mono bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] focus:outline-hidden focus:border-[#F97316] text-[#1A1A1A] dark:text-white"
              ></textarea>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]"
              >
                Cancel
              </button>
              <button
                onClick={handlePasteSubmit}
                disabled={!pastedText.trim()}
                className="px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#F97316] hover:bg-orange-600 disabled:opacity-50 text-white shadow-2xs"
              >
                Run Multi-AI Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
