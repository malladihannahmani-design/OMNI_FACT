import React, { useState } from 'react';
import { Cpu, Terminal, Sparkles, BookOpen, Layers, CheckCircle2, AlertOctagon, ExternalLink } from 'lucide-react';
import { ModelMetrics, DeepVerificationResult } from '../types';
import { soundFx } from '../utils/audio';

interface ModelTelemetryPanelProps {
  metrics: ModelMetrics;
  deepAudit?: DeepVerificationResult;
  terminalLogs?: string[];
}

export const ModelTelemetryPanel: React.FC<ModelTelemetryPanelProps> = ({
  metrics,
  deepAudit,
  terminalLogs,
}) => {
  const [activeSection, setActiveSection] = useState<'audit' | 'trees' | 'tfidf' | 'logs'>('audit');

  return (
    <div className="border-neon bg-black p-4 sm:p-5 shadow-[0_0_15px_rgba(0,255,65,0.1)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#00ff41]/20 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-[#00ff41]" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00ff41]">
            FORENSIC_ML_PIPELINE & CROSS_VALIDATION_AUDIT
          </h3>
        </div>

        {/* Section buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveSection('audit');
            }}
            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSection === 'audit'
                ? 'bg-[#00ff41] text-black shadow-[0_0_8px_rgba(0,255,65,0.4)]'
                : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/20 hover:bg-[#00ff41]/10 hover:text-[#00ff41]'
            }`}
          >
            FACT_AUDIT
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveSection('trees');
            }}
            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSection === 'trees'
                ? 'bg-[#00ff41] text-black shadow-[0_0_8px_rgba(0,255,65,0.4)]'
                : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/20 hover:bg-[#00ff41]/10 hover:text-[#00ff41]'
            }`}
          >
            100_TREES
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveSection('tfidf');
            }}
            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSection === 'tfidf'
                ? 'bg-[#00ff41] text-black shadow-[0_0_8px_rgba(0,255,65,0.4)]'
                : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/20 hover:bg-[#00ff41]/10 hover:text-[#00ff41]'
            }`}
          >
            TF-IDF
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveSection('logs');
            }}
            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSection === 'logs'
                ? 'bg-[#00ff41] text-black shadow-[0_0_8px_rgba(0,255,65,0.4)]'
                : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/20 hover:bg-[#00ff41]/10 hover:text-[#00ff41]'
            }`}
          >
            RAW_LOGS
          </button>
        </div>
      </div>

      {/* Section 1: Deep Fact Audit */}
      {activeSection === 'audit' && (
        <div className="space-y-3">
          {deepAudit ? (
            <div className="space-y-2.5">
              <div className="p-3 bg-[#080808] border border-[#00ff41]/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#00ff41] flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-3 h-3 text-[#00ff41]" />
                    <span>GEMINI 3.7 FLASH // SEMANTIC FACT-CHECK AUDIT</span>
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-black text-[#00ff41] border border-[#00ff41]/40 uppercase">
                    VERDICT: {deepAudit.factCheckVerdict}
                  </span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {deepAudit.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[10px]">
                <div className="p-2.5 bg-[#080808] border border-[#00ff41]/20 space-y-1">
                  <span className="text-[#00ff41]/60 text-[9px] block font-bold uppercase">SCIENTIFIC & EMPIRICAL CONSENSUS:</span>
                  <p className="text-gray-300 leading-normal">{deepAudit.scientificConsensus}</p>
                </div>

                <div className="p-2.5 bg-[#080808] border border-[#00ff41]/20 space-y-1">
                  <span className="text-[#00ff41]/60 text-[9px] block font-bold uppercase">SOURCE REPUTATION ANALYSIS:</span>
                  <p className="text-gray-300 leading-normal">{deepAudit.sourceReputationNotes}</p>
                </div>
              </div>

              {deepAudit.suggestedCrossReferences.length > 0 && (
                <div className="p-2 bg-[#050505] border border-[#00ff41]/20 flex items-center gap-2 text-[10px] flex-wrap">
                  <span className="text-[#00ff41]/50">CROSS_REFERENCES:</span>
                  {deepAudit.suggestedCrossReferences.map((src, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-black text-[#00ff41] border border-[#00ff41]/30 text-[9px]">
                      🔍 {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3.5 bg-[#080808] border border-[#00ff41]/20 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#00ff41] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[11px] uppercase tracking-wider">Deterministic ML Ensemble Active</span>
              </div>
              <p className="text-[10px] text-[#00ff41]/70 leading-relaxed">
                Core scoring is calculated via local Random Forest (100 Decision Trees) + Sigmoid Logistic Regression mapped against ISOT/FakeNewsNet corpus. Add <code className="text-white">GEMINI_API_KEY</code> in Settings &gt; Secrets to enable multi-source live grounding.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Section 2: Random Forest 100 Trees */}
      {activeSection === 'trees' && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 bg-[#080808] border border-[#ff3e3e]/30 text-center">
              <span className="text-[#ff3e3e]/70 block text-[9px] font-bold uppercase">FAKE VOTES:</span>
              <span className="text-lg font-black text-[#ff3e3e]">
                {Math.round(metrics.randomForestProba.fake * 100)}%
              </span>
              <span className="text-[9px] text-gray-500 block">{(metrics.randomForestProba.fake * 100).toFixed(0)} / 100 Trees</span>
            </div>

            <div className="p-2.5 bg-[#080808] border border-[#f59e0b]/30 text-center">
              <span className="text-[#f59e0b]/70 block text-[9px] font-bold uppercase">SUSPICIOUS:</span>
              <span className="text-lg font-black text-[#f59e0b]">
                {Math.round(metrics.randomForestProba.suspicious * 100)}%
              </span>
              <span className="text-[9px] text-gray-500 block">{(metrics.randomForestProba.suspicious * 100).toFixed(0)} / 100 Trees</span>
            </div>

            <div className="p-2.5 bg-[#080808] border border-[#00ff41]/30 text-center">
              <span className="text-[#00ff41]/70 block text-[9px] font-bold uppercase">CREDIBLE:</span>
              <span className="text-lg font-black text-[#00ff41]">
                {Math.round(metrics.randomForestProba.credible * 100)}%
              </span>
              <span className="text-[9px] text-gray-500 block">{(metrics.randomForestProba.credible * 100).toFixed(0)} / 100 Trees</span>
            </div>
          </div>

          <div className="p-3 bg-[#080808] border border-[#00ff41]/20 space-y-1.5">
            <span className="text-[#00ff41]/60 font-bold text-[10px] block uppercase">SIGMOID LOGISTIC PROBABILITY MAPPING:</span>
            <div className="bg-black p-2 border border-[#00ff41]/30 text-[#00ff41] text-[10px]">
              Risk(X) = 1 / (1 + e^-(w · TF-IDF(X) + b)) = <strong>{(metrics.logisticRegressionRisk * 100).toFixed(2)}%</strong>
            </div>
            <p className="text-[10px] text-[#00ff41]/60">
              Continuous output provides fine-grained probability assessment (e.g. 12% vs 88%) rather than a binary threshold.
            </p>
          </div>
        </div>
      )}

      {/* Section 3: TF-IDF Feature Table */}
      {activeSection === 'tfidf' && (
        <div className="space-y-2 text-xs">
          <p className="text-[10px] text-[#00ff41]/70">Top weighted n-gram token vectors extracted from current payload:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#00ff41]/30 text-[#00ff41]/60 text-[9px] uppercase">
                  <th className="pb-1.5">N-GRAM FEATURE</th>
                  <th className="pb-1.5">TF-IDF SCORE</th>
                  <th className="pb-1.5">POLARITY DIRECTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[10px]">
                {metrics.tfidfTopFeatures.map((feat, idx) => (
                  <tr key={idx} className="hover:bg-[#00ff41]/5">
                    <td className="py-1.5 font-bold text-white">"{feat.feature}"</td>
                    <td className="py-1.5 text-[#00ff41]">{feat.tfidfScore}</td>
                    <td className="py-1.5">
                      <span className={`px-1.5 py-0.2 text-[9px] font-bold ${
                        feat.biasDirection === 'fake'
                          ? 'bg-[#ff3e3e]/20 text-[#ff6e6e] border border-[#ff3e3e]/40'
                          : 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40'
                      }`}>
                        {feat.biasDirection.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 4: Raw Terminal Execution Logs */}
      {activeSection === 'logs' && (
        <div className="bg-black p-3 border border-[#00ff41]/30 text-[10px] text-[#00ff41] space-y-0.5 max-h-[200px] overflow-y-auto font-mono">
          {(terminalLogs || []).map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              <span className="text-white/30 select-none mr-2">{String(idx + 1).padStart(2, '0')}</span>
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
