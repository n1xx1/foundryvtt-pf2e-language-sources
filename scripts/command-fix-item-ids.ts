import { writeFile } from "fs/promises";
import path from "path";
import { readFileJson } from "./utils";
import { readManifest, readSystemFiles } from "./utils/foundry-system";

export async function commandFixItemIds(lang: string, systemDir: string) {
  const manifest = await readManifest(
    path.join(systemDir, "static", "system.json")
  );
  const [allPacks] = await readSystemFiles(systemDir, manifest);

  for (const pack of allPacks) {
    if (pack.type !== "Actor") {
      continue;
    }

    const translatedPath = path.join(
      "trad",
      lang,
      "compendium",
      `${pack.name}.json`
    );
    const translated = await readFileJson<Record<string, unknown>>(
      translatedPath
    ).catch(() => Promise.resolve(null));
    if (!translated) {
      continue;
    }

    console.log("");
    console.log(`FIXING ${pack.name}`);
    for (const [key, data] of Object.entries(
      translated.entries as Record<string, Record<string, unknown>>
    )) {
      const entry = pack.entries.find((e) => e.name === key);
      if (!entry) {
        console.log(`entry not found: ${key}`);
        continue;
      }
      if (!("type" in entry) || entry.type !== "npc") {
        continue;
      }

      type Items = Record<
        string,
        { name?: string; description?: string; _source?: string }
      >;

      const translatedItems = Object.entries((data.items as Items) ?? {});
      if (translatedItems.length === 0) {
        continue;
      }

      let applyOnlyName = false;

      const newItems: Items = {};
      for (const [itemName, data1] of translatedItems) {
        const entryItems = entry.items.filter((i) => i.name === itemName);
        if (entryItems.length > 1) {
          const descriptions = entryItems.map(
            (e) => e.system.description.value
          );
          const descriptionsAllSame =
            descriptions.reduce(
              (p: string | null, c) => (p === c ? p : null),
              descriptions[0]
            ) !== null;

          if (!descriptionsAllSame) {
            console.log(
              `multiple items for "${itemName}" in "${key}", description ignored`
            );
            applyOnlyName = true;
          }
        } else if (entryItems.length == 0) {
          console.log(`item "${itemName}" not found in "${key}"`);
          continue;
        }

        if (applyOnlyName && "description" in data1) {
          delete data1.description;
        }
        if (Object.keys(data1).length != 0) {
          for (const item of entryItems) {
            newItems[item._id] = { ...data1 };
          }
        }
      }
      if (Object.keys(newItems).length != 0) {
        data.items = newItems;
      } else {
        delete data.items;
      }
    }

    await writeFile(translatedPath, JSON.stringify(translated, null, 4));
  }
}
