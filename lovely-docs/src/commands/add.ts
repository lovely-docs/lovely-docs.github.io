import { Command } from "commander";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { ConfigManager } from "../lib/config.js";
import { DocRepo } from "../lib/doc-repo.js";
import { Installer } from "../lib/installer.js";
import { join } from "path";
import { existsSync } from "fs";

export const addCommand = new Command("add")
  .description("Add a documentation library to your project")
  .argument("<library>", "Library ID to add")
  .action(async (libraryId) => {
    const configManager = new ConfigManager();
    const config = await configManager.load();

    if (!config) {
      console.error(
        pc.red("Project not initialized. Run `npx lovely-docs init` first.")
      );
      process.exit(1);
    }

    const docRepo = new DocRepo();
    const docDbPath = docRepo.getDocDbPath(config.repo);
    const targetDir = join(process.cwd(), ".lovely-docs");

    // Check if library exists in doc_db
    const libPath = join(docDbPath, libraryId);
    if (!existsSync(libPath)) {
      console.error(
        pc.red(`Library '${libraryId}' not found in documentation database.`)
      );
      console.log(
        pc.yellow("Run `npx lovely-docs list` to see available libraries.")
      );
      process.exit(1);
    }

    // Check if already installed
    const targetLibDir = join(targetDir, libraryId);
    if (existsSync(targetLibDir)) {
      const shouldOverwrite = await p.confirm({
        message: `Library '${libraryId}' is already installed. Overwrite?`,
        initialValue: false,
      });

      if (p.isCancel(shouldOverwrite) || !shouldOverwrite) {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }
    }

    const s = p.spinner();
    s.start(`Installing ${libraryId}...`);

    try {
      const installer = new Installer(docDbPath, targetDir);
      await installer.install(libraryId);

      // Update config
      if (!config.installed.includes(libraryId)) {
        config.installed.push(libraryId);
        await configManager.save(config);
      }

      s.stop(`Installed ${libraryId}`);
    } catch (e) {
      s.stop(`Failed to install ${libraryId}`);
      console.error(e);
      process.exit(1);
    }
  });
