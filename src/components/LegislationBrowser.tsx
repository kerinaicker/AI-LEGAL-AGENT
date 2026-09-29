import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ScrollText, 
  BookOpen, 
  ChevronRight, 
  FolderPlus, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { LegalDocument } from '../types/legal';

interface LegislationBrowserProps {
  onSaveLegislationToMatter: (actTitle: string, sectionNumber: string) => void;
  onOpenCaseFromLegislation?: (caseTitle: string) => void;
}

export const LegislationBrowser: React.FC<LegislationBrowserProps> = ({
  onSaveLegislationToMatter,
  onOpenCaseFromLegislation
}) => {
  const [statutes, setStatutes] = useState<LegalDocument[]>([]);
  const [selectedAct, setSelectedAct] = useState<LegalDocument | null>(null);
  const [selectedSectionNum, setSelectedSectionNum] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('All');

  useEffect(() => {
    fetchStatutes();
  }, [areaFilter]);

  const fetchStatutes = async () => {
    try {
      let url = '/api/sources/legislation?';
      if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}&`;
      if (areaFilter !== 'All') url += `areaOfLaw=${encodeURIComponent(areaFilter)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.documents) {
        setStatutes(data.documents);
      }
    } catch (err) {
      console.error('Failed to load legislation', err);
    }
  };

  const handleSelectAct = (act: LegalDocument) => {
    setSelectedAct(act);
    if (act.sections && act.sections.length > 0) {
      setSelectedSectionNum(act.sections[0].sectionNumber);
    } else {
      setSelectedSectionNum(null);
    }
  };

  const selectedSection = selectedAct?.sections?.find(s => s.sectionNumber === selectedSectionNum);

  return (
    <div className="max-w-7xl mx-auto py-6">
      {selectedAct ? (
        /* Legislation Section Navigator */
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          {/* Act Header */}
          <div className="bg-slate-900 text-white p-5 sm:p-6">
            <button
              onClick={() => setSelectedAct(null)}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Legislation List</span>
            </button>

            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2 leading-snug">
              {selectedAct.metadata.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded font-mono font-medium">
                Status: In Force
              </span>
              {selectedAct.legislationMetadata?.administeringDepartment && (
                <span>Dept: {selectedAct.legislationMetadata.administeringDepartment}</span>
              )}
              {selectedAct.legislationMetadata?.commencementDate && (
                <span>• Commenced: {selectedAct.legislationMetadata.commencementDate}</span>
              )}
            </div>
          </div>

          {/* Master-Detail Layout for Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
            {/* Section Index Sidebar */}
            <div className="border-r border-slate-200 bg-slate-50 p-4 space-y-1.5 max-h-[600px] overflow-y-auto">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
                Sections Directory
              </h3>

              {selectedAct.sections?.map((sec) => (
                <button
                  key={sec.sectionNumber}
                  onClick={() => setSelectedSectionNum(sec.sectionNumber)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-all cursor-pointer flex items-start space-x-2 ${
                    selectedSectionNum === sec.sectionNumber
                      ? 'bg-[#0f1f38] text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <span className="font-mono shrink-0 font-bold">s{sec.sectionNumber}</span>
                  <span className="truncate">{sec.heading}</span>
                </button>
              ))}
            </div>

            {/* Section Verbatim Text & Landmark Precedents */}
            <div className="col-span-2 p-6 sm:p-8 space-y-6">
              {selectedSection ? (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-5">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#0f1f38] bg-slate-100 px-2.5 py-1 rounded">
                        Section {selectedSection.sectionNumber}
                      </span>
                      <h2 className="text-lg font-serif font-bold text-slate-900 mt-2">
                        {selectedSection.heading}
                      </h2>
                    </div>

                    <button
                      onClick={() => onSaveLegislationToMatter(selectedAct.metadata.title, selectedSection.sectionNumber)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold transition-colors cursor-pointer border border-slate-300"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>Save Section to Matter</span>
                    </button>
                  </div>

                  {/* Verbatim Statutory Text */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Statutory Text (Republic of South Africa)
                    </h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 font-serif text-sm sm:text-base text-slate-900 leading-relaxed">
                      {selectedSection.content}
                    </div>
                  </div>

                  {/* Related Landmark Precedent Case Law */}
                  {selectedSection.landmarkCases && selectedSection.landmarkCases.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f1f38] mb-3 flex items-center space-x-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>Landmark Case Law Interpreting Section {selectedSection.sectionNumber}</span>
                      </h3>
                      <div className="space-y-2.5">
                        {selectedSection.landmarkCases.map((cName, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-slate-200 rounded-lg p-3.5 text-xs text-slate-800 flex items-center justify-between shadow-2xs hover:bg-slate-50"
                          >
                            <span className="font-serif font-bold text-sm text-slate-900">{cName}</span>
                            {onOpenCaseFromLegislation && (
                              <button
                                onClick={() => onOpenCaseFromLegislation(cName)}
                                className="text-xs font-semibold text-[#0f1f38] hover:underline flex items-center space-x-1 cursor-pointer"
                              >
                                <span>Inspect Precedent</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Select a section to view its statutory provisions.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Legislation Search & Catalog */
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-slate-950 mb-1">
              South African Legislation &amp; Statutes
            </h2>
            <p className="text-sm text-slate-600">
              Browse gazetted Acts of Parliament and the Constitution of the Republic of South Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statutes.map((statute) => (
              <div
                key={statute.id}
                onClick={() => handleSelectAct(statute)}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      In Force
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {statute.metadata.areaOfLaw}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-slate-950 mb-2 leading-snug">
                    {statute.metadata.title}
                  </h3>

                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                    {statute.legislationMetadata?.administeringDepartment 
                      ? `Administered by the ${statute.legislationMetadata.administeringDepartment}.`
                      : 'National legislation enacted under the Constitution of South Africa.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{statute.sections?.length || 0} indexed key sections</span>
                  <span className="font-semibold text-[#0f1f38] flex items-center space-x-1">
                    <span>Explore Sections</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
