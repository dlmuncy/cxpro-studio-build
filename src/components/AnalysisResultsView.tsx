import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Shield, Sparkles, CheckCircle, AlertTriangle, FileText, Download, Share2, Copy, Check, Layers, Scale, ShieldAlert, ArrowLeft, Lightbulb, FileCheck, Lock, Unlock, Zap, Crown, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { ContractAnalysisResult, RiskItem, UserSubscription } from '../types';
import { RiskScoringEngine } from '../services/riskEngine';

interface AnalysisResultsViewProps {
  analysis: ContractAnalysisResult;
  onBackToDashboard: () => void;
  onNavigateToGeneratorWithText?: (text: string) => void;
  currentSubscription?: UserSubscription;
  onOpenSubscriptionModal?: (planId?: 'student' | 'starter' | 'professional' | 'enterprise') => void;
}

export const AnalysisResultsView: React.FC<AnalysisResultsViewProps> = ({
  analysis,
  onBackToDashboard,
  onNavigateToGeneratorWithText,
  currentSubscription = { tier: 'free', status: 'free_scan_used', planName: 'Free Tier', scansUsed: 1, scansTotal: 1 },
  onOpenSubscriptionModal
}) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'risk' | 'clause' | 'recommendations'>('recommendations');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // Optional preview override for reviewer to toggle between free gated view and pro unlocked view
  const [previewSubscribedMode, setPreviewSubscribedMode] = useState<boolean>(false);

  const isActuallySubscribed = currentSubscription.tier !== 'free' || previewSubscribedMode;
  const riskGuidance = RiskScoringEngine.getRiskScoreGuidance(analysis.overallRiskScore);

  // Calculate total identified issues count across the scan
  const allRisks = analysis.claudeAnalysis.risks || [];
  const allCompliance = analysis.claudeAnalysis.complianceGaps || [];
  const allMissingClauses = analysis.gpt4Analysis.missingStandardClauses || [];
  const totalIssuesCount = allRisks.length + allCompliance.length + allMissingClauses.length;

  // Pick 3 issues of varying importance (Critical, High, Medium/Low)
  const criticalRisks = allRisks.filter(r => r.severity === 'Critical');
  const highRisks = allRisks.filter(r => r.severity === 'High');
  const mediumOrLowRisks = allRisks.filter(r => r.severity === 'Medium' || r.severity === 'Low');

  const selectedSampleRisks: RiskItem[] = [];
  if (criticalRisks.length > 0) selectedSampleRisks.push(criticalRisks[0]);
  if (highRisks.length > 0) selectedSampleRisks.push(highRisks[0]);
  if (mediumOrLowRisks.length > 0) {
    selectedSampleRisks.push(mediumOrLowRisks[0]);
  } else if (allRisks.length > selectedSampleRisks.length) {
    // Fill up to 3 if single category
    const remainder = allRisks.filter(r => !selectedSampleRisks.some(s => s.id === r.id));
    if (remainder[0]) selectedSampleRisks.push(remainder[0]);
  }

  // Ensure we have exactly up to 3 unlocked IDs
  const unlockedRiskIds = new Set(selectedSampleRisks.map(r => r.id));
  const hiddenRisksCount = Math.max(0, allRisks.length - (isActuallySubscribed ? 0 : unlockedRiskIds.size));

  const handleCopyText = (text: string, id: string) => {
    if (!isActuallySubscribed && !unlockedRiskIds.has(id) && id !== 'summary') {
      if (onOpenSubscriptionModal) onOpenSubscriptionModal('professional');
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`cxpro.site - Legal Contract Audit Report`, 14, 20);

    doc.setFontSize(12);
    doc.text(`Document: ${analysis.filename}`, 14, 30);
    doc.text(`Overall Risk Score: ${analysis.overallRiskScore}/100 (${analysis.claudeAnalysis.overallRiskCategory})`, 14, 38);
    doc.text(`Percentile Benchmark: Riskier than ${analysis.percentileRanking}% of comparable agreements`, 14, 46);
    doc.text(`Issues Identified: ${totalIssuesCount} Total Vulnerabilities Detected`, 14, 54);

    doc.setFontSize(14);
    doc.text(`Executive Summary:`, 14, 66);
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(analysis.summaryText, 180);
    doc.text(splitSummary, 14, 74);

    let yPos = 100;
    doc.setFontSize(14);
    doc.text(isActuallySubscribed ? `Consensus Recommendations:` : `Sample Unlocked Recommendations (Free Scan Tier):`, 14, yPos);
    yPos += 8;

    doc.setFontSize(10);
    const recsToExport = isActuallySubscribed ? analysis.consensusRecommendations : analysis.consensusRecommendations.slice(0, 3);
    recsToExport.forEach((rec, idx) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${idx + 1}. ${rec.title} (Saves ~${rec.scoreReductionPotential} risk points)`, 14, yPos);
      yPos += 6;
      doc.text(`   Current: ${rec.proposedTextChange.current}`, 14, yPos);
      yPos += 6;
      doc.text(`   Proposed: ${rec.proposedTextChange.proposed}`, 14, yPos);
      yPos += 10;
    });

    if (!isActuallySubscribed && analysis.consensusRecommendations.length > 3) {
      doc.text(`[+] ${analysis.consensusRecommendations.length - 3} More Redline Recommendations Hidden in Free Scan.`, 14, yPos);
      yPos += 6;
      doc.text(`Subscribe to cxpro.site Pro to unlock all recommendations and export full audit.`, 14, yPos);
    }

    doc.save(`${analysis.filename}_cxpro.site_Audit_Report.pdf`);
  };

  const handleOpenSubscription = (planId: 'starter' | 'professional' | 'enterprise' = 'professional') => {
    if (onOpenSubscriptionModal) {
      onOpenSubscriptionModal(planId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* HEADER & TOP ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#D1D1D1] dark:border-[#333333] pb-4">
        <div>
          <button
            onClick={onBackToDashboard}
            className="text-xs font-bold uppercase tracking-wider text-[#F97316] hover:underline flex items-center space-x-1 mb-1 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white truncate max-w-xl font-sans">
              {analysis.filename}
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#E5E5E5] dark:bg-[#2A2A2A] text-[#1A1A1A] dark:text-slate-200 border border-[#D1D1D1] dark:border-[#333333]">
              [{analysis.gpt4Analysis.documentClassification}]
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
            CXPRO.SITE MULTI-MODEL CONSENSUS AUDIT • TOTAL ISSUES FOUND: {totalIssuesCount}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subscription / Plan status toggle */}
          <button
            onClick={() => setPreviewSubscribedMode(!previewSubscribedMode)}
            title="Toggle between Free Sample View (3 issues) and Subscribed Full View"
            className="px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border border-[#D1D1D1] dark:border-[#333333] bg-white dark:bg-[#1A1A1A] text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white flex items-center space-x-1.5 font-mono shadow-2xs"
          >
            {isActuallySubscribed ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-[#F97316]" />}
            <span>{isActuallySubscribed ? 'Subscribed Mode (Full)' : 'Free Scan Mode (3 Issues)'}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#1A1A1A] border border-[#D1D1D1] dark:border-[#333333] hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A] text-[#1A1A1A] dark:text-slate-200 transition-all flex items-center space-x-1.5 shadow-2xs font-mono"
          >
            <Download className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Export Report PDF</span>
          </button>

          <button
            onClick={() => handleCopyText(analysis.summaryText, 'summary')}
            className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#1A1A1A] border border-[#D1D1D1] dark:border-[#333333] hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A] text-[#1A1A1A] dark:text-slate-200 transition-all flex items-center space-x-1.5 shadow-2xs font-mono"
          >
            {copiedId === 'summary' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-indigo-500" />}
            <span>{copiedId === 'summary' ? 'Summary Copied' : 'Share Summary'}</span>
          </button>

          {!isActuallySubscribed && (
            <button
              onClick={() => handleOpenSubscription('professional')}
              className="px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#F97316] to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-2xs transition-all flex items-center space-x-1.5 font-mono animate-pulse"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Unlock All {totalIssuesCount} Issues</span>
            </button>
          )}

          {isActuallySubscribed && onNavigateToGeneratorWithText && (
            <button
              onClick={() => onNavigateToGeneratorWithText(analysis.summaryText)}
              className="px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#F97316] hover:bg-orange-600 text-white shadow-2xs transition-all flex items-center space-x-1.5 font-mono"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Draft Improved Version</span>
            </button>
          )}
        </div>
      </div>

      {/* FREEMIUM / SUBSCRIPTION PAYWALL BANNER (FOR FREE USERS) */}
      {!isActuallySubscribed && (
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-[#F97316] text-white p-4 rounded shadow-md border border-orange-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-white" />
              <span className="font-bold text-xs uppercase tracking-wider">
                FREE SCAN AUDIT: 3 OF {totalIssuesCount} ISSUES UNLOCKED • {allRisks.length - 3} CRITICAL RISKS BLURRED
              </span>
            </div>
            <p className="text-[11px] text-orange-100 max-w-3xl leading-relaxed">
              We identified <strong>{totalIssuesCount} total vulnerabilities</strong> ({criticalRisks.length} Critical, {highRisks.length} High, {mediumOrLowRisks.length} Medium/Low). 3 sample issues of varying severity are unlocked below. Subscribe to cxpro.site to unlock all redlines, auto-remediations, and unlimited scans.
            </p>
          </div>

          <button
            onClick={() => handleOpenSubscription('professional')}
            className="whitespace-nowrap px-4 py-2 rounded bg-white text-[#F97316] hover:bg-orange-50 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center space-x-1.5"
          >
            <Crown className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Unlock cxpro.site ($349/mo)</span>
          </button>
        </div>
      )}


      {/* EXECUTIVE SUMMARY CARD */}
      <div className="bg-[#1A1A1A] text-white rounded p-5 sm:p-6 shadow-md border border-[#333333] relative overflow-hidden font-mono">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Gauge & Score */}
          <div className="flex flex-col items-center justify-center text-center p-5 rounded bg-[#222222] border border-[#333333]">
            <div className="relative w-28 h-28 flex items-center justify-center mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#333333]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    analysis.overallRiskScore >= 86
                      ? 'text-rose-500'
                      : analysis.overallRiskScore >= 61
                      ? 'text-amber-500'
                      : analysis.overallRiskScore >= 31
                      ? 'text-yellow-400'
                      : 'text-emerald-400'
                  }
                  strokeDasharray={`${analysis.overallRiskScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black font-mono tracking-tight text-white">{analysis.overallRiskScore}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">/ 100 RISK</span>
              </div>
            </div>

            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              analysis.overallRiskScore >= 86 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
              analysis.overallRiskScore >= 61 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              analysis.overallRiskScore >= 31 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {analysis.claudeAnalysis.overallRiskCategory} RISK
            </span>

            <p className="text-[10px] text-slate-400 mt-2 font-mono">
              BENCHMARK: RISKIER THAN <strong className="text-[#F97316]">{analysis.percentileRanking}%</strong> OF CONTRACTS
            </p>
          </div>

          {/* Core Findings Summary */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 bg-[#F97316]"></span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-sans">CXPro Multi-AI Executive Verdict</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 font-mono">
                {totalIssuesCount} TOTAL ISSUES IDENTIFIED
              </span>
            </div>

            <p className="text-slate-200 text-xs leading-relaxed font-mono">
              {analysis.summaryText}
            </p>

            <div className="p-3 rounded bg-[#222222] border border-[#333333] text-xs text-slate-300 flex items-start space-x-2.5 font-mono">
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5 text-xs uppercase">{riskGuidance.title}</span>
                <span className="text-[11px]">{riskGuidance.description} — <strong className="text-[#F97316]">{riskGuidance.action}</strong></span>
              </div>
            </div>

            {/* AI Badges */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-[#252525] border border-[#444444] text-slate-300 flex items-center space-x-1">
                <Layers className="w-3 h-3 text-blue-400" />
                <span>GPT-4o: Structure & Terms</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#252525] border border-[#444444] text-slate-300 flex items-center space-x-1">
                <Shield className="w-3 h-3 text-indigo-400" />
                <span>Claude 3.5: Risk Matrix</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#252525] border border-[#444444] text-slate-300 flex items-center space-x-1">
                <Scale className="w-3 h-3 text-sky-400" />
                <span>Gemini 1.5: 500+ Standards</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TABBED INTERFACE NAV */}
      <div className="border-b border-[#D1D1D1] dark:border-[#333333] grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-1.5 bg-white dark:bg-[#1A1A1A] p-1.5 rounded">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded flex items-center justify-center lg:justify-start space-x-1.5 font-mono ${
            activeTab === 'recommendations'
              ? 'bg-[#F97316] text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Consensus Redlines ({analysis.consensusRecommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('risk')}
          className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded flex items-center justify-center lg:justify-start space-x-1.5 font-mono ${
            activeTab === 'risk'
              ? 'bg-[#F97316] text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Risk Provisions ({allRisks.length} Found {!isActuallySubscribed && '• 3 Unlocked'})</span>
        </button>

        <button
          onClick={() => setActiveTab('structure')}
          className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded flex items-center justify-center lg:justify-start space-x-1.5 font-mono ${
            activeTab === 'structure'
              ? 'bg-[#F97316] text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Structure (GPT-4o)</span>
        </button>

        <button
          onClick={() => setActiveTab('clause')}
          className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded flex items-center justify-center lg:justify-start space-x-1.5 font-mono ${
            activeTab === 'clause'
              ? 'bg-[#F97316] text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A2A]'
          }`}
        >
          <Scale className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Clause Matching (Gemini)</span>
        </button>
      </div>

      {/* TAB 1: RECOMMENDATIONS & CONTRACT OPTIMIZER */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4 font-mono">
          <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded border border-orange-200 dark:border-orange-800/40 text-xs text-orange-900 dark:text-orange-200 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-xs uppercase">Actionable Score Impact Recommendations</span>
              <span className="text-[11px]">
                {isActuallySubscribed 
                  ? 'All consensus provisions are unlocked with 1-click watertight replacement clauses.'
                  : `Showing 3 active consensus redlines. ${Math.max(0, analysis.consensusRecommendations.length - 3)} additional high-impact redlines are blurred.`}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {analysis.consensusRecommendations.map((rec, index) => {
              const isUnlocked = isActuallySubscribed || index < 3;

              if (isUnlocked) {
                return (
                  <div
                    key={rec.id}
                    className="bg-white dark:bg-[#1A1A1A] rounded border border-[#D1D1D1] dark:border-[#333333] p-4 shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D1D1D1] dark:border-[#333333] pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          -{rec.scoreReductionPotential} RISK PTS
                        </span>
                        <h3 className="text-xs font-bold text-[#1A1A1A] dark:text-white uppercase font-sans">{rec.title}</h3>
                      </div>

                      <span className="text-[10px] font-bold text-[#F97316] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-800">
                        CONFIDENCE: {rec.confidenceLevel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                      {rec.description}
                    </p>

                    {/* Side-by-Side Comparison Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs">
                        <span className="font-bold text-rose-700 dark:text-rose-400 block mb-1 text-[10px] uppercase">Current Flawed Provision:</span>
                        <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed">
                          "{rec.proposedTextChange.current}"
                        </p>
                      </div>

                      <div className="p-3 rounded bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[10px] uppercase">Watertight Replacement:</span>
                          <button
                            onClick={() => handleCopyText(rec.proposedTextChange.proposed, rec.id)}
                            className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedId === rec.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed">
                          "{rec.proposedTextChange.proposed}"
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              // BLURRED / LOCKED RECOMMENDATION
              return (
                <div
                  key={rec.id}
                  className="relative bg-white dark:bg-[#1A1A1A] rounded border border-[#D1D1D1] dark:border-[#333333] p-4 shadow-2xs overflow-hidden"
                >
                  {/* Blurred background content */}
                  <div className="filter blur-[5px] select-none opacity-30 pointer-events-none space-y-3">
                    <div className="flex items-center space-x-2 border-b pb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                        -{rec.scoreReductionPotential} RISK PTS
                      </span>
                      <h3 className="text-xs font-bold text-[#1A1A1A] dark:text-white uppercase font-sans">
                        {rec.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                      {rec.description}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-rose-50 rounded">Flawed provision text hidden by paywall...</div>
                      <div className="p-3 bg-emerald-50 rounded">Watertight replacement clause text hidden by paywall...</div>
                    </div>
                  </div>

                  {/* Lock Overlay on blurred item */}
                  <div className="absolute inset-0 bg-white/70 dark:bg-[#1A1A1A]/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-2">
                    <div className="w-7 h-7 rounded-full bg-[#F97316] text-white flex items-center justify-center shadow-md">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#1A1A1A] dark:text-white uppercase font-sans">
                      🔒 Recommendation Redline #{index + 1} Hidden ({rec.scoreReductionPotential} Point Impact)
                    </span>
                    <p className="text-[10px] text-slate-500 max-w-md font-mono">
                      Upgrade to cxpro.site Subscription to unlock this automatic redline, clause modification, and full legal draft.
                    </p>
                    <button
                      onClick={() => handleOpenSubscription('professional')}
                      className="px-3 py-1 rounded bg-[#F97316] hover:bg-orange-600 text-white font-bold text-[10px] uppercase tracking-wider font-mono shadow-2xs"
                    >
                      Unlock with cxpro.site Subscription
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CALLOUT TO SUBSCRIBE IF BLURRED ITEMS EXIST */}
          {!isActuallySubscribed && analysis.consensusRecommendations.length > 3 && (
            <div className="p-4 rounded bg-[#1A1A1A] text-white border border-[#333333] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase text-[#F97316] block font-sans">
                  +{analysis.consensusRecommendations.length - 3} Additional Automated Redlines Hidden
                </span>
                <span className="text-[11px] text-slate-300 font-mono">
                  cxpro.site subscribers get unrestricted access to all multi-model contract rewrites and live document export.
                </span>
              </div>

              <button
                onClick={() => handleOpenSubscription('professional')}
                className="px-4 py-2 rounded bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-2xs whitespace-nowrap"
              >
                Subscribe to Unlock All
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RISK & COMPLIANCE (CLAUDE) */}
      {activeTab === 'risk' && (
        <div className="space-y-6 font-mono">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Items Column (2 Cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between border-b border-[#D1D1D1] dark:border-[#333333] pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center space-x-2 font-mono">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>Identified Risk Provisions ({allRisks.length} Total Found)</span>
                </h3>
                <span className="text-[10px] font-bold text-[#F97316]">
                  {isActuallySubscribed ? 'ALL PROVISIONS UNLOCKED' : '3 OF VARYING SEVERITY UNLOCKED'}
                </span>
              </div>

              {allRisks.map((risk, index) => {
                const isUnlocked = isActuallySubscribed || unlockedRiskIds.has(risk.id);

                if (isUnlocked) {
                  return (
                    <div
                      key={risk.id}
                      className="bg-white dark:bg-[#1A1A1A] rounded border border-[#D1D1D1] dark:border-[#333333] p-4 shadow-2xs space-y-2.5 relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            risk.severity === 'Critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' :
                            risk.severity === 'High' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                            'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {risk.severity} Risk (+{risk.scoreImpact} pts)
                          </span>
                          {!isActuallySubscribed && (
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                              ✓ FREE SAMPLE UNLOCKED
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{risk.sectionReference}</span>
                      </div>

                      <h4 className="font-bold text-xs text-[#1A1A1A] dark:text-white font-sans">{risk.clauseTitle}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{risk.explanation}</p>

                      <div className="p-2.5 rounded bg-[#F8F8F8] dark:bg-[#222222] text-[11px] space-y-1.5">
                        <div><strong className="text-rose-600 dark:text-rose-400 uppercase">Consequence:</strong> {risk.potentialConsequence}</div>
                        <div><strong className="text-[#F97316] uppercase">Remediation:</strong> {risk.recommendedAction}</div>
                      </div>

                      {/* Interactive remediation action buttons (only on unlocked items) */}
                      <div className="pt-2 flex items-center justify-between border-t border-[#D1D1D1]/60 dark:border-[#333333] text-[10px]">
                        <span className="text-slate-400">AI Consensus Agreement: 3 Models</span>
                        <button
                          onClick={() => handleCopyText(risk.recommendedAction, risk.id)}
                          className="px-2.5 py-1 rounded bg-[#F1F1F1] dark:bg-[#2A2A2A] hover:bg-[#E5E5E5] text-[#1A1A1A] dark:text-slate-200 font-bold uppercase flex items-center space-x-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedId === risk.id ? 'Copied' : 'Copy Action'}</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                // BLURRED / LOCKED RISK PROVISION
                return (
                  <div
                    key={risk.id}
                    className="relative bg-white dark:bg-[#1A1A1A] rounded border border-[#D1D1D1] dark:border-[#333333] p-4 shadow-2xs overflow-hidden"
                  >
                    {/* Blurred content */}
                    <div className="filter blur-[5px] select-none opacity-25 pointer-events-none space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600">
                          {risk.severity} Risk (+{risk.scoreImpact} pts)
                        </span>
                        <span className="text-[10px] text-slate-400">{risk.sectionReference}</span>
                      </div>
                      <h4 className="font-bold text-xs text-[#1A1A1A] dark:text-white font-sans">{risk.clauseTitle}</h4>
                      <p className="text-xs text-slate-600">{risk.explanation}</p>
                      <div className="p-2.5 rounded bg-[#222222] text-[11px]">
                        <div>Consequence: {risk.potentialConsequence}</div>
                        <div>Remediation: {risk.recommendedAction}</div>
                      </div>
                    </div>

                    {/* Paywall Overlay */}
                    <div className="absolute inset-0 bg-white/80 dark:bg-[#1A1A1A]/85 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 font-sans uppercase">
                        <Lock className="w-3.5 h-3.5" />
                        <span>🔒 {risk.severity} Risk #{index + 1} Hidden & Blurred</span>
                      </div>
                      <p className="text-[10px] text-slate-500 max-w-sm font-mono">
                        Requires cxpro.site Active Subscription to view legal consequence, liability score impact, and instant redline.
                      </p>
                      <button
                        onClick={() => handleOpenSubscription('professional')}
                        className="mt-1 px-3 py-1 rounded bg-[#F97316] hover:bg-orange-600 text-white font-bold text-[10px] uppercase tracking-wider font-mono shadow-2xs flex items-center space-x-1"
                      >
                        <span>Upgrade to View Redline</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compliance & Regulatory Matrix (1 Col) */}
            <div className="space-y-3">
              <div className="border-b border-[#D1D1D1] dark:border-[#333333] pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center space-x-2 font-mono">
                  <Shield className="w-4 h-4 text-indigo-500" />
                  <span>Compliance Frameworks ({allCompliance.length})</span>
                </h3>
              </div>

              <div className="bg-white dark:bg-[#1A1A1A] rounded border border-[#D1D1D1] dark:border-[#333333] p-4 shadow-2xs space-y-3">
                {allCompliance.map((gap, idx) => {
                  const isUnlocked = isActuallySubscribed || idx === 0;

                  if (isUnlocked) {
                    return (
                      <div key={gap.id} className="border-b border-[#D1D1D1] dark:border-[#333333] pb-3 last:border-none last:pb-0 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#1A1A1A] dark:text-white font-sans">{gap.framework}</span>
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            gap.status === 'Non-Compliant' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {gap.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{gap.description}</p>
                        <p className="text-xs text-[#F97316] font-bold">FIX: {gap.remediationStep}</p>
                      </div>
                    );
                  }

                  // Blurred compliance item
                  return (
                    <div key={gap.id} className="relative p-2.5 rounded border border-[#D1D1D1]/60 dark:border-[#333333] overflow-hidden">
                      <div className="filter blur-[4px] select-none opacity-20 pointer-events-none">
                        <div className="flex justify-between font-bold text-xs">
                          <span>{gap.framework}</span>
                          <span>{gap.status}</span>
                        </div>
                        <p className="text-xs">{gap.description}</p>
                      </div>
                      <div className="absolute inset-0 bg-white/80 dark:bg-[#1A1A1A]/85 flex items-center justify-center space-x-1.5 text-[10px] font-bold text-[#F97316]">
                        <Lock className="w-3 h-3" />
                        <span>🔒 {gap.framework} Audit Locked (Subscribe)</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* UPGRADE TEASER BOX */}
              {!isActuallySubscribed && (
                <div className="p-3.5 rounded bg-gradient-to-br from-[#202020] to-[#121212] text-white border border-[#333333] space-y-2">
                  <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-bold uppercase">
                    <Crown className="w-3.5 h-3.5" />
                    <span>cxpro.site Unlimited Tier</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                    Subscribe now to generate automated redline amendments and audit unlimited agreements per month.
                  </p>
                  <button
                    onClick={() => handleOpenSubscription('professional')}
                    className="w-full py-2 px-3 rounded bg-[#F97316] hover:bg-orange-600 text-white font-bold text-[10px] uppercase font-mono shadow-2xs transition-all"
                  >
                    View Pricing Plans & Payment Links
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STRUCTURE & INTENT (GPT-4) */}
      {activeTab === 'structure' && (
        <div className="space-y-6 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Commercial Terms */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded border border-[#D1D1D1] dark:border-[#333333] p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center space-x-2 font-mono">
                <FileText className="w-4 h-4 text-[#F97316]" />
                <span>Extracted Commercial Terms</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {analysis.gpt4Analysis.keyTerms.map((term, i) => (
                  <div key={i} className="p-2.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1]/60 dark:border-[#333333]">
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">{term.label}</span>
                    <span className="font-bold text-[#1A1A1A] dark:text-white block mt-0.5 font-sans">{term.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <span className="text-xs font-bold text-slate-500 block mb-1 uppercase text-[10px]">
                  Missing Standard Provisions ({allMissingClauses.length}):
                </span>
                <ul className="space-y-1 text-xs text-rose-600 dark:text-rose-400 font-bold">
                  {allMissingClauses.map((m, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded bg-rose-500"></span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Clause Inventory */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded border border-[#D1D1D1] dark:border-[#333333] p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center space-x-2 font-mono">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Section Inventory Matrix</span>
              </h3>

              <div className="space-y-2 text-xs">
                {analysis.gpt4Analysis.clauseInventory.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded border border-[#D1D1D1]/60 dark:border-[#333333] hover:bg-[#F8F8F8] dark:hover:bg-[#222222]">
                    <div className="flex items-center justify-between font-bold text-[#1A1A1A] dark:text-white font-sans">
                      <span>{item.section}: {item.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        item.riskLevel === 'Critical' || item.riskLevel === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-mono text-[11px]">{item.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CLAUSE COMPARISON (GEMINI) */}
      {activeTab === 'clause' && (
        <div className="space-y-4 font-mono">
          <div className="bg-white dark:bg-[#1A1A1A] rounded border border-[#D1D1D1] dark:border-[#333333] p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center space-x-2 font-mono">
                <Scale className="w-4 h-4 text-sky-500" />
                <span>Clause Match vs 500+ Vetted cxpro.site Standards</span>
              </h3>
              <span className="text-[10px] text-slate-400">
                {analysis.geminiAnalysis.clauseMatches.length} CLAUSES BENCHMARKED
              </span>
            </div>

            {analysis.geminiAnalysis.clauseMatches.map((match, i) => {
              const isUnlocked = isActuallySubscribed || i < 3;

              if (isUnlocked) {
                return (
                  <div key={i} className="p-4 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1]/80 dark:border-[#333333] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1A1A1A] dark:text-white font-sans">{match.clauseTitle}</span>
                      <span className="px-2 py-0.5 rounded font-bold bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 text-[10px]">
                        {match.similarityScore}% LIBRARY MATCH
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-mono italic">
                      "{match.originalText}"
                    </p>

                    <div className="text-xs pt-1">
                      <span className="font-bold text-[#F97316] block mb-1 uppercase text-[10px]">Standard Library Equivalent:</span>
                      <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] bg-white dark:bg-[#1A1A1A] p-2.5 rounded border border-[#D1D1D1] dark:border-[#333333]">
                        "{match.libraryEquivalent}"
                      </p>
                    </div>

                    {match.alternativeSuggestions && match.alternativeSuggestions.length > 0 && (
                      <div className="pt-2 text-xs">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Recommended Balanced Variation:</span>
                        <div className="p-2.5 rounded bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-[11px]">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                            {match.alternativeSuggestions[0].title}
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 font-mono">
                            "{match.alternativeSuggestions[0].text}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Blurred clause comparison
              return (
                <div key={i} className="relative p-4 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1]/80 dark:border-[#333333] overflow-hidden">
                  <div className="filter blur-[5px] select-none opacity-20 pointer-events-none space-y-2">
                    <span className="font-bold text-xs">{match.clauseTitle}</span>
                    <p className="text-xs">{match.originalText}</p>
                    <p className="text-xs">{match.libraryEquivalent}</p>
                  </div>
                  <div className="absolute inset-0 bg-white/80 dark:bg-[#1A1A1A]/85 backdrop-blur-xs flex items-center justify-center space-x-2 text-xs font-bold text-[#F97316]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>🔒 Clause Comparison #{i + 1} Locked • Upgrade to cxpro.site</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STICKY BOTTOM SUBSCRIPTION CTA BAR (FOR UN-SUBSCRIBED FREE SCAN USERS) */}
      {!isActuallySubscribed && (
        <div className="sticky bottom-2 z-30 p-3 rounded bg-[#1A1A1A] text-white border border-[#333333] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded bg-[#F97316] flex items-center justify-center text-white font-bold text-xs">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-white block">
                cxpro.site Free Scan: 3 Issues Shown • {totalIssuesCount - 3} Hidden Behind Subscription
              </span>
              <span className="text-[10px] text-slate-400">
                Unlock instant automated redlines, watertight clause swaps, and unlimited contract audits.
              </span>
            </div>
          </div>


          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenSubscription('starter')}
              className="px-3 py-1.5 rounded bg-[#2A2A2A] hover:bg-[#333333] text-slate-200 font-bold text-xs uppercase tracking-wider transition-all border border-[#444444]"
            >
              Starter ($149/mo)
            </button>
            <button
              onClick={() => handleOpenSubscription('professional')}
              className="px-4 py-1.5 rounded bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-2xs"
            >
              Subscribe Pro ($349/mo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
