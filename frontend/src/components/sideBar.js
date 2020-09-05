import React from 'react';
import { Link } from 'react-router-dom';

export const SideBar = () => {
	return <Link to={'/posts/new'}>Submit a new text post</Link>;
};
