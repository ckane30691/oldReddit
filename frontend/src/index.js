import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import configureStore from './store/store.js';
import App from './App.js';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
	if (process.env.NODE_ENV === 'production') {
		axios.defaults.baseURL = process.env.REACT_APP_API_URL;
	}

	let store = configureStore();
	window.store = store;
	const rootElement = document.getElementById('root');
	const root = createRoot(rootElement);

	root.render(
		<Provider store={store}>
			<App store={store} />
		</Provider>
	);
	serviceWorker.register();
});
