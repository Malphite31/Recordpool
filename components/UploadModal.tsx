
import React, { useState, useRef, useEffect } from 'react';

// Define result types for the parent component to consume
export interface UploadedFileMeta {
    file: File;
    customMeta: {
        title: string;      // Used as Track Title (Individual) or Version Name (Single Release)
        artist: string;
        genre: string;
        bpm: string;
        key: string;
    }
}

export interface UploadBatchResult {
    mode: 'individual' | 'versions';
    mainMetadata?: {
        title: string;
        artist: string;
        genre: string;
        description: string;
        coverFile: File | null;
    };
    items: UploadedFileMeta[];
}

interface UploadModalProps {
    onClose: () => void;
    onUpload: (result: UploadBatchResult) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
    // Stages: 'drop' -> 'organize' -> 'uploading' -> 'done'
    const [stage, setStage] = useState<'drop' | 'organize' | 'uploading' | 'done'>('drop');
    const [isDragOver, setIsDragOver] = useState(false);

    // Data
    const [files, setFiles] = useState<File[]>([]);
    const [uploadMode, setUploadMode] = useState<'individual' | 'versions'>('individual');

    // Metadata State
    const [mainMeta, setMainMeta] = useState({
        title: '',
        artist: '',
        genre: 'Tech House',
        description: '',
        coverFile: null as File | null
    });

    const [fileMeta, setFileMeta] = useState<Record<string, { title: string, artist: string, genre: string, bpm: string, key: string }>>({});

