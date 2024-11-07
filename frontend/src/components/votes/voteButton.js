import React, { useState } from 'react';
import { createVote } from '../../store/slices/entities/votes';
import { useDispatch } from 'react-redux';
require('./voteButton.css');

export const VoteButton = (props) => {
	const dispatch = useDispatch();
	const [voteCount, setVoteCount] = useState(props.netUpvotes);

	const handleVote = async (e) => {
		e.preventDefault();
		let vote;
		if (props.postId) {
			vote = { postId: props.postId };
		}
		vote = { ...vote, commentId: props.commentId };

		if (e.target.innerText === '▲') {
			vote.value = 1;
		} else {
			vote.value = -1;
		}
		let res = await dispatch(createVote(vote));
		setVoteCount(res.payload.netUpvotes);
	};

	return (
		<div className="vote-button" onClick={handleVote}>
			<button>▲</button>
			{voteCount}
			<button>▼</button>
		</div>
	);
};
