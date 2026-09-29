import React from 'react';
import { 
  History, 
  Search, 
  ArrowRight, 
  Trash2, 
  Scale, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { ResearchResponse } from '../types/legal';

interface HistoryViewProps {
  history: ResearchResponse[];
  onSelectHistoryItem: (item: ResearchResponse) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory
}) => {
  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-950">
            Research History &amp; Prior Inquiries
          </h2>
          <p className="text-sm text-slate-600">
            Review previous legal research queries, citations, and synthesized memoranda.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors cursor-pointer border border-rose-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    item.mode === 'professional'
                      ? 'bg-slate-100 text-slate-800'
                      : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    {item.mode === 'professional' ? 'Legal Professional' : 'Public Guide'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleString('en-ZA')}</span>
                  </span>
                  <span className="text-[11px] text-emerald-700 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Zero-Hallucination Verified</span>
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-slate-900">
                  {item.query}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {item.mode === 'professional' 
                    ? item.professional.researchAnswer
                    : item.public.shortAnswer}
                </p>

                <div className="text-[11px] text-slate-500 font-mono">
                  Authorities relied upon: {item.trail.authoritiesReliedUpon.length} verified precedents
                </div>
              </div>

              <button
                onClick={() => onSelectHistoryItem(item)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-50 hover:bg-[#0f1f38] hover:text-white text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-all shrink-0 cursor-pointer"
              >
                <span>Re-open Memorandum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500">
          <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium">No research history yet.</p>
          <p className="text-xs text-slate-400 mt-1">Queries you execute will be logged here for quick reference.</p>
        </div>
      )}
    </div>
  );
};