    // Progress State
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // --- Dropping Logic ---
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
    const handleDragLeave = () => setIsDragOver(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        processFiles(Array.from(e.dataTransfer.files));
    };
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) processFiles(Array.from(e.target.files));
    };

    const processFiles = (newFiles: File[]) => {
        const validFiles = newFiles.filter(f => f.type.startsWith('audio/'));
        if (validFiles.length === 0) return;

        setFiles(prev => [...prev, ...validFiles]);

        // Initialize metadata for new files
        const newMeta = { ...fileMeta };
        validFiles.forEach(f => {
            const name = f.name.replace(/\.[^/.]+$/, ""); // Strip extension
            // Heuristic to split Artist - Title if possible? 
            // Assuming "Artist - Title" format for individual defaults
            const parts = name.split(' - ');
            const artist = parts.length > 1 ? parts[0] : '';
            const title = parts.length > 1 ? parts.slice(1).join(' - ') : name;

            newMeta[f.name] = {
                title: title,
                artist: artist,
                genre: 'Tech House',
                bpm: '124',
                key: '1A'
            };
        });
        setFileMeta(newMeta);

        // If we were in drop stage, move to organize
        if (stage === 'drop') setStage('organize');
    };

    // --- Organizing Logic ---
    const removeFile = (fileName: string) => {
        setFiles(prev => prev.filter(f => f.name !== fileName));
        // If empty, go back to drop?
        if (files.length === 1) setStage('drop');
    };

    const updateFileMeta = (fileName: string, field: string, value: string) => {
        setFileMeta(prev => ({
            ...prev,
            [fileName]: { ...prev[fileName], [field]: value }
        }));
    };

    const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setMainMeta(prev => ({ ...prev, coverFile: e.target.files![0] }));
        }
    };

    // --- Uploading Logic ---
    const startUpload = () => {
        setStage('uploading');

        // Initialize progress
        const initProgress: Record<string, number> = {};
        files.forEach(f => initProgress[f.name] = 0);
        setUploadProgress(initProgress);

        let completed = 0;

        files.forEach(file => {
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    const current = prev[file.name] || 0;
                    if (current >= 100) {
                        clearInterval(interval);
                        return prev;
                    }
                    const next = Math.min(100, current + Math.random() * 15 + 5);
                    if (next === 100) {
                        completed++;
                        checkDone();
                    }
                    return { ...prev, [file.name]: next };
                });
            }, 300);
        });

        const checkDone = () => {
            if (completed >= files.length) {
                setTimeout(() => {
                    const result: UploadBatchResult = {
                        mode: uploadMode,
                        mainMetadata: uploadMode === 'versions' ? mainMeta : undefined,
                        items: files.map(f => ({
                            file: f,
                            customMeta: fileMeta[f.name]
                        }))
                    };
                    onUpload(result);
                }, 800);
            }
        };
    };

    // --- Renders ---

    // 1. Drop Zone (Default)
    if (stage === 'drop') {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
                <div className="bg-[#0c0c0e] w-full max-w-2xl rounded-[32px] border border-white/5 relative p-8">
                    <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    <h2 className="text-2xl font-black text-white uppercase text-center mb-8">Upload Manager</h2>
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${isDragOver ? 'border-[#ff5500] bg-[#ff5500]/10' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input ref={fileInputRef} type="file" multiple accept="audio/*" className="hidden" onChange={handleFileSelect} />
                        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 shadow-xl">
                            <svg className="w-8 h-8 text-[#ff5500]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        <p className="font-bold text-white text-lg">Drag & Drop Tracks</p>
                        <p className="text-zinc-500 text-sm mt-1">or click to browse</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#0c0c0e] w-full max-w-5xl h-[85vh] rounded-[32px] border border-white/5 flex flex-col shadow-2xl relative overflow-hidden">

                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 bg-zinc-900/30 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#ff5500] flex items-center justify-center font-black text-white">
                            {stage === 'uploading' ? <span className="animate-spin">⟳</span> : files.length}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">
                                {stage === 'uploading' ? 'Uploading...' : 'Review & Release'}
                            </h2>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{files.length} Files Selected</p>
                        </div>
                    </div>
                    {stage !== 'uploading' && (
                        <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5">
                            <button
                                onClick={() => setUploadMode('individual')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${uploadMode === 'individual' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Individual Releases
                            </button>
                            <button
                                onClick={() => setUploadMode('versions')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${uploadMode === 'versions' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Batch Versions
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                    {/* Versions Mode: Main Metadata */}
                    {uploadMode === 'versions' && stage === 'organize' && (
                        <div className="mb-8 p-6 bg-zinc-900/30 border border-white/5 rounded-3xl grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
                            <div className="relative group cursor-pointer" onClick={() => coverInputRef.current?.click()}>
                                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
                                <div className="aspect-square rounded-2xl bg-zinc-900 border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center overflow-hidden hover:border-[#ff5500] transition-colors">
                                    {mainMeta.coverFile ? (
                                        <img src={URL.createObjectURL(mainMeta.coverFile)} className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <svg className="w-8 h-8 text-zinc-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest text-center px-4">Upload Cover</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-white font-bold mb-2">Main Release Info</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Release Title"
                                        value={mainMeta.title}
                                        onChange={e => setMainMeta(p => ({ ...p, title: e.target.value }))}
                                        className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:border-[#ff5500] outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Main Artist"
                                        value={mainMeta.artist}
                                        onChange={e => setMainMeta(p => ({ ...p, artist: e.target.value }))}
                                        className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:border-[#ff5500] outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Genre"
                                        value={mainMeta.genre}
                                        onChange={e => setMainMeta(p => ({ ...p, genre: e.target.value }))}
                                        className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:border-[#ff5500] outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description (Optional)"
                                        value={mainMeta.description}
                                        onChange={e => setMainMeta(p => ({ ...p, description: e.target.value }))}
                                        className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:border-[#ff5500] outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* File List */}
                    <div className="space-y-3">
                        {files.map((file, idx) => {
                            const meta = fileMeta[file.name] || {};
                            const progress = uploadProgress[file.name] || 0;
                            const isDone = progress === 100;

                            if (stage === 'uploading') {
                                return (
                                    <div key={idx} className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 text-white font-bold">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-white font-bold text-sm truncate">{file.name}</span>
                                                <span className="text-[#ff5500] font-mono text-xs">{Math.round(progress)}%</span>
                                            </div>
                                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-300 ${isDone ? 'bg-green-500' : 'bg-[#ff5500]'}`} style={{ width: `${progress}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={idx} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 animate-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 text-xs font-bold text-zinc-500 mt-2">
                                            {idx + 1}
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{file.name}</span>
                                                <button onClick={() => removeFile(file.name)} className="text-zinc-600 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} /></svg></button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                                {/* If Individual: Title & Artist. If Version: Version Name */}
                                                <div className={`${uploadMode === 'individual' ? 'md:col-span-5' : 'md:col-span-8'}`}>
                                                    <input
                                                        type="text"
                                                        placeholder={uploadMode === 'individual' ? "Track Title" : "Version Name (e.g. Extended Mix)"}
                                                        value={meta.title}
                                                        onChange={e => updateFileMeta(file.name, 'title', e.target.value)}
                                                        className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#ff5500] outline-none"
                                                    />
                                                </div>

                                                {uploadMode === 'individual' && (
                                                    <div className="md:col-span-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Artist"
                                                            value={meta.artist}
                                                            onChange={e => updateFileMeta(file.name, 'artist', e.target.value)}
                                                            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#ff5500] outline-none"
                                                        />
                                                    </div>
                                                )}

                                                <div className={`${uploadMode === 'individual' ? 'md:col-span-3' : 'md:col-span-4'} flex gap-3`}>
                                                    <input
                                                        type="text"
                                                        placeholder="BPM"
                                                        value={meta.bpm}
                                                        onChange={e => updateFileMeta(file.name, 'bpm', e.target.value)}
                                                        className="w-1/2 bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#ff5500] outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Key"
                                                        value={meta.key}
                                                        onChange={e => updateFileMeta(file.name, 'key', e.target.value)}
                                                        className="w-1/2 bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#ff5500] outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-zinc-900/30 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} disabled={stage === 'uploading'} className="px-6 py-3 rounded-xl font-bold uppercase text-[11px] tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50">
                        Cancel
                    </button>
                    {stage === 'organize' && (
                        <button
                            onClick={startUpload}
                            className="bg-[#ff5500] text-white px-8 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl"
                        >
                            Start Upload
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
