import React, { useState } from 'react';
import { Playlist } from '../types';

interface LibraryViewProps {
  playlists: Playlist[];
  onCreatePlaylist: (name: string) => void;
  onViewPlaylist: (playlist: Playlist) => void;
  onBack: () => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ playlists, onCreatePlaylist, onViewPlaylist, onBack }) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 pb-32 px-4 md:px-0">

      {/* Library Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">Your Library</h1>
          <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">Manage your crates and private collections</p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="bg-white text-black px-6 py-3 md:px-8 md:py-3.5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 group w-full md:w-auto"
        >
          <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={3} /></svg>
          <span className="md:hidden">New Crate</span>
          <span className="hidden md:inline">Create New Crate</span>
        </button>
      </div>

      {/* Content Grid */}
      <div className="min-h-[400px]">

        {/* CRATES VIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-10">
          {playlists.map(playlist => (
            <div
              key={playlist.id}
              onClick={() => onViewPlaylist(playlist)}
              className="group cursor-pointer flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-500"
            >
              <div className="relative aspect-square rounded-[32px] overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl transition-all duration-500 group-hover:translate-y-[-8px] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] group-hover:border-[#ff5500]/30">
                <img src={playlist.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={playlist.name} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-2xl">
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-center">
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Open Crate</span>
                  </div>
                </div>
              </div>
              <div className="px-2">
                <h3 className="text-white text-lg font-bold truncate group-hover:text-[#ff5500] transition-colors mb-1">{playlist.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{playlist.trackIds.length} Tracks</p>
                  <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Modified: {new Date(playlist.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
          {playlists.length === 0 && (
            <div className="col-span-full py-24 md:py-32 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-white/5 rounded-[48px] bg-white/[0.01]">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-zinc-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth={2} /></svg>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.3em] mb-2">No crates in your library</p>
              <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">Start organizing your tracks by creating a crate</p>
            </div>
          )}
        </div>
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-[#111] w-full max-w-sm p-10 rounded-[40px] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-black text-white mb-2">New Crate</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Enter a name for your private collection</p>
            </div>
            <form onSubmit={handleCreate}>
              <input
                autoFocus
                type="text"
                placeholder="Ex: Mainstage Stems..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#ff5500] transition-all mb-8 font-bold text-lg"
              />
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-[#ff5500] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#ff5500]/30 hover:brightness-110 active:scale-95 transition-all">Create Crate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Back Button - Hidden on Mobile */}
      <button
        onClick={onBack}
        className="hidden md:flex fixed top-24 right-8 z-[60] w-12 h-12 bg-black/50 backdrop-blur-xl rounded-full border border-white/10 text-white items-center justify-center hover:bg-[#ff5500] transition-all shadow-2xl group"
      >
        <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth={2.5} /></svg>
      </button>
    </div>
  );
};

export default LibraryView;

