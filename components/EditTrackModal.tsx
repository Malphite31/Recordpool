
import React, { useState, useEffect } from 'react';
import { Track, Genre } from '../types';

interface EditTrackModalProps {
  track: Track;
  onSave: (updatedTrack: Track) => void;
  onDelete?: (trackId: string) => void;
  onClose: () => void;
}

const EditTrackModal: React.FC<EditTrackModalProps> = ({ track, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState<Partial<Track>>({
    title: track.title,
    artist: track.artist,
    bpm: track.bpm,
    key: track.key,
    genre: track.genre,
    album: track.album || '', // Add Album support
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bpm' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTrack = { ...track, ...formData };
    if (audioFile) {
      updatedTrack.audioUrl = URL.createObjectURL(audioFile);
    }
    onSave(updatedTrack as Track);
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Edit Metadata</h3>
          <p className="text-zinc-400 text-sm">Update the track information for your pool.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-2 col-span-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Audio File</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-zinc-400 text-sm truncate font-medium">
                  {audioFile ? audioFile.name : "Current Audio File"}
                </div>
                <label className="bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer transition-colors font-bold text-xs uppercase tracking-wider border border-white/5 hover:border-white/20">
                  Replace File
                  <input type="file" accept="audio/*" className="hidden" onChange={(e) => {
                    if (e.target.files?.[0]) setAudioFile(e.target.files[0]);
                  }} />
                </label>
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Track Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 transition-all"
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
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 transition-all"
                placeholder="e.g. Cyber Pulse"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Album</label>
              <input
                type="text"
                name="album"
                value={formData.album}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 transition-all"
                placeholder="e.g. Summer Hits"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">BPM</label>
              <input
                type="number"
                name="bpm"
                value={formData.bpm}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 transition-all"
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
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 transition-all"
                placeholder="e.g. 4A"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Genre</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 transition-all appearance-none"
              >
                {Object.values(Genre).map(g => (
                  <option key={g} value={g} className="bg-zinc-900">{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this track? This cannot be undone.')) {
                    onDelete(track.id);
                  }
                }}
                className="px-5 py-3 rounded-xl border border-red-500/30 text-red-500 font-bold hover:bg-red-500/10 transition-all mr-auto"
              >
                Delete
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#ff5500] text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-[#ff5500]/20"
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
