import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  Filter, 
  ChevronRight, 
  Scale, 
  FileText, 
  FolderPlus, 
  AlertCircle, 
  Calendar, 
  Users, 
  Copy, 
  Check, 
  ArrowLeft,
  X
} from 'lucide-react';
import { LegalDocument } from '../types/legal';

interface CaseSearchAndDetailProps {
  initialCaseId?: string | null;
  onClearInitialCase?: () => void;
  onSaveCaseToMatter: (caseDoc: LegalDocument) => void;
}

export const CaseSearchAndDetail: React.FC<CaseSearchAndDetailProps> = ({
  initialCaseId,
  onClearInitialCase,
  onSaveCaseToMatter
}) => {
  const [cases, setCases] = useState<LegalDocument[]>([]);
  const [selectedCase, setSelectedCase] = useState<LegalDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [courtFilter, setCourtFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'judgment' | 'principles' | 'authorities' | 'legislation' | 'history'>('overview');
  const [copiedParagraph, setCopiedParagraph] = useState<number | null>(null);

  // Fetch cases from backend
  useEffect(() => {
    fetchCases();
  }, [courtFilter, areaFilter]);

  useEffect(() => {
    if (initialCaseId) {
      fetchCaseById(initialCaseId);
    }
  }, [initialCaseId]);

  const fetchCases = async () => {
    try {
      let url = '/api/sources/cases?';
      if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}&`;
      if (courtFilter !== 'All') url += `court=${encodeURIComponent(courtFilter)}&`;
      if (areaFilter !== 'All') url += `areaOfLaw=${encodeURIComponent(areaFilter)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.documents) {
        setCases(data.documents);
      }
    } catch (err) {
      console.error('Failed to load cases', err);
    }
  };

  const fetchCaseById = async (id: string) => {
    try {
      const res = await fetch(`/api/sources/cases/${id}`);
      if (res.ok) {
        const doc = await res.json();
        setSelectedCase(doc);
      }
    } catch (err) {
      console.error('Failed to fetch case detail', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCases();
  };

  const copyExcerpt = (para: number, text: string) => {
    if (!selectedCase) return;
    const formatted = `"${text}" — ${selectedCase.metadata.title} ${selectedCase.metadata.citation} at [${para}]`;
    navigator.clipboard.writeText(formatted);
    setCopiedParagraph(para);
    setTimeout(() => setCopiedParagraph(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6">
      {/* If a case is selected, show Case Intelligence Detail View */}
      {selectedCase ? (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          {/* Top Bar */}
          <div className="bg-slate-900 text-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <button
                onClick={() => {
                  setSelectedCase(null);
                  if (onClearInitialCase) onClearInitialCase();
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Case Search</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSaveCaseToMatter(selectedCase)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer border border-white/20"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Save to Matter</span>
                </button>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2 leading-snug">
              {selectedCase.metadata.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono">
              <span className="bg-slate-800 px-2.5 py-1 rounded text-amber-300 border border-slate-700">
                {selectedCase.metadata.citation}
              </span>
              <span>{selectedCase.metadata.court}</span>
              <span>•</span>
              <span>{new Date(selectedCase.metadata.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>•</span>
              <span className="font-sans px-2 py-0.5 rounded bg-blue-900/80 text-blue-200">
                {selectedCase.metadata.areaOfLaw}
              </span>
            </div>

            {selectedCase.judges && selectedCase.judges.length > 0 && (
              <p className="text-xs text-slate-300 mt-2.5 font-sans">
                <span className="font-medium text-slate-400">Presiding Bench: </span>
                {selectedCase.judges.join(', ')}
              </p>
            )}
          </div>

          {/* AI Summary Disclaimer Notice (MANDATORY LABEL) */}
          <div className="bg-amber-50 border-y border-amber-200 px-6 py-2.5 flex items-center space-x-2 text-xs text-amber-900 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>AI research summary — verify against the judgment before relying on it.</span>
          </div>

          {/* Navigation Tabs (6 Tabs) */}
          <div className="border-b border-slate-200 px-6 bg-slate-50 flex flex-wrap gap-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'judgment', label: 'Judgment Excerpts' },
              { id: 'principles', label: 'Legal Principles' },
              { id: 'authorities', label: 'Authorities Cited' },
              { id: 'legislation', label: 'Legislation Cited' },
              { id: 'history', label: 'Case History' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#0f1f38] text-[#0f1f38] bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 sm:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6 text-sm text-slate-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Material Facts
                  </h3>
                  <p className="leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                    {selectedCase.factsSummary || 'Facts not available in summary digest.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Legal Issues for Determination
                  </h3>
                  <ul className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200 list-disc pl-5">
                    {selectedCase.issues?.map((issue, idx) => (
                      <li key={idx} className="leading-relaxed">{issue}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Decision &amp; Finding
                  </h3>
                  <p className="leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200 font-medium text-slate-900">
                    {selectedCase.decision}
                  </p>
                </div>

                {selectedCase.order && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Court Order
                    </h3>
                    <div className="bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-lg whitespace-pre-wrap">
                      {selectedCase.order}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'judgment' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-500">
                    Verbatim judgment paragraphs with verified paragraph citations:
                  </p>
                </div>

                {selectedCase.judgmentExcerpts && selectedCase.judgmentExcerpts.length > 0 ? (
                  selectedCase.judgmentExcerpts.map((excerpt) => (
                    <div 
                      key={excerpt.paragraph}
                      className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-[#0f1f38] bg-slate-200 px-2 py-0.5 rounded">
                          Paragraph [{excerpt.paragraph}]
                        </span>
                        <div className="flex items-center space-x-2">
                          {excerpt.speaker && (
                            <span className="text-xs text-slate-500 italic">
                              Per {excerpt.speaker}
                            </span>
                          )}
                          <button
                            onClick={() => copyExcerpt(excerpt.paragraph, excerpt.text)}
                            className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded cursor-pointer"
                          >
                            {copiedParagraph === excerpt.paragraph ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedParagraph === excerpt.paragraph ? 'Copied' : 'Copy Quote'}</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-serif text-slate-900 leading-relaxed italic pl-3 border-l-2 border-slate-300">
                        "{excerpt.text}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Full judgment transcripts are being indexed.</p>
                )}
              </div>
            )}

            {activeTab === 'principles' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f1f38] mb-2 flex items-center space-x-1.5">
                    <Scale className="w-4 h-4" />
                    <span>Ratio Decidendi (Binding Legal Principles)</span>
                  </h3>
                  <div className="space-y-2.5">
                    {selectedCase.ratioDecidendi?.map((ratio, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 text-sm text-slate-900 leading-relaxed">
                        {ratio}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedCase.obiterDicta && selectedCase.obiterDicta.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Obiter Dicta (Persuasive Judicial Remarks)
                    </h3>
                    <div className="space-y-2.5">
                      {selectedCase.obiterDicta.map((obiter, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed italic">
                          {obiter}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'authorities' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Precedent Authorities Cited in Judgment
                </h3>
                {selectedCase.authoritiesCited?.map((auth, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-4 text-xs">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-slate-900">{auth.caseTitle}</h4>
                      <p className="font-mono text-slate-600 mb-1">{auth.citation}</p>
                      {auth.relevantParagraphs && (
                        <p className="text-slate-500">{auth.relevantParagraphs}</p>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-slate-200 text-slate-800 shrink-0">
                      {auth.treatment}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'legislation' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Statutes &amp; Constitutional Provisions Interpreted
                </h3>
                {selectedCase.legislationCited?.map((leg, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-sm text-slate-900">{leg.actTitle}</span>
                    <span className="font-mono bg-white px-2.5 py-1 rounded border border-slate-300 text-slate-700">
                      {leg.section}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Appellate Path &amp; Procedural History
                </h3>
                <div className="relative pl-6 border-l-2 border-slate-300 space-y-4">
                  {selectedCase.caseHistory?.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#0f1f38] border-2 border-white" />
                      <p className="text-xs sm:text-sm font-medium text-slate-800">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Case List Search View */
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-slate-950 mb-1">
              South African Case Law Search
            </h2>
            <p className="text-sm text-slate-600">
              Browse and search judgments from the Constitutional Court, Supreme Court of Appeal, and High Courts.
            </p>
          </div>

          {/* Search Bar & Filters */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case name, citation, legal question or judge..."
                className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f1f38]"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={courtFilter}
                onChange={(e) => setCourtFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#0f1f38]"
              >
                <option value="All">All Courts</option>
                <option value="Constitutional Court">Constitutional Court</option>
                <option value="Supreme Court of Appeal">Supreme Court of Appeal</option>
                <option value="High Court">High Court</option>
                <option value="Appellate Division">Appellate Division</option>
              </select>

              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#0f1f38]"
              >
                <option value="All">All Areas of Law</option>
                <option value="Company Law">Company Law</option>
                <option value="Labour Law">Labour Law</option>
                <option value="Constitutional Law">Constitutional Law</option>
                <option value="Contract & Commercial">Contract & Commercial</option>
                <option value="Administrative Law">Administrative Law</option>
                <option value="Civil Procedure">Civil Procedure</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-[#0f1f38] text-white rounded-lg text-xs font-semibold hover:bg-[#162c4e] transition-colors cursor-pointer shrink-0"
              >
                Filter
              </button>
            </div>
          </form>

          {/* Cases List */}
          <div className="space-y-4">
            {cases.length > 0 ? (
              cases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {c.metadata.citation}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 font-medium">{c.metadata.court}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                        {c.metadata.areaOfLaw}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-base sm:text-lg text-slate-950 mb-2 leading-snug">
                    {c.metadata.title}
                  </h3>

                  <p className="text-xs text-slate-700 line-clamp-2 mb-3 leading-relaxed">
                    <strong className="text-slate-900">Ratio: </strong>
                    {(c.ratioDecidendi && c.ratioDecidendi[0]) || c.factsSummary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span>
                      {c.judges ? `Bench: ${c.judges.slice(0, 3).join(', ')}` : ''}
                    </span>
                    <span className="font-semibold text-[#0f1f38] flex items-center space-x-1">
                      <span>View Case Intelligence</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
                No cases found matching your criteria.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
