import { join } from "path";
import { readManifest, readSystemFiles } from "./utils/foundry-system";
import { EntryHazard, EntryItem, EntryNPC } from "./utils/foundry-types";
import { getRealTag } from "./utils/pf2-sources-data";
import { createWeblateApi, WeblateApi, WeblateUnit } from "./utils/weblate-api";

type EntriesWithSource = (EntryHazard | EntryNPC | EntryItem)[];

export async function commandUpdateSource(
  systemDir: string,
  weblateToken: string,
  filter: string[]
) {
  const api = createWeblateApi(weblateToken, "https://weblate.n1xx1.me/api");

  const manifest = await readManifest(join(systemDir, "system.json"));
  const [allPacks] = await readSystemFiles(systemDir, manifest);

  const toTranslate: [name: string, pack: string][] = [
    ["compendium-actions", "actions.db"],
    ["compendium-ancestries", "ancestries.db"],
    ["compendium-ancestryfeatures", "ancestryfeatures.db"],
    ["compendium-backgrounds", "backgrounds.db"],
    ["compendium-deities", "deities.db"],
    ["compendium-classes", "classes.db"],
    ["compendium-class-features", "classfeatures.db"],
    ["compendium-heritages", "heritages.db"],
    ["compendium-spells", "spells.db"],
    ["compendium-feats", "feats.db"],
    ["compendium-equipment", "equipment.db"],
  ];

  for (const [name, packName] of toTranslate) {
    const path = `packs/${packName}`;
    const pack = allPacks.find((x) => path === x.path);
    if (!pack) {
      throw new Error(`pack not found: ${packName}`);
    }
    await translateSource(
      name,
      packName,
      pack.entries as EntriesWithSource,
      api
    );
  }
}

async function translateSource(
  weblateName: string,
  packName: string,
  data: EntriesWithSource,
  weblate: WeblateApi
) {
  console.log(`Processing pack ${packName} into component ${weblateName}`);

  const dataMap = new Map(data.map((f) => [f.name, f]));

  const res = await weblate.getAll<WeblateUnit>(
    `/translations/foundryvtt-pathfinder-2e/${weblateName}/en/units/`,
    {
      q: "NOT has:label",
      page_size: 500,
    }
  );

  for (const u of res) {
    const match = u.context.match(/^entries\.([^\.]*)\..*$/);
    if (!match) continue;
    const [, name] = match;

    const id = u.id;
    const origin: any = dataMap.get(name)?.system ?? {};
    const source: string =
      origin.source?.value ?? origin?.details?.source?.value ?? "";
    const tag = getRealTag(source);

    if (!tag) {
      if (source) {
        console.log(`Unknown source: ${source} (item: ${name})`);
      }
      continue;
    }
    if (u.labels?.includes(tag)) {
      continue;
    }
    try {
      await weblate.patch(`/units/${id}/`, { labels: [tag] });
      console.log(`Set label ${tag} on ${id} (${u.context})`);
    } catch (e) {
      console.log(`Failed to set label ${tag} on ${id} (${u.context})`);
    }
  }
}
