import { expect, test } from "bun:test";
import {
	fontSubsetArgs,
	isJozsikaSubsetCodePoint,
	JOZSIKA_UNICODE_RANGES,
} from "./process-font";

test("Jozsika subset covers English, Spanish, and Catalan", () => {
	for (const character of "AZazáéíóúüñ¿¡àèïòç·Ŀŀ—“”€") {
		expect(isJozsikaSubsetCodePoint(character.codePointAt(0) ?? 0)).toBe(true);
	}
	for (const character of "\u0300\u0301\u0308\u0327") {
		expect(isJozsikaSubsetCodePoint(character.codePointAt(0) ?? 0)).toBe(true);
	}
});

test("Jozsika subset excludes scripts unused by the site", () => {
	expect(isJozsikaSubsetCodePoint("Α".codePointAt(0) ?? 0)).toBe(false);
	expect(isJozsikaSubsetCodePoint("А".codePointAt(0) ?? 0)).toBe(false);
});

test("font subset preserves layout and naming metadata", () => {
	const args = fontSubsetArgs("source.ttf", "subset.woff2");

	expect(args).toContain(`--unicodes=${JOZSIKA_UNICODE_RANGES}`);
	expect(args).toContain("--layout-features=*");
	expect(args).toContain("--name-IDs=*");
	expect(args).toContain("--flavor=woff2");
});
