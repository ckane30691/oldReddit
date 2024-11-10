import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setAuthToken } from '../../util/sessionApiUtil';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { clearCache } from '../../util/LRUCache';

const _nullUser = Object.freeze({
	id: null,
});

const _initialState = () => {
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
	'user/signup',
	async (userData, { rejectWithValue }) => {
		try {
			let res = await axios.post('/api/users/signup', userData);
			const { token } = res.data;
			// Set token to ls
			localStorage.setItem('jwtToken', token);
			// Set token to Auth header
			setAuthToken(token);
			// Decode token to get user data
			const decoded = jwt_decode(token);
			return decoded;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const loginUser = createAsyncThunk(
	'user/login',
	async (userData, { rejectWithValue }) => {
		try {
			let res = await axios.post('/api/users/login', userData);
			const { token } = res.data;
			// Set token to ls
			localStorage.setItem('jwtToken', token);
			// Set token to Auth header
			setAuthToken(token);
			// Decode token to get user data
			const decoded = jwt_decode(token);
			return decoded;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
	localStorage.removeItem('jwtToken');
	// Remove auth header for future requests
	setAuthToken(false);
	clearCache('userVoteCache');
	return _nullUser;
});

const sessionSlice = createSlice({
	name: 'session',
	initialState: _initialState(),
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(signUpUser.fulfilled, (state, action) => {
				state = action.payload;
				return state;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state = action.payload;
				return state;
			})
			.addCase(logoutUser.fulfilled, (state, action) => {
				state = action.payload;
				return state;
			});
	},
});

export default sessionSlice.reducer;
