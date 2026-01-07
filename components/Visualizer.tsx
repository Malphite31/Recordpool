
import React, { useRef, useEffect, useState } from 'react';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  volume: number;
  onVolumeChange: (val: number) => void;
}

const Visualizer: React.FC<VisualizerProps> = ({ analyser, isPlaying, volume, onVolumeChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastLevels = useRef<number[]>([0, 0]);
  const peakHold = useRef<number[]>([0, 0]);
  const peakTime = useRef<number[]>([0, 0]);
  const [isDragging, setIsDragging] = useState(false);

  const handleInteraction = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    onVolumeChange(x / rect.width);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleInteraction(e.clientX);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handleInteraction(e.clientX);
    };
    const onMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      // Ensure dimensions are valid before setting
      if (rect.width > 0 && rect.height > 0 && (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr)) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
      }
      return rect;
    };

    const bufferLength = analyser ? analyser.fftSize : 256;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      const rect = updateSize();
      if (rect.height <= 0 || rect.width <= 0) return;
      
      let rms = 0;
      if (analyser && isPlaying) {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = (dataArray[i] - 128) / 128.0;
          sum += val * val;
        }
        rms = Math.sqrt(sum / bufferLength);
        rms = Math.min(1.0, rms * 4.2); 
      }

      lastLevels.current = lastLevels.current.map((l, i) => {
        const attack = 0.35; 
        const release = 0.1;
        const level = isPlaying 
          ? l + (rms - l) * (rms > l ? attack : release) 
          : Math.max(0, l * 0.82 - 0.005);
        
        if (level > peakHold.current[i]) {
          peakHold.current[i] = level;
          peakTime.current[i] = Date.now();
        } else if (Date.now() - peakTime.current[i] > 1000) {
          peakHold.current[i] = Math.max(0, peakHold.current[i] * 0.94 - 0.004);
        }
        
        return level;
      });

      ctx.clearRect(0, 0, rect.width, rect.height);

      const segments = 44; 
      const spacing = 1.2;
      const verticalGap = 4;
      const chHeight = (rect.height / 2) - (verticalGap / 2);
      const segmentWidth = (rect.width - (segments * spacing)) / segments;

      const drawChannel = (yOffset: number, levelIdx: number, label: string) => {
        const currentLevel = lastLevels.current[levelIdx];
        const peakLevel = peakHold.current[levelIdx];
        const activeSegments = Math.round(currentLevel * segments);
        const peakSegment = Math.round(peakLevel * segments);

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.font = 'bold 7px "Outfit"';
        ctx.fillText(label, 0, yOffset + chHeight - 1);

        for (let i = 0; i < segments; i++) {
          const x = i * (segmentWidth + spacing);
          const barPos = i / segments;
          const isActive = i < activeSegments;
          const isPeak = i === peakSegment - 1 && peakLevel > 0.02;

          let color = '#10b981'; // Green
          if (barPos > 0.72) color = '#fbbf24'; // Amber
          if (barPos > 0.92) color = '#ef4444'; // Red

          if (isActive) {
            ctx.fillStyle = color;
            if (i === activeSegments - 1) {
              ctx.shadowBlur = 5;
              ctx.shadowColor = color;
            }
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.shadowBlur = 0;
          }

          ctx.fillRect(x, yOffset, segmentWidth, chHeight);
          ctx.shadowBlur = 0;

          if (isPeak && !isActive) {
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(x, yOffset, 1.5, chHeight);
            ctx.globalAlpha = 1.0;
          }
        }
      };

      drawChannel(0, 0, 'L'); 
      drawChannel(chHeight + verticalGap, 1, 'R');

      // Fader Track Line
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.fillRect(0, rect.height/2 - 0.5, rect.width, 1);

      // Volume Fader Handle
      const faderX = Math.max(5, Math.min(rect.width - 5, volume * rect.width));
      const faderWidth = 10;
      const faderHeight = rect.height;
      
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.fillStyle = '#2d2d30';
      
      // Manually draw round rect for fader cap
      const r = 2;
      const fx = faderX - faderWidth/2;
      const fy = 0;
      const fw = faderWidth;
      const fh = faderHeight;
      ctx.beginPath();
      ctx.moveTo(fx + r, fy);
      ctx.lineTo(fx + fw - r, fy);
      ctx.quadraticCurveTo(fx + fw, fy, fx + fw, fy + r);
      ctx.lineTo(fx + fw, fy + fh - r);
      ctx.quadraticCurveTo(fx + fw, fy + fh, fx + fw - r, fy + fh);
      ctx.lineTo(fx + r, fy + fh);
      ctx.quadraticCurveTo(fx, fy + fh, fx, fy + fh - r);
      ctx.lineTo(fx, fy + r);
      ctx.quadraticCurveTo(fx, fy, fx + r, fy);
      ctx.closePath();
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Grip notch
      ctx.fillStyle = '#ff5500';
      ctx.fillRect(faderX - 0.5, 3, 1, fh - 6);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, isPlaying, volume]);

  return (
    <div className="flex flex-col h-full w-full group cursor-ew-resize select-none overflow-hidden">
      <div className="flex justify-between items-center mb-1 px-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-1.5">
          <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest font-outfit">Out Meter</span>
          <div className={`w-1 h-1 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-zinc-800'}`} />
        </div>
        <span className="text-[8px] font-black text-white/50 uppercase tracking-tighter font-mono">
          {Math.round(volume * 100)}%
        </span>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <canvas 
          ref={canvasRef} 
          onMouseDown={onMouseDown}
          className="w-full h-full touch-none"
        />
      </div>
    </div>
  );
};

export default Visualizer;
