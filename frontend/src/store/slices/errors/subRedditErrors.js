import { createSlice } from '@reduxjs/toolkit';
import {
	fetchSubReddit,
	fetchSubReddits,
	createSubReddit,
} from '../entities/subRedditSlice';

const subRedditErrorsSlice = createSlice({
	name: 'subRedditErrors',
	initialState: [],
	reducers: {},
	extraReducers: {
		[fetchSubReddit.fulfilled]: (state, action) => {
			state = [];
			return state;
		},
		[fetchSubReddit.rejected]: (state, action) => {
			state = Object.values(action.payload);
			return state;
		},
		[fetchSubReddits.fulfilled]: (state, action) => {
			state = [];
			return state;
		},
		[fetchSubReddits.rejected]: (state, action) => {
			state = Object.values(action.payload);
			return state;
		},
		[createSubReddit.fulfilled]: (state, action) => {
			state = [];
			return state;
		},
		[createSubReddit.rejected]: (state, action) => {
			state = Object.values(action.payload);
			return state;
		},
	},
});

export default subRedditErrorsSlice.reducer;
