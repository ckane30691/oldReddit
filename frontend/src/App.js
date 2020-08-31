import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Link } from 'react-router-dom';
import { SessionForm } from './components/sessionForm';
import { AuthRoute, ProtectedRoute } from './util/routeUtil';
import { PlaceHolder } from './components/placeholder';
import { SubRedditShow } from './components/subReddits/subRedditShow';
import { Header } from './components/header/header';

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<header className="App-header">
					<Header />
				</header>
				<Switch>
					<AuthRoute exact path="/login" component={SessionForm} />
					<AuthRoute exact path="/signup" component={SessionForm} />
					<ProtectedRoute exact path="/home" component={PlaceHolder} />
					<ProtectedRoute
						exact
						path="/subReddits/:id"
						component={SubRedditShow}
					/>
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
