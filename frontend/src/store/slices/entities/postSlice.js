import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createVote } from './votes';
import axios from 'axios';

export const fetchPosts = createAsyncThunk(
	'receivePosts',
	async (filters, { rejectWithValue }) => {
		try {
			let res = await axios.get('/api/posts', filters);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchPost = createAsyncThunk(
	'receivePost',
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
	'receivePost',
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
	'removePost',
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
	'receivePost',
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
	reducers: {},
	extraReducers: {
		[fetchPosts.fulfilled]: (state, action) => {
			action.payload.forEach((subReddit) => {
				state[subReddit._id] = subReddit;
			});
			return state;
		},
		[fetchPost.fulfilled]: (state, action) => {
			state[action.payload._id] = action.payload;
			return state;
		},
		[createPost.fulfilled]: (state, action) => {
			state[action.payload._id] = action.payload;
			return state;
		},
		[updatePost.fulfilled]: (state, action) => {
			delete state[action.payload._id];
			return state;
		},
		[deletePost.fulfilled]: (state, action) => {
			state[action.payload._id] = action.payload;
			return state;
		},
		[createVote.fulfilled]: (state, action) => {
			console.log('vote recorded');
			return state;
		},
	},
});

export default postSlice.reducer;
