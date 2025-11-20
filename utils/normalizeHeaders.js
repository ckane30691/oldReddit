const normalizeHeaders = (headers) => {
	return Object.fromEntries(
		Object.entries(headers || {}).map(([k, v]) => [k.toLowerCase(), v])
	);
};

module.exports = normalizeHeaders;
