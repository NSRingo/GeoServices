import assert from "node:assert/strict";
import test from "node:test";
import GEOResourceManifest from "../src/class/GEOResourceManifest.mjs";
import database from "../src/function/database.mjs";

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
	assert.deepEqual(inject("US", "HYBRID"), [{ bucketID: "target" }]);
});

test("tileStyles 按相对源地区与启用选项展开配置分组", () => {
	const configs = database.Maps.Configs;
	assert.deepEqual(Object.keys(configs.TileStyles), ["Base", "Map", "Satellite", "Traffic", "POI", "Flyover", "Munin", "Roads", "Earth"]);
	const auto = GEOResourceManifest.tileStyles(
		configs,
		{
			TileSet: {
				Earth: "AUTO",
				Flyover: "AUTO",
				Map: "AUTO",
				Munin: "AUTO",
				POI: "AUTO",
				Roads: "AUTO",
				Satellite: "AUTO",
				Traffic: "AUTO",
			},
		},
		"CN",
	);
	assert.ok(auto.includes("RASTER_STANDARD"));
	assert.ok(!auto.includes("VECTOR_STANDARD"));
	assert.ok(!auto.includes("MUNIN_METADATA"));
	assert.ok(!auto.includes("SPR_ASSET_METADATA"));
	assert.ok(!auto.includes("VECTOR_SPR_POLAR"));
	assert.ok(!auto.includes("VECTOR_SPR_MODELS_OCCLUSION"));

	const hybrid = GEOResourceManifest.tileStyles(
		configs,
		{
			TileSet: {
				Flyover: "HYBRID",
				Munin: "HYBRID",
				Satellite: "HYBRID",
			},
		},
		"CN",
	);
	assert.ok(hybrid.includes("RASTER_SATELLITE_NIGHT"));
	assert.ok(hybrid.includes("RASTER_SATELLITE_POLAR"));
	assert.ok(hybrid.includes("SPUTNIK_VECTOR_BORDER"));
	assert.ok(hybrid.includes("FLYOVER_VISIBILITY"));
	assert.ok(hybrid.includes("MUNIN_METADATA"));
	assert.ok(hybrid.includes("RASTER_SATELLITE"));
	assert.ok(hybrid.includes("SPUTNIK_METADATA"));
	assert.ok(hybrid.includes("FLYOVER_C3M_MESH"));
	assert.ok(hybrid.includes("FLYOVER_METADATA"));

	const xx = GEOResourceManifest.tileStyles(
		configs,
		{
			TileSet: {
				Earth: "Apple",
				Flyover: "XX",
				Map: "XX",
				Munin: "XX",
				POI: "XX",
				Roads: "XX",
				Satellite: "XX",
				Traffic: "XX",
			},
		},
		"CN",
	);
	assert.ok(xx.includes("VECTOR_STANDARD"));
	assert.ok(xx.includes("RASTER_SATELLITE"));
	assert.ok(xx.includes("SPUTNIK_METADATA"));
	assert.ok(xx.includes("VECTOR_TRAFFIC"));
	assert.ok(xx.includes("VECTOR_POI"));
	assert.ok(xx.includes("FLYOVER_C3M_MESH"));
	assert.ok(xx.includes("MUNIN_METADATA"));
	assert.ok(xx.includes("VECTOR_SPR_ROADS"));
	assert.ok(xx.includes("SPR_ASSET_METADATA"));
	assert.ok(xx.includes("VECTOR_SPR_POLAR"));
	assert.ok(xx.includes("VECTOR_SPR_MODELS_OCCLUSION"));
	assert.ok(xx.includes("VECTOR_SPR_STANDARD"));

	const cn = GEOResourceManifest.tileStyles(
		configs,
		{
			TileSet: {
				Earth: "AutoNavi",
				Flyover: "CN",
				Map: "CN",
				Munin: "CN",
				POI: "CN",
				Roads: "CN",
				Satellite: "CN",
				Traffic: "CN",
			},
		},
		"US",
	);
	assert.ok(cn.includes("VECTOR_STANDARD"));
	assert.ok(cn.includes("RASTER_SATELLITE"));
	assert.ok(cn.includes("VECTOR_TRAFFIC"));
	assert.ok(cn.includes("VECTOR_POI"));
	assert.ok(cn.includes("FLYOVER_C3M_MESH"));
	assert.ok(cn.includes("MUNIN_METADATA"));
	assert.ok(cn.includes("VECTOR_SPR_ROADS"));
	assert.ok(cn.includes("SPR_ASSET_METADATA"));
	assert.ok(cn.includes("VECTOR_SPR_POLAR"));
	assert.ok(cn.includes("VECTOR_SPR_MODELS_OCCLUSION"));
	assert.ok(cn.includes("VECTOR_SPR_STANDARD"));
});
