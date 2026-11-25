import React, { useState, useEffect } from 'react';
import { ShieldAlert, Terminal, Volume2, VolumeX, History, Cpu, Database, Sparkles, Radio, Lock } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  onToggleHistory: () => void;
  isHistoryOpen: boolean;
  historyCount: number;
  onOpenModelInfo: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  isScanning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleHistory,
  isHistoryOpen,
  historyCount,
  onOpenModelInfo,
  audioEnabled,
  onToggleAudio,
  isScanning,
}) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toTimeString().split(' ')[0]
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[#00ff41]/30 bg-[#050505]/95 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Live Pulse */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-3 h-3 bg-[#00ff41] rounded-full animate-pulse shadow-[0_0_10px_#00ff41]" />
              <div className="absolute w-6 h-6 rounded-full border border-[#00ff41]/30 animate-ping pointer-events-none" />
            </div>

            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-widest glow text-[#00ff41] flex items-center gap-2 uppercase">
                <span>OMNI_FACT</span>
                <span className="text-white/40">::</span>
                <span className="text-white">SENSITIVE_INTEL</span>
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/40 tracking-wider">
                XAI-v3.4
              </span>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              id="btn-audio-toggle-mobile"
              onClick={onToggleAudio}
              className={`p-1.5 text-xs border ${
                audioEnabled
                  ? 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]'
                  : 'bg-black text-gray-500 border-gray-800'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              id="btn-toggle-history-mobile"
              onClick={onToggleHistory}
              className="p-1.5 text-[10px] font-bold bg-[#00ff41] text-black uppercase"
            >
              LEDGER ({historyCount})
            </button>
          </div>
        </div>

        {/* Telemetry Node Info (Protocol & Real-Time Clock) */}
        <div className="hidden lg:flex items-center gap-5 text-[10px] tracking-wider text-[#00ff41]/80">
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">PROTOCOL:</span>
            <span className="text-[#00ff41] font-bold">XAI-44</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">NODE:</span>
            <span className="text-[#00ff41]">192.168.1.104</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#00ff41]/60" />
            <span className="text-white/40">ENCRYPTION:</span>
            <span className="text-[#00ff41]">AES-256</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 border border-[#00ff41]/20">
            <span className="text-white/40">SYS_TIME:</span>
            <span className="text-white font-bold">{timeString || '22:41:09'}</span>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            id="btn-model-info"
            onClick={() => {
              soundFx.playClick();
              onOpenModelInfo();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold bg-black border border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/10 hover:border-[#00ff41] transition-all tracking-wider uppercase"
            title="Inspect Machine Learning Model Specs & Benchmarks"
          >
            <Cpu className="w-3.5 h-3.5 text-[#00ff41]" />
            <span>ML_SPECS</span>
          </button>

          <button
            id="btn-audio-toggle"
            onClick={onToggleAudio}
            className={`p-1.5 text-xs border transition-all ${
              audioEnabled
                ? 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.3)]'
                : 'bg-black text-gray-500 border-white/10 hover:text-gray-300'
            }`}
            title={audioEnabled ? 'Audio Synthesizer Muted' : 'Enable Cyber Terminal Synthesizer Audio'}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00ff41]" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            id="btn-toggle-history"
            onClick={() => {
              soundFx.playClick();
              onToggleHistory();
            }}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all ${
              isHistoryOpen
                ? 'bg-[#00ff41] text-black border-[#00ff41] shadow-[0_0_12px_#00ff41]'
                : 'bg-black text-[#00ff41] border-[#00ff41]/40 hover:bg-[#00ff41]/10 hover:border-[#00ff41]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>LEDGER</span>
            {historyCount > 0 && (
              <span className={`px-1 py-0.2 text-[9px] font-black ${
                isHistoryOpen ? 'bg-black text-[#00ff41]' : 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40'
              }`}>
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
