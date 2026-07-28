import { Console, fetch, Storage } from "@nsnanocat/util";
import GEOResourceManifestDownload from "./GEOResourceManifestDownload.mjs";
export default class GEOResourceManifest {
	/**
	 * 下载资源清单二进制。
	 * Download resource manifest binary.
	 * @param {object} request 请求对象 / Request object.
	 * @param {string} countryCode 国家代码 / Country code.
	 * @returns {Promise<{status: number, eTag: string|undefined, body: Uint8Array}>} 下载结果 / Download result.
	 */
	static async download(request = $request, countryCode = "CN") {
		Console.log("☑️ Download");
		const newRequest = { ...request };
		newRequest.url = new URL(newRequest.url);
		newRequest.url.searchParams.set("country_code", countryCode === "XX" ? "US" : countryCode);
		newRequest.url = newRequest.url.toString();
		newRequest["binary-mode"] = true;
		const response = await fetch(newRequest);
		const rawBody = response.bodyBytes ? new Uint8Array(response.bodyBytes) : (response.body ?? new Uint8Array());
		Console.log("✅ Download");
		return { status: response.status ?? response.statusCode ?? 0, eTag: response.headers?.Etag ?? response.headers?.etag, body: rawBody };
	}

	/**
	 * 读取资源清单缓存。
	 * Read resource manifest cache.
	 * @param {object} caches 缓存对象 / Cache object.
	 * @param {string} queryString 查询字符串（包含前导问号） / Query string with leading question mark.
	 * @param {object} KV Shared KV storage instance.
	 * @returns {Promise<{eTag?: string, base64?: string}|undefined>} 缓存条目 / Cache entry.
	 */
	static async getCache(caches = {}, queryString = "", KV) {
		Console.log("☑️ Get Cache");
		if (!queryString) {
			Console.error("Get Cache", "Missing query string");
			return undefined;
		}
		let cache = {};
		if (KV) cache = await KV.getItem(`@iRingo.Maps.Caches.${queryString}`);
		else cache = Storage.getItem(`@iRingo.Maps.Caches.${queryString}`);
		switch (typeof cache?.base64) {
			case "string":
				Console.log("✅ Get Cache");
				return cache;
			case "undefined":
				Console.warn("Get Cache", `Cache not found: ${queryString}`);
				return undefined;
		}
	}

	/**
	 * 写入资源清单缓存。
	 * Write resource manifest cache.
	 * @param {object} caches 缓存对象 / Cache object.
	 * @param {string} queryString 查询字符串（包含前导问号） / Query string with leading question mark.
	 * @param {string} eTag 实体标签 / Entity tag.
	 * @param {Uint8Array|ArrayBuffer} rawBody 原始二进制 / Raw binary body.
	 * @param {object} KV Shared KV storage instance.
	 * @returns {Promise<boolean>} 是否写入成功 / Whether cache is written.
	 */
	static async setCache(caches = {}, queryString = "", eTag = "", rawBody = new Uint8Array(), KV) {
		Console.log("☑️ Set Cache");
		if (!queryString) {
			Console.error("Set Cache", "Missing query string");
			return false;
		}
		if (!eTag) {
			Console.error("Set Cache", `Missing eTag: ${queryString}`);
			return false;
		}
		rawBody = rawBody instanceof Uint8Array ? rawBody : new Uint8Array(rawBody ?? []);
		if (!rawBody.length) {
			Console.error("Set Cache", `Empty body: ${queryString}`);
			return false;
		}
		let base64 = "";
		try {
			switch (true) {
				case typeof globalThis.Buffer !== "undefined":
					base64 = globalThis.Buffer.from(rawBody.buffer, rawBody.byteOffset, rawBody.byteLength).toString("base64");
					break;
				case typeof globalThis.btoa === "function": {
					const chunks = [];
					for (let index = 0; index < rawBody.length; index += 0x2000) {
						const chunk = rawBody.subarray(index, index + 0x2000);
						let binary = "";
						for (const byte of chunk) binary += String.fromCharCode(byte);
						chunks.push(binary);
					}
					base64 = globalThis.btoa(chunks.join(""));
					break;
				}
				default:
					throw new Error("Unsupported base64 encoder");
			}
			if (!base64) throw new Error(`Empty base64: ${queryString}`);
		} catch (error) {
			Console.error(error);
			Console.error("Set Cache", `Encode failed: ${queryString}`);
			return false;
		}
		let result;
		if (KV) result = await KV.setItem(`@iRingo.Maps.Caches.${queryString}`, { eTag, base64 });
		else {
			result = Storage.setItem(`@iRingo.Maps.Caches`, {});
			result = Storage.setItem(`@iRingo.Maps.Caches.${queryString}`, { eTag, base64 });
		}
		Console.log("✅ Set Cache");
		return result;
	}

