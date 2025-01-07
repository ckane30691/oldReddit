const calculateRankingScore = (item) => {
	const G = 1.8; // The decay factor (adjust as needed)
	const replyWeight = 0.5; // Weight of replies (adjust as needed)

	// Get the number of hours since the post was created
	const now = new Date();
	const postAgeInMilliseconds = now - item.createdAt;
	const postAgeInHours = postAgeInMilliseconds / (1000 * 60 * 60); // Convert ms to hours
	// Calculate the rankingScore using the netUpvotes
	const rankingScore =
		(item.netUpvotes + replyWeight * (item.replyCount || 0)) /
		Math.pow(postAgeInHours + 2, G);

	item.rankingScore = parseInt(Math.floor(rankingScore * 100000));
};

module.exports = calculateRankingScore;
