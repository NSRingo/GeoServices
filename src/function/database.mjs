export default {
	Location: {
		Settings: {
			PEP: {
				GCC: "US",
			},
		},
		Configs: {},
	},
	Maps: {
		Settings: {
			UrlInfoSet: {
				Dispatcher: "AutoNavi",
				Directions: "AutoNavi",
				RAP: "Apple",
				LocationShift: "AUTO",
			},
			TileSet: {
				Base: "XX",
				Earth: "XX",
				Flyover: "XX",
				Map: "CN",
				Munin: "XX",
				POI: "CN",
				Road: "CN",
				Satellite2D: "CN",
				Satellite3D: "XX",
				Traffic: "CN",
			},
			GeoManifest: {
				Dynamic: {
					Config: {
						CountryCode: "US",
					},
				},
			},
			Config: {
				Announcements: {
					"Environment:": "CN",
				},
			},
		},
		Configs: {
			TileStyles: {
				Base: [
					"RASTER_STANDARD", // 0
					"VECTOR_REALISTIC", // 18 逼真地图? | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
					"VECTOR_LEGACY_REALISTIC", // 19
					"VECTOR_COVERAGE", // 48 覆盖范围?
					"VECTOR_LAND_COVER", // 54 土地覆盖? | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
					"VECTOR_DEBUG", // 55
					"VECTOR_TRACKS", // 62 轨道?
					"VECTOR_RESERVED_2", // 63
					"COARSE_LOCATION_POLYGONS", // 65 粗略位置多边形?
					"VL_METADATA", // 70 VL 元数据?
					"VL_DATA", // 71 VL 数据?
					"PROACTIVE_APP_CLIP", // 72 主动式App剪辑?
					"SMART_INTERFACE_SELECTION", // 76 智能界面选区?
					"VECTOR_ASSETS", // 77
					"SMART_DATA_MODE", // 80 智能数据模式?
					"CELLULAR_PERFORMANCE_SCORE", // 81
					"VECTOR_TOPOGRAPHIC", // 83 地形图? | MAINLAND_EXTENDED_STYLES
					"VECTOR_LIVE_DATA_UPDATES", // 85 实时数据更新?
					"VECTOR_REGION_METADATA", // 88 区域元数据?
					"RAY_TRACING", // 89 光线追踪?
					"VECTOR_CONTOURS", // 90 等高线? | MAINLAND_EXTENDED_STYLES
					"VMAP4_ELEVATION", // 92 VMAP4 高程?
					"VMAP4_ELEVATION_POLAR", // 93 VMAP4 高程（极地）?
					"CELLULAR_COVERAGE_PLMN", // 94 蜂窝覆盖 PLMN?
					"BLUEPOI_MODEL", // 96
					"BLUEPOI_AOI", // 97
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
				],
				Map: [
					"VECTOR_STANDARD", // 1 标准地图 | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
					"RASTER_STANDARD_BACKGROUND", // 5 | MAINLAND_EXTENDED_STYLES
					"RASTER_HYBRID", // 6 | MAINLAND_EXTENDED_STYLES
					"RASTER_TERRAIN", // 8 地貌与地势（绿地/城市/水体/山地不同颜色的区域） | MAINLAND_EXTENDED_STYLES
					"VECTOR_BUILDINGS", // 11 建筑模型（3D/白模） | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
					"RASTER_VEGETATION", // 21 | MAINLAND_EXTENDED_STYLES
					"RASTER_COASTLINE_MASK", // 23 | MAINLAND_EXTENDED_STYLES
					"RASTER_HILLSHADE", // 24 | MAINLAND_EXTENDED_STYLES
					"RASTER_COASTLINE_DROP_MASK", // 27 | MAINLAND_EXTENDED_STYLES
					"VECTOR_VENUES", // 30 室内地图 | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
					"RASTER_DOWN_SAMPLED", // 31 | MAINLAND_EXTENDED_STYLES
					"RASTER_COLOR_BALANCED", // 32 | MAINLAND_EXTENDED_STYLES
					"RASTER_HILLSHADE_PARKS", // 36 | MAINLAND_EXTENDED_STYLES
					"VECTOR_TRANSIT", // 37 公共交通
					"RASTER_STANDARD_BASE", // 38 | MAINLAND_EXTENDED_STYLES
					"RASTER_STANDARD_LABELS", // 39 | MAINLAND_EXTENDED_STYLES
					"RASTER_HYBRID_LABELS", // 41 | MAINLAND_EXTENDED_STYLES
					"VECTOR_TRANSIT_SELECTION", // 47 公共交通选区?
					"VECTOR_STREET_LANDMARKS", // 64 街道地标? | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
					"VECTOR_BUILDINGS_V2", // 73 建筑模型V2（3D/上色） | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
				],
				Satellite2D: [
					"RASTER_SATELLITE", // 7 卫星地图（2D） / Satellite map (2D) | MAINLAND_EXTENDED_STYLES
					"RASTER_SATELLITE_NIGHT", // 33 卫星地图（2D/夜间） / Satellite map (2D/night) | MAINLAND_EXTENDED_STYLES
					"RASTER_SATELLITE_DIGITIZE", // 35 卫星地图（2D/数字化） / Satellite map (2D/digitized) | MAINLAND_EXTENDED_STYLES
					"RASTER_SATELLITE_ASTC", // 45 卫星地图（2D/ASTC） / Satellite map (2D/ASTC) | MAINLAND_EXTENDED_STYLES
					"RASTER_SATELLITE_POLAR", // 91 卫星地图（2D/极地） / Satellite map (2D/polar)
					"RASTER_SATELLITE_POLAR_NIGHT", // 95 卫星地图（2D/极地/夜间） / Satellite map (2D/polar/night)
				],
				Satellite3D: [
					"SPUTNIK_METADATA", // 14 卫星地图（3D/俯瞰）元数据 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"SPUTNIK_C3M", // 15 卫星地图（3D/俯瞰）C3模型 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"SPUTNIK_DSM", // 16 卫星地图（3D/俯瞰）数字表面模型 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"SPUTNIK_DSM_GLOBAL", // 17 卫星地图（3D/俯瞰）全球数字表面模型 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"SPUTNIK_VECTOR_BORDER", // 34 卫星地图（3D/俯瞰）边界（决定能否显示地球模型） | INTERNATIONAL_3D_STYLES
				],
				Traffic: [
					"VECTOR_TRAFFIC_SEGMENTS_FOR_RASTER", // 2 交通状况分段（卫星地图:显示交通状况）? | MAINLAND_EXTENDED_STYLES
					"VECTOR_TRAFFIC_INCIDENTS_FOR_RASTER", // 3 交通状况事件（卫星地图:显示交通状况）? | MAINLAND_EXTENDED_STYLES
					"VECTOR_TRAFFIC_SEGMENTS_AND_INCIDENTS_FOR_RASTER", // 4 交通状况分段和事件（卫星地图:显示交通状况）? | MAINLAND_EXTENDED_STYLES
					"VECTOR_TRAFFIC", // 12 交通状况 | MAINLAND_EXTENDED_STYLES
					"VECTOR_TRAFFIC_SKELETON", // 22 交通状况骨架（卫星地图:显示交通状况） | MAINLAND_EXTENDED_STYLES
					"VECTOR_TRAFFIC_WITH_GREEN", // 25 交通状况（卫星地图:显示绿灯）? | MAINLAND_EXTENDED_STYLES
					"VECTOR_TRAFFIC_STATIC", // 26 交通状况静态? | MAINLAND_EXTENDED_STYLES
					"VECTOR_TRAFFIC_SKELETON_WITH_HISTORICAL", // 28 交通状况骨架（卫星地图:显示历史交通状况）? | MAINLAND_EXTENDED_STYLES
					"VECTOR_SPEED_PROFILES", // 29 | MAINLAND_EXTENDED_STYLES
					"VECTOR_TRAFFIC_V2", // 86 交通状况V2 | MAINLAND_EXTENDED_STYLES
				],
				POI: [
					"VECTOR_POI", // 13 兴趣点 | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
					"VECTOR_STREET_POI", // 56 街道兴趣点 | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
					"VECTOR_POI_V2", // 68 兴趣点V2 | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
					"VECTOR_POLYGON_SELECTION", // 69 多边形选区（兴趣点） | MAINLAND_EXTENDED_STYLES
					"POI_BUSYNESS", // 74 兴趣点繁忙程度?
					"POI_DP_BUSYNESS", // 75 兴趣点DP繁忙程度?
					"VECTOR_POI_V2_UPDATE", // 84 兴趣点V2更新 | MAINLAND_CORE_STYLES, MAINLAND_EXTENDED_STYLES
				],
				Flyover: [
					"FLYOVER_C3M_MESH", // 42 俯瞰C3模型（四处看看）? / Flyover C3 mesh (Look Around)? | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"FLYOVER_C3M_JPEG_TEXTURE", // 43 俯瞰C3模型纹理（四处看看）? / Flyover C3 JPEG texture (Look Around)? | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"FLYOVER_C3M_ASTC_TEXTURE", // 44 俯瞰C3模型纹理（四处看看）? / Flyover C3 ASTC texture (Look Around)? | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"FLYOVER_VISIBILITY", // 49 俯瞰可见性（四处看看）? / Flyover visibility (Look Around)? | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"FLYOVER_SKYBOX", // 50 俯瞰天空盒（四处看看）? / Flyover skybox (Look Around)? | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"FLYOVER_NAVGRAPH", // 51 俯瞰导航图（四处看看）? / Flyover navigation graph (Look Around)? | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"FLYOVER_METADATA", // 52 俯瞰元数据 / Flyover metadata | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"FLYOVER_V2_R3D", // 98 | INTERNATIONAL_3D_STYLES
					"FLYOVER_V2_DSM", // 99
					"FLYOVER_V2_METADATA", // 100
				],
				Munin: [
					"MUNIN_METADATA", // 57 四处看看 元数据 / Look Around metadata | INTERNATIONAL_3D_STYLES
					"VECTOR_SPR_ROADS", // 66 (卫星图道路网格，四处看看按钮) / Satellite roads and Look Around availability
				],
				Road: [
					"VECTOR_ROADS", // 20 道路（卫星地图:显示标签） | MAINLAND_EXTENDED_STYLES
					"RASTER_HYBRID_ROADS", // 40 | MAINLAND_EXTENDED_STYLES
					"RASTER_HYBRID_ROADS_AND_LABELS", // 46 | MAINLAND_EXTENDED_STYLES
					"VECTOR_ROAD_NETWORK", // 53 道路网络
					"VECTOR_ROAD_SELECTION", // 87 道路选区?
				],
				Earth: [
					"VECTOR_SPR_MERCATOR", // 58 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"VECTOR_SPR_MODELS", // 59 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"VECTOR_SPR_MATERIALS", // 60 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"VECTOR_SPR_METADATA", // 61 | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"VECTOR_SPR_STANDARD", // 67 (影响 1-6 级视图下的行政区域名称与资料显示版本) / Administrative names and data versions at zoom levels 1-6
					"SPR_ASSET_METADATA", // 78? (排除) | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
					"VECTOR_SPR_POLAR", // 79 | INTERNATIONAL_3D_STYLES
					"VECTOR_SPR_MODELS_OCCLUSION", // 82? (排除) | INTERNATIONAL_3D_STYLES, MAINLAND_3D_STYLES
				],
			},
		},
	},
	Watch: {
		Settings: {
			UrlInfoSet: {
				LocationShift: "Apple",
			},
			GeoManifest: {
				Dynamic: {
					Config: {
						CountryCode: "US",
					},
				},
			},
			Config: {
				Announcements: {
					"Environment:": "CN",
				},
			},
		},
		Configs: {},
	},
	Default: {
		Settings: {
			LogLevel: "WARN",
		},
		Configs: {
			Storefront: {
				AE: "143481",
				AF: "143610",
				AG: "143540",
				AI: "143538",
				AL: "143575",
				AM: "143524",
				AO: "143564",
				AR: "143505",
				AT: "143445",
				AU: "143460",
				AZ: "143568",
				BA: "143612",
				BB: "143541",
				BD: "143490",
				BE: "143446",
				BF: "143578",
				BG: "143526",
				BH: "143559",
				BJ: "143576",
				BM: "143542",
				BN: "143560",
				BO: "143556",
				BR: "143503",
				BS: "143539",
				BT: "143577",
				BW: "143525",
				BY: "143565",
				BZ: "143555",
				CA: "143455",
				CD: "143613",
				CG: "143582",
				CH: "143459",
				CI: "143527",
				CL: "143483",
				CM: "143574",
				CN: "143465",
				CO: "143501",
				CR: "143495",
				CV: "143580",
				CY: "143557",
				CZ: "143489",
				DE: "143443",
				DK: "143458",
				DM: "143545",
				DO: "143508",
				DZ: "143563",
				EC: "143509",
				EE: "143518",
				EG: "143516",
				ES: "143454",
				FI: "143447",
				FJ: "143583",
				FM: "143591",
				FR: "143442",
				GA: "143614",
				GB: "143444",
				GD: "143546",
				GF: "143615",
				GH: "143573",
				GM: "143584",
				GR: "143448",
				GT: "143504",
				GW: "143585",
				GY: "143553",
				HK: "143463",
				HN: "143510",
				HR: "143494",
				HU: "143482",
				ID: "143476",
				IE: "143449",
				IL: "143491",
				IN: "143467",
				IQ: "143617",
				IS: "143558",
				IT: "143450",
				JM: "143511",
				JO: "143528",
				JP: "143462",
				KE: "143529",
				KG: "143586",
				KH: "143579",
				KN: "143548",
				KP: "143466",
				KR: "143466",
				KW: "143493",
				KY: "143544",
				KZ: "143517",
				TC: "143552",
				TD: "143581",
				TJ: "143603",
				TH: "143475",
				TM: "143604",
				TN: "143536",
				TO: "143608",
				TR: "143480",
				TT: "143551",
				TW: "143470",
				TZ: "143572",
				LA: "143587",
				LB: "143497",
				LC: "143549",
				LI: "143522",
				LK: "143486",
				LR: "143588",
				LT: "143520",
				LU: "143451",
				LV: "143519",
				LY: "143567",
				MA: "143620",
				MD: "143523",
				ME: "143619",
				MG: "143531",
				MK: "143530",
				ML: "143532",
				MM: "143570",
				MN: "143592",
				MO: "143515",
				MR: "143590",
				MS: "143547",
				MT: "143521",
				MU: "143533",
				MV: "143488",
				MW: "143589",
				MX: "143468",
				MY: "143473",
				MZ: "143593",
				NA: "143594",
				NE: "143534",
				NG: "143561",
				NI: "143512",
				NL: "143452",
				NO: "143457",
				NP: "143484",
				NR: "143606",
				NZ: "143461",
				OM: "143562",
				PA: "143485",
				PE: "143507",
				PG: "143597",
				PH: "143474",
				PK: "143477",
				PL: "143478",
				PT: "143453",
				PW: "143595",
				PY: "143513",
				QA: "143498",
				RO: "143487",
				RS: "143500",
				RU: "143469",
				RW: "143621",
				SA: "143479",
				SB: "143601",
				SC: "143599",
				SE: "143456",
				SG: "143464",
				SI: "143499",
				SK: "143496",
				SL: "143600",
				SN: "143535",
				SR: "143554",
				ST: "143598",
				SV: "143506",
				SZ: "143602",
				UA: "143492",
				UG: "143537",
				US: "143441",
				UY: "143514",
				UZ: "143566",
				VC: "143550",
				VE: "143502",
				VG: "143543",
				VN: "143471",
				VU: "143609",
				XK: "143624",
				YE: "143571",
				ZA: "143472",
				ZM: "143622",
				ZW: "143605",
			},
		},
	},
};
