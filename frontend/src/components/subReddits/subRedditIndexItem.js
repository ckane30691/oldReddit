import React from 'react';
import { Link } from 'react-router-dom';
export const SubRedditIndexItem = ({ subReddit }) => {
	return (
		<li>
			<h1>
				<Link to={`/subReddits/${subReddit._id}`}>{subReddit.title}</Link>
			</h1>
			<h2>{subReddit.desc}</h2>
		</li>
	);
};
