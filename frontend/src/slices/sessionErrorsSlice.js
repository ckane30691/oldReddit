import { createSlice } from '@reduxjs/toolkit';

const sessionErrorsSlice = createSlice({
	name: 'sessionErrors',
	initialState: [],
	reducers: {
		setCurrentUser() {
			return [];
		},
		getErrors(state, action) {
			return action.payload;
		},
	},
});

export default sessionErrorsSlice.reducer;
