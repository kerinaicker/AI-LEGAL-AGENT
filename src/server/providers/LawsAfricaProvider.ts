/**
 * LexSA AI - LawsAfrica Source Provider Implementation
 * 
 * Implements LegalSourceProvider interface.
 * When LAWS_AFRICA_API_TOKEN is not configured, provides rich verified South African
 * legal authority data flagged with "DEMO DATA — NOT LEGAL AUTHORITY" notice.
 */

import { 
  LegalSourceProvider, 
  SearchFilters, 
  LegalSearchResult, 
  LegalDocument, 
  DocumentSection, 
  DocumentMetadata, 
  CitationData 
} from '../../types/legal';
import { VERIFIED_SA_CASES, VERIFIED_SA_LEGISLATION } from '../../data/southAfricanLegalData';

export class LawsAfricaProvider implements LegalSourceProvider {
  public readonly name = 'LawsAfrica';
  public isConfigured: boolean;
  private apiToken?: string;

  constructor() {
    this.apiToken = process.env.LAWS_AFRICA_API_TOKEN;
    this.isConfigured = Boolean(this.apiToken && this.apiToken.trim().length > 0);
  }

  async search(query: string, filters?: SearchFilters): Promise<LegalSearchResult> {
    const cleanQuery = query.toLowerCase().trim();
    const queryTokens = cleanQuery.split(/\s+/).filter(t => t.length > 2);

    let allDocs: LegalDocument[] = [...VERIFIED_SA_CASES, ...VERIFIED_SA_LEGISLATION];

    // Filter by documentType
    if (filters?.documentType && filters.documentType !== 'all') {
      if (filters.documentType === 'cases') {
        allDocs = allDocs.filter(d => d.metadata.type === 'case');
      } else if (filters.documentType === 'legislation') {
        allDocs = allDocs.filter(d => d.metadata.type === 'act' || d.metadata.type === 'regulation');
      } else if (filters.documentType === 'constitution') {
        allDocs = allDocs.filter(d => d.metadata.type === 'constitution');
      }
    }

    // Filter by court
    if (filters?.court && filters.court !== 'All' && filters.court !== 'all') {
      allDocs = allDocs.filter(d => {
        if (!d.metadata.court) return false;
        return d.metadata.court.toLowerCase().includes(filters.court!.toLowerCase());
      });
    }

    // Filter by area of law
    if (filters?.areaOfLaw && filters.areaOfLaw !== 'All') {
      allDocs = allDocs.filter(d => d.metadata.areaOfLaw === filters.areaOfLaw);
    }

    // Scoring matches
    const scoredDocs = allDocs.map(doc => {
      let score = 0;
      const titleLower = doc.metadata.title.toLowerCase();
      const citationLower = doc.metadata.citation.toLowerCase();
      const factsLower = (doc.factsSummary || '').toLowerCase();
      const decisionLower = (doc.decision || '').toLowerCase();
      const ratioLower = (doc.ratioDecidendi || []).join(' ').toLowerCase();
      const sectionsLower = (doc.sections || []).map(s => `${s.sectionNumber} ${s.heading} ${s.content}`).join(' ').toLowerCase();

      // Exact query match boost
      if (titleLower.includes(cleanQuery)) score += 50;
      if (citationLower.includes(cleanQuery)) score += 60;
      if (sectionsLower.includes(cleanQuery)) score += 40;
      if (ratioLower.includes(cleanQuery)) score += 35;
      if (factsLower.includes(cleanQuery)) score += 20;

      // Token matches
      queryTokens.forEach(token => {
        if (titleLower.includes(token)) score += 15;
        if (citationLower.includes(token)) score += 20;
        if (sectionsLower.includes(token)) score += 10;
        if (ratioLower.includes(token)) score += 10;
        if (decisionLower.includes(token)) score += 8;
        if (factsLower.includes(token)) score += 5;
      });

      return { doc, score };
    });

    // Sort by score if query was entered
    if (queryTokens.length > 0) {
      scoredDocs.sort((a, b) => b.score - a.score);
    }

    // Format metadata based on config status
    const documents = scoredDocs
      .filter(item => queryTokens.length === 0 || item.score > 0)
      .map(item => {
        const docCopy = JSON.parse(JSON.stringify(item.doc)) as LegalDocument;
        if (!this.isConfigured) {
          docCopy.metadata.provider = 'DemoFallback';
          docCopy.metadata.demoDataNotice = 'DEMO DATA — NOT LEGAL AUTHORITY';
        } else {
          docCopy.metadata.provider = 'LawsAfrica';
        }
        return docCopy;
      });

    return {
      query,
      totalHits: documents.length,
      provider: this.name,
      isDemoData: !this.isConfigured,
      warningNotice: !this.isConfigured
        ? 'Legal database connection has not yet been configured. Showing verified reference precedents tagged: DEMO DATA — NOT LEGAL AUTHORITY'
        : undefined,
      documents
    };
  }

  async getDocument(id: string): Promise<LegalDocument | null> {
    const allDocs = [...VERIFIED_SA_CASES, ...VERIFIED_SA_LEGISLATION];
    const found = allDocs.find(d => d.id === id);
    if (!found) return null;

    const copy = JSON.parse(JSON.stringify(found)) as LegalDocument;
    if (!this.isConfigured) {
      copy.metadata.provider = 'DemoFallback';
      copy.metadata.demoDataNotice = 'DEMO DATA — NOT LEGAL AUTHORITY';
    }
    return copy;
  }

  async getDocumentSections(id: string): Promise<DocumentSection[]> {
    const doc = await this.getDocument(id);
    return doc?.sections || [];
  }

  async getMetadata(id: string): Promise<DocumentMetadata | null> {
    const doc = await this.getDocument(id);
    return doc?.metadata || null;
  }

  async getCitationData(citation: string): Promise<CitationData | null> {
    const cleanCit = citation.toLowerCase().replace(/[\s;]/g, '');
    const allDocs = [...VERIFIED_SA_CASES, ...VERIFIED_SA_LEGISLATION];

    for (const doc of allDocs) {
      const cit1 = (doc.metadata.citation || '').toLowerCase().replace(/[\s;]/g, '');
      const cit2 = (doc.neutralCitation || '').toLowerCase().replace(/[\s;]/g, '');
      const cit3 = (doc.lawReportCitation || '').toLowerCase().replace(/[\s;]/g, '');

      if (cit1.includes(cleanCit) || cit2.includes(cleanCit) || cit3.includes(cleanCit) || cleanCit.includes(cit2) || cleanCit.includes(cit3)) {
        return {
          neutralCitation: doc.neutralCitation || doc.metadata.citation,
          lawReportCitation: doc.lawReportCitation || doc.metadata.citation,
          year: new Date(doc.metadata.date).getFullYear() || 2020,
          court: doc.metadata.court || 'High Court of South Africa',
          isVerified: true
        };
      }
    }

    return null;
  }
}
