export const getTimeSincePost = (item) => {
	const postDate = new Date(item.createdAt); // Convert the createdAt string to a Date object
	const now = new Date(); // Get the current date and time
	const differenceInMilliseconds = now - postDate; // Difference in milliseconds

	const seconds = Math.floor(differenceInMilliseconds / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30); // Rough approximation
	const years = Math.floor(days / 365); // Rough approximation

	if (seconds < 60) {
		return `${seconds} seconds ago`;
	} else if (minutes < 60) {
		return `${minutes} minutes ago`;
	} else if (hours < 48) {
		return `${hours} hours ago`;
	} else if (days < 30) {
		return `${days} days ago`;
	} else if (months < 12) {
		return `${months} months ago`;
	} else {
		return `${years} years ago`;
	}
};
