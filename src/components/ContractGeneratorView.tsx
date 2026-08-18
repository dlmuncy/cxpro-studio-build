import React, { useState } from 'react';
import { FilePlus, Sparkles, CheckCircle2, Download, Copy, Check, FileText, ArrowRight, Layers, Scale } from 'lucide-react';
import { ContractTemplate, ClauseLibraryItem } from '../types';
import { CONTRACT_TEMPLATES, SEED_CLAUSES } from '../data/seedData';
import { jsPDF } from 'jspdf';

interface ContractGeneratorViewProps {
  initialClauseToInsert?: ClauseLibraryItem | null;
  onAuditGeneratedContract?: (contractText: string, filename: string) => void;
}

export const ContractGeneratorView: React.FC<ContractGeneratorViewProps> = ({
  initialClauseToInsert,
  onAuditGeneratedContract
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate>(CONTRACT_TEMPLATES[0]);
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    CONTRACT_TEMPLATES[0].fields.forEach(f => {
      initial[f.key] = f.defaultValue || '';
    });
    return initial;
  });

  const [selectedClauseIds, setSelectedClauseIds] = useState<string[]>(() => {
    const defaults = CONTRACT_TEMPLATES[0].defaultClauses;
    if (initialClauseToInsert && !defaults.includes(initialClauseToInsert.id)) {
      return [...defaults, initialClauseToInsert.id];
    }
    return defaults;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleTemplateChange = (templateId: string) => {
    const t = CONTRACT_TEMPLATES.find(x => x.id === templateId) || CONTRACT_TEMPLATES[0];
    setSelectedTemplate(t);
    const newVals: Record<string, string> = {};
    t.fields.forEach(f => {
      newVals[f.key] = f.defaultValue || '';
    });
    setFormValues(newVals);
    setSelectedClauseIds(t.defaultClauses);
    setGeneratedDraft('');
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleClause = (id: string) => {
    setSelectedClauseIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleGenerateContract = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          formValues,
          selectedClauseIds
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedDraft(data.generatedContractText);
      }
    } catch (e) {
      console.warn('Fallback contract generation:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    if (!generatedDraft) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(selectedTemplate.name.toUpperCase(), 14, 20);

    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(generatedDraft, 180);
    doc.text(splitText, 14, 30);
    doc.save(`${selectedTemplate.name.replace(/\s+/g, '_')}_Generated_Draft.pdf`);
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6 font-mono">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#D1D1D1] dark:border-[#333333] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 bg-[#F97316]"></span>
            <h1 className="text-xl font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-sans">AI Contract Analysis Engine</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            GENERATE COMMERCIAL CONTRACT DRAFTS FROM ATTORNEY-VETTED TEMPLATES & MULTI-MODEL CLAUSES
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: TEMPLATE & FORM CONTROLS */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Template Selector */}
          <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded border border-[#D1D1D1] dark:border-[#333333] shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-[#F97316] uppercase tracking-wider font-mono">
              [STEP 1: SELECT CONTRACT TEMPLATE]
            </h3>

            <select
              value={selectedTemplate.id}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded text-xs bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] font-bold text-[#1A1A1A] dark:text-white focus:outline-hidden focus:border-[#F97316] font-mono"
            >
              {CONTRACT_TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
              ))}
            </select>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
              {selectedTemplate.description}
            </p>
          </div>

          {/* 2. Dynamic Inputs Form */}
          <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded border border-[#D1D1D1] dark:border-[#333333] shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-[#F97316] uppercase tracking-wider font-mono">
              [STEP 2: COMMERCIAL PARAMETERS]
            </h3>

            <div className="space-y-3">
              {selectedTemplate.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={formValues[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded text-xs bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white font-mono"
                    >
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={formValues[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded text-xs bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white font-mono"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formValues[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded text-xs bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white font-mono"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Include Clauses Checkbox List */}
          <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded border border-[#D1D1D1] dark:border-[#333333] shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-[#F97316] uppercase tracking-wider font-mono">
              [STEP 3: ATTACH LIBRARY CLAUSES] ({selectedClauseIds.length} ACTIVE)
            </h3>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
              {SEED_CLAUSES.map(c => (
                <label key={c.id} className="flex items-center space-x-2 text-xs text-[#1A1A1A] dark:text-slate-300 cursor-pointer p-1 rounded hover:bg-[#F8F8F8] dark:hover:bg-[#222222]">
                  <input
                    type="checkbox"
                    checked={selectedClauseIds.includes(c.id)}
                    onChange={() => handleToggleClause(c.id)}
                    className="rounded border-[#D1D1D1] text-[#F97316] focus:ring-[#F97316]"
                  />
                  <span className="font-mono text-[11px] truncate">{c.title} [{c.category}]</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleGenerateContract}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded font-bold text-xs bg-[#F97316] hover:bg-orange-600 text-white shadow-2xs transition-all flex items-center justify-center space-x-2 uppercase tracking-wider disabled:opacity-50 font-mono"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'AI Model Generating...' : 'Synthesize Contract Draft'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: GENERATED DRAFT PREVIEW */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded border border-[#D1D1D1] dark:border-[#333333] p-4 shadow-2xs h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#D1D1D1] dark:border-[#333333] pb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-sans">Live Draft Synthesis Output</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">AI MODEL DRAFTED PROVISION MATRIX</p>
                </div>

                {generatedDraft && (
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={handleCopyDraft}
                      className="px-2.5 py-1 rounded bg-[#E5E5E5] dark:bg-[#2A2A2A] hover:bg-[#D1D1D1] dark:hover:bg-[#333333] text-[#1A1A1A] dark:text-slate-200 font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center space-x-1"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={handleExportPDF}
                      className="px-2.5 py-1 rounded bg-[#F97316] hover:bg-orange-600 text-white font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export PDF</span>
                    </button>
                  </div>
                )}
              </div>

              {generatedDraft ? (
                <div className="p-4 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] font-mono text-xs text-[#1A1A1A] dark:text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {generatedDraft}
                </div>
              ) : (
                <div className="py-20 text-center space-y-2 bg-[#F8F8F8] dark:bg-[#222222] rounded border border-dashed border-[#D1D1D1] dark:border-[#333333]">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Configure parameters on the left and click "Synthesize Contract Draft"
                  </p>
                </div>
              )}
            </div>

            {generatedDraft && onAuditGeneratedContract && (
              <div className="pt-3 border-t border-[#D1D1D1] dark:border-[#333333] flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">READY TO VERIFY RISK SCORE?</span>
                <button
                  onClick={() => onAuditGeneratedContract(generatedDraft, `${selectedTemplate.name}_Draft.txt`)}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-2xs transition-all flex items-center space-x-1.5 font-mono"
                >
                  <span>Run Multi-AI Audit Scan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
