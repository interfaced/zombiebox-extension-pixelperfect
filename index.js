const path = require('path');


/**
 * @implements {IZBAddon}
 */
class PixelPerfectExtension {
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
module.exports = PixelPerfectExtension;
