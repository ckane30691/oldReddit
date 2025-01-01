const easyParse = (item) => {
	return typeof item === 'string' ? JSON.parse(item) : item;
};

module.exports = easyParse;
