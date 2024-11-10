// LRU Cache Settings
const MAX_VOTE_CACHE = 30; // Maximum votes to cache in localStorage

export const loadVoteCache = (cacheKey) => {
	const cache = JSON.parse(localStorage.getItem(cacheKey) || '[]');
	return cache;
};

const saveVoteCache = (cache, cacheKey) => {
	localStorage.setItem(cacheKey, JSON.stringify(cache));
};

// Add vote to cache with LRU eviction
export const addVoteToCache = (vote, cacheKey) => {
	const cache = loadVoteCache(cacheKey);

	// Check if the vote already exists and remove it (for update or reordering)
	_evictCachedVote(vote, cache);

	// Add the new vote at the beginning (most recent)
	cache.unshift(vote);

	// Limit cache to MAX_VOTE_CACHE items
	if (cache.length > MAX_VOTE_CACHE) {
		cache.pop(); // Remove the oldest vote if cache exceeds limit
	}

	saveVoteCache(cache, cacheKey);
};

export const getCachedVote = (cache, props) => {
	return cache.find(
		(v) =>
			(v.commentId && v.commentId === props.commentId) ||
			(v.postId && v.postId === props.postId)
	);
};

export const evictCachedVote = (vote, cacheKey) => {
	const cache = loadVoteCache(cacheKey);
	_evictCachedVote(vote, cache);
	saveVoteCache(cache, cacheKey);
};

const _evictCachedVote = (vote, cache) => {
	const existingIndex = cache.findIndex(
		(v) =>
			(v.commentId && v.commentId === vote.commentId) ||
			(v.postId && v.postId === vote.postId)
	);
	if (existingIndex !== -1) {
		cache.splice(existingIndex, 1); // Remove existing vote
	}
};

export const clearCache = (cacheKey) => {
	localStorage.setItem(cacheKey, '[]');
};
