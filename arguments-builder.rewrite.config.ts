import { defineConfig } from "@iringo/arguments-builder";

const endpoint = {
	key: "endpoint",
	name: "[重写] 服务端点",
	defaultValue: "mapkit.pages.dev",
	type: "string" as const,
	options: [
		{ key: "mapkit.pages.dev", label: "首选；直连；无需代理" },
		{ key: "dev.mapkit.pages.dev", label: "开发版" },
		{ key: "mapkit.nanocat.cloud", label: "Worker 版；需要代理" },
	],
};

export default defineConfig({
	args: [endpoint],
	output: {
		surge: {
			path: "./dist/iRingo.MapKit.Rewrite.sgmodule",
			template: "./template/surge.rewrite.handlebars",
			transformEgern: {
				enable: true,
				path: "./dist/iRingo.MapKit.Rewrite.yaml",
			},
		},
		loon: {
			path: "./dist/iRingo.MapKit.Rewrite.lpx",
			template: "./template/loon.rewrite.handlebars",
		},
		customItems: [
			{
				path: "./dist/iRingo.MapKit.Rewrite.srmodule",
				template: "./template/shadowrocket.rewrite.handlebars",
			},
			{
				path: "./dist/iRingo.MapKit.Rewrite.stoverride",
				template: "./template/stash.rewrite.handlebars",
			},
		],
	},
});
