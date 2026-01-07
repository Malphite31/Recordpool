
import React, { useState, useEffect } from 'react';
import { Track, TrackVersion } from '../types';
import WaveformVisualizer from './WaveformVisualizer';

interface TrackDetailProps {
  track: Track;
  isPlaying: boolean;
  currentAudioUrl?: string;
  currentPlayingVersionId?: string;
  onPlayToggle: () => void;
  onPlayVersion: (track: Track, version: TrackVersion) => void;
  onBack: () => void;
  onArtistClick: (artistId: string) => void;
  onLike: () => void;
  onEdit?: (track: Track) => void; // Added
}

const TrackDetail: React.FC<TrackDetailProps> = ({
  track,
  isPlaying,
  currentAudioUrl,
  currentPlayingVersionId,
  onPlayToggle,
  onPlayVersion,
  onBack,
  onArtistClick,
  onLike,
  onEdit
}) => {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audioEl = document.querySelector('audio');
    if (!audioEl) return;

    const updateProgress = () => setProgress(audioEl.currentTime / audioEl.duration || 0);
    audioEl.addEventListener('timeupdate', updateProgress);

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
          const source = ctx.createMediaElementSource(audioEl);
          source.connect(node);
          node.connect(ctx.destination);
          (window as any).audioSourceConnected = true;
        }

        setAnalyser(node);
      } catch (e) {
        console.warn("Visualizer connection failed:", e);
      }
    }
    return () => audioEl.removeEventListener('timeupdate', updateProgress);
  }, [track, analyser]);

  const handleSeek = (newProgress: number) => {
    const audioEl = document.querySelector('audio');
    if (audioEl && audioEl.duration) audioEl.currentTime = newProgress * audioEl.duration;
  };

  const handleDownload = (version: TrackVersion | Track) => {
    const link = document.createElement('a');
    link.href = version.audioUrl;
    link.download = `${track.artist} - ${track.title}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeVersion = currentPlayingVersionId
    ? track.versions?.find(v => v.id === currentPlayingVersionId)
    : (currentAudioUrl
      ? track.versions?.find(v => v.audioUrl === currentAudioUrl)
      : track.versions?.[0]);
  const isOriginalActive = isPlaying && (!currentAudioUrl || currentAudioUrl === track.audioUrl) && !currentPlayingVersionId;

  return (
    <div className="animate-in fade-in duration-500 max-w-[1000px] mx-auto pb-48">
      {/* Release Top Bar */}
      <div className="px-4 py-4 md:py-6 flex items-center justify-between border-b border-white/5 mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-[#ff5500] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff5500]/20">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
          </div>
          <span className="font-outfit font-bold tracking-tight text-white text-lg md:text-2xl">Release Detail</span>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
        >
          <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Back to Catalog</span>
          <span className="md:hidden text-[10px] font-black uppercase tracking-widest">Back</span>
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={2.5} /></svg>
        </button>
      </div>

      <div className="px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

        {/* Left Column: Waveform, Actions */}
        <div className="lg:col-span-8 space-y-5 md:space-y-6">

          {/* Track Identity Header */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6 md:mb-8 items-center md:items-end text-center md:text-left">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden shadow-2xl shrink-0 group border border-white/10">
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <div className="flex-1 pb-2 text-center md:text-left space-y-2">
              <h1 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tighter">
                {track.title.replace(/\s*\(.*?\)\s*$/, '')}
              </h1>

              {activeVersion && (
                <div className="flex justify-center md:justify-start">
                  <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-[10px] md:text-xs font-bold tracking-[0.2em] backdrop-blur-sm">
                    {activeVersion.name}
                  </span>
                </div>
              )}

              <h2
                onClick={() => onArtistClick(track.artistId)}
                className="block text-base md:text-xl font-bold text-[#ff5500] tracking-tight cursor-pointer hover:text-white transition-colors pt-1"
              >
                {track.artist}
              </h2>
            </div>
          </div>

          {/* Deck Waveform View - Optimized for Mobile */}
          <div className="bg-zinc-900/40 rounded-[32px] md:rounded-[40px] p-6 md:p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{activeVersion?.format || track.format || 'Hi-Res'}</span>
            </div>

            <div className="w-full h-24 md:h-36 mb-8 md:mb-10 relative">
              <WaveformVisualizer
                key={currentAudioUrl || track.audioUrl}
                audioUrl={currentAudioUrl || track.audioUrl}
                peaks={track.peaks || []}
                progress={progress}
                onSeek={handleSeek}
                isPlaying={isPlaying}
                analyser={analyser}
                duration={activeVersion?.duration || track.duration}
              />
            </div>

            <div className="flex items-center gap-3 md:gap-5">
              <button
                onClick={onPlayToggle}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all shadow-xl shrink-0 ${isPlaying ? 'bg-[#ff5500] text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                  <svg className="w-6 h-6 md:w-7 md:h-7 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>

              <button
                onClick={onLike}
                className={`flex flex-col items-center justify-center gap-1 bg-zinc-800/80 border border-white/5 w-20 md:w-24 h-14 md:h-16 rounded-2xl md:rounded-3xl transition-all shrink-0 ${track.isLiked ? 'text-[#ff5500] border-[#ff5500]/30' : 'text-zinc-500 hover:text-white'}`}
              >
                <svg className={`w-4 h-4 md:w-5 md:h-5 ${track.isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{track.likeCount || 0}</span>
              </button>

              {onEdit && (
                <button
                  onClick={() => onEdit(track)}
                  className="flex flex-col items-center justify-center gap-1 bg-zinc-800/80 border border-white/5 w-20 md:w-24 h-14 md:h-16 rounded-2xl md:rounded-3xl transition-all shrink-0 text-zinc-500 hover:text-white hover:bg-zinc-700/50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Edit</span>
                </button>
              )}

              <button
                onClick={() => handleDownload(track)}
                className="flex-1 bg-[#ff5500] text-white h-14 md:h-16 rounded-2xl md:rounded-3xl font-black uppercase text-xs md:text-sm tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl shadow-[#ff5500]/20 flex items-center justify-center gap-2 md:gap-3 px-4"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2.5} /></svg>
                <span className="truncate">Download</span>
              </button>
            </div>
          </div>

          {/* Metadata Info Bar - Grid fix for mobile */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div className="bg-zinc-950 border border-white/5 p-3 md:p-5 rounded-2xl md:rounded-3xl text-center shadow-lg flex flex-col justify-center">
              <span className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1 md:mb-2">Beat Grid</span>
              <span className="text-lg md:text-2xl font-black text-white">{track.bpm} <span className="text-[9px] md:text-xs text-zinc-700">BPM</span></span>
            </div>
            <div className="bg-zinc-950 border border-white/5 p-3 md:p-5 rounded-2xl md:rounded-3xl text-center shadow-lg flex flex-col justify-center">
              <span className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1 md:mb-2">Musical Key</span>
              <span className="text-lg md:text-2xl font-black text-white">{track.key}</span>
            </div>
            <div className="bg-zinc-950 border border-white/5 p-3 md:p-5 rounded-2xl md:rounded-3xl text-center shadow-lg flex flex-col justify-center">
              <span className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1 md:mb-2">Category</span>
              <span className="text-[9px] md:text-[11px] font-black text-white uppercase tracking-widest block py-1 md:py-2 truncate px-1">{track.genre}</span>
            </div>
          </div>

          {/* Version Selector List */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-[10px] md:text-[11px] font-black uppercase text-zinc-500 tracking-[0.4em] px-3">Available Mixes</h3>
            <div className="space-y-3 md:space-y-4">
              {track.versions && track.versions.length > 0 ? track.versions.map(v => {
                const isThisActive = isPlaying && currentPlayingVersionId === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => onPlayVersion(track, v)}
                    className={`flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-[24px] md:rounded-[32px] border transition-all cursor-pointer group ${isThisActive ? 'bg-[#ff5500]/10 border-[#ff5500]/40 shadow-xl' : 'bg-zinc-900/40 border-white/5 hover:border-white/10'}`}
                  >
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 shadow-2xl transition-all ${isThisActive ? 'bg-[#ff5500] text-white' : 'bg-[#ff5500] text-white opacity-90 group-hover:opacity-100 group-hover:scale-105'}`}>
                      {isThisActive ? (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                      ) : (
                        <svg className="w-5 h-5 md:w-6 md:h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm md:text-base font-black truncate ${isThisActive ? 'text-[#ff5500]' : 'text-white'}`}>
                        {v.name}
                      </h4>
                      <p className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                        {v.duration} • {v.format}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 md:gap-5">
                      <div className="hidden md:flex items-end gap-[4px] h-5">
                        <div className={`w-[3px] bg-[#ff5500] rounded-full transition-all duration-300 ${isThisActive ? 'h-full animate-bar-bounce' : 'h-1/2 opacity-20'}`} style={{ animationDelay: '0ms' }} />
                        <div className={`w-[3px] bg-[#ff5500] rounded-full transition-all duration-300 ${isThisActive ? 'h-3/4 animate-bar-bounce' : 'h-1/3 opacity-20'}`} style={{ animationDelay: '150ms' }} />
                        <div className={`w-[3px] bg-[#ff5500] rounded-full transition-all duration-300 ${isThisActive ? 'h-full animate-bar-bounce' : 'h-1/2 opacity-20'}`} style={{ animationDelay: '300ms' }} />
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(v); }}
                        className="w-10 h-10 md:w-12 md:h-12 bg-zinc-800/80 hover:bg-[#ff5500] rounded-xl md:rounded-2xl flex items-center justify-center text-zinc-300 hover:text-white transition-all border border-white/5 active:scale-90"
                      >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-8 md:p-12 text-center bg-zinc-950 rounded-[32px] md:rounded-[40px] border border-dashed border-white/5">
                  <p className="text-[9px] md:text-[10px] font-black uppercase text-zinc-700 tracking-[0.2em]">Original Mix Only Available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Artist Card & Stats */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">

          {/* Artist Identity Module */}
          <div className="bg-zinc-950 p-6 md:p-8 rounded-[36px] md:rounded-[48px] border border-white/5 space-y-6 md:space-y-8 shadow-2xl lg:sticky lg:top-32">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
              <div
                onClick={() => onArtistClick(track.artistId)}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-black shadow-[0_15px_40px_rgba(0,0,0,0.6)] cursor-pointer group"
              >
                <img src={track.artistAvatarUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="space-y-1">
                <h3 onClick={() => onArtistClick(track.artistId)} className="text-xl md:text-2xl font-black text-white cursor-pointer hover:text-[#ff5500] transition-colors tracking-tight flex items-center justify-center gap-2">
                  {track.artist}
                  <svg className="w-5 h-5 text-[#1d9bf0]" viewBox="0 0 40 40" fill="currentColor">
                    <path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd" />
                  </svg>
                </h3>
              </div>
            </div>

            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed text-center font-medium">
              {track.artistBio || "This elite producer has chosen to let their music speak for itself in the record pool."}
            </p>

            <button
              onClick={() => onArtistClick(track.artistId)}
              className="w-full py-4 md:py-5 bg-white text-black text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-zinc-200 active:scale-95 transition-all shadow-xl"
            >
              Artist Profile
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-zinc-900/40 border border-white/5 p-5 md:p-6 rounded-[28px] md:rounded-[36px] text-center shadow-lg">
              <span className="text-[9px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1 md:mb-2">Downloads</span>
              <span className="text-xl md:text-2xl font-black text-white">{(track.downloadCount || 0).toLocaleString()}</span>
            </div>
            <div className="bg-zinc-900/40 border border-white/5 p-5 md:p-6 rounded-[28px] md:rounded-[36px] text-center shadow-lg">
              <span className="text-[9px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1 md:mb-2">Pool Plays</span>
              <span className="text-xl md:text-2xl font-black text-white">{(track.plays || 0).toLocaleString()}</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes bar-bounce {
          0%, 100% { height: 4px; }
          50% { height: 20px; }
        }
        .animate-bar-bounce {
          animation: bar-bounce 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TrackDetail;
