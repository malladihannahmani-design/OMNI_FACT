import React, { useState, useEffect } from 'react';
import { Terminal, Activity } from 'lucide-react';

interface TerminalLoaderProps {
  onComplete?: () => void;
  isInputVideo?: boolean;
}

const TEXT_TERMINAL_MESSAGES = [
  '[SYS] Initializing Misinformation Vectorizer & Tensor Core v3.4...',
  '[NLP] Tokenizing UTF-8 character stream & stripping stop-words...',
  '[TF-IDF] Constructing n-gram feature matrix (uni/bi/tri-grams)...',
  '[RF-ENSEMBLE] Propagating vector across 100 Decision Trees (FakeNewsNet/ISOT weights)...',
  '[LOGISTIC] Computing continuous regression log-odds (z = sum(w*x) + b)...',
  '[SIGMOID] Transferring logit to risk score probability gauge (0.0% -> 100.0%)...',
  '[XAI-SHAP] Computing localized token attribution & sentence-level deception weights...',
  '[CALIBRATE] Synthesizing consensus confidence matrix (95.4% agreement)...',
  '[COMPLETE] Generating explainability dashboard & persisting claim ledger entry...'
];

const VIDEO_TERMINAL_MESSAGES = [
  '[SYS] Video payload detected: Bypassing Tier 1 & Tier 2 text tokenizers...',
  '[UPLOADING_TO_GEMINI_FILES_API...] Uploading video binary to Google AI File API...',
  '[GEMINI_FILES_API] Upload verified. File URI generated for multimodal pipeline...',
  '[MULTIMODAL] Inspecting visual frames for facial warping & deepfake boundary glitches...',
  '[AUDIO_ACOUSTICS] Decoding audio track for voice cloning & spectral cuts...',
  '[TRANSCRIPT_ENGINE] Extracting verbatim spoken dialogue from audio stream...',
  '[SYNTHESIS] Computing video manipulation risk score (0-100%)...',
  '[COMPLETE] Video forensic inspection complete.'
];

export const TerminalLoader: React.FC<TerminalLoaderProps> = ({ isInputVideo }) => {
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const logsEndRef = React.useRef<HTMLDivElement>(null);

  const messages = isInputVideo ? VIDEO_TERMINAL_MESSAGES : TEXT_TERMINAL_MESSAGES;

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentLogs]);

  useEffect(() => {
    const startTime = Date.now();
    const TARGET_DURATION_SEC = isInputVideo ? 8 : 14;

    setCurrentLogs([messages[0]]);
    setProgress(0);
    setElapsedSec(0);

    const timerInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setElapsedSec(elapsed);

      const calculatedProgress = Math.min(100, Math.floor((elapsed / TARGET_DURATION_SEC) * 100));
      setProgress(calculatedProgress);

      const logIndex = Math.min(
        messages.length - 1,
        Math.floor((elapsed / TARGET_DURATION_SEC) * messages.length)
      );

      setCurrentLogs(messages.slice(0, logIndex + 1));
    }, 50);

    return () => {
      clearInterval(timerInterval);
    };
  }, [isInputVideo]);

  return (
    <div className="border-neon bg-black p-4 sm:p-5 shadow-[0_0_15px_rgba(0,255,65,0.15)] my-4 relative overflow-hidden">
      {/* Background matrix pulse */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Activity className="w-28 h-28 text-[#00ff41] animate-pulse" />
      </div>

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-[#00ff41]/20 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#00ff41]" />
          <span className="text-[10px] font-bold text-[#00ff41] uppercase tracking-widest">
            TERMINAL // INFERENCE_RUNTIME_STREAM
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white font-mono bg-[#00ff41]/10 px-2 py-0.5 border border-[#00ff41]/30">
            ELAPSED: {elapsedSec.toFixed(1)}s
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#00ff41] animate-ping" />
            <span className="text-[10px] text-[#00ff41] font-bold">
              PROGRESS: {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Terminal Output Window */}
      <div className="bg-[#050505] p-3 border border-[#00ff41]/30 text-[10px] text-[#00ff41] space-y-1 min-h-[130px] max-h-[180px] overflow-y-auto font-mono">
        {currentLogs.map((log, idx) => (
          <div key={idx} className="flex items-start gap-2 leading-relaxed">
            <span className="text-white/30 select-none">{String(idx + 1).padStart(2, '0')}</span>
            <span className={idx === currentLogs.length - 1 ? 'text-white font-bold' : 'text-[#00ff41]/80'}>
              {log}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1 text-[#00ff41] animate-pulse">
          <span>&gt;</span>
          <span className="w-1.5 h-3.5 bg-[#00ff41] inline-block" />
        </div>
        <div ref={logsEndRef} />
      </div>

      {/* Progress Line */}
      <div className="mt-2.5 w-full bg-black h-1 overflow-hidden border border-[#00ff41]/30">
        <div
          className="bg-[#00ff41] h-full transition-all duration-200 shadow-[0_0_8px_#00ff41]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
