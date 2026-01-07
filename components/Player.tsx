
import React, { useState, useEffect, useRef } from 'react';
import { Track } from '../types';
import Visualizer from './Visualizer';

interface PlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  isShuffle?: boolean;
  onShuffleToggle?: () => void;
  onLike?: () => void;
  onAddToPlaylist?: () => void;
  onNavigate?: () => void;
}

const Player: React.FC<PlayerProps> = ({
  track,
  isPlaying,
  onPlayToggle,
  onNext,
  onPrev,
  onLike,
  onNavigate
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [volume, setVolume] = useState(0.8);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => onPlayToggle());
      }

      if (!analyser) {
        try {
          const ctx = (window as any).audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();
          (window as any).audioContext = ctx;

          if (ctx.state === 'suspended') {
            const resume = () => ctx.resume().then(() => document.removeEventListener('click', resume));
            document.addEventListener('click', resume);
          }

          const node = ctx.createAnalyser();
          node.fftSize = 256;
          if (!(window as any).audioSourceConnected) {
            const source = ctx.createMediaElementSource(audio);
            source.connect(node);
            node.connect(ctx.destination);
            (window as any).audioSourceConnected = true;
          }
          setAnalyser(node);
        } catch (e) { console.warn(e); }
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, track, analyser]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
      setCurrentTime(formatTime(audioRef.current.currentTime));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const p = x / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = p * audioRef.current.duration;
    }
  };

  if (!track) return null;

  return (
    <div
      className="fixed bottom-[74px] md:bottom-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-3xl border-t border-white/10 select-none transition-all duration-300"
    >
      {/* Playhead Progress Bar */}
      <div
        onClick={handleSeek}
        className="hidden md:block w-full h-1 bg-zinc-900 absolute top-0 left-0 cursor-pointer group z-[101]"
      >
        <div className="h-full bg-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.5)] relative" style={{ width: `${progress}%` }}>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
        </div>
      </div>

      {/* Mobile Top Progress Strip */}
      <div className="md:hidden w-full h-[2px] bg-zinc-900 absolute top-0 left-0">
        <div className="h-full bg-[#ff5500]" style={{ width: `${progress}%` }} />
      </div>

      <div className="w-full h-[72px] md:h-24 flex items-center px-4 md:px-8 overflow-hidden">
        <audio
          ref={audioRef}
          src={track.audioUrl}
          crossOrigin="anonymous"
          onTimeUpdate={handleTimeUpdate}
          onEnded={onNext}
        />

        <div className="w-full grid grid-cols-12 items-center gap-2 md:gap-4 h-full">

          {/* Section: Track Info */}
          <div className="col-span-8 md:col-span-3 flex items-center gap-3 min-w-0 h-full">
            <div
              onClick={onNavigate}
              className="w-10 h-10 md:w-14 md:h-14 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-zinc-900 cursor-pointer shadow-xl group/cover"
            >
              <img src={track.coverUrl} className="w-full h-full object-cover group-hover/cover:scale-110 transition-transform" alt={track.title} />
            </div>

            <div className="truncate flex flex-col justify-center min-w-0 space-y-1">
              <div className="flex items-center gap-2 truncate">
                <h4
                  onClick={onNavigate}
                  className="text-white text-xs md:text-base font-black tracking-tight truncate cursor-pointer hover:text-[#ff5500] transition-colors"
                >
                  {track.title.replace(/\s*\(.*?\)\s*$/, '')}
                </h4>
                <button
                  onClick={(e) => { e.stopPropagation(); onLike?.(); }}
                  className={`shrink-0 transition-all ${track.isLiked ? 'text-red-500 scale-110' : 'text-zinc-700 hover:text-white'}`}
                >
                  <svg className={`w-3.5 h-3.5 ${track.isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
              </div>

              <div className="flex items-center gap-3 text-zinc-500">
                <p className="text-[9px] md:text-xs font-bold tracking-tight truncate text-zinc-400 shrink">
                  {track.artist}
                </p>

                <div className="hidden md:flex items-center gap-2 shrink-0">
                  <div className="w-px h-3 bg-white/10 mx-1"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-black">{track.key}</span>
                    <span className="text-zinc-700 text-[10px]">•</span>
                    <span className="text-white text-xs font-black">{track.bpm}</span>
                  </div>
                  <div className="w-px h-3 bg-white/10 mx-1"></div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-zinc-800/50 border border-white/5 text-zinc-400 rounded-md font-bold tracking-wider">{track.genre}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-zinc-800/50 border border-white/5 text-[#ff5500] rounded-md font-bold tracking-wider">
                    {track.title.match(/\((.*?)\)$/)?.[1] || 'Original Mix'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Controls (Centered) */}
          <div className="hidden md:flex col-span-6 items-center justify-center space-x-8 h-full">
            <button onClick={onPrev} className="text-zinc-600 hover:text-white transition-all active:scale-90">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18V6h2v12H6zm3.5-6L18 6v12l-8.5-6z" /></svg>
            </button>
            <button
              onClick={onPlayToggle}
              className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-all shadow-2xl hover:scale-105 hover:bg-zinc-100"
            >
              {isPlaying ? <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
            </button>
            <button onClick={onNext} className="text-zinc-600 hover:text-white transition-all active:scale-90">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 18h2V6h-2v12zM6 18l8.5-6L6 6v12z" /></svg>
            </button>
          </div>

          {/* Section: Right (Visualizer + Stats) */}
          <div className="col-span-4 md:col-span-3 flex items-center justify-end gap-6 h-full min-w-0">
            {/* Visualizer - Moved to right group */}
            <div className="hidden md:flex flex-1 max-w-[140px] h-[32px] items-center justify-end">
              <Visualizer analyser={analyser} isPlaying={isPlaying} volume={volume} onVolumeChange={setVolume} />
            </div>

            <div className="flex items-center gap-3 md:gap-4 bg-zinc-900/60 rounded-2xl px-4 md:px-5 py-2.5 border border-white/5 shadow-inner shrink-0">
              <div className="flex flex-col items-center justify-center min-w-[36px]">
                <span className="text-[7px] text-zinc-600 font-black uppercase tracking-tighter">Time</span>
                <span className="text-[11px] md:text-sm font-black text-white font-mono leading-none">{currentTime}</span>
              </div>

              <div className="hidden md:block w-[1px] h-8 bg-white/10" />

              <div className="hidden md:flex flex-col items-center justify-center min-w-[36px]">
                <span className="text-[7px] text-zinc-600 font-black uppercase tracking-tighter">Status</span>
                <span className={`text-[10px] font-black uppercase leading-none ${isPlaying ? 'text-green-500 animate-pulse' : 'text-[#ff5500]'}`}>
                  {isPlaying ? 'Live' : 'Cue'}
                </span>
              </div>

              <button
                onClick={onPlayToggle}
                className="w-10 h-10 md:hidden bg-white text-black rounded-full flex items-center justify-center shrink-0 ml-1 active:scale-90 shadow-lg"
              >
                {isPlaying ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Player;
