import { combineReducers } from 'redux';
import subReddits from './subRedditSlice';
import posts from './postSlice';
import comments from './commentSlice';

const entitiesReducer = combineReducers({
	subReddits,
	posts,
	comments,
});

export default entitiesReducer;
