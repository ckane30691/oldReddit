import React, { useState, useEffect } from 'react';
import { createVote } from '../../store/slices/entities/votes';
import { useDispatch } from 'react-redux';
import {
	loadVoteCache,
	getCachedVote,
	addVoteToCache,
	evictCachedVote,
} from '../../util/LRUCache';
require('./voteButton.css');

export const VoteButton = (props) => {
	const dispatch = useDispatch();
	const [voteCount, setVoteCount] = useState(props.netUpvotes);
	const [hasVoted, setHasVoted] = useState(0);
	const VOTE_CACHE_KEY = 'userVoteCache';

	// Load initial vote state based on cache (runs on component mount)
	useEffect(() => {
		const cache = loadVoteCache(VOTE_CACHE_KEY);
		const cachedVote = getCachedVote(cache, props);

		if (cachedVote) {
			setHasVoted(cachedVote.value);
		}
	}, [props.postId, props.commentId]);

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

		const res = await dispatch(createVote(vote));
		addVoteToCache(vote, VOTE_CACHE_KEY);
		if (res.payload.value === 1) {
			setHasVoted(1);
			setVoteCount(voteCount + 1); // Increase by 1 for upvote
		} else if (res.payload.value === -1) {
			setHasVoted(-1);
			setVoteCount(voteCount - 1); // Decrease by 1 for downvote
		} else {
			// you already voted
			setHasVoted(0);
			setVoteCount(voteCount - vote.value);
			evictCachedVote(vote, VOTE_CACHE_KEY);
		}
	};

	const getClassName = (el) => {
		if (hasVoted === 1) {
			return el === 'count' || el === 'up' ? 'upVoted' : '';
		} else if (hasVoted === -1) {
			return el === 'count' || el === 'down' ? 'downVoted' : '';
		}
	};

	return (
		<div className="vote-button" onClick={handleVote}>
			<button className={getClassName('up')}>▲</button>
			<span className={getClassName('count')}>{voteCount}</span>
			<button className={getClassName('down')}>▼</button>
		</div>
	);
};
