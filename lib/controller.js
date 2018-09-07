goog.provide('zb.ext.pixelPerfect.Controller');
goog.require('zb.IKeyHandler');
goog.require('zb.ext.pixelPerfect.UI');
goog.require('zb.ext.pixelPerfect.ScreenShot');
goog.require('zb.ext.pixelPerfect.IMarkupProvider');



/**
 * @constructor
 * @implements {zb.IKeyHandler}
 */
zb.ext.pixelPerfect.Controller = class {
	constructor() {
		this._onChildLayerShown = this._onChildLayerShown.bind(this);
		this._onChildLayerHidden = this._onChildLayerHidden.bind(this);

		/**
		 * @type {zb.ext.pixelPerfect.UI}
		 * @protected
		 */
		this._ui = null;
		/**
		 * @type {number}
		 * @protected
		 */
		this._currentPosition = 0;
		/**
		 * Default value is '77177' like Z
		 * @type {Array.<zb.device.input.Keys>}
		 * @protected
		 */
		this._sequence = [
			zb.device.input.Keys.DIGIT_7,
			zb.device.input.Keys.DIGIT_7,
			zb.device.input.Keys.DIGIT_1,
			zb.device.input.Keys.DIGIT_7,
			zb.device.input.Keys.DIGIT_7
		];
		/**
		 * @type {Array.<string>}
		 * @protected
		 */
		this._screenshots = [];
		/**
		 * @type {zb.ext.pixelPerfect.ScreenShot}
		 * @protected
		 */
		this._screenShot = null;
		/**
		 * @type {zb.layers.Layer}
		 * @protected
		 */
		this._currentLayer = null;
		/**
		 * @type {boolean}
		 * @protected
		 */
		this._isVisible = false;
		/**
		 * @type {HTMLDivElement}
		 * @protected
		 */
		this._container = null;

		this._createUI();
		this._setViewState({
			x: 0,
			y: 0,
			opacity: 0.5
		});
	}


	/**
	 * Show PP UI and handle keys to perform manipulations with screenshot
	 */
	activate() {
		this._isVisible = true;
		this._ui.show();
		this._screenShot.getContainer().style.display = 'block';
		// workaround for getting EVENT_AFTER_SHOW event on app start
		this._bindToLayer(app.getCurrentLayer());
		this._container.style.display = 'block';
	}


	/**
	 * Hide PP UI
	 */
	deactivate() {
		this._isVisible = false;
		this._ui.hide();
		this._screenShot.getContainer().style.display = 'none';
		this._container.style.display = 'none';
	}


	/**
	 * @param {zb.Application} app
	 */
	attachToApp(app) {
		this._getAppProperty(function () {
			return this._getAppBody(app);
		}.bind(this), app, app.EVENT_DOM_READY)
			.then(function (appBody) {
				appBody.appendChild(this._container);
			}.bind(this));

		this._getAppProperty(function () {
			return app.getLayerManager();
		}, app, app.EVENT_DEVICE_READY)
			.then(function (lm) {
				lm.on(lm.EVENT_AFTER_SHOW, function (eventName, layer) {
					layer = /** @type {zb.layers.Layer} */(layer);
					this._bindToLayer(layer);
				}.bind(this));
				this._bindToLayer(app.getCurrentLayer());
			}.bind(this));
	}


	/**
	 * @param {string|Array.<string>} url
	 */
	setScreenShotUrl(url) {
		this._screenshots = url instanceof Array ? url : [url];
		this._renderScreenshot(this._screenshots[0]);
	}


	/**
	 * @param {Array.<zb.device.input.Keys>} seq
	 */
	setKeySequence(seq) {
		this._sequence = seq;
		this._currentPosition = 0;
	}


	/**
	 * @inheritDoc
	 */
	processKey(zbKey, opt_e) {
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
	}


	/**
	 * @param {string} url
	 */
	_renderScreenshot(url) {
		this._screenShot.setSource(url);
		this._ui.renderScreenshotValue(url);
	}


	/**
	 * @protected
	 */
	_createUI() {
		this._createContainer();
		this._screenShot = new zb.ext.pixelPerfect.ScreenShot();
		this._container.appendChild(this._screenShot.getContainer());
		this._screenShot.getContainer().style.display = 'none';
		this._ui = new zb.ext.pixelPerfect.UI(this._container);

		this._ui.on(this._ui.EVENT_CHANGE_OPACITY, function (eventName, changeDiff) {
			var step = zb.ext.pixelPerfect.Controller.OPACITY_STEP;
			this._setViewState({
				opacity: this._screenShot.getOpacity() + changeDiff * step
			});
		}.bind(this));

		this._ui.on(this._ui.EVENT_CHANGE_POSITION, function (eventName, positionChangeDiff) {
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

		this._ui.on(this._ui.EVENT_NEXT_SCREENSHOT, function () {
			if (this._screenshots.length > 1) {
				var nextIndex = this._screenshots.indexOf(this._screenShot.getSource()) + 1;
				if (nextIndex >= this._screenshots.length) {
					nextIndex = 0;
				}
				this._renderScreenshot(this._screenshots[nextIndex]);
			}
		}.bind(this));

		this._ui.on(this._ui.EVENT_TOGGLE, function () {
			var containerStyle = this._screenShot.getContainer().style;
			containerStyle.display = containerStyle.display === 'none' ? 'block' : 'none';
		}.bind(this));
	}


	/**
	 * @protected
	 */
	_createContainer() {
		this._container = zb.html.div();
		var containerStyle = this._container.style;
		containerStyle.position = 'absolute';
		containerStyle.top = '0';
		containerStyle.left = '0';
		containerStyle.width = '100%';
		containerStyle.height = '100%';
		containerStyle.zIndex = 1000;
		containerStyle.display = 'none';
	}


	/**
	 * @param {{
 *      x: (number|undefined),
 *      y: (number|undefined),
 *      opacity: (number|undefined)
 * }} state
	 * @protected
	 */
	_setViewState(state) {
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
	}


	/**
	 * @param {string} eventName
	 * @param {zb.layers.Layer} layer
	 * @private
	 */
	_onChildLayerShown(eventName, layer) {
		this._showScreenshotsFromLayer(layer);
	}


	/**
	 * @param {string} eventName
	 * @param {zb.layers.Layer} layer
	 * @private
	 */
	_onChildLayerHidden(eventName, layer) {
		this._showScreenshotsFromLayer(this._currentLayer);
	}


	/**
	 * @param {zb.layers.Layer} layer
	 * @protected
	 */
	_bindToLayer(layer) {
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
	}


	/**
	 * @param {zb.layers.Layer} layer
	 * @protected
	 */
	_showScreenshotsFromLayer(layer) {
		layer = layer ? layer.getTopChildLayer() || layer : null;

		var screenshots = this._getScreenShotsFromLayer(layer);
		if (screenshots && screenshots.length) {
			this.setScreenShotUrl(screenshots);
		} else {
			this.setScreenShotUrl('');
		}
	}


	/**
	 * @param {zb.layers.Layer|zb.ext.pixelPerfect.IMarkupProvider} layer
	 * @return {?Array.<string>}
	 * @protected
	 */
	_getScreenShotsFromLayer(layer) {
		if (layer && typeof layer.getMarkupImage === 'function') {
			var mp = /** @type {zb.ext.pixelPerfect.IMarkupProvider} */(layer);
			var screenshots = mp.getMarkupImage();
			return screenshots instanceof Array ? screenshots : [screenshots];
		}

		return null;
	}


	/**
	 * @param {zb.Application} app
	 * @protected
	 * @suppress {accessControls}
	 */
	_getAppBody(app) {
		return app._body;
	}


	/**
	 * @protected
	 */
	_getAppProperty(getter, obj, event) {
		return new Promise(function (resolve, reject) {
			var result = getter();
			if (result) {
				resolve(result);
			} else {
				obj.on(event, function () {
					resolve(getter());
				});
			}
		});
	}
};


/**
 * @const {number}
 */
zb.ext.pixelPerfect.Controller.OPACITY_STEP = 0.05;


/**
 * @const {number}
 */
zb.ext.pixelPerfect.Controller.POSITION_STEP = 1;
