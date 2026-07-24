import { expect, test } from "bun:test";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("local output verifier accepts a non-empty responsive image", async () => {
	const root = await mkdtemp(join(tmpdir(), "senshac-media-output-"));
	await mkdir(join(root, "images", "fixture"), { recursive: true });
	await writeFile(join(root, "images", "fixture", "320.avif"), "fixture");

	const result = Bun.spawnSync(
		["bun", "scripts/media/verify-output.ts", root],
		{ cwd: join(import.meta.dir, "../..") },
	);
	expect(result.exitCode).toBe(0);
});

test("local output verifier rejects an empty output tree", async () => {
	const root = await mkdtemp(join(tmpdir(), "senshac-media-output-"));
	const result = Bun.spawnSync(
		["bun", "scripts/media/verify-output.ts", root],
		{ cwd: join(import.meta.dir, "../..") },
	);
	expect(result.exitCode).not.toBe(0);
});
