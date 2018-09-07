
HowTo
-------

Add dependency to package.json:

```JavaScript
{
  "name": "your-app",
  "version": "0.1.0",
  "dependencies": {
    //...
    "zombiebox-extension-pixelperfect": "~0.2.0"
  }
}

```

Install dependency `npm install` and modify app:


In your application.js do following changes:

Require PixelPerfect controller:
```javascript
goog.require('zb.ext.pixelPerfect.Controller');
```

Create instance of PixelPerfect controller:
```javascript

yourApp.Application.prototype.onReady = function() {
	this._pp = new zb.ext.pixelPerfect.Controller();
	this._pp.attachToApp(this);
	// ...
    goog.base(this, 'onReady');
};


/**
 * @type {zb.ext.pixelPerfect.Controller}
 * @protected
 */
yourApp.Application.prototype._pp;

```

Pass key events to PixelPErfect controller:
```javascript



/**
 * @inheritDoc
 */
yourApp.Application.prototype.processKey = function(zbKey, e) {
	if (this._pp.processKey(zbKey, e)) {
		return true;
	}

	return goog.base(this, 'processKey', zbKey, e);
};
```

Implement methods from `zb.ext.pixelPerfect.IMarkupProvider` interface on your scenes. E.g.:


```javascript
goog.provide('yourApp.scenes.Home');
goog.require('zb.ext.pixelPerfect.IMarkupProvider');
goog.require('zb.layers.CuteScene');



/**
 *
 * @constructor
 * @extends {zb.layers.CuteScene}
 * @implements {zb.ext.pixelPerfect.IMarkupProvider}
 */
yourApp.scenes.Home = function() {
	goog.base(this);
};
goog.inherits(yourApp.scenes.Home, zb.layers.CuteScene);


/**
 * @inheritDoc
 */
yourApp.scenes.Home.prototype.getMarkupImage = function() {
	return [
		'http://example.com/markup-reference.jpg',
		'path/in/web/directory.png'
		];
};
```

Press 77177 in your application to show PixelPerfect UI.
