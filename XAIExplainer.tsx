import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  Sparkles,
  AlertTriangle,
  Flame,
  CheckCircle2,
  HelpCircle,
  Layers,
  Search,
  Eye,
  TrendingUp,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { SentenceAnalysis, SuspiciousKeyword, ModelMetrics } from '../types';
import { soundFx } from '../utils/audio';

interface XAIExplainerProps {
  sentences: SentenceAnalysis[];
  keywords: SuspiciousKeyword[];
  metrics: ModelMetrics;
  onSelectKeyword?: (keyword: SuspiciousKeyword) => void;
}

export const XAIExplainer: React.FC<XAIExplainerProps> = ({
  sentences,
  keywords,
  metrics,
  onSelectKeyword,
}) => {
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState<number | null>(
    sentences.find((s) => s.isFlagged)?.index ?? 1
  );
  const [activeTab, setActiveTab] = useState<'sentences' | 'keywords' | 'radar'>('sentences');

  const activeSentence = sentences.find((s) => s.index === selectedSentenceIndex) || sentences[0];

  const handleKeywordClick = (kw: SuspiciousKeyword) => {
    soundFx.playClick();
    if (onSelectKeyword) {
      onSelectKeyword(kw);
    }
  };

  return (
    <div className="border border-neon bg-black p-4 sm:p-5 shadow-[0_0_15px_rgba(0,255,65,0.1)] space-y-4 font-mono">
      {metrics.randomForestClass === 'BROKEN_LINK' && (
        <div className="p-3 bg-[#f59e0b]/10 border border-[#f59e0b] text-[#f59e0b] text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#f59e0b] animate-pulse" />
          <div>
            <span className="font-bold uppercase tracking-wider block text-[11px]">
              [BROKEN_LINK DECOMPOSITION NOTICE]
            </span>
            <p className="text-amber-100/90 text-[11px] leading-relaxed">
              Target URL returned an HTTP 404 Not Found or is unreachable. Token attribution and syntax radar analysis were short-circuited prior to ML model evaluation.
            </p>
          </div>
        </div>
      )}
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#00ff41]/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00ff41]" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00ff41] opacity-95">
              EXPLAINABLE_AI (XAI) // ATTRIBUTION_DECOMPOSITION
            </h3>
          </div>
          <p className="text-[10px] text-[#00ff41]/60 mt-0.5">
            Localized token gradients, clickbait lexical triggers, and interactive knowledge base links
          </p>
        </div>

        {/* View mode toggle pills */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('sentences');
            }}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'sentences'
                ? 'bg-[#00ff41] text-black shadow-[0_0_8px_rgba(0,255,65,0.4)]'
                : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/20 hover:bg-[#00ff41]/10 hover:text-[#00ff41]'
            }`}
          >
            HEATMAP
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('keywords');
            }}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'keywords'
                ? 'bg-[#00ff41] text-black shadow-[0_0_8px_rgba(0,255,65,0.4)]'
                : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/20 hover:bg-[#00ff41]/10 hover:text-[#00ff41]'
            }`}
          >
            TRIGGERS & KNOWLEDGE BASE ({keywords.length})
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('radar');
            }}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-[#00ff41] text-black shadow-[0_0_8px_rgba(0,255,65,0.4)]'
                : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/20 hover:bg-[#00ff41]/10 hover:text-[#00ff41]'
            }`}
          >
            5-AXIS_RADAR
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Sentence Heatmap */}
      {activeTab === 'sentences' && (
        <div className="space-y-3">
          <div className="text-[10px] text-[#00ff41]/70 flex items-center justify-between">
            <span>Click any token block to inspect localized risk attribution:</span>
            <div className="flex items-center gap-3 text-[9px]">
              <span className="flex items-center gap-1 text-[#ff3e3e] font-bold"><span className="w-2 h-2 bg-[#ff3e3e]" /> THREAT (&gt;65%)</span>
              <span className="flex items-center gap-1 text-[#f59e0b] font-bold"><span className="w-2 h-2 bg-[#f59e0b]" /> UNVERIFIED (35-65%)</span>
              <span className="flex items-center gap-1 text-[#00ff41] font-bold"><span className="w-2 h-2 bg-[#00ff41]" /> CREDIBLE (&lt;35%)</span>
            </div>
          </div>

          {/* Render Full Text with Inline Interactive Highlights */}
          <div className="p-3 bg-[#080808] border border-[#00ff41]/30 leading-relaxed text-xs space-y-1.5 min-h-[100px]">
            {sentences.map((sentence) => {
              const isSelected = selectedSentenceIndex === sentence.index;
              const isHigh = sentence.riskScore >= 65;
              const isMod = sentence.riskScore >= 35 && sentence.riskScore < 65;

              let styleClasses = 'bg-[#00ff41]/10 text-white border border-[#00ff41]/30 hover:border-[#00ff41]';
              if (isHigh) {
                styleClasses = 'bg-[#ff3e3e]/15 text-[#ff6e6e] border border-[#ff3e3e]/60 hover:border-[#ff3e3e]';
              } else if (isMod) {
                styleClasses = 'bg-[#f59e0b]/15 text-[#ffc86e] border border-[#f59e0b]/60 hover:border-[#f59e0b]';
              }

              if (isSelected) {
                styleClasses += ' ring-1 ring-[#00ff41] font-bold text-white shadow-[0_0_8px_rgba(0,255,65,0.4)]';
              }

              return (
                <span
                  key={sentence.index}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedSentenceIndex(sentence.index);
                  }}
                  className={`inline-block mr-1.5 mb-1.5 p-1.5 cursor-pointer transition-all ${styleClasses}`}
                >
                  <span className="text-[9px] px-1 py-0.2 bg-black mr-1 opacity-80 border border-white/20">
                    #{sentence.index} [{sentence.riskScore}%]
                  </span>
                  {sentence.text}
                </span>
              );
            })}
          </div>

          {/* Active Selected Sentence Inspector Card */}
          {activeSentence && (
            <div className="p-3.5 bg-[#050505] border border-[#00ff41]/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#00ff41] flex items-center gap-1.5 uppercase">
                  <Search className="w-3 h-3 text-[#00ff41]" />
                  <span>INSPECTING_SEGMENT #{activeSentence.index}</span>
                </span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-[#00ff41]/50">LOCAL_RISK:</span>
                  <span
                    className={`font-bold ${
                      activeSentence.riskScore >= 65
                        ? 'text-[#ff3e3e]'
                        : activeSentence.riskScore >= 35
                        ? 'text-[#f59e0b]'
                        : 'text-[#00ff41]'
                    }`}
                  >
                    {activeSentence.riskScore}%
                  </span>
                </div>
              </div>

              <blockquote className="p-2.5 bg-[#0a0a0a] border-l-2 border-[#00ff41] text-xs text-gray-200">
                "{activeSentence.text}"
              </blockquote>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[10px]">
                <div>
                  <span className="text-[#00ff41]/50 block text-[9px] mb-0.5">EVALUATION_RATIONALE:</span>
                  <p className="text-gray-300 leading-normal">{activeSentence.reason}</p>
                </div>

                <div>
                  <span className="text-[#00ff41]/50 block text-[9px] mb-0.5">TRIGGER_TOKENS_FLAGGED:</span>
                  {activeSentence.triggers.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {activeSentence.triggers.map((t, idx) => {
                        const matchingKw = keywords.find((k) => k.word.toLowerCase() === t.toLowerCase());
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (matchingKw) {
                                handleKeywordClick(matchingKw);
                              } else {
                                handleKeywordClick({
                                  word: t,
                                  weight: 20,
                                  category: 'clickbait',
                                  frequency: 1,
                                });
                              }
                            }}
                            className="px-2 py-1 text-[9px] bg-[#ff3e3e]/20 hover:bg-[#ff3e3e]/40 text-[#ff6e6e] border border-[#ff3e3e]/50 font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer"
                            title="Click to view Knowledge Base & Fact-Checks"
                          >
                            <BookOpen className="w-2.5 h-2.5" />
                            <span>{t}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-[#00ff41] text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> No deceptive vocabulary triggers in segment
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Trigger Keywords Cloud with Interactive Knowledge Base Search */}
      {activeTab === 'keywords' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-[#00ff41]/70">
            <span>Click any term below to inspect manipulation mechanisms, dataset prevalence, and live fact-check sources:</span>
            <span className="text-white font-bold bg-black px-2 py-0.5 border border-[#00ff41]/30">
              {keywords.length} Triggers Detected
            </span>
          </div>

          {keywords.length === 0 ? (
            <div className="p-6 bg-[#080808] border border-[#00ff41]/20 text-center">
              <CheckCircle2 className="w-6 h-6 text-[#00ff41] mx-auto mb-1.5" />
              <p className="text-xs text-[#00ff41] font-bold uppercase">Zero Clickbait or Conspiracy Lexicons Detected</p>
              <p className="text-[10px] text-[#00ff41]/50 mt-0.5">Text does not trigger known misinformation vocabulary signatures.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {keywords.map((kw, idx) => (
                <div
                  key={idx}
                  onClick={() => handleKeywordClick(kw)}
                  className="p-3 bg-[#080808] border border-[#ff3e3e]/30 hover:border-[#00ff41] hover:bg-[#00ff41]/5 transition-all flex items-start justify-between gap-2 cursor-pointer group relative"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#ff3e3e] group-hover:text-[#00ff41] transition-colors" />
                      <span className="text-xs font-bold text-white group-hover:text-[#00ff41] transition-colors">
                        "{kw.word}"
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-gray-400">
                      <span className="uppercase text-[#00ff41]/70">{kw.category}</span>
                      <span>•</span>
                      <span>Freq: {kw.frequency}</span>
                    </div>

                    <div className="pt-1 flex items-center gap-1 text-[9px] text-[#00ff41] group-hover:underline">
                      <BookOpen className="w-2.5 h-2.5" />
                      <span>View Knowledge Base</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-[#ff3e3e] bg-[#ff3e3e]/20 px-1.5 py-0.5 border border-[#ff3e3e]/40 block">
                      +{kw.weight}%
                    </span>
                    <span className="text-[8px] text-gray-500 block mt-0.5 font-mono">RISK_DELTA</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: 5-Axis Radar Diagnostic Breakdown */}
      {activeTab === 'radar' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Radar Chart */}
            <div className="md:col-span-6 h-56 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={metrics.radarScores}>
                  <PolarGrid stroke="#00ff41" strokeOpacity={0.2} />
                  <PolarAngleAxis
                    dataKey="dimension"
                    stroke="#00ff41"
                    tick={{ fill: '#00ff41', fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#00ff41" strokeOpacity={0.3} />
                  <Radar
                    name="Claim Score"
                    dataKey="score"
                    stroke="#00ff41"
                    fill="#00ff41"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Benchmark Norm"
                    dataKey="benchmark"
                    stroke="#ffffff"
                    fill="#ffffff"
                    fillOpacity={0.1}
                    strokeDasharray="3 3"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Dimension Explanations */}
            <div className="md:col-span-6 space-y-1.5">
              {metrics.radarScores.map((dim, idx) => (
                <div key={idx} className="p-2 bg-[#080808] border border-[#00ff41]/20 text-[10px]">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-white uppercase">{dim.dimension}</span>
                    <span className="text-[#00ff41] font-bold">{dim.score} / 100</span>
                  </div>
                  <p className="text-[9px] text-[#00ff41]/60 leading-normal">{dim.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
