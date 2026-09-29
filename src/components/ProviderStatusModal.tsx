import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  Server, 
  Lock, 
  ExternalLink 
} from 'lucide-react';

interface ProviderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConfigured: boolean;
  geminiAvailable: boolean;
}

export const ProviderStatusModal: React.FC<ProviderStatusModalProps> = ({
  isOpen,
  onClose,
  isConfigured,
  geminiAvailable
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Server className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base tracking-tight">Legal Source Provider &amp; System Status</h3>
              <p className="text-[11px] text-slate-400">LexSA AI High-Assurance Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
          {/* Provider 1: Laws.Africa */}
          <div className={`p-4 rounded-xl border ${
            isConfigured 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-amber-50/70 border-amber-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Database className={`w-4 h-4 ${isConfigured ? 'text-emerald-700' : 'text-amber-700'}`} />
                <span className="font-bold text-sm text-slate-900">Laws.Africa Legal Database API</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider ${
                isConfigured 
                  ? 'bg-emerald-200 text-emerald-900' 
                  : 'bg-amber-200 text-amber-900'
              }`}>
                {isConfigured ? 'CONNECTED' : 'DEMO DATA — NOT LEGAL AUTHORITY'}
              </span>
            </div>

            <p className="leading-relaxed mb-2 text-slate-800">
              {isConfigured ? (
                'Live production integration configured via LAWS_AFRICA_API_TOKEN. Direct access to gazetted legislation, parliamentary acts, and superior court jurisprudence.'
              ) : (
                'Legal database connection has not yet been configured. Using verified South African benchmark jurisprudence tagged DEMO DATA — NOT LEGAL AUTHORITY to guarantee zero downtime and accurate doctrinal testing.'
              )}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Config variable: LAWS_AFRICA_API_TOKEN in project environment settings.
            </p>
          </div>

          {/* Provider 2: SAFLII Source Policy */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-rose-700" />
                <span className="font-bold text-sm text-slate-900">SAFLII Source Status</span>
              </div>
              <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-rose-200 text-rose-900 tracking-wider">
                SAFLII — Integration pending source permission
              </span>
            </div>
            <p className="text-rose-900 leading-relaxed font-medium">
              Source Restrictions: SAFLII integration is intentionally disabled pending written permission. The system strictly complies with source authorization terms and does NOT scrape or retrieve unauthorized records from saflii.org.
            </p>
          </div>

          {/* Provider 3: Zero-Hallucination Guard */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-sm text-slate-900">Strict Zero-Hallucination Pipeline</span>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                ACTIVE &amp; ENFORCED
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-2">
              Every legal proposition requires a verifiable source. The automated 8-step pipeline executes citation verification passes against authenticated law reports (SALR, BCLR, SCA, CC). Unverified propositions are rejected.
            </p>
            <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px] text-slate-600">
              Zero-Hallucination Fallback Rule: "I could not verify a reliable answer from the legal sources currently available."
            </div>
          </div>

          {/* Provider 4: Gemini AI Intelligence */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-[#0f1f38]" />
                <span className="font-bold text-sm text-slate-900">AI Synthesis Engine</span>
              </div>
              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                geminiAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {geminiAvailable ? 'Gemini Flash Active' : 'Deterministic Mode'}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Synthesizes doctrinal reasoning strictly bounded to verified retrieved excerpts. Never hallucinates citations or obiter dicta.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0f1f38] text-white rounded-md text-xs font-semibold hover:bg-[#162c4e] transition-colors cursor-pointer"
          >
            Close Status
          </button>
        </div>
      </div>
    </div>
  );
};
