import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices/root';

const configureStoreWrapper = (preloadedState = {}) =>
	configureStore({
		reducer: rootReducer,
		preloadedState: preloadedState,
	});

export default configureStoreWrapper;
