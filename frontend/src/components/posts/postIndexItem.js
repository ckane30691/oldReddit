import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deletePost } from '../../store/slices/entities/postSlice';
import { getTimeSincePost } from '../../util/timeSincePost';
require('./postIndexItem.css');

export const PostIndexItem = ({ post }) => {
	const dispatch = useDispatch();
	const handleDelete = async (e) => {
		// let res;
		e.preventDefault();
		/*res =*/ await dispatch(deletePost(post.postId));
	};

	return (
		<li className="link-container">
			<>
				<Link className="post-link" to={`/posts/${post.postId}`}>
					{post.title}
				</Link>
				<h2 className="post-submitted-info small">
					submitted {getTimeSincePost(post)} by{' '}
					<span className="author">{post.author}</span>
				</h2>
				<p className="post-comment-count small">
					{post.replyCount || 0}{' '}
					{post.replyCount === 1 ? 'comment' : 'comments'}
				</p>
				{/* <button onClick={handleDelete}>Delete</button> */}
			</>
		</li>
	);
};
