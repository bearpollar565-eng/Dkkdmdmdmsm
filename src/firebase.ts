import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';
import { MediaItem, ContinueWatchingItem, UserProfile } from './types';

const firebaseConfig = {
  apiKey: "", // Left blank as in user's example, since public RTDB doesn't strictly enforce it for reads
  databaseURL: "https://mystream-5ce2d-default-rtdb.firebaseio.com",
  projectId: "mystream-5ce2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);

/**
 * Gets or dynamically registers a Client/Device session ID stored locally 
 * to segment and sync cloud entries securely.
 */
export function getOrCreateClientID(): string {
  try {
    let id = localStorage.getItem('starflix_client_id');
    if (!id) {
      id = "device_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('starflix_client_id', id);
    }
    return id;
  } catch (e) {
    return "device_fallback_session_99";
  }
}

/**
 * Syncs the user's complete continue watch array history to Firebase for a specific profile.
 */
export async function syncContinueWatchingToFirebase(clientId: string, profileId: string, items: ContinueWatchingItem[]): Promise<void> {
  try {
    const dbRef = ref(rtdb, `users/${clientId}/profiles/${profileId}/continueWatching`);
    await set(dbRef, items);
  } catch (error) {
    console.warn(`Failed to sync continue watching to Firebase for ${profileId}:`, error);
  }
}

/**
 * Fetches the user's continue watch progress records from Firebase database for a specific profile.
 */
export async function fetchContinueWatchingFromFirebase(clientId: string, profileId: string): Promise<ContinueWatchingItem[]> {
  try {
    const dbRef = ref(rtdb, `users/${clientId}/profiles/${profileId}/continueWatching`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val() || [];
    }
  } catch (error) {
    console.warn(`Failed to fetch continue watching from Firebase for ${profileId}:`, error);
  }
  return [];
}

/**
 * Syncs bookmarked watchlist items to the user profile database node for a specific profile.
 */
export async function syncWishlistToFirebase(clientId: string, profileId: string, wishlistIds: string[]): Promise<void> {
  try {
    const dbRef = ref(rtdb, `users/${clientId}/profiles/${profileId}/wishlist`);
    await set(dbRef, wishlistIds);
  } catch (error) {
    console.warn(`Failed to sync watchlist to Firebase for ${profileId}:`, error);
  }
}

/**
 * Fetches bookmarked watchlist elements for a specific profile.
 */
export async function fetchWishlistFromFirebase(clientId: string, profileId: string): Promise<string[]> {
  try {
    const dbRef = ref(rtdb, `users/${clientId}/profiles/${profileId}/wishlist`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val() || [];
    }
  } catch (error) {
    console.warn(`Failed to fetch watchlist from Firebase for ${profileId}:`, error);
  }
  return [];
}

/**
 * Syncs the device/client profiles list to Firebase.
 */
export async function syncProfilesToFirebase(clientId: string, profiles: UserProfile[]): Promise<void> {
  try {
    const dbRef = ref(rtdb, `users/${clientId}/profilesList`);
    await set(dbRef, profiles);
  } catch (error) {
    console.warn('Failed to sync profiles list in Firebase:', error);
  }
}

/**
 * Fetches the list of device/client profiles from Firebase.
 */
export async function fetchProfilesFromFirebase(clientId: string): Promise<UserProfile[]> {
  try {
    const dbRef = ref(rtdb, `users/${clientId}/profilesList`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val() || [];
    }
  } catch (error) {
    console.warn('Failed to fetch profiles list from Firebase:', error);
  }
  return [];
}

/**
 * Fetches content dynamically from the Firebase Realtime Database 'content' node.
 */
export async function fetchContentFromFirebase(): Promise<MediaItem[]> {
  try {
    const dbRef = ref(rtdb, 'content');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.entries(data).map(([id, d]: [string, any]) => {
        // Normalize fields to conform to our MediaItem interface
        return {
          id,
          title: d.title || 'Unknown Title',
          description: d.description || d.synopsis || '',
          type: d.type || 'movie',
          poster: d.poster || d.posterUrl || '',
          backdrop: d.backdrop || d.backdropUrl || '',
          logo: d.logoUrl || d.logo || '',
          defaultUrl: d.url || d.videoUrl || '',
          trailer: d.trailer || d.trailerUrl || '',
          year: d.year || '2026',
          genre: d.genre || 'Action, Drama',
          isPromo: d.isPromo || false,
          addedAt: d.addedAt || 0,
          seasons: d.seasons || undefined
        };
      });
    }
  } catch (error) {
    console.error('Failed to load data from Firebase RTDB:', error);
  }
  return [];
}
export default app;
