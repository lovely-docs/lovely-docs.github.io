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

export function getCacheDir(): string {
  if (process.platform === "win32") {
    return process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local");
  }
  if (process.platform === "darwin") {
    return join(homedir(), "Library", "Caches");
  }
  return process.env.XDG_CACHE_HOME || join(homedir(), ".cache");
}

export function getRepoPath(cacheDir: string, repoUrl: string): string {
  try {
    const url = new URL(repoUrl);
    const hostname = url.hostname;
    const pathname = url.pathname.replace(/^\//, "").replace(/\.git$/, "");
    return join(cacheDir, hostname, pathname);
  } catch (e) {
    return join(cacheDir, "default");
  }
}

export function getDocDbPath(repoPath: string): string {
  return join(repoPath, "doc_db");
}

export class DocRepo {
  private cacheBase: string;

  constructor(cacheDir?: string) {
    this.cacheBase = cacheDir || join(getCacheDir(), "lovely-docs", "git");
  }

  async sync(repoUrl: string, branch: string): Promise<string> {
    const targetGitRoot = getRepoPath(this.cacheBase, repoUrl);
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

  async listLibraries(docDbPath: string): Promise<LibraryInfo[]> {
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
