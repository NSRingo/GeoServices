const INTERNATIONAL_3D_STYLES = new Set([
	// iOS 27 uses the formerly reserved style 98 for the international
	// satellite selector (observed as /tile?style=98). It must remain in the
	// single international selector set for coordinate-based CN routing.
	"UNUSED_98",
	"SPUTNIK_METADATA",
	"SPUTNIK_C3M",
	"SPUTNIK_DSM",
	"SPUTNIK_DSM_GLOBAL",
	"SPUTNIK_VECTOR_BORDER",
	"FLYOVER_C3M_MESH",
	"FLYOVER_C3M_JPEG_TEXTURE",
	"FLYOVER_C3M_ASTC_TEXTURE",
	"FLYOVER_VISIBILITY",
	"FLYOVER_SKYBOX",
	"FLYOVER_NAVGRAPH",
	"FLYOVER_METADATA",
	"MUNIN_METADATA",
	"VECTOR_SPR_MERCATOR",
	"VECTOR_SPR_MODELS",
	"VECTOR_SPR_MATERIALS",
	"VECTOR_SPR_METADATA",
	"SPR_ASSET_METADATA",
	"VECTOR_SPR_POLAR",
	"VECTOR_SPR_MODELS_OCCLUSION",
]);

// Mainland 3D is optional because duplicate capability styles are more
// sensitive than ordinary 2D tiles on iOS 27. Keep Munin/Look Around and the
// global border/polar selectors international-only even when this is enabled.
const MAINLAND_3D_STYLES = new Set([
	"SPUTNIK_METADATA",
	"SPUTNIK_C3M",
	"SPUTNIK_DSM",
	"SPUTNIK_DSM_GLOBAL",
	"FLYOVER_C3M_MESH",
	"FLYOVER_C3M_JPEG_TEXTURE",
	"FLYOVER_C3M_ASTC_TEXTURE",
	"FLYOVER_VISIBILITY",
	"FLYOVER_SKYBOX",
	"FLYOVER_NAVGRAPH",
	"FLYOVER_METADATA",
	"VECTOR_SPR_MERCATOR",
	"VECTOR_SPR_MODELS",
	"VECTOR_SPR_MATERIALS",
	"VECTOR_SPR_METADATA",
	"SPR_ASSET_METADATA",
	"VECTOR_SPR_MODELS_OCCLUSION",
]);

const MAINLAND_CORE_STYLES = new Set([
	"VECTOR_STANDARD",
	"VECTOR_BUILDINGS",
	"VECTOR_POI",
	"VECTOR_REALISTIC",
	"VECTOR_VENUES",
	"VECTOR_LAND_COVER",
	"VECTOR_STREET_POI",
	"VECTOR_STREET_LANDMARKS",
	"VECTOR_POI_V2",
	"VECTOR_BUILDINGS_V2",
	"VECTOR_POI_V2_UPDATE",
]);

const MAINLAND_EXTENDED_STYLES = new Set([
	...MAINLAND_CORE_STYLES,
	"VECTOR_TRAFFIC_SEGMENTS_FOR_RASTER",
	"VECTOR_TRAFFIC_INCIDENTS_FOR_RASTER",
	"VECTOR_TRAFFIC_SEGMENTS_AND_INCIDENTS_FOR_RASTER",
	"RASTER_STANDARD_BACKGROUND",
	"RASTER_HYBRID",
	"RASTER_SATELLITE",
	"RASTER_TERRAIN",
	"VECTOR_TRAFFIC",
	"VECTOR_ROADS",
	"RASTER_VEGETATION",
	"VECTOR_TRAFFIC_SKELETON",
	"RASTER_COASTLINE_MASK",
	"RASTER_HILLSHADE",
	"VECTOR_TRAFFIC_WITH_GREEN",
	"VECTOR_TRAFFIC_STATIC",
	"RASTER_COASTLINE_DROP_MASK",
	"VECTOR_TRAFFIC_SKELETON_WITH_HISTORICAL",
	"VECTOR_SPEED_PROFILES",
	"RASTER_DOWN_SAMPLED",
	"RASTER_COLOR_BALANCED",
	"RASTER_SATELLITE_NIGHT",
	"RASTER_SATELLITE_DIGITIZE",
	"RASTER_HILLSHADE_PARKS",
	"RASTER_STANDARD_BASE",
	"RASTER_STANDARD_LABELS",
	"RASTER_HYBRID_ROADS",
	"RASTER_HYBRID_LABELS",
	"RASTER_SATELLITE_ASTC",
	"RASTER_HYBRID_ROADS_AND_LABELS",
	"VECTOR_POLYGON_SELECTION",
	"VECTOR_TRAFFIC_V2",
	"VECTOR_TOPOGRAPHIC",
	"VECTOR_CONTOURS",
]);

