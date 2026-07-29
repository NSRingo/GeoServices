import { Console, Lodash as _ } from "@nsnanocat/util";
import XML from "../XML/XML.mjs";
import database from "../function/database.mjs";
import setENV from "../function/setENV.mjs";
import GEOResourceManifest from "../class/GEOResourceManifest.mjs";
import GEOResourceManifestDownload from "../class/GEOResourceManifestDownload.mjs";
import { BinaryReader, UnknownFieldHandler } from "@protobuf-ts/runtime";
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
			//Console.debug(`body: ${body}`);
			break;
		case "application/x-mpegURL":
		case "application/x-mpegurl":
		case "application/vnd.apple.mpegurl":
		case "audio/mpegurl":
			//body = M3U8.parse($response.body);
			//Console.debug(`body: ${JSON.stringify(body)}`);
			//$response.body = M3U8.stringify(body);
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
					//body = await PLISTs("plist2json", $response.body);
					BigInt.prototype.toJSON = function () {
						return this.toString();
					};
					body = XML.parse($app === "Node.js" ? new TextDecoder().decode($response.body ?? new Uint8Array()) : $response.body);
					Console.debug(`body: ${JSON.stringify(body)}`);
					// 路径判断
					switch (url.pathname) {
						case "/config/defaults": {
							const PLIST = body.plist;
							if (PLIST) {
								// CN
								PLIST["com.apple.GEO"].CountryProviders.CN.ShouldEnableLagunaBeach = true; // XX
								delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.DrivingMultiWaypointRoutesEnabled; // 路线-驾驶-停靠点
								//PLIST["com.apple.GEO"].CountryProviders.CN.EnableAlberta = false; // CN
								//PLIST["com.apple.GEO"].CountryProviders.CN.EnableClientDrapedVectorPolygons = true; // CN
								//delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.GEOAddressCorrectionEnabled; // 启用更正地址
								//delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.GEOBatchSpatialEventLookupMaxParametersCount; // CN
								//delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.GEOBatchSpatialPlaceLookupMaxParametersCount; // CN
								delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.LocalitiesAndLandmarksSupported; // 支持地名和地标
								delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.NavigationShowHeadingKey; // 导航时显示朝向按钮
								//delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.ODcwM0Y2NTgtOTY2M; // CN ??
								//delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.POIBusynessDifferentialPrivacy; // POI 繁忙度差分隐私？（需要，默认仅 CN 停用）
								delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.POIBusynessRealTime; // 兴趣点繁忙度的实时展示？（需要，默认仅 CN 停用）
								delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.PedestrianAREnabled; // 步行-现实世界中的线路-举起以查看
								//delete PLIST["com.apple.GEO"]?.CountryProviders?.CN?.SupportedCountriesCustomRouteCreation; // 支持创建自定义步行或徒步线路
								//PLIST["com.apple.GEO"].CountryProviders.CN.TransitPayEnabled = true; // 地图 App 中的交通卡和支付卡（不需要，默认全局启用）
								//PLIST["com.apple.GEO"].CountryProviders.CN.WiFiQualityNetworkDisabled = undefined; // CN
								//PLIST["com.apple.GEO"].CountryProviders.CN.WiFiQualityTileDisabled = undefined; // CN
								//PLIST["com.apple.GEO"].CountryProviders.CN.SupportsOffline = true; // 支持离线地图（不需要，macOS 不支持）
								PLIST["com.apple.GEO"].CountryProviders.CN.SupportsCarIntegration = true; // 支持车辆集成
								// TW
								//PLIST["com.apple.GEO"].CountryProviders.CN.GEOShouldSpeakWrittenAddresses = true; // TW
								//PLIST["com.apple.GEO"].CountryProviders.CN.GEOShouldSpeakWrittenPlaceNames = true; // TW
								// Public
								//PLIST["com.apple.GEO"].GEOMapDarkStylesEnabledKey = "1"; // 深色地图样式启用按钮（不需要，仅 macOS 支持）
								//if (PLIST["com.apple.GEO"].Q0FFNUI2QUEtRUU2) PLIST["com.apple.GEO"].Q0FFNUI2QUEtRUU2.push("CN");
								//if (PLIST["com.apple.GEO"].SupportedCountriesCustomRouteCreation) PLIST["com.apple.GEO"].SupportedCountriesCustomRouteCreation.push("CN"); // 支持创建自定义步行或徒步线路
								//if (PLIST["com.apple.GEO"].VisitedPlacesWarmingSheetCountryEnabled) PLIST["com.apple.GEO"].VisitedPlacesWarmingSheetCountryEnabled.push("CN");
								// mod
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
					Console.debug(`body: ${JSON.stringify(body)}`);
					//$response.body = await PLISTs("json2plist", body); // json2plist
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
			//body = VTT.parse($response.body);
			//Console.debug(`body: ${JSON.stringify(body)}`);
			//$response.body = VTT.stringify(body);
			break;
		case "text/json":
		case "application/json":
			body = JSON.parse($app === "Node.js" ? new TextDecoder().decode($response.body ?? new Uint8Array()) : ($response.body ?? "{}"));
			Console.debug(`body: ${JSON.stringify(body)}`);
			$response.body = JSON.stringify(body);
			break;
		case "application/protobuf":
		case "application/x-protobuf":
		case "application/vnd.google.protobuf":
		case "application/grpc":
		case "application/grpc+proto":
		case "application/octet-stream": {
			//Console.debug(`$response: ${JSON.stringify($response, null, 2)}`);
			let rawBody = $response.bodyBytes ? new Uint8Array($response.bodyBytes) : ($response.body ?? new Uint8Array());
			//Console.debug(`isBuffer? ${ArrayBuffer.isView(rawBody)}: ${JSON.stringify(rawBody)}`);
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
									//Console.debug(`body before: ${JSON.stringify(body)}`);
									/*
                                    let UF = UnknownFieldHandler.list(body);
                                    //Console.debug(`调试信息`, `UF: ${JSON.stringify(UF)}`);
                                    if (UF) {
                                        UF = UF.map(uf => {
                                            uf.no; // 22
                                            uf.wireType; // WireType.Varint
                                            // use the binary reader to decode the raw data:
                                            let reader = new BinaryReader(uf.data);
                                            let addedNumber = reader.int32(); // 7777
                                            Console.debug(`no: ${uf.no}, wireType: ${uf.wireType}, reader: ${reader}, addedNumber: ${addedNumber}`);
                                        });
                                    };
									*/
									const CountryCode = url.searchParams.get("country_code");
									let source;
									let tileStyles;
									switch (CountryCode) {
										case "CN": {
											const xxURL = new URL(url.toString());
											xxURL.searchParams.set("country_code", "US");
											source = await GEOResourceManifest.decodeCache(Caches, xxURL.search, KV);
											const isReady = Boolean(source);
											if (!isReady) {
												Console.warn("Missing cache: XX");
											}
											if (!isReady) break geoManifestPath;
											tileStyles = [
												"RASTER_STANDARD", // 0
												"VECTOR_LEGACY_REALISTIC", // 19
												"SPUTNIK_VECTOR_BORDER", // 34 卫星地图（3D/俯瞰）边界（决定能否显示地球模型） | INTERNATIONAL_3D_STYLES
												"MUNIN_METADATA", // 57 四处看看 元数据 | INTERNATIONAL_3D_STYLES
												"VECTOR_TRACKS", // 62 轨道?
												"VECTOR_RESERVED_2", // 63
												"COARSE_LOCATION_POLYGONS", // 65 粗略位置多边形?
												"VECTOR_SPR_ROADS", // 66 (卫星图下的道路网格和四处看看可用性)
												"VECTOR_SPR_STANDARD", // 67 (影响 1-6 级视图下的行政区域名称与资料显示版本)
												"VL_METADATA", // 70 VL 元数据?
												"VL_DATA", // 71 VL 数据?
												"PROACTIVE_APP_CLIP", // 72 主动式App剪辑?
												"POI_BUSYNESS", // 74 兴趣点繁忙程度?
												"POI_DP_BUSYNESS", // 75 兴趣点DP繁忙程度?
												"SMART_INTERFACE_SELECTION", // 76 智能界面选区?
												"VECTOR_ASSETS", // 77
												"VECTOR_SPR_POLAR", // 79 | INTERNATIONAL_3D_STYLES
												"SMART_DATA_MODE", // 80 智能数据模式?
												"CELLULAR_PERFORMANCE_SCORE", // 81
												"VECTOR_LIVE_DATA_UPDATES", // 85 实时数据更新?
												"VECTOR_ROAD_SELECTION", // 87 道路选区?
												"VECTOR_REGION_METADATA", // 88 区域元数据?
												"RAY_TRACING", // 89 光线追踪?
												"RASTER_SATELLITE_POLAR", // 91 卫星地图（2D/极地）
												"VMAP4_ELEVATION", // 92 VMAP4 高程?
												"VMAP4_ELEVATION_POLAR", // 93 VMAP4 高程（极地）?
												"CELLULAR_COVERAGE_PLMN", // 94 蜂窝覆盖 PLMN?
												"RASTER_SATELLITE_POLAR_NIGHT", // 95 卫星地图（2D/极地/夜间）
												"BLUEPOI_MODEL", // 96
												"BLUEPOI_AOI", // 97
												"FLYOVER_V2_R3D", // 98 | INTERNATIONAL_3D_STYLES
												"FLYOVER_V2_DSM", // 99
												"FLYOVER_V2_METADATA", // 100
												"VECTOR_DCT", // 101
												"SECA", // 102
												"UNUSED_103", // 103
												"UNUSED_104", // 104
												"UNUSED_105", // 105
												"UNUSED_106", // 106
												"UNUSED_107", // 107
												"UNUSED_108", // 108
												"UNUSED_109", // 109
												"UNUSED_110", // 110
												"UNUSED_111", // 111
												"UNUSED_112", // 112
												"UNUSED_113", // 113
												"UNUSED_114", // 114
												"UNUSED_115", // 115
												"UNUSED_116", // 116
												"UNUSED_117", // 117
												"UNUSED_118", // 118
												"UNUSED_119", // 119
												"UNUSED_120", // 120
											];
											break;
										}
										default: {
											const cnURL = new URL(url.toString());
											cnURL.searchParams.set("country_code", "CN");
											source = await GEOResourceManifest.decodeCache(Caches, cnURL.search, KV);
											const isReady = Boolean(source);
											if (!isReady) {
												Console.warn("Missing cache: CN");
											}
											if (!isReady) break geoManifestPath;
											tileStyles = [
												"VECTOR_STANDARD", // 1 标准地图 | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
												"VECTOR_TRAFFIC_SEGMENTS_FOR_RASTER", // 2 交通状况分段（卫星地图:显示交通状况）? | MAINLAND_EXTENDED_STYLES
												"VECTOR_TRAFFIC_INCIDENTS_FOR_RASTER", // 3 交通状况事件（卫星地图:显示交通状况）? | MAINLAND_EXTENDED_STYLES
												"VECTOR_TRAFFIC_SEGMENTS_AND_INCIDENTS_FOR_RASTER", // 4 交通状况分段和事件（卫星地图:显示交通状况）? | MAINLAND_EXTENDED_STYLES
												"RASTER_STANDARD_BACKGROUND", // 5 | MAINLAND_EXTENDED_STYLES
												"RASTER_HYBRID", // 6 | MAINLAND_EXTENDED_STYLES
												"RASTER_SATELLITE", // 7 卫星地图（2D） | MAINLAND_EXTENDED_STYLES
												"RASTER_TERRAIN", // 8 地貌与地势（绿地/城市/水体/山地不同颜色的区域） | MAINLAND_EXTENDED_STYLES
												"VECTOR_BUILDINGS", // 11 建筑模型（3D/白模） | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
												"VECTOR_TRAFFIC", // 12 交通状况 | MAINLAND_EXTENDED_STYLES
												"VECTOR_POI", // 13 兴趣点 | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
												"SPUTNIK_METADATA", // 14 卫星地图（3D/俯瞰）元数据 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"SPUTNIK_C3M", // 15 卫星地图（3D/俯瞰）C3模型 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"SPUTNIK_DSM", // 16 卫星地图（3D/俯瞰）数字表面模型 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"SPUTNIK_DSM_GLOBAL", // 17 卫星地图（3D/俯瞰）全球数字表面模型 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"VECTOR_REALISTIC", // 18 逼真地图? | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
												"VECTOR_ROADS", // 20 道路（卫星地图:显示标签） | MAINLAND_EXTENDED_STYLES
												"RASTER_VEGETATION", // 21 | MAINLAND_EXTENDED_STYLES
												"VECTOR_TRAFFIC_SKELETON", // 22 交通状况骨架（卫星地图:显示交通状况） | MAINLAND_EXTENDED_STYLES
												"RASTER_COASTLINE_MASK", // 23 | MAINLAND_EXTENDED_STYLES
												"RASTER_HILLSHADE", // 24 | MAINLAND_EXTENDED_STYLES
												"VECTOR_TRAFFIC_WITH_GREEN", // 25 交通状况（卫星地图:显示绿灯）? | MAINLAND_EXTENDED_STYLES
												"VECTOR_TRAFFIC_STATIC", // 26 交通状况静态? | MAINLAND_EXTENDED_STYLES
												"RASTER_COASTLINE_DROP_MASK", // 27 | MAINLAND_EXTENDED_STYLES
												"VECTOR_TRAFFIC_SKELETON_WITH_HISTORICAL", // 28 交通状况骨架（卫星地图:显示历史交通状况）? | MAINLAND_EXTENDED_STYLES
												"VECTOR_SPEED_PROFILES", // 29 | MAINLAND_EXTENDED_STYLES
												"VECTOR_VENUES", // 30 室内地图 | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
												"RASTER_DOWN_SAMPLED", // 31 | MAINLAND_EXTENDED_STYLES
												"RASTER_COLOR_BALANCED", // 32 | MAINLAND_EXTENDED_STYLES
												"RASTER_SATELLITE_NIGHT", // 33 卫星地图（2D/夜间） | MAINLAND_EXTENDED_STYLES
												"RASTER_SATELLITE_DIGITIZE", // 35 卫星地图（2D/数字化） | MAINLAND_EXTENDED_STYLES
												"RASTER_HILLSHADE_PARKS", // 36 | MAINLAND_EXTENDED_STYLES
                                                "VECTOR_TRANSIT", // 37 公共交通
												"RASTER_STANDARD_BASE", // 38 | MAINLAND_EXTENDED_STYLES
												"RASTER_STANDARD_LABELS", // 39 | MAINLAND_EXTENDED_STYLES
												"RASTER_HYBRID_ROADS", // 40 | MAINLAND_EXTENDED_STYLES
												"RASTER_HYBRID_LABELS", // 41 | MAINLAND_EXTENDED_STYLES
												"FLYOVER_C3M_MESH", // 42 俯瞰C3模型（四处看看）? | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"FLYOVER_C3M_JPEG_TEXTURE", // 43 俯瞰C3模型纹理（四处看看）? | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"FLYOVER_C3M_ASTC_TEXTURE", // 44 俯瞰C3模型纹理（四处看看）? | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"RASTER_SATELLITE_ASTC", // 45 卫星地图（2D/ASTC） | MAINLAND_EXTENDED_STYLES
												"RASTER_HYBRID_ROADS_AND_LABELS", // 46 | MAINLAND_EXTENDED_STYLES
                                                "VECTOR_TRANSIT_SELECTION", // 47 公共交通选区?
												"VECTOR_COVERAGE", // 48 覆盖范围?
												"FLYOVER_VISIBILITY", // 49 俯瞰可见性（四处看看）? | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"FLYOVER_SKYBOX", // 50 俯瞰天空盒（四处看看）? | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"FLYOVER_NAVGRAPH", // 51 俯瞰导航图（四处看看）? | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"FLYOVER_METADATA", // 52 俯瞰元数据 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
                                                "VECTOR_ROAD_NETWORK", // 53 道路网络
												"VECTOR_LAND_COVER", // 54 土地覆盖? | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
                                                "VECTOR_DEBUG", // 55
												"VECTOR_STREET_POI", // 56 街道兴趣点 | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
												"VECTOR_SPR_MERCATOR", // 58 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"VECTOR_SPR_MODELS", // 59 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"VECTOR_SPR_MATERIALS", // 60 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"VECTOR_SPR_METADATA", // 61 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"VECTOR_STREET_LANDMARKS", // 64 街道地标? | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
												"VECTOR_POI_V2", // 68 兴趣点V2 | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
												"VECTOR_POLYGON_SELECTION", // 69 多边形选区（兴趣点） | MAINLAND_EXTENDED_STYLES
												"VECTOR_BUILDINGS_V2", // 73 建筑模型V2（3D/上色） | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
												"SPR_ASSET_METADATA", // 78? (排除) | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"VECTOR_SPR_MODELS_OCCLUSION", // 82? (排除) | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
												"VECTOR_TOPOGRAPHIC", // 83 地形图? | MAINLAND_EXTENDED_STYLES
												"VECTOR_POI_V2_UPDATE", // 84 兴趣点V2更新 | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
												"VECTOR_TRAFFIC_V2", // 86 交通状况V2 | MAINLAND_EXTENDED_STYLES
												"VECTOR_CONTOURS", // 90 等高线? | MAINLAND_EXTENDED_STYLES
											];
											break;
										}
									}
									body.tileSet = GEOResourceManifest.tileSets(source.tileSet, body.tileSet, tileStyles);
									body.attribution = GEOResourceManifest.attributions(source.attribution, body.attribution, CountryCode);
									body.resource = GEOResourceManifest.resources(source.resource, body.resource, CountryCode);
									body.dataSet = GEOResourceManifest.dataSets(source.dataSet, body.dataSet, CountryCode);
									body.urlInfoSet = GEOResourceManifest.urlInfoSets(source.urlInfoSet, body.urlInfoSet, Settings, CountryCode);
									body.muninBucket = GEOResourceManifest.muninBuckets(source.muninBucket, body.muninBucket, Settings);
									body.displayString = GEOResourceManifest.displayStrings(source.displayString, body.displayString, CountryCode);
									body.tileGroup = GEOResourceManifest.tileGroups(body.tileGroup, body.tileSet, body.attribution, body.resource);
									// releaseInfo
									//body.releaseInfo = body.releaseInfo.replace(/(\d+\.\d+)/, `$1.${String(Date.now()/1000)}`);
									Console.debug(`releaseInfo: ${body.releaseInfo}`);
									//Console.debug(`body after: ${JSON.stringify(body)}`);
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
