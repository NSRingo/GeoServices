import { readFile } from "node:fs/promises";
import vm from "node:vm";

const script = await readFile(process.argv[2] ?? "dist/satellite-route.bundle.js", "utf8");

const run = url => {
	let result;
	vm.runInNewContext(script, {
		URL,
		Number,
		$request: { url },
		$done: value => { result = value; },
	});
	return result?.url ?? url;
};

const china = new URL(run("https://gspe11-ssl.ls.apple.com/tile?style=98&v=226&region=0&z=14&x=12927&y=6735&h=0&preflight=2&accessKey=test"));
if (china.hostname !== "gspe11-2-cn-ssl.ls.apple.com" || china.pathname !== "/2/tiles") throw new Error(`CN endpoint mismatch: ${china}`);
for (const [key, value] of Object.entries({ style: "7", v: "68", size: "1", scale: "2", vertical_datum: "wgs84", z: "14", x: "12927", y: "6735", preflight: "2", accessKey: "test" })) {
	if (china.searchParams.get(key) !== value) throw new Error(`CN ${key} mismatch: ${china}`);
}
if (china.searchParams.has("region") || china.searchParams.has("h")) throw new Error(`CN obsolete parameters retained: ${china}`);

const tokyoInput = "https://gspe11-ssl.ls.apple.com/tile?style=98&v=226&region=0&z=17&x=116423&y=51615&h=0&preflight=2&accessKey=test";
const tokyo = run(tokyoInput);
if (tokyo !== tokyoInput) throw new Error(`Tokyo request was changed: ${tokyo}`);

console.log("v6 route diagnostic tests passed");
