import axios from 'axios';
import jwt_decode from 'jwt-decode';
const { setCurrentUser } = require('../slices/sessionSlice');
const { getErrors } = require('../slices/sessionErrorsSlice');

const $ = window.$;

export const setAuthToken = (token) => {
	if (token) {
		// Apply to every request
		axios.defaults.headers.common['Authorization'] = token;
	} else {
		// Delete auth header
		delete axios.defaults.headers.common['Authorization'];
	}
};

// Register User
export const signUpUser = (userData, history) => async (dispatch) => {
	try {
		let res = await axios.post('/api/users/register', userData);

		const { token } = res.data;
		// Set token to ls
		localStorage.setItem('jwtToken', token);
		// Set token to Auth header
		setAuthToken(token);
		// Decode token to get user data
		const decoded = jwt_decode(token);
		// Set current user
		dispatch(setCurrentUser(decoded));
	} catch (err) {
		dispatch(getErrors(err));
	}
};

// Login - Get User Token
export const loginUser = (userData) => (dispatch) => {
	try {
		let res = axios.post('/api/users/login', userData);
		const { token } = res.data;
		// Set token to ls
		localStorage.setItem('jwtToken', token);
		// Set token to Auth header
		setAuthToken(token);
		// Decode token to get user data
		const decoded = jwt_decode(token);
		// Set current user
		dispatch(setCurrentUser(decoded));
	} catch (err) {
		dispatch(getErrors(err));
	}
};
