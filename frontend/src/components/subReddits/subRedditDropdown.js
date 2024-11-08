import React from 'react';
import { useSelector } from 'react-redux';

export const SubRedditDropDown = ({ setSubReddit }) => {
	let subReddits = useSelector((state) => state.entities.subReddits);
	subReddits = Object.values(subReddits);
	const update = (e) => {
		const val = e.currentTarget.value;
		setSubReddit(val);
	};

	return (
		<div>
			<select onChange={update} id="subRedditDropdown">
				<option key="sub-default" defaultValue={null}>
					Pick a subreddit to post to
				</option>
				{subReddits.map((subReddit) => {
					return (
						<option
							key={`sub-${subReddit.subRedditId}`}
							value={subReddit.title}
						>
							{subReddit.title}
						</option>
					);
				})}
			</select>
		</div>
	);
};