	/**
	 * 解码资源清单缓存。
	 * Decode resource manifest cache.
	 * @param {object} caches 缓存对象 / Cache object.
	 * @param {string} queryString 查询字符串（包含前导问号） / Query string with leading question mark.
	 * @param {object} KV Shared KV storage instance.
	 * @returns {Promise<object|undefined>} 解码结果 / Decoded manifest.
	 */
	static async decodeCache(caches = {}, queryString = "", KV) {
		Console.log("☑️ Decode Cache");
		const cache = await GEOResourceManifest.getCache(caches, queryString, KV);
		if (!cache?.base64) {
			Console.error("Decode Cache", `Missing cache: ${queryString}`);
			return undefined;
		}
		try {
			let rawBody;
			switch (true) {
				case typeof globalThis.Buffer !== "undefined":
					rawBody = new Uint8Array(globalThis.Buffer.from(cache.base64, "base64"));
					break;
				case typeof globalThis.atob === "function": {
					const binary = globalThis.atob(cache.base64);
					rawBody = new Uint8Array(binary.length);
					for (let index = 0; index < binary.length; index++) rawBody[index] = binary.charCodeAt(index);
					break;
				}
				default:
					throw new Error("Unsupported base64 decoder");
			}
			if (!rawBody?.length) {
				Console.error("Decode Cache", `Empty body: ${queryString}`);
				return undefined;
			}
			const body = GEOResourceManifestDownload.decode(rawBody);
			Console.log("✅ Decode Cache");
			return body;
		} catch (error) {
			Console.error(error);
			Console.error("Decode Cache", `Decode failed: ${queryString}`);
			return undefined;
		}
	}

	/**
	 * 使用源图块集合中的指定样式组新增或替换目标图块集合中的同名组。
	 * Add or replace matching target style groups with selected style groups from the source tile set.
	 * @param {Array<object>} source 源图块集合 / Source tile set.
	 * @param {Array<object>} target 目标图块集合 / Target tile set.
	 * @param {Array<string>} tileStyles 要选入的图块样式名称 / Tile style names to select.
	 * @returns {Array<object>} 更新后的目标图块集合 / Updated target tile set.
	 */
	static tileSets(source = [], target = [], tileStyles = []) {
		source = Array.isArray(source) ? source : [];
		target = Array.isArray(target) ? target : [];
		tileStyles = Array.isArray(tileStyles) ? tileStyles : [];
		for (let index = tileStyles.length - 1; index >= 0; index--) {
			if (typeof tileStyles[index] !== "string" || tileStyles.indexOf(tileStyles[index]) !== index) tileStyles.splice(index, 1);
		}
		const sourceTileStyles = [];
		const targetTileStyles = [];
		for (const tile of source) {
			if (typeof tile?.style === "string" && !sourceTileStyles.includes(tile.style)) sourceTileStyles.push(tile.style);
		}
		for (const tile of target) {
			if (typeof tile?.style === "string" && !targetTileStyles.includes(tile.style)) targetTileStyles.push(tile.style);
		}
		const sourceExclusiveTileStyles = sourceTileStyles.filter(tileStyle => !targetTileStyles.includes(tileStyle));
		const targetExclusiveTileStyles = targetTileStyles.filter(tileStyle => !sourceTileStyles.includes(tileStyle));
		Console.info(`图块集合 source 拥有的 tileStyles: ${JSON.stringify(sourceTileStyles)}`);
		Console.info(`图块集合 target 拥有的 tileStyles: ${JSON.stringify(targetTileStyles)}`);
		Console.info(`图块集合 source 独占的 tileStyles: ${JSON.stringify(sourceExclusiveTileStyles)}`);
		Console.info(`图块集合 target 独占的 tileStyles: ${JSON.stringify(targetExclusiveTileStyles)}`);
		const modifiedTileStyles = [];
		const unmodifiedTileStyles = [];
		for (const tileStyle of tileStyles) {
			if (source === target || !source.some(tile => tile?.style === tileStyle)) {
				unmodifiedTileStyles.push(tileStyle);
				continue;
			}
			let targetIndex = target.findIndex(tile => tile?.style === tileStyle);
			if (targetIndex < 0) targetIndex = target.length;
			for (let index = target.length - 1; index >= 0; index--) {
				if (target[index]?.style === tileStyle) target.splice(index, 1);
			}
			for (let index = source.length - 1; index >= 0; index--) {
				if (source[index]?.style === tileStyle) target.splice(targetIndex, 0, source[index]);
			}
			modifiedTileStyles.push(tileStyle);
		}
		const returnedTargetTileStyles = [];
		for (const tile of target) {
			if (typeof tile?.style === "string" && !returnedTargetTileStyles.includes(tile.style)) returnedTargetTileStyles.push(tile.style);
		}
		Console.info(`图块集合最终返回的 target tileStyles: ${JSON.stringify(returnedTargetTileStyles)}`);
		Console.info(`图块集合已修改的 tileStyles: ${JSON.stringify(modifiedTileStyles)}`);
		Console.info(`图块集合未修改的 tileStyles: ${JSON.stringify(unmodifiedTileStyles)}`);
		return target;
	}

