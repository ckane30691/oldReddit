import { createSlice } from '@reduxjs/toolkit';

const _nullUser = Object.freeze({
	id: null,
});

const sessionSlice = createSlice({
	name: 'session',
	initialState: _nullUser,
	reducers: {
		setCurrentUser(state, action) {
			const { id, username, email } = action.payload;
			state.push({ id, username, email });
		},
	},
});

export const { setCurrentUser } = sessionSlice.actions;

export default sessionSlice.reducer;
