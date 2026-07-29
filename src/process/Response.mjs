import { Console, Lodash as _ } from "@nsnanocat/util";
import XML from "../XML/XML.mjs";
import database from "../function/database.mjs";
import setENV from "../function/setENV.mjs";
import GEOResourceManifest from "../class/GEOResourceManifest.mjs";
import GEOResourceManifestDownload from "../class/GEOResourceManifestDownload.mjs";
/***************** Processing *****************/
export async function Response($request, $response, KV) {
	// 解构URL
	const url = new URL($request.url);
	Console.info(`url: ${url.toJSON()}`);
	// 获取连接参数
	const PATHs = url.pathname.split("/").filter(Boolean);
	Console.info(`PATHs: ${PATHs}`);
	// 解析格式
	const FORMAT = ($response.headers?.["Content-Type"] ?? $response.headers?.["content-type"])?.split(";")?.[0];
	Console.info(`FORMAT: ${FORMAT}`);
	const PLATFORM = ["Maps"];
	if (url.searchParams.get("os") === "watchos") PLATFORM.push("Watch");
	Console.info(`PLATFORM: ${PLATFORM}`);
	/**
	 * 设置
	 * @type {{Settings: import('./types').Settings}}
	 */
	const { Settings, Caches, Configs } = await setENV("iRingo", PLATFORM, database);
	Console.logLevel = Settings.LogLevel;
	// 创建空数据
	let body = {};
	// 格式判断
	switch (FORMAT) {
		case undefined: // 视为无body
			break;
		case "application/x-www-form-urlencoded":
		case "text/plain":
		default:
			break;
		case "application/x-mpegURL":
		case "application/x-mpegurl":
		case "application/vnd.apple.mpegurl":
		case "audio/mpegurl":
			break;
		case "text/xml":
		case "text/html":
		case "text/plist":
		case "application/xml":
		case "application/plist":
		case "application/x-plist":
			// 主机判断
			switch (url.hostname) {
				case "configuration.ls.apple.com":
					BigInt.prototype.toJSON = function () {
						return this.toString();
					};
					body = XML.parse($response.body);
					// 路径判断
					switch (url.pathname) {
						case "/config/defaults": {
							const PLIST = body.plist;
							if (PLIST) {
								// CN
								PLIST["com.apple.GEO"].CountryProviders.CN.ShouldEnableLagunaBeach = true; // XX
								delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.DrivingMultiWaypointRoutesEnabled; // 路线-驾驶-停靠点
								delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.LocalitiesAndLandmarksSupported; // 支持地名和地标
								delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.NavigationShowHeadingKey; // 导航时显示朝向按钮
								delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.POIBusynessRealTime; // 兴趣点繁忙度的实时展示？（需要，默认仅 CN 停用）
								delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.PedestrianAREnabled; // 步行-现实世界中的线路-举起以查看
								PLIST["com.apple.GEO"].CountryProviders.CN.SupportsCarIntegration = true; // 支持车辆集成
								PLIST["com.apple.GEO"].DrivingMultiWaypointRoutesEnabled = true; // 路线-驾驶-停靠点（不需要，默认全局启用）
								PLIST["com.apple.GEO"].LocalitiesAndLandmarksSupported = true; // 支持地名和地标（不需要，默认全局启用）
								PLIST["com.apple.GEO"].NavigationShowHeadingKey = true; // 导航时显示朝向按钮（需要，默认全局停用）
								PLIST["com.apple.GEO"]["6694982d2b14e95815e44e970235e230"] = true; // ?（需要，默认仅 US 启用）
								PLIST["com.apple.GEO"].OpticalHeadingEnabled = true; // 步行-导航精确度-增强（需要，默认仅 US 启用）
								PLIST["com.apple.GEO"].PedestrianAREnabled = true; // 步行-现实世界中的线路-举起以查看（不需要，默认全局启用）
								PLIST["com.apple.GEO"].TransitPayEnabled = true; // 地图 App 中的交通卡和支付卡（不需要，默认全局启用）
								PLIST["com.apple.GEO"].UseCLPedestrianMapMatchedLocations = true; // 使用 Pedestrian 地图匹配位置？（需要，默认仅 US 启用）
							}
							break;
						}
					}
					$response.body = XML.stringify(body);
					break;
				case "gspe1-ssl.ls.apple.com":
					// 路径判断
					switch (url.pathname) {
						case "/pep/gcc":
							break;
					}
					break;
			}
			break;
		case "text/vtt":
		case "application/vtt":
			break;
		case "text/json":
		case "application/json":
			body = JSON.parse($response.body);
			Console.debug(`body: ${JSON.stringify(body)}`);
			$response.body = JSON.stringify(body);
			break;
		case "application/protobuf":
		case "application/x-protobuf":
		case "application/vnd.google.protobuf":
		case "application/grpc":
		case "application/grpc+proto":
		case "application/octet-stream": {
			let rawBody = $response.bodyBytes ? new Uint8Array($response.bodyBytes) : ($response.body ?? new Uint8Array());
			switch (FORMAT) {
				case "application/protobuf":
				case "application/x-protobuf":
				case "application/vnd.google.protobuf":
				case "application/octet-stream":
					switch (url.hostname) {
						case "gspe35-ssl.ls.apple.com":
							geoManifestPath: switch (url.pathname) {
								case "/config/announcements":
									break;
								case "/geo_manifest/dynamic/config": {
									body = GEOResourceManifestDownload.decode(rawBody);
									const CountryCode = url.searchParams.get("country_code");
									let source;
									let target;
									let tileStyles;
									switch (CountryCode) {
										case "CN": {
											source = body;
											const xxURL = new URL(url.toString());
											xxURL.searchParams.set("country_code", "US");
											target = await GEOResourceManifest.decodeCache(Caches, xxURL.search, KV);
											const isReady = Boolean(target);
											if (!isReady) {
												Console.warn("Missing cache: XX");
											}
											if (!isReady) break geoManifestPath;
											tileStyles = [
												"RASTER_STANDARD",
												"VECTOR_LEGACY_REALISTIC",
												"SPUTNIK_VECTOR_BORDER",
												"VECTOR_TRANSIT",
												"VECTOR_TRANSIT_SELECTION",
												"VECTOR_COVERAGE",
												"VECTOR_ROAD_NETWORK",
												"VECTOR_DEBUG",
												"MUNIN_METADATA",
												"VECTOR_TRACKS",
												"VECTOR_RESERVED_2",
												"COARSE_LOCATION_POLYGONS",
												"VECTOR_SPR_ROADS",
												"VECTOR_SPR_STANDARD",
												"VL_METADATA",
												"VL_DATA",
												"PROACTIVE_APP_CLIP",
												"POI_BUSYNESS",
												"POI_DP_BUSYNESS",
												"SMART_INTERFACE_SELECTION",
												"VECTOR_ASSETS",
												"VECTOR_SPR_POLAR",
												"SMART_DATA_MODE",
												"CELLULAR_PERFORMANCE_SCORE",
												"VECTOR_LIVE_DATA_UPDATES",
												"VECTOR_ROAD_SELECTION",
												"VECTOR_REGION_METADATA",
												"RAY_TRACING",
												"RASTER_SATELLITE_POLAR",
												"VMAP4_ELEVATION",
												"VMAP4_ELEVATION_POLAR",
												"CELLULAR_COVERAGE_PLMN",
												"RASTER_SATELLITE_POLAR_NIGHT",
												"BLUEPOI_MODEL",
												"BLUEPOI_AOI",
												"FLYOVER_V2_R3D",
												"FLYOVER_V2_DSM",
												"FLYOVER_V2_METADATA",
												"VECTOR_DCT",
												"SECA",
												"UNUSED_103",
												"UNUSED_104",
												"UNUSED_105",
												"UNUSED_106",
												"UNUSED_107",
												"UNUSED_108",
												"UNUSED_109",
												"UNUSED_110",
												"UNUSED_111",
												"UNUSED_112",
												"UNUSED_113",
												"UNUSED_114",
												"UNUSED_115",
												"UNUSED_116",
												"UNUSED_117",
												"UNUSED_118",
												"UNUSED_119",
												"UNUSED_120",
											];
											break;
										}
										default: {
											const cnURL = new URL(url.toString());
											cnURL.searchParams.set("country_code", "CN");
											source = await GEOResourceManifest.decodeCache(Caches, cnURL.search, KV);
											target = body;
											const isReady = Boolean(source);
											if (!isReady) {
												Console.warn("Missing cache: CN");
											}
											if (!isReady) break geoManifestPath;
											tileStyles = [
												"VECTOR_STANDARD",
												"VECTOR_TRAFFIC_SEGMENTS_FOR_RASTER",
												"VECTOR_TRAFFIC_INCIDENTS_FOR_RASTER",
												"VECTOR_TRAFFIC_SEGMENTS_AND_INCIDENTS_FOR_RASTER",
												"RASTER_STANDARD_BACKGROUND",
												"RASTER_HYBRID",
												"RASTER_SATELLITE",
												"RASTER_TERRAIN",
												"VECTOR_BUILDINGS",
												"VECTOR_TRAFFIC",
												"VECTOR_POI",
												"SPUTNIK_METADATA",
												"SPUTNIK_C3M",
												"SPUTNIK_DSM",
												"SPUTNIK_DSM_GLOBAL",
												"VECTOR_REALISTIC",
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
												"VECTOR_VENUES",
												"RASTER_DOWN_SAMPLED",
												"RASTER_COLOR_BALANCED",
												"RASTER_SATELLITE_NIGHT",
												"RASTER_SATELLITE_DIGITIZE",
												"RASTER_HILLSHADE_PARKS",
												"RASTER_STANDARD_BASE",
												"RASTER_STANDARD_LABELS",
												"RASTER_HYBRID_ROADS",
												"RASTER_HYBRID_LABELS",
												"FLYOVER_C3M_MESH",
												"FLYOVER_C3M_JPEG_TEXTURE",
												"FLYOVER_C3M_ASTC_TEXTURE",
												"RASTER_SATELLITE_ASTC",
												"RASTER_HYBRID_ROADS_AND_LABELS",
												"FLYOVER_VISIBILITY",
												"FLYOVER_SKYBOX",
												"FLYOVER_NAVGRAPH",
												"FLYOVER_METADATA",
												"VECTOR_LAND_COVER",
												"VECTOR_STREET_POI",
												"VECTOR_SPR_MERCATOR",
												"VECTOR_SPR_MODELS",
												"VECTOR_SPR_MATERIALS",
												"VECTOR_SPR_METADATA",
												"VECTOR_STREET_LANDMARKS",
												"VECTOR_POI_V2",
												"VECTOR_POLYGON_SELECTION",
												"VECTOR_BUILDINGS_V2",
												"SPR_ASSET_METADATA",
												"VECTOR_SPR_MODELS_OCCLUSION",
												"VECTOR_TOPOGRAPHIC",
												"VECTOR_POI_V2_UPDATE",
												"VECTOR_TRAFFIC_V2",
												"VECTOR_CONTOURS",
											];
											break;
										}
									}
									body.tileSet = GEOResourceManifest.tileSets(source.tileSet, target.tileSet, tileStyles);
									body.attribution = GEOResourceManifest.attributions(source.attribution, target.attribution, CountryCode);
									body.resource = GEOResourceManifest.resources(source.resource, target.resource, CountryCode);
									body.dataSet = GEOResourceManifest.dataSets(source.dataSet, target.dataSet, CountryCode);
									body.urlInfoSet = GEOResourceManifest.urlInfoSets(source.urlInfoSet, target.urlInfoSet, Settings, CountryCode);
									body.muninBucket = GEOResourceManifest.muninBuckets(source.muninBucket, target.muninBucket, Settings);
									body.displayString = GEOResourceManifest.displayStrings(source.displayString, target.displayString, CountryCode);
									body.tileGroup = GEOResourceManifest.tileGroups(body.tileGroup, body.tileSet, body.attribution, body.resource);
									Console.debug(`releaseInfo: ${body.releaseInfo}`);
									rawBody = GEOResourceManifestDownload.encode(body);
									break;
								}
							}
							break;
					}
					break;
				case "application/grpc":
				case "application/grpc+proto":
					break;
			}
			// 写入二进制数据
			$response.body = rawBody;
			break;
		}
	}
	return $response;
}
