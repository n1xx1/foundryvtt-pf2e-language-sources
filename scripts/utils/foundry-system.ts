import { createWriteStream } from "fs";
import { readFile } from "fs/promises";
import fetch from "node-fetch";
import { join } from "path/posix";
import { Entry, FoundrySystemManifest } from "./foundry-types";

export async function readManifest(
  path: string
): Promise<FoundrySystemManifest> {
  const data = await readFile(path, "utf-8");
  return JSON.parse(data);
}

export async function downloadFile(url: string, path: string) {
  const resp = await fetch(url);
  const fileStream = createWriteStream(path);
  await new Promise((ful, rej) => {
    resp.body!.pipe(fileStream);
    resp.body!.on("error", rej);
    resp.body!.on("finish", ful);
  });
}

export async function readJsonStreamFile<T>(path: string) {
  return (await readFile(path, "utf-8"))
    .split("\n")
    .filter((x) => x)
    .map((p) => JSON.parse(p) as T);
}

export async function readSystemFiles(
  basePath: string,
  manifest: FoundrySystemManifest
) {
  return [
    (
      await Promise.all(
        manifest.packs.map(async (pack) => {
          if (!enabledPacks.includes(pack.name)) {
            return null;
          }
          const path = join(basePath, "static", pack.path);
          const entries = await readJsonStreamFile<Entry>(path);
          return { ...pack, entries } as const;
        })
      )
    ).filter((x): x is Exclude<typeof x, null> => !!x),
    (
      await Promise.all(
        manifest.languages.map(async (lang) => {
          if (lang.lang !== "en") {
            return null;
          }
          const path = join(basePath, "static", lang.path);
          const file = await readFile(path, "utf-8");
          return JSON.parse(file);
        })
      )
    ).filter((x): x is Exclude<typeof x, null> => !!x),
  ] as const;
}

export function parseJsonStream<T>(stream: Buffer) {
  return stream
    .toString("utf-8")
    .split("\n")
    .filter((x) => x)
    .map((p) => JSON.parse(p) as T);
}

const enabledPacks = [
  "abomination-vaults-bestiary",
  "age-of-ashes-bestiary",
  "agents-of-edgewatch-bestiary",
  // "april-fools-bestiary",
  "book-of-the-dead-bestiary",
  "blood-lords-bestiary",
  // "blog-bestiary",
  "extinction-curse-bestiary",
  "fall-of-plaguestone-bestiary",
  "fists-of-the-ruby-phoenix-bestiary",
  "hazards",
  "lost-omens-impossible-lands-bestiary",
  "lost-omens-mwangi-expanse-bestiary",
  "lost-omens-monsters-of-myth-bestiary",
  "lost-omens-travel-guide-bestiary",
  "malevolence-bestiary",
  "menace-under-otari-bestiary",
  "npc-gallery",
  "one-shot-bestiary",
  "outlaws-of-alkenstar-bestiary",
  "kingmaker-bestiary",
  "pathfinder-bestiary",
  "pathfinder-bestiary-2",
  "pathfinder-bestiary-3",
  "pathfinder-dark-archive",
  // "pfs-introductions-bestiary",
  // "pfs-season-1-bestiary",
  // "pfs-season-2-bestiary",
  // "pfs-season-3-bestiary",
  // "pfs-season-4-bestiary",
  "quest-for-the-frozen-flame-bestiary",
  "shadows-at-sundown-bestiary",
  "strength-of-thousands-bestiary",
  "the-slithering-bestiary",
  "troubles-in-otari-bestiary",
  "night-of-the-gray-death-bestiary",
  "crown-of-the-kobold-king-bestiary",
  "vehicles",
  "actionspf2e",
  "ancestries",
  "ancestryfeatures",
  "backgrounds",
  "classes",
  "classfeatures",
  "familiar-abilities",
  "feats-srd",
  "heritages",
  "spells-srd",
  "bestiary-effects",
  "domains",
  "boons-and-curses",
  "conditionitems",
  "campaign-effects",
  "equipment-effects",
  "other-effects",
  "feat-effects",
  // "pathfinder-society-boons",
  "spell-effects",
  "equipment-srd",
  "deities",
  // "iconics",
  // "paizo-pregens",
  "rollable-tables",
  // "criticaldeck",
  // "hero-point-deck",
  "journals",
  "gmg-srd",
  // "action-macros",
  // "pf2e-macros",
  "bestiary-ability-glossary-srd",
  "bestiary-family-ability-glossary",
  "adventure-specific-actions",
];
