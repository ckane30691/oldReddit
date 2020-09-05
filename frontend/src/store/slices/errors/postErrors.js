import { createSlice } from '@reduxjs/toolkit';
import {
	fetchPost,
	fetchPosts,
	createPost,
	deletePost,
	updatePost,
} from '../entities/postSlice';

const postErrorsSlice = createSlice({
	name: 'postErrors',
	initialState: [],
	reducers: {},
	extraReducers: {
		[fetchPost.fulfilled]: (state, action) => {
			state = [];
			return state;
		},
		[fetchPost.rejected]: (state, action) => {
			state = Object.values(action.payload);
			return state;
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state = [];
			return state;
		},
		[fetchPosts.rejected]: (state, action) => {
			state = Object.values(action.payload);
			return state;
		},
		[createPost.fulfilled]: (state, action) => {
			state = [];
			return state;
		},
		[createPost.rejected]: (state, action) => {
			state = Object.values(action.payload);
			return state;
		},
		[deletePost.rejected]: (state, action) => {
			state = Object.values(action.payload);
			return state;
		},
		[deletePost.fulfilled]: (state, action) => {
			state = [];
			return state;
		},
		[updatePost.rejected]: (state, action) => {
			state = Object.values(action.payload);
			return state;
		},
		[updatePost.fulfilled]: (state, action) => {
			state = [];
			return state;
		},
	},
});

export default postErrorsSlice.reducer;
