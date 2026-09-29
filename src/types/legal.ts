/**
 * LexSA AI - South African Legal Research Assistant
 * Core TypeScript definitions and LegalSourceProvider interfaces
 */

export type UserMode = 'professional' | 'public';

export type CourtLevel = 
  | 'CC'      // Constitutional Court (Highest Court in all matters)
  | 'SCA'     // Supreme Court of Appeal
  | 'FB'      // High Court Full Bench (Appeals from single judge)
  | 'HC'      // High Court Provincial Division (Single Judge)
  | 'LAC'     // Labour Appeal Court
  | 'LC'      // Labour Court
  | 'CAC'     // Competition Appeal Court
  | 'LCC'     // Land Claims Court
  | 'TC';     // Tax Court

export type AuthorityRank = 'binding' | 'persuasive' | 'statutory';

export type CaseTreatment = 
  | 'affirmed' 
  | 'applied' 
  | 'distinguished' 
  | 'overruled' 
  | 'considered' 
  | 'referred_to';

export type LegalArea = 
  | 'Company Law'
  | 'Labour Law'
  | 'Constitutional Law'
  | 'Contract & Commercial'
  | 'Property & Evictions'
  | 'Administrative Law'
  | 'Delict'
  | 'Criminal Law'
  | 'Civil Procedure'
  | 'Tax Law';

export interface CitationData {
  neutralCitation: string;    // e.g. "[2016] ZASCA 35"
  lawReportCitation: string;  // e.g. "2017 (2) SA 337 (SCA)"
  alternativeCitations?: string[];
  year: number;
  court: string;
  isVerified: boolean;
}

export interface DocumentSection {
  id: string;
  sectionNumber: string;       // e.g. "77", "189", "33"
  heading: string;
  content: string;
  subsections?: {
    label: string;             // e.g. "(1)(a)", "(2)"
    text: string;
  }[];
  relatedCaseLaw?: string[];
  landmarkCases?: string[];
}

export interface DocumentMetadata {
  id: string;
  title: string;
  type: 'case' | 'act' | 'regulation' | 'constitution' | 'court_rule';
  citation: string;
  court?: string;
  date: string;
  jurisdiction: string;        // "South Africa"
  areaOfLaw: LegalArea;
  status: 'in_force' | 'amended' | 'repealed' | 'active_precedent' | 'overruled';
  provider: 'LawsAfrica' | 'LocalVerified' | 'DemoFallback';
  isVerified: boolean;
  demoDataNotice?: string;
}

export interface LegalDocument {
  id: string;
  metadata: DocumentMetadata;
  // Case specific
  judges?: string[];
  appellants?: string;
  respondents?: string;
  neutralCitation?: string;
  lawReportCitation?: string;
  factsSummary?: string;
  issues?: string[];
  decision?: string;
  ratioDecidendi?: string[];
  obiterDicta?: string[];
  order?: string;
  judgmentExcerpts?: {
    paragraph: number;
    text: string;
    speaker?: string;
  }[];
  authoritiesCited?: {
    caseTitle: string;
    citation: string;
    treatment: CaseTreatment;
    relevantParagraphs?: string;
  }[];
  legislationCited?: {
    actTitle: string;
    section: string;
  }[];
  caseHistory?: string[];
  // Legislation specific
  legislationMetadata?: {
    administeringDepartment?: string;
    commencementDate?: string;
    assentDate?: string;
  };
  actNumber?: number;
  actYear?: number;
  commencementDate?: string;
  assentDate?: string;
  administeringDepartment?: string;
  sections?: DocumentSection[];
  definitions?: Record<string, string>;
  amendments?: {
    amendingAct: string;
    date: string;
    sectionsAffected: string;
  }[];
}

export interface SearchFilters {
  jurisdiction?: string;       // default "South Africa"
  court?: string;              // e.g. "Constitutional Court", "Supreme Court of Appeal", "All"
  dateRange?: string;          // e.g. "all", "1994_present", "last_5_years", "last_10_years"
  areaOfLaw?: LegalArea | 'All';
  documentType?: 'all' | 'cases' | 'legislation' | 'constitution' | 'court_rules';
  sortBy?: 'relevance' | 'hierarchy' | 'date_desc' | 'citation_count';
  authorityLevel?: 'all' | 'binding_only' | 'persuasive';
}

export interface LegalSearchResult {
  query: string;
  totalHits: number;
  provider: string;
  isDemoData: boolean;
  warningNotice?: string;
  documents: LegalDocument[];
}

/**
 * Modular Source Provider Interface
 * Must be implemented by all legal data providers (LawsAfrica, LocalVerified, etc.)
 */
