import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SessionForm } from './components/session/sessionForm';
import { AuthRoute, ProtectedRoute } from './util/routeUtil';
import { Header } from './components/header/header';
import { SubRedditIndex } from './components/subReddits/subRedditIndex';
import { SubRedditForm } from './components/subReddits/subRedditForm';
import { PostIndex } from './components/posts/postIndex';
import { SideBar } from './components/sideBar';
import { PostForm } from './components/posts/postForm';
import { PostShow } from './components/posts/postShow';

const composeComponents = (...components) => {
	return () => (
		<div>
			{components.map((Component, index) => (
				<Component key={`comp-${index}`} />
			))}
		</div>
	);
};

// TODO: Style subreddit form
// TODO: Add Redis back in for comments, Fix initial redirect after logging in
// TODO: Fix db scan for subreddits
// TODO: Posts with links
// TODO: Update README
// TODO: DELETE unused components
// TODO: Update Master Branch
// TODO: Update resume and start applying
// TODO: Deploy project to production
// TODO: Proper Logout functionality + Refresh Tokens
// TODO: Artillery scalability test
// TODO: Thumbnails for links
// TODO: Client side caching
// TODO: Caching of pagetokens so you can keep your spot
// TODO: Archiving old pages
// TODO: Implement subscriptions to subreddits
// TODO: Add filter for time on TOP
// TODO: User Profiles including vote history
// TODO: More styling, loading icon

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<SubRedditIndex />

				<header className="App-header">
					<Header />
				</header>

				<Switch>
					{/* <Route
						exact
						path="/"
						component={composeComponents(SessionForm, PostIndex)}
					/> */}
					<AuthRoute exact path="/login" component={SessionForm} />
					<AuthRoute exact path="/signup" component={SessionForm} />
					<ProtectedRoute exact path="/posts/new" component={PostForm} />
					<ProtectedRoute exact path="/posts/:id" component={PostShow} />
					<ProtectedRoute
						exact
						path="/subReddits/new"
						component={SubRedditForm}
					/>
					<ProtectedRoute exact path="/subReddits/:id" component={PostIndex} />
					{/* <ProtectedRoute exact path="/home" component={PlaceHolder} /> */}
				</Switch>
				<SideBar />
			</BrowserRouter>
		</div>
	);
}

export default App;
