import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createVote = createAsyncThunk(
	'receiveVote',
	async (vote, { rejectWithValue }) => {
		console.log(vote);
		try {
			let res = await axios.post('/api/votes', vote);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);
