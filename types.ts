
export interface TrackVersion {
  id: string;
  name: string; // e.g., "Extended Mix", "Radio Edit", "Instrumental", "Acapella"
  audioUrl: string;
  duration: string;
  format: 'MP3' | 'WAV' | 'AIFF';
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artist: string;
  album?: string;
  artistBio?: string;
  artistAvatarUrl?: string;
  artistHeaderUrl?: string;
  bpm: number;
  key: string;
  genre: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
  downloadCount: number;
  likeCount?: number;
  isLiked?: boolean;
  repostCount?: number;
  plays?: number;
  versions?: TrackVersion[];
  peaks?: number[]; // Pre-computed or mock peak heights for SoundCloud-style waveform
  versionId?: string;
  format?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
  trackIds: string[];
  createdAt: number;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
}

export enum Genre {
  HOUSE = 'House',
  TECHNO = 'Techno',
  HIP_HOP = 'Hip Hop',
  DRUM_BASS = 'D&B',
  TECH_HOUSE = 'Tech House',
  AFROBEAT = 'Afrobeat',
}
