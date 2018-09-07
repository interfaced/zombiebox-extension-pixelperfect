goog.provide('zb.ext.pixelPerfect.UI');
goog.require('zb.IKeyHandler');
goog.require('zb.events.EventPublisher');
goog.require('zb.ext.pixelPerfect.templates.ui');
goog.require('zb.html');



/**
 * @param {HTMLElement} host
 * @constructor
 * @implements {zb.IKeyHandler}
 * @extends {zb.events.EventPublisher}
 */
zb.ext.pixelPerfect.UI = class extends zb.events.EventPublisher {
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
		 * @type {zb.ext.pixelPerfect.templates.UiOut}
		 * @protected
		 */
		this._exported;
		/**
		 * @const {string}
		 * Fired with: {zb.ext.pixelPerfect.UI.PositionDiff}
		 */
		this.EVENT_CHANGE_POSITION = 'change-position';
		/**
		 * @const {string}
		 * Fired with: {zb.ext.pixelPerfect.UI.ChangeDiff}
		 */
		this.EVENT_CHANGE_OPACITY = 'change-opacity';
		/**
		 * @const {string}
		 * Fired without arguments.
		 */
		this.EVENT_NEXT_SCREENSHOT = 'next-screenshot';
		/**
		 * @const {string}
		 * Fired without arguments.
		 */
		this.EVENT_TOGGLE = 'toggle';
		/**
		 * @const {string}
		 * Fired without arguments.
		 */
		this.EVENT_TOGGLE_SCALE = 'scale';

		this._renderTemplate();
		// initialize position
		this._togglePosition();
	}


	/**
	 * @param {string} URL
	 */
	renderScreenshotValue(URL) {
		zb.html.text(this._exported.screenshot, URL);
	}


	/**
	 * @param {number} x
	 * @param {number} y
	 */
	renderPositionValue(x, y) {
		zb.html.text(this._exported.X, '' + x);
		zb.html.text(this._exported.Y, '' + y);
	}


	/**
	 * @param {number} opacity 0..1
	 */
	renderOpacityValue(opacity) {
		zb.html.text(this._exported.opacity, Math.round(opacity * 100) + '%');
	}


	/**
	 * @param {boolean} condition
	 */
	renderScaleValue(condition) {
		zb.html.text(this._exported.scale, condition ? 'true' : 'false');
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
	 * @inheritDoc
	 */
	processKey(zbKey, opt_e) {
		var keys = zb.device.input.Keys;
		switch (zbKey) {
			case keys.RED:
				this._fireEvent(this.EVENT_CHANGE_OPACITY, -1);
				break;
			case keys.GREEN:
				this._fireEvent(this.EVENT_CHANGE_OPACITY, +1);
				break;
			case keys.YELLOW:
				this._fireEvent(this.EVENT_NEXT_SCREENSHOT);
				break;
			case keys.ENTER:
				this._fireEvent(this.EVENT_TOGGLE);
				break;
			case keys.BLUE:
				this._togglePosition();
				break;
			case keys.UP:
				this._fireEvent(this.EVENT_CHANGE_POSITION, {x: 0, y: -1});
				break;
			case keys.DOWN:
				this._fireEvent(this.EVENT_CHANGE_POSITION, {x: 0, y: +1});
				break;
			case keys.LEFT:
				this._fireEvent(this.EVENT_CHANGE_POSITION, {x: -1, y: 0});
				break;
			case keys.RIGHT:
				this._fireEvent(this.EVENT_CHANGE_POSITION, {x: +1, y: 0});
				break;
			case keys.DIGIT_0:
				this._fireEvent(this.EVENT_TOGGLE_SCALE);
				break;
			default:
				return false;
				break;
		}
		return true;
	}


	/**
	 * @protected
	 */
	_togglePosition() {
		var style = this._container.style;
		if (style.left === zb.ext.pixelPerfect.UI.HORIZONTAL_POSITION) {
			style.left = '';
			style.right = zb.ext.pixelPerfect.UI.HORIZONTAL_POSITION;
		} else {
			style.right = '';
			style.left = zb.ext.pixelPerfect.UI.HORIZONTAL_POSITION;
		}
	}


	/**
	 * @protected
	 */
	_renderTemplate() {
		this._exported = zb.ext.pixelPerfect.templates.ui({}, {});
		this._container = zb.html.findFirstElementNode(this._exported.root);
		this._host.appendChild(this._container);
		this._container.style.display = 'none';
	}
};


/**
 * @const {string}
 */
zb.ext.pixelPerfect.UI.HORIZONTAL_POSITION = '50px';


/**
 * @typedef {{x: zb.ext.pixelPerfect.UI.ChangeDiff, y: zb.ext.pixelPerfect.UI.ChangeDiff}}
 */
zb.ext.pixelPerfect.UI.PositionDiff;


/**
 * -1, 0 or +1
 * @typedef {number}
 */
zb.ext.pixelPerfect.UI.ChangeDiff;
