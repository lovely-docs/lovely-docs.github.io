import { simpleGit } from "simple-git";
import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import { readdir, readFile } from "fs/promises";
import pc from "picocolors";

export interface LibraryInfo {
  id: string;
  name: string;
  ecosystems: string[];
}

function getCacheDir(): string {
  if (process.platform === "win32") {
    return process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local");
  }
  if (process.platform === "darwin") {
    return join(homedir(), "Library", "Caches");
  }
  return process.env.XDG_CACHE_HOME || join(homedir(), ".cache");
}

export class DocRepo {
  private cacheBase: string;

  constructor(cacheDir?: string) {
    this.cacheBase = cacheDir || join(getCacheDir(), "lovely-docs", "git");
  }

  private getRepoPath(repoUrl: string): string {
    try {
      const url = new URL(repoUrl);
      const hostname = url.hostname;
      const pathname = url.pathname.replace(/^\//, "").replace(/\.git$/, "");
      return join(this.cacheBase, hostname, pathname);
    } catch (e) {
      return join(this.cacheBase, "default");
    }
  }

  async sync(repoUrl: string, branch: string): Promise<string> {
    const targetGitRoot = this.getRepoPath(repoUrl);
    const git = simpleGit();

    if (!existsSync(targetGitRoot)) {
      console.log(pc.blue(`Cloning ${repoUrl} to ${targetGitRoot}...`));
      mkdirSync(dirname(targetGitRoot), { recursive: true });
      await git.clone(repoUrl, targetGitRoot, ["-b", branch]);
    } else {
      // console.log(pc.blue(`Syncing ${repoUrl}...`));
      try {
        if (!existsSync(join(targetGitRoot, ".git"))) {
          throw new Error("Directory exists but is not a git repository");
        }
        const repo = simpleGit(targetGitRoot);
        await repo.fetch("origin", branch);
        await repo.reset(["--hard", `origin/${branch}`]);
      } catch (e) {
        console.error(pc.red("Failed to sync git repo:"), e);
        throw e;
      }
    }

    return join(targetGitRoot, "doc_db");
  }

  getDocDbPath(repoUrl: string): string {
    return join(this.getRepoPath(repoUrl), "doc_db");
  }

  async listLibraries(repoUrl: string): Promise<LibraryInfo[]> {
    const docDbPath = this.getDocDbPath(repoUrl);
    if (!existsSync(docDbPath)) return [];

    const entries = await readdir(docDbPath, { withFileTypes: true });
    const libraries: LibraryInfo[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const indexPath = join(docDbPath, entry.name, "index.json");
      if (existsSync(indexPath)) {
        try {
          const content = await readFile(indexPath, "utf-8");
          const data = JSON.parse(content);
          libraries.push({
            id: entry.name,
            name: data.name || entry.name,
            ecosystems: data.ecosystems || [],
          });
        } catch (e) {
          // ignore
        }
      }
    }
    return libraries;
  }
}
