import { combineReducers } from 'redux';
import subReddits from './subRedditSlice';
import posts from './postSlice';

const entitiesReducer = combineReducers({
	subReddits,
	posts,
});

export default entitiesReducer;
