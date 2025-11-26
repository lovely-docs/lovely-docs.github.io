import { Command } from "commander";
import pc from "picocolors";
import { ConfigManager } from "../lib/config.js";
import { DocRepo } from "../lib/doc-repo.js";

export const listCommand = new Command("list")
  .description("List available documentation libraries")
  .alias("l")
  .action(async () => {
    const configManager = new ConfigManager();
    const config = await configManager.load();

    if (!config) {
      console.error(
        pc.red("Project not initialized. Run `npx lovely-docs init` first.")
      );
      process.exit(1);
    }

    // Determine doc_db path from config
    let docDbPath: string;
    if (config.docDir) {
      docDbPath = config.docDir;
    } else {
      const docRepo = new DocRepo(config.gitCacheDir);
      docDbPath = docRepo.getDocDbPath(config.repo);
    }

    const libraries = await new DocRepo().listLibraries(docDbPath);

    if (libraries.length === 0) {
      console.log(
        pc.yellow(
          "No libraries found. Try running `npx lovely-docs init` again to sync."
        )
      );
      return;
    }

    console.log(pc.bold("\nAvailable Libraries:"));

    // Group by ecosystem
    const byEcosystem: Record<string, typeof libraries> = {};
    const noEcosystem: typeof libraries = [];

    for (const lib of libraries) {
      if (lib.ecosystems.length === 0) {
        noEcosystem.push(lib);
      } else {
        for (const eco of lib.ecosystems) {
          byEcosystem[eco] = byEcosystem[eco] || [];
          byEcosystem[eco].push(lib);
        }
      }
    }

    for (const [eco, libs] of Object.entries(byEcosystem)) {
      console.log(pc.cyan(`\n${eco}:`));
      for (const lib of libs) {
        const installed = config.installed.includes(lib.id)
          ? pc.green(" (installed)")
          : "";
        const path = pc.gray(` → .lovely-docs/${lib.id}`);
        console.log(`  ${pc.white(lib.name)}${path}${installed}`);
      }
    }

    if (noEcosystem.length > 0) {
      console.log(pc.cyan("\nOther:"));
      for (const lib of noEcosystem) {
        const installed = config.installed.includes(lib.id)
          ? pc.green(" (installed)")
          : "";
        const path = pc.gray(` → .lovely-docs/${lib.id}`);
        console.log(`  ${pc.white(lib.name)}${path}${installed}`);
      }
    }
    console.log("");
  });
