import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Link } from 'react-router-dom';
import { SessionForm } from './components/sessionForm';
import { AuthRoute, ProtectedRoute } from './util/routeUtil';
import { PlaceHolder } from './components/placeholder';
import { SubRedditShow } from './components/subReddits/subRedditShow';

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<header className="App-header">
					<div className="session-link">
						<Link to="/home" className="header-link">
							Home
						</Link>
						<Link to="/login" className="header-link">
							Login
						</Link>
						<Link to="/signup" className="header-link header-sign-up">
							Sign Up
						</Link>
					</div>
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
