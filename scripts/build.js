const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "web");
const outputDir = path.join(root, "dist");

function currentCommit() {
  try {
    return execSync("git rev-parse --short HEAD", { cwd: root }).toString().trim();
  } catch {
    return (process.env.GITHUB_SHA || "local").slice(0, 7);
  }
}

const sha = currentCommit();
const builtAt = new Date().toISOString();
const files = ["index.html", "style.css", "app.js"];

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const file of files) {
  let content = fs.readFileSync(path.join(sourceDir, file), "utf8");
  content = content.replace(/__BUILD_INFO__/g, `Built from commit ${sha} on ${builtAt}`);
  fs.writeFileSync(path.join(outputDir, file), content);
}

console.log(`Build finished: ${files.length} files copied to dist/ (commit ${sha})`);
