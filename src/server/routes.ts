/**
 * LexSA AI - Express Server API Routes
 */

import { Router, Request, Response } from 'express';
import { ResearchPipeline } from './pipeline/researchPipeline';
import { LawsAfricaProvider } from './providers/LawsAfricaProvider';
import { VERIFIED_SA_CASES, VERIFIED_SA_LEGISLATION } from '../data/southAfricanLegalData';
import { WorkspaceMatter } from '../types/legal';

export const apiRouter = Router();

const pipeline = new ResearchPipeline();
const provider = new LawsAfricaProvider();

// In-memory workspace matters store (pre-seeded with realistic matters)
let workspaceMatters: WorkspaceMatter[] = [
  {
    id: 'matter-1',
    title: 'Urgent Interdict — Restraint of Trade & Confidential Information',
    clientMatterNumber: 'LEX-2026-089',
    description: 'Urgent application in the High Court to interdict former senior executive from breaching restraint covenant and misusing client database.',
    areaOfLaw: 'Civil Procedure',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    savedCases: [
      {
        caseId: 'case-setlogelo-1921',
        title: 'Setlogelo v Setlogelo',
        citation: '1921 AD 221',
        personalNotes: 'Locus classicus for prima facie right and absence of satisfactory alternative remedy.',
        savedAt: new Date().toISOString()
      },
      {
        caseId: 'case-beadica-2020',
        title: 'Beadica 231 CC v Trustees, Oregon Trust',
        citation: '[2020] ZACC 13; 2020 (5) SA 247 (CC)',
        personalNotes: 'Pacta sunt servanda applies to commercial restraint covenants.',
        savedAt: new Date().toISOString()
      }
    ],
    savedLegislation: [
      {
        actId: 'act-constitution-1996',
        actTitle: 'Constitution of the Republic of South Africa, 1996',
        sectionNumber: '34',
        personalNotes: 'Section 34 right of access to courts.',
        savedAt: new Date().toISOString()
      }
    ],
    savedResearch: [
      {
        researchId: 'res-init-1',
        query: 'What are the requirements for an urgent interdict?',
        answerSummary: 'Four Setlogelo requirements: prima facie right, well-grounded apprehension of irreparable harm, balance of convenience, and no other suitable remedy.',
        savedAt: new Date().toISOString()
      }
    ],
    attorneyNotes: [
      {
        id: 'note-1',
        title: 'Urgency Grounds for Founding Affidavit',
        content: 'Establish timeline within 48 hours of discovering unlawful solicitation. Attach WhatsApp screenshots and forensic server logs as Annexure FA3.',
        updatedAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'matter-2',
    title: 'Director Personal Liability s77(3) — Insolvent Trading',
    clientMatterNumber: 'CORP-2026-112',
    description: 'Advice to liquidators regarding potential Section 77(3)(b) and Section 22(1) claims against managing directors following liquidation.',
    areaOfLaw: 'Company Law',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    savedCases: [
      {
        caseId: 'case-gihwala-2016',
        title: 'Gihwala v Grancy Property Ltd',
        citation: '[2016] ZASCA 35; 2017 (2) SA 337 (SCA)',
        personalNotes: 'Section 77(2) common law liability and Section 162 delinquency declaration.',
        savedAt: new Date().toISOString()
      },
      {
        caseId: 'case-hlumisa-2020',
        title: 'Hlumisa Investment Holdings v Kirkinis',
        citation: '[2020] ZASCA 83; 2020 (5) SA 419 (SCA)',
        personalNotes: 'Reflective loss doctrine prevents individual shareholder claims, but liquidator claims on behalf of company remain intact.',
        savedAt: new Date().toISOString()
      }
    ],
    savedLegislation: [
      {
        actId: 'act-companies-2008',
        actTitle: 'Companies Act 71 of 2008',
        sectionNumber: '77',
        personalNotes: 'Section 77(3)(b) acquiescing in reckless trading.',
        savedAt: new Date().toISOString()
      }
    ],
    savedResearch: [],
    attorneyNotes: []
  }
];

// 1. System Status & Source Configuration
apiRouter.get('/status', (req: Request, res: Response) => {
  const isLawsAfricaConfigured = provider.isConfigured;
  const isGeminiAvailable = Boolean(process.env.GEMINI_API_KEY);

  res.json({
    status: 'online',
    lawsAfricaConfigured: isLawsAfricaConfigured,
    lawsAfricaStatus: isLawsAfricaConfigured 
      ? 'Connected to Laws.Africa Legal Database API' 
      : 'Legal database connection has not yet been configured.',
    safliiStatus: 'SAFLII — Integration pending source permission',
    geminiAvailable: isGeminiAvailable,
    zeroHallucinationGuard: 'Active (Automated 8-step verification pipeline)',
    demoDataNotice: isLawsAfricaConfigured ? null : 'DEMO DATA — NOT LEGAL AUTHORITY',
    jurisdiction: 'Republic of South Africa'
  });
});

// 2. Execute 8-step Research Agent Pipeline
apiRouter.post('/research', async (req: Request, res: Response) => {
  try {
    const { query, mode = 'professional', filters } = req.body;
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const response = await pipeline.execute(query.trim(), mode, filters);
    res.json(response);
  } catch (error) {
    console.error('Research execution error:', error);
    res.status(500).json({ 
      error: 'Research pipeline failure',
      fallbackNotice: 'I could not verify a reliable answer from the legal sources currently available.'
    });
  }
});

// 3. Search & List Cases
apiRouter.get('/sources/cases', async (req: Request, res: Response) => {
  try {
    const { q = '', court, areaOfLaw } = req.query;
    const searchResult = await provider.search(String(q), {
      documentType: 'cases',
      court: court ? String(court) : undefined,
      areaOfLaw: areaOfLaw ? (String(areaOfLaw) as any) : undefined
    });
    res.json(searchResult);
  } catch (error) {
    console.error('Case search error:', error);
    res.status(500).json({ error: 'Failed to search cases' });
  }
});

// 4. Get Case Detail (Case Intelligence)
apiRouter.get('/sources/cases/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await provider.getDocument(id);
    if (!doc || doc.metadata.type !== 'case') {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json(doc);
  } catch (error) {
    console.error('Get case error:', error);
    res.status(500).json({ error: 'Failed to retrieve case' });
  }
});

// 5. Search & List Legislation
apiRouter.get('/sources/legislation', async (req: Request, res: Response) => {
  try {
    const { q = '', areaOfLaw } = req.query;
    const searchResult = await provider.search(String(q), {
      documentType: 'legislation',
      areaOfLaw: areaOfLaw ? (String(areaOfLaw) as any) : undefined
    });
    res.json(searchResult);
  } catch (error) {
    console.error('Legislation search error:', error);
    res.status(500).json({ error: 'Failed to search legislation' });
  }
});

// 6. Get Legislation Detail & Sections
apiRouter.get('/sources/legislation/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await provider.getDocument(id);
    if (!doc || doc.metadata.type === 'case') {
      return res.status(404).json({ error: 'Legislation not found' });
    }
    res.json(doc);
  } catch (error) {
    console.error('Get legislation error:', error);
    res.status(500).json({ error: 'Failed to retrieve legislation' });
  }
});

