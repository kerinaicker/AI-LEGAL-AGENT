import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  BookOpen, 
  ScrollText, 
  FileSearch, 
  GitCompare, 
  ArrowRight,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { SearchFilters, LegalArea } from '../types/legal';

interface ResearchSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  isLoading: boolean;
  userMode: 'professional' | 'public';
}

const SAMPLE_QUERIES = [
  'Can a director be personally liable for company debts?',
  'What are the requirements for an urgent interdict?',
  'When is a dismissal automatically unfair under section 187 LRA?',
  'Can a municipality disconnect electricity without due process?',
  'Can a contract clause be struck down for being contrary to public policy?'
];

export const ResearchSearch: React.FC<ResearchSearchProps> = ({
  onSearch,
  isLoading,
  userMode
}) => {
  const [query, setQuery] = useState('');
  const [researchType, setResearchType] = useState<string>('question');
  const [showFilters, setShowFilters] = useState(false);

  // Filters State
  const [court, setCourt] = useState<string>('All');
  const [dateRange, setDateRange] = useState<string>('1994_present');
  const [areaOfLaw, setAreaOfLaw] = useState<LegalArea | 'All'>('All');
  const [documentType, setDocumentType] = useState<SearchFilters['documentType']>('all');
  const [sortBy, setSortBy] = useState<SearchFilters['sortBy']>('hierarchy');
  const [authorityLevel, setAuthorityLevel] = useState<SearchFilters['authorityLevel']>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    onSearch(query.trim(), {
      jurisdiction: 'South Africa',
      court: court === 'All' ? undefined : court,
      dateRange,
      areaOfLaw: areaOfLaw === 'All' ? undefined : areaOfLaw,
      documentType,
      sortBy,
      authorityLevel
    });
  };

  const handleSelectSample = (sample: string) => {
    setQuery(sample);
    onSearch(sample, {
      jurisdiction: 'South Africa',
      dateRange: '1994_present',
      sortBy: 'hierarchy'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 pb-4">
      {/* Header Titles */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-950 tracking-tight mb-2.5">
          Research South African law with confidence.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Find cases, legislation and legal principles with the authorities behind every answer.
        </p>
      </div>

      {/* Main Search Box Form */}
      <form onSubmit={handleSubmit} className="relative mb-4">
        <div className="relative bg-white rounded-xl border-2 border-slate-300 hover:border-slate-400 focus-within:border-[#0f1f38] shadow-sm transition-all overflow-hidden">
          <div className="flex items-center px-4 py-3 sm:py-4">
            <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
            <input
              id="research-query-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Can a director be personally liable for company debts? or Section 189 LRA retrenchments"
              className="w-full text-slate-900 placeholder-slate-400 text-base sm:text-lg bg-transparent border-none focus:outline-none focus:ring-0"
              disabled={isLoading}
            />
            <button
              id="research-submit-btn"
              type="submit"
              disabled={!query.trim() || isLoading}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                query.trim() && !isLoading
                  ? 'bg-[#0f1f38] text-white hover:bg-[#162c4e] shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{isLoading ? 'Researching...' : 'Research'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-bar: Research Type Selector & Filter Toggle */}
          <div className="bg-slate-50 border-t border-slate-200/80 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
              <button
                type="button"
                onClick={() => setResearchType('question')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  researchType === 'question' 
                    ? 'bg-white text-[#0f1f38] shadow-2xs border border-slate-200 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ask a legal question</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setResearchType('cases');
                  setDocumentType('cases');
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  researchType === 'cases' 
                    ? 'bg-white text-[#0f1f38] shadow-2xs border border-slate-200 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Find cases</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setResearchType('legislation');
                  setDocumentType('legislation');
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  researchType === 'legislation' 
                    ? 'bg-white text-[#0f1f38] shadow-2xs border border-slate-200 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span>Find legislation</span>
              </button>

              <button
                type="button"
                onClick={() => setResearchType('issue')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  researchType === 'issue' 
                    ? 'bg-white text-[#0f1f38] shadow-2xs border border-slate-200 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileSearch className="w-3.5 h-3.5" />
                <span>Research an issue</span>
              </button>

              <button
                type="button"
                onClick={() => setResearchType('compare')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  researchType === 'compare' 
                    ? 'bg-white text-[#0f1f38] shadow-2xs border border-slate-200 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare authorities</span>
              </button>
            </div>

            {/* Filter Toggle Button */}
            <button
              id="toggle-filters-btn"
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </form>

      {/* Expandable Search Filters Drawer */}
      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              South African Jurisdictional Search Parameters
            </h3>
            <button
              type="button"
              onClick={() => {
                setCourt('All');
                setDateRange('1994_present');
                setAreaOfLaw('All');
                setDocumentType('all');
                setSortBy('hierarchy');
                setAuthorityLevel('all');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Jurisdiction (Default locked to South Africa) */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Jurisdiction</label>
              <input
                type="text"
                value="South Africa (National & Provincial)"
                disabled
                className="w-full bg-slate-50 border border-slate-200 text-slate-600 rounded-md px-3 py-1.5 cursor-not-allowed font-medium"
              />
            </div>

            {/* Court Hierarchy */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Court</label>
              <select
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 rounded-md px-3 py-1.5 focus:outline-none focus:border-[#0f1f38]"
              >
                <option value="All">All South African Courts</option>
                <option value="Constitutional Court">Constitutional Court (Highest Precedent)</option>
                <option value="Supreme Court of Appeal">Supreme Court of Appeal (SCA)</option>
                <option value="High Court">High Courts (All Provincial Divisions)</option>
                <option value="Labour Appeal Court">Labour Appeal Court (LAC)</option>
                <option value="Labour Court">Labour Court (LC)</option>
                <option value="Competition Appeal Court">Competition Appeal Court</option>
                <option value="Land Claims Court">Land Claims Court</option>
              </select>
            </div>

            {/* Area of Law */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Area of Law</label>
              <select
                value={areaOfLaw}
                onChange={(e) => setAreaOfLaw(e.target.value as any)}
                className="w-full bg-white border border-slate-300 text-slate-800 rounded-md px-3 py-1.5 focus:outline-none focus:border-[#0f1f38]"
              >
                <option value="All">All Legal Disciplines</option>
                <option value="Company Law">Company Law (Companies Act 71 of 2008)</option>
                <option value="Labour Law">Labour Law (LRA, BCEA, CCMA)</option>
                <option value="Constitutional Law">Constitutional Law & Bill of Rights</option>
                <option value="Contract & Commercial">Contract & Commercial</option>
                <option value="Administrative Law">Administrative Law (PAJA / Review)</option>
                <option value="Property & Evictions">Property & Evictions (PIE Act)</option>
                <option value="Civil Procedure">Civil Procedure & Interdicts</option>
                <option value="Delict">Delict & Damages</option>
                <option value="Criminal Law">Criminal Law & Criminal Procedure</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 rounded-md px-3 py-1.5 focus:outline-none focus:border-[#0f1f38]"
              >
                <option value="1994_present">1994 – Present (Democratic Era)</option>
                <option value="last_5_years">Last 5 Years (2021 – Present)</option>
                <option value="last_10_years">Last 10 Years (2016 – Present)</option>
                <option value="all">All Available Historical Law Reports</option>
              </select>
            </div>

            {/* Document Type */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="w-full bg-white border border-slate-300 text-slate-800 rounded-md px-3 py-1.5 focus:outline-none focus:border-[#0f1f38]"
              >
                <option value="all">All Legal Sources (Cases + Statutes)</option>
                <option value="cases">Judgments & Court Cases Only</option>
                <option value="legislation">Statutes, Acts & Regulations Only</option>
                <option value="constitution">Constitution of South Africa, 1996</option>
              </select>
            </div>

            {/* Sort Order & Precedent Hierarchy */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-white border border-slate-300 text-slate-800 rounded-md px-3 py-1.5 focus:outline-none focus:border-[#0f1f38]"
              >
                <option value="hierarchy">Precedent Hierarchy (Stare Decisis: CC &gt; SCA &gt; HC)</option>
                <option value="relevance">Relevance to Legal Question</option>
                <option value="date_desc">Date (Newest Decisions First)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Benchmarked Research Queries */}
      <div className="mt-4">
        <div className="flex items-center space-x-1 text-xs text-slate-500 mb-2 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Suggested South African research queries:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUERIES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="text-xs bg-white text-slate-700 hover:text-[#0f1f38] hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 transition-all text-left cursor-pointer shadow-2xs hover:border-slate-300"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
