
import React, { useState } from 'react';
import { Track } from '../types';
import TrackCard from './TrackCard';

interface ArtistProfileProps {
  artistId: string;
  tracks: Track[];
  onBack: () => void;
  onSelectTrack: (track: Track) => void;
  currentTrackId?: string;
  isPlaying: boolean;
  onEdit: (track: Track) => void;
  onNavigateToTrack: (track: Track) => void;
  onNavigateToAlbum?: (albumName: string) => void;
  onLike?: (id: string) => void;
  onAddToPlaylist?: (track: Track) => void;
  userProfile?: { name: string; bio: string; avatarUrl: string; headerUrl: string };
  onEditProfile?: () => void;
  onUploadClick?: () => void;
  onAdminClick?: () => void;
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({
  artistId,
  tracks,
  onBack,
  onSelectTrack,
  currentTrackId,
  isPlaying,
  onEdit,
  onNavigateToTrack,
  onNavigateToAlbum,
  onLike,
  onAddToPlaylist,
  userProfile,
  onEditProfile,
  onUploadClick,
  onAdminClick
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const isCurrentUser = artistId === 'art-user';
  const artistTracks = tracks.filter(t => t.artistId === artistId);

  const displayTracks = artistTracks.reduce((acc: Track[], track) => {
    if (track.album) {
      const existingGroup = acc.find(t => t.isAlbum && t.title === track.album);
      if (existingGroup) return acc;

      const albumTracks = artistTracks.filter(t => t.album === track.album);
      if (albumTracks.length > 1) {
        acc.push({ ...track, title: track.album, isAlbum: true });
      } else {
        acc.push(track);
      }
    } else {
      acc.push(track);
    }
    return acc;
  }, []);

  const profileName = isCurrentUser && userProfile ? userProfile.name : (artistTracks[0]?.artist || 'Unknown Artist');
  const profileBio = isCurrentUser && userProfile ? userProfile.bio : (artistTracks[0]?.artistBio || 'This elite producer has chosen to let their music speak for itself.');
  const profileAvatar = isCurrentUser && userProfile ? userProfile.avatarUrl : (artistTracks[0]?.artistAvatarUrl || `https://picsum.photos/seed/${artistId}/200/200`);
  const profileHeader = isCurrentUser && userProfile ? userProfile.headerUrl : (artistTracks[0]?.artistHeaderUrl || `https://picsum.photos/seed/${artistId}h/1200/400`);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 pb-32">
      {/* Distinct Artist Header Section */}
      <div className="relative w-full overflow-hidden bg-zinc-950 md:rounded-[40px] md:mt-4 shadow-2xl">
        {/* Header Visual Layer */}
        <div className="h-[140px] md:h-[400px] relative overflow-hidden group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url(${profileHeader})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Artist Identity Block */}
        <div className="relative px-6 pb-8 -mt-10 md:-mt-24 flex flex-col md:flex-row items-center md:items-end md:text-left gap-4 md:gap-10 z-10 max-w-[1400px] mx-auto">
          <div className="w-20 h-20 md:w-56 md:h-56 rounded-full border-[4px] md:border-[6px] border-black overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-zinc-900 shrink-0">
            <img src={profileAvatar} className="w-full h-full object-cover" alt={profileName} />
          </div>

          <div className="flex-1 space-y-2 md:space-y-4 text-center md:text-left pb-1 md:pb-4">
            <h1 className="text-2xl md:text-6xl font-black text-white leading-none tracking-tighter filter drop-shadow-2xl flex items-center md:justify-start justify-center gap-2 md:gap-6">
              {profileName}
              <svg className="w-5 h-5 md:w-12 md:h-12 text-[#1d9bf0]" viewBox="0 0 40 40" fill="currentColor">
                <path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd" />
              </svg>
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-zinc-400 text-[9px] md:text-sm font-bold uppercase tracking-[0.15em] mt-2">
              <span className="flex items-center gap-1.5"><span className="text-white">12.4K</span> Subscribers</span>
              <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
              <span className="flex items-center gap-1.5"><span className="text-white">{artistTracks.length}</span> Pool Releases</span>
              <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
              <span className="flex items-center gap-1.5"><span className="text-[#ff5500]">Elite</span> Status</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Body */}
      <div className="max-w-[1400px] mx-auto mt-6 md:mt-16 flex flex-col lg:flex-row gap-8 md:gap-16 px-4 md:px-8">
        {/* Biography & Sidebar */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-zinc-900/40 p-5 md:p-10 rounded-[32px] md:rounded-[40px] border border-white/5 space-y-6 md:space-y-8 sticky top-32">
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Artist Profile</h3>
              <p className="text-zinc-300 text-xs md:text-lg leading-relaxed font-medium">
                {profileBio}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4 pt-2">
              <button
                onClick={isCurrentUser ? onEditProfile : undefined}
                className={`text-[9px] md:text-[12px] font-black uppercase tracking-[0.15em] py-3 md:py-5 rounded-xl md:rounded-2xl transition-all shadow-xl active:scale-95 ${isCurrentUser ? 'bg-white text-black hover:bg-zinc-200' : 'bg-[#ff5500] text-white hover:brightness-110'}`}
              >
                {isCurrentUser ? 'Update Profile' : 'Join the Pool'}
              </button>
              <button className="bg-white/5 text-white text-[9px] md:text-[12px] font-black uppercase tracking-[0.15em] py-3 md:py-5 rounded-xl md:rounded-2xl hover:bg-white/10 transition-all active:scale-95 border border-white/5">
                Share Link
              </button>
              {isCurrentUser && (
                <button
                  onClick={onAdminClick}
                  className="col-span-2 md:col-span-1 bg-zinc-800 text-zinc-400 hover:text-white text-[9px] md:text-[12px] font-black uppercase tracking-[0.15em] py-3 md:py-5 rounded-xl md:rounded-2xl hover:bg-zinc-700 transition-all active:scale-95 border border-white/5 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4 2 2 0 000-4zm0 14v-2m0 0a2 2 0 100-4 2 2 0 000 4zm-8.146-7.854l-1.414-1.414m1.414 1.414a2 2 0 102.828-2.828 2 2 0 00-2.828 2.828zm14.292 2.828l1.414 1.414m-1.414-1.414a2 2 0 102.828 2.828 2 2 0 00-2.828-2.828z" /></svg>
                  Admin Panel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tracks Grid Section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 md:mb-12 border-b border-white/10 pb-4 md:pb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-[10px] md:text-sm font-black uppercase text-white tracking-[0.2em] md:tracking-[0.4em]">Pool Releases</h2>
              <div className="w-1 h-1 bg-[#ff5500] rounded-full"></div>
              <span className="text-[9px] md:text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{artistTracks.length} Total</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-zinc-900 border border-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 md:p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#ff5500] text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 md:p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#ff5500] text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
              </div>

              {isCurrentUser && (
                <button
                  onClick={onUploadClick}
                  className="bg-[#ff5500] text-white px-3 py-2 md:px-6 md:py-2.5 rounded-lg md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#ff5500]/20"
                >
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={3.5} /></svg>
                  <span className="hidden md:inline">Upload</span>
                </button>
              )}
            </div>
          </div>

          {displayTracks.length > 0 ? (
            viewMode === 'list' ? (
              <div className="space-y-2">
                {displayTracks.map((track, idx) => (
                  <div
                    key={track.id}
                    onClick={() => track.isAlbum ? onNavigateToAlbum?.(track.album!) : onSelectTrack(track)}
                    className="flex items-center p-2 md:p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/5 cursor-pointer group transition-all"
                  >
                    <div className="w-8 md:w-10 text-center text-[10px] font-black text-zinc-600 mr-2 md:mr-4">
                      {(idx + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-zinc-800 overflow-hidden shrink-0 relative mr-4 md:mr-6">
                      <img src={track.coverUrl} className="w-full h-full object-cover" alt={track.title} />
                      {track.isAlbum && (
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-[6px] md:text-[8px] font-black uppercase text-white text-center py-0.5">Album</div>
                      )}
                      <div className={`absolute inset-0 bg-black/40 ${currentTrackId === track.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} flex items-center justify-center transition-opacity`}>
                        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${currentTrackId === track.id ? 'bg-[#ff5500] text-white' : 'bg-white text-black'} flex items-center justify-center shadow-lg`}>
                          {currentTrackId === track.id && isPlaying ? (
                            <svg className="w-3 md:w-4 h-3 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                          ) : (
                            <svg className="w-3 md:w-4 h-3 md:h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className={`text-xs md:text-sm font-bold truncate transition-colors ${currentTrackId === track.id ? 'text-[#ff5500]' : 'text-white'}`}>{track.title}</h4>
                      <p className="text-[9px] md:text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{track.artist}</p>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-8">
                      <span className="w-16 text-center">{track.bpm} BPM</span>
                      <span className="w-8 text-center text-[#ff5500]">{track.key}</span>
                      <span className="w-12 text-center">{track.genre}</span>
                      <span className="w-12 text-center">{track.duration}</span>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); onLike?.(track.id); }}
                        className={`p-2 rounded-full hover:bg-white/10 transition-colors ${track.isLiked ? 'text-[#ff5500]' : 'text-zinc-600'}`}
                      >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill={track.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-10 md:gap-y-16">
                {displayTracks.map(track => (
                  <div key={track.id}>
                    <TrackCard
                      track={track}
                      isCurrent={currentTrackId === track.id}
                      isPlaying={isPlaying}
                      onSelect={() => track.isAlbum ? onNavigateToAlbum?.(track.album!) : onSelectTrack(track)}
                      onEdit={onEdit}
                      onLike={() => onLike?.(track.id)}
                      onAddToPlaylist={() => onAddToPlaylist?.(track)}
                      onNavigate={() => track.isAlbum ? onNavigateToAlbum?.(track.album!) : onNavigateToTrack(track)}
                    />
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-32 md:py-48 text-zinc-700 space-y-6 opacity-40">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" strokeWidth={1.5} /></svg>
              <p className="text-[11px] font-black uppercase tracking-[0.4em]">Pool is currently empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Compact Back Button */}
      <button
        onClick={onBack}
        className="hidden md:flex fixed top-24 right-4 md:right-8 z-[60] w-12 h-12 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 text-white items-center justify-center hover:bg-[#ff5500] transition-all shadow-2xl group"
      >
        <svg className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth={2.5} /></svg>
      </button>
    </div>
  );
};

export default ArtistProfile;