// 7. Verify Citation
apiRouter.post('/sources/citations/verify', async (req: Request, res: Response) => {
  try {
    const { citation } = req.body;
    if (!citation) return res.status(400).json({ error: 'Citation is required' });
    const citationData = await provider.getCitationData(String(citation));
    res.json({
      isVerified: Boolean(citationData),
      citationData,
      status: citationData ? 'VERIFIED_LEGAL_SOURCE' : 'UNVERIFIED_OR_UNKNOWN'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify citation' });
  }
});

// 8. Workspaces (My Research)
apiRouter.get('/workspaces', (req: Request, res: Response) => {
  res.json(workspaceMatters);
});

apiRouter.post('/workspaces', (req: Request, res: Response) => {
  try {
    const { title, clientMatterNumber, description, areaOfLaw } = req.body;
    if (!title) return res.status(400).json({ error: 'Matter title is required' });

    const newMatter: WorkspaceMatter = {
      id: `matter-${Date.now()}`,
      title,
      clientMatterNumber: clientMatterNumber || `LEX-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      description: description || '',
      areaOfLaw: areaOfLaw || 'Company Law',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      savedCases: [],
      savedLegislation: [],
      savedResearch: [],
      attorneyNotes: []
    };

    workspaceMatters.unshift(newMatter);
    res.status(201).json(newMatter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create matter' });
  }
});

// Save item to matter
apiRouter.post('/workspaces/:id/save', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, item, notes } = req.body;

    const matter = workspaceMatters.find(m => m.id === id);
    if (!matter) return res.status(404).json({ error: 'Matter not found' });

    if (type === 'case') {
      matter.savedCases.push({
        caseId: item.id,
        title: item.title,
        citation: item.citation,
        personalNotes: notes,
        savedAt: new Date().toISOString()
      });
    } else if (type === 'legislation') {
      matter.savedLegislation.push({
        actId: item.actId,
        actTitle: item.actTitle,
        sectionNumber: item.sectionNumber,
        personalNotes: notes,
        savedAt: new Date().toISOString()
      });
    } else if (type === 'research') {
      matter.savedResearch.push({
        researchId: item.id,
        query: item.query,
        answerSummary: item.summary,
        savedAt: new Date().toISOString()
      });
    } else if (type === 'note') {
      matter.attorneyNotes.push({
        id: `note-${Date.now()}`,
        title: item.title || 'Attorney Memo',
        content: item.content || notes,
        updatedAt: new Date().toISOString()
      });
    }

    matter.updatedAt = new Date().toISOString();
    res.json(matter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save item to matter' });
  }
});
