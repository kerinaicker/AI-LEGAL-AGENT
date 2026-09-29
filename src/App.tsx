import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ResearchSearch } from './components/ResearchSearch';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { ProfessionalResearchView } from './components/ProfessionalResearchView';
import { PublicResearchView } from './components/PublicResearchView';
import { ResearchTrailDrawer } from './components/ResearchTrailDrawer';
import { CaseSearchAndDetail } from './components/CaseSearchAndDetail';
import { LegislationBrowser } from './components/LegislationBrowser';
import { WorkspaceManager } from './components/WorkspaceManager';
import { HistoryView } from './components/HistoryView';
import { ProviderStatusModal } from './components/ProviderStatusModal';
import { SaveToMatterModal } from './components/SaveToMatterModal';
import { 
  ResearchResponse, 
  SearchFilters, 
  UserMode, 
  PipelineStep, 
  LegalDocument 
} from './types/legal';

export default function App() {
  // Navigation & Mode
  const [activeTab, setActiveTab] = useState<'research' | 'cases' | 'legislation' | 'workspace' | 'history'>('research');
  const [userMode, setUserMode] = useState<UserMode>('professional');

  // Search & Pipeline Execution
  const [isLoading, setIsLoading] = useState(false);
  const [currentResearch, setCurrentResearch] = useState<ResearchResponse | null>(null);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Deep Navigation
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Modals & Drawers
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTrailOpen, setIsTrailOpen] = useState(false);
  const [saveModal, setSaveModal] = useState<{
    isOpen: boolean;
    type: 'case' | 'legislation' | 'research';
    item: any;
  }>({
    isOpen: false,
    type: 'case',
    item: null
  });

  // System & Provider Status
  const [isConfigured, setIsConfigured] = useState(false);
  const [geminiAvailable, setGeminiAvailable] = useState(false);

  // History State
  const [history, setHistory] = useState<ResearchResponse[]>([]);

  // Fetch initial system status & restore history
  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setIsConfigured(data.lawsAfricaConfigured);
        setGeminiAvailable(data.geminiAvailable);
      })
      .catch(err => console.warn('Could not fetch status', err));

    try {
      const savedHistory = localStorage.getItem('lexsa_research_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn('Failed to parse local history', e);
    }
  }, []);

  const handleExecuteResearch = async (query: string, filters: SearchFilters) => {
    setIsLoading(true);
    setSearchError(null);

    // Initial dummy steps for live progress display
    const initialSteps: PipelineStep[] = [
      { id: 'step1_issue_identification', stepNumber: 1, label: 'Issue Identification', description: 'Categorizing legal field and applicable South African frameworks', status: 'running', startedAt: new Date().toISOString() },
      { id: 'step2_authority_retrieval', stepNumber: 2, label: 'Authority Retrieval', description: 'Querying LawsAfricaProvider for binding judgments & statutes', status: 'pending' },
      { id: 'step3_authority_classification', stepNumber: 3, label: 'Authority Classification', description: 'Classifying by court level (CC, SCA, HC) and doctrine', status: 'pending' },
      { id: 'step4_authority_ranking', stepNumber: 4, label: 'Authority Ranking', description: 'Applying stare decisis precedent hierarchy', status: 'pending' },
      { id: 'step5_read_sources', stepNumber: 5, label: 'Read Sources', description: 'Synthesizing verified ratio decidendi and statutory sections', status: 'pending' },
      { id: 'step6_contrary_authority_search', stepNumber: 6, label: 'Contrary Authority Search', description: 'Searching for distinguishing precedent & minority holdings', status: 'pending' },
      { id: 'step7_citation_verification_pass', stepNumber: 7, label: 'Citation Verification Pass', description: 'Zero-hallucination verification against indexed law reports', status: 'pending' },
      { id: 'step8_synthesis', stepNumber: 8, label: 'Synthesis', description: 'Synthesizing structured multi-mode outputs', status: 'pending' },
    ];
    setPipelineSteps(initialSteps);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          mode: userMode,
          filters
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.fallbackNotice || 'Research pipeline encountered an unexpected issue.');
      }

      const response: ResearchResponse = await res.json();
      setCurrentResearch(response);
      setPipelineSteps(response.steps);

      // Add to history
      const updatedHistory = [response, ...history.filter(h => h.id !== response.id)].slice(0, 25);
      setHistory(updatedHistory);
      try {
        localStorage.setItem('lexsa_research_history', JSON.stringify(updatedHistory));
      } catch (e) {
        // quota exceeded or private mode
      }
    } catch (err: any) {
      console.error('Research error:', err);
      setSearchError(err.message || 'I could not verify a reliable answer from the legal sources currently available.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCaseFromResearch = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('cases');
  };

  const handleOpenCaseFromLegislation = (caseTitle: string) => {
    setActiveTab('cases');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-amber-100 selection:text-slate-900">
      {/* Global Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'cases') setSelectedCaseId(null);
        }}
        userMode={userMode}
        setUserMode={setUserMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isConfigured={isConfigured}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'research' && (
          <div>
            {/* Search Box */}
            <ResearchSearch
              onSearch={handleExecuteResearch}
              isLoading={isLoading}
              userMode={userMode}
            />

            {/* Error / Strict Anti-Hallucination Fallback Message */}
            {searchError && (
              <div className="max-w-4xl mx-auto my-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium flex items-center space-x-3">
                <span className="font-serif italic font-bold">LexSA Notice:</span>
                <span>{searchError}</span>
              </div>
            )}

            {/* Live 8-Step Research Agent Visualizer */}
            {(isLoading || currentResearch) && (
              <div className="max-w-5xl mx-auto mt-6">
                <PipelineVisualizer
                  steps={currentResearch ? currentResearch.steps : pipelineSteps}
                  isCompleted={!isLoading && Boolean(currentResearch)}
                />
              </div>
            )}

            {/* Dual Structured Output: Professional vs Public Mode */}
            {currentResearch && !isLoading && (
              <div className="max-w-5xl mx-auto mt-6">
                {userMode === 'professional' ? (
                  <ProfessionalResearchView
                    response={currentResearch.professional}
                    query={currentResearch.query}
                    onSelectCase={handleSelectCaseFromResearch}
                    onSaveToWorkspace={() => setSaveModal({
                      isOpen: true,
                      type: 'research',
                      item: {
                        id: currentResearch.id,
                        query: currentResearch.query,
                        summary: currentResearch.professional.researchAnswer
                      }
                    })}
                    onOpenTrail={() => setIsTrailOpen(true)}
                  />
                ) : (
                  <PublicResearchView
                    response={currentResearch.public}
                    query={currentResearch.query}
                    onSaveToWorkspace={() => setSaveModal({
                      isOpen: true,
                      type: 'research',
                      item: {
                        id: currentResearch.id,
                        query: currentResearch.query,
                        summary: currentResearch.public.shortAnswer
                      }
                    })}
                    onOpenTrail={() => setIsTrailOpen(true)}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Cases Explorer & Case Intelligence Detail View */}
        {activeTab === 'cases' && (
          <CaseSearchAndDetail
            initialCaseId={selectedCaseId}
            onClearInitialCase={() => setSelectedCaseId(null)}
            onSaveCaseToMatter={(caseDoc) => setSaveModal({
              isOpen: true,
              type: 'case',
              item: {
                id: caseDoc.id,
                title: caseDoc.metadata.title,
                citation: caseDoc.metadata.citation
              }
            })}
          />
        )}

        {/* Legislation Browser & Section Navigator */}
        {activeTab === 'legislation' && (
          <LegislationBrowser
            onSaveLegislationToMatter={(actTitle, sectionNumber) => setSaveModal({
              isOpen: true,
              type: 'legislation',
              item: {
                actId: 'act-saved',
                actTitle,
                sectionNumber
              }
            })}
            onOpenCaseFromLegislation={handleOpenCaseFromLegislation}
          />
        )}

        {/* Workspace Manager ("My Research") */}
        {activeTab === 'workspace' && (
          <WorkspaceManager
            onOpenCase={(caseId) => {
              setSelectedCaseId(caseId);
              setActiveTab('cases');
            }}
          />
        )}

        {/* History View */}
        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onSelectHistoryItem={(item) => {
              setCurrentResearch(item);
              setActiveTab('research');
            }}
            onClearHistory={() => {
              setHistory([]);
              localStorage.removeItem('lexsa_research_history');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-slate-800">LexSA AI</span>
            <span>•</span>
            <span>Zero-Hallucination South African Legal Research Assistant</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-mono text-[11px] text-slate-400">Jurisdiction: South Africa</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-slate-600 hover:text-slate-900 underline cursor-pointer"
            >
              Source Provider Status
            </button>
          </div>
        </div>
      </footer>

      {/* Research Trail Drawer */}
      {currentResearch && (
        <ResearchTrailDrawer
          isOpen={isTrailOpen}
          onClose={() => setIsTrailOpen(false)}
          trail={currentResearch.trail}
        />
      )}

      {/* Provider Status Modal */}
      <ProviderStatusModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isConfigured={isConfigured}
        geminiAvailable={geminiAvailable}
      />

      {/* Save to Matter Modal */}
      <SaveToMatterModal
        isOpen={saveModal.isOpen}
        onClose={() => setSaveModal({ isOpen: false, type: 'case', item: null })}
        itemType={saveModal.type}
        item={saveModal.item}
        onSavedSuccess={() => {}}
      />
    </div>
  );
}
