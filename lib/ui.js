/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2015-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {render, Out} from 'generated/cutejs/pixelperfect/ui.jst';
import {findFirstElementNode, text} from 'zb/html';
import IKeyHandler from 'zb/interfaces/i-key-handler';
import Keys from 'zb/device/input/keys';
import EventPublisher from 'zb/events/event-publisher';


/**
 * @implements {IKeyHandler}
 */
export default class UI extends EventPublisher {
	/**
	 * @param {HTMLElement} host
	 */
	constructor(host) {
		super();

		/**
		 * @type {HTMLElement}
		 * @protected
		 */
		this._host = host;

		/**
		 * @type {HTMLElement}
		 * @protected
		 */
		this._container = null;

		/**
		 * @type {Out}
		 * @protected
		 */
		this._exported;

		/**
		 * Fired with: {PositionDiff}
		 * @const {string}
		 */
		this.EVENT_CHANGE_POSITION = 'change-position';

		/**
		 * Fired with: {ChangeDiff}
		 * @const {string}
		 */
		this.EVENT_CHANGE_OPACITY = 'change-opacity';

		/**
		 * Fired with: no arguments.
		 * @const {string}
		 */
		this.EVENT_NEXT_SCREENSHOT = 'next-screenshot';

		/**
		 * Fired with: no arguments.
		 * @const {string}
		 */
		this.EVENT_TOGGLE = 'toggle';

		/**
		 * Fired with: no arguments.
		 * @const {string}
		 */
		this.EVENT_TOGGLE_SCALE = 'scale';

		/**
		 * Fired with: no arguments.
		 * @const {string}
		 */
		this.EVENT_INVERT = 'invert';

		this._renderTemplate();
		// initialize position
		this._togglePosition();
	}

	/**
	 * @override
	 */
	processKey(zbKey) {
		switch (zbKey) {
			case Keys.RED:
				this._fireEvent(this.EVENT_CHANGE_OPACITY, -1);
				break;
			case Keys.GREEN:
				this._fireEvent(this.EVENT_CHANGE_OPACITY, +1);
				break;
			case Keys.YELLOW:
				this._fireEvent(this.EVENT_NEXT_SCREENSHOT);
				break;
			case Keys.ENTER:
				this._fireEvent(this.EVENT_TOGGLE);
				break;
			case Keys.BLUE:
				this._togglePosition();
				break;
			case Keys.UP:
				this._fireEvent(this.EVENT_CHANGE_POSITION, {x: 0, y: -1});
				break;
			case Keys.DOWN:
				this._fireEvent(this.EVENT_CHANGE_POSITION, {x: 0, y: +1});
				break;
			case Keys.LEFT:
				this._fireEvent(this.EVENT_CHANGE_POSITION, {x: -1, y: 0});
				break;
			case Keys.RIGHT:
				this._fireEvent(this.EVENT_CHANGE_POSITION, {x: +1, y: 0});
				break;
			case Keys.DIGIT_0:
				this._fireEvent(this.EVENT_TOGGLE_SCALE);
				break;
			case Keys.DIGIT_1:
				this._fireEvent(this.EVENT_INVERT);
				break;
			default:
				return false;
		}
		return true;
	}

	/**
	 * @param {string} URL
	 */
	renderScreenshotValue(URL) {
		text(this._exported.screenshot, URL);
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	renderPositionValue(x, y) {
		text(this._exported.X, '' + x);
		text(this._exported.Y, '' + y);
	}

	/**
	 * @param {number} opacity 0..1
	 */
	renderOpacityValue(opacity) {
		text(this._exported.opacity, Math.round(opacity * 100) + '%');
	}

	/**
	 * @param {boolean} condition
	 */
	renderScaleValue(condition) {
		text(this._exported.scale, condition ? 'true' : 'false');
	}

	/**
	 * @param {boolean} condition
	 */
	renderInvertValue(condition) {
		text(this._exported.invert, condition ? 'true' : 'false');
	}

	/**
	 * Show UI
	 */
	show() {
		this._container.style.display = 'block';
	}

	/**
	 * Hide UI
	 */
	hide() {
		this._container.style.display = 'none';
	}

	/**
	 * @protected
	 */
	_togglePosition() {
		const style = this._container.style;
		if (style.left === HORIZONTAL_POSITION) {
			style.left = '';
			style.right = HORIZONTAL_POSITION;
		} else {
			style.right = '';
			style.left = HORIZONTAL_POSITION;
		}
	}

	/**
	 * @protected
	 */
	_renderTemplate() {
		this._exported = render({}, {});
		this._container = findFirstElementNode(this._exported.root);
		this._host.appendChild(this._container);
		this._container.style.display = 'none';
	}
}


/**
 * @const {string}
 */
export const HORIZONTAL_POSITION = '50px';


/**
 * @typedef {{x: ChangeDiff, y: ChangeDiff}}
 */
export let PositionDiff;


/**
 * -1, 0 or +1
 * @typedef {number}
 */
export let ChangeDiff;
