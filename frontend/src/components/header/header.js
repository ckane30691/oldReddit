import React from 'react';
import Greeting from './greeting';
import { Link } from 'react-router-dom';
require('./header.css');
export const Header = () => {
	return (
		<div>
			<header>
				<div className="home-container">
					<Link to="/" className="header-link">
						<h1>OldReddit</h1>
					</Link>
				</div>
				<Greeting />
			</header>
		</div>
	);
};
