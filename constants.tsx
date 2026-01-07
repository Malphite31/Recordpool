
import { Track } from './types';

const generateMockPeaks = (count: number) => 
  Array.from({ length: count }, () => Math.random() * 0.8 + 0.2);

export const INITIAL_TRACKS: Track[] = [
  {
    id: '1',
    artistId: 'art1',
    title: 'Neon Nights',
    artist: 'Cyber Pulse',
    artistBio: 'Cyber Pulse is a synth-wave and tech-house producer based in Berlin, known for neon-soaked melodies and driving rhythms.',
    artistAvatarUrl: 'https://picsum.photos/seed/cyberpulse/200/200',
    artistHeaderUrl: 'https://picsum.photos/seed/cyberheader/1200/400',
    bpm: 126,
    key: '4A',
    genre: 'Tech House',
    duration: '6:42',
    coverUrl: 'https://picsum.photos/seed/track1/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    downloadCount: 1240,
    peaks: generateMockPeaks(100),
    versions: [
      { id: 'v1-1', name: 'Extended Mix', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '6:42', format: 'WAV' },
      { id: 'v1-2', name: 'Radio Edit', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '3:30', format: 'MP3' },
      { id: 'v1-3', name: 'Instrumental', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '6:42', format: 'WAV' }
    ]
  },
  {
    id: '2',
    artistId: 'art2',
    title: 'Subterranean',
    artist: 'Deep State',
    artistBio: 'Deep State explores the boundaries of deep and melodic house, focusing on organic textures and hypnotic sub-bass.',
    artistAvatarUrl: 'https://picsum.photos/seed/deepstate/200/200',
    artistHeaderUrl: 'https://picsum.photos/seed/deepheader/1200/400',
    bpm: 124,
    key: '8B',
    genre: 'Deep House',
    duration: '7:15',
    coverUrl: 'https://picsum.photos/seed/track2/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    downloadCount: 890,
    peaks: generateMockPeaks(100),
    versions: [
      { id: 'v2-1', name: 'Original Mix', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '7:15', format: 'WAV' }
    ]
  },
  {
    id: '3',
    artistId: 'art3',
    title: 'Distortion Theory',
    artist: 'Signal Flow',
    bpm: 132,
    key: '1A',
    genre: 'Techno',
    duration: '5:58',
    coverUrl: 'https://picsum.photos/seed/track3/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    downloadCount: 2100,
    peaks: generateMockPeaks(100),
  }
];
