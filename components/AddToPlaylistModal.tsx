
import React, { useState } from 'react';
import { Track, Playlist } from '../types';

interface AddToPlaylistModalProps {
  track: Track;
  playlists: Playlist[];
  onSelect: (playlistId: string, trackId: string) => void;
  onClose: () => void;
  onCreateNew: (name: string) => void;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ track, playlists, onSelect, onClose, onCreateNew }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onCreateNew(newName.trim());
      setNewName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111] w-full max-w-sm p-8 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
        </button>

        <div className="mb-8">
          <h3 className="text-xl font-black text-white mb-2">Add to Crate</h3>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">"{track.title}"</p>
        </div>

        {!isCreating ? (
          <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-2 mb-8">
            {playlists.map(pl => (
              <button 
                key={pl.id}
                onClick={() => onSelect(pl.id, track.id)}
                className="w-full flex items-center gap-4 p-3 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-[#ff5500]/10 hover:border-[#ff5500]/30 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img src={pl.coverUrl} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 truncate">
                  <div className="text-sm font-bold text-white group-hover:text-[#ff5500] transition-colors truncate">{pl.name}</div>
                  <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{pl.trackIds.length} Tracks</div>
                </div>
              </button>
            ))}
            
            <button 
              onClick={() => setIsCreating(true)}
              className="w-full p-4 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center gap-2 text-zinc-500 hover:text-white hover:border-white/10 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={3}/></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">New Crate</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="mb-8 animate-in slide-in-from-right-2 duration-300">
            <input 
              autoFocus
              type="text" 
              placeholder="Crate Name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#ff5500] transition-all mb-4 font-bold"
            />
            <div className="flex gap-4">
              <button type="button" onClick={() => setIsCreating(false)} className="flex-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">Back</button>
              <button type="submit" className="flex-1 bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Create</button>
            </div>
          </form>
        )}

        <button 
          onClick={onClose}
          className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors border-t border-white/5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
