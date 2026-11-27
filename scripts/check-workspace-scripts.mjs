// Fails when a workspace package is missing a script that the root runs
// across all workspaces. `pnpm -r run <script>` silently skips packages
// without the script, so without this check a package could skip its
// typecheck or tests and CI would still be green.
//
// Usage: node scripts/check-workspace-scripts.mjs <script> [<script> ...]

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const required = process.argv.slice(2);
if (required.length === 0) {
  console.error("Usage: node scripts/check-workspace-scripts.mjs <script> [<script> ...]");
  process.exit(2);
}

const root = path.resolve(import.meta.dirname, "..");
const projects = JSON.parse(
  execSync("pnpm ls -r --depth -1 --json", { cwd: root, encoding: "utf8", shell: true }),
);

const problems = [];
for (const project of projects) {
  if (path.resolve(project.path) === root) continue;
  const manifest = JSON.parse(readFileSync(path.join(project.path, "package.json"), "utf8"));
  const name = manifest.name ?? path.relative(root, project.path);
  for (const script of required) {
    if (!manifest.scripts?.[script]) {
      problems.push(`${name}: missing "${script}" script`);
    }
  }
}

if (problems.length > 0) {
  console.error("Every workspace package must define these scripts: " + required.join(", "));
  for (const problem of problems) console.error("  " + problem);
  process.exit(1);
}
