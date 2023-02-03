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
    [
      "compendium-abomination-vaults-bestiary",
      "abomination-vaults-bestiary.db",
    ],
    // ["compendium-age-of-ashes-bestiary", "age-of-ashes-bestiary.db"],
    [
      "compendium-agents-of-edgewatch-bestiary",
      "agents-of-edgewatch-bestiary.db",
    ],
    ["compendium-bestiary", "pathfinder-bestiary.db"],
    ["compendium-bestiary-2", "pathfinder-bestiary-2.db"],
    ["compendium-bestiary-3", "pathfinder-bestiary-3.db"],
    ["compendium-feat-effects", "feat-effects.db"],
    ["compendium-spell-effects", "spell-effects.db"],
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

  for (const unit of res) {
    const match = unit.context.match(/^entries\.([^\.]*)\.(.*)$/);
    if (!match) continue;
    const [, name, part] = match;

    const origin: any = dataMap.get(name) ?? {};

    if (part.startsWith("items.")) {
      const itemMatch = part.match(/^items\.(.+)\.(name|description)$/)!;
      if (itemMatch) {
        const [, itemName] = itemMatch;
        const item =
          origin.items?.find((item: any) => item.name === itemName) ?? {};

        const itemSource: string =
          item.system?.source?.value ??
          item.system?.details?.source?.value ??
          "";

        if (itemSource) {
          await applySourceTag(itemSource, unit, weblate);
          continue;
        }
      }
    }

    console.log(name, origin);
    const source: string =
      origin.system?.source?.value ??
      origin.system?.details?.source?.value ??
      "";
    if (source) {
      await applySourceTag(source, unit, weblate);
    }
  }
}

async function applySourceTag(
  source: string,
  unit: WeblateUnit,
  weblate: WeblateApi
) {
  const tag = getRealTag(source);

  if (!tag) {
    console.log(`Unknown source: ${source} (item: ${name})`);
    return;
  }

  if (!unit.labels?.includes(tag)) {
    return;
  }

  try {
    await weblate.patch(`/units/${unit.id}/`, { labels: [tag] });
    console.log(`Set label ${tag} on ${unit.id} (${unit.context})`);
  } catch (e) {
    console.log(`Failed to set label ${tag} on ${unit.id} (${unit.context})`);
  }
}
