import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";

export const JOZSIKA_UNICODE_RANGES =
	"U+0000-017F,U+0300-036F,U+2000-206F,U+20AC,U+2122";

export function isJozsikaSubsetCodePoint(codePoint: number): boolean {
	return (
		(codePoint >= 0x0000 && codePoint <= 0x017f) ||
		(codePoint >= 0x0300 && codePoint <= 0x036f) ||
		(codePoint >= 0x2000 && codePoint <= 0x206f) ||
		codePoint === 0x20ac ||
		codePoint === 0x2122
	);
}

export function fontSubsetArgs(input: string, output: string): string[] {
	return [
		input,
		`--output-file=${output}`,
		"--flavor=woff2",
		`--unicodes=${JOZSIKA_UNICODE_RANGES}`,
		"--layout-features=*",
		"--name-IDs=*",
		"--name-legacy",
		"--name-languages=*",
		"--glyph-names",
		"--symbol-cmap",
		"--legacy-cmap",
		"--notdef-glyph",
		"--notdef-outline",
		"--recommended-glyphs",
	];
}

export function processFont(input: string, output: string): void {
	const source = resolve(input);
	const destination = resolve(output);
	const extension = extname(source).toLowerCase();

	if (extension !== ".ttf" && extension !== ".otf") {
		throw new Error("font source must be a TTF or OTF file");
	}
	if (extname(destination).toLowerCase() !== ".woff2") {
		throw new Error("font destination must be a WOFF2 file");
	}

	mkdirSync(dirname(destination), { recursive: true });
	const result = spawnSync("pyftsubset", fontSubsetArgs(source, destination), {
		stdio: "inherit",
	});
	if (result.error) throw result.error;
	if (result.status !== 0) {
		throw new Error(`pyftsubset failed with exit code ${result.status}`);
	}
}

if (import.meta.main) {
	const [input, output] = process.argv.slice(2);
	if (!input || !output) {
		throw new Error(
			"usage: process-font.ts <input.ttf|input.otf> <output.woff2>",
		);
	}
	processFont(input, output);
}
