import { join } from "path";
import { readManifest, readSystemFiles } from "./utils/foundry-system";
import { EntryHazard, EntryItem, EntryNPC } from "./utils/foundry-types";
import { getRealTag } from "./utils/pf2-sources-data";
import {
  createWeblateApi,
  WeblateApi,
  WeblateLabel,
  WeblateUnit,
} from "./utils/weblate-api";

type EntriesWithSource = (EntryHazard | EntryNPC | EntryItem)[];

export async function commandUpdateSource(
  systemDir: string,
  weblateToken: string,
  dry: boolean,
  filter: string[]
) {
  const api = createWeblateApi(weblateToken, "https://weblate.n1xx1.me/api");

  const manifest = await readManifest(join(systemDir, "static", "system.json"));
  const [allPacks] = await readSystemFiles(systemDir, manifest);

  const toTranslate: [name: string, pack: string][] = [
    ["compendium-actions", "actions"],
    ["compendium-ancestries", "ancestries"],
    ["compendium-ancestryfeatures", "ancestryfeatures"],
    ["compendium-backgrounds", "backgrounds"],
    // ["compendium-deities", "deities"],
    ["compendium-classes", "classes"],
    ["compendium-class-features", "classfeatures"],
    ["compendium-heritages", "heritages"],
    ["compendium-spells", "spells"],
    ["compendium-feats", "feats"],
    ["compendium-equipment", "equipment"],
    // [
    //   "compendium-abomination-vaults-bestiary",
    //   "abomination-vaults-bestiary",
    // ],
    // // ["compendium-age-of-ashes-bestiary", "age-of-ashes-bestiary"],
    // [
    //   "compendium-agents-of-edgewatch-bestiary",
    //   "agents-of-edgewatch-bestiary",
    // ],
    // ["compendium-bestiary", "pathfinder-bestiary"],
    // ["compendium-bestiary-2", "pathfinder-bestiary-2"],
    // ["compendium-bestiary-3", "pathfinder-bestiary-3"],
    ["compendium-feat-effects", "feat-effects"],
    ["compendium-spell-effects", "spell-effects"],
  ];

  const labels = await api.getAll<WeblateLabel>(
    `/projects/foundryvtt-pathfinder-2e/labels/`,
    { page_size: 500 }
  );

  const labelsMap = new Map(labels.map((l) => [l.name, l.id]));

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
      api,
      labelsMap,
      dry
    );
  }
}

async function translateSource(
  weblateName: string,
  packName: string,
  data: EntriesWithSource,
  weblate: WeblateApi,
  labelsMap: Map<string, number>,
  dry: boolean
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
    let ctx = unit.context;
    ctx = ctx.replace(/Vs\./g, "Vs_");
    const match = ctx.match(/^entries\.([^\.]*)\.(.*)$/);
    if (!match) continue;
    let [, name, part] = match;

    name = name.replace(/Vs_/g, "Vs.");

    const origin: any = dataMap.get(name) ?? {};

    if (!origin) {
      console.log(`not found: ${name}`);
    }

    // if (part.startsWith("items.")) {
    //   const itemMatch = part.match(/^items\.([^\.])+\.(.*)$/)!;
    //   if (itemMatch) {
    //     const [, itemId, field] = itemMatch;
    //     const item =
    //       origin.items?.find((item: any) => item._id === itemId) ?? {};

    //     const itemSource: string =
    //       item.system?.source?.value ??
    //       item.system?.details?.source?.value ??
    //       "";

    //     if (itemSource) {
    //       await applySourceTag(itemSource, unit, weblate, dry);
    //       continue;
    //     }
    //   }
    // }

    // console.log(name, origin);

    const source: string =
      origin.system?.publication?.title ??
      origin.system?.source?.value ??
      origin.system?.details?.source?.value ??
      "";

    const isRemaster: boolean = origin.system?.publication?.remaster ?? false;

    if (source) {
      await applySourceTag(source, unit, name, weblate, labelsMap, dry);
    }
  }
}

async function applySourceTag(
  source: string,
  unit: WeblateUnit,
  name: string,
  weblate: WeblateApi,
  labelsMap: Map<string, number>,
  dry: boolean
) {
  const tag = getRealTag(source);

  if (!tag) {
    console.log(`Unknown source: ${source} (item: ${name})`);
    throw "stop";
  }

  const tagId = labelsMap.get(tag);
  if (!tagId) {
    console.log(`Label not found: ${source} (item: ${name})`);
    throw "stop";
  }

  if (unit.labels?.some((l) => l.id === tagId)) {
    return;
  }

  try {
    if (!dry) {
      await weblate.patch(`/units/${unit.id}/`, { labels: [tagId] });
    }
    console.log(`Set label ${tag} on ${unit.id} (${unit.context})`);
  } catch (e) {
    console.log(`Failed to set label ${tag} on ${unit.id} (${unit.context})`);
  }
}
