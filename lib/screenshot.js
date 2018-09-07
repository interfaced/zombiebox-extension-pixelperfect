goog.provide('zb.ext.pixelPerfect.ScreenShot');
goog.require('zb.html');



/**
 * @constructor
 */
zb.ext.pixelPerfect.ScreenShot = function() {
	this._image = null;
	this._source = '';
	this._renderTemplate();
};


/**
 * @param {string} URL
 */
zb.ext.pixelPerfect.ScreenShot.prototype.setSource = function(URL) {
	this._image.src = URL;
	this._source = URL;
};


/**
 * @return {string}
 */
zb.ext.pixelPerfect.ScreenShot.prototype.getSource = function() {
	return this._source;
};


/**
 * @param {number} x
 * @param {number} y
 */
zb.ext.pixelPerfect.ScreenShot.prototype.setPosition = function(x, y) {
	this._image.style.left = x + 'px';
	this._image.style.top = y + 'px';
};


/**
 * @return {{x: number, y: number}}
 */
zb.ext.pixelPerfect.ScreenShot.prototype.getPosition = function() {
	return {
		x: parseInt(this._image.style.left, 10) || 0,
		y: parseInt(this._image.style.top, 10) || 0
	};
};


/**
 * @param {number} opacity 0..1
 * @return {number}
 */
zb.ext.pixelPerfect.ScreenShot.prototype.setOpacity = function(opacity) {
	opacity = Math.max(0, Math.min(1, opacity));
	this._image.style.opacity = opacity;
	return opacity;
};


/**
 * @return {number} opacity 0..1
 */
zb.ext.pixelPerfect.ScreenShot.prototype.getOpacity = function() {
	return parseFloat(this._image.style.opacity) || 0;
};


/**
 * @return {HTMLElement}
 */
zb.ext.pixelPerfect.ScreenShot.prototype.getContainer = function() {
	return this._image;
};


/**
 * @protected
 */
zb.ext.pixelPerfect.ScreenShot.prototype._renderTemplate = function() {
	this._image = /** @type {HTMLImageElement} */(zb.html.node('img'));
	var style = this._image.style;
	style.position = 'absolute';
	style.top = '0';
	style.left = '0';
	style.zIndex = 999;
};


/**
 * @type {string}
 * @protected
 */
zb.ext.pixelPerfect.ScreenShot.prototype._source;


/**
 * @type {HTMLImageElement}
 * @protected
 */
zb.ext.pixelPerfect.ScreenShot.prototype._image;
