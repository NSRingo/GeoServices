import assert from "node:assert/strict";
import test from "node:test";
import GEOResourceManifest from "../src/class/GEOResourceManifest.mjs";

test("固定 CN source 与 XX target 后按 countryCode 选择合成方向", () => {
	const sourceResources = [{ filename: "CN-base.json" }, { filename: "POITypeMapping-CN-1.json" }];
	const targetResources = [{ filename: "XX-base.json" }];
	assert.deepEqual(GEOResourceManifest.resources([...sourceResources], [...targetResources], "CN"), sourceResources);
	assert.deepEqual(GEOResourceManifest.resources([...sourceResources], [...targetResources], "US"), [...targetResources, sourceResources[1]]);

	const sourceDataSets = [{ identifier: "CN" }];
	const targetDataSets = [{ identifier: "XX" }];
	assert.equal(GEOResourceManifest.dataSets(sourceDataSets, targetDataSets, "CN"), targetDataSets);
	assert.equal(GEOResourceManifest.dataSets(sourceDataSets, targetDataSets, "US"), targetDataSets);

	const sourceDisplayStrings = [{ identifier: "CN" }];
	const targetDisplayStrings = [{ identifier: "XX" }];
	assert.deepEqual(GEOResourceManifest.displayStrings(sourceDisplayStrings, targetDisplayStrings, "CN"), targetDisplayStrings);
	assert.equal(GEOResourceManifest.displayStrings(sourceDisplayStrings, targetDisplayStrings, "US"), targetDisplayStrings);
});

test("URL 配置保留 countryCode 覆盖顺序和国际字段修正", () => {
	const source = [
		{
			shared: "CN",
			alternateResourcesURL: [{ url: "https://cn.example" }],
			polyLocationShiftURL: { url: "https://shift.cn.example" },
			problemSubmissionURL: { url: "https://rap.cn.example" },
		},
	];
	const target = [
		{
			shared: "XX",
			alternateResourcesURL: [{ url: "https://xx.example" }],
			problemSubmissionURL: { url: "https://rap.xx.example" },
		},
	];
	const settings = {
		Config: { Announcements: { "Environment:": "AUTO" } },
		UrlInfoSet: {
			Dispatcher: "AUTO",
			Directions: "AUTO",
			RAP: "AUTO",
			LocationShift: "AUTO",
		},
	};

	const cn = GEOResourceManifest.urlInfoSets(source, target, settings, "CN")[0];
	assert.equal(cn.shared, "CN");
	assert.deepEqual(cn.alternateResourcesURL, source[0].alternateResourcesURL);
	assert.deepEqual(cn.polyLocationShiftURL, source[0].polyLocationShiftURL);
	assert.deepEqual(cn.problemSubmissionURL, target[0].problemSubmissionURL);

	const xx = GEOResourceManifest.urlInfoSets(source, target, settings, "US")[0];
	assert.equal(xx.shared, "XX");
	assert.deepEqual(xx.alternateResourcesURL, source[0].alternateResourcesURL);
	assert.equal("polyLocationShiftURL" in xx, false);
	assert.deepEqual(xx.problemSubmissionURL, target[0].problemSubmissionURL);
});

test("Munin 设置从固定 source 和 target 选择分桶", () => {
	const source = [{ bucketID: "CN" }];
	const target = [{ bucketID: "XX" }];
	assert.equal(GEOResourceManifest.muninBuckets(source, target, { TileSet: { Munin: "CN" } }), source);
	assert.equal(GEOResourceManifest.muninBuckets(source, target, { TileSet: { Munin: "XX" } }), target);
	assert.equal(GEOResourceManifest.muninBuckets(source, target, { TileSet: { Munin: "HYBRID" } }), target);
});
