import pkg from './package.json' with { type: "json" };
import json from '@rollup/plugin-json';
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
	{
		input: 'src/request.debug.js',
		output: {
			file: 'dist/request.js',
			//format: 'es',
			banner: `/* README: https://github.com/NSRingo */\nconsole.log(' iRingo: 📍 GeoServices β Request')\nconsole.log('Version: ${pkg.version}')\nconsole.log('${new Date().toLocaleString('zh-CN', {timeZone: 'PRC'})}')`,
		},
		plugins: [json(), commonjs(), nodeResolve()]
	},
	{
		input: 'src/response.debug.js',
		output: {
			file: 'dist/response.js',
			//format: 'es',
			banner: `/* README: https://github.com/NSRingo */\nconsole.log(' iRingo: 📍 GeoServices β Response')\nconsole.log('Version: ${pkg.version}')\nconsole.log('${new Date().toLocaleString('zh-CN', {timeZone: 'PRC'})}')`,
		},
		plugins: [json(), commonjs(), nodeResolve()]
	}
];
