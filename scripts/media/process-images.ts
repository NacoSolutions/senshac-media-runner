import { mkdir, readdir } from "node:fs/promises";
import { basename, extname, join, relative, resolve } from "node:path";
// @ts-expect-error
import sharp from "sharp";

export const IMAGE_WIDTHS = [320, 480, 640, 768, 1024, 1280, 1920] as const;
const IMAGE_EXTENSIONS = new Set([
	".avif",
	".gif",
	".jpeg",
	".jpg",
	".png",
	".tif",
	".tiff",
	".webp",
]);

function mediaId(file: string, inputRoot: string) {
	const relativePath = relative(inputRoot, file);
	return relativePath
		.slice(0, -extname(relativePath).length)
		.replaceAll("\\", "/");
}

async function imageFiles(path: string): Promise<string[]> {
	const entries = await readdir(path, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const entryPath = join(path, entry.name);
			return entry.isDirectory() ? imageFiles(entryPath) : [entryPath];
		}),
	);

	return files
		.flat()
		.filter((file) => IMAGE_EXTENSIONS.has(extname(file).toLowerCase()));
}

export async function processImages(input: string, output: string) {
	const inputRoot = resolve(input);
	const outputRoot = resolve(output);
	const files = await imageFiles(inputRoot);

	for (const file of files) {
		const id = mediaId(file, inputRoot);
		const destination = join(outputRoot, "images", id);
		await mkdir(destination, { recursive: true });

		for (const width of IMAGE_WIDTHS) {
			const source = sharp(file).rotate().resize({ width });
			await Promise.all([
				source
					.clone()
					.avif({ quality: 45, effort: 5 })
					.toFile(join(destination, `${width}.avif`)),
				source
					.clone()
					.webp({ quality: 65, effort: 5 })
					.toFile(join(destination, `${width}.webp`)),
			]);
		}

		console.log(`processed image: ${basename(file)} -> images/${id}`);
	}
}

if (import.meta.main) {
	const [input = "media/raw/images", output = "media/processed"] =
		process.argv.slice(2);
	await processImages(input, output);
}
