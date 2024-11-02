import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSelector } from 'reselect';

const selectComments = (state) => state.entities.comments;

export const selectCommentsArray = createSelector(
	[selectComments],
	(comments) => (comments ? Object.values(comments) : [])
);

export const fetchComments = createAsyncThunk(
	'comments/fetchAll',
	async ({ filter, pageToken }, { rejectWithValue }) => {
		console.log(filter, pageToken);
		try {
			let res = await axios.get('/api/comments', {
				params: { filters: filter, pageToken: pageToken },
			});
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
				console.log(action);
				action?.payload?.comments?.forEach((comment) => {
					state[comment.commentId] = comment;
				});
				return state;
			})
			.addCase(createComment.fulfilled, (state, action) => {
				if (!action.payload.parentCommentId) {
					state[action.payload.commentId] = action.payload;
				} else {
					//TODO FIX THIS SINCE COMMENTS ARE STRUCTURED ON BACKEND
					const _recursiveInsert = (arr) => {
						for (let i = 0; i < arr.length; i++) {
							let obj = arr[i];
							if (obj._id === action.payload.parentCommentId) {
								(obj.replies = obj.replies || []).push(action.payload);
								return;
							}
							if (!obj.replies) continue;
							for (let j = 0; j < obj.replies.length; j++) {
								let child = obj.replies[j];
								if (child._id === action.payload.parentCommentId) {
									return (child.replies = child.replies || []).push(
										action.payload
									);
								} else {
									if (child.replies) return _recursiveInsert(child.replies);
								}
							}
						}
					};
					_recursiveInsert(Object.values(state));
				}
			})
			.addCase(deleteComment.fulfilled, (state, action) => {
				state[action.payload.commentId] = action.payload;
			});
	},
});

export const { clearComments } = commentSlice.actions;

export default commentSlice.reducer;
