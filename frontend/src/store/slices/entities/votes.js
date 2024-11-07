import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createVote = createAsyncThunk(
	'votes/create',
	async (vote, { rejectWithValue }) => {
		try {
			let res = await axios.post('/api/votes', vote);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);
