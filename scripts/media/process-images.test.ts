import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { IMAGE_WIDTHS } from "./process-images";

test("responsive image pipeline uses the layout-slot width ladder", () => {
	expect(IMAGE_WIDTHS).toEqual([320, 480, 640, 768, 1024, 1280, 1920]);
	expect(IMAGE_WIDTHS).not.toContain(412);
	expect(IMAGE_WIDTHS).not.toContain(1200);
});

test("generated filenames always match their srcset width descriptors", () => {
	const source = readFileSync(
		join(import.meta.dir, "process-images.ts"),
		"utf8",
	);
	expect(source).toContain(".resize({ width })");
	expect(source).toContain(".avif({ quality: 45, effort: 5 })");
	expect(source).not.toContain("withoutEnlargement");
});
