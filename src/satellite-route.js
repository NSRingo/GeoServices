/* iOS 27 mainland satellite route: style 98/226 -> CN style 7/68. */
(() => {
	const request = globalThis.$request;
	if (!request?.url) return $done({});
	const url = new URL(request.url);
	const style = url.searchParams.get("style") ?? url.searchParams.get("tile_style");
	if (url.hostname !== "gspe11-ssl.ls.apple.com" || url.pathname !== "/tile" || style !== "98") return $done({});
	const number = key => Number(url.searchParams.get(key));
	const x = number("x"), y = number("y"), z = number("z");
	if (![x, y, z].every(Number.isInteger) || z < 1 || z > 30) return $done({});
	const factor = z >= 8 ? 2 ** (z - 8) : 1 / 2 ** (8 - z);
	const x8 = Math.floor(x / factor), y8 = Math.floor(y / factor);
	const mainland = [
		[214,82,216,82],[213,83,217,83],[213,84,218,84],[213,85,218,85],[212,86,218,86],
		[189,87,190,87],[210,87,220,87],[188,88,191,88],[210,88,223,88],[188,89,192,89],
		[210,89,223,89],[186,90,192,90],[210,90,223,90],[186,91,192,91],[209,91,222,91],
		[184,92,195,92],[207,92,221,92],[185,93,196,93],[206,93,221,93],[182,94,219,95],
		[180,96,217,96],[180,97,216,97],[180,98,214,98],[180,99,215,99],[182,100,214,100],
		[183,101,213,101],[184,102,214,102],[183,103,214,103],[184,104,215,104],[185,105,215,105],
		[187,106,215,106],[189,107,193,107],[197,107,213,107],[198,108,213,108],[197,109,213,109],
		[197,110,213,110],[198,111,213,111],[204,112,209,112],[205,113,207,113],[205,114,206,114],[205,115,207,115],
	];
	if (!mainland.some(([minX,minY,maxX,maxY]) => x8 >= minX && x8 <= maxX && y8 >= minY && y8 <= maxY)) return $done({});
	url.hostname = "gspe11-2-cn-ssl.ls.apple.com";
	url.pathname = "/2/tiles";
	url.searchParams.set("style", "7");
	url.searchParams.set("v", "68");
	url.searchParams.set("size", "1");
	url.searchParams.set("scale", "2");
	url.searchParams.set("vertical_datum", "wgs84");
	url.searchParams.delete("region");
	url.searchParams.delete("h");
	$done({ url: url.toString() });
})();
