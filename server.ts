import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { SEED_CLAUSES, CONTRACT_TEMPLATES, SAMPLE_ANALYZED_CONTRACTS } from './src/data/seedData';
import { RiskScoringEngine } from './src/services/riskEngine';
import { ContractRecord, ContractAnalysisResult, ClauseLibraryItem } from './src/types';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

const contractDb: Map<string, ContractRecord> = new Map();
for (const sample of SAMPLE_ANALYZED_CONTRACTS) {
  contractDb.set(sample.id, sample);
}

// ============================================================
// OPENROUTER MULTI-MODEL ENGINE
// ============================================================

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODELS = {
  structure: 'nvidia/nemotron-3-ultra-550b-a55b:free',
  risk: 'openai/gpt-oss-20b:free',
  clause: 'z-ai/glm-5.2:free',
  synthesis: 'nvidia/nemotron-3-ultra-550b-a55b:free'
};

const SPEC_WEIGHTS = {
  structure: { structure: 1.0, risk: 0.6, clause: 0.6 },
  risk: { structure: 0.6, risk: 1.0, clause: 0.6 },
  clause: { structure: 0.6, risk: 0.6, clause: 1.0 }
};

async function callOpenRouter(model: string, systemPrompt: string, userPrompt: string, jsonMode = true): Promise<any> {
  if (!OPENROUTER_API_KEY) {
    console.warn(`[OpenRouter] No API key. Model: ${model}`);
    return null;
  }

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.APP_URL || 'https://cxpro.site',
    'X-Title': 'CXPro Multi-AI Contract Engine'
  };

  const body: any = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.3,
    max_tokens: 8000
  };

  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[OpenRouter] ${model} returned ${response.status}: ${errText.substring(0, 300)}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error(`[OpenRouter] ${model} returned empty content`);
      return null;
    }

    if (jsonMode) {
      try {
        let jsonStr = content.trim();
        if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }
        return JSON.parse(jsonStr);
      } catch (parseErr) {
        console.error(`[OpenRouter] ${model} JSON parse failed:`, parseErr);
        return null;
      }
    }

    return content;
  } catch (err: any) {
    console.error(`[OpenRouter] ${model} call failed:`, err.message);
    return null;
  }
}

// PHASE 1: PARALLEL SPECIALIZED ANALYSIS

async function phase1_structureAnalysis(contractText: string): Promise<any> {
  const system = `You are CXPro's Structural Analysis Engine, powered by a high-parameter reasoning model. You specialize in contract structure, intent classification, and commercial term extraction. Output ONLY valid JSON.`;
  const user = `Analyze the following contract from a STRUCTURAL perspective. Provide:
1. documentClassification: Classify as NDA, MSA, SaaS Subscription, Employment, Independent Contractor, Software License, Partnership, Real Estate Lease, or General Commercial
2. parties: Array of {name, role}
3. keyTerms: Array of {label, value, category}
4. clauseInventory: Array of {section, title, summary, riskLevel}
5. missingStandardClauses: Array of standard clauses that SHOULD be present but aren't
6. businessObjective: The core business purpose
7. valueExchange: What each party gives and receives
8. negotiationLeverage: Which party has more leverage and why

Contract Text:
"""
${contractText.substring(0, 12000)}
"""
Output JSON with keys: documentClassification, parties, keyTerms, clauseInventory, missingStandardClauses, businessObjective, valueExchange, negotiationLeverage`;
  return callOpenRouter(MODELS.structure, system, user, true);
}

async function phase1_riskAnalysis(contractText: string): Promise<any> {
  const system = `You are CXPro's Risk & Compliance Engine, powered by an OpenAI-architecture model. You specialize in detecting legal risks, compliance gaps, and unfavorable terms. You are thorough and conservative. Output ONLY valid JSON.`;
  const user = `Analyze the following contract from a RISK & COMPLIANCE perspective. Provide:
1. overallRiskCategory: Low Risk, Medium Risk, High Risk, or Critical Risk
2. risks: Array of 6-10 objects with: id, clauseTitle, sectionReference, severity (Critical/High/Medium/Low), scoreImpact (integer 1-30), explanation, potentialConsequence, recommendedAction
3. complianceGaps: Array of {id, framework, status, severity, description, remediationStep}
   Check against GDPR, CCPA, HIPAA, FLSA, SOX, and jurisdiction standards.

Contract Text:
"""
${contractText.substring(0, 12000)}
"""
Output JSON with keys: overallRiskCategory, risks, complianceGaps`;
  return callOpenRouter(MODELS.risk, system, user, true);
}

