
import React, { useState, useRef } from 'react';
import { Track, Genre, TrackVersion } from '../types';

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
    album: track.album || '',
  });

  const [versions, setVersions] = useState<TrackVersion[]>(track.versions || []);
  const [mainAudioFile, setMainAudioFile] = useState<File | null>(null);
  const [versionFiles, setVersionFiles] = useState<Record<string, File>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bpm' ? parseInt(value) || 0 : value,
    }));
  };

  const handleMainFileSelect = (file: File) => {
    setMainAudioFile(file);
  };

  const handleVersionChange = (id: string, field: keyof TrackVersion, value: string) => {
    setVersions(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleDeleteVersion = (id: string) => {
    setVersions(prev => prev.filter(v => v.id !== id));
    // Also remove any pending file for this version
    const newFiles = { ...versionFiles };
    delete newFiles[id];
    setVersionFiles(newFiles);
  };

  const handleVersionFileSelect = (id: string, file: File) => {
    setVersionFiles(prev => ({ ...prev, [id]: file }));
  };

  const handleAddVersion = (file: File) => {
    const newId = `ver-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newVersion: TrackVersion = {
      id: newId,
      name: file.name.split('.').slice(0, -1).join('.').replace(/_/g, ' '),
      format: (file.name.split('.').pop()?.toUpperCase() || 'MP3') as any,
      duration: '0:00', // In a real app we'd parse this
      audioUrl: '' // Placeholder
    };
    setVersions(prev => [...prev, newVersion]);
    setVersionFiles(prev => ({ ...prev, [newId]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTrack = { ...track, ...formData };

    // Handle Main File
    if (mainAudioFile) {
      updatedTrack.audioUrl = URL.createObjectURL(mainAudioFile);
    }

    // Handle Versions updates
    updatedTrack.versions = versions.map(v => {
      if (versionFiles[v.id]) {
        return { ...v, audioUrl: URL.createObjectURL(versionFiles[v.id]) };
      }
      return v;
    });

    onSave(updatedTrack as Track);
  };

  // Drag and Drop Helpers
  const DragDropZone = ({ onFile, label, subLabel, activeFile }: { onFile: (f: File) => void, label: string, subLabel?: string, activeFile?: File | null }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]);
    };

    return (
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center text-center cursor-pointer group ${isDragOver ? 'border-[#ff5500] bg-[#ff5500]/10' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept="audio/*" className="hidden" onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
        {activeFile ? (
          <div className="flex items-center gap-2 text-[#ff5500]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-sm font-bold truncate max-w-[200px]">{activeFile.name} (Ready)</span>
          </div>
        ) : (
          <>
            <span className="text-xs font-bold text-white uppercase tracking-wider mb-1">{label}</span>
            {subLabel && <span className="text-[10px] text-zinc-500 font-medium">{subLabel}</span>}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass w-full max-w-2xl h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col rounded-3xl border border-white/10 shadow-2xl relative bg-[#0c0c0e]">

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-2xl font-bold text-white">Edit Metadata</h3>
            <p className="text-zinc-400 text-sm">Update track information & versions</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

          <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Main Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Main Audio File</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <DragDropZone
                      onFile={handleMainFileSelect}
                      label="Replace Main Audio"
                      subLabel="Drag & Drop or Click"
                      activeFile={mainAudioFile}
                    />
                  </div>
                </div>
                {!mainAudioFile && <p className="text-[10px] text-zinc-600 px-1">Current: <span className="text-zinc-400 font-mono truncate">{track.audioUrl.split('/').pop()}</span></p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Track Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 transition-all text-sm font-medium"
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
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 transition-all text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Album</label>
                <input type="text" name="album" value={formData.album} onChange={handleChange} className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 transition-all text-sm font-medium" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Genre</label>
                <select name="genre" value={formData.genre} onChange={handleChange} className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 transition-all appearance-none text-sm font-medium">
                  {Object.values(Genre).map(g => <option key={g} value={g} className="bg-zinc-900">{g}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">BPM</label>
                <input type="number" name="bpm" value={formData.bpm} onChange={handleChange} className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 transition-all text-sm font-medium" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Key</label>
                <input type="text" name="key" value={formData.key} onChange={handleChange} className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 transition-all text-sm font-medium" />
              </div>
            </div>

            {/* Versions Section */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Track Versions</label>
                <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-zinc-400">{versions.length} Versions</span>
              </div>

              <div className="space-y-3">
                {versions.map((ver, idx) => (
                  <div key={ver.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-3 flex flex-col md:flex-row gap-3 items-start md:items-center animate-in slide-in-from-bottom-2 duration-300">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 text-xs font-bold text-zinc-500">
                      {idx + 1}
                    </div>

                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
                      <input
                        type="text"
                        value={ver.name}
                        onChange={(e) => handleVersionChange(ver.id, 'name', e.target.value)}
                        className="bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-xs md:text-sm outline-none"
                        placeholder="Version Name"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={ver.format}
                          onChange={(e) => handleVersionChange(ver.id, 'format', e.target.value)}
                          className="w-20 bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-xs md:text-sm outline-none text-center uppercase"
                          placeholder="FMT"
                        />
                        <div className="flex-1 max-w-[150px]">
                          {/* Mini Dropzone for replacement */}
                          <label className={`w-full h-full flex items-center justify-center border border-dashed rounded-lg cursor-pointer transition-all ${versionFiles[ver.id] ? 'border-green-500/50 bg-green-500/10 text-green-500' : 'border-white/10 hover:bg-white/5 text-zinc-500 hover:text-white'}`}>
                            <input type="file" className="hidden" accept="audio/*" onChange={(e) => e.target.files?.[0] && handleVersionFileSelect(ver.id, e.target.files[0])} />
                            <span className="text-[9px] font-bold uppercase">{versionFiles[ver.id] ? 'File Ready' : 'Replace'}</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <button type="button" onClick={() => handleDeleteVersion(ver.id)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Version Dropzone */}
              <div className="pt-2">
                <DragDropZone
                  onFile={handleAddVersion}
                  label="Add New Version"
                  subLabel="Drag audio file here to add version"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex justify-between shrink-0 bg-[#0c0c0e]">
          {onDelete && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to delete this track? This cannot be undone.')) {
                  onDelete(track.id);
                }
              }}
              className="px-5 py-3 rounded-xl border border-red-500/30 text-red-500 font-bold hover:bg-red-500/10 transition-all text-sm"
            >
              Delete Track
            </button>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-form"
              className="px-8 py-3 rounded-xl bg-[#ff5500] text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-[#ff5500]/20 text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditTrackModal;
