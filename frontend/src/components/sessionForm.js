import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { loginUser /*, signUpUser*/ } from '../util/sessionApiUtil';
import { signUpUser, loginUser } from '../slices/sessionSlice';

export const SessionForm = (props) => {
	let history = useHistory();

	const sessionErrors = useSelector((state) => state.errors);

	const formType = props.location.pathname === '/login' ? 'login' : 'signup';

	const dispatch = useDispatch();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');
	const [email, setEmail] = useState('');

	let text = formType === 'login' ? 'Log In' : 'Sign Up';
	let passage =
		formType === 'login' ? (
			<p>Just enter your email & password & we'll get you right in</p>
		) : (
			<p>Fill out the fields below to sign up</p>
		);

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
		let res;
		e.preventDefault();
		if (formType === 'login') {
			let user = {
				email,
				password,
			};
			// debugger;
			res = await dispatch(loginUser(user));
		} else {
			let user = {
				username,
				email,
				password,
				password2,
			};
			// debugger;
			res = await dispatch(signUpUser(user));
		}

		if (res.type === 'setCurrentUser/fulfilled') {
			history.push('/home');
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
				onChange={update('username')}
				placeholder="Enter Username"
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
				onChange={update('password2')}
				placeholder="Confirm Password"
			/>
		);

	return (
		<form onSubmit={handleSubmit} className={`session-form-box`}>
			{passage}
			<div className="errors">{renderErrors()}</div>
			<div className="session-form">
				<br />
				<input
					required
					type="text"
					value={email}
					onChange={update('email')}
					className={`session-${formType}-input`}
					placeholder="Enter Email"
				/>
				<br />

				{usernameInput}
				<input
					required
					type="password"
					value={password}
					onChange={update('password')}
					className="password-input"
					placeholder="Enter Password"
				/>
				<br />
				{password2Input}
				<input className="signup-submit" type="submit" value={text} />
			</div>
		</form>
	);
};
