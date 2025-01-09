import React from 'react';
// import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// import { deletePost } from '../../store/slices/entities/postSlice';
import { getTimeSincePost } from '../../util/timeSincePost';
require('./postIndexItem.css');

export const PostIndexItem = ({ post }) => {
	// const dispatch = useDispatch();
	// const handleDelete = async (e) => {
	// 	// let res;
	// 	e.preventDefault();
	// 	/*res =*/ await dispatch(deletePost(post.postId));
	// };

	const renderTitleLink = () => {
		if (post.redirectLink) {
			return (
				<a className="post-link" target="blank" href={`${post.redirectLink}`}>
					{post.title}
				</a>
			);
		} else {
			return (
				<Link className="post-link" to={`/posts/${post.postId}`}>
					{post.title}
				</Link>
			);
		}
	};

	return (
		<li className="link-container">
			<>
				{renderTitleLink()}
				<h2 className="post-submitted-info small">
					submitted {getTimeSincePost(post)} by{' '}
					<span className="author">{post.author}</span>
				</h2>
				<Link className="post-comment-count small" to={`/posts/${post.postId}`}>
					{post.replyCount || 0}{' '}
					{post.replyCount === 1 ? 'comment' : 'comments'}
				</Link>
				{/* <button onClick={handleDelete}>Delete</button> */}
			</>
		</li>
	);
};
