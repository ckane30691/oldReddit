import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubReddit } from '../../store/slices/entities/subRedditSlice';

export const SubRedditShow = (props) => {
	let subRedditId = props.match.params.id;
	const subReddit = useSelector(
		(state) => state.entities.subReddits[subRedditId]
	);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(fetchSubReddit(subRedditId));
	}, []);
	return (
		<div>
			<h1>{subReddit.title}</h1>
			<h2>{subReddit.desc}</h2>
		</div>
	);
};
