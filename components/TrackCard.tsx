
import React from 'react';
import { Track } from '../types';

interface TrackCardProps {
  track: Track;
  isCurrent: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  onEdit: (track: Track) => void;
  onLike?: () => void;
  onAddToPlaylist?: () => void;
  onNavigate?: () => void;
}

const TrackCard: React.FC<TrackCardProps> = ({
  track,
  isCurrent,
  isPlaying,
  onSelect,
  onLike,
  onNavigate
}) => {
  return (
    <div
      className="group flex flex-col w-full h-full animate-in fade-in duration-300 transition-all duration-500 ease-out"
    >
      <div
        onClick={onSelect}
        className="relative aspect-square overflow-hidden bg-zinc-900 mb-3 rounded-2xl cursor-pointer shadow-lg group-hover:shadow-[#ff5500]/10 transition-shadow"
      >
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
        />

        {track.isAlbum && (
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-[#ff5500] text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-[#ff5500]/20 z-10 shadow-xl">
            Album
          </div>
        )}

        {isCurrent && isPlaying ? (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-12 h-12 bg-[#ff5500] rounded-full flex items-center justify-center shadow-2xl">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 px-1">
        <h3
          onClick={(e) => { e.stopPropagation(); onNavigate?.(); }}
          className="text-white text-base font-bold truncate mb-0.5 group-hover:text-[#ff5500] transition-colors leading-tight cursor-pointer"
        >
          {track.title}
        </h3>
        <p
          onClick={(e) => { e.stopPropagation(); onNavigate?.(); }}
          className="text-zinc-500 text-[10px] font-bold truncate uppercase tracking-widest mb-3 cursor-pointer hover:text-white"
        >
          {track.artist}
        </p>

        {/* New Hardware-Style Metadata Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          <span className="text-[7px] px-1.5 py-0.5 bg-zinc-900 text-[#ff5500] border border-white/5 rounded-[3px] font-black uppercase tracking-tighter">
            {track.key}
          </span>
          <span className="text-[7px] px-1.5 py-0.5 bg-zinc-900 text-zinc-300 border border-white/5 rounded-[3px] font-black uppercase tracking-tighter">
            {track.bpm} BPM
          </span>
          <span className="text-[7px] px-1.5 py-0.5 bg-zinc-900 text-zinc-500 border border-white/5 rounded-[3px] font-black uppercase tracking-tighter">
            {track.duration}
          </span>
          <span className="text-[7px] px-1.5 py-0.5 bg-zinc-900 text-zinc-600 border border-white/5 rounded-[3px] font-black uppercase tracking-tighter">
            WAV
          </span>
        </div>

        <div className="flex items-center space-x-4 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
          {/* Download Count */}
          <div className="flex items-center gap-1.5" title="Downloads">
            <svg className="w-3.5 h-3.5 text-[#ff5500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{(track.downloadCount || 0).toLocaleString()}</span>
          </div>

          {/* Like Count */}
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); onLike?.(); }}>
            <svg
              className={`w-3.5 h-3.5 ${track.isLiked ? 'text-red-500 fill-current' : 'text-zinc-600'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className={track.isLiked ? 'text-red-500' : ''}>{(track.likeCount || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
