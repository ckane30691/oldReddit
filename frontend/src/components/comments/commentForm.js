import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createComment } from '../../store/slices/entities/commentSlice';
// import { useHistory } from 'react-router-dom';

export const CommentForm = (props) => {
	// TODO: ADD EDIT FUNCTIONALITY TO FORM
	const dispatch = useDispatch();
	// let history = useHistory();

	// const commentErrors = useSelector((state) => state.errors.commentErrors);
	const [body, setBody] = useState('');

	const update = (field) => {
		return (e) => {
			const val = e.currentTarget.value;
			switch (field) {
				case 'body':
					setBody(val);
					break;
				default:
					return;
			}
		};
	};

	// const renderErrors = () => {
	// 	return (
	// 		<ul>
	// 			{commentErrors.map((error, idx) => (
	// 				<li key={`error-${idx}`}>{error}</li>
	// 			))}
	// 		</ul>
	// 	);
	// };

	const handleSubmit = async (e) => {
		let postId = props.postId;
		let parentCommentId = props.parentCommentId;
		e.preventDefault();
		let comment = {
			postId,
			body,
			parentCommentId,
		};
		let res = await dispatch(createComment(comment));
		if ((res.type = 'receiveComment/fulfilled')) {
			setBody('');
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			{/* <div className="errors">{renderErrors()}</div> */}
			<input
				required
				type="text"
				value={body}
				onChange={update('body')}
				placeholder="Enter Comment"
			/>
			<input type="submit" value="Create Comment" />
		</form>
	);
};
