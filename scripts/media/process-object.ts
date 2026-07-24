import { spawnSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import { processImages } from "./process-images";

const input = process.argv[2];
const output = resolve(process.argv[3] || "media/processed");
const key = process.argv[4] || input;

if (!input || !key) {
	throw new Error(
		"usage: process-object.ts <input-file> [output-root] [r2-key]",
	);
}

const extension = extname(input).toLowerCase();
const id = key
	.replaceAll("\\", "/")
	.replace(/^\/+/, "")
	.replace(/\.[^.]+$/, "")
	.replace(/^(images|videos)\//, "");

if (
	[".avif", ".gif", ".jpeg", ".jpg", ".png", ".tif", ".tiff", ".webp"].includes(
		extension,
	)
) {
	const temporaryRoot = await mkdtemp(join(tmpdir(), "senshac-media-"));
	const staged = join(temporaryRoot, `${id}${extension}`);
	await mkdir(resolve(staged, ".."), { recursive: true });
	await copyFile(input, staged);
	try {
		await processImages(temporaryRoot, output);
	} finally {
		await rm(temporaryRoot, { recursive: true, force: true });
	}
} else if (extension === ".mp4" || extension === ".mov") {
	const process = spawnSync(
		"scripts/media/process-video.sh",
		[input, output, id],
		{
			stdio: "inherit",
		},
	);
	if (process.status) throw new Error(`ffmpeg failed for ${input}`);
} else if (extension === ".woff2") {
	const destination = join(output, "fonts", basename(key));
	await mkdir(resolve(destination, ".."), { recursive: true });
	await copyFile(input, destination);
	console.log(`copied font: ${key} -> fonts/${basename(key)}`);
} else {
	throw new Error(`unsupported media extension: ${extension}`);
}

await stat(output);
