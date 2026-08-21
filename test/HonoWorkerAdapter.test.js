import assert from "node:assert/strict";
import test from "node:test";
import HonoWorkerAdapter from "../src/class/HonoWorkerAdapter.mjs";

test("routeRewrite 根据统一服务路径还原 Apple Maps 上游 host", () => {
	const routes = [
		{
			request: "https://mapkit.pages.dev/config/defaults?country=CN",
			upstream: "https://configuration.ls.apple.com/config/defaults?country=CN",
		},
		{
			request: "https://dev.mapkit.pages.dev/config/announcements?os=ios",
			upstream: "https://gspe35-ssl.ls.apple.com/config/announcements?os=ios",
		},
		{
			request: "https://mapkit.nanocat.cloud/geo_manifest/dynamic/config?country_code=CN",
			upstream: "https://gspe35-ssl.ls.apple.com/geo_manifest/dynamic/config?country_code=CN",
		},
	];

	for (const { request, upstream } of routes) {
		assert.equal(HonoWorkerAdapter.routeRewrite(new URL(request)).toString(), upstream);
	}
});

test("buildArgument 优先读取并移除 $argument 请求头", () => {
	const $request = {
		url: "https://configuration.ls.apple.com/config/defaults?os=ios",
		headers: {
			$argument: "TileSet.Transit=CN",
			Accept: "application/xml",
		},
	};

	assert.equal(HonoWorkerAdapter.buildArgument($request), $request);
	assert.equal(globalThis.$argument, "TileSet.Transit=CN");
	assert.deepEqual($request.headers, { Accept: "application/xml" });
	assert.equal($request.url, "https://configuration.ls.apple.com/config/defaults?os=ios");
	delete globalThis.$argument;
});

test("buildArgument 从查询参数读取配置并仅向上游保留普通参数", () => {
	const $request = {
		url: "https://gspe35-ssl.ls.apple.com/config/announcements?os=ios&Config.Announcements.Environment=prod&TileSet.Transit=CN",
		headers: {},
	};

	assert.equal(HonoWorkerAdapter.buildArgument($request), $request);
	assert.equal(globalThis.$argument, "os=ios&Config.Announcements.Environment=prod&TileSet.Transit=CN");
	assert.equal($request.url, "https://gspe35-ssl.ls.apple.com/config/announcements?os=ios");
	delete globalThis.$argument;
});
