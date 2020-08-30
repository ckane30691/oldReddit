import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSubReddit } from '../../store/slices/entities/subRedditSlice';
import { useHistory } from 'react-router-dom';

export const SubRedditForm = (props) => {
	// TODO: ADD EDIT FUNCTIONALITY TO FORM
	const dispatch = useDispatch();
	let history = useHistory();

	const subRedditErrors = useSelector((state) => state.errors.subRedditErrors);
	const [title, setTitle] = useState('');
	const [desc, setDesc] = useState('');

	const update = (field) => {
		return (e) => {
			const val = e.currentTarget.value;
			switch (field) {
				case 'title':
					setTitle(val);
					break;
				case 'desc':
					setDesc(val);
					break;
				default:
					return;
			}
		};
	};

	const renderErrors = () => {
		return (
			<ul>
				{subRedditErrors.map((error, idx) => (
					<li key={`error-${idx}`}>{error}</li>
				))}
			</ul>
		);
	};

	const handleSubmit = async (e) => {
		let res;
		e.preventDefault();
		let subReddit = {
			title,
			desc,
		};
		res = await dispatch(createSubReddit(subReddit));
		if ((res.type = 'receiveSubReddit/fulfilled')) {
			history.push('/home');
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="errors">{renderErrors()}</div>
			<input
				required
				type="text"
				value={title}
				onChange={update('title')}
				placeholder="Enter Title"
			/>
			<input
				required
				type="text"
				value={desc}
				onChange={update('desc')}
				placeholder="Enter Description"
			/>
			<input type="submit" value="Create SubReddit" />
		</form>
	);
};
