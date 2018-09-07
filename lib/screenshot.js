goog.provide('zb.ext.pixelPerfect.ScreenShot');
goog.require('zb.html');



/**
 * @constructor
 */
zb.ext.pixelPerfect.ScreenShot = class {
	constructor() {
		/**
		 * @type {HTMLImageElement}
		 * @protected
		 */
		this._image = null;
		/**
		 * @type {string}
		 * @protected
		 */
		this._source = '';
		this._renderTemplate();
	}


	/**
	 * @param {string} URL
	 */
	setSource(URL) {
		this._image.src = URL;
		this._source = URL;
	}


	/**
	 * @return {string}
	 */
	getSource() {
		return this._source;
	}


	/**
	 * @param {number} x
	 * @param {number} y
	 */
	setPosition(x, y) {
		this._image.style.left = x + 'px';
		this._image.style.top = y + 'px';
	}


	/**
	 * @return {{x: number, y: number}}
	 */
	getPosition() {
		return {
			x: parseInt(this._image.style.left, 10) || 0,
			y: parseInt(this._image.style.top, 10) || 0
		};
	}


	/**
	 * @param {number} opacity 0..1
	 * @return {number}
	 */
	setOpacity(opacity) {
		opacity = Math.max(0, Math.min(1, opacity));
		this._image.style.opacity = opacity;
		return opacity;
	}


	/**
	 * @return {number} opacity 0..1
	 */
	getOpacity() {
		return parseFloat(this._image.style.opacity) || 0;
	}


	/**
	 * @return {HTMLElement}
	 */
	getContainer() {
		return this._image;
	}


	/**
	 * @protected
	 */
	_renderTemplate() {
		this._image = /** @type {HTMLImageElement} */(zb.html.node('img'));
		var style = this._image.style;
		style.position = 'absolute';
		style.top = '0';
		style.left = '0';
		style.zIndex = 999;
	}
};
