import { createSlice } from '@reduxjs/toolkit';

const sessionErrorsSlice = createSlice({
	name: 'sessionErrors',
	initialState: [],
	reducers: {
		setCurrentUser() {
			return [];
		},
		getErrors(state, action) {
			return Promise.resolve(action.payload);
		},
	},
});

export const { getErrors } = sessionErrorsSlice.actions;

export default sessionErrorsSlice.reducer;
