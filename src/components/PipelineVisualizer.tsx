import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown, 
  ShieldCheck, 
  Database, 
  Layers, 
  Scale, 
  BookOpenCheck, 
  GitFork, 
  FileCheck2, 
  Cpu 
} from 'lucide-react';
import { PipelineStep, PipelineStepId } from '../types/legal';

interface PipelineVisualizerProps {
  steps: PipelineStep[];
  isCompleted: boolean;
  activeStepId?: PipelineStepId;
}

const STEP_ICONS: Record<PipelineStepId, React.FC<{ className?: string }>> = {
  step1_issue_identification: Layers,
  step2_authority_retrieval: Database,
  step3_authority_classification: Scale,
  step4_authority_ranking: BookOpenCheck,
  step5_read_sources: BookOpenCheck,
  step6_contrary_authority_search: GitFork,
  step7_citation_verification_pass: ShieldCheck,
  step8_synthesis: Cpu,
};

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  steps,
  isCompleted
}) => {
  const [expandedStep, setExpandedStep] = useState<PipelineStepId | null>(null);

  const toggleStep = (id: PipelineStepId) => {
    setExpandedStep(expandedStep === id ? null : id);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 mb-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              8-Step Research Agent Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Zero-Hallucination verification architecture with authoritative South African law reports
            </p>
          </div>
        </div>

        {isCompleted && (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified &amp; Synthesized</span>
          </span>
        )}
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {steps.map((step) => {
          const Icon = STEP_ICONS[step.id] || Layers;
          const isExpanded = expandedStep === step.id;

          let statusBg = 'bg-slate-50 border-slate-200 text-slate-500';
          let iconColor = 'text-slate-400';

          if (step.status === 'running') {
            statusBg = 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse';
            iconColor = 'text-amber-600';
          } else if (step.status === 'completed') {
            statusBg = 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800';
            iconColor = 'text-[#0f1f38]';
          } else if (step.status === 'failed') {
            statusBg = 'bg-rose-50 border-rose-300 text-rose-900';
            iconColor = 'text-rose-600';
          }

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => toggleStep(step.id)}
              className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all cursor-pointer ${statusBg} ${
                isExpanded ? 'ring-2 ring-[#0f1f38] border-transparent' : ''
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  0{step.stepNumber}
                </span>
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : step.status === 'running' ? (
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                )}
              </div>

              <div className="flex items-center space-x-1.5 mb-1">
                <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {step.label}
                </span>
              </div>

              <p className="text-[10px] text-slate-500 line-clamp-1">
                {step.durationMs ? `${step.durationMs}ms` : step.status}
              </p>
            </button>
          );
        })}
      </div>

      {/* Expanded Step Detail Viewer */}
      {expandedStep && (
        <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs animate-in fade-in duration-150">
          {(() => {
            const step = steps.find(s => s.id === expandedStep);
            if (!step) return null;

            return (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-500">
                      Step {step.stepNumber}: {step.label}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-600">{step.description}</span>
                  </div>
                  <button
                    onClick={() => setExpandedStep(null)}
                    className="text-slate-400 hover:text-slate-700 underline text-[11px] cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="bg-white p-3 rounded-md border border-slate-200 mb-2">
                  <p className="font-medium text-slate-800 mb-1">{step.summary}</p>
                  {step.durationMs && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      Execution time: {step.durationMs}ms
                    </span>
                  )}
                </div>

                {step.details && (
                  <div className="bg-slate-900 text-slate-200 p-3 rounded-md font-mono text-[11px] max-h-48 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(step.details, null, 2)}</pre>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
