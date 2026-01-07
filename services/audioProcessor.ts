
export const extractPeaks = async (audioUrl: string, samples: number = 240): Promise<number[]> => {
  try {
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    
    const channelData = audioBuffer.getChannelData(0);
    const step = Math.ceil(channelData.length / samples);
    const peaks: number[] = [];

    // Use Root Mean Square (RMS) for a "smoother", more realistic waveform shape
    for (let i = 0; i < samples; i++) {
      let sum = 0;
      const start = i * step;
      const end = Math.min(start + step, channelData.length);
      for (let j = start; j < end; j++) {
        sum += channelData[j] * channelData[j];
      }
      peaks.push(Math.sqrt(sum / (end - start)));
    }
    
    // Normalize to a pleasant range (0.1 to 0.9) to ensure it looks "full" but not clipped
    const maxPeak = Math.max(...peaks);
    if (maxPeak === 0) return Array.from({ length: samples }, () => 0.1);
    
    return peaks.map(p => (p / maxPeak) * 0.85 + 0.05);
  } catch (error) {
    console.error("Peak extraction failed, falling back to mock:", error);
    // Return more "realistic" mock peaks with variance
    return Array.from({ length: samples }, (_, i) => {
      const base = Math.sin(i / 10) * 0.2 + 0.4;
      return base + Math.random() * 0.3;
    });
  }
};
