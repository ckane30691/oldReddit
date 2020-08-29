import { createSlice } from '@reduxjs/toolkit';
import { loginUser, signUpUser } from './sessionSlice';
const sessionErrorsSlice = createSlice({
	name: 'sessionErrors',
	initialState: [],
	reducers: {},
	extraReducers: {
		[loginUser.fulfilled]: (state, action) => {
			state = [];
			return state;
		},
		[loginUser.rejected]: (state, action) => {
			state = Object.values(action.payload);
			return state;
		},
		[signUpUser.fulfilled]: (state, action) => {
			state = [];
			return state;
		},
		[signUpUser.rejected]: (state, action) => {
			state = Object.values(action.payload);
			return state;
		},
	},
});

export const { getErrors } = sessionErrorsSlice.actions;

export default sessionErrorsSlice.reducer;
