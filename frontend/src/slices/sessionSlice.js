import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setAuthToken } from '../util/sessionApiUtil';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const _initialState = () => {
	const _nullUser = Object.freeze({
		id: null,
	});
	if (localStorage.jwtToken) {
		// Set auth token header auth
		setAuthToken(localStorage.jwtToken);
		// Decode token and get user info and exp
		const decoded = jwt_decode(localStorage.jwtToken);
		// Check for expired token
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			// Redirect to login
			window.location.href = '/login';
			// remove expired jwt
			localStorage.removeItem('jwtToken');
			// Remove auth header for future requests
			setAuthToken(false);
			return _nullUser;
		}
		return decoded;
	}
	return _nullUser;
};

export const signUpUser = createAsyncThunk(
	'setCurrentUser',
	async (userData, thunkAPI) => {
		let res = await axios.post('/api/users/signup', userData);
		const { token } = res.data;
		// Set token to ls
		localStorage.setItem('jwtToken', token);
		// Set token to Auth header
		setAuthToken(token);
		// Decode token to get user data
		const decoded = jwt_decode(token);
		return decoded;
	}
);

export const loginUser = createAsyncThunk(
	'setCurrentUser',
	async (userData, thunkAPI) => {
		let res = await axios.post('/api/users/login', userData);
		const { token } = res.data;
		// Set token to ls
		localStorage.setItem('jwtToken', token);
		// Set token to Auth header
		setAuthToken(token);
		// Decode token to get user data
		const decoded = jwt_decode(token);
		return decoded;
	}
);

export const logoutUser = createAsyncThunk('setCurrentUser', async () => {
	localStorage.removeItem('jwtToken');
	// Remove auth header for future requests
	setAuthToken(false);
	return {};
});
// Remove token from localStorage

const sessionSlice = createSlice({
	name: 'session',
	initialState: _initialState(),
	reducers: {
		// setCurrentUser(state, action) {
		// 	const { id, username, email } = action.payload;
		// 	state.session = { id, username, email };
		// },
	},
	extraReducers: {
		// Add reducers for additional action types here, and handle loading state as needed
		[signUpUser.fulfilled]: (state, action) => {
			// Add user to the state array
			state.session = action.payload;
		},
		[loginUser.fulfilled]: (state, action) => {
			state.session = action.payload;
		},
		[logoutUser.fulfilled]: (state, action) => {
			state.session = action.payload;
		},
		// [signUpUser.rejected]: (state, action) => {
		// 	// Add user to the state array
		// 	state.error.push(action.payload);
		// },
	},
});

export default sessionSlice.reducer;
