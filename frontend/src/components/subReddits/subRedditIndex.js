import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSubReddits } from '../../store/slices/entities/subRedditSlice';
import { SubRedditIndexItem } from './subRedditIndexItem';
require('./subRedditIndex.css');

export const SubRedditIndex = (props) => {
	const [hooksReady, setHooksReady] = useState(false);
	const [subReddits, setSubReddits] = useState([]);
	const dispatch = useDispatch();
	useEffect(() => {
		const fetchSubs = async () => {
			let res = await dispatch(fetchSubReddits());
			if (res.type === 'receiveSubReddits/fulfilled') {
				setSubReddits(Object.values(res.payload));
				setHooksReady(true);
			}
		};
		fetchSubs();
	}, [dispatch, subReddits]);
	if (!hooksReady) return <div></div>;

	const renderSubReddits = () => {
		return (
			<ul className="sub-reddit-container">
				{subReddits.map((subReddit, idx) => (
					<SubRedditIndexItem key={`sub${idx}`} subReddit={subReddit} />
				))}
			</ul>
		);
	};
	return (
		<div>
			{/* TODO: ADD MY SUBREDDITS DROPDOWN */}
			{renderSubReddits()}
		</div>
	);
};
