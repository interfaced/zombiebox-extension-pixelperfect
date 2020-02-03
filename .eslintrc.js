const copyright = [
	'',
	' * This file is part of the ZombieBox package.',
	' *',
	` * Copyright © 2015-${(new Date).getFullYear()}, Interfaced`,
	' *',
	' * For the full copyright and license information, please view the LICENSE',
	' * file that was distributed with this source code.',
	' '
];

module.exports = {
	extends: 'interfaced',
	plugins: ['header'],
	overrides: [
		{
			files: ['lib/**/*.js'],
			extends: 'interfaced/esm',
			settings: {
				'import/resolver': 'zombiebox'
			},
			rules: {
				'import/extensions': ['error', {jst: 'always'}],
				'header/header': ['error', 'block', copyright]
			}
		},
		{
			files: ['index.js'],
			extends: 'interfaced/node',
		}
	]
};
