import { Command } from "commander";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { ConfigManager } from "../lib/config.js";
import {
  DocRepo,
  getCacheDir,
  getDocDbPath,
  getRepoPath,
} from "../lib/doc-repo.js";
import { join } from "path";

export const initCommand = new Command("init")
  .description("Initialize lovely-docs in your project")
  .option("-q, --quiet", "Skip prompts and use defaults")
  .option("--repo <url>", "Git repository URL")
  .option("--branch <name>", "Git branch name")
  .option("--git-cache-dir <path>", "Git cache directory")
  .option("--doc-dir <path>", "Direct path to doc_db directory (skips git)")
  .action(async (options) => {
    const configManager = new ConfigManager();
    const existingConfig = await configManager.load();

    if (existingConfig && !options.quiet) {
      const shouldReinit = await p.confirm({
        message: "Project already initialized. Reinitialize?",
        initialValue: false,
      });

      if (p.isCancel(shouldReinit) || !shouldReinit) {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }
    }

    p.intro(pc.bold("Initialize Lovely Docs"));

    let repo: string| undefined  = options.repo || "https://github.com/xl0/lovely-docs";
    let branch: string | undefined  = options.branch || "master";
    let gitCacheDir: string | undefined = options.gitCacheDir || getRepoPath(getCacheDir(), repo!);
    let docDir: string | undefined = options.docDir

    let sourceType: "local" | "git" = options.docDir ? "local" : "git";

    if (!options.quiet) {
      // Interactive mode
      let choice = await p.select({
        message: "Source:",
        options: [
          { value: "git", label: "Git Repository" },
          { value: "local", label: "Local Directory" },
        ] as const,
        initialValue: sourceType,
      });

      if (p.isCancel(choice)) {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }

      sourceType = choice

      if (sourceType === "git") {
        let choice = await p.text({
          message: "Git repository URL:",
          initialValue: repo,
          placeholder: repo,
        });

        if (p.isCancel(choice)) {
          p.cancel("Operation cancelled.");
          process.exit(0);
        }

        repo = choice;

        choice = await p.text({
          message: "Git branch:",
          initialValue: branch,
          placeholder: branch,
        });

        if (p.isCancel(choice)) {
          p.cancel("Operation cancelled.");
          process.exit(0);
        }

        branch = choice;

        choice = await p.text({
          message: "Git cache directory:",
          initialValue: gitCacheDir,
          placeholder: gitCacheDir,
        });

        if (p.isCancel(choice)) {
          p.cancel("Operation cancelled.");
          process.exit(0);
        }

        gitCacheDir = choice;
        // docDir = getDocDbPath(gitCacheDir);

        const s = p.spinner();
        s.start("Syncing documentation repository...");

        try {
          const docRepo = new DocRepo(gitCacheDir);
          await docRepo.sync(repo, branch);
          s.stop("Documentation repository synced");
        } catch (e) {
          s.stop("Failed to sync repository");
          console.error(e);
          process.exit(1);
        }
      } else {
        // Local directory instead of git.
        let choice = await p.text({
          message: "Local doc_db directory path:",
          initialValue: docDir ?? "./doc_db",
          placeholder: docDir ?? "./doc_db",
        });

        if (p.isCancel(choice)) {
          p.cancel("Operation cancelled.");
          process.exit(0);
        }

        docDir = choice;
        repo = branch = gitCacheDir = undefined;
      }
    }

    // Save configuration
    const config = {
      source: {
        type: sourceType,
        repo,
        branch,
        gitCacheDir,
        docDir,
      },
      ecosystems: existingConfig?.ecosystems,
      installed: existingConfig?.installed || [],
    };

    await configManager.save(config);

    p.outro(
      pc.green(
        `Initialized! Run ${pc.bold(
          "npx lovely-docs add"
        )} to install libraries.`
      )
    );
  });
