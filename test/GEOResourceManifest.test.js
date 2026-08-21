import assert from "node:assert/strict";
import test from "node:test";
import GEOResourceManifest from "../src/class/GEOResourceManifest.mjs";

test("source 始终注入 target，targetCountryCode 只决定注入规则", () => {
	const sourceAttributions = [{ name: "Source" }];
	const targetAttributions = [{ name: "Target" }];
	const attributions = GEOResourceManifest.attributions(sourceAttributions, targetAttributions, "CN");
	assert.deepEqual(attributions.map(({ name }) => name).sort(), ["Source", "Target"]);
	assert.deepEqual(targetAttributions.map(({ name }) => name).sort(), ["Source", "Target"]);

	const sourceResources = [{ filename: "CN-base.json" }, { filename: "POITypeMapping-CN-1.json" }];
	const cnTargetResources = [{ filename: "CN-target.json" }];
	assert.equal(GEOResourceManifest.resources(sourceResources, cnTargetResources, "CN"), cnTargetResources);
	assert.deepEqual(cnTargetResources, [{ filename: "CN-target.json" }]);
	const xxTargetResources = [{ filename: "XX-target.json" }];
	assert.equal(GEOResourceManifest.resources(sourceResources, xxTargetResources, "US"), xxTargetResources);
	assert.deepEqual(xxTargetResources, [{ filename: "XX-target.json" }, sourceResources[1]]);

	const sourceDataSets = [{ identifier: "CN" }];
	const cnTargetDataSets = [{ identifier: "CN-target" }];
	assert.equal(GEOResourceManifest.dataSets(sourceDataSets, cnTargetDataSets, "CN"), cnTargetDataSets);
	assert.deepEqual(cnTargetDataSets, sourceDataSets);
	const xxTargetDataSets = [{ identifier: "XX-target" }];
	assert.equal(GEOResourceManifest.dataSets(sourceDataSets, xxTargetDataSets, "US"), xxTargetDataSets);
	assert.deepEqual(xxTargetDataSets, [{ identifier: "XX-target" }]);

	const sourceDisplayStrings = [{ identifier: "XX" }];
	const cnTargetDisplayStrings = [{ identifier: "CN-target" }];
	assert.equal(GEOResourceManifest.displayStrings(sourceDisplayStrings, cnTargetDisplayStrings, "CN"), cnTargetDisplayStrings);
	assert.deepEqual(cnTargetDisplayStrings, sourceDisplayStrings);
	const xxTargetDisplayStrings = [{ identifier: "XX-target" }];
	assert.equal(GEOResourceManifest.displayStrings(sourceDisplayStrings, xxTargetDisplayStrings, "US"), xxTargetDisplayStrings);
	assert.deepEqual(xxTargetDisplayStrings, [{ identifier: "XX-target" }]);
});

test("URL 配置始终以 target 为基底并按 targetCountryCode 选择地区字段", () => {
	const source = [
		{
			shared: "source",
			alternateResourcesURL: [{ url: "https://source.example" }],
			polyLocationShiftURL: { url: "https://shift.source.example" },
			problemSubmissionURL: { url: "https://rap.source.example" },
			dispatcherURL: { url: "https://dispatcher.source.example" },
			directionsURL: { url: "https://directions.source.example" },
		},
	];
	const target = [
		{
			shared: "target",
			alternateResourcesURL: [{ url: "https://target.example" }],
			polyLocationShiftURL: { url: "https://shift.target.example" },
			problemSubmissionURL: { url: "https://rap.target.example" },
			dispatcherURL: { url: "https://dispatcher.target.example" },
			directionsURL: { url: "https://directions.target.example" },
		},
	];
	const settings = {
		Config: { Announcements: { "Environment:": "AUTO" } },
		UrlInfoSet: {
			Dispatcher: "AutoNavi",
			Directions: "AUTO",
			RAP: "AUTO",
			LocationShift: "AUTO",
		},
	};

	const cn = GEOResourceManifest.urlInfoSets(source, target, settings, "CN")[0];
	assert.equal(cn.shared, "target");
	assert.deepEqual(cn.alternateResourcesURL, target[0].alternateResourcesURL);
	assert.deepEqual(cn.polyLocationShiftURL, target[0].polyLocationShiftURL);
	assert.deepEqual(cn.problemSubmissionURL, source[0].problemSubmissionURL);
	assert.deepEqual(cn.directionsURL, target[0].directionsURL);

	const xx = GEOResourceManifest.urlInfoSets(source, target, settings, "US")[0];
	assert.equal(xx.shared, "target");
	assert.deepEqual(xx.alternateResourcesURL, target[0].alternateResourcesURL);
	assert.deepEqual(xx.polyLocationShiftURL, source[0].polyLocationShiftURL);
	assert.deepEqual(xx.problemSubmissionURL, target[0].problemSubmissionURL);
	assert.deepEqual(xx.directionsURL, source[0].directionsURL);
});

test("Munin 按 targetCountryCode 将选定地区的 source 注入 target", () => {
	const inject = (targetCountryCode, munin) => {
		const source = [{ bucketID: "source" }];
		const target = [{ bucketID: "target" }];
		const result = GEOResourceManifest.muninBuckets(source, target, { TileSet: { Munin: munin } }, targetCountryCode);
		assert.equal(result, target);
		return target;
	};

	assert.deepEqual(inject("CN", "CN"), [{ bucketID: "target" }]);
	assert.deepEqual(inject("CN", "XX"), [{ bucketID: "source" }]);
	assert.deepEqual(inject("US", "CN"), [{ bucketID: "source" }]);
	assert.deepEqual(inject("US", "XX"), [{ bucketID: "target" }]);
});

test("tileStyles 按源地区与设置选择配置分组", () => {
	const configs = {
		TileStyles: {
			Base: ["BASE"],
			Map: ["MAP"],
			Satellite2D: ["SATELLITE_2D"],
			Satellite3D: ["SATELLITE_3D"],
		},
	};
	const settings = {
		TileSet: {
			Map: "AutoNavi",
			Satellite2D: "Apple",
			Satellite3D: "CN",
		},
	};

	assert.deepEqual(GEOResourceManifest.tileStyles(configs, settings, "CN"), ["BASE", "MAP", "SATELLITE_3D"]);
	assert.deepEqual(GEOResourceManifest.tileStyles(configs, settings, "XX"), ["BASE", "SATELLITE_2D"]);
	assert.deepEqual(GEOResourceManifest.tileStyles(configs, {}, "CN"), ["BASE"]);
	assert.deepEqual(GEOResourceManifest.tileStyles(configs, {}, "XX"), ["BASE", "MAP", "SATELLITE_2D", "SATELLITE_3D"]);
});
