import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const nextDir = join(process.cwd(), ".next");

if (!existsSync(nextDir)) {
  process.exit(0);
}

rmSync(nextDir, { recursive: true, force: true });
