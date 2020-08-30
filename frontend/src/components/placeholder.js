import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/sessionSlice';
import { SubRedditIndex } from './subReddits/subRedditIndex';

export const PlaceHolder = (props) => {
	const dispatch = useDispatch();

	const handleClick = () => {
		dispatch(logoutUser());
	};
	return (
		<div>
			<SubRedditIndex />
			<button onClick={handleClick}>LOG ME OUT</button>
		</div>
	);
};
