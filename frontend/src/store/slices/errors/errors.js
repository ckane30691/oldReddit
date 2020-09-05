import { combineReducers } from 'redux';
import sessionErrors from './sessionErrorsSlice';
import subRedditErrors from './subRedditErrorsSlice';
import postErrors from './postErrors';
const errorsReducer = combineReducers({
	sessionErrors,
	subRedditErrors,
	postErrors,
});

export default errorsReducer;
