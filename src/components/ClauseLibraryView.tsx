import React, { useState } from 'react';
import { Search, Filter, Copy, Check, Plus, Library, Sparkles, Scale, Shield, Tag } from 'lucide-react';
import { ClauseLibraryItem } from '../types';
import { SEED_CLAUSES } from '../data/seedData';

interface ClauseLibraryViewProps {
  onInsertIntoGenerator?: (clause: ClauseLibraryItem) => void;
}

export const ClauseLibraryView: React.FC<ClauseLibraryViewProps> = ({ onInsertIntoGenerator }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('All');
  const [selectedFavorability, setSelectedFavorability] = useState('All');
  const [copiedClauseId, setCopiedClauseId] = useState<string | null>(null);

  const categories = ['All', 'Indemnification', 'Limitation of Liability', 'Termination and Renewal', 'Intellectual Property', 'Confidentiality & Non-Disclosure', 'Payment Terms', 'Warranties and Representations', 'Dispute Resolution', 'Force Majeure', 'Governing Law'];
  const industries = ['All', 'Technology', 'SaaS', 'Real Estate', 'Healthcare', 'General'];
  const riskLevels = ['All', 'Low', 'Medium', 'High'];
  const favorabilities = ['All', 'Vendor-favorable', 'Customer-favorable', 'Balanced'];

  const filteredClauses = SEED_CLAUSES.filter(c => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = c.title.toLowerCase().includes(q) || c.text.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }
    if (selectedCategory !== 'All' && c.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (selectedIndustry !== 'All' && !c.industry.includes(selectedIndustry) && !c.industry.includes('General')) return false;
    if (selectedRiskLevel !== 'All' && c.riskLevel.toLowerCase() !== selectedRiskLevel.toLowerCase()) return false;
    if (selectedFavorability !== 'All' && c.favorability.toLowerCase() !== selectedFavorability.toLowerCase()) return false;
    return true;
  });

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClauseId(id);
    setTimeout(() => setCopiedClauseId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6 font-mono">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#D1D1D1] dark:border-[#333333] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 bg-[#F97316]"></span>
            <h1 className="text-xl font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white font-sans">Vetted Legal Clause Repository</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ATTORNEY-VERIFIED CLAUSE LIBRARY • 500+ PROVISIONS ACROSS 10 LEGAL CATEGORIES
          </p>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider bg-white dark:bg-[#1A1A1A] px-3 py-1.5 rounded border border-[#D1D1D1] dark:border-[#333333]">
          COUNT: <strong className="text-[#F97316]">{filteredClauses.length}</strong> MATCHING CLAUSES
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded border border-[#D1D1D1] dark:border-[#333333] shadow-2xs space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search clauses by keyword, title, tag, or provision text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded text-xs font-mono bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] focus:outline-hidden focus:border-[#F97316] text-[#1A1A1A] dark:text-white"
          />
        </div>

        {/* Filter Selectors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-xs font-mono"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Industry Domain</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-2 py-1.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-xs font-mono"
            >
              {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Favorability Position</label>
            <select
              value={selectedFavorability}
              onChange={(e) => setSelectedFavorability(e.target.value)}
              className="w-full px-2 py-1.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-xs font-mono"
            >
              {favorabilities.map(fav => <option key={fav} value={fav}>{fav}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Risk Profile</label>
            <select
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              className="w-full px-2 py-1.5 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-xs font-mono"
            >
              {riskLevels.map(rl => <option key={rl} value={rl}>{rl}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* CLAUSES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClauses.map((clause) => (
          <div
            key={clause.id}
            className="bg-white dark:bg-[#1A1A1A] rounded border border-[#D1D1D1] dark:border-[#333333] p-4 shadow-2xs flex flex-col justify-between hover:border-[#F97316] transition-all space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider block">
                    [{clause.category}]
                  </span>
                  <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase font-sans mt-0.5">{clause.title}</h3>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 uppercase ${
                  clause.favorability === 'Balanced' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                  clause.favorability === 'Customer-favorable' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                  'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                }`}>
                  {clause.favorability}
                </span>
              </div>

              {/* Clause Body Text */}
              <div className="p-3 rounded bg-[#F8F8F8] dark:bg-[#222222] border border-[#D1D1D1]/60 dark:border-[#333333] text-xs font-mono text-[#1A1A1A] dark:text-slate-200 leading-relaxed max-h-40 overflow-y-auto">
                "{clause.text}"
              </div>

              {/* Tags & Metadata */}
              <div className="flex flex-wrap items-center gap-1 text-[10px]">
                {clause.tags.map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 rounded bg-[#E5E5E5] dark:bg-[#2A2A2A] text-slate-700 dark:text-slate-300">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="pt-2 border-t border-[#D1D1D1]/60 dark:border-[#333333] flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">
                USED IN {clause.usageCount.toLocaleString()} AUDITED CONTRACTS
              </span>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => handleCopyText(clause.text, clause.id)}
                  className="px-2.5 py-1 rounded bg-[#E5E5E5] dark:bg-[#2A2A2A] hover:bg-[#D1D1D1] dark:hover:bg-[#333333] text-[#1A1A1A] dark:text-slate-200 font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center space-x-1"
                >
                  {copiedClauseId === clause.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedClauseId === clause.id ? 'Copied' : 'Copy'}</span>
                </button>

                {onInsertIntoGenerator && (
                  <button
                    onClick={() => onInsertIntoGenerator(clause)}
                    className="px-2.5 py-1 rounded bg-[#F97316] hover:bg-orange-600 text-white font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Insert</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
