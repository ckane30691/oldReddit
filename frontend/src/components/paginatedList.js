import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
require('./paginatedList.css');

const PaginatedList = ({
	fetchAction,
	clearAction,
	selectData,
	renderItem,
	initialFilter,
	entityName,
}) => {
	const [state, setState] = useState({
		filter: initialFilter, // Default filter passed as prop
		pageToken: null,
	});

	const [hooksReady, setHooksReady] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);

	const dispatch = useDispatch();
	const items = useSelector(selectData); // Use the memoized selector for posts or comments

	// Reset and update filter based on external changes (e.g., props.match.params.id)
	useEffect(() => {
		setHasFetched(false);
		dispatch(clearAction());
		setState((prevState) => ({
			...prevState,
			filter: initialFilter,
			pageToken: null,
		}));
	}, [initialFilter, dispatch, clearAction]);

	// Fetch data based on filter and pageToken
	useEffect(() => {
		const fetchData = async () => {
			if (hasFetched) return;
			setHasFetched(true);

			let res = await dispatch(
				fetchAction({ filter: state.filter, pageToken: state.pageToken })
			);
			console.log(state.pageToken);
			console.log(res);
			if (res.type === `${entityName}/fetchAll/fulfilled`) {
				if (res.payload.nextPageToken) {
					setState((prevState) => ({
						...prevState,
						pageToken: JSON.parse(res.payload.nextPageToken),
					}));
				}
				setHooksReady(true);
			}

			return () => {
				setHasFetched(false);
			};
		};

		fetchData();
	}, [
		dispatch,
		state.filter,
		state.pageToken,
		hasFetched,
		fetchAction,
		entityName,
	]);

	if (!hooksReady) return <div>Loading...</div>;

	// Load more data
	const loadMore = () => {
		setHasFetched(false);
		if (state.pageToken) {
			setState((prevState) => ({
				...prevState,
				pageToken: prevState.pageToken,
			}));
		}
	};

	// Handle filter change
	const handleFilterChange = (newView) => {
		setHasFetched(false);
		dispatch(clearAction());
		setState({
			filter: { ...state.filter, view: newView },
			pageToken: null,
		});
	};

	// Conditional class for button styling based on entity type
	const getButtonClass = () => {
		return entityName === 'posts'
			? 'post-filter-button'
			: 'comment-filter-button';
	};

	// Render list
	return (
		<div className="filter-container">
			{/* Filter buttons */}
			<div className={entityName.concat('-filters')}>
				<button
					className={getButtonClass()}
					onClick={() => handleFilterChange('Hot')}
				>
					Hot
				</button>
				<button
					className={getButtonClass()}
					onClick={() => handleFilterChange('New')}
				>
					New
				</button>
				<button
					className={getButtonClass()}
					onClick={() => handleFilterChange('Top')}
				>
					Top
				</button>
			</div>
			{/* Render the items */}

			<ul className={entityName.concat('-list')}>
				{items.map((item, idx) => renderItem(item, idx))}
			</ul>
			<button onClick={loadMore}>Load More</button>
		</div>
	);
};

export default PaginatedList;
