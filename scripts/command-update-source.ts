import { join } from "path";
import { readManifest, readSystemFiles } from "./utils/foundry-system";
import { EntryHazard, EntryItem, EntryNPC } from "./utils/foundry-types";
import { getRealTag } from "./utils/pf2-sources-data";
import {
  createWeblateApi,
  WeblateApi,
  WeblateError,
  WeblateLabel,
  WeblateUnit,
} from "./utils/weblate-api";
import _ from "lodash";

type EntriesWithSource = (EntryHazard | EntryNPC | EntryItem)[];

interface LangFile {
  [id: string]: string | LangFile;
}

const weblateCompendiumMap: Record<string, string | undefined> = {
  actions: "compendium-actions",
  ancestries: "compendium-ancestries",
  ancestryfeatures: "compendium-ancestryfeatures",
  backgrounds: "compendium-backgrounds",
  deities: "compendium-deities",
  classes: "compendium-classes",
  classfeatures: "compendium-class-features",
  heritages: "compendium-heritages",
  spells: "compendium-spells",
  feats: "compendium-feats",
  equipment: "compendium-equipment",
  "abomination-vaults-bestiary": "compendium-abomination-vaults-bestiary",
  "agents-of-edgewatch-bestiary": "compendium-agents-of-edgewatch-bestiary",
  "fall-of-plaguestone": "compendium-fall-of-plaguestone-bestiary",
  "pathfinder-bestiary": "compendium-bestiary",
  "pathfinder-bestiary-2": "compendium-bestiary-2",
  "pathfinder-bestiary-3": "compendium-bestiary-3",
  "feat-effects": "compendium-feat-effects",
  "spell-effects": "compendium-spell-effects",
  "bestiary-ability-glossary-srd": "compendium-bestiary-ability-glossary",
};

export async function commandUpdateSource(
  systemDir: string,
  weblateToken: string,
  dry: boolean,
  filter: string[]
) {
  const weblate = createWeblateApi(
    weblateToken,
    "https://weblate.n1xx1.me/api"
  );

  const manifest = await readManifest(join(systemDir, "static", "system.json"));
  const [allPacks, allLangs] = await readSystemFiles(systemDir, manifest);

  const langData: LangFile = _.merge({}, ...allLangs);

  const labels = await weblate.getAll<WeblateLabel>(
    `/projects/foundryvtt-pathfinder-2e/labels/`,
    { page_size: 500 }
  );

  const labelsMap = new Map(labels.map((l) => [l.name, l.id]));

  const langKeys = getObjectKeys(langData).filter((x) => x.match(/^PF2E\..*$/));
  const langKeysRegex = new RegExp(
    "(" +
      langKeys.map((k) => k.replace(".", "\\.")).join("|") +
      ")([^a-zA-Z0-9\\.]|$)",
    "g"
  );
  const langKeysMap = new Map(
    langKeys.map((k) => [
      k,
      { used: [] as string[], sources: new Set<string>() },
    ])
  );

  const c: UpdateSourceContext = {
    weblate: weblate,
    dry,
    labelsMap,
    langKeysMap,
    langKeysRegex,
  };

  console.log(`Processing packs`);
  for (const pack of allPacks) {
    const fileName = pack.path.replace("packs/", "");
    const compendiumName = weblateCompendiumMap[fileName];

    await translateSource(
      compendiumName,
      fileName,
      pack.entries as EntriesWithSource,
      c
    );
  }

  console.log(`Processing Lang`);
  await translateLang(c);
}

type UpdateSourceContext = {
  weblate: WeblateApi;
  dry: boolean;
  labelsMap: Map<string, number>;
  langKeysRegex: RegExp;
  langKeysMap: Map<
    string,
    {
      used: string[];
      sources: Set<string>;
    }
  >;
};

