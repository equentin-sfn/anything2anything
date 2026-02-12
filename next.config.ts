import type { NextConfig } from "next";
import { execSync } from "child_process";

let commitHash = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "";

if (!commitHash) {
	try {
		commitHash = execSync("git rev-parse --short HEAD").toString().trim();
	} catch {
		commitHash = "dev";
	}
}

const nextConfig: NextConfig = {
	env: {
		NEXT_PUBLIC_COMMIT_SHA: commitHash,
	},
};

export default nextConfig;