const MAINLAND_AT_Z8 = [
	[214, 82, 216, 82], [213, 83, 217, 83], [213, 84, 218, 84], [213, 85, 218, 85],
	[212, 86, 218, 86], [189, 87, 190, 87], [210, 87, 220, 87], [188, 88, 191, 88],
	[210, 88, 223, 88], [188, 89, 192, 89], [210, 89, 223, 89], [186, 90, 192, 90],
	[210, 90, 223, 90], [186, 91, 192, 91], [209, 91, 222, 91], [184, 92, 195, 92],
	[207, 92, 221, 92], [185, 93, 196, 93], [206, 93, 221, 93], [182, 94, 219, 95],
	[180, 96, 217, 96], [180, 97, 216, 97], [180, 98, 214, 98], [180, 99, 215, 99],
	[182, 100, 214, 100], [183, 101, 213, 101], [184, 102, 214, 102], [183, 103, 214, 103],
	[184, 104, 215, 104], [185, 105, 215, 105], [187, 106, 215, 106], [189, 107, 193, 107],
	[197, 107, 213, 107], [198, 108, 213, 108], [197, 109, 213, 109], [197, 110, 213, 110],
	[198, 111, 213, 111], [204, 112, 209, 112], [205, 113, 207, 113], [205, 114, 206, 114],
	[205, 115, 207, 115],
];

const clone = value => {
	if (typeof structuredClone === "function") return structuredClone(value);
	return JSON.parse(JSON.stringify(value));
};

const endpoint = value => String(value?.url ?? value?.baseURL ?? value ?? "");
const isMainlandEndpoint = value => /(?:-cn-ssl\.ls\.apple\.(?:com|cn)|\.is\.autonavi\.com)(?:[/:]|$)/i.test(endpoint(value));

const mainlandRegions = (minZ, maxZ) => {
	const factor = 2 ** (minZ - 8);
	return MAINLAND_AT_Z8.map(([minX, minY, maxX, maxY]) => ({
		minX: minX * factor,
		minY: minY * factor,
		maxX: (maxX + 1) * factor - 1,
		maxY: (maxY + 1) * factor - 1,
		minZ,
		maxZ,
	}));
};

const copyKeys = (target, source, keys) => {
	for (const key of keys) {
		if (typeof source?.[key] !== "undefined") target[key] = clone(source[key]);
	}
};

