goog.provide('zb.ext.pixelPerfect.Controller');
goog.require('zb.IKeyHandler');
goog.require('zb.ext.pixelPerfect.UI');
goog.require('zb.ext.pixelPerfect.ScreenShot');
goog.require('zb.ext.pixelPerfect.IMarkupProvider');



/**
 * @constructor
 * @implements {zb.IKeyHandler}
 */
zb.ext.pixelPerfect.Controller = function() {
	this._onChildLayerShown = this._onChildLayerShown.bind(this);
	this._onChildLayerHidden = this._onChildLayerHidden.bind(this);
	this._currentPosition = 0;
	this._currentLayer = null;
	this._container = null;
	this._isVisible = false;
	this._screenshots = [];
	this._screenShot = null;
	this._sequence = [
		zb.device.input.Keys.DIGIT_7,
		zb.device.input.Keys.DIGIT_7,
		zb.device.input.Keys.DIGIT_1,
		zb.device.input.Keys.DIGIT_7,
		zb.device.input.Keys.DIGIT_7
	];
	this._createUI();
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
	this._screenShot.getContainer().style.display = 'block';
	// workaround for getting EVENT_AFTER_SHOW event on app start
	this._bindToLayer(app.getCurrentLayer());
	this._container.style.display = 'block';
};


/**
 * Hide PP UI
 */
zb.ext.pixelPerfect.Controller.prototype.deactivate = function() {
	this._isVisible = false;
	this._ui.hide();
	this._screenShot.getContainer().style.display = 'none';
	this._container.style.display = 'none';
};


/**
 * @param {zb.Application} app
 */
zb.ext.pixelPerfect.Controller.prototype.attachToApp = function(app) {
	this._getAppProperty(function() {
			return this._getAppBody(app);
		}.bind(this), app, app.EVENT_DOM_READY)
		.then(function(appBody) {
			appBody.appendChild(this._container);
		}.bind(this));

	this._getAppProperty(function() {
			return app.getLayerManager();
		}, app, app.EVENT_DEVICE_READY)
		.then(function(lm) {
			lm.on(lm.EVENT_AFTER_SHOW, function(eventName, layer) {
				layer = /** @type {zb.layers.Layer} */(layer);
				this._bindToLayer(layer);
			}.bind(this));
			this._bindToLayer(app.getCurrentLayer());
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
			this._currentPosition = 0;
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
 * @param {string} url
 */
zb.ext.pixelPerfect.Controller.prototype._renderScreenshot = function(url) {
	this._screenShot.setSource(url);
	this._ui.renderScreenshotValue(url);
};


/**
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._createUI = function() {
	this._createContainer();
	this._screenShot = new zb.ext.pixelPerfect.ScreenShot();
	this._container.appendChild(this._screenShot.getContainer());
	this._screenShot.getContainer().style.display = 'none';
	this._ui = new zb.ext.pixelPerfect.UI(this._container);

	this._ui.on(this._ui.EVENT_CHANGE_OPACITY, function(eventName, changeDiff) {
		var step = zb.ext.pixelPerfect.Controller.OPACITY_STEP;
		this._setViewState({
			opacity: this._screenShot.getOpacity() + changeDiff * step
		});
	}.bind(this));

	this._ui.on(this._ui.EVENT_CHANGE_POSITION, function(eventName, positionChangeDiff) {
		positionChangeDiff = /** @type {zb.ext.pixelPerfect.UI.PositionDiff} */(positionChangeDiff);
		var position = this._screenShot.getPosition();
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
			var nextIndex = this._screenshots.indexOf(this._screenShot.getSource()) + 1;
			if (nextIndex >= this._screenshots.length) {
				nextIndex = 0;
			}
			this._renderScreenshot(this._screenshots[nextIndex]);
		}
	}.bind(this));

	this._ui.on(this._ui.EVENT_TOGGLE, function() {
		var containerStyle = this._screenShot.getContainer().style;
		containerStyle.display = containerStyle.display === 'none' ? 'block' : 'none';
	}.bind(this));
};


