
import React, { useState } from 'react';

interface ProfileData {
  name: string;
  bio: string;
  avatarUrl: string;
  headerUrl: string;
}

interface EditProfileModalProps {
  profile: ProfileData;
  onSave: (updatedProfile: ProfileData) => void;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onSave, onClose }) => {
  const [formData, setFormData] = useState<ProfileData>(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c0c0e] w-full max-w-lg p-8 rounded-3xl border border-white/5 relative shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Edit Your Profile</h3>
          <p className="text-zinc-500 text-sm font-medium">Customize your presence in the VibePool.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Display Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff5500] transition-all"
                placeholder="Ex: Cyber Pulse"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Short Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff5500] transition-all resize-none"
                placeholder="Tell the pool about your sound..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Avatar Image URL</label>
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff5500] transition-all"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Header Image URL</label>
              <input
                type="text"
                name="headerUrl"
                value={formData.headerUrl}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff5500] transition-all"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-xl border border-white/10 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:brightness-90 active:scale-95 transition-all shadow-xl"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
