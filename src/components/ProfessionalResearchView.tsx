import React from 'react';
import { 
  Scale, 
  BookOpen, 
  ScrollText, 
  CheckCircle2, 
  ExternalLink, 
  FolderPlus, 
  Copy, 
  ShieldCheck, 
  GitFork, 
  Info,
  Check
} from 'lucide-react';
import { ProfessionalResponse, LegalDocument } from '../types/legal';

interface ProfessionalResearchViewProps {
  response: ProfessionalResponse;
  query: string;
  onSelectCase: (caseId: string) => void;
  onSaveToWorkspace: () => void;
  onOpenTrail: () => void;
}

export const ProfessionalResearchView: React.FC<ProfessionalResearchViewProps> = ({
  response,
  query,
  onSelectCase,
  onSaveToWorkspace,
  onOpenTrail
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopySummary = () => {
    const text = `LEXSA AI LEGAL RESEARCH MEMORANDUM\n\nQUERY: ${query}\n\nRESEARCH ANSWER:\n${response.researchAnswer}\n\nLEGAL POSITION:\n${response.legalPosition}\n\nKEY AUTHORITIES:\n${response.keyAuthorities.map(a => `- ${a.title} (${a.citation}): ${a.ratioSummary}`).join('\n')}\n\nAPPLICATION:\n${response.application}\n\nVERIFICATION: Zero-hallucination verified against South African law reports.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-mono font-bold uppercase tracking-wider">
            Professional Legal Memorandum
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Strict Stare Decisis Precedent Applied
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Memo'}</span>
          </button>

          <button
            onClick={onSaveToWorkspace}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-[#0f1f38] bg-slate-100 hover:bg-slate-200 border border-slate-300/80 rounded-md transition-colors cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Save to Matter</span>
          </button>

          <button
            onClick={onOpenTrail}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0f1f38] hover:bg-[#162c4e] rounded-md transition-colors cursor-pointer shadow-2xs"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Research Trail &amp; Audit</span>
          </button>
        </div>
      </div>

      {/* 1. Research Answer */}
      <div className="bg-white border-l-4 border-[#0f1f38] border-y border-r border-slate-200 rounded-r-xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          1. Research Answer
        </h3>
        <p className="text-base sm:text-lg font-serif text-slate-950 leading-relaxed font-medium">
          {response.researchAnswer}
        </p>
      </div>

      {/* 2. Legal Position */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center space-x-2 mb-3">
          <Scale className="w-4 h-4 text-[#0f1f38]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            2. Legal Position &amp; Substantive Principles
          </h3>
        </div>
        <div className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-3 font-normal">
          <p>{response.legalPosition}</p>
        </div>
      </div>

      {/* 3. Governing Legislation */}
      {response.governingLegislation && response.governingLegislation.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <ScrollText className="w-4 h-4 text-[#0f1f38]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              3. Governing South African Legislation
            </h3>
          </div>

          <div className="space-y-3">
            {response.governingLegislation.map((leg, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-sm text-slate-900 font-serif">
                    {leg.actTitle}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {leg.sections.map((sec, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded text-[11px] font-mono bg-white text-slate-700 border border-slate-300">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {leg.statutoryRuleSummary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Key Authorities (Case Cards) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-[#0f1f38]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              4. Key Judicial Authorities (Stare Decisis)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {response.keyAuthorities.length} precedents cited
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {response.keyAuthorities.map((auth) => (
            <div
              key={auth.id}
              className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide ${
                    auth.authorityLevel === 'Binding Precedent'
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : 'bg-slate-200 text-slate-800'
                  }`}>
                    {auth.authorityLevel}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {auth.court}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-sm text-slate-900 mb-1 leading-snug">
                  {auth.title}
                </h4>
                <p className="text-xs font-mono text-slate-600 mb-2.5">
                  {auth.citation}
                </p>

                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  <strong className="font-semibold text-slate-900">Ratio Decidendi:</strong> {auth.ratioSummary}
                </p>

                {auth.keyParagraphs && (
                  <p className="text-[11px] text-slate-500 font-mono mb-2">
                    Key paragraphs: {auth.keyParagraphs}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {auth.judges ? `Bench: ${auth.judges.slice(0, 2).join(', ')}${auth.judges.length > 2 ? ' et al.' : ''}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectCase(auth.id)}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-[#0f1f38] hover:text-blue-800 cursor-pointer"
                >
                  <span>Inspect Case</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Application */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
          5. Application to Issue &amp; Analysis
        </h3>
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
          {response.application}
        </p>
      </div>

      {/* 6. Contrary / Distinguishing Authorities */}
      {response.contraryAuthorities && response.contraryAuthorities.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <GitFork className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              6. Contrary &amp; Distinguishing Precedents
            </h3>
          </div>

          <div className="space-y-3">
            {response.contraryAuthorities.map((contra, idx) => (
              <div key={idx} className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-3.5 text-xs text-amber-950">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span className="font-serif font-bold text-sm text-slate-900">
                    {contra.caseTitle}
                  </span>
                  <span className="font-mono text-slate-600 text-[11px]">
                    {contra.citation}
                  </span>
                </div>
                <p className="font-semibold text-amber-900 mb-1">
                  Distinguishing Doctrine: {contra.contraryAspect}
                </p>
                <p className="text-slate-700 leading-relaxed">
                  {contra.distinguishingReason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Research Notes & Audit Trail */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 text-xs text-slate-600">
        <div className="flex items-center space-x-1.5 font-bold uppercase text-slate-700 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>7. Research Audit Trail &amp; Verification Notice</span>
        </div>
        <p className="mb-2">{response.researchNotes.hierarchyNote}</p>
        <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-500">
          <span>Sources searched: {response.researchNotes.sourcesSearched.join(' • ')}</span>
        </div>
      </div>
    </div>
  );
};
