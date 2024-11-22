import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPost } from '../../store/slices/entities/postSlice';
import { CommentIndex } from '../comments/commentIndex';
import { CommentForm } from '../comments/commentForm';
import { VoteButton } from '../votes/voteButton';
import { useSelector } from 'react-redux';
import {
	clearComments,
	fetchComments,
} from '../../store/slices/entities/commentSlice';
import { getTimeSincePost } from '../../util/timeSincePost';

export const PostShow = (props) => {
	let postId = props.match.params.id;
	const [hooksReady, setHooksReady] = useState(false);
	const post = useSelector(
		(state) => state?.entities?.posts[props?.match?.params?.id]
	);
	require('./postShow.css');

	const dispatch = useDispatch();

	useEffect(() => {
		const fetchOnePost = async () => {
			let postRes = await dispatch(fetchPost(postId));
			if (postRes.type === 'posts/fetchOne/fulfilled') {
				setHooksReady(true);
			}
		};

		setHooksReady(false);
		dispatch(clearComments());
		fetchOnePost();
	}, [dispatch, props.match.params.id]);

	if (!hooksReady) return <div>Loading...</div>;

	return (
		<>
			<h1 className="subReddit">r/{post.subReddit.split('_').join(' ')}</h1>
			<div className="post-show-container">
				<div className="post-comment-form-container">
					<div className="post-show">
						<VoteButton
							isPostVote="post-vote"
							postId={post.postId}
							netUpvotes={post.netUpvotes}
						/>
						<h1 className="post-title">{post.title}</h1>
						<h2 className="post-submitted-info">
							submitted {getTimeSincePost(post)} by{' '}
							<span className="author">{post.author}</span>
						</h2>
						<h2 className={post.body ? 'post-body' : ''}>{post.body}</h2>
					</div>

					<CommentForm postId={post.postId} />
					<h2>
						{post.replyCount || 0}{' '}
						{post.replyCount === 1 ? 'comment' : 'comments'}
					</h2>
				</div>
				<CommentIndex postId={post.postId} />
			</div>
		</>
	);
};
