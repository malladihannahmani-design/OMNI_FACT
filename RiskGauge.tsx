import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldCheck, ShieldAlert, AlertOctagon, Cpu, Activity, Zap, CheckCircle2, Award, AlertTriangle } from 'lucide-react';
import { Verdict } from '../types';

interface RiskGaugeProps {
  score: number; // 0.0 - 100.0
  verdict: Verdict;
  confidence: number;
  modelAgreement: number;
  certaintyLevel?: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
  severityLevel?: 'Low' | 'Moderate' | 'High' | 'Severe';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  verdict,
  confidence,
  modelAgreement,
  certaintyLevel = confidence >= 90 ? 'VERY_HIGH' : confidence >= 80 ? 'HIGH' : confidence >= 70 ? 'MODERATE' : 'LOW',
  severityLevel,
}) => {
  if (verdict === 'BROKEN_LINK') {
    return (
      <div className="border border-[#f59e0b] bg-[#0c0a00] p-4 sm:p-5 relative transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] font-mono">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f59e0b]/30 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#f59e0b] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b]">
              TARGET_URL_UNREACHABLE // HTTP_STATUS_WARNING
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-[#f59e0b]/70">STATUS_CODE:</span>
            <span className="text-white font-bold bg-[#181200] px-2 py-0.5 border border-[#f59e0b]/40">
              HTTP 404 / UNREACHABLE
            </span>
          </div>
        </div>

        {/* Content Warning Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-[#140f00] border border-[#f59e0b]/40 text-center space-y-2">
            <AlertTriangle className="w-10 h-10 text-[#f59e0b] animate-pulse" />
            <span className="text-xl font-black text-[#f59e0b] glow-amber uppercase tracking-widest">
              [BROKEN_LINK]
            </span>
            <span className="text-[10px] text-amber-200/70 uppercase tracking-wider">
              PIPELINE SHORT-CIRCUITED
            </span>
          </div>

          <div className="md:col-span-7 space-y-3">
            <div className="p-3 bg-[#140f00] border border-[#f59e0b]/40">
              <span className="text-xs font-bold text-[#f59e0b] block mb-1 uppercase tracking-wide">
                ⚠️ ANALYSIS ABORTED
              </span>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                Target URL returned an HTTP 404 Not Found or is unreachable. Analysis aborted.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="p-2 bg-black border border-[#f59e0b]/30 text-center">
                <span className="text-amber-400/60 block text-[8px] uppercase">VERDICT</span>
                <span className="text-[#f59e0b] font-bold">BROKEN_LINK</span>
              </div>
              <div className="p-2 bg-black border border-[#f59e0b]/30 text-center">
                <span className="text-amber-400/60 block text-[8px] uppercase">RISK_SCORE</span>
                <span className="text-amber-300 font-bold">0.0%</span>
              </div>
              <div className="p-2 bg-black border border-[#f59e0b]/30 text-center">
                <span className="text-amber-400/60 block text-[8px] uppercase">CERTAINTY</span>
                <span className="text-emerald-400 font-bold">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const isHighRisk = score >= 65;
  const isModerateRisk = score >= 28 && score < 65;
  const isLowRisk = score < 28;

  const primaryColor = isHighRisk ? '#ff3e3e' : isModerateRisk ? '#f59e0b' : '#00ff41';
  const glowTextClass = isHighRisk ? 'glow-red' : isModerateRisk ? 'glow-amber' : 'glow';
  const borderClass = isHighRisk ? 'border-neon-warning' : isModerateRisk ? 'border-neon-amber' : 'border-neon';

  const clampedScore = Math.max(0, Math.min(100, score));
  // Needle starts horizontal left (0% mark at 0 deg) and rotates clockwise across 180 degrees to the right (100% mark at 180 deg)
  const needleAngle = (clampedScore / 100) * 180;

  const gaugeData = [
    { name: 'Credible (0-28%)', value: 28, color: '#00ff41' },
    { name: 'Suspicious (28-65%)', value: 37, color: '#f59e0b' },
    { name: 'Fake (65-100%)', value: 35, color: '#ff3e3e' },
  ];

  return (
    <div className={`${borderClass} bg-black p-4 sm:p-5 relative transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)]`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00ff41]/20 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#00ff41]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#00ff41] opacity-90">
            CONTINUOUS_RISK_SCORING & CLASSIFICATION_CERTAINTY
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-[#00ff41]/60">CONSENSUS_AGREEMENT:</span>
          <span className="text-white font-bold bg-[#080808] px-2 py-0.5 border border-[#00ff41]/30">
            {modelAgreement}% ENSEMBLE
          </span>
        </div>
      </div>

      {/* Dual Metrics: Risk Score + Model Confidence Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Recharts Semi-Circle Risk Score Gauge */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative">
          <div className="w-full h-44 sm:h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="75%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="65%"
                  outerRadius="90%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="#050505"
                  strokeWidth={2}
                >
                  {gaugeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={
                        (index === 0 && isLowRisk) ||
                        (index === 1 && isModerateRisk) ||
                        (index === 2 && isHighRisk)
                          ? 1
                          : 0.3
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Needle Pivot & Precision Arrow SVG (Coaligned with cx=50%, cy=75%) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg viewBox="0 0 240 140" className="w-full h-full max-w-[260px] max-h-[170px] overflow-visible">
                {/* Center Pivot circles */}
                <circle cx="120" cy="105" r="7" fill={primaryColor} stroke="#050505" strokeWidth="2" />
                <circle cx="120" cy="105" r="3" fill="#ffffff" />
                
                {/* Needle rotating from 0 deg (left 0%) to 180 deg (right 100%) */}
                <g
                  style={{
                    transform: `rotate(${needleAngle}deg)`,
                    transformOrigin: '120px 105px',
                    transition: 'transform 0.8s cubic-bezier(0.34, 1.4, 0.64, 1)',
                  }}
                >
                  {/* Needle Shaft */}
                  <line
                    x1="120"
                    y1="105"
                    x2="42"
                    y2="105"
                    stroke={primaryColor}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter={`drop-shadow(0 0 6px ${primaryColor})`}
                  />
                  {/* Directional Arrow Tip pointing left at 0% baseline */}
                  <polygon
                    points="32,105 46,99 46,111"
                    fill={primaryColor}
                    filter={`drop-shadow(0 0 6px ${primaryColor})`}
                  />
                </g>
              </svg>
            </div>

            {/* Score Center readout */}
            <div className="absolute bottom-1 flex flex-col items-center">
              <span
                className={`text-3xl sm:text-4xl font-black tracking-tight ${glowTextClass}`}
                style={{ color: primaryColor }}
              >
                {score.toFixed(1)}%
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#00ff41]/70">
                DECEPTION_RISK_SCORE
              </span>
            </div>
          </div>

          {/* Scale Labels */}
          <div className="w-full max-w-[240px] flex items-center justify-between text-[10px] text-[#00ff41]/70 mt-1">
            <span className="text-[#00ff41]">0% [CREDIBLE]</span>
            <span className="text-[#f59e0b]">50%</span>
            <span className="text-[#ff3e3e]">100% [THREAT]</span>
          </div>
        </div>

        {/* Right: Verdict, Model Confidence Meter & Insights */}
        <div className="md:col-span-6 space-y-3">
          {/* Classification & Confidence side-by-side header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Verdict Badge */}
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#00ff41]/60 block mb-1">
                PRIMARY_VERDICT
              </span>
              <div
                className={`flex items-center gap-2 px-3 py-2 text-sm sm:text-base font-black tracking-widest uppercase border ${
                  verdict === 'FAKE'
                    ? 'border-neon-warning bg-[#ff3e3e]/10 text-[#ff3e3e] glow-red'
                    : verdict === 'SUSPICIOUS'
                    ? 'border-neon-amber bg-[#f59e0b]/10 text-[#f59e0b] glow-amber'
                    : 'border-neon bg-[#00ff41]/10 text-[#00ff41] glow'
                }`}
              >
                {verdict === 'FAKE' ? (
                  <AlertOctagon className="w-4 h-4 text-[#ff3e3e] animate-pulse" />
                ) : verdict === 'SUSPICIOUS' ? (
                  <ShieldAlert className="w-4 h-4 text-[#f59e0b] animate-pulse" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-[#00ff41]" />
                )}
                <span>[{verdict}]</span>
              </div>
            </div>

            {/* Enhanced Confidence Score Display */}
            <div className="p-2 bg-[#080808] border border-[#00ff41]/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[#00ff41]/60 text-[9px] uppercase font-bold flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#00ff41]" />
                  <span>MODEL_CONFIDENCE</span>
                </span>
                <span className="text-[9px] font-bold px-1 bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40 uppercase">
                  {certaintyLevel.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-white glow">
                  {confidence}%
                </span>
                <span className="text-[9px] text-gray-400">Certainty Index</span>
              </div>

              {/* Mini Confidence Progress Bar */}
              <div className="w-full bg-black h-1.5 border border-[#00ff41]/30 overflow-hidden">
                <div
                  className="bg-[#00ff41] h-full shadow-[0_0_6px_#00ff41]"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* Narrative Verdict Explanation */}
          <p className="text-[11px] text-gray-300 leading-relaxed border-l-2 border-[#00ff41]/30 pl-3 py-1">
            {verdict === 'FAKE' && (
              <>
                <strong className="text-[#ff3e3e]">[HIGH MISINFORMATION RISK]:</strong> The text displays pronounced clickbait urgency, unverified conspiracy tropes, and significant evidence gaps across all 100 Decision Trees.
              </>
            )}
            {verdict === 'SUSPICIOUS' && (
              <>
                <strong className="text-[#f59e0b]">[MODERATE SKEPTICISM ADVISORY]:</strong> The input contains assertions requiring independent corroboration or emotional manipulation framing, but lacks definitive debunk flags.
              </>
            )}
            {verdict === 'CREDIBLE' && (
              <>
                <strong className="text-[#00ff41]">[EMPIRICALLY GROUNDED]:</strong> Factual statements, objective syntax, and credible citations predominate without viral coercion.
              </>
            )}
          </p>

          {/* Diagnostics summary grid */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
            <div className="p-2 bg-[#080808] border border-[#00ff41]/20 text-center">
              <span className="text-[#00ff41]/50 block text-[8px] uppercase">LOGISTIC_RISK</span>
              <span className="text-[#00ff41] font-bold">{score.toFixed(1)}%</span>
            </div>
            <div className="p-2 bg-[#080808] border border-[#00ff41]/20 text-center">
              <span className="text-[#00ff41]/50 block text-[8px] uppercase">DECISION_TREES</span>
              <span className="text-white font-bold">100 / 100</span>
            </div>
            <div className="p-2 bg-[#080808] border border-[#00ff41]/20 text-center">
              <span className="text-[#00ff41]/50 block text-[8px] uppercase">SEVERITY</span>
              <span className="text-[#f59e0b] font-bold uppercase">{severityLevel || (score >= 70 ? 'Severe' : score >= 40 ? 'Moderate' : 'Low')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
