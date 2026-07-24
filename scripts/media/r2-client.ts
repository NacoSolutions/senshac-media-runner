import { S3Client } from "@aws-sdk/client-s3";

function required(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`${name} is required`);
	return value;
}

export function createR2Client(): S3Client {
	const accountId = required("CLOUDFLARE_ACCOUNT_ID");

	return new S3Client({
		region: "auto",
		endpoint:
			process.env.R2_ENDPOINT ||
			`https://${accountId}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId:
				process.env.R2_ACCESS_KEY_ID ||
				process.env.S3_ACCESS_KEY_ID ||
				required("R2_ACCESS_KEY_ID"),
			secretAccessKey:
				process.env.R2_SECRET_ACCESS_KEY ||
				process.env.S3_SECRET_ACCESS_KEY ||
				required("R2_SECRET_ACCESS_KEY"),
		},
		forcePathStyle: true,
	});
}
