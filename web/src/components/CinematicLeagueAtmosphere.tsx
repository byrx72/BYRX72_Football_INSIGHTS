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
            ? 'opacity-100 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,10,130,0.32),rgba(8,3,18,0.98)_85%)]'
            : 'opacity-0 bg-transparent'
        }`}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          !isPL
            ? 'opacity-100 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(215,35,35,0.28),rgba(15,4,6,0.98)_85%)]'
            : 'opacity-0 bg-transparent'
        }`}
      />

      {/* Cinematic Glowing Orb Top-Right (Purple-Pink for PL, Red-Orange for La Liga) */}
      <div
        className={`absolute -top-40 -right-40 w-[680px] h-[680px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
          isPL
            ? 'bg-gradient-to-br from-[#e90052]/35 via-[#9b15bd]/30 to-[#38003c]/20'
            : 'bg-gradient-to-br from-[#ea0029]/35 via-[#ff5722]/30 to-[#b71c1c]/20'
        }`}
      />

      {/* Cinematic Glowing Orb Bottom-Left (Cyan-Purple for PL, Gold-Amber for La Liga) */}
      <div
        className={`absolute -bottom-40 -left-40 w-[640px] h-[640px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
          isPL
            ? 'bg-gradient-to-tr from-[#38003c]/40 via-[#e90052]/20 to-[#00ff87]/15'
            : 'bg-gradient-to-tr from-[#c62828]/35 via-[#ff5722]/25 to-[#ffb300]/18'
        }`}
      />

      {/* Center Cinematic League Watermark / Crest Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        {/* Premier League Lion Cinematic Logo */}
        <div
          className={`absolute flex flex-col items-center justify-center transition-all duration-1000 transform ${
            isPL
              ? 'opacity-15 scale-100 translate-y-0 filter drop-shadow-[0_0_80px_rgba(233,0,82,0.45)]'
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
            <span className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#e90052] to-transparent" />
            <span className="text-[12px] font-mono tracking-[0.45em] uppercase text-fuchsia-300/40 font-bold">
              PREMIER LEAGUE · ENGLAND
            </span>
            <span className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#e90052] to-transparent" />
          </div>
        </div>

        {/* La Liga Cinematic Logo */}
        <div
          className={`absolute flex flex-col items-center justify-center transition-all duration-1000 transform ${
            !isPL
              ? 'opacity-15 scale-100 translate-y-0 filter drop-shadow-[0_0_80px_rgba(255,87,34,0.45)]'
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
            <span className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#ff5722] to-transparent" />
            <span className="text-[12px] font-mono tracking-[0.45em] uppercase text-orange-300/40 font-bold">
              LA LIGA EA SPORTS · ESPAÑA
            </span>
            <span className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#ff5722] to-transparent" />
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
            ? 'radial-gradient(circle at 50% 0%, rgba(233,0,82,0.18) 0%, transparent 60%), radial-gradient(circle at 85% 20%, rgba(142,36,170,0.18) 0%, transparent 50%)'
            : 'radial-gradient(circle at 50% 0%, rgba(234,0,41,0.18) 0%, transparent 60%), radial-gradient(circle at 85% 20%, rgba(255,87,34,0.18) 0%, transparent 50%)',
        }}
      />

      {/* Micro Grid Overlay for high-tech cinematic sports aesthetic */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(${isPL ? 'rgba(233,0,82,0.6)' : 'rgba(255,87,34,0.6)'} 1px, transparent 1px), linear-gradient(90deg, ${isPL ? 'rgba(233,0,82,0.6)' : 'rgba(255,87,34,0.6)'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};
