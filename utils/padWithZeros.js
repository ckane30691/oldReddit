const padWithZeros = (number, length) => {
	return number.toString().padStart(length, '0');
};

module.exports = padWithZeros;
