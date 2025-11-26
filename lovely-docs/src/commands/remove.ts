import { Command } from "commander";
import pc from "picocolors";
import { ConfigManager } from "../lib/config.js";
import { join } from "path";
import fs from "fs-extra";

export const removeCommand = new Command("remove")
  .description("Remove a documentation library from your project")
  .argument("<library>", "Library ID to remove")
  .action(async (libraryId) => {
    const configManager = new ConfigManager();
    const config = await configManager.load();

    if (!config) {
      console.error(
        pc.red("Project not initialized. Run `npx lovely-docs init` first.")
      );
      process.exit(1);
    }

    const targetDir = join(process.cwd(), ".lovely-docs");
    const targetLibDir = join(targetDir, libraryId);
    const targetLibFile = join(targetDir, `${libraryId}.md`);
    const targetLibFullFile = join(targetDir, `${libraryId}.md.fulltext`);

    try {
      await fs.remove(targetLibDir);
      await fs.remove(targetLibFile);
      await fs.remove(targetLibFullFile);

      // Update config
      config.installed = config.installed.filter(
        (id: string) => id !== libraryId
      );
      await configManager.save(config);

      console.log(pc.green(`Removed ${libraryId}`));
    } catch (e) {
      console.error(pc.red(`Failed to remove ${libraryId}:`), e);
      process.exit(1);
    }
  });