const saveRouteConfig = (caches, enabled) => {
	if (!enabled || !globalThis.$persistentStore?.write) return;
	const routedStyles = new Set([
		"RASTER_SATELLITE",
		"RASTER_SATELLITE_NIGHT",
		"RASTER_SATELLITE_DIGITIZE",
		"RASTER_SATELLITE_ASTC",
		...MAINLAND_3D_STYLES,
	]);
	const routes = [];
	for (const internationalTile of caches.XX?.tileSet ?? []) {
		if (!routedStyles.has(internationalTile?.style) || !internationalTile?.baseURL) continue;
		const mainlandTile = caches.CN?.tileSet?.find(tile =>
			tile?.style === internationalTile.style &&
			tile?.scale === internationalTile.scale &&
			tile?.size === internationalTile.size
		) ?? caches.CN?.tileSet?.find(tile => tile?.style === internationalTile.style);
		if (!mainlandTile?.baseURL) continue;
		const internationalVersions = internationalTile.validVersion ?? [];
		const mainlandVersions = mainlandTile.validVersion ?? [];
		const versionMap = {};
		for (let index = 0; index < internationalVersions.length; index++) {
			const from = internationalVersions[index]?.identifier;
			const to = mainlandVersions[index]?.identifier ?? mainlandVersions[0]?.identifier;
			if (typeof from !== "undefined" && typeof to !== "undefined") versionMap[String(from)] = String(to);
		}
		routes.push({
			style: internationalTile.style,
			fromStyle: internationalTile.style,
			toStyle: mainlandTile.style,
			scale: internationalTile.scale,
			size: internationalTile.size,
			internationalBaseURL: internationalTile.baseURL,
			mainlandBaseURL: mainlandTile.baseURL,
			versionMap,
		});
	}
	// Confirmed on iOS 27: the international satellite selector is style 98,
	// while the equivalent AutoNavi/CN selector remains RASTER_SATELLITE (7).
	// The current protobuf schema still names 98 UNUSED_98, so it cannot be
	// paired by the legacy same-name loop above.
	const internationalSatellite = caches.XX?.tileSet?.find(tile => tile?.style === "UNUSED_98");
	const mainlandSatellite = caches.CN?.tileSet?.find(tile =>
		tile?.style === "RASTER_SATELLITE" &&
		tile?.scale === internationalSatellite?.scale &&
		tile?.size === internationalSatellite?.size
	) ?? caches.CN?.tileSet?.find(tile => tile?.style === "RASTER_SATELLITE");
	if (internationalSatellite?.baseURL && mainlandSatellite?.baseURL) {
		const fromVersions = internationalSatellite.validVersion ?? [];
		const toVersions = mainlandSatellite.validVersion ?? [];
		const versionMap = {};
		for (let index = 0; index < fromVersions.length; index++) {
			const from = fromVersions[index]?.identifier;
			const to = toVersions[index]?.identifier ?? toVersions[0]?.identifier;
			if (typeof from !== "undefined" && typeof to !== "undefined") versionMap[String(from)] = String(to);
		}
		// Keep the observed mapping as a compatibility fallback if manifest
		// version ordering changes or omits one side during cache warm-up.
		versionMap["226"] ??= "68";
		routes.push({
			style: "UNUSED_98",
			fromStyle: "UNUSED_98",
			toStyle: "RASTER_SATELLITE",
			fromStyleValue: "98",
			toStyleValue: "7",
			scale: internationalSatellite.scale,
			size: internationalSatellite.size,
			internationalBaseURL: internationalSatellite.baseURL,
			mainlandBaseURL: mainlandSatellite.baseURL,
			versionMap,
			targetQuery: {
				size: String(mainlandSatellite.size ?? 1),
				scale: String(mainlandSatellite.scale ?? 2),
				vertical_datum: "wgs84",
			},
			removeQuery: ["region", "h"],
		});
	}
	globalThis.$persistentStore.write(JSON.stringify({ updatedAt: Date.now(), routes }), "iRingo.Maps.HybridSatelliteRoute.v3");
};

/**
 * Keep the international manifest authoritative while adding mainland-only
 * rendering and service data. Inspired by the supplied Loon hybrid fix, but
 * deliberately keeps service selection configurable for iOS 27.
 */
