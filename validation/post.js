const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validatePostInput(data) {
	let errors = {};
	data.title = !isEmpty(data.title) ? data.title : '';
	data.subReddit = !isEmpty(data.subReddit) ? data.subReddit : '';

	if (Validator.isEmpty(data.title)) {
		errors.title = 'Title field is required';
	}
	if (Validator.isEmpty(data.subReddit)) {
		errors.subId = 'You must choose a subReddit to post to';
	}
	return {
		errors,
		isValid: isEmpty(errors),
	};
};
