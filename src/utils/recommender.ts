import { MediaItem, ContinueWatchingItem, RecommendedItem } from '../types';

/**
 * Highly polished Recommendation Engine.
 * Analyzes the user's viewing history (continueWatching) and preferences (wishlist)
 * to calculate personalized relevance match scores and contextual reasons.
 */
export function generateRecommendations(
  allMedia: MediaItem[],
  continueWatching: ContinueWatchingItem[],
  wishlist: Set<string>
): RecommendedItem[] {
  if (!allMedia || allMedia.length === 0) return [];

  // 1. Gather interactive signal histories
  const watchedIds = new Set(continueWatching.map(item => item.id));
  const wishlistIds = Array.from(wishlist);

  // Extract all genres interacted with
  const interactedGenres: {[genre: string]: number} = {};
  let movieInteractionCount = 0;
  let seriesInteractionCount = 0;

  // Process continue watching history weights
  continueWatching.forEach(item => {
    // Extract base ID for episode tracking strings like dune_2_s1_e1
    const baseId = item.id.includes('_s') ? item.id.split('_')[0] : item.id;
    const parentMedia = allMedia.find(m => m.id === baseId);
    if (parentMedia) {
      if (parentMedia.type === 'movie') movieInteractionCount += 2;
      else seriesInteractionCount += 2;

      const genres = (parentMedia.genre || '').split(',').map(g => g.trim().toLowerCase());
      genres.forEach(g => {
        if (g) interactedGenres[g] = (interactedGenres[g] || 0) + 3;
      });
    }
  });

  // Process watchlist preferences weights
  wishlistIds.forEach(id => {
    const mediaItem = allMedia.find(m => m.id === id);
    if (mediaItem) {
      if (mediaItem.type === 'movie') movieInteractionCount += 1;
      else seriesInteractionCount += 1;

      const genres = (mediaItem.genre || '').split(',').map(g => g.trim().toLowerCase());
      genres.forEach(g => {
        if (g) interactedGenres[g] = (interactedGenres[g] || 0) + 2;
      });
    }
  });

  const preferredType = movieInteractionCount >= seriesInteractionCount ? 'movie' : 'series';

  // 2. Score candidate items
  const candidates: RecommendedItem[] = [];

  allMedia.forEach(item => {
    // Skip if already in Continue Watching, unless progress is small (<15%) or not started
    const watchHistory = continueWatching.find(w => {
      const baseId = w.id.includes('_s') ? w.id.split('_')[0] : w.id;
      return baseId === item.id;
    });
    if (watchHistory && watchHistory.percentage > 85) {
      return; // Skip fully watched items
    }

    let score = 50; // Baseline score
    let matchedGenreName = '';
    let maxGenreWeight = 0;

    // Weight based on genre alignment
    const itemGenres = (item.genre || '').split(',').map(g => g.trim().toLowerCase());
    itemGenres.forEach(g => {
      if (g && interactedGenres[g]) {
        score += interactedGenres[g] * 4;
        if (interactedGenres[g] > maxGenreWeight) {
          maxGenreWeight = interactedGenres[g];
          matchedGenreName = g;
        }
      }
    });

    // Weight in-progress or bookmarked types
    if (item.type === preferredType) {
      score += 15;
    }

    // Boost promo spotlight items slightly
    if (item.isPromo) {
      score += 10;
    }

    // Boost bookmarked watchlist items
    const onWatchlist = wishlist.has(item.id);
    if (onWatchlist) {
      score += 20;
    }

    // 3. Formulate custom smart contextual reasons
    let reason = "Popular trending blockbuster matches your profile";
    if (onWatchlist) {
      reason = "Bookmarked on your custom watchlist";
    } else if (matchedGenreName) {
      const formattedGenre = matchedGenreName.replace(/\b\w/g, c => c.toUpperCase());
      reason = `Recommended because you enjoy ${formattedGenre}`;
    } else if (item.type === preferredType && preferredType === 'series') {
      reason = "Binge-worthy series based on your streaming habits";
    } else if (item.type === preferredType && preferredType === 'movie') {
      reason = "Similar premium movie selection chosen for you";
    }

    // Cap the finalized match score to look natural (e.g. 78% to 98% match)
    const matchScore = Math.min(99, Math.max(76, Math.round(75 + (score / (score + 100)) * 24)));

    candidates.push({
      ...item,
      matchScore,
      reason
    });
  });

  // Sort candidates by matchScore descending
  candidates.sort((a, b) => b.matchScore - a.matchScore);

  // Return top 8 candidates
  return candidates.slice(0, 8);
}
