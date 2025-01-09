import React, { useState } from 'react';
import { CommentForm } from './commentForm';
import { VoteButton } from '../votes/voteButton';
import { getTimeSincePost } from '../../util/timeSincePost';
import axios from 'axios';
require('./commentIndexItem.css');

export const CommentIndexItem = ({ comment, parentPath = '/', isReply }) => {
	// State to track loaded replies and nextPageToken for replies
	const [loadedReplies, setLoadedReplies] = useState(comment.replies || []);
	const [replyNextPageToken, setReplyNextPageToken] = useState(
		comment.replyNextPageToken || null
	);
	const [displayReplyForm, setDisplayReplyForm] = useState(false);
	const [loadingReplies, setLoadingReplies] = useState(false);

	const remainingReplies = comment.replyCount - loadedReplies.length;
	// Function to load more replies
	const loadMoreReplies = async () => {
		if (loadingReplies) return;

		if (remainingReplies || replyNextPageToken) {
			setLoadingReplies(true);

			const topLevelCommentId = comment.topLevelCommentId
				? comment.topLevelCommentId
				: comment.commentId;

			try {
				const res = await axios.get(
					`/api/comments/${comment.commentId}/replies`,
					{
						params: {
							pageToken: replyNextPageToken,
							parentPath,
							topLevelCommentId,
							depth: comment.depth,
						},
					}
				);

				// Update state with newly loaded replies
				setLoadedReplies((prevReplies) => [
					...prevReplies,
					...res.data?.replies,
				]);

				setReplyNextPageToken(res.data.replyNextPageToken);
			} catch (error) {
				console.error('Error loading more replies:', error);
			} finally {
				setLoadingReplies(false);
			}
		}
	};

	// Render child comments (replies)
	const renderChildComments = () => (
		<ul>
			{loadedReplies.map((reply, idx) => (
				<div
					className="comment-container reply-container"
					key={`comment${idx}`}
				>
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

	const displayForm = () => {
		setDisplayReplyForm(true);
	};

	return (
		<li className="comment-li">
			<h1 className="author small">
				{comment.author}{' '}
				<span className="time-since-post">{getTimeSincePost(comment)}</span>
			</h1>
			<div className="comment-body">{comment.body}</div>
			<button className="reply-button small" onClick={displayForm}>
				reply
			</button>

			{displayReplyForm && (
				<CommentForm
					setDisplayReplyForm={setDisplayReplyForm}
					postId={comment.postId}
					parentCommentId={comment.commentId}
					parentPath={comment.parentPath}
					depth={comment.depth}
					topLevelCommentId={comment.topLevelCommentId}
					onNewReply={handleNewReply}
				/>
			)}

			{renderChildComments()}

			{(replyNextPageToken || remainingReplies > 0) && (
				<button onClick={loadMoreReplies} disabled={loadingReplies}>
					{loadingReplies
						? 'Loading...'
						: `Load more comments (${remainingReplies} remaining)`}
				</button>
			)}
		</li>
	);
};
