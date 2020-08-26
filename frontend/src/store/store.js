import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/root_reducer';

const configureStoreWrapper = (preloadedState = {}) =>
	configureStore({
		reducer: rootReducer,
		preloadedState: preloadedState,
	});

export default configureStoreWrapper;
