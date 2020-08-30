const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateCommentInput(data) {
	let errors = {};

	data.postId = !isEmpty(data.postId) ? data.postId : '';
	data.body = !isEmpty(data.body) ? data.body : '';

	if (Validator.isEmpty(data.title)) {
		errors.postId = 'A post ID is required';
		errors.body = 'A body is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
