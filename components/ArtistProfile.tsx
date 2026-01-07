
import React from 'react';
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
  onLike?: (id: string) => void;
  onAddToPlaylist?: (track: Track) => void;
  userProfile?: { name: string; bio: string; avatarUrl: string; headerUrl: string };
  onEditProfile?: () => void;
  onUploadClick?: () => void;
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
  onLike,
  onAddToPlaylist,
  userProfile,
  onEditProfile,
  onUploadClick
}) => {
  const isCurrentUser = artistId === 'art-user';
  const artistTracks = tracks.filter(t => t.artistId === artistId);

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
            {isCurrentUser && (
              <button
                onClick={onUploadClick}
                className="bg-[#ff5500] text-white px-3 py-2 md:px-8 md:py-3 rounded-lg md:rounded-2xl font-black uppercase text-[9px] md:text-[11px] tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#ff5500]/20"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={3.5} /></svg>
                <span className="hidden md:inline">Upload Track</span>
                <span className="md:hidden">Upload</span>
              </button>
            )}
          </div>

          {artistTracks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-10 md:gap-y-16">
              {artistTracks.map(track => (
                <div key={track.id}>
                  <TrackCard
                    track={track}
                    isCurrent={currentTrackId === track.id}
                    isPlaying={isPlaying}
                    onSelect={() => onSelectTrack(track)}
                    onEdit={onEdit}
                    onLike={() => onLike?.(track.id)}
                    onAddToPlaylist={() => onAddToPlaylist?.(track)}
                    onNavigate={() => onNavigateToTrack(track)}
                  />
                </div>
              ))}
            </div>
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
