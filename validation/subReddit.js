const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateSubRedditInput(data) {
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : '';
	data.desc = !isEmpty(data.desc) ? data.desc : '';

	if (Validator.isEmpty(data.title)) {
		errors.title = 'Title field is required';
		errors.desc = 'Description field is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
