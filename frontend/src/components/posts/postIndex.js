import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../../store/slices/entities/postSlice';
import { PostIndexItem } from './postIndexItem';

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
			<ul>
				{posts.map((post, idx) => (
					<PostIndexItem key={`post${idx}`} post={post} />
				))}
			</ul>
		);
	};
	return renderPosts();
};
