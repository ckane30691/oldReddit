import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../../store/slices/entities/postSlice';
import { PostIndexItem } from './postIndexItem';
import { VoteButton } from '../votes/voteButton';
require('./postIndex.css');

export const PostIndex = (props) => {
	const [hooksReady, setHooksReady] = useState(false);
	const [posts, setPosts] = useState([]);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchPostFromUseEffect = async () => {
			let res = await dispatch(fetchPosts());
			if (res.type === 'receivePosts/fulfilled') {
				setPosts(Object.values(res.payload));
				setHooksReady(true);
			}
		};
		fetchPostFromUseEffect();
	}, [dispatch]);

	if (!hooksReady) return <div></div>;

	const renderPosts = () => {
		return (
			<ul className="post-index">
				{posts.map((post, idx) => (
					<div className="post-container" key={`post${idx}`}>
						<VoteButton />
						<PostIndexItem post={post} />
					</div>
				))}
			</ul>
		);
	};
	return renderPosts();
};
