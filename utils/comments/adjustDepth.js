const adjustDepth = (depth) => {
	let newDepth = parseInt(depth) - 1;
	if (newDepth < 10) {
		newDepth = `0${newDepth}`;
		return newDepth;
	}
	return String(newDepth);
};

module.exports = adjustDepth;
