import React from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  FolderPlus, 
  Copy, 
  Check, 
  Info 
} from 'lucide-react';
import { PublicResponse } from '../types/legal';

interface PublicResearchViewProps {
  response: PublicResponse;
  query: string;
  onSaveToWorkspace: () => void;
  onOpenTrail: () => void;
}

export const PublicResearchView: React.FC<PublicResearchViewProps> = ({
  response,
  query,
  onSaveToWorkspace,
  onOpenTrail
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = `LEXSA LEGAL RESEARCH (PUBLIC GUIDE)\n\nQUESTION: ${query}\n\nSHORT ANSWER:\n${response.shortAnswer}\n\nWHAT THE LAW SAYS:\n${response.whatTheLawSays}\n\nWHY:\n${response.why}\n\nWHAT THIS COULD MEAN FOR YOU:\n${response.whatThisCouldMean.map(m => `• ${m}`).join('\n')}\n\nWHEN LEGAL HELP MAY BE USEFUL:\n${response.whenLegalHelpMayBeUseful.map(h => `• ${h}`).join('\n')}\n\nNOTICE: ${response.publicDisclaimerNotice}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-semibold">
            Plain English Legal Guide
          </span>
          <span className="text-xs text-slate-500">
            Clear, accessible South African legal rights
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Guide'}</span>
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
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Research Trail</span>
          </button>
        </div>
      </div>

      {/* 1. Short Answer */}
      <div className="bg-white border-l-4 border-emerald-600 border-y border-r border-slate-200 rounded-r-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Short Answer</span>
        </div>
        <p className="text-base sm:text-lg text-slate-900 leading-relaxed font-medium">
          {response.shortAnswer}
        </p>
      </div>

      {/* 2. What the Law Says */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2.5 flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-[#0f1f38]" />
          <span>What the Law Says</span>
        </h3>
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
          {response.whatTheLawSays}
        </p>
      </div>

      {/* 3. Why the Rule Exists */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2.5 flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Why This Rule Exists in South Africa</span>
        </h3>
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
          {response.why}
        </p>
      </div>

      {/* 4. Legal Sources (Simplified) */}
      {response.legalSources && response.legalSources.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
            Legal Sources Behind This Answer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {response.legalSources.map((src, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs">
                <h4 className="font-bold text-slate-900 mb-1">{src.name}</h4>
                <p className="font-mono text-[11px] text-slate-500 mb-2">{src.citation}</p>
                <p className="text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900">Why it matters:</span> {src.whyItMatters}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. What This Could Mean for You */}
      {response.whatThisCouldMean && response.whatThisCouldMean.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
            What This Could Mean for You
          </h3>
          <ul className="space-y-2.5 text-sm text-slate-800">
            {response.whatThisCouldMean.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0f1f38] mt-2 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. When Legal Help May Be Useful */}
      {response.whenLegalHelpMayBeUseful && response.whenLegalHelpMayBeUseful.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-950 mb-3 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>When Consulting a Legal Practitioner May Be Useful</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-amber-950">
            {response.whenLegalHelpMayBeUseful.map((help, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-2 shrink-0" />
                <span className="leading-relaxed">{help}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Single Unobtrusive Public Legal Notice */}
      <div className="p-4 rounded-lg bg-slate-100/90 border border-slate-200 text-xs text-slate-600 text-center">
        <p>{response.publicDisclaimerNotice}</p>
      </div>
    </div>
  );
};
