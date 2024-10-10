import React from 'react';
import { useSelector } from 'react-redux';

export const SubRedditDropDown = (props) => {
	let subReddits = useSelector((state) => state.entities.subReddits);
	subReddits = Object.values(subReddits);
	const update = (e) => {
		const val = e.currentTarget.value;
		props.setSubRedditId(val);
	};

	return (
		<div>
			<select onChange={update} id="subRedditDropdown">
				<option key="sub-default" defaultValue={null}>
					Pick a subreddit to post to
				</option>
				{subReddits.map((subReddit) => {
					return (
						<option key={`sub-${subReddit._id}`} value={subReddit._id}>
							{subReddit.title}
						</option>
					);
				})}
			</select>
		</div>
	);
};
