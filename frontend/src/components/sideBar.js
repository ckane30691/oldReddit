import React from 'react';
import { Link } from 'react-router-dom';

export const SideBar = () => {
	return (
		<div>
			<Link to={'/posts/new'}>Submit a new text post</Link>
			<Link to={'/subReddits/new'}>Create your own subreddit</Link>
		</div>
	);
};
