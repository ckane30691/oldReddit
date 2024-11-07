import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import axios from 'axios';

const selectSubs = (state) => state.entities.subReddits;

export const selectSubRedditsArray = createSelector([selectSubs], (subs) =>
	subs ? Object.values(subs) : []
);

export const fetchSubReddits = createAsyncThunk(
	'subReddits/fetchAll',
	async (filters, { rejectWithValue }) => {
		try {
			let res = await axios.get('/api/subReddits', {
				params: { filters },
			});
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchSubReddit = createAsyncThunk(
	'subReddits/fetchOne',
	async (id, { rejectWithValue }) => {
		try {
			let res = await axios.get(`/api/subReddits/${id}`);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const createSubReddit = createAsyncThunk(
	'subReddits/create',
	async (subReddit, { rejectWithValue }) => {
		try {
			let res = await axios.post('/api/subReddits', subReddit);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const deleteSubReddit = createAsyncThunk(
	'subReddits/delete',
	async (subRedditId, { rejectWithValue }) => {
		try {
			let res = await axios.delete(`/api/subReddits/${subRedditId}`);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const updateSubReddit = createAsyncThunk(
	'subReddits/update',
	async (subReddit, { rejectWithValue }) => {
		try {
			let res = await axios.patch(
				`/api/subReddits${subReddit.subRedditId}`,
				subReddit
			);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const subscribeToSubReddit = createAsyncThunk(
	'subReddits/subscribe',
	async (subReddit, { rejectWithValue }) => {
		try {
			let res = await axios.post(
				`/api/subReddits${subReddit.subRedditId}`,
				subReddit
			);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

const subRedditSlice = createSlice({
	name: 'subReddits',
	initialState: {},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSubReddits.fulfilled, (state, action) => {
				action.payload.forEach((subReddit) => {
					state[subReddit.subRedditId] = subReddit;
					return state;
				});
			})
			.addCase(fetchSubReddit.fulfilled, (state, action) => {
				state[action.payload.subRedditId] = action.payload;
				return state;
			})
			.addCase(createSubReddit.fulfilled, (state, action) => {
				state[action.payload.subRedditId] = action.payload;
				return state;
			})
			.addCase(deleteSubReddit.fulfilled, (state, action) => {
				delete state[action.payload.subRedditId];
				return state;
			})
			.addCase(updateSubReddit.fulfilled, (state, action) => {
				state[action.payload.subRedditId] = action.payload;
				return state;
			});
	},
});

export default subRedditSlice.reducer;
