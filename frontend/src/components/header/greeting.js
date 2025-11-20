import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../../store/slices/sessionSlice';
require('./greeting.css');

const dummyLogin = async (e, dispatch) => {
	e.preventDefault();

	const dummy = {
		email: 'dummy@login.com',
		password: 'password',
	};
	await dispatch(loginUser(dummy));
};

const sessionLinks = (dummyLogin, dispatch) => (
	<nav className="header-group">
		Want to Join? <Link to="/login">Log in</Link>
		{/*space*/} or {/*space*/}
		<Link to="/signup">sign up</Link> in seconds!
		<button className="demo-button" onClick={(e) => dummyLogin(e, dispatch)}>
			Demo
		</button>
	</nav>
);

const personalGreeting = (currentUser, dispatch) => {
	return (
		<hgroup className="header-group">
			<h2 className="header-name">{currentUser.username}</h2>
			<button className="header-button" onClick={() => dispatch(logoutUser())}>
				| Logout
			</button>
		</hgroup>
	);
};

const Greeting = () => {
	let currentUser = useSelector((state) => state.session);
	let dispatch = useDispatch();
	return currentUser.id
		? personalGreeting(currentUser, dispatch)
		: sessionLinks(dummyLogin, dispatch);
};

export default Greeting;
