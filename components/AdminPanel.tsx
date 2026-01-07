
import React, { useState } from 'react';
import { Track } from '../types';

interface AdminPanelProps {
    tracks: Track[];
    onDeleteTrack: (id: string) => void;
    onEditTrack: (track: Track) => void;
    onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ tracks, onDeleteTrack, onEditTrack, onClose }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tracks'>('dashboard');

    // Simple stats
    const totalUsers = 1240; // Mock
    const activeNow = 42;
    const storageUsed = '45.2 GB';
    const totalTracks = tracks.length;

    return (
        <div className="flex bg-[#0c0c0e] min-h-screen text-white animate-in fade-in duration-300">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/5 bg-zinc-950 p-6 flex flex-col gap-6 shrink-0 relative z-20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#ff5500] rounded-xl flex items-center justify-center font-black text-black">A</div>
                    <div>
                        <h2 className="font-bold text-lg leading-none">Admin</h2>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Control Center</span>
                    </div>
                </div>

                <nav className="space-y-2">
                    {['dashboard', 'users', 'tracks'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm tracking-wide uppercase transition-all ${activeTab === tab ? 'bg-[#ff5500] text-white shadow-lg shadow-[#ff5500]/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto">
                    <button
                        onClick={onClose}
                        className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm tracking-wide uppercase text-zinc-500 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Exit Admin
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto max-h-screen">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black uppercase tracking-tight">{activeTab}</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 bg-white/5 px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Systems Operational
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
                            <img src="https://picsum.photos/seed/admin/200" className="w-full h-full rounded-full object-cover" />
                        </div>
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard label="Total Users" value={totalUsers.toLocaleString()} trend="+12%" />
                            <StatCard label="Total Tracks" value={totalTracks.toString()} trend="+5%" />
                            <StatCard label="Active Now" value={activeNow.toString()} trend="stable" />
                            <StatCard label="Storage" value={storageUsed} trend="warning" />
                        </div>

                        {/* Visualizations (Mock) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-zinc-900/50 border border-white/5 rounded-3xl p-6 h-80 flex flex-col">
                                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Traffic Overview</h3>
                                <div className="flex-1 flex items-end gap-2 px-2">
                                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95, 80, 60, 85].map((h, i) => (
                                        <div key={i} className="flex-1 bg-[#ff5500]" style={{ height: `${h}%`, opacity: 0.3 + (i / 20) }}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 h-80 flex flex-col">
                                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Device Usage</h3>
                                <div className="flex-1 flex items-center justify-center relative">
                                    <div className="w-40 h-40 rounded-full border-8 border-zinc-800 relative">
                                        <div className="absolute inset-0 border-8 border-transparent border-t-[#ff5500] border-r-[#ff5500] rounded-full rotate-45"></div>
                                    </div>
                                    <div className="absolute text-center">
                                        <span className="block text-2xl font-bold">62%</span>
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Mobile</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-xs uppercase font-bold text-zinc-500 tracking-widest">
                                <tr>
                                    <th className="p-4 pl-6">User</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Joined</th>
                                    <th className="p-4 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 pl-6 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
                                            <span className="font-bold text-sm">User {i}</span>
                                        </td>
                                        <td className="p-4 text-xs font-bold text-zinc-400">DJ / Producer</td>
                                        <td className="p-4"><span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">Active</span></td>
                                        <td className="p-4 text-xs text-zinc-500 font-mono">2026-01-0{i}</td>
                                        <td className="p-4 text-right pr-6">
                                            <button className="text-zinc-500 hover:text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'tracks' && (
                    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-xs uppercase font-bold text-zinc-500 tracking-widest">
                                <tr>
                                    <th className="p-4 pl-6">Track</th>
                                    <th className="p-4">Artist</th>
                                    <th className="p-4">Stats</th>
                                    <th className="p-4 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {tracks.map(track => (
                                    <tr key={track.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 pl-6 flex items-center gap-3">
                                            <img src={track.coverUrl} className="w-10 h-10 rounded-lg object-cover" />
                                            <div>
                                                <div className="font-bold text-sm text-white">{track.title}</div>
                                                <div className="text-[10px] text-zinc-500 font-mono">{track.id}</div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-zinc-300">{track.artist}</td>
                                        <td className="p-4 text-xs text-zinc-500">
                                            <div className="flex gap-3">
                                                <span>{track.plays || 0} Runs</span>
                                                <span>{track.downloadCount} DLs</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => onEditTrack(track)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-all">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </button>
                                                <button onClick={() => onDeleteTrack(track.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-all">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ label, value, trend }: { label: string, value: string, trend: string }) => (
    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{label}</span>
        <div className="flex items-end justify-between">
            <span className="text-3xl font-black text-white">{value}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-md ${trend.includes('+') ? 'bg-green-500/10 text-green-500' : trend === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-white/5 text-zinc-400'}`}>
                {trend}
            </span>
        </div>
    </div>
);

export default AdminPanel;
