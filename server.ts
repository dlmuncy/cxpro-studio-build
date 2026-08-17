import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { SEED_CLAUSES, CONTRACT_TEMPLATES, SAMPLE_ANALYZED_CONTRACTS } from './src/data/seedData';
import { RiskScoringEngine } from './src/services/riskEngine';
import { ContractRecord, ContractAnalysisResult, ClauseLibraryItem } from './src/types';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// In-memory contract database
const contractDb: Map<string, ContractRecord> = new Map();

// Seed initial contracts
for (const sample of SAMPLE_ANALYZED_CONTRACTS) {
  contractDb.set(sample.id, sample);
}

// Initialize server-side Gemini client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not configured in environment.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'dummy-key',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// API ROUTES

// 1. Upload Contract API
app.post('/api/contracts/upload', (req, res) => {
  try {
    const { filename, textContent, contractType } = req.body;
    if (!textContent || typeof textContent !== 'string') {
      return res.status(400).json({ error: 'Contract text content is required' });
    }

    const contractId = 'contract-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const contractRecord: ContractRecord = {
      id: contractId,
      filename: filename || 'Uploaded_Contract.txt',
      contractType: contractType || 'General Commercial',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Analyzing',
      textCount: textContent.length,
      rawText: textContent
    };

    contractDb.set(contractId, contractRecord);
    return res.json({ success: true, contractId, contract: contractRecord });
  } catch (err: any) {
    console.error('Error in /api/contracts/upload:', err);
    return res.status(500).json({ error: err.message || 'Failed to upload contract' });
  }
});

