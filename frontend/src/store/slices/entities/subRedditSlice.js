import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSubReddits = createAsyncThunk(
	'subReddits/fetchAll',
	async (filters, { rejectWithValue }) => {
		try {
			debugger;
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
			let res = await axios.patch(`/api/subReddits${subReddit._id}`, subReddit);
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
			let res = await axios.post(`/api/subReddits${subReddit._id}`, subReddit);
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
				state[subReddit._id] = subReddit;
			});
		})
		.addCase(fetchSubReddit.fulfilled, (state, action) => {
			state[action.payload._id] = action.payload;
		})
		.addCase(createSubReddit.fulfilled, (state, action) => {
			state[action.payload._id] = action.payload;
		})
		.addCase(deleteSubReddit.fulfilled, (state, action) => {
			delete state[action.payload._id];
		})
		.addCase(updateSubReddit.fulfilled, (state, action) => {
			state[action.payload._id] = action.payload;
		})
	},
});

export default subRedditSlice.reducer;
