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
zb.ext.pixelPerfect.UI = function(host) {
	goog.base(this);
	this._host = host;
	this._container = null;
	this._renderTemplate();
	// initialize position
	this._togglePosition();
};
goog.inherits(zb.ext.pixelPerfect.UI, zb.events.EventPublisher);


/**
 * @param {string} URL
 */
zb.ext.pixelPerfect.UI.prototype.renderScreenshotValue = function(URL) {
	zb.html.text(this._exported.screenshot, URL);
};


/**
 * @param {number} x
 * @param {number} y
 */
zb.ext.pixelPerfect.UI.prototype.renderPositionValue = function(x, y) {
	zb.html.text(this._exported.X, '' + x);
	zb.html.text(this._exported.Y, '' + y);
};


/**
 * @param {number} opacity 0..1
 */
zb.ext.pixelPerfect.UI.prototype.renderOpacityValue = function(opacity) {
	zb.html.text(this._exported.opacity, Math.round(opacity * 100) + '%');
};


/**
 * Show UI
 */
zb.ext.pixelPerfect.UI.prototype.show = function() {
	this._container.style.display = 'block';
};


/**
 * Hide UI
 */
zb.ext.pixelPerfect.UI.prototype.hide = function() {
	this._container.style.display = 'none';
};


/**
 * @inheritDoc
 */
zb.ext.pixelPerfect.UI.prototype.processKey = function(zbKey, opt_e) {
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
			this._fireEvent(this.EVENT_CHANGE_POSITION, {x: -1, y: 0});
			break;
		case keys.DOWN:
			this._fireEvent(this.EVENT_CHANGE_POSITION, {x: +1, y: 0});
			break;
		case keys.LEFT:
			this._fireEvent(this.EVENT_CHANGE_POSITION, {x: 0, y: -1});
			break;
		case keys.RIGHT:
			this._fireEvent(this.EVENT_CHANGE_POSITION, {x: 0, y: +1});
			break;
		default:
			return false;
			break;
	}
	return true;
};


/**
 * @protected
 */
zb.ext.pixelPerfect.UI.prototype._togglePosition = function() {
	var style = this._container.style;
	if (style.left === zb.ext.pixelPerfect.UI.HORIZONTAL_POSITION) {
		style.left = '';
		style.right = zb.ext.pixelPerfect.UI.HORIZONTAL_POSITION;
	} else {
		style.right = '';
		style.left = zb.ext.pixelPerfect.UI.HORIZONTAL_POSITION;
	}
};


/**
 * @protected
 */
zb.ext.pixelPerfect.UI.prototype._renderTemplate = function() {
	this._exported = zb.ext.pixelPerfect.templates.ui({}, {});
	this._container = zb.html.findFirstElementNode(this._exported.root);
	this._host.appendChild(this._container);
	this._container.style.display = 'none';
};


/**
 * @type {HTMLElement}
 * @protected
 */
zb.ext.pixelPerfect.UI.prototype._host;


/**
 * @type {HTMLElement}
 * @protected
 */
zb.ext.pixelPerfect.UI.prototype._container;


/**
 * @type {zb.ext.pixelPerfect.templates.UiOut}
 * @protected
 */
zb.ext.pixelPerfect.UI.prototype._exported;


/**
 * @const {string}
 * Fired with: {zb.ext.pixelPerfect.UI.PositionDiff}
 */
zb.ext.pixelPerfect.UI.prototype.EVENT_CHANGE_POSITION = 'change-position';


/**
 * @const {string}
 * Fired with: {zb.ext.pixelPerfect.UI.ChangeDiff}
 */
zb.ext.pixelPerfect.UI.prototype.EVENT_CHANGE_OPACITY = 'change-opacity';


/**
 * @const {string}
 * Fired without arguments.
 */
zb.ext.pixelPerfect.UI.prototype.EVENT_NEXT_SCREENSHOT = 'next-screenshot';


/**
 * @const {string}
 * Fired without arguments.
 */
zb.ext.pixelPerfect.UI.prototype.EVENT_TOGGLE = 'toggle';


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
