/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2015-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import app from 'generated/app';
import {div} from 'zb/html';
import AbstractApplication from 'zb/abstract-application';
import IKeyHandler from 'zb/interfaces/i-key-handler';
import Keys from 'zb/device/input/keys';
import EventPublisher from 'zb/events/event-publisher';
import Layer from 'zb/layers/layer';
import IMarkupProvider from './i-markup-provider';
import ScreenShot from './screenshot';
import UI, {PositionDiff} from './ui';


/**
 * @implements {IKeyHandler}
 */
export default class Controller {
	/**
	 */
	constructor() {
		this._onChildLayerShown = this._onChildLayerShown.bind(this);
		this._onChildLayerHidden = this._onChildLayerHidden.bind(this);

		/**
		 * @type {UI}
		 * @protected
		 */
		this._ui = null;

		/**
		 * @type {number}
		 * @protected
		 */
		this._currentPosition = 0;

		/**
		 * Default value is '77177'
		 * @type {Array<Keys>}
		 * @protected
		 */
		this._sequence = [
			Keys.DIGIT_7,
			Keys.DIGIT_7,
			Keys.DIGIT_1,
			Keys.DIGIT_7,
			Keys.DIGIT_7
		];

		/**
		 * @type {Array<string>}
		 * @protected
		 */
		this._screenshots = [];

		/**
		 * @type {ScreenShot}
		 * @protected
		 */
		this._screenShot = null;

		/**
		 * @type {Layer}
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
			opacity: 0.5,
			scale: false
		});
	}

	/**
	 * @override
	 */
	processKey(zbKey, event) {
		if (!this._isVisible) {
			const seq = this._sequence;
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
			if (zbKey === Keys.BACK) {
				this.deactivate();
				return true;
			}

			return this._ui.processKey(zbKey, event);
		}
		return false;
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
	 * @param {AbstractApplication} app
	 */
	attachToApp(app) {
		this._getAppProperty(() => this._getAppBody(app), app, app.EVENT_DOM_READY)
			.then((appBody) => appBody.appendChild(this._container));

		this._getAppProperty(() => app.getLayerManager(), app, app.EVENT_DEVICE_READY)
			.then((lm) => {
				lm.on(lm.EVENT_AFTER_SHOW, (eventName, layer) =>
					this._bindToLayer(/** @type {Layer} */(layer)));
				this._bindToLayer(app.getCurrentLayer());
			});
	}

	/**
	 * @param {string|Array<string>} url
	 */
	setScreenShotUrl(url) {
		this._screenshots = url instanceof Array ? url : [url];
		this._renderScreenshot(this._screenshots[0]);
	}

	/**
	 * @param {Array<Keys>} seq
	 */
	setKeySequence(seq) {
		this._sequence = seq;
		this._currentPosition = 0;
	}

	/**
	 * @param {string} url
	 * @protected
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
		this._screenShot = new ScreenShot();
		this._container.appendChild(this._screenShot.getContainer());
		this._screenShot.getContainer().style.display = 'none';
		this._ui = new UI(this._container);

		this._ui.on(this._ui.EVENT_CHANGE_OPACITY, (eventName, changeDiff) => this._setViewState({
			opacity: this._screenShot.getOpacity() + changeDiff * OPACITY_STEP
		}));

		this._ui.on(this._ui.EVENT_INVERT, () => this._setViewState({
			invert: this._screenShot.isInverted()
		}));

		this._ui.on(this._ui.EVENT_CHANGE_POSITION, (eventName, positionChangeDiff) => {
			positionChangeDiff = /** @type {PositionDiff} */ (positionChangeDiff);
			const position = this._screenShot.getPosition();
			const step = POSITION_STEP;
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
		});

		this._ui.on(this._ui.EVENT_NEXT_SCREENSHOT, () => {
			if (this._screenshots.length > 1) {
				let nextIndex = this._screenshots.indexOf(this._screenShot.getSource()) + 1;
				if (nextIndex >= this._screenshots.length) {
					nextIndex = 0;
				}
				this._renderScreenshot(this._screenshots[nextIndex]);
			}
		});

		this._ui.on(this._ui.EVENT_TOGGLE, () => {
			const containerStyle = this._container.style;
			this._screenShot.getContainer().style.display = containerStyle.display === 'none' ? 'block' : 'none';
		});

		this._ui.on(this._ui.EVENT_TOGGLE_SCALE, () => this._setViewState({
			scale: this._screenShot.isScaled()
		}));
	}

	/**
	 * @protected
	 */
	_createContainer() {
		this._container = div();
		const containerStyle = this._container.style;
		containerStyle.position = 'absolute';
		containerStyle.top = '0';
		containerStyle.left = '0';
		containerStyle.width = '100%';
		containerStyle.height = '100%';
		containerStyle.zIndex = '1000';
		containerStyle.display = 'none';
		containerStyle.pointerEvents = 'none';
	}

	/**
	 * @param {{
	 *     x: (number|undefined),
	 *     y: (number|undefined),
	 *     opacity: (number|undefined),
	 *     invert: (boolean|undefined),
	 *     scale: (boolean|undefined)
	 * }} state
	 * @protected
	 */
	_setViewState(state) {
		if (state.x !== undefined || state.y !== undefined) {
			const position = {
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

		if (state.scale !== undefined) {
			this._screenShot.setScale(state.scale);
			this._ui.renderScaleValue(state.scale);
		}

		if (state.invert !== undefined) {
			this._screenShot.setInvert(state.invert);
			this._ui.renderInvertValue(state.invert);
		}
	}

	/**
	 * @param {string} eventName
	 * @param {Layer} layer
	 * @protected
	 */
	_onChildLayerShown(eventName, layer) {
		this._showScreenshotsFromLayer(layer);
	}

	/**
	 * @protected
	 */
	_onChildLayerHidden() {
		this._showScreenshotsFromLayer(this._currentLayer);
	}

	/**
	 * @param {Layer} layer
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
	 * @param {Layer} layer
	 * @protected
	 */
	_showScreenshotsFromLayer(layer) {
		const topLayer = layer ? layer.getTopChildLayer() || layer : null;

		const screenshots = this._getScreenShotsFromLayer(topLayer);
		if (screenshots && screenshots.length) {
			this.setScreenShotUrl(screenshots);
		} else {
			this.setScreenShotUrl('');
		}
	}

	/**
	 * @param {Layer|IMarkupProvider} layer
	 * @return {?Array<string>}
	 * @protected
	 */
	_getScreenShotsFromLayer(layer) {
		if (layer && typeof layer.getMarkupImage === 'function') {
			const mp = /** @type {IMarkupProvider} */ (layer);
			const screenshots = mp.getMarkupImage();
			return screenshots instanceof Array ? screenshots : [screenshots];
		}

		return null;
	}

	/**
	 * @suppress {accessControls}
	 * @param {AbstractApplication} app
	 * @return {HTMLElement}
	 * @protected
	 */
	_getAppBody(app) {
		return app._body;
	}

	/**
	 * @param {function(): *} getter
	 * @param {EventPublisher} obj
	 * @param {string} event
	 * @return {Promise}
	 * @protected
	 */
	_getAppProperty(getter, obj, event) {
		return new Promise((resolve) => {
			const result = getter();
			if (result) {
				resolve(result);
			} else {
				obj.on(event, () => resolve(getter()));
			}
		});
	}
}


/**
 * @const {number}
 */
export const OPACITY_STEP = 0.05;


/**
 * @const {number}
 */
export const POSITION_STEP = 1;
