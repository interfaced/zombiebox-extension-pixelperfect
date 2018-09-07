# zombiebox-extension-pixelperfect

[ZombieBox](https://zombiebox.tv) extension for Pixel Perfect testing.

## Usage

Instantiate the controller class (`zb.ext.pixelPerfect.Controller`) and attach it to the application:

```js
goog.provide('my.Application');
goog.require('my.BaseApplication');
goog.require('zb.ext.pixelPerfect.Controller');

/**
 */
my.Application = class extends my.BaseApplication {
    /**
     */
    onReady() {
        this._pixelPerfectController = new zb.ext.pixelPerfect.Controller();
        this._pixelPerfectController.attachToApp(this);
    }
}
```

Let the controller to intercept processing of the remote:

```js
goog.provide('my.Application');
goog.require('my.BaseApplication');
goog.require('zb.ext.pixelPerfect.Controller');

/**
 */
my.Application = class extends my.BaseApplication {
    /**
     * @override
     */
    processKey(zbKey, opt_e) {
        if (this._pixelPerfectController.processKey(zbKey, opt_e)) {
        	return true;
        }

        return super.processKey(zbKey, opt_e);
    }
}
```

Implement interface `zb.ext.pixelPerfect.IMarkupProvider` by the scene which is supposed to be tested.

```js
goog.provide('my.scenes.Home');
goog.provide('zb.layers.CuteScene');
goog.provide('zb.ext.pixelPerfect.IMarkupProvider');

/*
 * @implements {zb.ext.pixelPerfect.IMarkupProvider}
 */
my.scenes.Home = class extends zb.layers.CuteScene {
	/**
	 * @override
	 */
	getMarkupImage() {
		return [
			'http://zombiebox.tv/home-markup-reference.png',
			'web/markup-references/home.png'
		];
    }
}
```

For activation press `77177` on the remote.

After activation you can observe the provided screenshot (or the first if an array is provided) over the displayed scene and extension's UI that helps navigate between the screenshots and displays the current state.

## Keys mapping

#### Back

Deactivate.

#### Enter

Show/hide the UI.

#### Up, Down, Left, Right

Change the screenshot position.

#### Red

Increase the screenshot transparency.

#### Green

Decrease the screenshot transparency.

#### Yellow

Go to the next screenshot.

#### Blue

Change the UI position.

#### Digit 0

Toggle scaling.

#### Digit 1

Toggle color inversion.

## Custom key sequence

The default key sequence can be changed by calling `zb.ext.pixelPerfect.Controller#setKeySequence` method:

```js
this._pixelPerfectController.setKeySequence([
    zb.device.input.Keys.DIGIT_1,
    zb.device.input.Keys.DIGIT_2,
    zb.device.input.Keys.DIGIT_3,
]);
```
