import React, { useState } from 'react';
import {
  History,
  X,
  Search,
  Trash2,
  Download,
  FileText,
  Globe,
  Image as ImageIcon,
  ArrowRight,
} from 'lucide-react';
import { HistoryItem, Verdict } from '../types';
import { soundFx } from '../utils/audio';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectClaim: (id: string) => void;
  onDeleteClaim: (id: string) => void;
  onClearHistory: () => void;
  activeClaimId?: string;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  history,
  onSelectClaim,
  onDeleteClaim,
  onClearHistory,
  activeClaimId,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [verdictFilter, setVerdictFilter] = useState<'ALL' | Verdict>('ALL');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sourceDomain && item.sourceDomain.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.sourceTitle && item.sourceTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesVerdict = verdictFilter === 'ALL' || item.verdict === verdictFilter;
    return matchesSearch && matchesVerdict;
  });

  const handleExportJSON = () => {
    soundFx.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `misinformation_ledger_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sidebar Panel */}
      <div className="relative w-full max-w-md bg-[#050505] border-l border-[#00ff41]/40 h-full flex flex-col shadow-2xl z-10 font-mono">
        {/* Header */}
        <div className="p-3.5 border-b border-[#00ff41]/20 flex items-center justify-between bg-black">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#00ff41]" />
            <h2 className="text-xs sm:text-sm font-bold text-[#00ff41] tracking-widest uppercase">
              CLAIMS_HISTORY_LEDGER
            </h2>
            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleExportJSON}
              className="p-1 text-[#00ff41]/70 hover:text-[#00ff41] transition-colors"
              title="Export Ledger to JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-[#00ff41]/70 hover:text-[#ff3e3e] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filter bar */}
        <div className="p-3 border-b border-[#00ff41]/10 space-y-2 bg-black/50">
          <div className="relative">
            <Search className="w-3 h-3 text-[#00ff41]/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyword or domain..."
              className="w-full pl-7 pr-2.5 py-1.5 bg-[#080808] border border-[#00ff41]/30 text-xs text-[#00ff41] placeholder-[#00ff41]/30 focus:outline-none focus:border-[#00ff41]"
            />
          </div>

          <div className="flex items-center gap-1 text-[9px] font-bold uppercase">
            {(['ALL', 'FAKE', 'SUSPICIOUS', 'CREDIBLE'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  soundFx.playClick();
                  setVerdictFilter(filter);
                }}
                className={`px-2 py-0.5 transition-all cursor-pointer ${
                  verdictFilter === filter
                    ? 'bg-[#00ff41] text-black shadow-[0_0_6px_#00ff41]'
                    : 'bg-black text-[#00ff41]/60 hover:text-[#00ff41] border border-[#00ff41]/20'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Claims List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredHistory.length === 0 ? (
            <div className="p-6 text-center text-[#00ff41]/40 text-xs">
              <p>[NO_MATCHING_RECORDS]</p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isActive = activeClaimId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    soundFx.playClick();
                    onSelectClaim(item.id);
                  }}
                  className={`p-2.5 border transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-[#00ff41]/10 border-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.2)]'
                      : 'bg-[#080808] hover:bg-black border-[#00ff41]/20 hover:border-[#00ff41]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      {item.inputMode === 'url' ? (
                        <Globe className="w-3 h-3 text-[#00ff41]" />
                      ) : item.inputMode === 'image' ? (
                        <ImageIcon className="w-3 h-3 text-[#f59e0b]" />
                      ) : (
                        <FileText className="w-3 h-3 text-[#00ff41]" />
                      )}
                      <span className="text-[9px] text-gray-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[9px] px-1 py-0.2 font-bold uppercase border ${
                          item.verdict === 'FAKE'
                            ? 'bg-[#ff3e3e]/20 text-[#ff6e6e] border-[#ff3e3e]/50'
                            : item.verdict === 'SUSPICIOUS' || item.verdict === 'BROKEN_LINK'
                            ? 'bg-[#f59e0b]/20 text-[#ffc86e] border-[#f59e0b]/50'
                            : 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/50'
                        }`}
                      >
                        {item.verdict} [{item.riskScore}%]
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFx.playClick();
                          onDeleteClaim(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-500 hover:text-[#ff3e3e] transition-opacity"
                        title="Delete from Ledger"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {item.sourceTitle && (
                    <p className="text-[11px] font-bold text-white line-clamp-1 mb-0.5">
                      {item.sourceTitle}
                    </p>
                  )}

                  <p className="text-[10px] text-gray-300 line-clamp-2 leading-relaxed">
                    "{item.snippet}"
                  </p>

                  <div className="flex items-center justify-between text-[9px] text-[#00ff41]/60 mt-1.5 pt-1 border-t border-[#00ff41]/10">
                    <span>{item.wordCount} words • {item.flagCount} flags</span>
                    <span className="text-[#00ff41] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform font-bold uppercase">
                      INSPECT <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#00ff41]/20 bg-black flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Clear all claims history from ledger?')) {
                soundFx.playClick();
                onClearHistory();
              }
            }}
            disabled={history.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] text-[#ff3e3e] hover:bg-[#ff3e3e]/20 border border-[#ff3e3e]/30 transition-colors disabled:opacity-30 uppercase font-bold cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>PURGE_LEDGER</span>
          </button>

          <span className="text-[9px] text-[#00ff41]/50 uppercase">
            SQLITE_PERSISTENCE // OK
          </span>
        </div>
      </div>
    </div>
  );
};
