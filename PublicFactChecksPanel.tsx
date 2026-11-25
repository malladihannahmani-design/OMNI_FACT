import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Search, Globe, CheckCircle, AlertTriangle, XCircle, Info, Calendar, Sparkles } from 'lucide-react';
import { FactCheckItem } from '../types';

interface PublicFactChecksPanelProps {
  factChecks: FactCheckItem[];
  claimSnippet?: string;
}

export const PublicFactChecksPanel: React.FC<PublicFactChecksPanelProps> = ({
  factChecks,
  claimSnippet,
}) => {
  const [customSearchTerm, setCustomSearchTerm] = useState('');

  const getRatingBadge = (rating: FactCheckItem['ratingCategory'], text: string) => {
    switch (rating) {
      case 'FALSE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black uppercase bg-[#ff3e3e]/15 text-[#ff3e3e] border border-[#ff3e3e]/40 glow-red">
            <XCircle className="w-3 h-3" />
            <span>{text || 'FALSE'}</span>
          </span>
        );
      case 'MISLEADING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black uppercase bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/40 glow-amber">
            <AlertTriangle className="w-3 h-3" />
            <span>{text || 'MISLEADING'}</span>
          </span>
        );
      case 'TRUE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black uppercase bg-[#00ff41]/15 text-[#00ff41] border border-[#00ff41]/40 glow">
            <CheckCircle className="w-3 h-3" />
            <span>{text || 'VERIFIED TRUE'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black uppercase bg-gray-800 text-gray-300 border border-gray-600">
            <Info className="w-3 h-3" />
            <span>{text || 'AUDIT PENDING'}</span>
          </span>
        );
    }
  };

  const handleLaunchExternalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSearchTerm.trim()) return;
    const url = `https://toolbox.google.com/factcheck/explorer/search/list:recent;query=${encodeURIComponent(customSearchTerm.trim())}`;
    window.open(url, '_blank');
  };

  return (
    <div className="border border-neon bg-black p-4 sm:p-5 relative transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00ff41]/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#00ff41]" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00ff41] block">
              PUBLIC_FACT_CHECKING_INTEGRATION // GOOGLE FACT CHECK TOOLS API & CLAIMREVIEW
            </span>
            <span className="text-[9px] text-gray-400">
              Cross-referencing verified claims against international fact-checking organizations
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-0.5 bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] font-bold">
            {factChecks.length} MATCHED REVIEWS
          </span>
        </div>
      </div>

      {/* Fact-Checks List */}
      <div className="space-y-3">
        {factChecks.length > 0 ? (
          factChecks.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-[#050505] border border-[#00ff41]/25 hover:border-[#00ff41] transition-all group relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-mono">
                      Publisher: <strong className="text-white">{item.publisher}</strong>
                    </span>
                    {item.publisherSite && (
                      <span className="text-[9px] text-gray-500 font-mono">
                        ({item.publisherSite})
                      </span>
                    )}
                    {item.reviewDate && (
                      <span className="flex items-center gap-1 text-[9px] text-gray-400 font-mono">
                        <Calendar className="w-2.5 h-2.5" />
                        {item.reviewDate}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-[#00ff41] transition-colors leading-snug">
                    {item.title}
                  </h3>
                </div>

                <div className="shrink-0 self-start">
                  {getRatingBadge(item.ratingCategory, item.textualRating)}
                </div>
              </div>

              {/* Claim Reviewed */}
              <div className="p-2.5 bg-black border border-[#00ff41]/15 mb-2.5">
                <div className="text-[9px] uppercase tracking-widest text-[#00ff41]/70 font-bold mb-1">
                  CLAIM_AUDITED {item.claimant ? `(Claimant: ${item.claimant})` : ''}
                </div>
                <p className="text-xs text-gray-200 italic">
                  "{item.claim}"
                </p>
              </div>

              {/* Summary / Debunk details */}
              {item.summary && (
                <p className="text-[11px] text-gray-300 leading-relaxed mb-3">
                  {item.summary}
                </p>
              )}

              {/* Action Button: Outbound link to full fact check */}
              <div className="flex items-center justify-between pt-2 border-t border-[#00ff41]/10 text-[10px]">
                <span className="text-[#00ff41]/60 font-mono">
                  VERIFIED_SOURCE_LEDGER
                </span>
                <a
                  href={item.reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00ff41]/10 hover:bg-[#00ff41] border border-[#00ff41]/40 text-[#00ff41] hover:text-black font-bold uppercase tracking-wider transition-all"
                >
                  <span>Read Full Audit at {item.publisher}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 bg-black border border-[#00ff41]/20 text-center space-y-2">
            <Info className="w-6 h-6 text-[#00ff41] mx-auto opacity-70" />
            <p className="text-xs text-gray-300">
              No direct ClaimReview duplicate was detected in standard viral hoaxes database.
            </p>
          </div>
        )}
      </div>

      {/* Manual Quick Search Footer for Fact Check Tools */}
      <div className="mt-4 pt-3.5 border-t border-[#00ff41]/20">
        <form onSubmit={handleLaunchExternalSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#00ff41] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={customSearchTerm}
              onChange={(e) => setCustomSearchTerm(e.target.value)}
              placeholder="Search Google Fact Check Tools API for any claim keyword..."
              className="w-full pl-8 pr-3 py-1.5 bg-black border border-[#00ff41]/30 focus:border-[#00ff41] text-xs text-white placeholder-gray-500 font-mono outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-[#00ff41]/15 hover:bg-[#00ff41] text-[#00ff41] hover:text-black border border-[#00ff41] text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            Query Explorer
          </button>
        </form>
      </div>
    </div>
  );
};
