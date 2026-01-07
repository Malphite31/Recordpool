
import React, { useRef, useEffect, useState } from 'react';

interface WaveformVisualizerProps {
  peaks: number[];
  progress: number; // 0 to 1
  onSeek: (progress: number) => void;
  isPlaying: boolean;
  analyser: AnalyserNode | null;
  duration?: string;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ peaks, progress, onSeek, isPlaying, analyser, duration }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState('0:00');

  useEffect(() => {
    const audioEl = document.querySelector('audio');
    if (!audioEl) return;
    const updateTime = () => {
      const min = Math.floor(audioEl.currentTime / 60);
      const sec = Math.floor(audioEl.currentTime % 60);
      setCurrentTime(`${min}:${sec.toString().padStart(2, '0')}`);
    };
    audioEl.addEventListener('timeupdate', updateTime);
    return () => audioEl.removeEventListener('timeupdate', updateTime);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const barWidth = 2; 
      const barSpacing = 1;
      const totalBarWidth = barWidth + barSpacing;
      
      // We want to use as many peaks as we have or as many as fit
      const displayPeaks = peaks.length > 0 ? peaks : Array(100).fill(0.2);
      const step = displayPeaks.length / (rect.width / totalBarWidth);
      
      const centerY = rect.height * 0.65; 
      const gap = 2; 

      for (let i = 0; i < rect.width / totalBarWidth; i++) {
        const x = i * totalBarWidth;
        const peakIndex = Math.floor(i * step);
        const peak = displayPeaks[peakIndex] || 0.1;
        const barProgress = i / (rect.width / totalBarWidth);
        
        const h = peak * (rect.height * 0.8);
        const isPlayed = barProgress <= progress;
        const isHovered = hoverProgress !== null && barProgress <= hoverProgress;

        if (isHovered && !isPlayed) {
          ctx.fillStyle = '#ff9966'; 
        } else if (isPlayed) {
          ctx.fillStyle = '#ff5500'; 
        } else {
          ctx.fillStyle = '#ffffff'; 
        }

        // Top main bars
        const topH = h * 0.75;
        ctx.fillRect(x, centerY - topH, barWidth, topH);
        
        // Reflection
        const bottomH = h * 0.25;
        ctx.globalAlpha = isPlayed ? 0.5 : 0.2;
        ctx.fillRect(x, centerY + gap, barWidth, bottomH);
        ctx.globalAlpha = 1.0;
      }
    };

    draw();
  }, [peaks, progress, hoverProgress]);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = clientX - rect.left;
    onSeek(Math.max(0, Math.min(1, x / rect.width)));
  };

  return (
    <div 
      className="relative w-full h-full cursor-pointer group select-none"
      onMouseMove={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) setHoverProgress((e.clientX - rect.left) / rect.width);
      }}
      onMouseLeave={() => setHoverProgress(null)}
      onClick={handleInteraction}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Current Time Badge */}
      <div 
        className="absolute bottom-2 z-10 px-1 bg-black text-[10px] font-bold text-[#ff5500] pointer-events-none"
        style={{ left: `${progress * 100}%`, transform: 'translateX(-50%)' }}
      >
        {currentTime}
      </div>

      {/* Duration Badge */}
      {duration && (
        <div className="absolute bottom-2 right-2 z-10 px-1 bg-black text-[10px] font-bold text-white pointer-events-none">
          {duration}
        </div>
      )}

      {/* Playhead Marker */}
      <div 
        className="absolute top-0 bottom-0 w-[1px] bg-[#ff5500] pointer-events-none"
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  );
};

export default WaveformVisualizer;
