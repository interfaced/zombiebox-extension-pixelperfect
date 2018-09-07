
HowTo
-------

Add dependency to package.json:

```JavaScript
{
  "name": "your-app",
  "version": "0.1.0",
  "dependencies": {
    //...
    "zombiebox-extension-pixelperfect": "~0"
  }
}

```

In your application.js do following changes:

Require PixelPerfect controller:
```javascript
goog.require('zb.ext.pixelPerfect.Controller');
```

Create instance of PixelPerfect controller:
```javascript

yourApp.Application.prototype.onReady = function() {
	this._pp = new zb.ext.pixelPerfect.Controller(this._body);
	this._pp.attachToLayerManager(this._layerManager);
	// ...
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

Implement `zb.ext.pixelPerfect.IMarkupProvider` interface on your scenes.

Press 77177 in your application to show PixelPerfect UI.