export interface LegalSourceProvider {
  name: string;
  isConfigured: boolean;
  search(query: string, filters?: SearchFilters): Promise<LegalSearchResult>;
  getDocument(id: string): Promise<LegalDocument | null>;
  getDocumentSections(id: string): Promise<DocumentSection[]>;
  getMetadata(id: string): Promise<DocumentMetadata | null>;
  getCitationData(citation: string): Promise<CitationData | null>;
}

/**
 * 8-Step Research Agent Pipeline Types
 */
export type PipelineStepId = 
  | 'step1_issue_identification'
  | 'step2_authority_retrieval'
  | 'step3_authority_classification'
  | 'step4_authority_ranking'
  | 'step5_read_sources'
  | 'step6_contrary_authority_search'
  | 'step7_citation_verification_pass'
  | 'step8_synthesis';

export interface PipelineStep {
  id: PipelineStepId;
  stepNumber: number;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  summary?: string;
  details?: Record<string, any>;
}

export interface AuthorityClassificationItem {
  title: string;
  citation: string;
  court: string;
  courtLevel: CourtLevel;
  date: string;
  authorityLevel: AuthorityRank;
  relevanceScore: number;      // 0 to 100
  treatment: CaseTreatment;
  keyRule: string;
  sourceParagraphs: string;
}

export interface ContraryAuthorityItem {
  caseTitle: string;
  citation: string;
  court: string;
  contraryAspect: string;
  distinguishingReason: string;
  status: 'distinguished' | 'minority_view' | 'overruled_earlier_rule' | 'context_specific';
}

export interface CitationVerificationReport {
  totalCitationsChecked: number;
  verifiedCount: number;
  unverifiedCount: number;
  flaggedHallucinations: string[];
  verifiedAuthorities: {
    citation: string;
    title: string;
    verifiedInIndex: boolean;
    courtMatch: boolean;
  }[];
  passedVerification: boolean;
  strictZeroHallucinationGuaranteed: boolean;
}

export interface ResearchTrail {
  initialQuery: string;
  issuesIdentified: string[];
  statutesIdentified: string[];
  queriesGenerated: string[];
  sourcesQueried: {
    provider: string;
    searchQuery: string;
    hitsReturned: number;
  }[];
  authoritiesReliedUpon: string[];
  contrarySearchesRan: string[];
  verificationAudit: CitationVerificationReport;
}

export interface ProfessionalResponse {
  researchAnswer: string;
  legalPosition: string;
  governingLegislation: {
    actTitle: string;
    sections: string[];
    statutoryRuleSummary: string;
  }[];
  keyAuthorities: {
    id: string;
    title: string;
    citation: string;
    court: string;
    year: number;
    authorityLevel: 'Binding Precedent' | 'Persuasive Precedent' | 'Direct Statute';
    ratioSummary: string;
    keyParagraphs: string;
    judges?: string[];
  }[];
  application: string;
  contraryAuthorities: ContraryAuthorityItem[];
  researchNotes: {
    sourcesSearched: string[];
    doctrineTags: string[];
    hierarchyNote: string;
    verificationNotice: string;
  };
}

export interface PublicResponse {
  shortAnswer: string;
  whatTheLawSays: string;
  why: string;
  legalSources: {
    name: string;
    whatItIs: string;
    whyItMatters: string;
    citation: string;
  }[];
  whatThisCouldMean: string[];
  whenLegalHelpMayBeUseful: string[];
  publicDisclaimerNotice: string;
}

export interface ResearchResponse {
  id: string;
  query: string;
  mode: UserMode;
  isVerified: boolean;
  isConfigured: boolean;
  warningNotice?: string;
  executionTimeMs: number;
  timestamp: string;
  steps: PipelineStep[];
  trail: ResearchTrail;
  professional: ProfessionalResponse;
  public: PublicResponse;
}

export interface WorkspaceMatter {
  id: string;
  title: string;
  clientMatterNumber?: string;
  description: string;
  areaOfLaw: LegalArea;
  createdAt: string;
  updatedAt: string;
  savedCases: {
    caseId: string;
    title: string;
    citation: string;
    personalNotes?: string;
    savedAt: string;
  }[];
  savedLegislation: {
    actId: string;
    actTitle: string;
    sectionNumber: string;
    personalNotes?: string;
    savedAt: string;
  }[];
  savedResearch: {
    researchId: string;
    query: string;
    answerSummary: string;
    savedAt: string;
  }[];
  attorneyNotes: {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
  }[];
}

export interface HistoryItem {
  id: string;
  query: string;
  mode: UserMode;
  timestamp: string;
  areaOfLaw?: LegalArea;
  summary: string;
  authoritiesCount: number;
}
