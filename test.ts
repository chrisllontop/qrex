import * as child from "node:child_process";
import * as path from "node:path";
import * as url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const opt = {
  cwd: __dirname,
  env: (() => {
    process.env.NODE_PATH = `./${path.delimiter}./lib`;
    return process.env;
  })(),
  stdio: [process.stdin, process.stdout, process.stderr],
};

child.spawn(
  "node",
  [
    "node_modules/.bin/tap",
    "--cov",
    "--100",
    process.argv[2] || "test/**/*.test.ts",
  ],
  opt
);

