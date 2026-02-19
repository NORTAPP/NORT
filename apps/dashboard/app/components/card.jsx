"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Lock, TrendingUp, TrendingDown } from "lucide-react";

export default function SignalCard({ data, delay = 0 }) {
  const { login, isAuthed } = useAuth();
  const [unlocked, setUnlocked] = useState(!data.isLocked);

  if (!data) return null;

  const isHot = data.heat >= 80;
  const isWarm = data.heat >= 50 && data.heat < 80;
  const isCool = data.heat < 50;

  const getHeatColor = () => {
    if (isHot) return "text-[#dc2626]"; // hot - red
    if (isWarm) return "text-[#d97706]"; // warm - amber
    return "text-[#16a34a]"; // cool - green
  };

  const getHeatLabel = () => {
    if (isHot) return `◆ ${data.heat}% HOT`;
    if (isWarm) return `◆ ${data.heat}% WARM`;
    return `◆ ${data.heat}% SIGNAL`;
  };

  const handleUnlock = () => {
    if (isAuthed) {
      setUnlocked(true);
    } else {
      login();
    }
  };

  return (
    <div className={`bg-white rounded-[18px] border border-black/[0.07] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,.05),0_4px_16px_rgba(0,0,0,.04)] fu d${Math.min(delay + 1, 6)}`}>
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2.5 flex justify-between items-center">
        <span className="text-label uppercase border border-black/10 text-muted px-2.5 py-1 rounded-full">
          {data.category || 'MARKET'}
        </span>
        <span className={`text-[8px] font-medium tracking-wide ${getHeatColor()}`}>
          {getHeatLabel()}
        </span>
      </div>

      {/* Question */}
      <div className="font-editorial text-[15px] font-bold leading-snug px-4 pb-3.5 text-[#0c0c0c]">
        {data.title}
      </div>

      {/* Verdict Buttons */}
      <div className="grid grid-cols-2 gap-2 px-4 pb-3.5">
        <button
          className={`py-2.5 rounded-xl font-mono text-[9px] uppercase tracking-widest border transition-all duration-200 flex items-center justify-center gap-1 ${
            data.verdict === 'YES'
              ? 'bg-[#0c0c0c] text-white border-[#0c0c0c] shadow-[0_2px_8px_rgba(0,0,0,.2)]'
              : 'bg-transparent text-black/20 border-black/[0.15]'
          }`}
        >
          {data.verdict === 'YES' && <TrendingUp size={11} strokeWidth={2.5} />}
          ▲ Yes
        </button>
        <button
          className={`py-2.5 rounded-xl font-mono text-[9px] uppercase tracking-widest border transition-all duration-200 flex items-center justify-center gap-1 ${
            data.verdict === 'NO'
              ? 'bg-[#dc2626]/[0.06] text-[#dc2626] border-[#dc2626]'
              : 'bg-transparent text-black/20 border-black/[0.15]'
          }`}
        >
          {data.verdict === 'NO' && <TrendingDown size={11} strokeWidth={2.5} />}
          ▼ No
        </button>
      </div>

      {/* AI Advice */}
      <div className="mx-3 mb-3.5 rounded-[14px] overflow-hidden relative">
        <div className="glass-sm px-3.5 py-3">
          <div className="flex gap-2 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0c0c0c] mt-1 flex-shrink-0 opacity-30" />
            <p className="text-[10.5px] text-black/50 leading-relaxed italic">
              {data.aiAdvice || "No AI signal available."}
            </p>
          </div>
        </div>

        {/* Lock Overlay */}
        {!unlocked && (
          <div className="absolute inset-0 glass-lock rounded-[14px] flex flex-col items-center justify-center gap-2">
            <div className="text-label text-muted uppercase">AI Intel Encrypted · x402</div>
            <button
              onClick={handleUnlock}
              className="bg-[#0c0c0c] text-white border-none cursor-pointer font-mono text-[8px] tracking-widest uppercase px-4 py-2 rounded-full flex items-center gap-1.5 shadow-[0_3px_10px_rgba(0,0,0,.2)] hover:translate-y-[-1px] hover:shadow-[0_5px_14px_rgba(0,0,0,.28)] transition-all"
            >
              <Lock size={10} strokeWidth={2.2} className="opacity-60" />
              {isAuthed ? 'Unlock Analysis · 0.10 USDC' : 'Connect to Unlock'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
