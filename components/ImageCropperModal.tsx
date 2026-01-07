
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/canvasUtils';

interface Point {
    x: number;
    y: number;
}

interface Area {
    width: number;
    height: number;
    x: number;
    y: number;
}

interface ImageCropperModalProps {
    imageSrc: string;
    aspectRatio: number; // e.g., 1 for square, 16/9 for header
    onCancel: () => void;
    onCropComplete: (croppedImage: string) => void;
    title?: string;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
    imageSrc,
    aspectRatio,
    onCancel,
    onCropComplete,
    title = "Adjust Image"
}) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropChange = (crop: Point) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (croppedAreaPixels) {
            try {
                const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
                onCropComplete(croppedImage);
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#0c0c0e] w-full max-w-2xl rounded-3xl border border-white/5 flex flex-col h-[80vh] md:h-[600px] overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-900/50 z-10">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
                    <button onClick={onCancel} className="text-zinc-500 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Cropper Container */}
                <div className="relative flex-1 bg-black w-full">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={onZoomChange}
                        style={{
                            containerStyle: { background: '#000' },
                            cropAreaStyle: { border: '2px solid #ff5500', boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)' }
                        }}
                    />
                </div>

                {/* Controls */}
                <div className="px-6 py-6 border-t border-white/5 bg-zinc-900/50 flex flex-col gap-4 z-10">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest shrink-0">Zoom</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff5500]"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 py-3 bg-[#ff5500] text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 shadow-lg active:scale-95 transition-all"
                        >
                            Apply Crop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;
