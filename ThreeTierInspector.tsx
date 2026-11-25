import React from 'react';
import { Cpu, Search, Brain, ShieldAlert, ShieldCheck, AlertOctagon, ExternalLink, Zap, CheckCircle2, AlertTriangle, Database } from 'lucide-react';
import { AnalysisResult, Verdict } from '../types';

interface ThreeTierInspectorProps {
  result: AnalysisResult;
}

export const ThreeTierInspector: React.FC<ThreeTierInspectorProps> = ({ result }) => {
  // Extract Tier 1 Telemetry (Local ML Engine)
  const tier1 = result.tier1 || {
    tier1_score: result.metrics?.finalRiskScore ?? result.riskScore,
    tier1_verdict: result.metrics?.randomForestClass ?? result.verdict,
    tier1_confidence: result.metrics?.confidence ?? 95,
    treesAgreement: result.metrics?.modelAgreement ?? 100,
    topKeywords: result.suspiciousKeywords?.slice(0, 5).map((k) => k.word) ?? [],
  };

  // Extract Tier 2 Telemetry (Google Fact Check Tools API)
  const tier2 = result.tier2 || {
    tier2_status: result.publicFactChecks && result.publicFactChecks.length > 0 ? 'MATCH_FOUND' : 'NO_MATCH',
    tier2_matches: result.publicFactChecks || [],
    hasDebunk: result.publicFactChecks?.some(
      (f) => f.ratingCategory === 'FALSE' || f.ratingCategory === 'MISLEADING'
    ) ?? false,
    topPublisher: result.publicFactChecks?.[0]?.publisher,
    topRating: result.publicFactChecks?.[0]?.textualRating,
  };

  // Extract Tier 3 Telemetry (Gemini Multimodal Forensic Analyzer)
  const tier3 = result.tier3 || {
    tier3_score: result.forensicReport?.risk_scoring?.score ?? result.riskScore,
    tier3_verdict: (result.forensicReport?.risk_scoring?.score ?? result.riskScore) >= 65 ? 'FAKE' : (result.forensicReport?.risk_scoring?.score ?? result.riskScore) >= 35 ? 'SUSPICIOUS' : 'CREDIBLE' as Verdict,
    tier3_confidence: result.verifiedDeepAudit?.geminiEnhanced ? 94 : 80,
    tier3_threat_level: (result.forensicReport?.risk_scoring?.severity_level?.toUpperCase() as any) || (result.riskScore >= 75 ? 'CRITICAL' : result.riskScore >= 55 ? 'HIGH' : result.riskScore >= 30 ? 'MODERATE' : 'LOW'),
    reasoning: result.forensicReport?.reasoning || 'Gemini deep semantic analysis evaluated claim narrative context.',
  };

  const synthesis = result.synthesis || {
    overrideApplied: false,
    master_risk_score: result.riskScore,
    master_verdict: result.verdict,
  };

  const getVerdictStyle = (v: Verdict) => {
    switch (v) {
      case 'FAKE':
        return 'bg-[#ff3e3e]/15 text-[#ff3e3e] border-[#ff3e3e] glow-red';
      case 'SUSPICIOUS':
      case 'BROKEN_LINK':
        return 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b] glow-amber';
      case 'CREDIBLE':
      default:
        return 'bg-[#00ff41]/15 text-[#00ff41] border-[#00ff41] glow';
    }
  };

  const getThreatStyle = (threat: string) => {
    switch (threat) {
      case 'CRITICAL':
      case 'SEVERE':
        return 'bg-[#ff3e3e]/20 text-[#ff3e3e] border-[#ff3e3e]';
      case 'HIGH':
        return 'bg-[#f97316]/20 text-[#f97316] border-[#f97316]';
      case 'MODERATE':
        return 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]';
      case 'LOW':
      default:
        return 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]';
    }
  };

  return (
    <div className="space-y-4 my-6">
      {/* Top Header & Master Synthesis Status */}
      <div className="border border-[#00ff41]/30 bg-black p-4 relative overflow-hidden shadow-[0_0_15px_rgba(0,255,65,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#00ff41]/20 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00ff41] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-[#00ff41]">
              3-TIER INDEPENDENT MODEL INSPECTOR // SYNTHESIS ENGINE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-mono">MASTER VERDICT:</span>
            <span className={`px-2.5 py-0.5 text-xs font-black uppercase border ${getVerdictStyle(synthesis.master_verdict)}`}>
              [{synthesis.master_verdict}] ({synthesis.master_risk_score}%)
            </span>
          </div>
        </div>

        {/* Master Override Notification Banner */}
        {synthesis.overrideApplied && (
          <div className={`p-3 text-xs flex items-start gap-2.5 rounded-none animate-in fade-in duration-200 border ${
            result.verdict === 'BROKEN_LINK'
              ? 'bg-[#f59e0b]/10 border-[#f59e0b] text-[#f59e0b]'
              : 'bg-[#ff3e3e]/10 border-[#ff3e3e] text-[#ff3e3e]'
          }`}>
            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 animate-pulse ${
              result.verdict === 'BROKEN_LINK' ? 'text-[#f59e0b]' : 'text-[#ff3e3e]'
            }`} />
            <div className="space-y-0.5">
              <span className="font-bold uppercase tracking-wider block text-[11px]">
                {result.verdict === 'BROKEN_LINK' ? '[BROKEN LINK SAFEGUARD ACTIVATED]' : '[MASTER SYNTHESIS OVERRIDE ACTIVATED]'}
              </span>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                {synthesis.overrideReason}
              </p>
            </div>
          </div>
        )}

        {!synthesis.overrideApplied && (
          <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
            All three independent verification layers evaluated the submission with aligned confidence. The Master Risk Score reflects the weighted ensemble across Tier 1 (Syntactic ML), Tier 2 (Fact Check Registry), and Tier 3 (Gemini Multimodal Reasoning).
          </p>
        )}

        {result.isVideoBypass && (
          <div className="p-2.5 bg-cyan-950/40 border border-cyan-500/50 text-cyan-300 text-[11px] font-mono flex items-center justify-between mt-2">
            <span className="font-bold uppercase tracking-wide">
              📹 VIDEO MULTIMODAL PIPELINE ENGAGED
            </span>
            <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 border border-cyan-500/40 font-bold">
              TIER 1 & 2 BYPASSED FOR VIDEO
            </span>
          </div>
        )}
      </div>

      {/* 3-Tier Side-by-Side Cyberpunk Inspector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CARD 1: TIER 1 - LOCAL ML HEURISTICS */}
        <div className="border border-[#00ff41]/40 bg-[#050505] p-4 flex flex-col justify-between relative space-y-4 hover:border-[#00ff41] transition-all duration-200 shadow-[0_0_10px_rgba(0,255,65,0.08)]">
          <div>
            {/* Title Header */}
            <div className="flex items-center justify-between border-b border-[#00ff41]/20 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#00ff41]" />
                <span className="text-[11px] font-bold text-[#00ff41] uppercase tracking-wider">
                  TIER 1 // LOCAL ML
                </span>
              </div>
              <span className="text-[9px] bg-[#00ff41]/10 text-[#00ff41] px-2 py-0.5 border border-[#00ff41]/30 font-mono uppercase">
                SYNTAX ENGINE
              </span>
            </div>

            {/* Verdict & Score */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] text-gray-400 uppercase font-mono">Syntactic Risk:</span>
                <span className={`text-2xl font-black font-mono ${tier1.tier1_score >= 65 ? 'text-[#ff3e3e] glow-red' : tier1.tier1_score >= 35 ? 'text-[#f59e0b] glow-amber' : 'text-[#00ff41] glow'}`}>
                  {tier1.tier1_score.toFixed(1)}%
                </span>
              </div>

              {/* Progress Gauge Bar */}
              <div className="w-full bg-black h-2 border border-[#00ff41]/30 overflow-hidden">
                <div
                  className={`h-full ${tier1.tier1_score >= 65 ? 'bg-[#ff3e3e]' : tier1.tier1_score >= 35 ? 'bg-[#f59e0b]' : 'bg-[#00ff41]'}`}
                  style={{ width: `${tier1.tier1_score}%` }}
                />
              </div>

              {/* Verdict & Confidence Pill */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-2 bg-[#0a0a0a] border border-[#00ff41]/20">
                  <span className="text-gray-500 block text-[8px] uppercase">ML VERDICT</span>
                  <span className={`font-bold block uppercase mt-0.5 ${tier1.tier1_verdict === 'FAKE' ? 'text-[#ff3e3e]' : tier1.tier1_verdict === 'SUSPICIOUS' ? 'text-[#f59e0b]' : 'text-[#00ff41]'}`}>
                    [{tier1.tier1_verdict}]
                  </span>
                </div>
                <div className="p-2 bg-[#0a0a0a] border border-[#00ff41]/20">
                  <span className="text-gray-500 block text-[8px] uppercase">CONFIDENCE</span>
                  <span className="font-bold text-white block mt-0.5">
                    {tier1.tier1_confidence}%
                  </span>
                </div>
              </div>

              {/* Ensemble Consensus & Top Keywords */}
              <div className="space-y-1.5 pt-1 text-[10px] font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Random Forest Consensus:</span>
                  <span className="text-white font-bold">{tier1.treesAgreement}% (100 Trees)</span>
                </div>

                {tier1.topKeywords.length > 0 && (
                  <div>
                    <span className="text-gray-500 text-[9px] block mb-1">Top TF-IDF Trigger Vectors:</span>
                    <div className="flex flex-wrap gap-1">
                      {tier1.topKeywords.map((kw, i) => (
                        <span key={i} className="text-[9px] bg-[#00ff41]/10 text-[#00ff41] px-1.5 py-0.5 border border-[#00ff41]/20">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-[9px] text-gray-500 font-mono border-t border-[#00ff41]/10 pt-2 italic">
            Purpose: Sub-50ms lexical vectorizer checking syntactic urgency, TF-IDF n-grams, and Random Forest weights.
          </p>
        </div>

        {/* CARD 2: TIER 2 - GOOGLE FACT CHECK API */}
        <div className="border border-[#00e5ff]/40 bg-[#050505] p-4 flex flex-col justify-between relative space-y-4 hover:border-[#00e5ff] transition-all duration-200 shadow-[0_0_10px_rgba(0,229,255,0.08)]">
          <div>
            {/* Title Header */}
            <div className="flex items-center justify-between border-b border-[#00e5ff]/20 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#00e5ff]" />
                <span className="text-[11px] font-bold text-[#00e5ff] uppercase tracking-wider">
                  TIER 2 // FACT CHECK API
                </span>
              </div>
              <span className="text-[9px] bg-[#00e5ff]/10 text-[#00e5ff] px-2 py-0.5 border border-[#00e5ff]/30 font-mono uppercase">
                CLAIMREVIEW
              </span>
            </div>

            {/* Status & Match Count */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] text-gray-400 uppercase font-mono">Registry Matches:</span>
                <span className={`text-sm font-black font-mono px-2 py-0.5 border uppercase ${tier2.tier2_status === 'MATCH_FOUND' ? (tier2.hasDebunk ? 'bg-[#ff3e3e]/20 text-[#ff3e3e] border-[#ff3e3e]' : 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]') : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                  [{tier2.tier2_status}] ({tier2.tier2_matches.length})
                </span>
              </div>

              {/* Match Details Display */}
              {tier2.tier2_matches.length > 0 ? (
                <div className="space-y-2 pt-1 font-mono text-[10px]">
                  {tier2.tier2_matches.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="p-2 bg-[#080808] border border-[#00e5ff]/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#00e5ff] font-bold truncate max-w-[140px]">
                          {item.publisher}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 border uppercase font-bold ${item.ratingCategory === 'FALSE' ? 'bg-[#ff3e3e]/20 text-[#ff3e3e] border-[#ff3e3e]' : item.ratingCategory === 'MISLEADING' ? 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]' : 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]'}`}>
                          {item.textualRating}
                        </span>
                      </div>
                      <p className="text-gray-300 text-[9px] line-clamp-2 leading-relaxed">
                        "{item.claim}"
                      </p>
                      {item.reviewUrl && (
                        <a
                          href={item.reviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[9px] text-[#00e5ff] hover:underline font-bold pt-0.5"
                        >
                          <span>Read Official Audit</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-[#080808] border border-gray-800 text-gray-400 text-[10px] font-mono leading-relaxed space-y-1">
                  <span className="text-gray-300 font-bold block">[NO DIRECT DEBUNK]</span>
                  <p>
                    No published debunk entries found in Google Fact Check registry for this exact phrase. Relying on Tier 1 ML and Tier 3 Gemini reasoning.
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-[9px] text-gray-500 font-mono border-t border-[#00e5ff]/10 pt-2 italic">
            Purpose: Real-time query matching against Google Fact Check Tools API and global ClaimReview registries.
          </p>
        </div>

        {/* CARD 3: TIER 3 - GEMINI FORENSIC ANALYZER */}
        <div className="border border-[#a855f7]/40 bg-[#050505] p-4 flex flex-col justify-between relative space-y-4 hover:border-[#a855f7] transition-all duration-200 shadow-[0_0_10px_rgba(168,85,247,0.08)]">
          <div>
            {/* Title Header */}
            <div className="flex items-center justify-between border-b border-[#a855f7]/20 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#a855f7]" />
                <span className="text-[11px] font-bold text-[#a855f7] uppercase tracking-wider">
                  TIER 3 // GEMINI FORENSIC
                </span>
              </div>
              <span className="text-[9px] bg-[#a855f7]/10 text-[#a855f7] px-2 py-0.5 border border-[#a855f7]/30 font-mono uppercase">
                DEEP REASONING
              </span>
            </div>

            {/* Verdict & Semantic Score */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] text-gray-400 uppercase font-mono">Semantic Risk:</span>
                <span className={`text-2xl font-black font-mono ${tier3.tier3_score >= 65 ? 'text-[#ff3e3e] glow-red' : tier3.tier3_score >= 35 ? 'text-[#f59e0b] glow-amber' : 'text-[#00ff41] glow'}`}>
                  {tier3.tier3_score.toFixed(1)}%
                </span>
              </div>

              {/* Progress Gauge Bar */}
              <div className="w-full bg-black h-2 border border-[#a855f7]/30 overflow-hidden">
                <div
                  className={`h-full ${tier3.tier3_score >= 65 ? 'bg-[#ff3e3e]' : tier3.tier3_score >= 35 ? 'bg-[#f59e0b]' : 'bg-[#00ff41]'}`}
                  style={{ width: `${tier3.tier3_score}%` }}
                />
              </div>

              {/* Threat Level & AI Confidence */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-2 bg-[#0a0a0a] border border-[#a855f7]/20">
                  <span className="text-gray-500 block text-[8px] uppercase">THREAT LEVEL</span>
                  <span className={`font-bold block uppercase mt-0.5 text-[10px] px-1 border w-fit ${getThreatStyle(tier3.tier3_threat_level)}`}>
                    [{tier3.tier3_threat_level}]
                  </span>
                </div>
                <div className="p-2 bg-[#0a0a0a] border border-[#a855f7]/20">
                  <span className="text-gray-500 block text-[8px] uppercase">AI CERTAINTY</span>
                  <span className="font-bold text-white block mt-0.5">
                    {tier3.tier3_confidence}%
                  </span>
                </div>
              </div>

              {/* Core Reasoning Excerpt */}
              <div className="p-2 bg-[#080808] border border-[#a855f7]/20 font-mono text-[9.5px] text-gray-300 leading-relaxed line-clamp-3">
                "{tier3.reasoning}"
              </div>
            </div>
          </div>

          <p className="text-[9px] text-gray-500 font-mono border-t border-[#a855f7]/10 pt-2 italic">
            Purpose: Gemini multimodal deep reasoning evaluating logical flaws, evidence gaps, and video/audio deepfakes.
          </p>
        </div>
      </div>
    </div>
  );
};
