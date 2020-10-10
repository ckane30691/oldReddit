import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPost } from '../../store/slices/entities/postSlice';
import { CommentIndexItem } from '../comments/commentIndexItem';
import { CommentForm } from '../comments/commentForm';
import { VoteButton } from '../votes/voteButton';
import { useSelector } from 'react-redux';
import { clearComments } from '../../store/slices/entities/commentSlice';

export const PostShow = (props) => {
	let postId = props.match.params.id;
	const [hooksReady, setHooksReady] = useState(false);
	const [post, setPost] = useState({});
	const comments = useSelector((state) =>
		Object.values(state.entities.comments)
	);
	// const [statefulComments, setStatefulComments] = useState([]);

	const dispatch = useDispatch();
	useEffect(() => {
		let mounted = true;
		const fetchPostWithComments = async () => {
			let res = await dispatch(fetchPost(postId));
			if (mounted && res.type === 'receivePost/fulfilled') {
				setPost(res.payload);
				setHooksReady(true);
			}
		};
		if (post._id != postId) {
			dispatch(clearComments());
			fetchPostWithComments();
		}
		// cleanup function
		return () => (mounted = false);
	}, [post, dispatch, postId]);

	// useEffect(() => {
	// 	setStatefulComments(comments);
	// }, []);

	const renderComments = () => {
		return (
			<ul>
				{comments.map((comment, idx) => (
					<div className="comment-container" key={`comment${idx}`}>
						<VoteButton commentId={comment._id} voteCount={comment.voteCount} />
						<CommentIndexItem comment={comment} />
					</div>
				))}
			</ul>
		);
	};

	if (!hooksReady) return <div></div>;
	return (
		<div>
			<VoteButton postId={post._id} voteCount={post.voteCount} />
			<h1>{post.title}</h1>
			<h2>{post.body}</h2>
			<CommentForm postId={post._id} />
			{renderComments()}
		</div>
	);
};
