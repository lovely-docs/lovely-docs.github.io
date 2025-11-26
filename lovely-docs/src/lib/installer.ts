import { join, dirname } from "path";
import { readFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import fs from "fs-extra";
import pc from "picocolors";

interface IndexNode {
  displayName: string;
  origPath: string;
  children: Record<string, IndexNode>;
  relevant: boolean;
}

interface IndexJson {
  name: string;
  map: IndexNode;
}

export class Installer {
  constructor(private docDbPath: string, private targetDir: string) {}

  async install(libraryName: string): Promise<void> {
    const libPath = join(this.docDbPath, libraryName);
    const indexPath = join(libPath, "index.json");

    if (!existsSync(indexPath)) {
      throw new Error(`Library ${libraryName} not found in ${this.docDbPath}`);
    }

    const indexContent = await readFile(indexPath, "utf-8");
    const index: IndexJson = JSON.parse(indexContent);

    const libTargetDir = join(this.targetDir, libraryName);
    await fs.ensureDir(libTargetDir);

    // 1. Copy Library Level Files
    await this.copyVariant(
      libPath,
      join(this.targetDir, `${libraryName}.md`),
      "digest"
    );
    await this.copyVariant(
      libPath,
      join(this.targetDir, `${libraryName}.md.fulltext`),
      "fulltext"
    );

    // 2. Generate LLM_MAP.md
    const essenceTree = await this.buildEssenceTree(libPath, index.map);
    const llmMapContent = this.renderEssenceTree(essenceTree);
    await fs.outputFile(join(libTargetDir, "LLM_MAP.md"), llmMapContent);

    // 3. Traverse and copy children
    await this.processNode(libPath, libTargetDir, index.map);
  }

  private async copyVariant(
    sourceDir: string,
    targetPath: string,
    variant: "digest" | "fulltext" | "short_digest"
  ) {
    const sourceFile = join(sourceDir, `${variant}.md`);
    if (existsSync(sourceFile)) {
      // If target is a directory (e.g. sveltejs_svelte), we shouldn't overwrite it with a file?
      // The target structure says:
      // .lovely-docs/sveltejs_svelte.md
      // .lovely-docs/sveltejs_svelte/
      // So sveltejs_svelte.md is a file, sveltejs_svelte is a dir. This is fine on Linux/macOS/Windows.
      await fs.copy(sourceFile, targetPath);
    }
  }

  private async processNode(
    sourcePath: string,
    targetPath: string,
    node: IndexNode
  ) {
    // Process children
    for (const [key, child] of Object.entries(node.children)) {
      const childSourcePath = join(sourcePath, key);

      // Determine target path
      // If it's a leaf or has content, it goes to targetPath/key.md
      // But if it has children, it also needs a directory targetPath/key/

      // The structure requested:
      // runes.md
      // runes/
      //   $derived.md

      const childTargetFile = join(targetPath, `${key}.md`);
      const childTargetFullFile = join(targetPath, `${key}.md.fulltext`);
      const childTargetDir = join(targetPath, key);

      // Copy files
      await this.copyVariant(childSourcePath, childTargetFile, "digest");
      await this.copyVariant(childSourcePath, childTargetFullFile, "fulltext");

      // Recurse if there are children
      if (Object.keys(child.children).length > 0) {
        await fs.ensureDir(childTargetDir);
        await this.processNode(childSourcePath, childTargetDir, child);
      }
    }
  }

  private async buildEssenceTree(
    path: string,
    node: IndexNode
  ): Promise<EssenceNode> {
    let essence = "";
    const essencePath = join(path, "essence.md");
    if (existsSync(essencePath)) {
      essence = await readFile(essencePath, "utf-8");
    }

    const children: Record<string, EssenceNode> = {};
    for (const [key, child] of Object.entries(node.children)) {
      children[key] = await this.buildEssenceTree(join(path, key), child);
    }

    return {
      name: node.displayName,
      essence,
      children,
    };
  }

  private renderEssenceTree(node: EssenceNode, depth = 0): string {
    let output = "";
    const indent = "  ".repeat(depth);

    if (depth === 0) {
      output += `# ${node.name} Map\n\n`;
      if (node.essence) output += `${node.essence}\n\n`;
    } else {
      output += `${indent}- **${node.name}**`;
      if (node.essence) {
        // Clean up essence to fit in a list item if needed, or just append
        const cleanEssence = node.essence.trim().replace(/\n/g, " ");
        output += `: ${cleanEssence}`;
      }
      output += "\n";
    }

    for (const child of Object.values(node.children)) {
      output += this.renderEssenceTree(child, depth + 1);
    }

    return output;
  }
}

interface EssenceNode {
  name: string;
  essence: string;
  children: Record<string, EssenceNode>;
}
