import { combineReducers } from 'redux';
import sessionErrors from './sessionErrorsSlice';
import subRedditErrors from './subRedditErrors';

const errorsReducer = combineReducers({
	sessionErrors,
	subRedditErrors,
});

export default errorsReducer;
