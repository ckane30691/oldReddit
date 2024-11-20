import React /*, { useState, useEffect, useRef } */ from 'react';
import {
	fetchPosts,
	clearPosts,
	selectPostArray,
} from '../../store/slices/entities/postSlice';
import { PostIndexItem } from './postIndexItem';
import { VoteButton } from '../votes/voteButton';
import PaginatedList from '../paginatedList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons';
require('./postIndex.css');

export const PostIndex = (props) => {
	const initialFilter = {
		view: 'Hot',
		subReddit: props.match.params.id.split('_')[0],
	};

	return (
		<>
			<h1 className="subReddit">{initialFilter.subReddit}</h1>
			<PaginatedList
				fetchAction={fetchPosts}
				clearAction={clearPosts}
				selectData={selectPostArray}
				initialFilter={initialFilter}
				entityName="posts"
				renderItem={(post, idx) => (
					<div className="post-container" key={`post${idx}`}>
						<span className="rank">{idx + 1}</span>
						<VoteButton postId={post.postId} netUpvotes={post.netUpvotes} />
						<FontAwesomeIcon size="2x" icon={faAlignLeft} />
						<PostIndexItem post={post} />
					</div>
				)}
			/>
		</>
	);
};
