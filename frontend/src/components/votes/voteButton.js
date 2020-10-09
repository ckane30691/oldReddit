import React, { useState, useEffect } from 'react';
import { createVote } from '../../store/slices/entities/votes';
import { useDispatch } from 'react-redux';

export const VoteButton = (props) => {
	const dispatch = useDispatch();

	const handleVote = (e) => {
		e.preventDefault();
		let vote = { postId: props.postId };
		if (e.target.innerText === '▲') {
			vote.value = 1;
			dispatch(createVote(vote));
		} else {
			vote.value = -1;
			dispatch(createVote(vote));
		}
	};
	return (
		<div onClick={handleVote}>
			<button>▲</button>
			{props.voteCount}
			<button>▼</button>
		</div>
	);
};
