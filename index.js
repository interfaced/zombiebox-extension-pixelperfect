const path = require('path');
const {AbstractExtension} = require('zombiebox');


/**
 */
class PixelPerfectExtension extends AbstractExtension {
	/**
	 * @override
	 */
	getName() {
		return 'pixelperfect';
	}

	/**
	 * @override
	 */
	getSourcesDir() {
		return path.join(__dirname, 'lib');
	}

	/**
	 * @override
	 */
	getConfig() {
		return {};
	}

	/**
	 * @override
	 */
	generateCode(projectConfig) {
		return {};
	}

	/**
	 * @override
	 */
	buildCLI(yargs, application) {
		return undefined;
	}
}


module.exports = PixelPerfectExtension;
