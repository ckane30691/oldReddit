import { combineReducers } from 'redux';
// import entities from './entities_reducer';
// import ui from './ui_reducer';
import session from './sessionSlice';
import errors from './sessionErrorsSlice';

const rootReducer = combineReducers({
	// entities,
	session,
	// ui,
	errors,
});

export default rootReducer;