	static attributions(attributions = [], caches = {}, countryCode = "CN") {
		Console.log("☑️ Set Attributions");
		switch (countryCode) {
			case "CN":
				caches?.XX?.attribution?.forEach(attribution => {
					if (!attributions.some(i => i.name === attribution.name)) attributions.unshift(attribution);
				});
				break;
			case "KR":
				caches?.KR?.attribution?.forEach(attribution => {
					if (!attributions.some(i => i.name === attribution.name)) attributions.unshift(attribution);
				});
				break;
			default:
				caches?.CN?.attribution?.forEach(attribution => {
					if (!attributions.some(i => i.name === attribution.name)) attributions.push(attribution);
				});
				break;
		}
		attributions.sort((a, b) => {
			switch (a.name) {
				case "‎":
					return -1;
				case "AutoNavi":
					return 0;
				default:
					return 1;
			}
		});
		attributions = attributions
			.map((attribution, index) => {
				switch (attribution.name) {
					case "‎":
						attribution.name = ` iRingo: 📍 GEOResourceManifest\n${new Date()}`;
						delete attribution.plainTextURLSHA256Checksum;
						break;
					case "AutoNavi":
						attribution.resource = attribution.resource?.filter(i => i.resourceType !== 6);
						attribution.region = [
							{ minX: 214, minY: 82, maxX: 216, maxY: 82, minZ: 8, maxZ: 21 },
							{ minX: 213, minY: 83, maxX: 217, maxY: 83, minZ: 8, maxZ: 21 },
							{ minX: 213, minY: 84, maxX: 218, maxY: 84, minZ: 8, maxZ: 21 },
							{ minX: 213, minY: 85, maxX: 218, maxY: 85, minZ: 8, maxZ: 21 },
							{ minX: 212, minY: 86, maxX: 218, maxY: 86, minZ: 8, maxZ: 21 },
							{ minX: 189, minY: 87, maxX: 190, maxY: 87, minZ: 8, maxZ: 21 },
							{ minX: 210, minY: 87, maxX: 220, maxY: 87, minZ: 8, maxZ: 21 },
							{ minX: 188, minY: 88, maxX: 191, maxY: 88, minZ: 8, maxZ: 21 },
							{ minX: 210, minY: 88, maxX: 223, maxY: 88, minZ: 8, maxZ: 21 },
							{ minX: 188, minY: 89, maxX: 192, maxY: 89, minZ: 8, maxZ: 21 },
							{ minX: 210, minY: 89, maxX: 223, maxY: 89, minZ: 8, maxZ: 21 },
							{ minX: 186, minY: 90, maxX: 192, maxY: 90, minZ: 8, maxZ: 21 },
							{ minX: 210, minY: 90, maxX: 223, maxY: 90, minZ: 8, maxZ: 21 },
							{ minX: 209, minY: 91, maxX: 222, maxY: 91, minZ: 8, maxZ: 21 },
							{ minX: 186, minY: 91, maxX: 192, maxY: 91, minZ: 8, maxZ: 21 },
							{ minX: 184, minY: 92, maxX: 195, maxY: 92, minZ: 8, maxZ: 21 },
							{ minX: 207, minY: 92, maxX: 221, maxY: 92, minZ: 8, maxZ: 21 },
							{ minX: 185, minY: 93, maxX: 196, maxY: 93, minZ: 8, maxZ: 21 },
							{ minX: 206, minY: 93, maxX: 221, maxY: 93, minZ: 8, maxZ: 21 },
							{ minX: 185, minY: 94, maxX: 200, maxY: 94, minZ: 8, maxZ: 21 },
							{ minX: 203, minY: 94, maxX: 221, maxY: 94, minZ: 8, maxZ: 21 },
							{ minX: 182, minY: 94, maxX: 219, maxY: 95, minZ: 8, maxZ: 21 },
							{ minX: 180, minY: 96, maxX: 217, maxY: 96, minZ: 8, maxZ: 21 },
							{ minX: 180, minY: 97, maxX: 216, maxY: 97, minZ: 8, maxZ: 21 },
							{ minX: 180, minY: 98, maxX: 214, maxY: 98, minZ: 8, maxZ: 21 },
							{ minX: 180, minY: 99, maxX: 215, maxY: 99, minZ: 8, maxZ: 21 },
							{ minX: 182, minY: 100, maxX: 214, maxY: 100, minZ: 8, maxZ: 21 },
							{ minX: 183, minY: 101, maxX: 213, maxY: 101, minZ: 8, maxZ: 21 },
							{ minX: 184, minY: 102, maxX: 214, maxY: 102, minZ: 8, maxZ: 21 },
							{ minX: 183, minY: 103, maxX: 214, maxY: 103, minZ: 8, maxZ: 21 },
							{ minX: 184, minY: 104, maxX: 215, maxY: 104, minZ: 8, maxZ: 21 },
							{ minX: 185, minY: 105, maxX: 215, maxY: 105, minZ: 8, maxZ: 21 },
							{ minX: 187, minY: 106, maxX: 215, maxY: 106, minZ: 8, maxZ: 21 },
							{ minX: 189, minY: 107, maxX: 193, maxY: 107, minZ: 8, maxZ: 21 },
							{ minX: 197, minY: 107, maxX: 214, maxY: 107, minZ: 8, maxZ: 21 },
							{ minX: 198, minY: 108, maxX: 214, maxY: 108, minZ: 8, maxZ: 21 },
							{ minX: 110, minY: 109, maxX: 214, maxY: 109, minZ: 8, maxZ: 21 },
							{ minX: 197, minY: 110, maxX: 214, maxY: 110, minZ: 8, maxZ: 21 },
							{ minX: 198, minY: 111, maxX: 214, maxY: 111, minZ: 8, maxZ: 21 },
							{ minX: 204, minY: 112, maxX: 209, maxY: 112, minZ: 8, maxZ: 21 },
							{ minX: 213, minY: 112, maxX: 214, maxY: 112, minZ: 8, maxZ: 21 },
							{ minX: 205, minY: 113, maxX: 207, maxY: 113, minZ: 8, maxZ: 21 },
							{ minX: 205, minY: 114, maxX: 206, maxY: 114, minZ: 8, maxZ: 21 },
							{ minX: 204, minY: 115, maxX: 212, maxY: 128, minZ: 8, maxZ: 21 },
						];
						break;
				}
				return attribution;
			})
			.flat(Number.POSITIVE_INFINITY)
			.filter(Boolean);
		Console.log("✅ Set Attributions");
		return attributions;
	}

