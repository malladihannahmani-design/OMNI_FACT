import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OmniInput } from './components/OmniInput';
import { RiskGauge } from './components/RiskGauge';
import { ThreeTierInspector } from './components/ThreeTierInspector';
import { XAIExplainer } from './components/XAIExplainer';
import { PublicFactChecksPanel } from './components/PublicFactChecksPanel';
import { ForensicReportPanel } from './components/ForensicReportPanel';
import { KeywordKnowledgeModal } from './components/KeywordKnowledgeModal';
import { ModelTelemetryPanel } from './components/ModelTelemetryPanel';
import { HistorySidebar } from './components/HistorySidebar';
import { ModelInfoModal } from './components/ModelInfoModal';
import { TerminalLoader } from './components/TerminalLoader';
import { AnalysisResult, HistoryItem, InputMode, SampleClaim, SuspiciousKeyword } from './types';
import { soundFx } from './utils/audio';
import { ShieldCheck, Activity, Terminal as TerminalIcon, Sparkles, Globe, FileCheck2, Layers } from 'lucide-react';

export default function App() {
  const [activeResult, setActiveResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzingVideo, setIsAnalyzingVideo] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isModelInfoOpen, setIsModelInfoOpen] = useState<boolean>(false);
  const [selectedKeywordForModal, setSelectedKeywordForModal] = useState<SuspiciousKeyword | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(soundFx.enabled);
  const [sampleClaims, setSampleClaims] = useState<SampleClaim[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dashboardTab, setDashboardTab] = useState<'all' | 'xai' | 'factcheck' | 'forensic' | 'telemetry'>('all');

  // Fetch initial history, stats, and sample claims on mount
  useEffect(() => {
    fetchHistory();
    fetchSampleClaims();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.history) {
        setHistory(data.history);
        if (!activeResult && data.history.length > 0) {
          fetchClaimById(data.history[0].id);
        }
      }
    } catch (err) {
      console.warn('Failed to load claims history:', err);
    }
  };

  const fetchSampleClaims = async () => {
    try {
      const res = await fetch('/api/sample-claims');
      const data = await res.json();
      if (data.samples) {
        setSampleClaims(data.samples);
      }
    } catch (err) {
      console.warn('Failed to load sample claims:', err);
    }
  };

  const fetchClaimById = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`);
      const data = await res.json();
      if (data.claim) {
        setActiveResult(data.claim);
      }
    } catch (err) {
      console.warn('Failed to load claim detail:', err);
    }
  };

  const handleAnalyze = async (payload: {
    text: string;
    inputMode: InputMode;
    url?: string;
    title?: string;
    videoBase64?: string;
    videoMimeType?: string;
    videoName?: string;
  }) => {
    setIsLoading(true);
    setIsAnalyzingVideo(payload.inputMode === 'video' || Boolean(payload.videoBase64));
    setErrorMessage(null);
    window.scrollTo({ top: 380, behavior: 'smooth' });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete analysis');
      }

      setActiveResult(data.result);
      setIsLoading(false);
      setIsAnalyzingVideo(false);
      soundFx.playVerdict(data.result.verdict === 'FAKE');
      fetchHistory();
    } catch (err) {
      setIsLoading(false);
      setIsAnalyzingVideo(false);
      setErrorMessage((err as Error).message);
    }
  };

  const handleDeleteClaim = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
      setHistory((prev) => prev.filter((i) => i.id !== id));
      if (activeResult?.id === id) {
        const remaining = history.filter((i) => i.id !== id);
        if (remaining.length > 0) {
          fetchClaimById(remaining[0].id);
        } else {
          setActiveResult(null);
        }
      }
    } catch (err) {
      console.warn('Delete failed:', err);
    }
  };

  const handleClearHistory = async () => {
    try {
      await fetch('/api/history/clear', { method: 'POST' });
      setHistory([]);
      setActiveResult(null);
    } catch (err) {
      console.warn('Clear history failed:', err);
    }
  };

  const handleToggleAudio = () => {
    const newState = soundFx.toggle();
    setAudioEnabled(newState);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#00ff41] relative selection:bg-[#00ff41]/30 selection:text-white font-mono flex flex-col justify-between">
      {/* Laser Scanline Overlay */}
      <div className="scanline" />

      {/* CRT Matrix Grid Overlay */}
      <div className="fixed inset-0 crt-grid pointer-events-none z-20 opacity-70" />

      {/* Main App Container */}
      <div className="relative z-10">
        {/* Main Header */}
        <Header
          onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
          isHistoryOpen={isHistoryOpen}
          historyCount={history.length}
          onOpenModelInfo={() => setIsModelInfoOpen(true)}
          audioEnabled={audioEnabled}
          onToggleAudio={handleToggleAudio}
          isScanning={isLoading}
        />

        {/* Main Body Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Hero Section */}
          <section className="text-center max-w-3xl mx-auto space-y-2 pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black border border-[#00ff41]/40 text-[#00ff41] text-[10px] font-bold uppercase tracking-widest glow shadow-[0_0_10px_rgba(0,255,65,0.2)]">
              <span className="w-2 h-2 bg-[#00ff41] animate-pulse" />
              <span>MISINFORMATION_FORENSIC_INTELLIGENCE // v3.4</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-wider uppercase glow">
              CONTINUOUS RISK SCORING & <span className="text-[#00ff41]">EXPLAINABLE XAI</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-[#00ff41]/70 max-w-2xl mx-auto leading-relaxed">
              Omni-channel detection matrix evaluating raw WhatsApp forwards, news URLs, and screenshot image tensors via 100-tree Random Forest voting, ClaimReview Google Fact Checks, and continuous forensic linguistics.
            </p>
          </section>

          {/* Omni-Input Console */}
          <section id="omni-input-section">
            <OmniInput
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              sampleClaims={sampleClaims}
            />
          </section>

          {/* Error notification */}
          {errorMessage && (
            <div className="p-3 bg-[#ff3e3e]/10 border border-[#ff3e3e] text-[#ff3e3e] text-xs flex items-center justify-between">
              <span>[PIPELINE_ERROR]: {errorMessage}</span>
              <button onClick={() => setErrorMessage(null)} className="text-white hover:text-[#ff3e3e] underline font-bold uppercase">
                DISMISS
              </button>
            </div>
          )}

          {/* Loading Terminal Animation */}
          {isLoading && <TerminalLoader isInputVideo={isAnalyzingVideo} />}

          {/* Results Dashboard Section */}
          {activeResult && !isLoading && (
            <section id="results-dashboard" className="space-y-5 animate-in fade-in duration-300">
              {/* Header info of active claim */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00ff41]/20 pb-2 text-[11px] text-[#00ff41]/80">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#00ff41]" />
                  <span className="text-white font-bold uppercase">ANALYSIS_RESULT // CLAIM #{activeResult.id}</span>
                  <span className="text-[#00ff41]/50">• {new Date(activeResult.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px]">
                  <span>LATENCY: <strong className="text-white">{activeResult.processingTimeMs}ms</strong></span>
                  <span>TOKENS: <strong className="text-white">{activeResult.wordCount} words</strong></span>
                  <span>CONFIDENCE: <strong className="text-[#00ff41]">{activeResult.metrics.confidence}%</strong></span>
                </div>
              </div>

              {/* 1. Continuous Risk Score Gauge & Primary Verdict */}
              <RiskGauge
                score={activeResult.riskScore}
                verdict={activeResult.verdict}
                confidence={activeResult.metrics.confidence}
                modelAgreement={activeResult.metrics.modelAgreement}
                certaintyLevel={activeResult.metrics.certaintyLevel}
                severityLevel={activeResult.forensicReport?.risk_scoring.severity_level}
              />

              {/* 3-Tier Independent Model Inspector Cards */}
              <ThreeTierInspector result={activeResult} />

              {/* Module Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-[#00ff41]/20 pb-2">
                <span className="text-[10px] text-gray-400 mr-2 uppercase font-bold flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#00ff41]" /> VIEW_MODULE:
                </span>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setDashboardTab('all');
                  }}
                  className={`px-3 py-1 text-[10px] font-bold uppercase transition-all ${
                    dashboardTab === 'all'
                      ? 'bg-[#00ff41] text-black shadow-[0_0_8px_#00ff41]'
                      : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/30 hover:bg-[#00ff41]/10'
                  }`}
                >
                  All Forensic Modules
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setDashboardTab('factcheck');
                  }}
                  className={`px-3 py-1 text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                    dashboardTab === 'factcheck'
                      ? 'bg-[#00ff41] text-black shadow-[0_0_8px_#00ff41]'
                      : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/30 hover:bg-[#00ff41]/10'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span>Public Fact Checks ({activeResult.publicFactChecks?.length || 0})</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setDashboardTab('forensic');
                  }}
                  className={`px-3 py-1 text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                    dashboardTab === 'forensic'
                      ? 'bg-[#00ff41] text-black shadow-[0_0_8px_#00ff41]'
                      : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/30 hover:bg-[#00ff41]/10'
                  }`}
                >
                  <FileCheck2 className="w-3 h-3" />
                  <span>Forensic Deconstruction Report</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setDashboardTab('xai');
                  }}
                  className={`px-3 py-1 text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                    dashboardTab === 'xai'
                      ? 'bg-[#00ff41] text-black shadow-[0_0_8px_#00ff41]'
                      : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/30 hover:bg-[#00ff41]/10'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Explainable AI & Triggers</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setDashboardTab('telemetry');
                  }}
                  className={`px-3 py-1 text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                    dashboardTab === 'telemetry'
                      ? 'bg-[#00ff41] text-black shadow-[0_0_8px_#00ff41]'
                      : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/30 hover:bg-[#00ff41]/10'
                  }`}
                >
                  <TerminalIcon className="w-3 h-3" />
                  <span>Model Telemetry & 100 Trees</span>
                </button>
              </div>

              {/* 2. Public Fact-Checking Integration Panel */}
              {(dashboardTab === 'all' || dashboardTab === 'factcheck') && (
                <PublicFactChecksPanel
                  factChecks={activeResult.publicFactChecks || []}
                  claimSnippet={activeResult.rawText}
                />
              )}

              {/* 3. Forensic Misinformation Report Panel */}
              {(dashboardTab === 'all' || dashboardTab === 'forensic') && activeResult.forensicReport && (
                <ForensicReportPanel
                  report={activeResult.forensicReport}
                />
              )}

              {/* 4. Explainable AI (XAI) Sentence Heatmap, Clickbait Lexicon & 5-Axis Radar */}
              {(dashboardTab === 'all' || dashboardTab === 'xai') && (
                <XAIExplainer
                  sentences={activeResult.sentences}
                  keywords={activeResult.suspiciousKeywords}
                  metrics={activeResult.metrics}
                  onSelectKeyword={(kw) => setSelectedKeywordForModal(kw)}
                />
              )}

              {/* 5. Forensic Model Telemetry, 100 Trees & Deep Gemini Fact Audit */}
              {(dashboardTab === 'all' || dashboardTab === 'telemetry') && (
                <ModelTelemetryPanel
                  metrics={activeResult.metrics}
                  deepAudit={activeResult.verifiedDeepAudit}
                  terminalLogs={activeResult.terminalLogs}
                />
              )}
            </section>
          )}
        </main>
      </div>

      {/* Immersive UI Footer HUD */}
      <footer className="border-t border-[#00ff41]/20 bg-black/90 px-4 sm:px-6 py-2.5 text-[10px] text-[#00ff41]/60 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#00ff41]">
              <span className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse shadow-[0_0_6px_#00ff41]" />
              <strong>ONLINE</strong>
            </span>
            <span className="opacity-40">|</span>
            <span>HACKATHON_BUILD // CLUSTER_ID: ALPHA_7</span>
          </div>

          <div className="flex items-center gap-4 text-[9px] text-[#00ff41]/80">
            <span>ISOT / FAKENEWSNET REPO</span>
            <span>LOGGED: ROOT_USER</span>
            <span className="text-white font-bold bg-[#00ff41]/10 px-2 py-0.5 border border-[#00ff41]/30">
              DEPLOYED: SUCCESS
            </span>
          </div>
        </div>
      </footer>

      {/* Interactive Keyword Knowledge Base Modal */}
      <KeywordKnowledgeModal
        keyword={selectedKeywordForModal}
        onClose={() => setSelectedKeywordForModal(null)}
      />

      {/* History Sidebar Ledger */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectClaim={(id) => {
          fetchClaimById(id);
          setIsHistoryOpen(false);
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }}
        onDeleteClaim={handleDeleteClaim}
        onClearHistory={handleClearHistory}
        activeClaimId={activeResult?.id}
      />

      {/* Model Specs Modal */}
      <ModelInfoModal
        isOpen={isModelInfoOpen}
        onClose={() => setIsModelInfoOpen(false)}
      />
    </div>
  );
}
