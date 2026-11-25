import React, { useState } from 'react';
import { ForensicAnalysisReport } from '../types';
import { 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  MessageSquare, 
  AlertTriangle, 
  HeartCrack, 
  Search, 
  Copy, 
  Check, 
  ShieldAlert,
  Flame,
  FileCheck2,
  Mic,
  Radio,
  Video,
  Volume2
} from 'lucide-react';

interface ForensicReportPanelProps {
  report: ForensicAnalysisReport;
}

export const ForensicReportPanel: React.FC<ForensicReportPanelProps> = ({ report }) => {
  const [statementTab, setStatementTab] = useState<'all' | 'facts' | 'claims' | 'opinions' | 'uncertainties'>('all');
  const [copiedJson, setCopiedJson] = useState(false);

  const {
    statement_separation = { facts: [], claims: [], opinions: [], uncertainties: [] },
    suspicious_and_misleading_claims = [],
    emotional_manipulation = { detected: false, tactics: [], examples: [] },
    evidence_gap_analysis = [],
    risk_scoring = { score: 0, severity_level: 'Low' },
    reasoning = '',
    video_transcript,
    visual_analysis,
    audio_analysis,
  } = report;

  const handleCopyReportJson = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const getSeverityBadge = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'severe':
        return 'bg-[#ff3e3e]/20 text-[#ff3e3e] border-[#ff3e3e] glow-red';
      case 'high':
        return 'bg-[#ff3e3e]/15 text-[#ff3e3e] border-[#ff3e3e]/60';
      case 'moderate':
        return 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b] glow-amber';
      default:
        return 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41] glow';
    }
  };

  return (
    <div className="border border-neon bg-black p-4 sm:p-5 relative transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.85)]">
      {/* Header with Title and JSON Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00ff41]/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-[#00ff41]" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00ff41] block">
              FORENSIC_MISINFORMATION_REPORT // STRUCTURED_ANALYSIS
            </span>
            <span className="text-[9px] text-gray-400">
              Linguistic deconstruction, epistemological gaps, and statement separation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-0.5 text-[10px] font-black uppercase border ${getSeverityBadge(risk_scoring.severity_level)}`}>
            SEVERITY: {risk_scoring.severity_level || 'EVALUATED'}
          </div>
          <button
            onClick={handleCopyReportJson}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-black border border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41] hover:text-black text-[10px] font-bold uppercase tracking-wider transition-colors"
            title="Copy exact JSON format"
          >
            {copiedJson ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copiedJson ? 'COPIED_JSON' : 'EXPORT_JSON'}</span>
          </button>
        </div>
      </div>

      {/* Forensic Reasoning Executive Summary */}
      <div className="p-3.5 bg-[#050505] border-l-4 border-[#00ff41] border-y border-r border-[#00ff41]/20 mb-5">
        <span className="text-[9px] uppercase tracking-widest text-[#00ff41] font-bold block mb-1">
          FORENSIC_REASONING & SYNTHESIS
        </span>
        <p className="text-xs text-gray-200 leading-relaxed">
          {reasoning || 'Objective linguistic analysis executed across semantic vector domains and primary source verifications.'}
        </p>
      </div>

      {/* Video Multi-Modal Deepfake Artifacts Section */}
      {(visual_analysis || audio_analysis) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {visual_analysis && (
            <div className="p-4 bg-[#050505] border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <div className="flex items-center gap-2 text-cyan-400 border-b border-cyan-500/30 pb-2 mb-2">
                <Video className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest">
                  VISUAL ARTIFACT & DEEPFAKE ANALYSIS
                </span>
              </div>
              <p className="text-xs text-gray-200 font-mono leading-relaxed">{visual_analysis}</p>
            </div>
          )}

          {audio_analysis && (
            <div className="p-4 bg-[#050505] border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <div className="flex items-center gap-2 text-purple-400 border-b border-purple-500/30 pb-2 mb-2">
                <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest">
                  VOICE CLONING & ACOUSTIC ANALYSIS
                </span>
              </div>
              <p className="text-xs text-gray-200 font-mono leading-relaxed">{audio_analysis}</p>
            </div>
          )}
        </div>
      )}

      {/* Audio Intercept / Video Transcript Section */}
      {video_transcript && (
        <div className="p-4 bg-[#050505] border border-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.15)] mb-6 space-y-2">
          <div className="flex items-center justify-between border-b border-[#00ff41]/30 pb-2">
            <div className="flex items-center gap-2 text-[#00ff41]">
              <Radio className="w-4 h-4 animate-pulse text-[#00ff41]" />
              <span className="text-[11px] font-black uppercase tracking-widest">
                AUDIO INTERCEPT // TRANSCRIPT
              </span>
            </div>
            <span className="text-[9px] font-mono bg-[#00ff41]/10 text-[#00ff41] px-2 py-0.5 border border-[#00ff41]/30 uppercase font-bold">
              VOICE_SPECTRUM_DECODED
            </span>
          </div>

          <div className="p-3 bg-black border border-[#00ff41]/20 font-mono text-xs text-gray-100 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap selection:bg-[#00ff41] selection:text-black">
            {video_transcript}
          </div>
          <p className="text-[9px] text-[#00ff41]/70 font-mono flex items-center gap-1.5">
            <Mic className="w-3 h-3 text-[#00ff41]" />
            <span>Spoken acoustic vector extracted from video media container for synthetic neural speech check.</span>
          </p>
        </div>
      )}

      {/* 1. Statement Separation Section */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00ff41]/15 pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-[#00ff41]" />
            <span className="text-[10px] uppercase tracking-widest text-[#00ff41] font-bold">
              1. STATEMENT_SEPARATION // EPISTEMIC_TAXONOMY
            </span>
          </div>

          {/* Sub-tabs */}
          <div className="flex flex-wrap items-center gap-1 text-[10px]">
            <button
              onClick={() => setStatementTab('all')}
              className={`px-2 py-0.5 font-bold uppercase transition-colors ${
                statementTab === 'all' ? 'bg-[#00ff41] text-black' : 'bg-black text-gray-400 border border-[#00ff41]/20'
              }`}
            >
              All Statements
            </button>
            <button
              onClick={() => setStatementTab('facts')}
              className={`px-2 py-0.5 font-bold uppercase transition-colors ${
                statementTab === 'facts' ? 'bg-[#00ff41] text-black' : 'bg-black text-[#00ff41] border border-[#00ff41]/30'
              }`}
            >
              Facts ({statement_separation.facts?.length || 0})
            </button>
            <button
              onClick={() => setStatementTab('claims')}
              className={`px-2 py-0.5 font-bold uppercase transition-colors ${
                statementTab === 'claims' ? 'bg-[#f59e0b] text-black' : 'bg-black text-[#f59e0b] border border-[#f59e0b]/30'
              }`}
            >
              Claims ({statement_separation.claims?.length || 0})
            </button>
            <button
              onClick={() => setStatementTab('opinions')}
              className={`px-2 py-0.5 font-bold uppercase transition-colors ${
                statementTab === 'opinions' ? 'bg-[#38bdf8] text-black' : 'bg-black text-[#38bdf8] border border-[#38bdf8]/30'
              }`}
            >
              Opinions ({statement_separation.opinions?.length || 0})
            </button>
            <button
              onClick={() => setStatementTab('uncertainties')}
              className={`px-2 py-0.5 font-bold uppercase transition-colors ${
                statementTab === 'uncertainties' ? 'bg-[#a855f7] text-black' : 'bg-black text-[#a855f7] border border-[#a855f7]/30'
              }`}
            >
              Uncertainties ({statement_separation.uncertainties?.length || 0})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {/* Facts */}
          {(statementTab === 'all' || statementTab === 'facts') && statement_separation.facts?.map((f, i) => (
            <div key={`fact-${i}`} className="p-2.5 bg-black border border-[#00ff41]/40 flex items-start gap-2.5">
              <span className="shrink-0 px-1.5 py-0.5 bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40 text-[9px] font-bold uppercase mt-0.5">
                FACT
              </span>
              <p className="text-xs text-gray-200 leading-relaxed">{f}</p>
            </div>
          ))}

          {/* Claims */}
          {(statementTab === 'all' || statementTab === 'claims') && statement_separation.claims?.map((c, i) => (
            <div key={`claim-${i}`} className="p-2.5 bg-black border border-[#f59e0b]/40 flex items-start gap-2.5">
              <span className="shrink-0 px-1.5 py-0.5 bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40 text-[9px] font-bold uppercase mt-0.5">
                CLAIM
              </span>
              <p className="text-xs text-gray-200 leading-relaxed">{c}</p>
            </div>
          ))}

          {/* Opinions */}
          {(statementTab === 'all' || statementTab === 'opinions') && statement_separation.opinions?.map((o, i) => (
            <div key={`op-${i}`} className="p-2.5 bg-black border border-[#38bdf8]/40 flex items-start gap-2.5">
              <span className="shrink-0 px-1.5 py-0.5 bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40 text-[9px] font-bold uppercase mt-0.5">
                OPINION
              </span>
              <p className="text-xs text-gray-200 leading-relaxed">{o}</p>
            </div>
          ))}

          {/* Uncertainties */}
          {(statementTab === 'all' || statementTab === 'uncertainties') && statement_separation.uncertainties?.map((u, i) => (
            <div key={`unc-${i}`} className="p-2.5 bg-black border border-[#a855f7]/40 flex items-start gap-2.5">
              <span className="shrink-0 px-1.5 py-0.5 bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/40 text-[9px] font-bold uppercase mt-0.5">
                UNCERTAINTY
              </span>
              <p className="text-xs text-gray-200 leading-relaxed">{u}</p>
            </div>
          ))}

          {(!statement_separation.facts?.length && !statement_separation.claims?.length && !statement_separation.opinions?.length && !statement_separation.uncertainties?.length) && (
            <div className="p-3 bg-black border border-gray-800 text-xs text-gray-400">
              No statement classification records available for this input.
            </div>
          )}
        </div>
      </div>

      {/* 2. Suspicious & Misleading Claims Section */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2 border-b border-[#00ff41]/15 pb-2">
          <AlertTriangle className="w-3.5 h-3.5 text-[#ff3e3e]" />
          <span className="text-[10px] uppercase tracking-widest text-[#00ff41] font-bold">
            2. SUSPICIOUS_AND_MISLEADING_CLAIMS ({suspicious_and_misleading_claims.length})
          </span>
        </div>

        {suspicious_and_misleading_claims.length > 0 ? (
          <div className="space-y-2.5">
            {suspicious_and_misleading_claims.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#050505] border border-[#ff3e3e]/30 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-[#ff3e3e] uppercase bg-[#ff3e3e]/10 px-2 py-0.5 border border-[#ff3e3e]/30">
                    FLAW_TYPE: {item.flaw_type}
                  </span>
                </div>
                <div className="p-2 bg-black border border-[#ff3e3e]/20 text-xs text-gray-200 italic">
                  "{item.statement}"
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  <strong className="text-white">Forensic Analysis:</strong> {item.explanation}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-black border border-[#00ff41]/30 text-xs text-gray-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#00ff41]" />
            <span>No explicit logical fallacies or manipulated falsehoods flagged in the corpus.</span>
          </div>
        )}
      </div>

      {/* 3. Emotional Manipulation Section */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00ff41]/15 pb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span className="text-[10px] uppercase tracking-widest text-[#00ff41] font-bold">
              3. EMOTIONAL_MANIPULATION & PSYCHOLOGICAL_PRIMING
            </span>
          </div>

          <span
            className={`text-[9px] font-bold uppercase px-2 py-0.5 border ${
              emotional_manipulation.detected
                ? 'bg-[#ff3e3e]/20 text-[#ff3e3e] border-[#ff3e3e]/50 glow-red'
                : 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/50 glow'
            }`}
          >
            {emotional_manipulation.detected ? 'MANIPULATION_DETECTED' : 'NEUTRAL_POLARITY'}
          </span>
        </div>

        {/* Tactics Badges */}
        {emotional_manipulation.tactics && emotional_manipulation.tactics.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[9px] uppercase text-gray-400 font-mono">TACTICS:</span>
            {emotional_manipulation.tactics.map((tactic, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/40 text-[10px] font-bold uppercase"
              >
                {tactic}
              </span>
            ))}
          </div>
        )}

        {/* Manipulation Examples */}
        {emotional_manipulation.examples && emotional_manipulation.examples.length > 0 ? (
          <div className="space-y-2">
            {emotional_manipulation.examples.map((ex, idx) => (
              <div key={idx} className="p-2.5 bg-black border border-[#f59e0b]/30 space-y-1">
                <p className="text-xs text-gray-200 italic">
                  "{ex.phrase}"
                </p>
                <p className="text-[11px] text-[#f59e0b] leading-relaxed">
                  <strong>Impact:</strong> {ex.analysis}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 p-2 bg-black border border-[#00ff41]/20">
            Syntactic tone remains balanced and non-coercive.
          </p>
        )}
      </div>

      {/* 4. Evidence Gap Analysis Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-[#00ff41]/15 pb-2">
          <Search className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="text-[10px] uppercase tracking-widest text-[#00ff41] font-bold">
            4. EVIDENCE_GAP_ANALYSIS ({evidence_gap_analysis.length})
          </span>
        </div>

        {evidence_gap_analysis.length > 0 ? (
          <div className="space-y-2.5">
            {evidence_gap_analysis.map((gap, idx) => (
              <div key={idx} className="p-3 bg-[#050505] border border-[#38bdf8]/30 space-y-1.5">
                <div className="text-xs text-gray-200 italic p-2 bg-black border border-[#38bdf8]/20">
                  "{gap.claim}"
                </div>
                <div className="text-[11px] text-gray-300 leading-relaxed">
                  <strong className="text-[#38bdf8]">Missing Evidence / Citation:</strong> {gap.missing_evidence}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-black border border-[#00ff41]/30 text-xs text-gray-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#00ff41]" />
            <span>Assertions align with referenced primary publications or standard factual priors.</span>
          </div>
        )}
      </div>
    </div>
  );
};