export default function applyInternationalHybrid(body, caches, settings = {}) {
	const enabled = String(settings?.Hybrid?.Enabled ?? "false").toLowerCase() !== "false";
	if (!enabled || !body || !Array.isArray(body.tileSet) || !Array.isArray(caches?.CN?.tileSet)) return body;

	const layerMode = String(settings?.Hybrid?.MainlandLayers ?? "EXTENDED").toUpperCase();
	const mainlandStyles = new Set(layerMode === "CORE" ? MAINLAND_CORE_STYLES : MAINLAND_EXTENDED_STYLES);
	const mainland3DMode = String(settings?.Hybrid?.Mainland3D ?? "DISABLED").toUpperCase();
	const coordinateRouteEnabled = mainland3DMode === "ROUTE";
	if (coordinateRouteEnabled) {
		// Duplicate CN/global imagery styles are sticky on iOS 27. Leave one
		// international selector and let the request route choose CN by tile
		// coordinate, so switching directly from China to an overseas city works.
		for (const style of [
			"RASTER_SATELLITE",
			"RASTER_SATELLITE_NIGHT",
			"RASTER_SATELLITE_DIGITIZE",
			"RASTER_SATELLITE_ASTC",
		]) mainlandStyles.delete(style);
		saveRouteConfig(caches, true);
	}
	const international3DTiles = (caches.XX?.tileSet ?? [])
		.filter(tile => INTERNATIONAL_3D_STYLES.has(tile?.style))
		.map(sourceTile => {
			const tile = clone(sourceTile);
			if (tile.style === "UNUSED_98" && Array.isArray(tile.validVersion)) {
				// The iOS 27 international satellite selector normally has no CN
				// coverage, so Maps never emits a mainland request to the route.
				// Add the mainland tile regions to this single selector; the request
				// router then converts only those coordinates to AutoNavi. Keep the
				// original international coverage for every other country.
				tile.countryRegionWhitelist = [];
				tile.validVersion = tile.validVersion.map(version => ({
					...version,
					availableTiles: [
						...(version.availableTiles ?? []),
						...mainlandRegions(8, Math.max(22, version.availableTiles?.reduce((max, region) => Math.max(max, region.maxZ), 0) || 0)),
					],
				}));
			}
			return tile;
		});
	const international3DKeys = new Set(
		[...INTERNATIONAL_3D_STYLES].map(style => style),
	);

	// Remove old mainland copies before inserting exactly one region-limited
	// replacement. Roads/network/transit/Munin capability selectors remain Apple
	// international; this avoids double labels and broken Look Around selection.
	body.tileSet = body.tileSet.filter(tile =>
		!international3DKeys.has(tile?.style) &&
		!(mainlandStyles.has(tile?.style) && isMainlandEndpoint(tile?.baseURL))
	);
	for (const sourceTile of international3DTiles) {
		const exists = body.tileSet.some(tile =>
			tile?.style === sourceTile.style &&
			tile?.scale === sourceTile.scale &&
			tile?.size === sourceTile.size &&
			tile?.dataSet === sourceTile.dataSet
		);
		if (!exists) body.tileSet.push(sourceTile);
	}

	const mainland3DEnabled = mainland3DMode === "ENABLED" || mainland3DMode === "NATIVE";
	const china3DTiles = [];
	if (mainland3DEnabled) {
		for (const sourceTile of caches.CN.tileSet) {
			if (!MAINLAND_3D_STYLES.has(sourceTile?.style)) continue;
			const tile = clone(sourceTile);
			tile.countryRegionWhitelist = [{ countryCode: "CN", region: "" }];
			// Preserve Apple's original CN 3D availability polygons. Unlike 2D,
			// expanding sparse model coverage to all mainland tiles would create
			// empty meshes and could hide the international fallback.
			if (Array.isArray(tile.validVersion) && tile.validVersion.length) china3DTiles.push(tile);
		}
	}

	const chinaTiles = [];
	for (const sourceTile of caches.CN.tileSet) {
		if (!mainlandStyles.has(sourceTile?.style)) continue;
		const tile = clone(sourceTile);
		// Keep the source dataset identity where present; iOS 27 uses it when
		// selecting China road/label/satellite variants. Coverage is restricted by
		// availableTiles, and an explicit CN whitelist adds a second boundary.
		tile.countryRegionWhitelist = [{ countryCode: "CN", region: "" }];
		tile.validVersion = (tile.validVersion || []).map(version => {
			const sourceRegions = version.availableTiles || [];
			const sourceMinZ = Math.min(...sourceRegions.map(region => region.minZ));
			const sourceMaxZ = Math.max(...sourceRegions.map(region => region.maxZ));
			const minZ = Math.max(8, sourceMinZ);
			return {
				...version,
				availableTiles: Number.isFinite(sourceMaxZ) && sourceMaxZ >= minZ ? mainlandRegions(minZ, sourceMaxZ) : [],
				timeToLiveSeconds: Math.min(version.timeToLiveSeconds || 3600, 3600),
			};
		}).filter(version => version.availableTiles.length);
		if (tile.validVersion.length) chinaTiles.push(tile);
	}
	// CN entries precede the international fallback only inside this optional
	// profile. Their original coverage plus CN whitelist keeps them regional.
	body.tileSet = [...china3DTiles, ...chinaTiles, ...body.tileSet];

	// Start with the Apple international endpoint set. Then selectively restore
	// mainland services instead of allowing a broad object merge to leak CN-only
	// capability endpoints into Flyover, Look Around or global coverage.
	const internationalUrlInfo = caches.XX?.urlInfoSet?.[0];
	const mainlandUrlInfo = caches.CN?.urlInfoSet?.[0];
	if (Array.isArray(body.urlInfoSet) && internationalUrlInfo && mainlandUrlInfo) {
		const hybridUrlInfo = clone(internationalUrlInfo);
		// CN_POI is the stable default for the hybrid profile: restore mainland
		// AutoNavi place/POI and reverse-geocoding data while keeping Apple
		// navigation unless the module explicitly selects another mode.
		const mode = String(settings?.Hybrid?.ServiceMode ?? "CN_POI").toUpperCase();
		const reverseGeocodingKeys = [
			"batchReverseGeocoderURL",
			"backgroundRevGeoURL",
			"batchReverseGeocoderPlaceRequestURL",
			"reverseGeocoderVersionsURL",
		];
		const placeKeys = [
			"dispatcherURL",
			"backgroundDispatcherURL",
			"bluePOIDispatcherURL",
			"spatialLookupURL",
			"alternateResourcesURL",
			"addressCorrectionInitURL",
			"addressCorrectionUpdateURL",
		];
		const navigationKeys = [
			"directionsURL",
			"etaURL",
			"simpleETAURL",
			"proactiveRoutingURL",
			"realtimeTrafficProbeURL",
			"batchTrafficProbeURL",
		];
		copyKeys(hybridUrlInfo, mainlandUrlInfo, reverseGeocodingKeys);
		if (mode === "CN_POI" || mode === "CN_FULL") copyKeys(hybridUrlInfo, mainlandUrlInfo, placeKeys);
		if (mode === "CN_FULL") copyKeys(hybridUrlInfo, mainlandUrlInfo, navigationKeys);
		if (settings?.UrlInfoSet?.LocationShift === "AutoNavi") {
			copyKeys(hybridUrlInfo, mainlandUrlInfo, [
				"polyLocationShiftURL",
				"locationShiftURL",
				"locationShiftEnabledRegion",
				"locationShiftVersion",
			]);
		}
		body.urlInfoSet[0] = hybridUrlInfo;
	}

	if (Array.isArray(body.attribution)) {
		body.attribution = body.attribution.map(item => {
			if (item?.name !== "AutoNavi") return item;
			const attribution = clone(item);
			attribution.resource = (attribution.resource || []).filter(resource =>
				resource?.resourceType !== 6 && resource?.resourceType !== "ATTRIBUTION_LOGO"
			);
			return attribution;
		});
	}

	const leakedCriticalTile = body.tileSet.find(tile =>
		INTERNATIONAL_3D_STYLES.has(tile?.style) &&
		isMainlandEndpoint(tile?.baseURL) &&
		(!mainland3DEnabled || !MAINLAND_3D_STYLES.has(tile?.style))
	);
	const internationalMunin = body.tileSet.find(tile => tile?.style === "MUNIN_METADATA" && !isMainlandEndpoint(tile?.baseURL));
	const mainlandMunin = body.tileSet.find(tile => tile?.style === "MUNIN_METADATA" && isMainlandEndpoint(tile?.baseURL));
	if (leakedCriticalTile) console.log(`[iRingo Hybrid] warning: unexpected mainland 3D style remains: ${leakedCriticalTile.style}`);
	if (!internationalMunin) console.log("[iRingo Hybrid] warning: international Munin metadata was not found");
	if (mainlandMunin) console.log("[iRingo Hybrid] warning: mainland Munin metadata must remain disabled");
	console.log(`[iRingo Hybrid] injected ${chinaTiles.length} mainland-only 2D and ${china3DTiles.length} original-coverage 3D tile sets; service mode ${settings?.Hybrid?.ServiceMode ?? "CN_POI"}`);
	return body;
}
