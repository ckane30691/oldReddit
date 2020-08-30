import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSubReddits = createAsyncThunk(
	'receiveSubReddits',
	async (filters, { rejectWithValue }) => {
		try {
			let res = await axios.get('/api/subReddits', filters);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchSubReddit = createAsyncThunk(
	'receiveSubReddit',
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
	'receiveSubReddit',
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
	'receiveSubReddit',
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
	'receiveSubReddit',
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
	extraReducers: {
		[fetchSubReddits.fulfilled]: (state, action) => {
			state = action.payload;
			return state;
		},
		[fetchSubReddit.fulfilled]: (state, action) => {
			state[action.payload._id] = action.payload;
			return state;
		},
		[createSubReddit.fulfilled]: (state, action) => {
			state[action.payload._id] = action.payload;
			return state;
		},
		[deleteSubReddit.fulfilled]: (state, action) => {
			delete state[action.payload._id];
			return state;
		},
		[updateSubReddit.fulfilled]: (state, action) => {
			state[action.payload._id] = action.payload;
			return state;
		},
	},
});

export default subRedditSlice.reducer;