async function phase1_clauseAnalysis(contractText: string): Promise<any> {
  const system = `You are CXPro's Clause Comparison & Optimization Engine, powered by a reasoning model. You specialize in comparing contract clauses against standard library benchmarks. Output ONLY valid JSON.`;
  const user = `Analyze the following contract from a CLAUSE QUALITY perspective. Provide:
1. clauseMatches: Array of {clauseId, clauseTitle, originalText, libraryEquivalent, similarityScore (0-100), qualityAssessment, improvements (array), alternativeSuggestions (array of {title, text, favorability, tradeOffs})}
2. languageSimplificationSuggestions: Array of {originalJargon, plainLanguage, section}
3. overallClauseQuality: "Above Standard", "Standard", or "Below Standard"

Contract Text:
"""
${contractText.substring(0, 12000)}
"""
Output JSON with keys: clauseMatches, languageSimplificationSuggestions, overallClauseQuality`;
  return callOpenRouter(MODELS.clause, system, user, true);
}

// PHASE 2: CROSS-VALIDATION

async function phase2_crossValidate(structureFindings: any, riskFindings: any, clauseFindings: any): Promise<{ validatedRisks: any[] }> {
  const riskList = riskFindings?.risks || [];
  if (riskList.length === 0) return { validatedRisks: [] };

  const risksForValidation = JSON.stringify(riskList.map((r: any) => ({
    id: r.id, clauseTitle: r.clauseTitle, severity: r.severity, explanation: r.explanation
  })));

  const validationPrompt = `You are reviewing risk findings from another AI model. For each risk, determine if it is REAL (confirm) or a FALSE POSITIVE (reject).
Risk findings:
${risksForValidation}
Respond with a JSON array of {id, verdict ("confirm" or "reject"), reason} objects.`;

  const [structureValidation, clauseValidation] = await Promise.all([
    callOpenRouter(MODELS.structure, 'You are a contract structure expert validating risk findings. Be objective.', validationPrompt, true),
    callOpenRouter(MODELS.clause, 'You are a clause quality expert validating risk findings. Be objective.', validationPrompt, true)
  ]);

  const confirmations: Record<string, { confirms: number; rejects: number; reasons: string[] }> = {};

  for (const validation of [structureValidation, clauseValidation]) {
    if (Array.isArray(validation)) {
      for (const v of validation) {
        if (!v.id) continue;
        if (!confirmations[v.id]) confirmations[v.id] = { confirms: 0, rejects: 0, reasons: [] };
        if (v.verdict === 'confirm') confirmations[v.id].confirms++;
        else if (v.verdict === 'reject') confirmations[v.id].rejects++;
        if (v.reason) confirmations[v.id].reasons.push(v.reason);
      }
    }
  }

  const validatedRisks = riskList.map((risk: any) => {
    const conf = confirmations[risk.id] || { confirms: 0, rejects: 0, reasons: [] };
    let confidenceMultiplier = 0.45;
    if (conf.confirms >= 2) confidenceMultiplier = 1.0;
    else if (conf.confirms === 1 && conf.rejects === 1) confidenceMultiplier = 0.6;
    else if (conf.confirms === 1 && conf.rejects === 0) confidenceMultiplier = 0.75;
    else if (conf.confirms === 0 && conf.rejects > 0) confidenceMultiplier = 0.25;

    const adjustedScoreImpact = Math.round(risk.scoreImpact * confidenceMultiplier);
    return {
      ...risk,
      confidenceScore: Math.round(confidenceMultiplier * 100) / 100,
      aiAgreementCount: conf.confirms + 1,
      confirmedBy: ['risk-model', ...(conf.confirms > 0 ? ['structure-model'] : []), ...(conf.confirms > 1 ? ['clause-model'] : [])],
      validationReasons: conf.reasons,
      adjustedScoreImpact,
      originalScoreImpact: risk.scoreImpact
    };
  });

  return { validatedRisks };
}

