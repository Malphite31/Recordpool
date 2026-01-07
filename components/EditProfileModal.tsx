import React, { useState, useRef } from 'react';
import ImageCropperModal from './ImageCropperModal';

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
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [croppingTarget, setCroppingTarget] = useState<'avatar' | 'header' | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, target: 'avatar' | 'header') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCropperImage(reader.result as string);
        setCroppingTarget(target);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    if (croppingTarget) {
      setFormData(prev => ({
        ...prev,
        [croppingTarget === 'avatar' ? 'avatarUrl' : 'headerUrl']: croppedImage
      }));
    }
    closeCropper();
  };

  const closeCropper = () => {
    setShowCropper(false);
    setCropperImage(null);
    setCroppingTarget(null);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
    if (headerInputRef.current) headerInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-[#0c0c0e] w-full max-w-lg p-0 rounded-3xl border border-white/5 relative shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
            <div>
              <h3 className="text-xl font-bold text-white">Edit Profile</h3>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Customize your identity</p>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="overflow-y-auto p-8 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-8">

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Cover Photo</label>
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/10 group bg-zinc-900">
                    <img src={formData.headerUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => headerInputRef.current?.click()}
                        className="bg-black/50 hover:bg-[#ff5500] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider backdrop-blur-sm transition-all border border-white/10"
                      >
                        Change Cover
                      </button>
                      <input
                        ref={headerInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'header')}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group bg-zinc-900 shrink-0">
                    <img src={formData.avatarUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100"
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </button>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'avatar')}
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-sm font-bold text-white">Profile Photo</h4>
                    <p className="text-xs text-zinc-500">Recommended 500x500px. JPG or PNG.</p>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="text-[#ff5500] text-xs font-bold uppercase tracking-wide hover:text-[#ff7733]"
                    >
                      Upload New
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-5 border-t border-white/5 pt-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Display Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff5500] transition-all font-bold"
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
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff5500] transition-all resize-none text-sm"
                    placeholder="Tell the pool about your sound..."
                  />
                </div>
              </div>

            </form>
          </div>

          <div className="p-6 border-t border-white/5 bg-zinc-900/30 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-xl border border-white/10 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-4 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:brightness-90 active:scale-95 transition-all shadow-xl"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {showCropper && cropperImage && (
        <ImageCropperModal
          imageSrc={cropperImage}
          aspectRatio={croppingTarget === 'avatar' ? 1 : 3}
          onCancel={closeCropper}
          onCropComplete={handleCropComplete}
          title={croppingTarget === 'avatar' ? "Crop Profile Photo" : "Crop Cover Photo"}
        />
      )}
    </>
  );
};

export default EditProfileModal;
