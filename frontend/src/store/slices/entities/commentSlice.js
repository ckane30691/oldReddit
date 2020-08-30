import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
	reducers: {},
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
	},
});

export default commentSlice.reducer;
