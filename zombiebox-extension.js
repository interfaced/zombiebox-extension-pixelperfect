var path = require('path');


/**
 * @constructor
 * @implements {IZBAddon}
 */
var Extension = function() {

};


/**
 * @return {string}
 */
Extension.prototype.getName = function() {
	return 'pixelperfect';
};


/**
 * @return {string}
 */
Extension.prototype.getPublicDir = function() {
	return path.join(__dirname, 'lib');
};


/**
 * @return {Object}
 */
Extension.prototype.getConfig = function() {
	return {};
};


/**
 * @type {IZBAddon}
 */
module.exports = Extension;
