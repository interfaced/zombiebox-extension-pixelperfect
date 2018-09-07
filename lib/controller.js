goog.provide('zb.ext.pixelPerfect.Controller');
goog.require('zb.IKeyHandler');
goog.require('zb.ext.pixelPerfect.UI');
goog.require('zb.ext.pixelPerfect.ScreenShot');
goog.require('zb.ext.pixelPerfect.IMarkupProvider');



/**
 * @param {HTMLElement} host
 * @constructor
 * @implements {zb.IKeyHandler}
 */
zb.ext.pixelPerfect.Controller = function(host) {
	this._currentPosition = 0;
	this._isVisible = false;
	this._screenshots = [];
	this._scrrenShot = null;
	this._sequence = [
		zb.device.input.Keys.DIGIT_7,
		zb.device.input.Keys.DIGIT_7,
		zb.device.input.Keys.DIGIT_1,
		zb.device.input.Keys.DIGIT_7,
		zb.device.input.Keys.DIGIT_7
	];
	this._createUI(host);
	this._setViewState({
		x: 0,
		y: 0,
		opacity: 0.5
	});
};


/**
 * Show PP UI and handle keys to perform manipulations with screenshot
 */
zb.ext.pixelPerfect.Controller.prototype.activate = function() {
	this._isVisible = true;
	this._ui.show();
	this._scrrenShot.getContainer().style.display = 'block';
};


/**
 * Hide PP UI
 */
zb.ext.pixelPerfect.Controller.prototype.deactivate = function() {
	this._isVisible = false;
	this._ui.hide();
	this._scrrenShot.getContainer().style.display = 'none';
};


/**
 * @param {zb.LayerManager} lm
 */
zb.ext.pixelPerfect.Controller.prototype.attachToLayerManager = function(lm) {
	lm.on(lm.EVENT_AFTER_SHOW, function(eventName, layer) {
		layer = /** @type {zb.layers.Layer} */(layer);
		if (typeof layer.getMarkupImage === 'function') {
			var mp = /** @type {zb.ext.pixelPerfect.IMarkupProvider} */(layer);
			this.setScreenShotUrl(mp.getMarkupImage());
		} else {
			this.setScreenShotUrl('');
		}
	}.bind(this));
};


/**
 * @param {string|Array.<string>} url
 */
zb.ext.pixelPerfect.Controller.prototype.setScreenShotUrl = function(url) {
	this._screenshots = url instanceof Array ? url : [url];
	this._renderScreenshot(this._screenshots[0]);
};


/**
 * @param {string} url
 */
zb.ext.pixelPerfect.Controller.prototype._renderScreenshot = function(url) {
	this._scrrenShot.setSource(url);
	this._ui.renderScreenshotValue(url);
};


/**
 * @param {Array.<zb.device.input.Keys>} seq
 */
zb.ext.pixelPerfect.Controller.prototype.setKeySequence = function(seq) {
	this._sequence = seq;
	this._currentPosition = 0;
};


/**
 * @inheritDoc
 */
zb.ext.pixelPerfect.Controller.prototype.processKey = function(zbKey, opt_e) {
	if (!this._isVisible) {
		var seq = this._sequence;
		this._currentPosition = this._currentPosition || 0;
		if (seq[this._currentPosition] !== zbKey) {
			this._currentPosition = 0;
		} else if (this._currentPosition === seq.length - 1) {
			this.activate();
			return true;
		} else {
			this._currentPosition++;
		}
	} else {
		if (zbKey === zb.device.input.Keys.BACK) {
			this.deactivate();
			return true;
		} else {
			return this._ui.processKey(zbKey, opt_e);
		}
	}
	return false;
};


/**
 * @param {HTMLElement} host
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._createUI = function(host) {
	this._scrrenShot = new zb.ext.pixelPerfect.ScreenShot();
	host.appendChild(this._scrrenShot.getContainer());
	this._scrrenShot.getContainer().style.display = 'none';
	this._ui = new zb.ext.pixelPerfect.UI(host);

	this._ui.on(this._ui.EVENT_CHANGE_OPACITY, function(eventName, changeDiff) {
		var step = zb.ext.pixelPerfect.Controller.OPACITY_STEP;
		this._setViewState({
			opacity: this._scrrenShot.getOpacity() + changeDiff * step
		});
	}.bind(this));

	this._ui.on(this._ui.EVENT_CHANGE_POSITION, function(eventName, positionChangeDiff) {
		positionChangeDiff = /** @type {zb.ext.pixelPerfect.UI.PositionDiff} */(positionChangeDiff);
		var position = this._scrrenShot.getPosition();
		var step = zb.ext.pixelPerfect.Controller.POSITION_STEP;
		if (positionChangeDiff.x) {
			position.x += step * positionChangeDiff.x;
		}
		if (positionChangeDiff.y) {
			position.y += step * positionChangeDiff.y;
		}
		this._setViewState({
			x: position.x,
			y: position.y
		});
	}.bind(this));

	this._ui.on(this._ui.EVENT_NEXT_SCREENSHOT, function() {
		if (this._screenshots.length > 1) {
			var nextIndex = this._screenshots.indexOf(this._scrrenShot.getSource()) + 1;
			if (nextIndex >= this._screenshots.length) {
				nextIndex = 0;
			}
			this._renderScreenshot(this._screenshots[nextIndex]);
		}
	}.bind(this));

	this._ui.on(this._ui.EVENT_TOGGLE, function() {
		var containerStyle = this._scrrenShot.getContainer().style;
		containerStyle.display = containerStyle.display === 'none' ? 'block' : 'none';
	}.bind(this));
};


/**
 * @param {{
 *      x: (number|undefined),
 *      y: (number|undefined),
 *      opacity: (number|undefined)
 * }} state
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._setViewState = function(state) {
	if (state.x !== undefined || state.y !== undefined) {
		var position = {
			x: state.x !== undefined ? state.x : this._scrrenShot.getPosition().x,
			y: state.y !== undefined ? state.y : this._scrrenShot.getPosition().y
		};
		this._scrrenShot.setPosition(position.x, position.y);
		this._ui.renderPositionValue(position.x, position.y);
	}

	if (state.opacity !== undefined) {
		state.opacity = this._scrrenShot.setOpacity(state.opacity);
		this._ui.renderOpacityValue(state.opacity);
	}
};


/**
 * @type {zb.ext.pixelPerfect.UI}
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._ui;


/**
 * @type {number}
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._currentPosition;


/**
 * Default value is '77177' like Z
 * @type {Array.<zb.device.input.Keys>}
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._sequence;


/**
 * @type {Array.<string>}
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._screenshots;


/**
 * @type {zb.ext.pixelPerfect.ScreenShot}
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._scrrenShot;


/**
 * @type {boolean}
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._isVisible;


/**
 * @const {number}
 */
zb.ext.pixelPerfect.Controller.OPACITY_STEP = 0.05;


/**
 * @const {number}
 */
zb.ext.pixelPerfect.Controller.POSITION_STEP = 1;
