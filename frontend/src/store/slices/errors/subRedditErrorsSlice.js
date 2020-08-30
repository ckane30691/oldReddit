import { createSlice } from '@reduxjs/toolkit';
import {
	fetchSubReddit,
	fetchSubReddits,
	createSubReddit,
	deleteSubReddit,
	updateSubReddit,
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
		[deleteSubReddit.rejected]: (state, action) => {
			state = Object.values(action.payload);
			return state;
		},
		[deleteSubReddit.fulfilled]: (state, action) => {
			state = [];
			return state;
		},
		[updateSubReddit.rejected]: (state, action) => {
			state = Object.values(action.payload);
			return state;
		},
		[updateSubReddit.fulfilled]: (state, action) => {
			state = [];
			return state;
		},
	},
});

export default subRedditErrorsSlice.reducer;
