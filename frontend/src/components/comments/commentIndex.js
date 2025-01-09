import {
	fetchComments,
	clearComments,
	selectCommentsArray,
} from '../../store/slices/entities/commentSlice'; // Import your comment actions and selectors
import { CommentIndexItem } from './commentIndexItem';
import { VoteButton } from '../votes/voteButton';
import PaginatedList from '../paginatedList';
require('./commentIndex.css');

export const CommentIndex = ({ postId }) => {
	const initialFilter = { view: 'Hot', postId: postId };

	return (
		<PaginatedList
			fetchAction={fetchComments}
			clearAction={clearComments}
			selectData={selectCommentsArray}
			initialFilter={initialFilter}
			entityName="comments"
			renderItem={(comment, idx) => (
				<div className="comment-container" key={`comment${idx}`}>
					<VoteButton
						commentId={comment.commentId}
						netUpvotes={comment.netUpvotes}
					/>
					<CommentIndexItem comment={comment} />
				</div>
			)}
		/>
	);
};
