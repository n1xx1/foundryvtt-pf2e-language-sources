import { createWriteStream } from "fs";
import { readFile } from "fs/promises";
import fetch from "node-fetch";
import { join } from "path/posix";
import { Open as unzipperOpen } from "unzipper";
import { Entry, FoundrySystemManifest } from "./types";

const manifestUrl =
  "https://github.com/foundryvtt/pf2e/releases/download/latest/system.json";

const systemZip =
  "https://github.com/foundryvtt/pf2e/archive/refs/heads/master.zip";

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
  "actionspf2e",
  "age-of-ashes-bestiary",
  "agents-of-edgewatch-bestiary",
  "ancestries",
  "ancestryfeatures",
  "archetypes",
  "backgrounds",
  "bestiary-ability-glossary-srd",
  "bestiary-effects",
  "bestiary-family-ability-glossary",
  "boons-and-curses",
  "classes",
  "classfeatures",
  "conditionitems",
  "consumable-effects",
  "deities",
  "domains",
  "equipment-effects",
  "equipment-srd",
  "fall-of-plaguestone-bestiary",
  "familiar-abilities",
  "feat-effects",
  "feats-srd",
  "feature-effects",
  "gmg-srd",
  "hazards",
  "heritages",
  "npc-gallery",
  "pathfinder-bestiary-2",
  "pathfinder-bestiary",
  "spell-effects",
  "spells-srd",
  "vehicles",
];
