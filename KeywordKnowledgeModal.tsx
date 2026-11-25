import React from 'react';
import { X, ExternalLink, BookOpen, AlertTriangle, ShieldCheck, Search, Database } from 'lucide-react';
import { SuspiciousKeyword } from '../types';

interface KeywordKnowledgeModalProps {
  keyword: SuspiciousKeyword | null;
  onClose: () => void;
}

export const KeywordKnowledgeModal: React.FC<KeywordKnowledgeModalProps> = ({
  keyword,
  onClose,
}) => {
  if (!keyword) return null;

  const kb = keyword.knowledgeBase;
  const categoryBadgeColor =
    keyword.category === 'urgency'
      ? 'text-[#ff3e3e] border-[#ff3e3e]/40 bg-[#ff3e3e]/10'
      : keyword.category === 'conspiracy'
      ? 'text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/10'
      : keyword.category === 'clickbait'
      ? 'text-[#38bdf8] border-[#38bdf8]/40 bg-[#38bdf8]/10'
      : 'text-[#a855f7] border-[#a855f7]/40 bg-[#a855f7]/10';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#080808] border-2 border-[#00ff41] shadow-[0_0_30px_rgba(0,255,65,0.25)] p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cyberpunk corner decorations */}
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#00ff41]" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff41]" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#00ff41]" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00ff41]" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#00ff41]/30 pb-3 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#00ff41]" />
              <span className="text-[10px] uppercase tracking-widest text-[#00ff41] font-bold">
                XAI_KNOWLEDGE_BASE // TERMINOLOGY_INSPECTOR
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <h2 className="text-xl sm:text-2xl font-black text-white glow tracking-tight">
                "{keyword.word}"
              </h2>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${categoryBadgeColor}`}>
                {keyword.category.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-gray-400 bg-black px-2 py-0.5 border border-[#00ff41]/20">
                Risk Weight: <strong className="text-[#00ff41]">+{keyword.weight} pts</strong>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-[#00ff41] border border-[#00ff41]/30 hover:border-[#00ff41] bg-black transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Knowledge Base Body */}
        {kb ? (
          <div className="space-y-4 text-xs">
            {/* Definition */}
            <div className="p-3 bg-black border border-[#00ff41]/30">
              <span className="text-[9px] uppercase tracking-widest text-[#00ff41]/70 block font-bold mb-1">
                TACTICAL_DEFINITION
              </span>
              <p className="text-gray-200 leading-relaxed">
                {kb.definition}
              </p>
            </div>

            {/* Manipulation Mechanism */}
            <div className="p-3 bg-black border border-[#f59e0b]/40">
              <div className="flex items-center gap-1.5 text-[#f59e0b] mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-[9px] uppercase tracking-widest font-bold">
                  PSYCHOLOGICAL_MANIPULATION_MECHANISM
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {kb.manipulationMechanism}
              </p>
            </div>

            {/* Real World Examples */}
            {kb.realWorldExamples && kb.realWorldExamples.length > 0 && (
              <div className="p-3 bg-black border border-[#00ff41]/20">
                <span className="text-[9px] uppercase tracking-widest text-[#00ff41]/70 block font-bold mb-1.5">
                  HISTORICAL_MISINFORMATION_CASE_STUDIES
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-gray-300">
                  {kb.realWorldExamples.map((ex, i) => (
                    <li key={i} className="leading-relaxed">
                      <span className="text-white">{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dataset Statistics */}
            {kb.datasetPrevalence && (
              <div className="flex items-center gap-2 p-2.5 bg-[#00ff41]/5 border border-[#00ff41]/20 text-[11px] text-gray-300">
                <Database className="w-4 h-4 text-[#00ff41] shrink-0" />
                <span>
                  <strong className="text-white">Dataset Prevalence:</strong> {kb.datasetPrevalence}
                </span>
              </div>
            )}

            {/* Clickable External Sources & Fact Checks */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-3.5 h-3.5 text-[#00ff41]" />
                <span className="text-[10px] uppercase tracking-widest text-[#00ff41] font-bold">
                  CROSS_REFERENCE_VERIFICATION_LINKS
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {kb.searchLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-black border border-[#00ff41]/30 hover:border-[#00ff41] hover:bg-[#00ff41]/10 text-gray-200 hover:text-white transition-all group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#00ff41]">
                        <span>{link.title}</span>
                      </div>
                      <span className="text-[9px] text-gray-400 block">
                        Source: {link.source}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#00ff41]/70 group-hover:text-[#00ff41] group-hover:translate-x-0.5 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-black border border-[#00ff41]/30 space-y-3 text-xs">
            <p className="text-gray-300">
              The term <strong className="text-white">"{keyword.word}"</strong> was flagged as an active linguistic feature vector with a deception weight score of <strong className="text-[#00ff41]">+{keyword.weight}</strong>.
            </p>
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-widest text-[#00ff41] block mb-2 font-bold">
                EXTERNAL_FACT_CHECK_SEARCH
              </span>
              <a
                href={`https://toolbox.google.com/factcheck/explorer/search/list:recent;query=${encodeURIComponent(keyword.word)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-[#00ff41]/10 border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black font-bold uppercase tracking-wider text-[10px] transition-colors"
              >
                <span>Search Google Fact Check Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-[#00ff41]/20 flex items-center justify-between text-[10px] text-[#00ff41]/60">
          <span>XAI_KNOWLEDGE_CORPUS_v3.4</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-black border border-[#00ff41]/40 text-white hover:border-[#00ff41] hover:text-[#00ff41] uppercase tracking-wider font-bold transition-colors"
          >
            DISMISS [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
