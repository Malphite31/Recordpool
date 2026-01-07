
import React, { useState, useCallback } from 'react';

interface UploadModalProps {
    onClose: () => void;
    onUpload: (files: File[]) => void;
}

interface FileItem {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    id: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
    const [fileList, setFileList] = useState<FileItem[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            addFiles(selectedFiles);
        }
    };

    const addFiles = (files: File[]) => {
        const newItems = files.map(file => ({
            file,
            progress: 0,
            status: 'pending' as const,
            id: Math.random().toString(36).substring(7)
        }));
        setFileList(prev => [...prev, ...newItems]);
    };

    const removeFile = (id: string) => {
        setFileList(prev => prev.filter(item => item.id !== id));
    };

    const startUpload = () => {
        setFileList(prev => prev.map(item => ({ ...item, status: 'uploading' })));

        let completedCount = 0;
        const totalFiles = fileList.length;

        fileList.forEach(item => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setFileList(prev => {
                        const updated = prev.map(f => f.id === item.id ? { ...f, progress: 100, status: 'completed' as const } : f);
                        return updated;
                    });

                    completedCount++;
                    if (completedCount === totalFiles) {
                        setTimeout(() => {
                            onUpload(fileList.map(f => f.file));
                        }, 500);
                    }
                } else {
                    setFileList(prev => prev.map(f => f.id === item.id ? { ...f, progress } : f));
                }
            }, 200);
        });
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-zinc-950 border border-white/10 w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-zinc-900/50">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#ff5500] flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </div>
                        Upload Tracks
                    </h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Drag Drop Area */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center py-12 px-4 text-center cursor-pointer group ${isDragOver ? 'border-[#ff5500] bg-[#ff5500]/5' : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40'}`}
                    >
                        <input type="file" multiple className="hidden" id="file-upload" onChange={handleFileSelect} />
                        <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full h-full">
                            <div className={`w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 shadow-xl ${isDragOver ? 'text-[#ff5500]' : 'text-zinc-500'}`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1">Drag & Drop files here</h3>
                            <p className="text-zinc-500 text-sm font-medium">or click to browse your computer</p>
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">MP3</span>
                                <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">WAV</span>
                                <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">AIFF</span>
                            </div>
                        </label>
                    </div>

                    {/* File List */}
                    {fileList.length > 0 && (
                        <div className="mt-8 space-y-3">
                            <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest px-2 mb-2">Upload Queue ({fileList.length})</h4>
                            {fileList.map((item) => (
                                <div key={item.id} className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom-2">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-sm font-bold text-white truncate pr-4">{item.file.name}</span>
                                            <span className="text-[10px] font-mono text-zinc-500">{(item.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                        </div>

                                        {/* Progress Bar Container */}
                                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 rounded-full ${item.status === 'completed' ? 'bg-green-500' : 'bg-[#ff5500]'}`}
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(item.id)}
                                        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/5 bg-zinc-900/30 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold uppercase text-[11px] tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={startUpload}
                        disabled={fileList.length === 0}
                        className="bg-[#ff5500] text-white px-8 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {fileList.some(i => i.status === 'uploading') ? 'Uploading...' : 'Start Upload'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UploadModal;
