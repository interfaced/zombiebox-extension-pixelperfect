const path = require('path');


/**
 * @constructor
 * @implements {IZBAddon}
 */
class ExtensionPixelPerfect {
	/**
	 * @override
	 */
	getName() {
		return 'pixelperfect';
	}

	/**
	 * @override
	 */
	getPublicDir() {
		return path.join(__dirname, 'lib');
	}

	/**
	 * @override
	 */
	getConfig() {
		return {};
	}
}

/**
 * @type {IZBAddon}
 */
module.exports = ExtensionPixelPerfect;
