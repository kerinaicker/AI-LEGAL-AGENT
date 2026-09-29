import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FolderPlus, 
  BookOpen, 
  ScrollText, 
  FileText, 
  StickyNote, 
  Download, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ChevronRight,
  Clock
} from 'lucide-react';
import { WorkspaceMatter } from '../types/legal';

interface WorkspaceManagerProps {
  onOpenCase: (caseId: string) => void;
}

export const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ onOpenCase }) => {
  const [matters, setMatters] = useState<WorkspaceMatter[]>([]);
  const [selectedMatterId, setSelectedMatterId] = useState<string | null>(null);
  const [isCreatingMatter, setIsCreatingMatter] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMatterNumber, setNewMatterNumber] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newArea, setNewArea] = useState('Company Law');
  const [copiedMemo, setCopiedMemo] = useState(false);

  // Note addition state
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    fetchMatters();
  }, []);

  const fetchMatters = async () => {
    try {
      const res = await fetch('/api/workspaces');
      if (res.ok) {
        const data = await res.json();
        setMatters(data);
        if (data.length > 0 && !selectedMatterId) {
          setSelectedMatterId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load matters', err);
    }
  };

  const handleCreateMatter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          clientMatterNumber: newMatterNumber.trim(),
          description: newDescription.trim(),
          areaOfLaw: newArea
        })
      });

      if (res.ok) {
        const created = await res.json();
        setMatters([created, ...matters]);
        setSelectedMatterId(created.id);
        setIsCreatingMatter(false);
        setNewTitle('');
        setNewMatterNumber('');
        setNewDescription('');
      }
    } catch (err) {
      console.error('Failed to create matter', err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatterId || !newNoteContent.trim()) return;

    try {
      const res = await fetch(`/api/workspaces/${selectedMatterId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'note',
          item: {
            title: newNoteTitle.trim() || 'Attorney File Note',
            content: newNoteContent.trim()
          }
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setMatters(matters.map(m => m.id === updated.id ? updated : m));
        setIsAddingNote(false);
        setNewNoteTitle('');
        setNewNoteContent('');
      }
    } catch (err) {
      console.error('Failed to add note', err);
    }
  };

  const selectedMatter = matters.find(m => m.id === selectedMatterId);

  const copyFullMemo = () => {
    if (!selectedMatter) return;
    const memo = `LEGAL RESEARCH MEMORANDUM\n\nMATTER: ${selectedMatter.title}\nMATTER REF: ${selectedMatter.clientMatterNumber}\nAREA OF LAW: ${selectedMatter.areaOfLaw}\nLAST UPDATED: ${new Date(selectedMatter.updatedAt).toLocaleDateString('en-ZA')}\n\nDESCRIPTION:\n${selectedMatter.description}\n\n--- SAVED CASE PRECEDENTS ---\n${selectedMatter.savedCases.map(c => `• ${c.title} (${c.citation})\n  Notes: ${c.personalNotes || 'None'}`).join('\n\n')}\n\n--- STATUTORY PROVISIONS ---\n${selectedMatter.savedLegislation.map(l => `• ${l.actTitle} §${l.sectionNumber}\n  Notes: ${l.personalNotes || 'None'}`).join('\n\n')}\n\n--- RESEARCH RESPONSES ---\n${selectedMatter.savedResearch.map(r => `• Query: ${r.query}\n  Summary: ${r.answerSummary}`).join('\n\n')}\n\n--- ATTORNEY NOTES ---\n${selectedMatter.attorneyNotes.map(n => `• [${n.title}]: ${n.content}`).join('\n\n')}\n\nCONFIDENTIAL & PRIVILEGED ATTORNEY WORK PRODUCT`;
    
    navigator.clipboard.writeText(memo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-950">
            My Research Workspaces
          </h2>
          <p className="text-sm text-slate-600">
            Organize case authorities, statutory provisions, and research answers by client matter.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingMatter(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-[#0f1f38] text-white rounded-lg text-xs font-semibold hover:bg-[#162c4e] transition-colors cursor-pointer shadow-xs"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Legal Matter</span>
        </button>
      </div>

      {/* New Matter Modal */}
      {isCreatingMatter && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-md w-full animate-in zoom-in-95 duration-150">
            <h3 className="font-serif font-bold text-lg text-slate-950 mb-3">
              Create New Legal Matter
            </h3>
            <form onSubmit={handleCreateMatter} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Matter Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Urgent Interdict — Trademark Infringement"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0f1f38]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Client / File Reference</label>
                <input
                  type="text"
                  value={newMatterNumber}
                  onChange={(e) => setNewMatterNumber(e.target.value)}
                  placeholder="e.g. LEX-2026-099"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0f1f38]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Area of Law</label>
                <select
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0f1f38]"
                >
                  <option value="Company Law">Company Law</option>
                  <option value="Labour Law">Labour Law</option>
                  <option value="Constitutional Law">Constitutional Law</option>
                  <option value="Civil Procedure">Civil Procedure</option>
                  <option value="Contract & Commercial">Contract & Commercial</option>
                  <option value="Property & Evictions">Property & Evictions</option>
                  <option value="Administrative Law">Administrative Law</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Matter Scope / Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief summary of instructions or research question..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0f1f38]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingMatter(false)}
                  className="px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f1f38] text-white rounded-md font-semibold hover:bg-[#162c4e] cursor-pointer"
                >
                  Save Matter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Workspace Layout: Matters Sidebar & Selected Matter Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matters List Sidebar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
            Active Legal Matters ({matters.length})
          </h3>

          {matters.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMatterId(m.id)}
              className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
                selectedMatterId === m.id
                  ? 'border-[#0f1f38] bg-slate-50 shadow-xs ring-1 ring-[#0f1f38]'
                  : 'border-slate-200 hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono text-[11px] font-semibold text-slate-500">
                  {m.clientMatterNumber}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-700">
                  {m.areaOfLaw}
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-slate-900 line-clamp-1 mb-1">
                {m.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                {m.description || 'No description'}
              </p>
              <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-mono">
                <span>{m.savedCases.length} cases</span>
                <span>•</span>
                <span>{m.savedLegislation.length} statutes</span>
                <span>•</span>
                <span>{m.attorneyNotes.length} notes</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Matter Details & Binder */}
        <div className="lg:col-span-2 space-y-6">
          {selectedMatter ? (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-6">
              {/* Header */}
              <div className="border-b border-slate-200 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <span className="font-mono text-xs font-bold text-[#0f1f38] bg-slate-100 px-2.5 py-1 rounded">
                    {selectedMatter.clientMatterNumber}
                  </span>
                  <button
                    onClick={copyFullMemo}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0f1f38] text-white rounded-md text-xs font-semibold hover:bg-[#162c4e] transition-colors cursor-pointer shadow-2xs"
                  >
                    {copiedMemo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMemo ? 'Copied Full Memo' : 'Copy Legal Memo'}</span>
                  </button>
                </div>

                <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-950 mb-2">
                  {selectedMatter.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedMatter.description}
                </p>
              </div>

              {/* Saved Case Authorities */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#0f1f38]" />
                    <span>Saved Case Precedents ({selectedMatter.savedCases.length})</span>
                  </h3>
                </div>

                {selectedMatter.savedCases.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedMatter.savedCases.map((c, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 text-xs">
                        <div>
                          <h4 className="font-serif font-bold text-slate-900 text-sm mb-0.5">{c.title}</h4>
                          <p className="font-mono text-[11px] text-slate-500 mb-1">{c.citation}</p>
                          {c.personalNotes && (
                            <p className="text-slate-700 bg-white p-2 rounded border border-slate-200 mt-1.5">
                              <strong className="text-slate-900">Note:</strong> {c.personalNotes}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onOpenCase(c.caseId)}
                          className="text-[#0f1f38] hover:underline font-semibold shrink-0 cursor-pointer"
                        >
                          View Case
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                    No cases saved to this matter yet.
                  </p>
                )}
              </div>

              {/* Saved Legislation */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center space-x-1.5">
                  <ScrollText className="w-3.5 h-3.5 text-[#0f1f38]" />
                  <span>Saved Statutory Sections ({selectedMatter.savedLegislation.length})</span>
                </h3>

                {selectedMatter.savedLegislation.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedMatter.savedLegislation.map((l, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-serif font-bold text-slate-900">{l.actTitle}</span>
                          <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-300 font-bold">
                            s{l.sectionNumber}
                          </span>
                        </div>
                        {l.personalNotes && (
                          <p className="text-slate-600 italic mt-1">
                            Note: {l.personalNotes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                    No statutory sections saved to this matter yet.
                  </p>
                )}
              </div>

              {/* Attorney File Notes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                    <StickyNote className="w-3.5 h-3.5 text-[#0f1f38]" />
                    <span>Attorney Notes &amp; Strategy Memo ({selectedMatter.attorneyNotes.length})</span>
                  </h3>
                  <button
                    onClick={() => setIsAddingNote(!isAddingNote)}
                    className="flex items-center space-x-1 text-xs font-semibold text-[#0f1f38] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Note</span>
                  </button>
                </div>

                {isAddingNote && (
                  <form onSubmit={handleAddNote} className="p-4 rounded-lg bg-slate-50 border border-slate-300 mb-3 space-y-2.5 text-xs">
                    <input
                      type="text"
                      placeholder="Note Title (e.g. Founding Affidavit Arguments)"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
                    />
                    <textarea
                      rows={3}
                      required
                      placeholder="Draft your legal notes, strategy, or counsel instructions..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingNote(false)}
                        className="px-2.5 py-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#0f1f38] text-white rounded font-medium cursor-pointer"
                      >
                        Save Note
                      </button>
                    </div>
                  </form>
                )}

                {selectedMatter.attorneyNotes.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedMatter.attorneyNotes.map((note) => (
                      <div key={note.id} className="p-3.5 rounded-lg border border-slate-200 bg-amber-50/40 text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="font-bold text-slate-900">{note.title}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                    No notes recorded yet. Click "Add Note" to record counsel instructions.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500">
              Select or create a legal matter to view its research dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
