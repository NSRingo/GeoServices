import { defineConfig } from "@iringo/arguments-builder";
import { args } from "./arguments-builder.full.config";

export default defineConfig({
	output: {
		surge: {
			path: "./dist/iRingo.Maps.dev.sgmodule",
			template: "./template/surge.dev.handlebars",
		},
		loon: {
			path: "./dist/iRingo.Maps.dev.plugin",
			template: "./template/loon.dev.handlebars",
		},
		customItems: [
			{
				path: "./dist/iRingo.Maps.dev.snippet",
				template: "./template/quantumultx.dev.handlebars",
			},
			{
				path: "./dist/iRingo.Maps.dev.stoverride",
				template: "./template/stash.dev.handlebars",
			},
		],
		boxjsSettings: {
			path: "./dist/iRingo.Maps.dev.boxjs.json",
			scope: "@iRingo.Maps.Settings",
		},
	},
	args,
});
