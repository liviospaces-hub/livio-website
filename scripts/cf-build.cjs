const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function cleanExport() {
  for (const rel of ["out/images/works/_raw", "out/images/works/_dl"]) {
    fs.rmSync(path.join(root, rel), { recursive: true, force: true });
  }
}

function build() {
  const nextBin = require.resolve("next/dist/bin/next");
  execSync(`node "${nextBin}" build`, { stdio: "inherit", cwd: root });
  cleanExport();
}

const onCloudflare =
  process.env.WORKERS_CI === "1" ||
  process.env.CF_PAGES === "1" ||
  process.cwd().includes("/opt/buildhome");

if (require.main === module) {
  if (process.argv.includes("--clean-only")) {
    cleanExport();
    process.exit(0);
  }

  if (onCloudflare || process.argv.includes("--force")) {
    build();
  }
}

module.exports = { build, cleanExport };
