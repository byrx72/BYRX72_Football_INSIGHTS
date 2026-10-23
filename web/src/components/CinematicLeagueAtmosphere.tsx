'use client';

import React from 'react';
import { League } from '@/data/espn';

interface CinematicLeagueAtmosphereProps {
  league: League;
}

export const CinematicLeagueAtmosphere: React.FC<CinematicLeagueAtmosphereProps> = ({ league }) => {
  const isPL = league === 'PL';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-1000 ease-out">
      {/* Dynamic Deep Ambient Gradient Base */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isPL
            ? 'opacity-100 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.22),rgba(4,10,24,0.98)_85%)]'
            : 'opacity-0 bg-transparent'
        }`}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          !isPL
            ? 'opacity-100 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.20),rgba(20,9,4,0.98)_85%)]'
            : 'opacity-0 bg-transparent'
        }`}
      />

      {/* Cinematic Glowing Orb Top-Right (Light Sky Blue for PL, Light Orange for La Liga) */}
      <div
        className={`absolute -top-40 -right-40 w-[680px] h-[680px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
          isPL
            ? 'bg-gradient-to-br from-[#38bdf8]/35 via-[#0284c7]/25 to-[#0369a1]/15'
            : 'bg-gradient-to-br from-[#fb923c]/35 via-[#ea580c]/25 to-[#c2410c]/15'
        }`}
      />

      {/* Cinematic Glowing Orb Bottom-Left (Light Orange accent for PL, Light Blue accent for La Liga) */}
      <div
        className={`absolute -bottom-40 -left-40 w-[640px] h-[640px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
          isPL
            ? 'bg-gradient-to-tr from-[#0284c7]/30 via-[#38bdf8]/20 to-[#fb923c]/18'
            : 'bg-gradient-to-tr from-[#ea580c]/30 via-[#fb923c]/20 to-[#38bdf8]/18'
        }`}
      />

      {/* Center Cinematic League Watermark / Crest Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        {/* Premier League Lion Cinematic Logo */}
        <div
          className={`absolute flex flex-col items-center justify-center transition-all duration-1000 transform ${
            isPL
              ? 'opacity-15 scale-100 translate-y-0 filter drop-shadow-[0_0_80px_rgba(56,189,248,0.45)]'
              : 'opacity-0 scale-90 translate-y-12'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pl-espn.png"
            alt="Premier League"
            className="w-[480px] md:w-[620px] max-w-[85vw] h-auto object-contain opacity-75 animate-pulse"
            style={{ animationDuration: '7s' }}
          />
          <div className="mt-4 flex items-center gap-3">
            <span className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent" />
            <span className="text-[12px] font-mono tracking-[0.45em] uppercase text-sky-300/40 font-bold">
              PREMIER LEAGUE · ENGLAND
            </span>
            <span className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent" />
          </div>
        </div>

        {/* La Liga Cinematic Logo */}
        <div
          className={`absolute flex flex-col items-center justify-center transition-all duration-1000 transform ${
            !isPL
              ? 'opacity-15 scale-100 translate-y-0 filter drop-shadow-[0_0_80px_rgba(251,146,60,0.45)]'
              : 'opacity-0 scale-90 -translate-y-12'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/laliga-espn.png"
            alt="La Liga"
            className="w-[440px] md:w-[580px] max-w-[85vw] h-auto object-contain opacity-80 animate-pulse"
            style={{ animationDuration: '7s' }}
          />
          <div className="mt-4 flex items-center gap-3">
            <span className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#fb923c] to-transparent" />
            <span className="text-[12px] font-mono tracking-[0.45em] uppercase text-orange-300/40 font-bold">
              LA LIGA EA SPORTS · ESPAÑA
            </span>
            <span className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#fb923c] to-transparent" />
          </div>
        </div>
      </div>

      {/* Atmospheric Stadium Light Beams / Sweeps */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isPL ? 'opacity-30' : 'opacity-25'
        }`}
        style={{
          background: isPL
            ? 'radial-gradient(circle at 50% 0%, rgba(56,189,248,0.22) 0%, transparent 60%), radial-gradient(circle at 85% 20%, rgba(251,146,60,0.15) 0%, transparent 50%)'
            : 'radial-gradient(circle at 50% 0%, rgba(251,146,60,0.22) 0%, transparent 60%), radial-gradient(circle at 85% 20%, rgba(56,189,248,0.15) 0%, transparent 50%)',
        }}
      />

      {/* Micro Grid Overlay for high-tech cinematic sports aesthetic */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(${isPL ? 'rgba(56,189,248,0.6)' : 'rgba(251,146,60,0.6)'} 1px, transparent 1px), linear-gradient(90deg, ${isPL ? 'rgba(56,189,248,0.6)' : 'rgba(251,146,60,0.6)'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};
