import React from 'react';
// import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// import { deletePost } from '../../store/slices/entities/postSlice';
require('./postIndexItem.css');

export const PostIndexItem = ({ post }) => {
	// const dispatch = useDispatch();
	// const handleDelete = async (e) => {
	// 	// let res;
	// 	e.preventDefault();
	// 	/*res =*/ await dispatch(deletePost(post._id));
	// };
	return (
		<li className="link-container">
			<h1>
				<Link className="post-link" to={`/posts/${post._id}`}>
					{post.title}
				</Link>
				{/* <button onClick={handleDelete}>Delete</button> */}
			</h1>
		</li>
	);
};
