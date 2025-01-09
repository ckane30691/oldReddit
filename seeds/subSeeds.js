const SubReddit = require('../models/SubReddit');
const { v4: uuidv4 } = require('uuid');

(async () => {
	const seedData = async () => {
		const subreddits = [
			{
				subRedditId: uuidv4(),
				moderatorId: uuidv4(),
				title: 'Relationship Advice',
				desc: "Whether it's romance, friendship, family, co-workers, or basic human interaction: we're here to help!",
				category: 'default',
			},
			{
				subRedditId: uuidv4(),
				moderatorId: uuidv4(),
				title: 'Ask OldReddit',
				desc: 'Ask the community',
				category: 'default',
			},
			{
				subRedditId: uuidv4(),
				moderatorId: uuidv4(),
				title: "Explain Like I'm Five",
				desc: 'Request an Explanation',
				category: 'default',
			},
			{
				subRedditId: uuidv4(),
				moderatorId: uuidv4(),
				title: 'Today I Learned',
				desc: 'What did you learn today?',
				category: 'default',
			},
			{
				subRedditId: uuidv4(),
				moderatorId: uuidv4(),
				title: 'Programming',
				desc: 'For discussion and news about computer science',
				category: 'default',
			},
			{
				subRedditId: uuidv4(),
				moderatorId: uuidv4(),
				title: 'AITH',
				desc: "A catharsis for the frustrated moral philosopher in all of us, and a place to finally find out if you were wrong in a real-world argument that's been bothering you.",
				category: 'default',
			},
			{
				subRedditId: uuidv4(),
				moderatorId: uuidv4(),
				title: 'News',
				desc: 'For the latest news',
				category: 'default',
			},
			{
				subRedditId: uuidv4(),
				moderatorId: uuidv4(),
				title: 'AWWW',
				desc: 'A place for heartmelting posts',
				category: 'default',
			},
			{
				subRedditId: uuidv4(),
				moderatorId: uuidv4(),
				title: 'Movies',
				desc: 'No spoilers tho!',
				category: 'default',
			},
			{
				subRedditId: uuidv4(),
				moderatorId: uuidv4(),
				title: 'Gaming',
				desc: "A catharsis for the frustrated moral philosopher in all of us, and a place to finally find out if you were wrong in a real-world argument that's been bothering you.",
				category: 'default',
			},
		];

		for (const subreddit of subreddits) {
			try {
				await SubReddit.create(subreddit);
				console.log(`Seeded: ${subreddit.title}`);
			} catch (error) {
				console.error(`Failed to seed ${subreddit.title}:`, error.message);
			}
		}
	};
	try {
		await seedData();
		console.log('Seeding completed');
	} catch (error) {
		console.error('Seeding failed:', error.message);
	}
})();
