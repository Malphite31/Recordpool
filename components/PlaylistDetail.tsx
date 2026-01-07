
import React, { useState } from 'react';
import { Playlist, Track, TrackVersion } from '../types';

interface PlaylistDetailProps {
  playlist: Playlist;
  tracks: Track[];
  currentTrackId?: string;
  currentAudioUrl?: string;
  isPlaying: boolean;
  onBack: () => void;
  onPlayTrack: (track: Track) => void;
  onPlayVersion?: (track: Track, version: TrackVersion) => void;
  onRemoveFromPlaylist: (trackId: string) => void;
  isOwner?: boolean;
  onUpload?: () => void;
}

const PlaylistDetail: React.FC<PlaylistDetailProps> = ({
  playlist,
  tracks,
  currentTrackId,
  currentAudioUrl,
  isPlaying,
  onBack,
  onPlayTrack,
  onPlayVersion,
  onRemoveFromPlaylist,
  isOwner,
  onUpload
}) => {
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);

  const handleDownload = (track: Track, versionAudioUrl?: string, versionName?: string) => {
    const url = versionAudioUrl || track.audioUrl;
    const name = versionName ? `${track.artist} - ${track.title} (${versionName})` : `${track.artist} - ${track.title}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleExpand = (trackId: string) => {
    setExpandedTrackId(expandedTrackId === trackId ? null : trackId);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 pb-32 max-w-[1200px] mx-auto">
      {/* Redesigned Compact Hero Section */}
      <div className="flex flex-col items-center text-center py-6 md:py-16 px-4">
        <div className="w-32 h-32 md:w-64 md:h-64 rounded-[40px] overflow-hidden shadow-2xl border border-white/5 mb-8 relative group">
          <img
            src={playlist.coverUrl}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt={playlist.name}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-center gap-3">
            <span className="px-2 py-0.5 bg-[#ff5500] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-[3px]">
              Crate
            </span>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Updated 07/01/2026
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {playlist.name}
          </h1>

          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">
            {tracks.length} Pool Selected Tracks
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 pt-4 md:pt-6">
            <button
              onClick={() => tracks[0] && onPlayTrack(tracks[0])}
              className="bg-white text-black px-4 py-2 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest hover:brightness-90 active:scale-95 transition-all whitespace-nowrap"
            >
              Play All
            </button>

            {isOwner && onUpload && (
              <button
                onClick={onUpload}
                className="bg-[#ff5500] text-white px-4 py-2 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#ff5500]/20 flex items-center gap-1.5 md:gap-2 whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={3} /></svg>
                Add Track
              </button>
            )}

            <button className="bg-transparent text-white border border-white/10 px-4 py-2 md:px-6 md:py-3.5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest hover:bg-white/5 active:scale-95 transition-all whitespace-nowrap">
              Shuffle
            </button>
            <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all active:scale-90 shrink-0">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0l-4 4m4-4v13" strokeWidth={2.5} /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="px-4 md:px-0">
        <div className="grid grid-cols-12 px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 border-b border-white/5 mb-4">
          <div className="col-span-1">#</div>
          <div className="col-span-8 md:col-span-9">Track</div>
          <div className="col-span-3 md:col-span-2 text-right">Actions</div>
        </div>

        <div className="space-y-1.5">
          {tracks.map((track, index) => {
            const isExpanded = expandedTrackId === track.id;
            const isThisTrackPlaying = currentTrackId === track.id;

            return (
              <div key={track.id} className="flex flex-col">
                <div
                  onClick={() => toggleExpand(track.id)}
                  className={`grid grid-cols-12 items-center px-3 md:px-6 py-2.5 md:py-3.5 rounded-2xl border transition-all cursor-pointer group relative ${isExpanded ? 'bg-white/[0.04] border-white/10' : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02]'}`}
                >
                  <div className="col-span-1 text-[10px] font-black text-zinc-600">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>

                  <div className="col-span-8 md:col-span-9 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-zinc-900">
                      <img src={track.coverUrl} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="truncate pr-4">
                      <h4 className={`text-sm font-bold truncate transition-colors leading-tight ${isThisTrackPlaying ? 'text-[#ff5500]' : 'text-white group-hover:text-[#ff5500]'}`}>
                        {track.title}
                      </h4>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest truncate mt-0.5">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-3 md:col-span-2 flex justify-end items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(track); }}
                      className="p-2 text-zinc-500 hover:text-[#ff5500] transition-colors"
                      title="Download Original"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2.5} /></svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemoveFromPlaylist(track.id); }}
                      className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5} /></svg>
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-1 mb-3 mx-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    <div className="px-4 py-2 text-[8px] font-black uppercase tracking-widest text-zinc-700">Available Mixes</div>

                    {/* Original Mix in expanded view */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); onPlayTrack(track); }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${isThisTrackPlaying && currentAudioUrl === track.audioUrl ? 'bg-[#ff5500] text-white shadow-lg' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
                        >
                          {isThisTrackPlaying && currentAudioUrl === track.audioUrl && isPlaying ? (
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                          ) : (
                            <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          )}
                        </button>
                        <div>
                          <span className="text-xs font-bold text-white">Original Mix</span>
                          <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{track.duration} • WAV</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(track)}
                        className="text-zinc-500 hover:text-white transition-colors p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2.5} /></svg>
                      </button>
                    </div>

                    {/* Additional versions */}
                    {track.versions?.map(v => {
                      const isVersionPlaying = isThisTrackPlaying && currentAudioUrl === v.audioUrl;
                      return (
                        <div key={v.id} className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPlayVersion ? onPlayVersion(track, v) : onPlayTrack({ ...track, audioUrl: v.audioUrl, title: `${track.title} (${v.name})` });
                              }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${isVersionPlaying ? 'bg-[#ff5500] text-white shadow-lg' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
                            >
                              {isVersionPlaying && isPlaying ? (
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                              ) : (
                                <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                              )}
                            </button>
                            <div>
                              <span className="text-xs font-bold text-white">{v.name}</span>
                              <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{v.duration} • {v.format}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownload(track, v.audioUrl, v.name)}
                            className="text-zinc-500 hover:text-white transition-colors p-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2.5} /></svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {tracks.length === 0 && (
          <div className="py-24 text-center text-zinc-700 bg-white/[0.01] rounded-[32px] border border-dashed border-white/5">
            <p className="text-xs font-black uppercase tracking-[0.3em] mb-2">Crate Empty</p>
            <p className="text-[10px] font-bold uppercase tracking-widest">No tracks added to this collection.</p>
          </div>
        )}
      </div>

      {/* Persistent Back Button */}
      <button
        onClick={onBack}
        className="hidden md:flex fixed top-24 right-4 md:right-8 z-[60] w-12 h-12 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 text-white items-center justify-center hover:bg-[#ff5500] transition-all shadow-xl group"
      >
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth={2.5} /></svg>
      </button>
    </div>
  );
};

export default PlaylistDetail;
