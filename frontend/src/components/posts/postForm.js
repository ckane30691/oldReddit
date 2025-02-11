import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPost } from '../../store/slices/entities/postSlice';
import { useHistory } from 'react-router-dom';
import { SubRedditDropDown } from '../subReddits/subRedditDropdown';
require('./postForm.css');

export const PostForm = (props) => {
	// TODO: ADD EDIT FUNCTIONALITY TO FORM
	// TODO: SPLIT FORM UP SO USERS CAN SUBMIT TEXT OR LINK/PHOTO UPLOADS
	const dispatch = useDispatch();
	let history = useHistory();

	const postErrors = useSelector((state) => state.errors.postErrors);
	const [title, setTitle] = useState('');
	const [url, setUrl] = useState('');
	const [body, setBody] = useState('');
	const [subReddit, setSubReddit] = useState('');
	// TODO: Write <SubredditDropdown />

	const update = (field) => {
		return (e) => {
			const val = e.currentTarget.value;
			switch (field) {
				case 'title':
					setTitle(val);
					break;
				case 'body':
					setBody(val);
					break;
				case 'url':
					setUrl(val);
					break;
				default:
					return;
			}
		};
	};

	const renderErrors = () => {
		return (
			<ul>
				{postErrors.map((error, idx) => (
					<li key={`error-${idx}`}>{Object.values(error)}</li>
				))}
			</ul>
		);
	};

	const handleSubmit = async (e) => {
		let res;
		e.preventDefault();
		let post = {
			title,
			body,
			redirectLink: url,
			subReddit,
		};
		res = await dispatch(createPost(post));
		if (res.type === 'posts/create/fulfilled') {
			history.push(`/posts/${res.payload.postId}`);
		}
	};
	return (
		<form className="post-form" onSubmit={handleSubmit}>
			<div className="errors">{renderErrors()}</div>
			<SubRedditDropDown setSubReddit={setSubReddit} />
			<textarea
				className="post-text-area title-link"
				required
				type="text"
				value={title}
				onChange={update('title')}
				placeholder="Enter Title"
			/>
			<textarea
				className="post-text-area title-link"
				type="text"
				value={url}
				onChange={update('url')}
				placeholder="Enter Url (Optional)"
			/>
			<textarea
				className="post-text-area post-body-area"
				type="text"
				value={body}
				onChange={update('body')}
				placeholder="Enter Body"
			/>
			<input
				className="comment-button post-form-button"
				type="submit"
				value="Create Post"
			/>
		</form>
	);
};
