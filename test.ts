import spawn from "node:spawn";
import path from "node:path";

const opt = {
  cwd: __dirname,
  env: (() => {
    process.env.NODE_PATH = `./${path.delimiter}./lib`;
    return process.env;
  })(),
  stdio: [process.stdin, process.stdout, process.stderr],
};

spawn(
  "node",
  [
    "node_modules/.bin/tap",
    "--cov",
    "--100",
    "--typescript"
    process.argv[2] || "test/**/*.test.ts",
  ],
  opt,
);
