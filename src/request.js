import { $app, Lodash as _, Storage, fetch, notification, log, logError, wait, done } from "@nsnanocat/util";
import database from "./function/database.mjs";
import setENV from "./function/setENV.mjs";
// 构造回复数据
let $response = undefined;
/***************** Processing *****************/
// 解构URL
const url = new URL($request.url);
log(`⚠ url: ${url.toJSON()}`, "");
// 获取连接参数
const METHOD = $request.method,
	HOST = url.hostname,
	PATH = url.pathname;
log(`⚠ METHOD: ${METHOD}, HOST: ${HOST}, PATH: ${PATH}`, "");
// 解析格式
const FORMAT = ($request.headers?.["Content-Type"] ?? $request.headers?.["content-type"])?.split(";")?.[0];
log(`⚠ FORMAT: ${FORMAT}`, "");
const PLATFORM = ["Maps"];
if (url.searchParams.get("os") === "watchos") PLATFORM.push("Watch");
log(`⚠ PLATFORM: ${PLATFORM}`, "");
!(async () => {
	/**
	 * 设置
	 * @type {{Settings: import('./types').Settings}}
	 */
	const { Settings, Caches, Configs } = setENV("iRingo", PLATFORM, database);
	// 创建空数据
	let body = {};
	// 方法判断
	switch (METHOD) {
		case "POST":
		case "PUT":
		case "PATCH":
		// biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
		case "DELETE":
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
					//body = M3U8.parse($request.body);
					//log(`🚧 body: ${JSON.stringify(body)}`, "");
					//$request.body = M3U8.stringify(body);
					break;
				case "text/xml":
				case "text/html":
				case "text/plist":
				case "application/xml":
				case "application/plist":
				case "application/x-plist":
					//body = XML.parse($request.body);
					//log(`🚧 body: ${JSON.stringify(body)}`, "");
					//$request.body = XML.stringify(body);
					break;
				case "text/vtt":
				case "application/vtt":
					//body = VTT.parse($request.body);
					//log(`🚧 body: ${JSON.stringify(body)}`, "");
					//$request.body = VTT.stringify(body);
					break;
				case "text/json":
				case "application/json":
					//body = JSON.parse($request.body ?? "{}");
					//log(`🚧 body: ${JSON.stringify(body)}`, "");
					//$request.body = JSON.stringify(body);
					break;
				case "application/protobuf":
				case "application/x-protobuf":
				case "application/vnd.google.protobuf":
				case "application/grpc":
				case "application/grpc+proto":
				case "application/octet-stream": {
					//log(`🚧 $request: ${JSON.stringify($request, null, 2)}`, "");
					let rawBody = $app === "Quantumult X" ? new Uint8Array($request.bodyBytes ?? []) : ($request.body ?? new Uint8Array());
					//log(`🚧 isBuffer? ${ArrayBuffer.isView(rawBody)}: ${JSON.stringify(rawBody, null, 2)}`, "");
					// 写入二进制数据
					$request.body = rawBody;
					break;
				}
			}
		//break; // 不中断，继续处理URL
		case "GET":
		case "HEAD":
		case "OPTIONS":
		default:
			delete $request?.headers?.["If-None-Match"];
			delete $request?.headers?.["if-none-match"];
			// 主机判断
			switch (HOST) {
				case "configuration.ls.apple.com":
					// 路径判断
					switch (PATH) {
						case "/config/defaults":
							break;
					}
					break;
				case "gspe1-ssl.ls.apple.com":
					switch (PATH) {
						case "/pep/gcc":
							/* // 不使用 echo response
									$response = {
										status: 200,
										headers: {
											"Content-Type": "text/html",
											Date: new Date().toUTCString(),
											Connection: "keep-alive",
											"Content-Encoding": "identity",
										},
										body: Settings.PEP.GCC,
									};
									log(JSON.stringify($response));
									*/
							break;
					}
					break;
				case "gspe35-ssl.ls.apple.com":
				case "gspe35-ssl.ls.apple.cn":
					switch (PATH) {
						case "/config/announcements":
							switch (Settings?.Config?.Announcements?.Environment) {
								case "AUTO":
									break;
								case "CN":
								default:
									url.searchParams.set("environment", "prod-cn");
									break;
								case "XX":
									url.searchParams.set("environment", "prod");
									break;
							}
							break;
						case "/geo_manifest/dynamic/config":
							switch (Settings?.GeoManifest?.Dynamic?.Config?.CountryCode) {
								case "AUTO":
									switch (Caches?.pep?.gcc) {
										default:
											url.searchParams.set("country_code", Caches?.pep?.gcc ?? "US");
											break;
										case "CN":
										case undefined:
											url.searchParams.set("country_code", "CN");
											break;
									}
									break;
								default:
									url.searchParams.set("country_code", Settings?.GeoManifest?.Dynamic?.Config?.CountryCode ?? "CN");
									break;
							}
							break;
					}
					break;
			}
			break;
		case "CONNECT":
		case "TRACE":
			break;
	}
	$request.url = url.toString();
	log("🚧 调试信息", `$request.url: ${$request.url}`, "");
})()
	.catch(e => logError(e))
	.finally(() => {
		switch (typeof $response) {
			case "object": // 有构造回复数据，返回构造的回复数据
				//log("🚧 finally", `echo $response: ${JSON.stringify($response, null, 2)}`, "");
				if ($response.headers?.["Content-Encoding"]) $response.headers["Content-Encoding"] = "identity";
				if ($response.headers?.["content-encoding"]) $response.headers["content-encoding"] = "identity";
				switch ($platform) {
					default:
						done({ response: $response });
						break;
					case "Quantumult X":
						if (!$response.status) $response.status = "HTTP/1.1 200 OK";
						delete $response.headers?.["Content-Length"];
						delete $response.headers?.["content-length"];
						delete $response.headers?.["Transfer-Encoding"];
						done($response);
						break;
				}
				break;
			case "undefined": // 无构造回复数据，发送修改的请求数据
				//log("🚧 finally", `$request: ${JSON.stringify($request, null, 2)}`, "");
				done($request);
				break;
			default:
				logError(`不合法的 $response 类型: ${typeof $response}`, "");
				done();
				break;
		}
	});
