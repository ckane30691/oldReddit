import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import configureStore from './store/store.js';
import App from './App.js';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';

document.addEventListener('DOMContentLoaded', () => {
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
