import React from 'react';
import { 
  Scale, 
  Search, 
  BookOpen, 
  ScrollText, 
  Briefcase, 
  History, 
  ShieldCheck, 
  Sliders, 
  User, 
  AlertTriangle 
} from 'lucide-react';
import { UserMode } from '../types/legal';

interface HeaderProps {
  activeTab: 'research' | 'cases' | 'legislation' | 'workspace' | 'history';
  setActiveTab: (tab: 'research' | 'cases' | 'legislation' | 'workspace' | 'history') => void;
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  onOpenSettings: () => void;
  isConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userMode,
  setUserMode,
  onOpenSettings,
  isConfigured
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      {/* Top Banner Notice if in Demo Data Mode */}
      {!isConfigured && (
        <div className="bg-amber-50 border-b border-amber-200/60 px-4 py-1 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-2 max-w-5xl mx-auto w-full">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold bg-amber-200 text-amber-900 tracking-wider">
              DEMO DATA — NOT LEGAL AUTHORITY
            </span>
            <span>Legal database connection has not yet been configured. Showing verified precedent benchmarks.</span>
          </div>
          <button 
            onClick={onOpenSettings}
            className="text-xs text-amber-800 underline hover:text-amber-950 font-medium shrink-0 ml-4 cursor-pointer"
          >
            Provider Status
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setActiveTab('research')}
              className="flex items-center space-x-3 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-[#0f1f38] flex items-center justify-center text-amber-400 shadow-sm group-hover:bg-[#162c4e] transition-colors">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif font-bold text-lg text-slate-950 tracking-tight">LEXSA</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300/80 uppercase tracking-wider">
                    AI
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                  South African Legal Research
                </p>
              </div>
            </button>

            {/* Primary Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                id="nav-research-btn"
                onClick={() => setActiveTab('research')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'research'
                    ? 'bg-slate-100 text-slate-900 font-semibold border-b-2 border-[#0f1f38]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Research</span>
              </button>

              <button
                id="nav-cases-btn"
                onClick={() => setActiveTab('cases')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'cases'
                    ? 'bg-slate-100 text-slate-900 font-semibold border-b-2 border-[#0f1f38]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Cases</span>
              </button>

              <button
                id="nav-legislation-btn"
                onClick={() => setActiveTab('legislation')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'legislation'
                    ? 'bg-slate-100 text-slate-900 font-semibold border-b-2 border-[#0f1f38]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ScrollText className="w-4 h-4" />
                <span>Legislation</span>
              </button>

              <button
                id="nav-workspace-btn"
                onClick={() => setActiveTab('workspace')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'workspace'
                    ? 'bg-slate-100 text-slate-900 font-semibold border-b-2 border-[#0f1f38]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>My Research</span>
              </button>

              <button
                id="nav-history-btn"
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-slate-100 text-slate-900 font-semibold border-b-2 border-[#0f1f38]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </button>
            </nav>
          </div>

          {/* Right Controls: Mode Toggle & Status */}
          <div className="flex items-center space-x-4">
            {/* User Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                id="mode-professional-btn"
                onClick={() => setUserMode('professional')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  userMode === 'professional'
                    ? 'bg-white text-[#0f1f38] shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Detailed legal authorities, case citations, statutory provisions, and doctrinal analysis"
              >
                Legal Professional
              </button>
              <button
                id="mode-public-btn"
                onClick={() => setUserMode('public')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  userMode === 'public'
                    ? 'bg-white text-[#0f1f38] shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Plain English explanation, accessible legal rights, and practical implications"
              >
                Understand the Law (Public)
              </button>
            </div>

            {/* Zero-Hallucination Status Pill */}
            <button
              onClick={onOpenSettings}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium hover:bg-emerald-100/70 transition-colors cursor-pointer"
              title="Click to view Source Provider & Verification Status"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Hallucination Active</span>
            </button>

            {/* Provider & Profile Settings */}
            <button
              id="header-settings-btn"
              onClick={onOpenSettings}
              className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="System Settings & Legal Source Status"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
