import { combineReducers } from 'redux';
import subReddits from './subRedditSlice';

const entitiesReducer = combineReducers({
	subReddits,
});

export default entitiesReducer;
