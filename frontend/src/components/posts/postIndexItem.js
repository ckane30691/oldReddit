import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deletePost } from '../../store/slices/entities/postSlice';
require('./postIndexItem.css');

export const PostIndexItem = ({ post }) => {
	const dispatch = useDispatch();
	const handleDelete = async (e) => {
		// let res;
		e.preventDefault();
		/*res =*/ await dispatch(deletePost(post.postId));
	};

	const getTimeSincePost = () => {
		const postDate = new Date(post.createdAt); // Convert the createdAt string to a Date object
		const now = new Date(); // Get the current date and time
		const differenceInMilliseconds = now - postDate; // Difference in milliseconds

		const seconds = Math.floor(differenceInMilliseconds / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const months = Math.floor(days / 30); // Rough approximation
		const years = Math.floor(days / 365); // Rough approximation

		if (seconds < 60) {
			return `${seconds} seconds ago`;
		} else if (minutes < 60) {
			return `${minutes} minutes ago`;
		} else if (hours < 48) {
			return `${hours} hours ago`;
		} else if (days < 30) {
			return `${days} days ago`;
		} else if (months < 12) {
			return `${months} months ago`;
		} else {
			return `${years} years ago`;
		}
	};

	return (
		<li className="link-container">
			<>
				<Link className="post-link" to={`/posts/${post.postId}`}>
					{post.title}
				</Link>
				<h2>
					submitted {getTimeSincePost()} by {post.author}
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