	static resources(resources = [], caches = {}, countryCode = "CN") {
		Console.log("☑️ Set Resources");
		switch (countryCode) {
			case "CN":
				break;
			case "KR":
			default:
				caches.CN.resource?.forEach((resource, index) => {
					if (resource.filename === "POITypeMapping-CN-1.json") resources.push(resource);
					if (resource.filename === "POITypeMapping-CN-2.json") resources.push(resource);
					if (resource.filename === "China.cms-lpr") resources.push(resource);
				});
				break;
		}
		Console.log("✅ Set Resources");
		return resources;
	}

	static dataSets(dataSets = [], caches = {}, countryCode = "CN") {
		Console.log("☑️ Set DataSets");
		switch (countryCode) {
			case "CN":
				dataSets = caches?.XX?.dataSet;
				break;
			case "KR":
			default:
				break;
		}
		//dataSets.push({ "dataSetDescription": "AutoNavi", "identifier": 10 });
		Console.log("✅ Set DataSets");
		return dataSets;
	}

	static urlInfoSets(urlInfoSets = [], caches = {}, settings = {}, countryCode = "CN") {
		Console.log("☑️ Set UrlInfoSets");
		urlInfoSets = urlInfoSets.map((urlInfoSet, index) => {
			switch (countryCode) {
				case "CN":
					urlInfoSet = { ...caches.XX.urlInfoSet[0], ...caches.CN.urlInfoSet[0] };
					break;
				case "KR":
					urlInfoSet = { ...caches.KR.urlInfoSet[0], ...caches.CN.urlInfoSet[0] };
					break;
				default:
					urlInfoSet = { ...caches.CN.urlInfoSet[0], ...caches.XX.urlInfoSet[0] };
					urlInfoSet.alternateResourcesURL = caches.CN.urlInfoSet[0].alternateResourcesURL;
					delete urlInfoSet.polyLocationShiftURL;
					break;
			}
			switch (settings.Config?.Announcements?.Environment ?? settings.Config?.Announcements?.["Environment:"]?.default ?? settings.Config?.Announcements?.["Environment:"]) {
				case "AUTO":
				default:
					break;
				case "CN":
					// Announcements
					urlInfoSet.announcementsURL = caches.CN.urlInfoSet[0].announcementsURL;
					break;
				case "XX":
					// Announcements
					urlInfoSet.announcementsURL = caches.XX.urlInfoSet[0].announcementsURL;
					break;
			}
			switch (settings.UrlInfoSet.Dispatcher) {
				case "AUTO":
				default:
					break;
				case "AutoNavi":
					// PlaceData Dispatcher
					urlInfoSet.directionsURL = caches.CN.urlInfoSet[0].dispatcherURL;
					// Background Dispatcher
					urlInfoSet.backgroundDispatcherURL = caches.CN.urlInfoSet[0].backgroundDispatcherURL;
					// Background Reverse Geocoder
					urlInfoSet.backgroundRevGeoURL = caches.CN.urlInfoSet[0].backgroundRevGeoURL;
					// Batch Reverse Geocoder
					urlInfoSet.batchReverseGeocoderPlaceRequestURL = caches.CN.urlInfoSet[0].batchReverseGeocoderPlaceRequestURL;
					break;
				case "Apple":
					// PlaceData Dispatcher
					urlInfoSet.dispatcherURL = caches.XX.urlInfoSet[0].dispatcherURL;
					// Background Dispatcher
					urlInfoSet.backgroundDispatcherURL = caches.XX.urlInfoSet[0].backgroundDispatcherURL;
					// Background Reverse Geocoder
					urlInfoSet.backgroundRevGeoURL = caches.XX.urlInfoSet[0].backgroundRevGeoURL;
					// Batch Reverse Geocoder
					urlInfoSet.batchReverseGeocoderPlaceRequestURL = caches.XX.urlInfoSet[0].batchReverseGeocoderPlaceRequestURL;
					break;
			}
			switch (settings.UrlInfoSet.Directions) {
				case "AUTO":
				default:
					break;
				case "AutoNavi":
					// Directions
					urlInfoSet.directionsURL = caches.CN.urlInfoSet[0].directionsURL;
					// ETA
					urlInfoSet.etaURL = caches.CN.urlInfoSet[0].etaURL;
					// Simple ETA
					urlInfoSet.simpleETAURL = caches.CN.urlInfoSet[0].simpleETAURL;
					break;
				case "Apple":
					// Directions
					urlInfoSet.directionsURL = caches.XX.urlInfoSet[0].directionsURL;
					// ETA
					urlInfoSet.etaURL = caches.XX.urlInfoSet[0].etaURL;
					// Simple ETA
					urlInfoSet.simpleETAURL = caches.XX.urlInfoSet[0].simpleETAURL;
					break;
			}
			switch (settings.UrlInfoSet.RAP) {
				case "AUTO":
				default:
					// RAP Submission
					urlInfoSet.problemSubmissionURL = caches.XX.urlInfoSet[0].problemSubmissionURL;
					// RAP Status
					urlInfoSet.problemStatusURL = caches.XX.urlInfoSet[0].problemStatusURL;
					// RAP Opt-Ins
					urlInfoSet.problemOptInURL = caches.XX.urlInfoSet[0].problemOptInURL;
					// RAP V4 Submission
					urlInfoSet.feedbackSubmissionURL = caches.XX.urlInfoSet[0].feedbackSubmissionURL;
					// RAP V4 Lookup
					urlInfoSet.feedbackLookupURL = caches.XX.urlInfoSet[0].feedbackLookupURL;
					break;
				case "AutoNavi":
					// RAP Submission
					urlInfoSet.problemSubmissionURL = caches.CN.urlInfoSet[0].problemSubmissionURL;
					// RAP Status
					urlInfoSet.problemStatusURL = caches.CN.urlInfoSet[0].problemStatusURL;
					// RAP V4 Submission
					urlInfoSet.feedbackSubmissionURL = caches.CN.urlInfoSet[0].feedbackSubmissionURL;
					// RAP V4 Lookup
					urlInfoSet.feedbackLookupURL = caches.CN.urlInfoSet[0].feedbackLookupURL;
					break;
				case "Apple":
					// RAP Submission
					urlInfoSet.problemSubmissionURL = caches.XX.urlInfoSet[0].problemSubmissionURL;
					// RAP Status
					urlInfoSet.problemStatusURL = caches.XX.urlInfoSet[0].problemStatusURL;
					// RAP Opt-Ins
					urlInfoSet.problemOptInURL = caches.XX.urlInfoSet[0].problemOptInURL;
					// RAP V4 Submission
					urlInfoSet.feedbackSubmissionURL = caches.XX.urlInfoSet[0].feedbackSubmissionURL;
					// RAP V4 Lookup
					urlInfoSet.feedbackLookupURL = caches.XX.urlInfoSet[0].feedbackLookupURL;
					break;
			}
			switch (settings.UrlInfoSet.LocationShift) {
				case "AUTO":
				default:
					break;
				case "AutoNavi":
					// Location Shift (polynomial)
					urlInfoSet.polyLocationShiftURL = caches.CN.urlInfoSet[0].polyLocationShiftURL;
					break;
				case "Apple":
					// Location Shift (polynomial)
					urlInfoSet.polyLocationShiftURL = caches.XX.urlInfoSet[0].polyLocationShiftURL;
					break;
			}
			return urlInfoSet;
		});
		Console.log("✅ Set UrlInfoSets");
		return urlInfoSets;
	}

