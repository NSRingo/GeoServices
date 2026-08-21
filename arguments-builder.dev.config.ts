import { defineConfig } from "@iringo/arguments-builder";
import { argsFull } from "./arguments-builder.full.config";

export default defineConfig({
	output: {
		surge: {
			path: "./dist/iRingo.MapKit.dev.sgmodule",
			template: "./template/surge.dev.handlebars",
		},
		loon: {
			path: "./dist/iRingo.MapKit.dev.plugin",
			template: "./template/loon.dev.handlebars",
		},
		customItems: [
			{
				path: "./dist/iRingo.MapKit.dev.snippet",
				template: "./template/quantumultx.dev.handlebars",
			},
			{
				path: "./dist/iRingo.MapKit.dev.stoverride",
				template: "./template/stash.dev.handlebars",
			},
		],
		boxjsSettings: {
			path: "./dist/iRingo.MapKit.dev.boxjs.json",
			scope: "@iRingo.MapKit.Settings",
		},
	},
	args: argsFull,
});
