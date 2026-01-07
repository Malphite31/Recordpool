
import React from 'react';
import { Track } from '../types';

interface GenresViewProps {
    tracks: Track[];
    onSelectGenre: (genre: string) => void;
    onBack: () => void;
}

const GenresView: React.FC<GenresViewProps> = ({ tracks, onSelectGenre, onBack }) => {
    const genres = Array.from(new Set(tracks.map(t => t.genre))).map(genreName => {
        return {
            name: genreName,
            count: tracks.filter(t => t.genre === genreName).length
        };
    });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 pb-32 px-4 md:px-0">
            <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-white/5 pb-6">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Genres</h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {genres.map((genre, idx) => (
                    <div
                        key={idx}
                        onClick={() => onSelectGenre(genre.name)}
                        className="bg-zinc-900/40 border border-white/5 hover:border-[#ff5500]/50 hover:bg-zinc-900 p-8 rounded-[32px] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group hover:-translate-y-1"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#ff5500]/10 flex items-center justify-center mb-4 group-hover:bg-[#ff5500] transition-colors duration-300">
                            <svg className="w-6 h-6 text-[#ff5500] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" strokeWidth={2} /></svg>
                        </div>
                        <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">{genre.name}</h3>
                        <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest">{genre.count} Tracks</span>
                    </div>
                ))}
            </div>

            <button
                onClick={onBack}
                className="hidden md:flex fixed top-24 right-8 z-[60] w-12 h-12 bg-black/50 backdrop-blur-xl rounded-full border border-white/10 text-white items-center justify-center hover:bg-[#ff5500] transition-all shadow-2xl group"
            >
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth={2.5} /></svg>
            </button>
        </div>
    );
};

export default GenresView;
