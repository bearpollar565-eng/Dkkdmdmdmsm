export interface Episode {
  title: string;
  duration?: string;
  url?: string;
}

export interface SeasonEpisodes {
  [episodeIndex: string]: Episode;
}

export interface Seasons {
  [seasonNumber: string]: Episode[];
}

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  type: 'movie' | 'series';
  poster: string;
  backdrop: string;
  logo?: string;
  defaultUrl: string;
  trailer?: string;
  year?: string | number;
  genre: string;
  isPromo?: boolean;
  addedAt?: number;
  seasons?: Seasons;
}

export interface ContinueWatchingItem {
  id: string;
  title: string;
  type: 'movie' | 'series';
  poster: string;
  url: string;
  currentTime: number;
  duration: number;
  percentage: number;
  updatedAt: number;
  seasonNumber?: number;
  episodeIndex?: number;
}

export interface RecommendedItem extends MediaItem {
  matchScore: number;
  reason: string;
}

export interface CastDevice {
  id: string;
  name: string;
  type: 'tv' | 'chromecast' | 'nest' | 'projector' | 'apple_tv' | 'roku' | 'fire_stick';
  status: 'offline' | 'idle' | 'connecting' | 'connected';
}

export interface UserProfile {
  id: string;
  name: string;
  avatarGradient: string;
  avatarLetter: string;
  isKids?: boolean;
}

export type TabType = 'home' | 'search' | 'myspace';
export type FilterType = 'All' | 'Movies' | 'TV';

