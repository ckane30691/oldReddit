import React from 'react';
import { Link } from 'react-router-dom';
require('./sideBar.css');

export const SideBar = () => {
	return (
		<div className="side-bar-container">
			<Link className="side-bar-link" to={'/posts/new'}>
				Submit a new link
			</Link>
			<Link className="side-bar-link" to={'/posts/new'}>
				Submit a new text post
			</Link>
			<div className="premium-container">
				<h1 className="prem-header">
					OldReddit <span>Premium</span>
				</h1>
				<p>
					Get an add free experience with special benefits, and directly support
					OldReddit
				</p>
			</div>
			<Link className="side-bar-link" to={'/subReddits/new'}>
				Create your own subreddit
			</Link>
		</div>
	);
};
