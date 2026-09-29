import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Check, Briefcase } from 'lucide-react';
import { WorkspaceMatter } from '../types/legal';

interface SaveToMatterModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'case' | 'legislation' | 'research';
  item: any;
  onSavedSuccess: () => void;
}

export const SaveToMatterModal: React.FC<SaveToMatterModalProps> = ({
  isOpen,
  onClose,
  itemType,
  item,
  onSavedSuccess
}) => {
  const [matters, setMatters] = useState<WorkspaceMatter[]>([]);
  const [selectedMatterId, setSelectedMatterId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/workspaces')
        .then(res => res.json())
        .then(data => {
          setMatters(data);
          if (data.length > 0) setSelectedMatterId(data[0].id);
        })
        .catch(err => console.error('Failed to load matters', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatterId) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/workspaces/${selectedMatterId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: itemType,
          item,
          notes: notes.trim()
        })
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onSavedSuccess();
          onClose();
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to save to matter', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-[#0f1f38]" />
            <h3 className="font-serif font-bold text-base text-slate-950">
              Save to Legal Matter
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center text-emerald-600 space-y-2">
            <Check className="w-8 h-8 mx-auto" />
            <p className="font-semibold text-sm">Successfully saved to matter!</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Item to Save</label>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium text-slate-900">
                {itemType === 'case' && (
                  <div>
                    <span className="font-serif">{item.title}</span>
                    <span className="block text-[11px] font-mono text-slate-500">{item.citation}</span>
                  </div>
                )}
                {itemType === 'legislation' && (
                  <div>
                    <span className="font-serif">{item.actTitle}</span>
                    <span className="block text-[11px] font-mono text-slate-500">Section {item.sectionNumber}</span>
                  </div>
                )}
                {itemType === 'research' && (
                  <div>
                    <span className="font-serif">Research Memo</span>
                    <span className="block text-[11px] text-slate-500 truncate">{item.query}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Select Active Matter *</label>
              <select
                value={selectedMatterId}
                onChange={(e) => setSelectedMatterId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0f1f38]"
              >
                {matters.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.clientMatterNumber} — {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Personal Notes / Instructions</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add relevance to arguments, paragraph references, or client advice notes..."
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0f1f38]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-1.5 bg-[#0f1f38] text-white rounded-md font-semibold hover:bg-[#162c4e] transition-colors cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Confirm & Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
