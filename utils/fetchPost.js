const easyParse = require('./easyParse');
const Post = require('../models/Post');

const buildPostsQuery = async (subReddit, view, pageToken) => {
	let postsQuery = Post.query('subReddit').eq(subReddit);

	let gsi;
	// Apply sorting based on the view
	if (view === 'New') {
		gsi = 'GSI_New';
		postsQuery = postsQuery.using(gsi).sort('descending');
	} else if (view === 'Top') {
		gsi = 'GSI_Top';
		postsQuery = postsQuery.using(gsi).sort('descending');
	} else {
		// Hot
		gsi = 'GSI_Hot';
		postsQuery = postsQuery.using(gsi).sort('descending');
	}

	if (pageToken) {
		const lastKey = easyParse(pageToken);
		postsQuery = postsQuery.startAt(lastKey);
		// const { createdAt } = easyParse(pageToken);
		// postsQuery = postsQuery.filter('createdAt').lt(new Date(createdAt));
	}

	return postsQuery;
};

module.exports = buildPostsQuery;
