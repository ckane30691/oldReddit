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
	extraReducers: (builder) => {
		builder
			.addCase(fetchPost.fulfilled, (state, action) => {
				state = [];
				return state;
			})
			.addCase(fetchPost.rejected, (state, action) => {
				state = Object.values(action.payload);
				return state;
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state = [];
				return state;
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state = Object.values(action.error);
				return state;
			})
			.addCase(createPost.fulfilled, (state, action) => {
				state = [];
				return state;
			})
			.addCase(createPost.rejected, (state, action) => {
				state = Object.values(action.payload);
				return state;
			})
			.addCase(deletePost.rejected, (state, action) => {
				state = Object.values(action.payload);
				return state;
			})
			.addCase(deletePost.fulfilled, (state, action) => {
				state = [];
				return state;
			})
			.addCase(updatePost.rejected, (state, action) => {
				state = Object.values(action.payload);
				return state;
			})
			.addCase(updatePost.fulfilled, (state, action) => {
				state = [];
				return state;
			});
	},
});

export default postErrorsSlice.reducer;
