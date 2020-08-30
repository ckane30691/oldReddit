const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateSubRedditInput(data) {
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : '';
	data.subId = !isEmpty(data.subId) ? data.subId : '';

	if (Validator.isEmpty(data.title)) {
		errors.title = 'Title field is required';
		errors.subId = 'You must choose a subReddit to post to';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
