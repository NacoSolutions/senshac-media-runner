import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import type { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createR2Client } from "./r2-client";

const bucket = process.argv[2];
const key = process.argv[3];
const output = process.argv[4];

if (!bucket || !key || !output) {
	throw new Error("usage: download-r2.ts <bucket> <key> <output>");
}

const response = await createR2Client().send(
	new GetObjectCommand({ Bucket: bucket, Key: key }),
);

if (!response.Body) throw new Error(`empty R2 response: ${bucket}/${key}`);

await mkdir(dirname(output), { recursive: true });
await pipeline(response.Body as Readable, createWriteStream(output));
console.log(`downloaded: ${bucket}/${key} -> ${output}`);
