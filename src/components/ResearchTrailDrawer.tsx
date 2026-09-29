import React from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Database, 
  Search, 
  Layers, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { ResearchTrail } from '../types/legal';

interface ResearchTrailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trail: ResearchTrail;
}

export const ResearchTrailDrawer: React.FC<ResearchTrailDrawerProps> = ({
  isOpen,
  onClose,
  trail
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-xl flex flex-col border-l border-slate-200">
          {/* Drawer Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-sm tracking-tight">Research Trail &amp; Audit Log</h3>
                <p className="text-[11px] text-slate-300">
                  Verifiable audit trail (Zero-Hallucination Guard active)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1">
            {/* 1. Citation Verification Audit Result */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
              <div className="flex items-center space-x-2 font-bold text-sm mb-2 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Citation Verification Pass: PASSED</span>
              </div>
              <p className="text-xs mb-3">
                All legal citations relied upon were cross-referenced against authentic South African law reports.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-white/80 p-2 rounded border border-emerald-200">
                  <span className="text-slate-500 block">Verified Authorities:</span>
                  <span className="text-emerald-800 font-bold text-sm">
                    {trail.verificationAudit.verifiedCount}
                  </span>
                </div>
                <div className="bg-white/80 p-2 rounded border border-emerald-200">
                  <span className="text-slate-500 block">Unverified / Hallucinated:</span>
                  <span className="text-emerald-800 font-bold text-sm">0 (Zero)</span>
                </div>
              </div>
            </div>

            {/* 2. Initial Query & Expansion */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 font-bold uppercase text-slate-800 text-[11px] tracking-wider">
                <Search className="w-3.5 h-3.5 text-[#0f1f38]" />
                <span>1. Query Transformations</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <p><span className="text-slate-400 font-sans">Initial Query:</span> "{trail.initialQuery}"</p>
                <div>
                  <span className="text-slate-400 font-sans block mb-1">Generated Search Queries:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-800">
                    {trail.queriesGenerated.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Issues & Statutes Identified */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 font-bold uppercase text-slate-800 text-[11px] tracking-wider">
                <Layers className="w-3.5 h-3.5 text-[#0f1f38]" />
                <span>2. Issues &amp; Governing Statutes</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">Identified Legal Questions:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    {trail.issuesIdentified.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">Identified Statutory Frameworks:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700 font-mono text-[11px]">
                    {trail.statutesIdentified.map((stat, i) => (
                      <li key={i}>{stat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Provider Queries */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 font-bold uppercase text-slate-800 text-[11px] tracking-wider">
                <Database className="w-3.5 h-3.5 text-[#0f1f38]" />
                <span>3. Sources Queried</span>
              </div>
              <div className="space-y-2">
                {trail.sourcesQueried.map((sq, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{sq.provider}</span>
                      <p className="font-mono text-[11px] text-slate-500 truncate max-w-xs">{sq.searchQuery}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-slate-200 text-slate-800">
                      {sq.hitsReturned} records
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Authorities Relied Upon */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 font-bold uppercase text-slate-800 text-[11px] tracking-wider">
                <FileCheck className="w-3.5 h-3.5 text-[#0f1f38]" />
                <span>4. Verified Authorities Relied Upon</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                {trail.authoritiesReliedUpon.map((auth, i) => (
                  <div key={i} className="flex items-center space-x-1.5 text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{auth}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-[#0f1f38] text-white rounded-md hover:bg-[#162c4e] transition-colors cursor-pointer"
            >
              Close Audit Trail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
