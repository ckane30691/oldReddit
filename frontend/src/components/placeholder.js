import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../slices/sessionSlice';

export const PlaceHolder = (props) => {
	const dispatch = useDispatch();

	const handleClick = () => {
		dispatch(logoutUser());
	};
	return <button onClick={handleClick}>LOG ME OUT</button>;
};
