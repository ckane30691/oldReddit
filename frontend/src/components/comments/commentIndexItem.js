import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// import { deleteComment } from '../../store/slices/entities/commentSlice';

export const CommentIndexItem = ({ comment }) => {
	const dispatch = useDispatch();
	// const handleDelete = async (e) => {
	// 	// let res;
	// 	e.preventDefault();
	// 	/*res =*/ await dispatch(deletePost(post._id));
	// };
	return (
		<li>
			{comment.body}
			{/* <button onClick={handleDelete}>Delete</button> */}
		</li>
	);
};
