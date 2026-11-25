import React from 'react';
import { Cpu, X, Database, ShieldCheck, Zap, GitBranch, Binary, BookOpen } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface ModelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelInfoModal: React.FC<ModelInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono">
      <div className="relative w-full max-w-2xl bg-[#050505] border-neon shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#00ff41]/30 flex items-center justify-between bg-black">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00ff41]" />
            <h2 className="text-xs sm:text-sm font-bold text-[#00ff41] tracking-widest uppercase">
              ML_ARCHITECTURE & SYSTEM_BENCHMARKS
            </h2>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1 text-[#00ff41]/70 hover:text-[#ff3e3e] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 text-xs text-gray-300 max-h-[75vh] overflow-y-auto leading-relaxed">
          {/* Section 1: Dual Model Pipeline */}
          <div className="p-3 bg-black border border-[#00ff41]/30 space-y-1.5">
            <div className="flex items-center gap-2 text-[#00ff41] font-bold uppercase text-[11px]">
              <Zap className="w-3.5 h-3.5" />
              <span>1. DUAL-ENGINE MACHINE LEARNING STRATEGY</span>
            </div>
            <p className="text-[11px] text-[#00ff41]/80">
              To eliminate arbitrary binary classification ("Fake" vs "Real"), the engine utilizes an ensemble of two complementary algorithms:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-gray-300 text-[11px]">
              <li>
                <strong className="text-white">RandomForestClassifier (Classification):</strong> Evaluates linguistic style, syntactical urgency, and emotional charge across 100 decision trees.
              </li>
              <li>
                <strong className="text-white">Logistic Regression (Continuous Risk Score):</strong> Calculates the logit vector <code className="text-[#00ff41]">z = sum(w_i * x_i) + b</code> and extracts <code className="text-[#00ff41]">predict_proba()</code> via Sigmoid function to output continuous 0.0% to 100.0% probability.
              </li>
            </ul>
          </div>

          {/* Section 2: Datasets & Vectorization */}
          <div className="p-3 bg-black border border-[#00ff41]/30 space-y-1.5">
            <div className="flex items-center gap-2 text-[#00ff41] font-bold uppercase text-[11px]">
              <Database className="w-3.5 h-3.5" />
              <span>2. TRAINING DATASETS & FEATURE VECTORIZATION</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2 bg-[#080808] border border-[#00ff41]/20">
                <span className="text-[10px] text-[#00ff41]/60 block font-bold uppercase">Kaggle FakeNewsNet</span>
                <span className="text-white font-bold">23,196 Articles</span>
                <p className="text-[9px] text-gray-400 mt-0.5">PolitiFact and GossipCop verified ground-truth labels.</p>
              </div>

              <div className="p-2 bg-[#080808] border border-[#00ff41]/20">
                <span className="text-[10px] text-[#00ff41]/60 block font-bold uppercase">ISOT Fake News Benchmark</span>
                <span className="text-white font-bold">44,898 Articles</span>
                <p className="text-[9px] text-gray-400 mt-0.5">Real Reuters news matched against flagged disinformation corpus.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Explainable AI (XAI) */}
          <div className="p-3 bg-black border border-[#00ff41]/30 space-y-1.5">
            <div className="flex items-center gap-2 text-[#00ff41] font-bold uppercase text-[11px]">
              <GitBranch className="w-3.5 h-3.5" />
              <span>3. EXPLAINABLE AI (XAI) & TOKEN ATTRIBUTION</span>
            </div>
            <p className="text-[11px] text-[#00ff41]/80">
              Every score is decomposed into localized token delta weights and sentence-level heatmaps:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center pt-1 text-[10px]">
              <div className="p-1.5 bg-[#ff3e3e]/10 border border-[#ff3e3e]/30 text-[#ff6e6e]">
                <strong>Clickbait Lexicons</strong>
                <span className="block text-[8px] opacity-70 mt-0.5">Sensational keywords</span>
              </div>
              <div className="p-1.5 bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#ffc86e]">
                <strong>Urgency Triggers</strong>
                <span className="block text-[8px] opacity-70 mt-0.5">Forwarding pressure</span>
              </div>
              <div className="p-1.5 bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41]">
                <strong>Empirical Anchors</strong>
                <span className="block text-[8px] opacity-70 mt-0.5">Citations & data</span>
              </div>
            </div>
          </div>

          {/* Section 4: Python FastAPI & Node Equivalence */}
          <div className="p-3 bg-black border border-[#00ff41]/30 space-y-1">
            <div className="flex items-center gap-2 text-white font-bold uppercase text-[11px]">
              <Binary className="w-3.5 h-3.5 text-[#00ff41]" />
              <span>4. DUAL PYTHON FASTAPI & TYPESCRIPT PRODUCTION ENGINE</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Includes full Python model files (<code className="text-[#00ff41]">backend_python/main.py</code>, <code className="text-[#00ff41]">backend_python/model.py</code>) and TypeScript high-performance pipeline.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#00ff41]/30 bg-black flex items-center justify-end">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="btn-neon-action px-4 py-1.5 text-xs font-bold uppercase cursor-pointer"
          >
            DISMISS_WINDOW
          </button>
        </div>
      </div>
    </div>
  );
};
