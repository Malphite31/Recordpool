
import React, { useState, useEffect } from 'react';
import { Track, Genre, Playlist, TrackVersion } from './types';
import { INITIAL_TRACKS } from './constants';
import Player from './components/Player';
import TrackCard from './components/TrackCard';
import EditTrackModal from './components/EditTrackModal';
import EditProfileModal from './components/EditProfileModal';
import TrackDetail from './components/TrackDetail';
import ArtistProfile from './components/ArtistProfile';
import LibraryView from './components/LibraryView';
import PlaylistDetail from './components/PlaylistDetail';
import AddToPlaylistModal from './components/AddToPlaylistModal';
import UploadModal from './components/UploadModal';
import ArtistsView from './components/ArtistsView';
import GenresView from './components/GenresView';
import { extractPeaks } from './services/audioProcessor';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'You',
    bio: 'The elite music producer behind the latest vibes in the pool.',
    avatarUrl: 'https://picsum.photos/seed/user/300/300',
    headerUrl: 'https://picsum.photos/seed/userheader/1200/400'
  });

  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: 'pl-1',
      name: 'Late Night Stems',
      description: 'The heaviest tech house in the pool.',
      coverUrl: 'https://picsum.photos/seed/playlist1/400/400',
      trackIds: ['1', '3'],
      createdAt: Date.now()
    }
  ]);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(INITIAL_TRACKS[0]);
  const [viewedTrack, setViewedTrack] = useState<Track | null>(null);
  const [viewedArtistId, setViewedArtistId] = useState<string | null>(null);
  const [viewedPlaylist, setViewedPlaylist] = useState<Playlist | null>(null);
  const [isLibraryView, setIsLibraryView] = useState(false);
  const [isArtistsView, setIsArtistsView] = useState(false);
  const [isGenresView, setIsGenresView] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [trackToPlaylist, setTrackToPlaylist] = useState<Track | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  useEffect(() => {
    const initPeaks = async () => {
      const tracksWithPeaks = await Promise.all(tracks.map(async (t) => {
        if (!t.peaks || t.peaks.length === 0) {
          const peaks = await extractPeaks(t.audioUrl);
          return { ...t, peaks };
        }
        return t;
      }));
      setTracks(tracksWithPeaks);
    };
    initPeaks();
  }, []);

  useEffect(() => {
    const titleStyle = [
      'font-size: 60px',
      'font-weight: bold',
      'color: #ff5500',
      'text-shadow: 4px 4px 0px #000',
      'padding: 10px 0',
      'line-height: 1',
      'font-family: system-ui, -apple-system, sans-serif'
    ].join(';');

    const systemStyle = [
      'color: #10b981',
      'font-family: monospace',
      'font-size: 12px',
      'background:rgba(0,0,0,0.8)',
      'padding: 2px 5px',
      'border-left: 2px solid #10b981',
      'margin-bottom: 2px'
    ].join(';');

    const warningBadgeStyle = [
      'background: #ff5500',
      'color: #000',
      'font-weight: bold',
      'font-size: 12px',
      'padding: 4px 8px',
      'border-radius: 4px'
    ].join(';');

    const warningTextStyle = [
      'color: #e4e4e7',
      'font-family: monospace',
      'font-size: 13px',
      'margin-top: 4px'
    ].join(';');

    setTimeout(() => {
      console.clear();
      console.log('%cVIBEPOOL', titleStyle);
      console.log('%c SYSTEM :: Audio Engine.........ONLINE', systemStyle);
      console.log('%c SYSTEM :: Security Layer.......ACTIVE', systemStyle);
      console.log('%c SYSTEM :: Vibe Check...........PASSED', systemStyle);
      console.log('%c SYSTEM :: Owner.................BENZ SIANGCO', systemStyle);
      console.log('\n');
      console.log('%c CAUTION: DEVELOPER ZONE ', warningBadgeStyle);
      console.log('%cThis facility is intended for developers only.', warningTextStyle);
      console.log('%cPasting code here could compromise your account security.', warningTextStyle);
      console.log('\n');
    }, 1000);
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const selectTrack = (track: Track) => {
    if (currentTrack?.id === track.id && currentTrack.audioUrl === track.audioUrl) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const selectTrackVersion = (track: Track, version: TrackVersion) => {
    if (currentTrack?.id === track.id && currentTrack.versionId === version.id) {
      togglePlay();
      return;
    }

    const versionedTrack: Track = {
      ...track,
      title: `${track.title} (${version.name})`,
      audioUrl: version.audioUrl,
      duration: version.duration,
      versionId: version.id,
    };
    setCurrentTrack(versionedTrack);
    setIsPlaying(true);
  };

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleNext = () => {
    const pool = viewedPlaylist
      ? tracks.filter(t => viewedPlaylist.trackIds.includes(t.id))
      : filteredTracks;

    if (pool.length === 0) return;
    const currentIndex = pool.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % pool.length;
    setCurrentTrack(pool[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const pool = viewedPlaylist
      ? tracks.filter(t => viewedPlaylist.trackIds.includes(t.id))
      : filteredTracks;

    if (pool.length === 0) return;
    const currentIndex = pool.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + pool.length) % pool.length;
    setCurrentTrack(pool[prevIndex]);
    setIsPlaying(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingUpload(true);
    const url = URL.createObjectURL(file);
    const peaks = await extractPeaks(url);
    const newTrack: Track = {
      id: Math.random().toString(36).substr(2, 9),
      artistId: 'art-user',
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: userProfile.name,
      bpm: 124,
      key: '1A',
      genre: 'Tech House',
      duration: '4:52',
      coverUrl: `https://picsum.photos/seed/${file.name}/400/400`,
      audioUrl: url,
      downloadCount: 0,
      likeCount: 0,
      repostCount: 0,
      peaks: peaks,
      versions: []
    };
    setTracks(prev => [newTrack, ...prev]);
    setIsUploading(false);
    setIsProcessingUpload(false);
  };

  const handleLike = (id: string) => {
    setTracks(prev => prev.map(t => {
      if (t.id === id) {
        const isLiked = !t.isLiked;
        const newCount = (t.likeCount || 0) + (isLiked ? 1 : -1);
        const updated = { ...t, isLiked, likeCount: Math.max(0, newCount) };
        if (currentTrack?.id === id) setCurrentTrack(updated);
        if (viewedTrack?.id === id) setViewedTrack(updated);
        return updated;
      }
      return t;
    }));
  };

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      coverUrl: `https://picsum.photos/seed/${name}/400/400`,
      trackIds: [],
      createdAt: Date.now()
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
  };

  const addToPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId && !pl.trackIds.includes(trackId)) {
        return { ...pl, trackIds: [...pl.trackIds, trackId] };
      }
      return pl;
    }));
    setTrackToPlaylist(null);
  };

  const removeFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        return { ...pl, trackIds: pl.trackIds.filter(id => id !== trackId) };
      }
      return pl;
    }));
  };

  const clearViews = () => {
    setViewedTrack(null);
    setViewedArtistId(null);
    setViewedPlaylist(null);
    setIsLibraryView(false);
    setIsArtistsView(false);
    setIsGenresView(false);
  };

  const navigateToHome = () => { clearViews(); window.scrollTo(0, 0); };
  const navigateToArtist = (artistId: string) => { clearViews(); setViewedArtistId(artistId); window.scrollTo(0, 0); };
  const navigateToTrack = (track: Track) => { clearViews(); setViewedTrack(track); window.scrollTo(0, 0); };
  const navigateToLibrary = () => { clearViews(); setIsLibraryView(true); window.scrollTo(0, 0); };
  const navigateToArtists = () => { clearViews(); setIsArtistsView(true); window.scrollTo(0, 0); };
  const navigateToGenres = () => { clearViews(); setIsGenresView(true); window.scrollTo(0, 0); };
  const navigateToPlaylist = (playlist: Playlist) => { clearViews(); setViewedPlaylist(playlist); window.scrollTo(0, 0); };
  const navigateToMyProfile = () => navigateToArtist('art-user');

  const commonHeader = (
    <header className="sticky top-0 z-40 bg-black px-4 md:px-8 py-4 flex items-center justify-between border-b border-white/5">
      <div className="flex items-center cursor-pointer gap-3" onClick={navigateToHome}>
        <div className="w-9 h-9 bg-gradient-to-tr from-[#ff5500] to-[#ff8800] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff5500]/25 ring-1 ring-white/10 group">
          <svg className="w-5 h-5 text-white transform group-hover:scale-110 transition-transform duration-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.5L3.5 6.5H8.5L12 13.5L15.5 6.5H20.5L12 21.5Z" />
          </svg>
        </div>
        <span className="font-outfit font-black tracking-tighter text-white text-2xl hidden md:block">VIBEPOOL</span>
        <span className="font-outfit font-black tracking-tighter text-white text-xl md:hidden">VIBEPOOL</span>
      </div>

      <div className="flex-1 max-w-xl mx-3 md:mx-12 relative group">
        <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
          <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-600 group-focus-within:text-[#ff5500] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input
          type="text"
          placeholder="SEARCH TRACKS..."
          className="w-full bg-white/[0.03] hover:bg-white/[0.06] focus:bg-zinc-900 border border-white/10 group-hover:border-white/20 focus:border-[#ff5500]/50 rounded-xl md:rounded-2xl pl-9 md:pl-11 pr-4 py-2.5 md:py-3 text-[10px] md:text-xs font-bold text-white placeholder:text-zinc-700/70 focus:outline-none focus:ring-1 focus:ring-[#ff5500]/20 transition-all tracking-widest placeholder:font-black shadow-inner"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-8 text-[11px] font-bold uppercase tracking-widest">
        <button onClick={navigateToHome} className={`hidden md:block transition-colors ${!isLibraryView && !isArtistsView && !isGenresView && !viewedArtistId && !viewedPlaylist && !viewedTrack ? 'text-[#ff5500]' : 'text-zinc-400 hover:text-white'}`}>Home</button>
        <button onClick={navigateToLibrary} className={`hidden md:block transition-colors ${isLibraryView ? 'text-[#ff5500]' : 'text-zinc-400 hover:text-white'}`}>Crates</button>
        <button onClick={navigateToArtists} className={`hidden md:block transition-colors ${isArtistsView ? 'text-[#ff5500]' : 'text-zinc-400 hover:text-white'}`}>Artists</button>
        <button onClick={navigateToGenres} className={`hidden md:block transition-colors ${isGenresView ? 'text-[#ff5500]' : 'text-zinc-400 hover:text-white'}`}>Genres</button>
        <div
          onClick={navigateToMyProfile}
          className={`hidden md:block w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10 cursor-pointer ${viewedArtistId === 'art-user' ? 'border-[#ff5500]' : ''}`}
        >
          <img src={userProfile.avatarUrl} className="w-full h-full object-cover" alt="User" />
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-black text-[#e4e4e7] pb-48">
      {commonHeader}

      <main className={`max-w-[1400px] mx-auto px-4 md:px-8 pt-6`}>
        {(() => {
          if (viewedTrack) {
            return (
              <TrackDetail
                track={viewedTrack}
                isPlaying={isPlaying && currentTrack?.id === viewedTrack.id}
                currentAudioUrl={currentTrack?.audioUrl}
                currentPlayingVersionId={currentTrack?.versionId}
                onPlayToggle={() => selectTrack(viewedTrack)}
                onPlayVersion={selectTrackVersion}
                onBack={navigateToHome}
                onArtistClick={navigateToArtist}
                onLike={() => handleLike(viewedTrack.id)}
              />
            );
          }
          if (viewedArtistId) {
            return (
              <ArtistProfile
                artistId={viewedArtistId}
                tracks={tracks}
                onBack={navigateToHome}
                onSelectTrack={selectTrack}
                currentTrackId={currentTrack?.id}
                isPlaying={isPlaying}
                onEdit={setEditingTrack}
                onNavigateToTrack={navigateToTrack}
                onLike={handleLike}
                onAddToPlaylist={setTrackToPlaylist}
                userProfile={viewedArtistId === 'art-user' ? userProfile : undefined}
                onEditProfile={() => setIsEditingProfile(true)}
                onUploadClick={() => setIsUploading(true)}
              />
            );
          }
          if (viewedPlaylist) {
            return (
              <PlaylistDetail
                playlist={viewedPlaylist}
                tracks={tracks.filter(t => viewedPlaylist.trackIds.includes(t.id))}
                currentTrackId={currentTrack?.id}
                currentAudioUrl={currentTrack?.audioUrl}
                isPlaying={isPlaying}
                onBack={navigateToLibrary}
                onPlayTrack={selectTrack}
                onPlayVersion={selectTrackVersion}
                onRemoveFromPlaylist={(trackId) => removeFromPlaylist(viewedPlaylist.id, trackId)}
              />
            );
          }
          if (isLibraryView) {
            return (
              <LibraryView
                playlists={playlists}
                onCreatePlaylist={createPlaylist}
                onViewPlaylist={navigateToPlaylist}
                onBack={navigateToHome}
              />
            );
          }
          if (isArtistsView) {
            return (
              <ArtistsView
                tracks={tracks}
                onSelectArtist={navigateToArtist}
                onBack={navigateToHome}
              />
            );
          }
          if (isGenresView) {
            return (
              <GenresView
                tracks={tracks}
                onSelectGenre={(genre) => {
                  setSelectedGenre(genre);
                  navigateToHome();
                }}
                onBack={navigateToHome}
              />
            );
          }

          return (
            <div className="animate-in fade-in duration-500">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-4">Trending Now</h2>
                <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar pb-2 border-b border-white/5">
                  {['ALL', ...Object.values(Genre).map(g => g.toUpperCase())].map(genre => (
                    <button key={genre} onClick={() => setSelectedGenre(genre === 'ALL' ? 'All' : genre)}
                      className={`text-[11px] font-black uppercase transition-all whitespace-nowrap tracking-widest pb-3 border-b-2 ${selectedGenre.toUpperCase() === genre ? 'text-[#ff5500] border-[#ff5500]' : 'text-zinc-600 border-transparent hover:text-white'}`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 md:gap-x-8 gap-y-10">
                {filteredTracks.map(track => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    isCurrent={currentTrack?.id === track.id}
                    isPlaying={isPlaying}
                    onSelect={() => selectTrack(track)}
                    onEdit={setEditingTrack}
                    onLike={() => handleLike(track.id)}
                    onNavigate={() => navigateToTrack(track)}
                  />
                ))}
              </div>
            </div>
          );
        })()}
      </main>

      {/* Mobile Bottom Nav Bar - Balanced layout */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-3xl border-t border-white/5 px-2 py-4 flex items-center justify-around z-[110]">
        <button onClick={navigateToHome} className={`flex flex-col items-center gap-1.5 flex-1 min-w-0 ${!isLibraryView && !isArtistsView && !isGenresView && viewedArtistId !== 'art-user' && !viewedPlaylist && !viewedTrack ? 'text-[#ff5500]' : 'text-zinc-600'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth={2.5} /></svg>
          <span className="text-[8px] font-black uppercase tracking-widest truncate w-full text-center">Home</span>
        </button>
        <button onClick={navigateToLibrary} className={`flex flex-col items-center gap-1.5 flex-1 min-w-0 ${isLibraryView || viewedPlaylist ? 'text-[#ff5500]' : 'text-zinc-600'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth={2.5} /></svg>
          <span className="text-[8px] font-black uppercase tracking-widest truncate w-full text-center">Crates</span>
        </button>
        <button onClick={navigateToArtists} className={`flex flex-col items-center gap-1.5 flex-1 min-w-0 ${isArtistsView ? 'text-[#ff5500]' : 'text-zinc-600'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span className="text-[8px] font-black uppercase tracking-widest truncate w-full text-center">Artists</span>
        </button>
        <button onClick={navigateToGenres} className={`flex flex-col items-center gap-1.5 flex-1 min-w-0 ${isGenresView ? 'text-[#ff5500]' : 'text-zinc-600'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          <span className="text-[8px] font-black uppercase tracking-widest truncate w-full text-center">Genres</span>
        </button>
        <button onClick={navigateToMyProfile} className={`flex flex-col items-center gap-1.5 flex-1 min-w-0 ${viewedArtistId === 'art-user' ? 'text-[#ff5500]' : 'text-zinc-600'}`}>
          <div className={`w-5 h-5 rounded-full overflow-hidden border ${viewedArtistId === 'art-user' ? 'border-[#ff5500]' : 'border-zinc-800'}`}>
            <img src={userProfile.avatarUrl} className="w-full h-full object-cover" />
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest truncate w-full text-center">You</span>
        </button>
      </nav>

      <Player
        track={currentTrack}
        isPlaying={isPlaying}
        onPlayToggle={togglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
        onLike={() => currentTrack && handleLike(currentTrack.id)}
        onNavigate={() => currentTrack && navigateToTrack(currentTrack)}
      />

      {isUploading && (
        <UploadModal
          defaultArtist={userProfile.name}
          existingAlbums={Array.from(new Set(tracks.map(t => t.album).filter(Boolean))) as string[]}
          onClose={() => setIsUploading(false)}
          onUpload={async (result) => {
            const { mode, items, mainMetadata } = result;

            if (mode === 'individual') {
              const sharedCoverUrl = mainMetadata?.coverFile
                ? URL.createObjectURL(mainMetadata.coverFile)
                : null;

              const newTracks = await Promise.all(items.map(async (item) => {
                const url = URL.createObjectURL(item.file);
                const peaks = await extractPeaks(url);
                return {
                  id: Math.random().toString(36).substr(2, 9),
                  artistId: 'art-user',
                  title: item.customMeta.title || item.file.name,
                  artist: mainMetadata?.artist || item.customMeta.artist || userProfile.name,
                  bpm: parseInt(item.customMeta.bpm) || 124,
                  key: item.customMeta.key || '1A',
                  genre: mainMetadata?.genre || item.customMeta.genre || 'Tech House',
                  album: mainMetadata?.album, // Persist Album for Individual Items too if set? Actually mainMeta.album is optional text.
                  // Wait, earlier I hid Album input for individual mode. 
                  // But mainMetadata.title IS Album Title for individual mode.
                  // So album = mainMetadata.title?
                  // If mode === 'individual' (Album), the "Album Name" is the grouping.
                  // But each file is a track.
                  // So track.album = mainMetadata.title.
                  // Correct logic:
                  // If Album Mode: album = mainMetadata.title
                  // If Song Mode: album = mainMetadata.album
                  duration: '4:00',
                  coverUrl: sharedCoverUrl || `https://picsum.photos/seed/${item.file.name}/400/400`,
                  audioUrl: url,
                  downloadCount: 0,
                  likeCount: 0,
                  repostCount: 0,
                  peaks: peaks,
                  versions: []
                } as Track;
              }));

              // Correct logic application:
              const finalTracks = newTracks.map(t => ({
                ...t,
                album: mainMetadata?.title || t.album
              }));

              setTracks(prev => [...finalTracks, ...prev]);
            } else {
              const coverUrl = mainMetadata?.coverFile ? URL.createObjectURL(mainMetadata.coverFile) : `https://picsum.photos/seed/${mainMetadata?.title || 'cover'}/400/400`;

              const versions = await Promise.all(items.map(async (item, idx) => {
                return {
                  id: Math.random().toString(36).substr(2, 9),
                  name: item.customMeta.title || `Version ${idx + 1}`,
                  duration: '4:00',
                  bpm: item.customMeta.bpm || '124',
                  key: item.customMeta.key || '1A',
                  audioUrl: URL.createObjectURL(item.file),
                  format: 'MP3'
                };
              }));

              const peaks = await extractPeaks(versions[0].audioUrl);

              const newTrack: Track = {
                id: Math.random().toString(36).substr(2, 9),
                artistId: 'art-user',
                title: mainMetadata?.title || 'Unknown Title',
                artist: mainMetadata?.artist || userProfile.name,
                bpm: parseInt(items[0].customMeta.bpm) || 124,
                key: items[0].customMeta.key || '1A',
                genre: mainMetadata?.genre || 'Tech House',
                album: mainMetadata?.album, // Added
                duration: versions[0].duration,
                coverUrl: coverUrl,
                audioUrl: versions[0].audioUrl,
                downloadCount: 0,
                likeCount: 0,
                repostCount: 0,
                peaks: peaks,
                versions: versions
              };
              setTracks(prev => [newTrack, ...prev]);
            }
            setIsUploading(false);
          }}
        />
      )}

      {editingTrack && <EditTrackModal track={editingTrack} onSave={(ut) => { setTracks(ts => ts.map(t => t.id === ut.id ? ut : t)); setEditingTrack(null); }} onClose={() => setEditingTrack(null)} />}

      {isEditingProfile && (
        <EditProfileModal
          profile={userProfile}
          onSave={(p) => { setUserProfile(p); setIsEditingProfile(false); }}
          onClose={() => setIsEditingProfile(false)}
        />
      )}
    </div>
  );
};

export default App;
