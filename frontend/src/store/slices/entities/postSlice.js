import { createSlice, createAsyncThunk, buildCreateSlice } from '@reduxjs/toolkit';
import { createVote } from './votes';
import { createSelector } from 'reselect';
import axios from 'axios';

const selectPosts = (state) => state.entities.posts;

export const selectPostArray = createSelector(
	[selectPosts],
	(posts) => (posts ? Object.values(posts) : [])
);

export const fetchPosts = createAsyncThunk(
	'posts/fetchAll',
	async (filters, { rejectWithValue }) => {
		try {
			let res = await axios.get('/api/posts', {params: {filters}});
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchPost = createAsyncThunk(
	'posts/fetchOne',
	async (id, { rejectWithValue }) => {
		try {
			let res = await axios.get(`/api/posts/${id}`);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const createPost = createAsyncThunk(
	'posts/create',
	async (post, { rejectWithValue }) => {
		try {
			let res = await axios.post('/api/posts', post);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const deletePost = createAsyncThunk(
	'posts/delete',
	async (postId, { rejectWithValue }) => {
		try {
			let res = await axios.delete(`/api/posts/${postId}`);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const updatePost = createAsyncThunk(
	'posts/update',
	async (post, { rejectWithValue }) => {
		try {
			let res = await axios.post(`/api/posts${post._id}`, post);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

const postSlice = createSlice({
	name: 'posts',
	initialState: {},
	reducers: {
		clearPosts: (state) => {
			state = {};  // Clears the posts array
			return state
		}
	},
	extraReducers: (builder) => {
		builder
		.addCase(fetchPosts.fulfilled, (state, action) => {
			action.payload.forEach((subReddit) => {
				state[subReddit._id] = subReddit;
				return state
			});
		})
		.addCase(fetchPost.fulfilled, (state, action) => {
			state[action.payload._id] = action.payload;
			return state
		})
		.addCase(createPost.fulfilled, (state, action) => {
			state[action.payload._id] = action.payload;
			return state
		})
		.addCase(updatePost.fulfilled, (state, action) => {
			delete state[action.payload._id];
			return state
		})
		.addCase(deletePost.fulfilled, (state, action) => {
			state[action.payload._id] = action.payload;
			return state
		})
		.addCase(createVote.fulfilled, (state, action) => {
			state[action.payload._id] = action.payload;
			return state
		})
	},
});

export const { clearPosts } = postSlice.actions;

export default postSlice.reducer;
