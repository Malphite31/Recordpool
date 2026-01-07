
import React, { useState, useEffect } from 'react';
import { Track, Genre } from '../types';

interface EditTrackModalProps {
  track: Track;
  onSave: (updatedTrack: Track) => void;
  onClose: () => void;
}

const EditTrackModal: React.FC<EditTrackModalProps> = ({ track, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Track>>({
    title: track.title,
    artist: track.artist,
    bpm: track.bpm,
    key: track.key,
    genre: track.genre,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bpm' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...track, ...formData } as Track);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass w-full max-w-lg p-8 rounded-3xl border border-white/10 relative shadow-2xl">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Edit Metadata</h3>
          <p className="text-zinc-400 text-sm">Update the track information for your pool.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Track Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="e.g. Neon Nights"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Artist</label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                required
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="e.g. Cyber Pulse"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">BPM</label>
              <input
                type="number"
                name="bpm"
                value={formData.bpm}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="124"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Key</label>
              <input
                type="text"
                name="key"
                value={formData.key}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="e.g. 4A"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Genre</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
              >
                {Object.values(Genre).map(g => (
                  <option key={g} value={g} className="bg-zinc-900">{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTrackModal;
