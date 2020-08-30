import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSubReddit } from '../../store/slices/entities/subRedditSlice';
import { withRouter } from 'react-router-dom';

const SubRedditShow = (props) => {
	let subRedditId = props.match.params.id;
	const [hooksReady, setHooksReady] = useState(false);
	const [subReddit, setSubReddit] = useState({});

	const dispatch = useDispatch();

	useEffect(() => {
		let mounted = true;
		const fetchSub = async () => {
			let res = await dispatch(fetchSubReddit(subRedditId));
			if (mounted && res.type === 'receiveSubReddit/fulfilled') {
				setSubReddit(res.payload);
				setHooksReady(true);
			}
		};
		fetchSub();
		return () => (mounted = false);
	}, [subReddit, dispatch, subRedditId]);

	if (!hooksReady) return <div></div>;

	return (
		<div>
			<h1>{subReddit.title}</h1>
			<h2>{subReddit.desc}</h2>
		</div>
	);
};

export default withRouter(SubRedditShow);
