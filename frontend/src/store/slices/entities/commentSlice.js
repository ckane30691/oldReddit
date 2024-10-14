import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchPost } from './postSlice';

export const fetchComments = createAsyncThunk(
	'comments/fetchAll',
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
	'comments/create',
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
	'comments/delete',
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
		clearComments(state) {
			state = {};
			return state;
		},
	},
	extraReducers: (builder) => {
		builder
		.addCase(fetchComments.fulfilled, (state, action) => {
			action.payload.forEach((comment) => {
				state[comment._id] = comment;
			});
		})
		.addCase(createComment.fulfilled, (state, action) => {
			if (!action.payload.parentCommentId) {
				state[action.payload._id] = action.payload;
			} else {
				const _recursiveInsert = (arr) => {
					for (let i = 0; i < arr.length; i++) {
						let obj = arr[i];
						if (obj._id === action.payload.parentCommentId) {
							(obj.children = obj.children || []).push(action.payload);
							return;
						}
						if (!obj.children) continue;
						for (let j = 0; j < obj.children.length; j++) {
							let child = obj.children[j];
							if (child._id === action.payload.parentCommentId) {
								return (child.children = child.children || []).push(action.payload);
							} else {
								if (child.children) return _recursiveInsert(child.children);
							}
						}
					}
				};
			_recursiveInsert(Object.values(state));
			}
		})
		.addCase(deleteComment.fulfilled, (state, action) => {
			state[action.payload._id] = action.payload;
		})
		.addCase(fetchPost.fulfilled, (state, action) => {
			action.payload.formattedComments &&
			action.payload.formattedComments.forEach((comment) => {
				state[comment._id] = comment;
			});
		});
	},
});

export const { clearComments } = commentSlice.actions;

export default commentSlice.reducer;
