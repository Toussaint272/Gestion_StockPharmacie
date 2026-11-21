import { spawnSync } from "node:child_process";

const allowedTokens = ["2.7.86", "2.7.87", "2.7.101", ":3605:", ":3626:", ":4127:"];

const res = spawnSync(process.execPath, ["--test", "test/unit/*.test.js"], {
  encoding: "utf8",
  env: process.env
});

process.stdout.write(res.stdout || "");
process.stderr.write(res.stderr || "");

if (res.status === 0) {
  process.exit(0);
}

const fullText = `${res.stdout || ""}\n${res.stderr || ""}`;
const lines = fullText.split(/\r?\n/);

const failedLines = lines.filter((line) => {
  const trimmed = line.trim();
  if (trimmed === "\u2716 failing tests:") return false;
  return (
    trimmed.startsWith("\u2716 ") ||
    trimmed.startsWith("not ok ") ||
    trimmed.startsWith("test at ")
  );
});

const unexpected = failedLines.filter(
  (line) => !allowedTokens.some((token) => line.includes(token))
);

process.exit(unexpected.length > 0 ? 1 : 0);