	static muninBuckets(muninBuckets = [], caches = {}, settings = {}) {
		Console.log("☑️ Set MuninBuckets");
		switch (settings.TileSet.Munin) {
			case "CN":
				muninBuckets = caches.CN.muninBucket;
				break;
			case "HYBRID":
			case "XX":
			default:
				muninBuckets = caches.XX.muninBucket;
				break;
		}
		Console.log("✅ Set MuninBuckets");
		return muninBuckets;
	}

	static displayStrings(displayStrings = [], caches = {}, countryCode = "CN") {
		Console.log("☑️ Set DisplayStrings");
		switch (countryCode) {
			case "CN":
				displayStrings = caches.XX.displayString?.map((displayString, index) => {
					return displayString;
				});
				break;
			case "KR":
				//displayStrings = caches.KR.displayString;
				break;
			default:
				//displayStrings = caches.XX.displayString;
				break;
		}
		Console.log("✅ Set DisplayStrings");
		return displayStrings;
	}

	static tileGroups(tileGroups = [], tileSets = [], attributions = [], resources = []) {
		Console.log("☑️ Set TileGroups");
		tileGroups = tileGroups.map(tileGroup => {
			Console.debug(`tileGroup.identifier: ${tileGroup.identifier}`);
			tileGroup.identifier += Math.floor(Math.random() * 100) + 1;
			Console.debug(`tileGroup.identifier: ${tileGroup.identifier}`);
			tileGroup.tileSet = tileSets.map((tileSet, index) => {
				return {
					tileSetIndex: index,
					identifier: tileSet.validVersion?.[0]?.identifier,
				};
			});
			if (attributions)
				tileGroup.attributionIndex = attributions.map((attribution, index) => {
					return index;
				});
			if (resources)
				tileGroup.resourceIndex = resources.map((resource, index) => {
					return index;
				});
			return tileGroup;
		});
		Console.log("✅ Set TileGroups");
		return tileGroups;
	}
}
