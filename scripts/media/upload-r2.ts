import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import { Upload } from "@aws-sdk/lib-storage";
import { createR2Client } from "./r2-client";

const CONTENT_TYPES: Record<string, string> = {
	".avif": "image/avif",
	".jpeg": "image/jpeg",
	".jpg": "image/jpeg",
	".m3u8": "application/vnd.apple.mpegurl",
	".mp4": "video/mp4",
	".png": "image/png",
	".ts": "video/mp2t",
	".webp": "image/webp",
	".woff2": "font/woff2",
};

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

const inputRoot = resolve(process.argv[2] || "media/processed");
const bucket = process.argv[3] || "senshac-media-prod";
const r2 = createR2Client();

for (const file of await files(inputRoot)) {
	const key = relative(inputRoot, file).replaceAll("\\", "/");
	const metadata = await stat(file);
	const contentType =
		CONTENT_TYPES[extname(file).toLowerCase()] || "application/octet-stream";
	const cacheControl = key.endsWith(".m3u8")
		? "public, max-age=86400"
		: "public, max-age=31536000, immutable";
	await new Upload({
		client: r2,
		queueSize: 3,
		partSize: 10 * 1024 * 1024,
		leavePartsOnError: false,
		params: {
			Bucket: bucket,
			Key: key,
			Body: createReadStream(file),
			ContentLength: metadata.size,
			ContentType: contentType,
			CacheControl: cacheControl,
		},
	}).done();
	console.log(`uploaded: ${file} -> ${bucket}/${key}`);
}
