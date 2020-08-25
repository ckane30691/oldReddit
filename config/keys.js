if (process.env.NODE_ENV === 'production') {
	module.exports = require('./keysProd');
} else {
	module.exports = require('./keysDev');
}
