import { createSlice } from '@reduxjs/toolkit';

const sessionErrorsSlice = createSlice({
	name: 'sessionErrors',
	initialState: [],
	reducers: {
		setCurrentUser() {
			return [];
		},
		getErrors(state, action) {
			return [action.payload.message];
		},
	},
});

export const { getErrors } = sessionErrorsSlice.actions;

export default sessionErrorsSlice.reducer;
