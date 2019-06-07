# zombiebox-extension-pixelperfect

[ZombieBox](https://zombiebox.tv) extension for Pixel Perfect testing.

## Usage

Instantiate the controller class (`Controller`) and attach it to the application:

```js
import PixelPerfectController from 'pixelperfect/controller';
import BaseApplication from 'generated/zb/base-application';

/**
 */
export default class Application extends BaseApplication {
	/**
	 */
	onReady() {
		this._pixelPerfectController = new PixelPerfectController();
		this._pixelPerfectController.attachToApp(this);
	}
}
```

Let the controller to intercept processing of the remote:

```js
import PixelPerfectController from 'pixelperfect/controller';
import BaseApplication from 'generated/zb/base-application';

/**
 */
export default class Application extends BaseApplication {
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

Implement interface `IMarkupProvider` by the scene which is supposed to be tested.

```js
import AbstractCuteScene from 'cutejs/layers/abstract-scene';
import IMarkupProvider from 'pixelperfect/i-markup-provider';

/*
 * @implements {IMarkupProvider}
 */
class Home extends AbstractCuteScene {
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

The default key sequence can be changed by calling `Controller#setKeySequence` method:

```js
import Keys from 'zb/device/input/keys';

this._pixelPerfectController.setKeySequence([
	Keys.DIGIT_1,
	Keys.DIGIT_2,
	Keys.DIGIT_3,
]);
```
