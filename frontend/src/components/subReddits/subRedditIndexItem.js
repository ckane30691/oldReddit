import React from 'react';
export const SubRedditIndexItem = ({ subReddit }) => {
	return (
		<li>
			<h1>{subReddit.title}</h1>
			<h2>{subReddit.desc}</h2>
		</li>
	);
};
