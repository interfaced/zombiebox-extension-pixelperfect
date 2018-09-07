var path = require('path');


/**
 * @constructor
 * @implements {IZBAddon}
 */
var Extension = class {

	/**
	 * @override
	 */
	getName() {
		return 'pixelperfect';
	}


	/**
	 * @return {string}
	 */
	getPublicDir() {
		return path.join(__dirname, 'lib');
	}


	/**
	 * @return {Object}
	 */
	getConfig() {
		return {};
	}
};

/**
 * @type {IZBAddon}
 */
module.exports = Extension;
