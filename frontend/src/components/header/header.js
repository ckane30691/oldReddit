import React from 'react';
import Greeting from './greeting';
import { Link } from 'react-router-dom';
require('./header.css');
export const Header = () => {
	return (
		<div>
			<div className="home-container">
				<Link to="/" className="header-link">
					OldReddit
				</Link>
				<Greeting />
			</div>
		</div>
	);
};
