export type Verdict = 'CREDIBLE' | 'SUSPICIOUS' | 'FAKE' | 'BROKEN_LINK';

export type InputMode = 'text' | 'url' | 'image' | 'video';

export interface SentenceAnalysis {
  index: number;
  text: string;
  riskScore: number; // 0 - 100
  isFlagged: boolean;
  triggers: string[];
  reason: string;
}

export interface KnowledgeBaseEntry {
  term: string;
  category: string;
  definition: string;
  manipulationMechanism: string;
  datasetPrevalence: string;
  riskImpact: string;
  searchLinks: {
    label: string;
    url: string;
    source: 'google_factcheck' | 'politifact' | 'snopes' | 'reuters' | 'wikipedia';
  }[];
}

export interface SuspiciousKeyword {
  word: string;
  weight: number; // impact weight (e.g. +14.5%)
  category: 'clickbait' | 'urgency' | 'conspiracy' | 'unverified' | 'emotional_bias';
  frequency: number;
  knowledgeBase?: KnowledgeBaseEntry;
}

export interface ModelMetrics {
  randomForestClass: Verdict;
  randomForestProba: {
    credible: number;
    suspicious: number;
    fake: number;
  };
  logisticRegressionRisk: number; // 0.0 - 1.0 continuous probability
  finalRiskScore: number; // 0 - 100%
  confidence: number; // 0 - 100% (Model certainty)
  certaintyLevel: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
  modelAgreement: number; // percentage alignment
  tfidfTopFeatures: { feature: string; tfidfScore: number; biasDirection: 'credible' | 'fake' }[];
  radarScores: {
    dimension: string;
    score: number;
    benchmark: number;
    description: string;
  }[];
}

export interface DeepVerificationResult {
  geminiEnhanced: boolean;
  summary: string;
  factCheckVerdict: string;
  credibilityFlags: string[];
  scientificConsensus: string;
  sourceReputationNotes: string;
  suggestedCrossReferences: string[];
}

export interface FactCheckItem {
  id: string;
  claim: string;
  claimant?: string;
  claimDate?: string;
  publisher: string;
  publisherSite?: string;
  reviewUrl: string;
  title: string;
  reviewDate?: string;
  textualRating: string; // e.g. "False", "Mostly True", "Misleading", "Pants on Fire", "Correct"
  ratingCategory: 'FALSE' | 'MISLEADING' | 'TRUE' | 'UNVERIFIED';
  summary?: string;
}

export interface StatementSeparation {
  facts: string[];
  claims: string[];
  opinions: string[];
  uncertainties: string[];
}

export interface SuspiciousClaimItem {
  statement: string;
  flaw_type: string; // "logical flaw" | "historical inaccuracy" | "misleading framing" | "unsupported assertion"
  explanation: string;
}

export interface EmotionalManipulationExample {
  phrase: string;
  analysis: string;
}

export interface EmotionalManipulation {
  detected: boolean;
  tactics: string[];
  examples: EmotionalManipulationExample[];
}

export interface EvidenceGapItem {
  claim: string;
  missing_evidence: string;
}

export interface RiskScoring {
  score: number;
  severity_level: 'Low' | 'Moderate' | 'High' | 'Severe';
}

export interface ForensicAnalysisReport {
  statement_separation: StatementSeparation;
  suspicious_and_misleading_claims: SuspiciousClaimItem[];
  emotional_manipulation: EmotionalManipulation;
  evidence_gap_analysis: EvidenceGapItem[];
  risk_scoring: RiskScoring;
  reasoning: string;
  video_transcript?: string;
  visual_analysis?: string;
  audio_analysis?: string;
}

export interface Tier1Telemetry {
  tier1_score: number; // 0 - 100
  tier1_verdict: Verdict;
  tier1_confidence: number;
  treesAgreement: number;
  topKeywords: string[];
}

export interface Tier2Telemetry {
  tier2_status: 'MATCH_FOUND' | 'NO_MATCH';
  tier2_matches: FactCheckItem[];
  hasDebunk: boolean;
  topPublisher?: string;
  topRating?: string;
}

export interface Tier3Telemetry {
  tier3_score: number; // 0 - 100
  tier3_verdict: Verdict;
  tier3_confidence: number;
  tier3_threat_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  reasoning: string;
}

export interface MasterSynthesis {
  overrideApplied: boolean;
  overrideReason?: string;
  master_risk_score: number;
  master_verdict: Verdict;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  inputMode: InputMode;
  sourceUrl?: string;
  sourceDomain?: string;
  sourceTitle?: string;
  videoName?: string;
  video_transcript?: string;
  rawText: string;
  wordCount: number;
  verdict: Verdict;
  riskScore: number; // 0 - 100
  metrics: ModelMetrics;
  sentences: SentenceAnalysis[];
  suspiciousKeywords: SuspiciousKeyword[];
  verifiedDeepAudit?: DeepVerificationResult;
  publicFactChecks: FactCheckItem[];
  forensicReport?: ForensicAnalysisReport;
  processingTimeMs: number;
  terminalLogs: string[];
  isVideoBypass?: boolean;
  tier1?: Tier1Telemetry;
  tier2?: Tier2Telemetry;
  tier3?: Tier3Telemetry;
  synthesis?: MasterSynthesis;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  inputMode: InputMode;
  snippet: string;
  verdict: Verdict;
  riskScore: number;
  confidence: number;
  sourceUrl?: string;
  sourceDomain?: string;
  sourceTitle?: string;
  wordCount: number;
  flagCount: number;
  factChecksCount: number;
}

export interface SampleClaim {
  id: string;
  title: string;
  category: 'WhatsApp Forward' | 'Suspicious URL' | 'Breaking News' | 'Health Miracle' | 'Political Rumor' | 'Verified Science';
  inputMode: InputMode;
  preview: string;
  expectedVerdict: Verdict;
  text: string;
  url?: string;
}
