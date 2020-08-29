import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import jwt_decode from 'jwt-decode';
import * as APIUtil from './util/sessionApiUtil';
import { loginUser, logoutUser } from './slices/sessionSlice';
//Components
import configureStore from './store/store.js';
import App from './App.js';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';

document.addEventListener('DOMContentLoaded', () => {
	let store = configureStore();
	const root = document.getElementById('root');
	ReactDOM.render(
		<Provider store={store}>
			<App store={store} />
		</Provider>,
		root
	);
	serviceWorker.register();
});
