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
