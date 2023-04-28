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

export async function commandRemoveSameTranslation(
  lang: string,
  compendium: string | undefined | null,
  systemDir: string
) {
  const manifest = await readManifest(
    path.join(systemDir, "static", "system.json")
  );
  const [allPacks] = await readSystemFiles(systemDir, manifest);

  for (const pack of allPacks) {
    if (pack.type !== "Actor") {
      continue;
    }
    if (
      compendium !== undefined &&
      compendium !== null &&
      pack.name !== compendium
    ) {
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

    function walkObject(a: any, b: any) {
      for (const k of Object.keys(a)) {
        if (!(k in b)) {
          continue;
        }
        if (typeof a[k] === "object" && typeof b[k] === "object") {
          walkObject(a[k], b[k]);

          if (Object.keys(a[k]).length === 0) {
            delete a[k];
          }

          continue;
        }

        if (a[k] === b[k]) {
          delete a[k];
        }
      }
    }

    walkObject(translated, original);

    await writeFile(translatedPath, JSON.stringify(translated, null, 4));
  }
}