async function translateLang(c: UpdateSourceContext) {
  const res = await c.weblate.getAll<WeblateUnit>(
    `/translations/foundryvtt-pathfinder-2e/lang/en/units/`,
    { page_size: 500 }
  );

  for (const unit of res) {
    let ctx = unit.context;
    const langInfo = c.langKeysMap.get(ctx);
    if (!langInfo) continue;

    const tags = [...langInfo.sources.values()];

    if (tags.length === 0) {
      continue;
    }

    const tagIds = tags
      .map((tag) => c.labelsMap.get(tag))
      .filter((x): x is number => !!x)
      .sort();
    const oldTagIds = unit.labels?.map((x) => x.id).sort();

    const explaination = `Used by: ${langInfo.used.join(", ")}`;

    if (_.isEqual(tagIds, oldTagIds) && unit.explanation === explaination) {
      continue;
    }

    try {
      if (!c.dry) {
        await c.weblate.patch(`/units/${unit.id}/`, {
          explanation: explaination,
          labels: tagIds,
        });
      }
      console.log(
        `Set explaination = "${explaination}", labels = "${tags.join(",")}" on ${unit.id} (${unit.context})`
      );
    } catch (e) {
      console.log(
        `Failed to set explaination = "${explaination}", labels = "${tags.join(", ")}" on ${unit.id} (${unit.context})`
      );
    }
  }
}

async function translateSource(
  weblateName: string | undefined,
  packName: string,
  data: EntriesWithSource,
  c: UpdateSourceContext
) {
  console.log(`Processing pack ${packName}`);

  const dataMap = new Map(data.map((f) => [f.name, f]));

  for (const entry of data) {
    const origin: any = entry;
    const source: string =
      origin.system?.publication?.title ??
      origin.system?.details?.publication?.title ??
      origin.system?.source?.value ??
      origin.system?.details?.source?.value ??
      "";

    const tag = getRealTag(source);

    if (!tag && source) {
      console.log(`Unknown source: ${source} (item: ${entry.name})`);
      throw "stop";
    }
    if (!tag) {
      continue;
    }

    for (const match of JSON.stringify(entry).matchAll(c.langKeysRegex)) {
      c.langKeysMap.get(match[1])!.used.push(entry.name);
      if (tag) {
        c.langKeysMap.get(match[1])!.sources.add(tag);
      }
    }
  }

  if (!weblateName) {
    return;
  }

  console.log(`Updating component ${weblateName}`);

  const res = await c.weblate.getAll<WeblateUnit>(
    `/translations/foundryvtt-pathfinder-2e/${weblateName}/en/units/`,
    { q: "NOT has:label", page_size: 500 }
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
      await applySourceTag(source, unit, name, c);
    }
  }
}

async function applySourceTag(
  source: string,
  unit: WeblateUnit,
  name: string,
  c: UpdateSourceContext
) {
  const tag = getRealTag(source);

  if (!tag) {
    console.log(`Unknown source: ${source} (item: ${name})`);
    throw "stop";
  }

  const tagId = c.labelsMap.get(tag);
  if (!tagId) {
    console.log(`Label not found: ${source} (item: ${name})`);
    throw "stop";
  }

  if (unit.labels?.some((l) => l.id === tagId)) {
    return;
  }

  try {
    if (!c.dry) {
      await c.weblate.patch(`/units/${unit.id}/`, { labels: [tagId] });
    }
    console.log(`Set label ${tag} on ${unit.id} (${unit.context})`);
  } catch (e) {
    console.log(`Failed to set label ${tag} on ${unit.id} (${unit.context})`);
  }
}

function getObjectKeys(lang: LangFile, path?: string): string[] {
  return Object.entries(lang).flatMap(([k, v]) => {
    const key = path ? `${path}.${k}` : k;
    if (typeof v === "string") {
      return key;
    }
    return getObjectKeys(v, key);
  });
}

function walkObjectLeaves(
  o: any,
  fn: (k: string | number | undefined, v: any) => void,
  k?: string | number
) {
  if (Array.isArray(o)) {
    for (const [k, v] of o.entries()) {
      walkObjectLeaves(v, fn, k);
    }
    return;
  }
  if (o && typeof o === "object") {
    for (const [k, v] of Object.entries(o)) {
      walkObjectLeaves(v, fn, k);
    }
    return;
  }
  fn(k, o);
}
