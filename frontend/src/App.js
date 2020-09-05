import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SessionForm } from './components/session/sessionForm';
import { AuthRoute, ProtectedRoute } from './util/routeUtil';
import { PlaceHolder } from './components/placeholder';
import { SubRedditShow } from './components/subReddits/subRedditShow';
import { Header } from './components/header/header';
import { SubRedditIndex } from './components/subReddits/subRedditIndex';
import { PostIndex } from './components/posts/postIndex';
import { SideBar } from './components/sideBar';
import { PostForm } from './components/posts/postForm';

const composeComponents = (...components) => {
	return () => (
		<div>
			{components.map((Component, index) => (
				<Component key={`comp-${index}`} />
			))}
		</div>
	);
};

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<SubRedditIndex />
				<header className="App-header">
					<Header />
				</header>

				<SideBar />

				<Switch>
					<Route
						exact
						path="/"
						component={composeComponents(SessionForm, PostIndex)}
					/>
					<AuthRoute exact path="/signup" component={SessionForm} />
					<AuthRoute exact path="/login" component={SessionForm} />
					<ProtectedRoute exact path="/posts/new" component={PostForm} />
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
