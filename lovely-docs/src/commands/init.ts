import { Command } from "commander";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { ConfigManager } from "../lib/config.js";
import { DocRepo } from "../lib/doc-repo.js";

export const initCommand = new Command("init")
  .description("Initialize lovely-docs in the current project")
  .option("-r, --repo <url>", "Git repository URL")
  .option("-b, --branch <branch>", "Git branch")
  .option("-y, --yes", "Skip prompts and use defaults/flags")
  .action(async (options) => {
    console.clear();
    p.intro(pc.bgMagenta(pc.black(" lovely-docs ")));

    const configManager = new ConfigManager();
    const existingConfig = await configManager.load();

    let config: { repo: string; branch: string };

    if (options.yes) {
      config = {
        repo:
          options.repo ||
          existingConfig?.repo ||
          "https://github.com/xl0/lovely-docs",
        branch: options.branch || existingConfig?.branch || "master",
      };
    } else {
      const result = await p.group(
        {
          repo: () =>
            p.text({
              message: "Git Repository URL",
              initialValue:
                existingConfig?.repo || "https://github.com/xl0/lovely-docs",
              placeholder: "https://github.com/xl0/lovely-docs",
            }),
          branch: () =>
            p.text({
              message: "Git Branch",
              initialValue: existingConfig?.branch || "master",
              placeholder: "master",
            }),
        },
        {
          onCancel: () => {
            p.cancel("Operation cancelled.");
            process.exit(0);
          },
        }
      );
      config = result;
    }

    const s = p.spinner();
    s.start("Syncing documentation database...");

    try {
      const docRepo = new DocRepo();
      await docRepo.sync(config.repo, config.branch);
      s.stop("Documentation synced!");
    } catch (e) {
      s.stop("Failed to sync documentation.");
      console.error(e);
      process.exit(1);
    }

    await configManager.save({
      repo: config.repo,
      branch: config.branch,
      installed: existingConfig?.installed || [],
    });

    p.outro(
      pc.green(
        "Initialization complete! You can now add libraries using `npx lovely-docs add <library>`"
      )
    );
  });
