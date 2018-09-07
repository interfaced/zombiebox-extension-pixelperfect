goog.provide('zb.ext.pixelPerfect.UI');
goog.require('zb.IKeyHandler');
goog.require('zb.device.input.Keys');
goog.require('zb.events.EventPublisher');
goog.require('zb.ext.pixelPerfect.templates.UiOut');
goog.require('zb.ext.pixelPerfect.templates.ui');
goog.require('zb.html');


/**
 * @implements {zb.IKeyHandler}
 */
zb.ext.pixelPerfect.UI = class extends zb.events.EventPublisher {
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
		 * @type {zb.ext.pixelPerfect.templates.UiOut}
		 * @protected
		 */
		this._exported;

		/**
		 * Fired with: {zb.ext.pixelPerfect.UI.PositionDiff}
		 * @const {string}
		 */
		this.EVENT_CHANGE_POSITION = 'change-position';

		/**
		 * Fired with: {zb.ext.pixelPerfect.UI.ChangeDiff}
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
		const Keys = zb.device.input.Keys;
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
	 * @param {boolean} condition
	 */
	renderInvertValue(condition) {
		zb.html.text(this._exported.invert, condition ? 'true' : 'false');
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
