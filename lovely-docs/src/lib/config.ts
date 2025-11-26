import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { parse, stringify } from "yaml";
import * as v from "valibot";

const ConfigSchema = v.object({
  repo: v.optional(v.string(), "https://github.com/xl0/lovely-docs"),
  branch: v.optional(v.string(), "master"),
  installed: v.optional(v.array(v.string()), []),
});

export type Config = v.Output<typeof ConfigSchema>;

const CONFIG_FILE = ".lovely-docs.yaml";

export class ConfigManager {
  private configPath: string;

  constructor(cwd: string = process.cwd()) {
    this.configPath = join(cwd, CONFIG_FILE);
  }

  async load(): Promise<Config | null> {
    if (!existsSync(this.configPath)) {
      return null;
    }

    try {
      const content = await readFile(this.configPath, "utf-8");
      const data = parse(content);
      const result = v.safeParse(ConfigSchema, data);
      if (result.success) {
        return result.output;
      } else {
        // If invalid, maybe return partial or throw?
        // For now, let's return defaults merged with what we can
        return {
          repo: "https://github.com/xl0/lovely-docs",
          branch: "master",
          installed: [],
          ...data,
        };
      }
    } catch (e) {
      return null;
    }
  }

  async save(config: Config): Promise<void> {
    const content = stringify(config);
    await writeFile(this.configPath, content, "utf-8");
  }

  exists(): boolean {
    return existsSync(this.configPath);
  }
}
