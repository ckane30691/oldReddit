import React, { useState, useEffect } from 'react';
import { createVote } from '../../store/slices/entities/votes';
import { useDispatch } from 'react-redux';

export const VoteButton = (props) => {
	const dispatch = useDispatch();

	const handleVote = (e) => {
		e.preventDefault();
		if (e.target.innerText === '▲') {
			dispatch(createVote(1));
		} else {
			dispatch(createVote(-1));
		}
	};
	return (
		<div onClick={handleVote}>
			<button>▲</button>
			<button>▼</button>
		</div>
	);
};
