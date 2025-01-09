import React from 'react';
// import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// import { deleteSubReddit } from '../../store/slices/entities/subRedditSlice';

export const SubRedditIndexItem = ({ subReddit }) => {
	// const dispatch = useDispatch();
	// const handleDelete = async (e) => {
	// 	// let res;
	// 	e.preventDefault();
	// 	/*res =*/ await dispatch(deleteSubReddit(subReddit.subRedditId));
	// };
	return (
		<li>
			<h1>
				<Link
					to={`/subReddits/${subReddit.title.split(' ').join('_')}#${
						subReddit.subRedditId
					}`}
				>
					{subReddit?.title?.toUpperCase()}
				</Link>{' '}
				-
			</h1>
		</li>
	);
};
