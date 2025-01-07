// Helper function to generate the nextPageToken for pagination
const generateNextPageToken = (collection) => {
	const nextPageToken = collection.lastKey
		? JSON.stringify(collection.lastKey)
		: null;
	return nextPageToken;
};

module.exports = generateNextPageToken;
