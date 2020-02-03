/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2015-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {node} from 'zb/html';


/**
 */
export default class ScreenShot {
	/**
	 */
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

		/**
		 * @type {boolean}
		 * @protected
		 */
		this._scale = false;

		/**
		 * @type {boolean}
		 * @protected
		 */
		this._invert = false;

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
		const normalizedOpacity = Math.max(0, Math.min(1, opacity));
		this._image.style.opacity = '' + normalizedOpacity;
		return normalizedOpacity;
	}

	/**
	 * @return {number} opacity 0..1
	 */
	getOpacity() {
		return parseFloat(this._image.style.opacity) || 0;
	}

	/**
	 * @param {boolean} condition
	 */
	setScale(condition) {
		if (condition) {
			this._image.style.width = '100%';
			this._image.style.height = '100%';
		} else {
			this._image.style.width = 'auto';
			this._image.style.height = 'auto';
		}

		this._scale = condition;
	}

	/**
	 * @return {boolean}
	 */
	isScaled() {
		return !this._scale;
	}

	/**
	 * @param {boolean} condition
	 */
	setInvert(condition) {
		this._image.style.filter = condition ? 'invert(100%)' : '';

		this._invert = condition;
	}

	/**
	 * @return {boolean}
	 */
	isInverted() {
		return !this._invert;
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
		this._image = /** @type {HTMLImageElement} */ (node('img'));
		const style = this._image.style;
		style.position = 'absolute';
		style.top = '0';
		style.left = '0';
		style.zIndex = 999;
	}
}
