import { combineReducers } from 'redux';
import entities from './entities/entities';
// import ui from './ui_reducer';
import session from './sessionSlice';
import errors from './errors/errors';

const rootReducer = combineReducers({
	entities,
	session,
	// ui,
	errors,
});

export default rootReducer;
