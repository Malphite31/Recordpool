
import React from 'react';
import { Track } from '../types';

interface ArtistsViewProps {
    tracks: Track[];
    onSelectArtist: (artistId: string) => void;
    onBack: () => void;
}

const ArtistsView: React.FC<ArtistsViewProps> = ({ tracks, onSelectArtist, onBack }) => {
    const artists = Array.from(new Set(tracks.map(t => t.artist))).map(artistName => {
        const artistTracks = tracks.filter(t => t.artist === artistName);
        return {
            id: artistTracks[0]?.artistId || 'unknown',
            name: artistName,
            count: artistTracks.length,
            avatar: artistTracks[0]?.artistAvatarUrl || `https://picsum.photos/seed/${artistName}/200/200`
        };
    });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 pb-32 px-4 md:px-0">
            <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-white/5 pb-6">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Artists</h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
                {artists.map((artist) => (
                    <div
                        key={artist.id}
                        onClick={() => onSelectArtist(artist.id)}
                        className="group cursor-pointer flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-500"
                    >
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-[6px] border-zinc-900 shadow-2xl group-hover:border-[#ff5500] transition-all duration-300 relative group-hover:scale-105">
                            <img src={artist.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={artist.name} />
                        </div>
                        <div>
                            <h3 className="text-white text-base md:text-xl font-black uppercase tracking-tight group-hover:text-[#ff5500] transition-colors">{artist.name}</h3>
                            <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest">{artist.count} Tracks</span>
                        </div>
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

export default ArtistsView;
