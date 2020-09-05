import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/sessionSlice';
require('./greeting.css');

const sessionLinks = (dummyLogin, dispatch) => (
	<nav className="header-group">
		Want to Join? <Link to="/login">Sign In</Link>
		{/*space*/} or {/*space*/}
		<Link to="/signup">sign up</Link> in seconds!
		<button className="demo-button" /* onClick={dummyLogin}*/>Demo</button>
	</nav>
);

const personalGreeting = (currentUser, dispatch) => {
	return (
		<hgroup className="header-group">
			<h2 className="header-name">{currentUser.username}</h2>
			<button className="header-button" onClick={() => dispatch(logoutUser())}>
				Log Out
			</button>
		</hgroup>
	);
};

const Greeting = () => {
	let currentUser = useSelector((state) => state.session);
	let dispatch = useDispatch();
	return currentUser.id
		? personalGreeting(currentUser, dispatch)
		: sessionLinks(null, dispatch);
};

export default Greeting;
