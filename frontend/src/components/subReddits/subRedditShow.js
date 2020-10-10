import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSubReddit } from '../../store/slices/entities/subRedditSlice';
import { PostIndexItem } from '../posts/postIndexItem';
import { VoteButton } from '../votes/voteButton';

export const SubRedditShow = (props) => {
	let subRedditId = props.match.params.id;
	const [hooksReady, setHooksReady] = useState(false);
	const [subReddit, setSubReddit] = useState({});

	const dispatch = useDispatch();

	useEffect(() => {
		let mounted = true;
		const fetchSubWithPosts = async () => {
			let res = await dispatch(fetchSubReddit(subRedditId));
			if (mounted && res.type === 'receiveSubReddit/fulfilled') {
				setSubReddit(res.payload);
				setHooksReady(true);
			}
		};
		if (subReddit['_id'] != props.match.params.id) {
			fetchSubWithPosts();
		}
		// cleanup function
		return () => (mounted = false);
	}, [subReddit, dispatch, subRedditId]);

	if (!hooksReady) return <div></div>;

	const renderPosts = () => {
		return (
			<ul>
				{subReddit.posts.map((post, idx) => (
					<div className="post-container" key={`post${idx}`}>
						<VoteButton postId={post._id} voteCount={post.voteCount} />
						<PostIndexItem post={post} />
					</div>
				))}
			</ul>
		);
	};

	return (
		<div>
			<h1>{subReddit.title}</h1>
			<h2>{subReddit.desc}</h2>
			{renderPosts()}
		</div>
	);
};
