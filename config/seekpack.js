let args = require('ifun').getArgs();
let useBabel = args.hasOwnProperty('babel') ? args.babel == 1 : args.env === 'pro';
let useUgly = args.hasOwnProperty('ugly') ? args.ugly == 1 : true;

module.exports = {
	entry: '../src/index.html',
	output: '../dist',
	proxy: {
		'/service': 'http://localhost:12001'
	},
	eslint: true,
	hmr: true,
	babel: {
		use: useBabel,
		include: [
			'../www',
			'../config',
			'/github/seekjs/seek-ajax',
			'/github/seekjs/seekjs',
			'/github/likaituan/ifun',
			'/github/likaituan/xplayer'
		]
	},
	ugly: useUgly,

	context: __dirname
};