import React from 'react';
// import { useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
import { CommentForm } from './commentForm';
// import { deleteComment } from '../../store/slices/entities/commentSlice';

export const CommentIndexItem = ({ comment }) => {
	// const dispatch = useDispatch();
	// const handleDelete = async (e) => {
	// 	// let res;
	// 	e.preventDefault();
	// 	/*res =*/ await dispatch(deletePost(post._id));
	// };

	const renderChildComments = () => (
		<ul className="sub-reddit-container">
			{comment.children &&
				comment.children.map((comment, idx) => (
					<CommentIndexItem key={`com${idx}`} comment={comment} />
				))}
		</ul>
	);
	return (
		<li>
			{comment.body}
			<CommentForm postId={comment.postId} parentCommentId={comment._id} />
			{renderChildComments()}
			{/* <button onClick={handleDelete}>Delete</button> */}
		</li>
	);
};
