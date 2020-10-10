const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateCommentInput(data) {
	let errors = {};

	data.postId = !isEmpty(data.postId) ? data.postId : '';
	data.body = !isEmpty(data.body) ? data.body : '';

	if (Validator.isEmpty(data.postId)) {
		errors.postId = 'A post ID is required';
	}
	if (Validator.isEmpty(data.body)) {
		errors.body = 'A body is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