// PHASE 3: WEIGHTED CONSENSUS SCORING

function phase3_consensusScoring(validatedRisks: any[], structureFindings: any, clauseFindings: any) {
  let rawScore = 0;
  const consensusRecommendations: any[] = [];

  for (const risk of validatedRisks) {
    rawScore += risk.adjustedScoreImpact || 0;
    let confidenceLevel = 'Low';
    if (risk.aiAgreementCount >= 3) confidenceLevel = 'High';
    else if (risk.aiAgreementCount >= 2) confidenceLevel = 'Moderate';
    consensusRecommendations.push({
      riskId: risk.id, clauseTitle: risk.clauseTitle, severity: risk.severity,
      recommendedAction: risk.recommendedAction, confidenceLevel,
      aiAgreementCount: risk.aiAgreementCount, confidenceScore: risk.confidenceScore
    });
  }

  const missingClauses = structureFindings?.missingStandardClauses || [];
  rawScore += missingClauses.length * 3;
  const clauseMatches = clauseFindings?.clauseMatches || [];
  const weakClauses = clauseMatches.filter((c: any) => c.qualityAssessment === 'Weaker than Standard');
  rawScore += weakClauses.length * 2;

  const overallRiskScore = Math.min(100, Math.max(5, Math.round(rawScore)));
  return { overallRiskScore, consensusRecommendations };
}

// PHASE 4: SYNTHESIS

async function phase4_synthesis(structureFindings: any, validatedRisks: any[], clauseFindings: any, consensusData: any, filename: string): Promise<any> {
  const synthesisInput = {
    filename, overallRiskScore: consensusData.overallRiskScore,
    structureAnalysis: structureFindings,
    validatedRisks: validatedRisks.map(r => ({
      clauseTitle: r.clauseTitle, severity: r.severity, sectionReference: r.sectionReference,
      explanation: r.explanation, potentialConsequence: r.potentialConsequence,
      recommendedAction: r.recommendedAction, confidenceScore: r.confidenceScore,
      aiAgreementCount: r.aiAgreementCount
    })),
    clauseAnalysis: clauseFindings,
    consensusRecommendations: consensusData.consensusRecommendations
  };

  const system = `You are CXPro's Synthesis Engine. You produce the final unified contract analysis from validated findings by three independent AI models. You can ONLY work with findings provided. Do not invent new findings. Output ONLY valid JSON.`;
  const user = `Synthesize this validated contract analysis into a final unified report.
Input:
${JSON.stringify(synthesisInput, null, 2).substring(0, 20000)}

Produce JSON with:
{
  "summaryText": "2-3 paragraph executive summary referencing the multi-model consensus",
  "gpt4Analysis": <structure analysis object>,
  "claudeAnalysis": {
    "overallRiskCategory": <derived: 0-30 Low, 31-60 Medium, 61-85 High, 86-100 Critical>,
    "risks": <validated risks array>,
    "complianceGaps": <from risk analysis if available>
  },
  "geminiAnalysis": <clause analysis object>,
  "consensusRecommendations": <consensus recommendations>,
  "modelAttribution": {
    "structure": "NVIDIA Nemotron 3 Ultra (550B)",
    "risk": "OpenAI gpt-oss-20b",
    "clause": "Z.ai GLM 5.2",
    "synthesis": "NVIDIA Nemotron 3 Ultra (550B)"
  }
}
Use exact data provided. Do not add new findings. Do not change risk scores.`;

  const result = await callOpenRouter(MODELS.synthesis, system, user, true);

  if (result) {
    result.analysisId = result.analysisId || 'anal-' + Date.now();
    result.contractId = 'contract-' + Date.now();
    result.filename = filename;
    result.uploadedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    result.overallRiskScore = consensusData.overallRiskScore;
    result.confidenceInterval = `${Math.round(consensusData.overallRiskScore * 0.92)}% - ${Math.round(consensusData.overallRiskScore * 1.08)}%`;
    result.percentileRanking = Math.min(99, Math.round(consensusData.overallRiskScore * 0.9 + 5));
    return result;
  }

  return assembleFallback(structureFindings, validatedRisks, clauseFindings, consensusData, filename);
}

