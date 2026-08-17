import { execFileSync } from "node:child_process";

const command = process.platform === "win32" ? "npx.cmd" : "npx";

function run(args) {
  execFileSync(command, args, { stdio: "inherit" });
}

// Preview deployments do not have production database credentials. Migrations
// run only for the production deployment, where DATABASE_URL is configured.
if (process.env.VERCEL_ENV === "production") {
  run(["prisma", "migrate", "deploy"]);
}

run(["prisma", "generate"]);
run(["next", "build"]);
