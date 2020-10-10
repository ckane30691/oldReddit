import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchPost } from './postSlice';

export const fetchComments = createAsyncThunk(
	'receiveComments',
	async (postId, { rejectWithValue }) => {
		try {
			let res = await axios.get('/api/comments', postId);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const createComment = createAsyncThunk(
	'receiveComment',
	async (comment, { rejectWithValue }) => {
		try {
			let res = await axios.post('/api/comments', comment);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const deleteComment = createAsyncThunk(
	'removeComment',
	async (commentId, { rejectWithValue }) => {
		try {
			let res = await axios.delete(`/api/comments/${commentId}`);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

const commentSlice = createSlice({
	name: 'comments',
	initialState: {},
	reducers: {
		clearComments(state, action) {
			state = {};
			return state;
		},
	},
	extraReducers: {
		[fetchComments.fulfilled]: (state, action) => {
			action.payload.forEach((comment) => {
				state[comment._id] = comment;
			});
			return state;
		},
		[createComment.fulfilled]: (state, action) => {
			state[action.payload._id] = action.payload;
			return state;
		},
		[deleteComment.fulfilled]: (state, action) => {
			state[action.payload._id] = action.payload;
			return state;
		},
		[fetchPost.fulfilled]: (state, action) => {
			const comments = action.payload.comments;
			comments.forEach((comment) => {
				state[comment._id] = comment;
			});
			return state;
		},
	},
});

export const { clearComments } = commentSlice.actions;

export default commentSlice.reducer;
