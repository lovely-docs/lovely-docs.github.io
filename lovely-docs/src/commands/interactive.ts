import * as p from "@clack/prompts";
import pc from "picocolors";
import { ConfigManager } from "../lib/config.js";
import { DocRepo } from "../lib/doc-repo.js";
import { Installer } from "../lib/installer.js";
import { join } from "path";

export async function interactiveMode() {
  console.clear();
  p.intro(pc.bgMagenta(pc.black(" lovely-docs ")));

  const configManager = new ConfigManager();
  let config = await configManager.load();

  // 1. Init if needed
  if (!config) {
    const shouldInit = await p.confirm({
      message: "Project not initialized. Initialize now?",
      initialValue: true,
    });

    if (!shouldInit || p.isCancel(shouldInit)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    // Run init logic inline
    const initConfig = await p.group(
      {
        repo: () =>
          p.text({
            message: "Git Repository URL",
            initialValue: "https://github.com/xl0/lovely-docs",
            placeholder: "https://github.com/xl0/lovely-docs",
          }),
        branch: () =>
          p.text({
            message: "Git Branch",
            initialValue: "master",
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

    const s = p.spinner();
    s.start("Syncing documentation database...");
    try {
      const docRepo = new DocRepo();
      await docRepo.sync(initConfig.repo, initConfig.branch);
      s.stop("Documentation synced!");
    } catch (e) {
      s.stop("Failed to sync documentation.");
      console.error(e);
      process.exit(1);
    }

    await configManager.save({
      repo: initConfig.repo,
      branch: initConfig.branch,
      installed: [],
    });
    config = await configManager.load();
  }

  if (!config) return; // Should not happen

  const docRepo = new DocRepo();
  const libraries = await docRepo.listLibraries(config.repo);

  if (libraries.length === 0) {
    p.note(
      "No libraries found. Try running `npx lovely-docs init` to re-sync."
    );
    return;
  }

  // 2. Select Ecosystems
  const allEcosystems = Array.from(
    new Set(libraries.flatMap((l) => l.ecosystems))
  );

  let selectedEcosystems: string[] = allEcosystems;

  if (allEcosystems.length > 0) {
    const ecosystemSelection = await p.multiselect({
      message: "Select Ecosystems",
      options: allEcosystems.map((eco) => ({ value: eco, label: eco })),
      initialValues: allEcosystems, // All selected by default
      required: false,
    });

    if (p.isCancel(ecosystemSelection)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }
    selectedEcosystems = ecosystemSelection as string[];
  }

  // 3. Select Libraries
  const filteredLibraries = libraries.filter((lib) => {
    if (lib.ecosystems.length === 0) return true; // Always show libs with no ecosystem? Or maybe put them in "Other"?
    return lib.ecosystems.some((eco) => selectedEcosystems.includes(eco));
  });

  if (filteredLibraries.length === 0) {
    p.note("No libraries found for selected ecosystems.");
    return;
  }

  const librarySelection = await p.multiselect({
    message: "Select Libraries to Install",
    options: filteredLibraries.map((lib) => {
      const isInstalled = config!.installed.includes(lib.id);
      return {
        value: lib.id,
        label: `${lib.name} ${pc.gray(`(${lib.id})`)}`,
        hint: isInstalled ? "Installed" : undefined,
      };
    }),
    required: false,
  });

  if (p.isCancel(librarySelection)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const selectedLibs = librarySelection as string[];

  if (selectedLibs.length === 0) {
    p.outro("No libraries selected.");
    return;
  }

  // 4. Install
  const s = p.spinner();
  s.start("Installing libraries...");

  const docDbPath = docRepo.getDocDbPath(config.repo);
  const targetDir = join(process.cwd(), ".lovely-docs");
  const installer = new Installer(docDbPath, targetDir);

  for (const libId of selectedLibs) {
    s.message(`Installing ${libId}...`);
    try {
      await installer.install(libId);
      if (!config.installed.includes(libId)) {
        config.installed.push(libId);
      }
    } catch (e) {
      console.error(pc.red(`Failed to install ${libId}:`), e);
    }
  }

  await configManager.save(config);
  s.stop("Installation complete!");

  p.outro(pc.green("Done! Happy coding!"));
}
