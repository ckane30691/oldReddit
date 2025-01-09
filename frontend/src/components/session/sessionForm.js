import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { loginUser /*, signUpUser*/ } from '../util/sessionApiUtil';
import { signUpUser, loginUser } from '../../store/slices/sessionSlice';
require('./sessionForm.css');

export const SessionForm = (props) => {
	// TODO: SETUP USE EFFECT (componentDidMount) TO CLEAR ERRORS WHEN USER SWITCHES BETWEEN SIGNUP AND LOGIN

	const sessionErrors = useSelector((state) => state.errors.sessionErrors);
	const session = useSelector((state) => state.session);
	const formType =
		props.location && props.location.pathname === '/signup'
			? 'signup'
			: 'login';

	const dispatch = useDispatch();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');
	const [email, setEmail] = useState('');

	if (session.id) return <div></div>;

	let text = formType === 'login' ? 'Login' : 'Sign Up';
	// let passage =
	// 	formType === 'login' ? (
	// 		<p>Just enter your email & password & we'll get you right in</p>
	// 	) : (
	// 		<p>Fill out the fields below to sign up</p>
	// 	);

	const update = (field) => {
		return (e) => {
			const val = e.currentTarget.value;
			switch (field) {
				case 'username':
					setUsername(val);
					break;
				case 'password':
					setPassword(val);
					break;
				case 'password2':
					setPassword2(val);
					break;
				case 'email':
					setEmail(val);
					break;
				default:
					return;
			}
		};
	};

	const renderErrors = () => {
		return (
			<ul>
				{sessionErrors.map((error, idx) => (
					<li key={`error-${idx}`}>{error}</li>
				))}
			</ul>
		);
	};

	const handleSubmit = async (e) => {
		// let res;
		e.preventDefault();
		if (formType === 'login') {
			let user = {
				email,
				password,
			};

			await dispatch(loginUser(user));
		} else {
			let user = {
				username,
				email,
				password,
				password2,
			};

			await dispatch(signUpUser(user));
		}
	};

	const usernameInput =
		formType === 'login' ? (
			''
		) : (
			<input
				required
				type="text"
				value={username}
				className={`session-input`}
				onChange={update('username')}
				placeholder="Username"
			/>
		);

	const password2Input =
		formType === 'login' ? (
			''
		) : (
			<input
				required
				type="password"
				value={password2}
				className={`session-input`}
				onChange={update('password2')}
				placeholder="Confirm Password"
			/>
		);

	return (
		<form onSubmit={handleSubmit} className={`session-form-box`}>
			<div className="errors">{renderErrors()}</div>
			<div className="session-form">
				<br />
				<input
					required
					type="text"
					value={email}
					onChange={update('email')}
					className={`session-input`}
					placeholder="Email"
				/>
				<br />

				{usernameInput}
				<input
					required
					type="password"
					value={password}
					onChange={update('password')}
					className="session-input"
					placeholder="Password"
				/>
				<br />
				{password2Input}
				<input className="session-submit" type="submit" value={text} />
			</div>
		</form>
	);
};
