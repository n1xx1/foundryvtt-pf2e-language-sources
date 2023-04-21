import { writeFile } from "fs/promises";
import path from "path";
import { readFileJson } from "./utils";
import { readManifest, readSystemFiles } from "./utils/foundry-system";

type TranslationSource = {
  entries: Record<
    string,
    {
      name?: string;
      description?: string;
      items?: Record<
        string,
        {
          name?: string;
          description?: string;
        }
      >;
    }
  >;
};

export async function commandFixItemIds(lang: string, systemDir: string) {
  const manifest = await readManifest(
    path.join(systemDir, "static", "system.json")
  );
  const [allPacks] = await readSystemFiles(systemDir, manifest);

  for (const pack of allPacks) {
    if (pack.type !== "Actor") {
      continue;
    }

    const originalPath = path.join("lang", "compendium", `${pack.name}.json`);
    const original = await readFileJson<TranslationSource>(originalPath).catch(
      () => Promise.resolve(null)
    );

    if (!original) {
      continue;
    }

    const translatedPath = path.join(
      "trad",
      lang,
      "compendium",
      `${pack.name}.json`
    );
    const translated = await readFileJson<TranslationSource>(
      translatedPath
    ).catch(() => Promise.resolve(null));

    if (!translated) {
      continue;
    }

    console.log("");
    console.log(`FIXING ${pack.name}`);

    for (const [entryName, entry] of Object.entries(original.entries)) {
      const translatedEntry = translated.entries[entryName];
      if (!translatedPath) {
        continue;
      }

      if (!entry.items) {
        continue;
      }

      for (const [itemId, item] of Object.entries(entry.items)) {
        const translatedItem = translatedEntry.items?.[itemId];
        if (!translatedItem) {
          continue;
        }
        if (translatedItem.description === item.description) {
          delete translatedItem.name;
        }
      }
    }

    await writeFile(translatedPath, JSON.stringify(translated, null, 4));
  }
}