/**
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._createContainer = function() {
	this._container = zb.html.div();
	var containerStyle = this._container.style;
	containerStyle.position = 'absolute';
	containerStyle.top = '0';
	containerStyle.left = '0';
	containerStyle.width = '100%';
	containerStyle.height = '100%';
	containerStyle.zIndex = 1000;
	containerStyle.display = 'none';
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
			x: state.x !== undefined ? state.x : this._screenShot.getPosition().x,
			y: state.y !== undefined ? state.y : this._screenShot.getPosition().y
		};
		this._screenShot.setPosition(position.x, position.y);
		this._ui.renderPositionValue(position.x, position.y);
	}

	if (state.opacity !== undefined) {
		state.opacity = this._screenShot.setOpacity(state.opacity);
		this._ui.renderOpacityValue(state.opacity);
	}
};


/**
 * @param {string} eventName
 * @param {zb.layers.Layer} layer
 * @private
 */
zb.ext.pixelPerfect.Controller.prototype._onChildLayerShown = function(eventName, layer) {
	this._showScreenshotsFromLayer(layer);
};


/**
 * @param {string} eventName
 * @param {zb.layers.Layer} layer
 * @private
 */
zb.ext.pixelPerfect.Controller.prototype._onChildLayerHidden = function(eventName, layer) {
	this._showScreenshotsFromLayer(this._currentLayer);
};


/**
 * @param {zb.layers.Layer} layer
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._bindToLayer = function(layer) {
	if (this._currentLayer) {
		this._currentLayer.off(this._currentLayer.EVENT_CHILD_LAYER_SHOWN, this._onChildLayerShown);
		this._currentLayer.off(this._currentLayer.EVENT_CHILD_LAYER_HIDDEN, this._onChildLayerHidden);
	}
	this._currentLayer = layer;
	if (layer) {
		layer.on(layer.EVENT_CHILD_LAYER_SHOWN, this._onChildLayerShown);
		layer.on(layer.EVENT_CHILD_LAYER_HIDDEN, this._onChildLayerHidden);
	}
	this._showScreenshotsFromLayer(layer);
};


/**
 * @param {zb.layers.Layer} layer
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._showScreenshotsFromLayer = function(layer) {
	layer = layer ? layer.getTopChildLayer() || layer : null;

	var screenshots = this._getScreenShotsFromLayer(layer);
	if (screenshots && screenshots.length) {
		this.setScreenShotUrl(screenshots);
	} else {
		this.setScreenShotUrl('');
	}
};


/**
 * @param {zb.layers.Layer|zb.ext.pixelPerfect.IMarkupProvider} layer
 * @return {?Array.<string>}
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._getScreenShotsFromLayer = function(layer) {
	if (layer && typeof layer.getMarkupImage === 'function') {
		var mp = /** @type {zb.ext.pixelPerfect.IMarkupProvider} */(layer);
		var screenshots = mp.getMarkupImage();
		return screenshots instanceof Array ? screenshots : [screenshots];
	}

	return null;
};


/**
 * @param {zb.Application} app
 * @protected
 * @suppress {accessControls}
 */
zb.ext.pixelPerfect.Controller.prototype._getAppBody = function(app) {
	return app._body;
};


/**
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._getAppProperty = function(getter, obj, event) {
	return new Promise(function(resolve, reject) {
		var result = getter();
		if (result) {
			resolve(result);
		} else {
			obj.on(event, function() {
				resolve(getter());
			});
		}
	});
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
zb.ext.pixelPerfect.Controller.prototype._screenShot;


/**
 * @type {zb.layers.Layer}
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._currentLayer;


/**
 * @type {boolean}
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._isVisible;


/**
 * @type {HTMLDivElement}
 * @protected
 */
zb.ext.pixelPerfect.Controller.prototype._container;


/**
 * @const {number}
 */
zb.ext.pixelPerfect.Controller.OPACITY_STEP = 0.05;


/**
 * @const {number}
 */
zb.ext.pixelPerfect.Controller.POSITION_STEP = 1;
