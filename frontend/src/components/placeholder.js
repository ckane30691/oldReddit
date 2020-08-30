import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/sessionSlice';
import { SubRedditIndex } from './subReddits/subRedditIndex';
import { SubRedditForm } from './subReddits/subRedditForm';
export const PlaceHolder = (props) => {
	const dispatch = useDispatch();

	const handleClick = () => {
		dispatch(logoutUser());
	};
	return (
		<div>
			<SubRedditForm />
			<SubRedditIndex />
			<button onClick={handleClick}>LOG ME OUT</button>
		</div>
	);
};
