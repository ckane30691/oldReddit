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
		let res;
		let postId = this.props.params.postId;
		e.preventDefault();
		let comment = {
			postId,
			body,
		};
		/*res = */ await dispatch(createComment(comment));
		// if ((res.type = 'receiveComment/fulfilled')) {
		// 	history.push('/home');
		// }
	};

	return (
		<form onSubmit={handleSubmit}>
			{/* <div className="errors">{renderErrors()}</div> */}
			<input
				required
				type="text"
				value={body}
				onChange={update('body')}
				placeholder="Enter Body"
			/>
			<input type="submit" value="Create Comment" />
		</form>
	);
};
