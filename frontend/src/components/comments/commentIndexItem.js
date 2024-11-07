import React, { useState } from 'react';
import { CommentForm } from './commentForm';
import { VoteButton } from '../votes/voteButton';
import axios from 'axios';

export const CommentIndexItem = ({ comment, parentPath = '/' }) => {
	// State to track loaded replies and nextPageToken for replies
	const [loadedReplies, setLoadedReplies] = useState(comment.replies || []);
	const [replyNextPageToken, setReplyNextPageToken] = useState(
		comment.replyNextPageToken || null
	);
	const [loadingReplies, setLoadingReplies] = useState(false);

	// Function to load more replies
	const loadMoreReplies = async () => {
		if (!replyNextPageToken || loadingReplies) return;

		setLoadingReplies(true);

		try {
			const res = await axios.get(
				`/api/comments/${comment.commentId}/replies`,
				{
					params: {
						pageToken: replyNextPageToken,
						parentPath,
					},
				}
			);

			// Update state with newly loaded replies
			setLoadedReplies((prevReplies) => [...prevReplies, ...res.data?.replies]);

			setReplyNextPageToken(res.data.replyNextPageToken);
		} catch (error) {
			console.error('Error loading more replies:', error);
		} finally {
			setLoadingReplies(false);
		}
	};

	// Render child comments (replies)
	const renderChildComments = () => (
		<ul>
			{loadedReplies.map((reply, idx) => (
				<div className="comment-container" key={`comment${idx}`}>
					<VoteButton
						commentId={reply.commentId}
						netUpvotes={reply.netUpvotes}
					/>
					<CommentIndexItem
						key={`com${idx}`}
						comment={reply}
						parentPath={comment.parentPath}
					/>
				</div>
			))}
		</ul>
	);

	const handleNewReply = (newReply) => {
		setLoadedReplies((prevReplies) => [...prevReplies, newReply]);
	};

	return (
		<li>
			<div className="comment-body">{comment.body}</div>

			<CommentForm
				postId={comment.postId}
				parentCommentId={comment.commentId}
				parentPath={comment.parentPath}
				onNewReply={handleNewReply}
			/>

			{renderChildComments()}

			{replyNextPageToken && (
				<button onClick={loadMoreReplies} disabled={loadingReplies}>
					{loadingReplies ? 'Loading...' : 'Load more replies'}
				</button>
			)}
		</li>
	);
};
