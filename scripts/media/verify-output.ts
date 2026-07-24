import { readdir, stat } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

async function files(path: string): Promise<string[]> {
	const entries = await readdir(path, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((entry) => {
			const entryPath = join(path, entry.name);
			return entry.isDirectory() ? files(entryPath) : [entryPath];
		}),
	);
	return nested.flat();
}

const root = resolve(process.argv[2] || "/work/output");
const outputFiles = await files(root);
if (outputFiles.length === 0) throw new Error(`no media output found in ${root}`);

for (const file of outputFiles) {
	if ((await stat(file)).size === 0) throw new Error(`empty output file: ${file}`);
}

const extensions = new Set(outputFiles.map((file) => extname(file)));
const imageOutput = extensions.has(".avif") || extensions.has(".webp");
const videoOutput = extensions.has(".m3u8") || extensions.has(".ts");
const fontOutput = extensions.has(".woff2");

if (!imageOutput && !videoOutput && !fontOutput) {
	throw new Error(`no recognized media output found in ${root}`);
}

if (videoOutput && !extensions.has(".m3u8")) {
	throw new Error(`HLS output has segments but no playlist in ${root}`);
}

console.log(`verified ${outputFiles.length} generated files in ${root}`);
