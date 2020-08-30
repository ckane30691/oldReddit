import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSubReddits } from '../../store/slices/entities/subRedditSlice';
import { SubRedditIndexItem } from './subRedditIndexItem';

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
	}, []);
	if (!hooksReady) return <div></div>;

	const renderSubReddits = () => {
		return (
			<ul>
				{subReddits.map((subReddit, idx) => (
					<SubRedditIndexItem key={`sub${idx}`} subReddit={subReddit} />
				))}
			</ul>
		);
	};
	return renderSubReddits();
};
