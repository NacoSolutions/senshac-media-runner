import { readdir, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { createR2Client } from "./r2-client";

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
const localFiles = await files(inputRoot);
const expected = new Map(
	await Promise.all(
		localFiles.map(
			async (file) =>
				[
					relative(inputRoot, file).replaceAll("\\", "/"),
					(await stat(file)).size,
				] as const,
		),
	),
);

const r2 = createR2Client();
const actual = new Map<string, number>();
let continuationToken: string | undefined;

do {
	const response = await r2.send(
		new ListObjectsV2Command({
			Bucket: bucket,
			ContinuationToken: continuationToken,
		}),
	);
	for (const object of response.Contents || []) {
		if (object.Key) actual.set(object.Key, object.Size || 0);
	}
	continuationToken = response.NextContinuationToken;
} while (continuationToken);

const missing = [...expected.keys()].filter((key) => !actual.has(key));
const wrongSize = [...expected].filter(
	([key, size]) => actual.has(key) && actual.get(key) !== size,
);

if (missing.length || wrongSize.length) {
	for (const key of missing) console.error(`missing: ${bucket}/${key}`);
	for (const [key, size] of wrongSize) {
		console.error(
			`size mismatch: ${bucket}/${key} local=${size} remote=${actual.get(key)}`,
		);
	}
	process.exit(1);
}

console.log(
	`verified ${expected.size} local objects in ${bucket} (${actual.size} total remote objects)`,
);
