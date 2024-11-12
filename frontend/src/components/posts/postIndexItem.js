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
				<h2>
					submitted {getTimeSincePost(post)} by {post.author}
				</h2>
				<p>
					{post.replyCount || 0}{' '}
					{post.replyCount === 1 ? 'comment' : 'comments'}
				</p>
				{/* <button onClick={handleDelete}>Delete</button> */}
			</>
		</li>
	);
};