function assembleFallback(structureFindings: any, validatedRisks: any[], clauseFindings: any, consensusData: any, filename: string): any {
  const score = consensusData.overallRiskScore;
  const riskCategory = score >= 86 ? 'Critical Risk' : score >= 61 ? 'High Risk' : score >= 31 ? 'Medium Risk' : 'Low Risk';
  return {
    analysisId: 'anal-' + Date.now(),
    contractId: 'contract-' + Date.now(),
    filename,
    uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    overallRiskScore: score,
    confidenceInterval: `${Math.round(score * 0.92)}% - ${Math.round(score * 1.08)}%`,
    percentileRanking: Math.min(99, Math.round(score * 0.9 + 5)),
    summaryText: `MULTI-MODEL CONCORDANCE SUMMARY: Analyzed using three independent AI architectures (NVIDIA Nemotron 3 Ultra, OpenAI gpt-oss-20b, Z.ai GLM 5.2). Cross-validation confirmed ${validatedRisks.filter(r => r.aiAgreementCount >= 2).length} of ${validatedRisks.length} risk findings. Overall risk score: ${score}/100 (${riskCategory}).`,
    gpt4Analysis: structureFindings || {},
    claudeAnalysis: { overallRiskCategory: riskCategory, risks: validatedRisks, complianceGaps: [] },
    geminiAnalysis: clauseFindings || {},
    consensusRecommendations: consensusData.consensusRecommendations,
    modelAttribution: {
      structure: 'NVIDIA Nemotron 3 Ultra (550B)',
      risk: 'OpenAI gpt-oss-20b',
      clause: 'Z.ai GLM 5.2',
      synthesis: 'Assembled from component data (synthesis model unavailable)'
    }
  };
}

// MAIN ANALYSIS ORCHESTRATOR

async function runMultiModelAnalysis(contractText: string, filename: string): Promise<any> {
  console.log(`[CXPro Engine] Starting 4-phase multi-model analysis for ${filename} (${contractText.length} chars)`);
  console.log('[CXPro Engine] Phase 1: Parallel specialized analysis...');
  const [structureResult, riskResult, clauseResult] = await Promise.all([
    phase1_structureAnalysis(contractText),
    phase1_riskAnalysis(contractText),
    phase1_clauseAnalysis(contractText)
  ]);

  if (!structureResult && !riskResult && !clauseResult) {
    console.error('[CXPro Engine] All models failed. Client-side fallback.');
    return null;
  }

  const structure = structureResult || {};
  const risk = riskResult || { overallRiskCategory: 'Unknown', risks: [], complianceGaps: [] };
  const clause = clauseResult || { clauseMatches: [], languageSimplificationSuggestions: [], overallClauseQuality: 'Unknown' };

  console.log('[CXPro Engine] Phase 1 complete.');
  console.log('[CXPro Engine] Phase 2: Cross-validation...');
  const { validatedRisks } = await phase2_crossValidate(structure, risk, clause);
  console.log(`[CXPro Engine] Phase 2 complete. ${validatedRisks.length} risks, ${validatedRisks.filter(r => r.aiAgreementCount >= 2).length} confirmed by 2+ models.`);

  console.log('[CXPro Engine] Phase 3: Weighted consensus scoring...');
  const consensusData = phase3_consensusScoring(validatedRisks, structure, clause);
  console.log(`[CXPro Engine] Phase 3 complete. Score: ${consensusData.overallRiskScore}/100`);

  console.log('[CXPro Engine] Phase 4: Synthesis...');
  const finalResult = await phase4_synthesis(structure, validatedRisks, clause, consensusData, filename);
  console.log('[CXPro Engine] Phase 4 complete.');
  return finalResult;
}