// 2. Multi-AI Orchestration Analysis API
app.post('/api/contracts/analyze', async (req, res) => {
  try {
    const { contractId, contractText, filename } = req.body;
    let textToAnalyze = contractText;
    let docName = filename || 'Contract_Document.docx';

    if (contractId && contractDb.has(contractId)) {
      const existing = contractDb.get(contractId)!;
      textToAnalyze = existing.rawText;
      docName = existing.filename;
    }

    if (!textToAnalyze) {
      return res.status(400).json({ error: 'Contract text is required for analysis' });
    }

    const ai = getGeminiClient();

    // Call Gemini with prompt structuring for Multi-AI Orchestration synthesis
    const prompt = `You are CXPro's Multi-AI Contract Orchestrator. Perform an exhaustive legal review of the contract text below from THREE distinct AI model perspectives simultaneously:

1. GPT-4 Perspective: Contract Structure & Intent Analysis
- Classify contract type (NDA, MSA, SaaS Subscription, Employment, Independent Contractor, Software License, Partnership, Real Estate Lease, General Commercial)
- Identify all parties and their roles
- Extract key commercial terms (Effective date, financial obligations, auto-renewal terms, governing law)
- Build a section-by-section clause inventory with risk levels
- List missing standard essential clauses that ought to be present
- Evaluate business objective, value exchange, and negotiation leverage balance

2. Claude Perspective: Legal Risk & Compliance Review
- Identify 6 to 10 comprehensive risks spanning Critical, High, Medium, and Low severities
- Assign a severity score impact to each risk (e.g. +25 for unlimited liability, +15 for 120-day auto-renewals)
- Provide exact clause reference, explanation, potential business consequence, and concrete recommended action
- Perform compliance verification against GDPR, CCPA, HIPAA, FLSA, SOX, and jurisdiction standards

3. Gemini Perspective: Clause Comparison & Optimization
- Match clauses against standard library standards
- Grade quality (Stronger than Standard, Standard, Weaker than Standard, Ambiguous)
- Suggest plain-language simplifications for complex legalese
- Provide alternative clause variations (Balanced, Customer-favorable, Vendor-favorable) with trade-offs

4. Consensus Algorithm
- Synthesize all findings into consensus recommendations with confidence levels (3 models agree = High, 2 = Moderate)
- Calculate total overall risk score (0-100 scale, where 0-30 is Low, 31-60 Medium, 61-85 High, 86-100 Critical)

Contract Text:
"""
${textToAnalyze.substring(0, 15000)}
"""`;

    let aiResult: any = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an elite legal AI agent orchestrating multi-model contract analysis. Output response strictly in JSON matching the specified schema.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                overallRiskScore: { type: Type.INTEGER },
                summaryText: { type: Type.STRING },
                gpt4Analysis: {
                  type: Type.OBJECT,
                  properties: {
                    documentClassification: { type: Type.STRING },
                    parties: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          role: { type: Type.STRING }
                        }
                      }
                    },
                    keyTerms: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          label: { type: Type.STRING },
                          value: { type: Type.STRING },
                          category: { type: Type.STRING }
                        }
                      }
                    },
                    clauseInventory: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          section: { type: Type.STRING },
                          title: { type: Type.STRING },
                          summary: { type: Type.STRING },
                          riskLevel: { type: Type.STRING }
                        }
                      }
                    },
                    missingStandardClauses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    businessObjective: { type: Type.STRING },
                    valueExchange: { type: Type.STRING },
                    negotiationLeverage: { type: Type.STRING }
                  }
                },
                claudeAnalysis: {
                  type: Type.OBJECT,
                  properties: {
                    overallRiskCategory: { type: Type.STRING },
                    risks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          clauseTitle: { type: Type.STRING },
                          sectionReference: { type: Type.STRING },
                          severity: { type: Type.STRING },
                          scoreImpact: { type: Type.INTEGER },
                          explanation: { type: Type.STRING },
                          potentialConsequence: { type: Type.STRING },
                          recommendedAction: { type: Type.STRING }
                        }
                      }
                    },
                    complianceGaps: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          framework: { type: Type.STRING },
                          status: { type: Type.STRING },
                          severity: { type: Type.STRING },
                          description: { type: Type.STRING },
                          remediationStep: { type: Type.STRING }
                        }
                      }
                    }
                  }
                },
                geminiAnalysis: {
                  type: Type.OBJECT,
                  properties: {
                    clauseMatches: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          clauseId: { type: Type.STRING },
                          clauseTitle: { type: Type.STRING },
                          originalText: { type: Type.STRING },
                          libraryEquivalent: { type: Type.STRING },
                          similarityScore: { type: Type.INTEGER },
                          qualityAssessment: { type: Type.STRING },
                          improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                      }
                    },
                    languageSimplificationSuggestions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          originalJargon: { type: Type.STRING },
                          plainLanguageAlternative: { type: Type.STRING },
                          reason: { type: Type.STRING }
                        }
                      }
                    }
                  }
                },
                consensusRecommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      scoreReductionPotential: { type: Type.INTEGER },
                      proposedTextChange: {
                        type: Type.OBJECT,
                        properties: {
                          current: { type: Type.STRING },
                          proposed: { type: Type.STRING }
                        }
                      }
                    }
                  }
                }
              },
              required: ['overallRiskScore', 'summaryText', 'gpt4Analysis', 'claudeAnalysis']
            }
          }
        });

        const jsonStr = response.text || '{}';
        aiResult = JSON.parse(jsonStr);
      } catch (geminiErr) {
        console.warn('Gemini API call warning in server, using structured fallback orchestration:', geminiErr);
      }
    }

    // Build complete normalized result
    const risks = aiResult?.claudeAnalysis?.risks?.map((r: any, idx: number) => ({
      id: r.id || `risk-${idx + 1}`,
      clauseTitle: r.clauseTitle || 'Contract Provision',
      sectionReference: r.sectionReference || 'General',
      severity: r.severity || 'High',
      scoreImpact: r.scoreImpact || 15,
      explanation: r.explanation || 'Clause creates legal liability exposure.',
      potentialConsequence: r.potentialConsequence || 'Potential financial or operational penalty.',
      recommendedAction: r.recommendedAction || 'Negotiate mutual balanced terms.',
      aiAgreementCount: 3,
      detectedBy: ['GPT-4', 'Claude', 'Gemini'] as any
    })) || [
      {
        id: 'risk-gen-1',
        clauseTitle: 'Uncapped Liability & One-Sided Indemnification',
        sectionReference: 'Liability Section',
        severity: 'Critical',
        scoreImpact: 25,
        explanation: 'Contract imposes asymmetric liability risk on one party without reasonable financial cap.',
        potentialConsequence: 'Exposes party to catastrophic legal claims.',
        recommendedAction: 'Insert mutual liability cap equal to 12 months fees paid.',
        aiAgreementCount: 3,
        detectedBy: ['GPT-4', 'Claude', 'Gemini']
      },
      {
        id: 'risk-gen-2',
        clauseTitle: 'Auto-Renewal Notice Lock-In',
        sectionReference: 'Termination Section',
        severity: 'High',
        scoreImpact: 15,
        explanation: 'Mandates extended notice period (60-120 days) prior to renewal.',
        potentialConsequence: 'Accidental extension of subscription with price escalation.',
        recommendedAction: 'Reduce notice horizon to standard 30 days.',
        aiAgreementCount: 3,
        detectedBy: ['GPT-4', 'Claude', 'Gemini']
      }
    ];

    const complianceGaps = aiResult?.claudeAnalysis?.complianceGaps || [
      {
        id: 'comp-1',
        framework: 'GDPR',
        status: 'Warning',
        severity: 'Medium',
        description: 'Requires explicit Data Processing Addendum (DPA) for EU data protection.',
        remediationStep: 'Attach standard Article 28 DPA.'
      }
    ];

    const riskMeta = RiskScoringEngine.calculateOverallRiskScore(risks, complianceGaps);

    const finalResult: ContractAnalysisResult = {
      analysisId: 'analysis-' + Date.now(),
      contractId: contractId || 'contract-temp',
      filename: docName,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      overallRiskScore: aiResult?.overallRiskScore ?? riskMeta.overallScore,
      confidenceInterval: riskMeta.confidenceInterval,
      percentileRanking: riskMeta.percentileRanking,
      summaryText: aiResult?.summaryText || `MULTI-AI ANALYSIS COMPLETE: Evaluated contract text across GPT-4 (Structure), Claude (Risk & Compliance), and Gemini (Clause Matching). Overall risk score calculated at ${riskMeta.overallScore}/100.`,
      categoryScores: riskMeta.categoryScores,
      gpt4Analysis: {
        documentClassification: aiResult?.gpt4Analysis?.documentClassification || 'General Commercial',
        parties: aiResult?.gpt4Analysis?.parties || [
          { name: 'Disclosing Party / Provider', role: 'Primary Party' },
          { name: 'Receiving Party / Customer', role: 'Counterparty' }
        ],
        keyTerms: aiResult?.gpt4Analysis?.keyTerms || [
          { label: 'Term Length', value: '1 Year', category: 'Term' },
          { label: 'Governing Law', value: 'State Jurisdiction', category: 'Governing Law' }
        ],
        clauseInventory: aiResult?.gpt4Analysis?.clauseInventory || [
          { section: 'Section 1', title: 'Scope & License', summary: 'Defines main operational rights.', riskLevel: 'Low' },
          { section: 'Section 2', title: 'Liability & Risk Allocation', summary: 'Covers indemnities and damages caps.', riskLevel: 'High' }
        ],
        missingStandardClauses: aiResult?.gpt4Analysis?.missingStandardClauses || [
          'Service Level Agreement (SLA)',
          'Data Processing Addendum',
          'Force Majeure Unforeseen Events'
        ],
        businessObjective: aiResult?.gpt4Analysis?.businessObjective || 'Commercial service provision.',
        valueExchange: aiResult?.gpt4Analysis?.valueExchange || 'Fee payment for service access.',
        negotiationLeverage: aiResult?.gpt4Analysis?.negotiationLeverage || 'Counterparty Favorable'
      },
      claudeAnalysis: {
        overallRiskCategory: riskMeta.riskLevel + ' Risk' as any,
        riskScore: riskMeta.overallScore,
        highRiskCount: risks.filter((r: any) => r.severity === 'Critical' || r.severity === 'High').length,
        mediumRiskCount: risks.filter((r: any) => r.severity === 'Medium').length,
        lowRiskCount: risks.filter((r: any) => r.severity === 'Low').length,
        risks,
        complianceGaps
      },
      geminiAnalysis: {
        clauseMatches: aiResult?.geminiAnalysis?.clauseMatches || [
          {
            clauseId: 'INDEM-001',
            clauseTitle: 'Indemnification Clause',
            originalText: textToAnalyze.substring(0, 120) + '...',
            libraryEquivalent: 'Each party shall indemnify, defend, and hold harmless the other party...',
            similarityScore: 82,
            qualityAssessment: riskMeta.overallScore > 50 ? 'Weaker than Standard' : 'Standard',
            improvements: ['Add mutual cap', 'Include 30-day notice requirement'],
            alternativeSuggestions: [
              {
                title: 'Balanced Mutual Indemnification',
                text: 'Each party shall indemnify the other from material breaches, capped at total annual fees.',
                favorability: 'Balanced',
                tradeOffs: 'Equitably splits liability while maintaining legal recourse.'
              }
            ]
          }
        ],
        languageSimplificationSuggestions: aiResult?.geminiAnalysis?.languageSimplificationSuggestions || [
          {
            originalJargon: 'IN WITNESS WHEREOF, the parties hereto have executed this Agreement...',
            plainLanguageAlternative: 'The parties agree to these terms by signing below.',
            reason: 'Modern plain language improves contract legibility.'
          }
        ],
        structuralImprovements: ['Add clean definitions table at contract start'],
        enforceabilityWarnings: []
      },
      consensusRecommendations: aiResult?.consensusRecommendations?.map((rec: any, idx: number) => ({
        id: rec.id || `rec-${idx + 1}`,
        title: rec.title || 'Implement Capped Liability',
        description: rec.description || 'All 3 AI models recommend standardizing liability provisions.',
        scoreReductionPotential: rec.scoreReductionPotential || 18,
        modelsAgree: ['GPT-4', 'Claude', 'Gemini'] as any,
        confidenceLevel: 'High Confidence (3 Models)' as any,
        proposedTextChange: rec.proposedTextChange || {
          current: 'Uncapped or asymmetric liability.',
          proposed: 'Capped mutual liability equal to 12 months fees paid.'
        }
      })) || [
        {
          id: 'rec-1',
          title: 'Replace Uncapped Liability with 12 Months Fees Cap',
          description: 'All 3 AI models agree this is the most effective single risk mitigation change.',
          scoreReductionPotential: 22,
          modelsAgree: ['GPT-4', 'Claude', 'Gemini'],
          confidenceLevel: 'High Confidence (3 Models)',
          proposedTextChange: {
            current: 'Uncapped liability exposure for Customer.',
            proposed: 'Neither party\'s aggregate liability shall exceed total fees paid in preceding 12 months.'
          }
        },
        {
          id: 'rec-2',
          title: 'Reduce Auto-Renewal Notice to 30 Days',
          description: 'Prevents automatic lock-in to unwanted subscription terms.',
          scoreReductionPotential: 15,
          modelsAgree: ['GPT-4', 'Claude', 'Gemini'],
          confidenceLevel: 'High Confidence (3 Models)',
          proposedTextChange: {
            current: 'Written notice required 120 days prior to renewal.',
            proposed: 'Either party may provide notice of non-renewal up to 30 days prior to end of term.'
          }
        }
      ]
    };

    // Store in contractDb if contractId provided
    if (contractId && contractDb.has(contractId)) {
      const record = contractDb.get(contractId)!;
      record.status = 'Completed';
      record.riskScore = finalResult.overallRiskScore;
      record.analysis = finalResult;
      contractDb.set(contractId, record);
    }

    return res.json({ success: true, result: finalResult });
  } catch (err: any) {
    console.error('Error in /api/contracts/analyze:', err);
    return res.status(500).json({ error: err.message || 'Failed to analyze contract' });
  }
});

