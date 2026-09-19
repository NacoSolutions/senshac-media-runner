import { expect, test } from "bun:test";

const root = `${import.meta.dir}/../..`;

test("runner exposes the versioned mount and operation contract", () => {
	const result = Bun.spawnSync([`${root}/scripts/media-runner`, "contract"], {
		cwd: root,
	});

	expect(result.exitCode).toBe(0);
	const contract = JSON.parse(result.stdout.toString());
	expect(contract.version).toBe(1);
	expect(contract.mounts).toEqual({
		input: "/work/input:ro",
		output: "/work/output:rw",
	});
	expect(contract.operations).toContain("object");
	expect(contract.operations).toContain("verify");
	expect(contract.credentials).toBe("transfer-operations-only");
});