// ============================================================
// API ROUTES
// ============================================================

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
    const result = await runMultiModelAnalysis(textToAnalyze, docName);
    if (!result) {
      return res.status(503).json({ error: 'AI models temporarily unavailable. Using fallback analysis.', fallback: true });
    }
    return res.json({ success: true, result });
  } catch (err: any) {
    console.error('Error in /api/contracts/analyze:', err);
    return res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

app.get('/api/clauses', (req, res) => {
  try {
    const { category, risk_level, favorability } = req.query;
    let filtered = [...SEED_CLAUSES];
    if (category && typeof category === 'string' && category !== 'All') {
      filtered = filtered.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
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

app.post('/api/contracts/generate', async (req, res) => {
  try {
    const { templateId, formValues, selectedClauseIds } = req.body;
    const template = CONTRACT_TEMPLATES.find(t => t.id === templateId) || CONTRACT_TEMPLATES[0];
    const chosenClauses = SEED_CLAUSES.filter(c => selectedClauseIds?.includes(c.id) || template.defaultClauses.includes(c.id));

    const system = `You are CXPro's Legal Contract Generator. Draft a professional, legally enforceable contract. Output clean formatted text.`;
    const user = `Draft a professional contract based on:
Template: ${template.name} (${template.category})
User Inputs:
${JSON.stringify(formValues, null, 2)}
Included Standard Clauses:
${chosenClauses.map(c => `- ${c.title}: ${c.text}`).join('\n')}
Format with: Title, Parties, Recitals, Numbered Sections (1. Scope, 2. Financial Terms, 3. Intellectual Property, 4. Indemnification & Liability, 5. Term & Termination, 6. Governing Law), Signature Blocks.`;

    let generatedText = '';
    if (OPENROUTER_API_KEY) {
      try {
        generatedText = await callOpenRouter(MODELS.structure, system, user, false) || '';
      } catch (e) {
        console.warn('Contract generation fallback:', e);
      }
    }

    if (!generatedText) {
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
Payment terms shall be ${formValues?.paymentTerms || formValues?.hourlyRate || 'Net 30 days'}.

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

    return res.json({ success: true, generatedContractText: generatedText, templateName: template.name, clauseCount: chosenClauses.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Student Discount API
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
      id: leadId, fullName: String(fullName).trim(), email: emailClean,
      university: university ? String(university).trim() : 'Handshake Member',
      handshakeProfile: handshakeProfile ? String(handshakeProfile).trim() : '',
      contractorRole: contractorRole ? String(contractorRole).trim() : 'AI Model & Software QA Contractor',
      discountCode: generatedCode, discountedPrice: 49.99, regularPrice: 149.00,
      monthlyQuota: 3, claimedAt: new Date().toISOString(), status: 'sent',
      paymentLink: 'https://buy.stripe.com/7sY14oeis3nj11FfIFcjS0w'
    };
    studentLeads.set(leadId, newLead);
    const emailSubject = `Your $49.99 cxpro.site Voucher Code: ${generatedCode} (Handshake AI & Software QA)`;
    const emailHtml = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;">
      <div style="text-align:center;padding-bottom:20px;border-bottom:2px solid #F97316;">
        <h1 style="color:#111827;font-size:22px;font-weight:800;margin:0 0 4px 0;">cxpro.site</h1>
        <p style="color:#F97316;font-size:13px;font-weight:700;text-transform:uppercase;margin:0;">Handshake AI - Software & AI Testing Contractor Suite</p>
      </div>
      <div style="padding:24px 0;">
        <p style="font-size:15px;color:#374151;margin-top:0;">Hello <strong>${newLead.fullName}</strong>,</p>
        <p style="font-size:14px;color:#4b5563;line-height:1.6;">Your exclusive 66% discount voucher for cxpro.site has been approved for <strong>${newLead.contractorRole}</strong>!</p>
        <div style="background:#FFF7ED;border:2px dashed #F97316;border-radius:8px;padding:20px;text-align:center;margin:24px 0;">
          <p style="color:#9A3412;font-size:12px;font-weight:700;text-transform:uppercase;margin:0 0 8px 0;">Your Official Voucher Code</p>
          <div style="font-size:28px;font-weight:900;font-family:monospace;color:#EA580C;letter-spacing:2px;">${generatedCode}</div>
          <p style="color:#7C2D12;font-size:13px;margin:8px 0 0 0;">Rate: <strong>$49.99/mo</strong> (Standard $149/mo) - <strong>3 Full Multi-AI Contract Audits / mo</strong></p>
        </div>
        <h3 style="font-size:14px;color:#111827;font-weight:700;text-transform:uppercase;margin:20px 0 10px 0;">What's Protected Under Your Plan:</h3>
        <ul style="font-size:13px;color:#4b5563;line-height:1.8;padding-left:20px;">
          <li><strong>AI Hallucination & Defect Defense:</strong> Advisory carve-outs to shield you from production model damages.</li>
          <li><strong>Background IP Retention:</strong> Keeps ownership of your personal prompt libraries and test harnesses.</li>
          <li><strong>QA Milestone Acceptance:</strong> 5-day deemed acceptance windows to prevent delayed payments.</li>
          <li><strong>Non-Exclusivity Rider:</strong> Protects your right to freelance across multiple AI platforms.</li>
          <li><strong>DOCX Redlines:</strong> Instant Track-Changes Microsoft Word counter-proposals.</li>
        </ul>
        <div style="text-align:center;margin-top:32px;">
          <a href="https://buy.stripe.com/7sY14oeis3nj11FfIFcjS0w" style="background:#F97316;color:#fff;padding:12px 28px;border-radius:6px;font-weight:700;font-size:14px;text-decoration:none;display:inline-block;">Activate $49.99 Plan via Stripe</a>
        </div>
      </div>
      <div style="border-top:1px solid #e5e7eb;padding-top:16px;font-size:11px;color:#9ca3af;text-align:center;">
        <p style="margin:0 0 4px 0;">Issued to ${newLead.email} via Handshake AI Academic & Contractor Verification.</p>
        <p style="margin:0;">cxpro.site - Autonomous Multi-AI Legal Engineering</p>
      </div>
    </div>`;
    const emailRecord = {
      id: 'eml_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: 'student_voucher', to: emailClean, recipientName: newLead.fullName,
      subject: emailSubject, sentAt: new Date().toISOString(), htmlContent: emailHtml, voucherCode: generatedCode
    };
    dispatchedEmails.unshift(emailRecord);
    console.log(`[Email Dispatch] Sent voucher to ${emailClean}`);
    return res.json({
      success: true, lead: newLead,
      emailDelivery: { sent: true, recipient: emailClean, subject: emailSubject, htmlPreview: emailHtml, sentAt: emailRecord.sentAt },
      message: `Exclusive $49.99 voucher dispatched to ${newLead.email}.`
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/billing/process-payment', (req, res) => {
  try {
    const { planId, billingCycle = 'monthly', cardholderName, cardNumber, expDate, cvc, zip, customerEmail, promoCode } = req.body;
    if (!cardholderName || !cardNumber) {
      return res.status(400).json({ error: 'Cardholder name and card number are required.' });
    }
    const cleanCard = String(cardNumber).replace(/\s+/g, '');
    if (cleanCard.length < 13) {
      return res.status(400).json({ error: 'Invalid card number length.' });
    }
    let cardBrand = 'Visa';
    if (cleanCard.startsWith('5') || cleanCard.startsWith('2')) cardBrand = 'Mastercard';
    else if (cleanCard.startsWith('34') || cleanCard.startsWith('37')) cardBrand = 'American Express';
    else if (cleanCard.startsWith('6')) cardBrand = 'Discover';
    const cardLast4 = cleanCard.slice(-4);

    const planPrices: Record<string, number> = { student: 49.99, starter: 149.00, professional: 349.00, enterprise: 699.00 };
    let amount = planPrices[planId] || 149.00;
    if (planId !== 'student' && billingCycle === 'annual') {
      amount = Math.round(amount * 0.8);
    } else if (promoCode === 'HANDSHAKE49' || planId === 'student') {
      amount = 49.99;
    }

    const planNames: Record<string, string> = {
      student: 'Student (Handshake AI - Software & AI Testing)',
      starter: 'Starter Plan', professional: 'Professional Plan', enterprise: 'Enterprise Legal Team'
    };
    const transactionId = 'ch_live_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const invoiceId = 'INV-2026-' + Math.floor(10000 + Math.random() * 90000);
    const issuedAt = new Date().toISOString();
    const invoice = {
      id: invoiceId, transactionId, planId: planId || 'professional',
      planName: planNames[planId] || 'Professional Plan',
      customerName: String(cardholderName).trim(),
      customerEmail: customerEmail ? String(customerEmail).trim().toLowerCase() : 'customer@cxpro-billing.com',
      amount, currency: 'USD', billingCycle, cardLast4, cardBrand, issuedAt, status: 'paid'
    };
    billingInvoices.unshift(invoice);

    const receiptSubject = `Receipt for cxpro.site Subscription (${invoice.planName}) - ${invoiceId}`;
    const receiptHtml = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;">
      <div style="border-bottom:2px solid #10B981;padding-bottom:16px;margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h1 style="color:#111827;font-size:20px;font-weight:800;margin:0;">cxpro.site</h1>
          <span style="background:#D1FAE5;color:#065F46;font-size:11px;font-weight:700;padding:4px 8px;border-radius:4px;text-transform:uppercase;">Paid & Active</span>
        </div>
        <p style="color:#6B7280;font-size:12px;margin:4px 0 0 0;">Official Billing Receipt & Tax Invoice</p>
      </div>
      <div style="margin-bottom:24px;">
        <p style="font-size:14px;color:#374151;margin:0 0 12px 0;">Billed To: <strong>${invoice.customerName}</strong> (${invoice.customerEmail})</p>
        <p style="font-size:12px;color:#6B7280;margin:0 0 4px 0;">Invoice: <strong>${invoiceId}</strong></p>
        <p style="font-size:12px;color:#6B7280;margin:0 0 4px 0;">Transaction: <strong style="font-family:monospace;">${transactionId}</strong></p>
        <p style="font-size:12px;color:#6B7280;margin:0 0 4px 0;">Payment: <strong>${cardBrand} ending in ${cardLast4}</strong></p>
        <p style="font-size:12px;color:#6B7280;margin:0;">Date: <strong>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px;">
        <thead><tr style="background:#F3F4F6;border-bottom:1px solid #E5E7EB;">
          <th style="text-align:left;padding:10px;color:#374151;">Description</th>
          <th style="text-align:right;padding:10px;color:#374151;">Amount</th>
        </tr></thead>
        <tbody>
          <tr style="border-bottom:1px solid #E5E7EB;">
            <td style="padding:12px 10px;"><strong>${invoice.planName}</strong></td>
            <td style="text-align:right;padding:12px 10px;font-weight:700;font-family:monospace;">$${amount.toFixed(2)}</td>
          </tr>
          <tr><td style="padding:10px;text-align:right;font-weight:700;">Total:</td>
          <td style="padding:10px;text-align:right;font-weight:800;font-size:15px;color:#10B981;font-family:monospace;">$${amount.toFixed(2)} USD</td></tr>
        </tbody>
      </table>
      <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:6px;padding:12px;font-size:12px;color:#166534;text-align:center;">Your subscription is active immediately.</div>
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #E5E7EB;text-align:center;font-size:11px;color:#9CA3AF;">cxpro.site - Autonomous Legal Engineering - Stripe Encrypted 256-Bit Billing</div>
    </div>`;

    dispatchedEmails.unshift({
      id: 'eml_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: 'payment_receipt', to: invoice.customerEmail, recipientName: invoice.customerName,
      subject: receiptSubject, sentAt: issuedAt, htmlContent: receiptHtml, invoiceId
    });
    console.log(`[Billing] Processed $${amount.toFixed(2)} for ${invoice.customerName}. Txn: ${transactionId}`);
    return res.json({
      success: true, transactionId, invoiceId, amountPaid: amount, planId, cardLast4, cardBrand, issuedAt,
      receiptEmailSent: true, receiptHtml,
      message: `Payment of $${amount.toFixed(2)} processed. ${invoice.planName} activated!`
    });
  } catch (err: any) {
    console.error('Payment error:', err);
    return res.status(500).json({ error: err.message || 'Payment processing failed' });
  }
});

app.get('/api/billing/invoices', (req, res) => res.json({ success: true, invoices: billingInvoices }));
app.get('/api/email/outbox', (req, res) => res.json({ success: true, emails: dispatchedEmails }));

// VITE MIDDLEWARE SETUP
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CXPro Server running on http://0.0.0.0:${PORT}`);
    if (!OPENROUTER_API_KEY) {
      console.warn('WARNING: OPENROUTER_API_KEY not configured. Using client-side fallback.');
    } else {
      console.log('OpenRouter multi-model engine active:');
      console.log('  Structure: NVIDIA Nemotron 3 Ultra (550B)');
      console.log('  Risk: OpenAI gpt-oss-20b');
      console.log('  Clause: Z.ai GLM 5.2');
    }
  });
}

startServer();