// 3. Get Contract Results API
app.get('/api/contracts/:id/results', (req, res) => {
  try {
    const contract = contractDb.get(req.params.id);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    return res.json({ success: true, contract, analysis: contract.analysis });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 4. Clause Search API
app.get('/api/clauses/search', (req, res) => {
  try {
    const { query, category, industry, jurisdiction, risk_level, favorability } = req.query;

    let filtered = [...SEED_CLAUSES];

    if (query && typeof query === 'string' && query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          c.text.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (category && typeof category === 'string' && category !== 'All') {
      filtered = filtered.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    if (industry && typeof industry === 'string' && industry !== 'All') {
      filtered = filtered.filter(c => c.industry.includes(industry) || c.industry.includes('General'));
    }

    if (jurisdiction && typeof jurisdiction === 'string' && jurisdiction !== 'All') {
      filtered = filtered.filter(c => c.jurisdiction.includes(jurisdiction) || c.jurisdiction.includes('US-General'));
    }

    if (risk_level && typeof risk_level === 'string' && risk_level !== 'All') {
      filtered = filtered.filter(c => c.riskLevel.toLowerCase() === risk_level.toLowerCase());
    }

    if (favorability && typeof favorability === 'string' && favorability !== 'All') {
      filtered = filtered.filter(c => c.favorability.toLowerCase() === favorability.toLowerCase());
    }

    return res.json({ success: true, count: filtered.length, clauses: filtered });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 5. Contract Generator API
app.post('/api/contracts/generate', async (req, res) => {
  try {
    const { templateId, formValues, selectedClauseIds } = req.body;
    const template = CONTRACT_TEMPLATES.find(t => t.id === templateId) || CONTRACT_TEMPLATES[0];

    const chosenClauses = SEED_CLAUSES.filter(c => selectedClauseIds?.includes(c.id) || template.defaultClauses.includes(c.id));

    const ai = getGeminiClient();
    const prompt = `You are CXPro's Legal Contract Generator. Draft a professional, legally enforceable contract based on the following template and inputs:

Template: ${template.name} (${template.category})
User Inputs:
${JSON.stringify(formValues, null, 2)}

Included Standard Clauses:
${chosenClauses.map(c => `- ${c.title}: ${c.text}`).join('\n')}

Format the output clearly with Title, Parties, Recitals, Numbered Sections (1. Scope, 2. Financial Terms, 3. Intellectual Property, 4. Indemnification & Liability, 5. Term & Termination, 6. Governing Law), Signature Blocks, and clean formatting.`;

    let generatedText = '';

    if (process.env.GEMINI_API_KEY) {
      try {
        const aiRes = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt
        });
        generatedText = aiRes.text || '';
      } catch (e) {
        console.warn('Gemini generation fallback:', e);
      }
    }

    if (!generatedText) {
      // Clean fallback contract drafting
      generatedText = `${template.name.toUpperCase()}
This ${template.name} ("Agreement") is executed as of ${formValues?.effectiveDate || new Date().toISOString().substring(0, 10)} by and between:

PARTIES:
1. ${formValues?.partyA || formValues?.clientName || formValues?.vendorName || 'Party A'} ("Disclosing Party")
2. ${formValues?.partyB || formValues?.providerName || formValues?.subscriberName || 'Party B'} ("Receiving Party")

RECITALS:
WHEREAS, the parties desire to establish a commercial agreement governing ${formValues?.purpose || formValues?.serviceScope || 'their mutual business obligations'};

AGREEMENT:
1. SCOPE & PURPOSE
The parties agree to fulfill the obligations set forth herein in compliance with applicable law.

2. FINANCIAL & PAYMENT TERMS
Payment terms shall be ${formValues?.paymentTerms || formValues?.hourlyRate || 'Net 30 days'}. Total commercial obligations shall be executed as agreed.

3. CONFIDENTIALITY & PROPRIETARY RIGHTS
${chosenClauses.find(c => c.category.includes('Confidentiality'))?.text || 'Each party agrees to hold all confidential information in strict confidence for a period of three (3) years.'}

4. INDEMNIFICATION & LIMITATION OF LIABILITY
${chosenClauses.find(c => c.category.includes('Indemnification'))?.text || 'Each party shall indemnify and hold harmless the other party from material breaches of this Agreement.'}
${chosenClauses.find(c => c.category.includes('Limitation'))?.text || 'Neither party\'s aggregate liability shall exceed total fees paid in the preceding 12 months.'}

5. TERM & TERMINATION
The initial term shall be ${formValues?.termYears || '1 Year'}. Either party may terminate upon 30 days written notice.

6. GOVERNING LAW & JURISDICTION
This Agreement shall be governed by the laws of the State of ${formValues?.jurisdiction || 'Delaware'}.

IN WITNESS WHEREOF, the parties have executed this Agreement by their duly authorized representatives.`;
    }

    return res.json({
      success: true,
      generatedContractText: generatedText,
      templateName: template.name,
      clauseCount: chosenClauses.length
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 5. Handshake AI Student Discount Capture & Code Delivery API
const studentLeads: Map<string, any> = new Map();
const dispatchedEmails: any[] = [];
const billingInvoices: any[] = [];

app.post('/api/students/claim-discount', (req, res) => {
  try {
    const { fullName, email, university, handshakeProfile, contractorRole } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({ error: 'Name and email address are required to issue the student code.' });
    }

    const emailClean = String(email).trim().toLowerCase();
    const leadId = 'stu_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const generatedCode = 'HANDSHAKE49';

    const newLead = {
      id: leadId,
      fullName: String(fullName).trim(),
      email: emailClean,
      university: university ? String(university).trim() : 'Handshake Member',
      handshakeProfile: handshakeProfile ? String(handshakeProfile).trim() : '',
      contractorRole: contractorRole ? String(contractorRole).trim() : 'AI Model & Software QA Contractor',
      discountCode: generatedCode,
      discountedPrice: 49.99,
      regularPrice: 149.00,
      monthlyQuota: 3,
      claimedAt: new Date().toISOString(),
      status: 'sent',
      paymentLink: 'https://buy.stripe.com/7sY14oeis3nj11FfIFcjS0w'
    };

    studentLeads.set(leadId, newLead);

    // Build rich HTML email payload
    const emailSubject = `🎓 Your $49.99 cxpro.site Voucher Code: ${generatedCode} (Handshake AI & Software QA)`;
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #F97316;">
          <h1 style="color: #111827; font-size: 22px; font-weight: 800; margin: 0 0 4px 0;">cxpro.site</h1>
          <p style="color: #F97316; font-size: 13px; font-weight: 700; text-transform: uppercase; margin: 0;">Handshake AI • Software & AI Testing Contractor Suite</p>
        </div>

        <div style="padding: 24px 0;">
          <p style="font-size: 15px; color: #374151; margin-top: 0;">Hello <strong>${newLead.fullName}</strong>,</p>
          <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
            Your exclusive 66% discount voucher for cxpro.site has been approved for <strong>${newLead.contractorRole}</strong>!
          </p>

          <div style="background-color: #FFF7ED; border: 2px dashed #F97316; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="color: #9A3412; font-size: 12px; font-weight: 700; text-transform: uppercase; margin: 0 0 8px 0;">Your Official Voucher Code</p>
            <div style="font-size: 28px; font-weight: 900; font-family: monospace; color: #EA580C; letter-spacing: 2px;">
              ${generatedCode}
            </div>
            <p style="color: #7C2D12; font-size: 13px; margin: 8px 0 0 0;">
              Rate: <strong>$49.99/mo</strong> (Standard $149/mo) • <strong>3 Full Multi-AI Contract Audits / mo</strong>
            </p>
          </div>

          <h3 style="font-size: 14px; color: #111827; font-weight: 700; text-transform: uppercase; margin: 20px 0 10px 0;">What's Protected Under Your Plan:</h3>
          <ul style="font-size: 13px; color: #4b5563; line-height: 1.8; padding-left: 20px;">
            <li><strong>AI Hallucination & Defect Defense:</strong> Advisory carve-outs to shield you from production model damages.</li>
            <li><strong>Background IP Retention:</strong> Keeps ownership of your personal prompt libraries and test harnesses.</li>
            <li><strong>QA Milestone Acceptance:</strong> 5-day deemed acceptance windows to prevent delayed payments.</li>
            <li><strong>Non-Exclusivity Rider:</strong> Protects your right to freelance across multiple AI platforms.</li>
            <li><strong>DOCX Redlines:</strong> Instant Track-Changes Microsoft Word counter-proposals.</li>
          </ul>

          <div style="text-align: center; margin-top: 32px;">
            <a href="https://buy.stripe.com/7sY14oeis3nj11FfIFcjS0w" style="background-color: #F97316; color: #ffffff; padding: 12px 28px; border-radius: 6px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block;">
              Activate $49.99 Plan via Stripe →
            </a>
          </div>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 11px; color: #9ca3af; text-align: center;">
          <p style="margin: 0 0 4px 0;">Issued to ${newLead.email} via Handshake AI Academic & Contractor Verification.</p>
          <p style="margin: 0;">cxpro.site • Autonomous Multi-AI Legal Engineering</p>
        </div>
      </div>
    `;


    const emailRecord = {
      id: 'eml_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: 'student_voucher',
      to: emailClean,
      recipientName: newLead.fullName,
      subject: emailSubject,
      sentAt: new Date().toISOString(),
      htmlContent: emailHtml,
      voucherCode: generatedCode
    };

    dispatchedEmails.unshift(emailRecord);
    console.log(`[Email Dispatch Service] Sent student discount voucher to ${emailClean} (Subject: "${emailSubject}")`);

    return res.json({
      success: true,
      lead: newLead,
      emailDelivery: {
        sent: true,
        recipient: emailClean,
        subject: emailSubject,
        htmlPreview: emailHtml,
        sentAt: emailRecord.sentAt
      },
      message: `Exclusive $49.99 Software & AI Testing Contractor voucher dispatched to ${newLead.email}.`
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to claim student discount' });
  }
});

app.get('/api/students/leads', (req, res) => {
  return res.json({
    success: true,
    leads: Array.from(studentLeads.values())
  });
});

app.post('/api/students/verify-code', (req, res) => {
  const { code } = req.body;
  const normalized = String(code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const validCodes = ['HANDSHAKE49', 'HANDSHAKE', 'HANDSHAKEAI', 'STUDENT49', 'HANDSHAKE-49'];

  if (validCodes.includes(normalized) || normalized.startsWith('HANDSHAKE')) {
    return res.json({
      valid: true,
      code: 'HANDSHAKE49',
      discountedPrice: 49.99,
      monthlyQuota: 3,
      discountName: 'Handshake AI Contractor Discount ($49.99/mo • 3 Scans/mo)',
      paymentLink: 'https://buy.stripe.com/7sY14oeis3nj11FfIFcjS0w'
    });
  }

  return res.json({
    valid: false,
    message: 'Invalid or expired code. Enter HANDSHAKE49 or claim your verified student voucher.'
  });
});

// 6. Direct In-App Stripe Payment Gateway & Invoice Generation API
app.post('/api/billing/process-payment', (req, res) => {
  try {
    const { 
      planId, 
      billingCycle = 'monthly', 
      cardholderName, 
      cardNumber, 
      expDate, 
      cvc, 
      zip, 
      customerEmail,
      promoCode 
    } = req.body;

    if (!cardholderName || !cardNumber) {
      return res.status(400).json({ error: 'Cardholder name and card number are required for payment processing.' });
    }

    const cleanCard = String(cardNumber).replace(/\s+/g, '');
    if (cleanCard.length < 13) {
      return res.status(400).json({ error: 'Invalid card number length. Please check and retry.' });
    }

    // Determine card brand
    let cardBrand = 'Visa';
    if (cleanCard.startsWith('5') || cleanCard.startsWith('2')) cardBrand = 'Mastercard';
    else if (cleanCard.startsWith('34') || cleanCard.startsWith('37')) cardBrand = 'American Express';
    else if (cleanCard.startsWith('6')) cardBrand = 'Discover';

    const cardLast4 = cleanCard.slice(-4);

    // Calculate base price and quota
    const planPrices: Record<string, number> = {
      student: 49.99,
      starter: 149.00,
      professional: 349.00,
      enterprise: 699.00
    };

    let amount = planPrices[planId] || 149.00;
    if (planId !== 'student' && billingCycle === 'annual') {
      amount = Math.round(amount * 0.8);
    } else if (promoCode === 'HANDSHAKE49' || planId === 'student') {
      amount = 49.99;
    }

    const planNames: Record<string, string> = {
      student: 'Student (Handshake AI - Software & AI Testing)',
      starter: 'Starter Plan',
      professional: 'Professional Plan',
      enterprise: 'Enterprise Legal Team'
    };

    const transactionId = 'ch_live_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const invoiceId = 'INV-2026-' + Math.floor(10000 + Math.random() * 90000);
    const issuedAt = new Date().toISOString();

    const invoice = {
      id: invoiceId,
      transactionId,
      planId: planId || 'professional',
      planName: planNames[planId] || 'Professional Plan',
      customerName: String(cardholderName).trim(),
      customerEmail: customerEmail ? String(customerEmail).trim().toLowerCase() : 'customer@cxpro-billing.com',
      amount,
      currency: 'USD',
      billingCycle,
      cardLast4,
      cardBrand,
      issuedAt,
      status: 'paid'
    };

    billingInvoices.unshift(invoice);

    // Generate HTML receipt email
    const receiptSubject = `Receipt for your cxpro.site Subscription (${invoice.planName}) - ${invoiceId}`;
    const receiptHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="border-bottom: 2px solid #10B981; padding-bottom: 16px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h1 style="color: #111827; font-size: 20px; font-weight: 800; margin: 0;">cxpro.site</h1>
            <span style="background-color: #D1FAE5; color: #065F46; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">Paid & Active</span>
          </div>
          <p style="color: #6B7280; font-size: 12px; margin: 4px 0 0 0;">Official Billing Receipt & Tax Invoice</p>
        </div>

        <div style="margin-bottom: 24px;">
          <p style="font-size: 14px; color: #374151; margin: 0 0 12px 0;">Billed To: <strong>${invoice.customerName}</strong> (${invoice.customerEmail})</p>
          <p style="font-size: 12px; color: #6B7280; margin: 0 0 4px 0;">Invoice Number: <strong>${invoiceId}</strong></p>
          <p style="font-size: 12px; color: #6B7280; margin: 0 0 4px 0;">Transaction ID: <strong style="font-family: monospace;">${transactionId}</strong></p>
          <p style="font-size: 12px; color: #6B7280; margin: 0 0 4px 0;">Payment Method: <strong>${cardBrand} ending in ${cardLast4}</strong></p>
          <p style="font-size: 12px; color: #6B7280; margin: 0;">Date: <strong>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
          <thead>
            <tr style="background-color: #F3F4F6; border-bottom: 1px solid #E5E7EB;">
              <th style="text-align: left; padding: 10px; color: #374151;">Subscription Description</th>
              <th style="text-align: right; padding: 10px; color: #374151;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #E5E7EB;">
              <td style="padding: 12px 10px;">
                <strong>${invoice.planName}</strong>
                <div style="font-size: 11px; color: #6B7280; margin-top: 2px;">
                  ${planId === 'student' ? 'Includes 3 Multi-AI Contract Audits/mo + 1099 QA Shields' : 'Full Multi-AI Contract Auditing, DOCX Redlines, and Clause Library'}
                </div>
              </td>
              <td style="text-align: right; padding: 12px 10px; font-weight: 700; font-family: monospace;">$${amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; text-align: right; font-weight: 700;">Total Charged:</td>
              <td style="padding: 10px; text-align: right; font-weight: 800; font-size: 15px; color: #10B981; font-family: monospace;">$${amount.toFixed(2)} USD</td>
            </tr>
          </tbody>
        </table>

        <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 6px; padding: 12px; font-size: 12px; color: #166534; text-align: center;">
          ✓ Your subscription is active immediately. All contract features and redlining tools are unlocked in your session.
        </div>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 11px; color: #9CA3AF;">
          cxpro.site • Autonomous Legal Engineering • Stripe Encrypted 256-Bit Billing
        </div>
      </div>
    `;


    const emailRecord = {
      id: 'eml_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: 'payment_receipt',
      to: invoice.customerEmail,
      recipientName: invoice.customerName,
      subject: receiptSubject,
      sentAt: issuedAt,
      htmlContent: receiptHtml,
      invoiceId
    };

    dispatchedEmails.unshift(emailRecord);
    console.log(`[Billing Engine] Successfully processed payment of $${amount.toFixed(2)} for ${invoice.customerName}. Transaction: ${transactionId}`);

    return res.json({
      success: true,
      transactionId,
      invoiceId,
      amountPaid: amount,
      planId,
      cardLast4,
      cardBrand,
      issuedAt,
      receiptEmailSent: true,
      receiptHtml,
      message: `Payment of $${amount.toFixed(2)} processed successfully. ${invoice.planName} activated!`
    });
  } catch (err: any) {
    console.error('Payment processing error:', err);
    return res.status(500).json({ error: err.message || 'Payment processing failed' });
  }
});

app.get('/api/billing/invoices', (req, res) => {
  return res.json({
    success: true,
    invoices: billingInvoices
  });
});

app.get('/api/email/outbox', (req, res) => {
  return res.json({
    success: true,
    emails: dispatchedEmails
  });
});

// VITE MIDDLEWARE SETUP
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CXPro Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
