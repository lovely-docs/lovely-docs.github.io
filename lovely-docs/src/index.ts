#!/usr/bin/env node
import { Command } from "commander";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pc from "picocolors";
import { initCommand } from "./commands/init.js";
import { listCommand } from "./commands/list.js";
import { addCommand } from "./commands/add.js";
import { removeCommand } from "./commands/remove.js";
import { interactiveMode } from "./commands/interactive.js";
import { mcpCommand } from "./commands/mcp.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to read package.json for version
let version = "0.0.1";
try {
  const pkgPath = join(__dirname, "..", "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  version = pkg.version;
} catch (e) {
  // ignore
}

const program = new Command();

program
  .name("lovely-docs")
  .description("CLI tool to add curated documentation to your project")
  .version(version);

program.addCommand(initCommand);
program.addCommand(listCommand);
program.addCommand(addCommand);
program.addCommand(removeCommand);
program.addCommand(mcpCommand);

// Default action: Interactive mode
program.action(async () => {
  await interactiveMode();
});

program.parse(process.argv);
