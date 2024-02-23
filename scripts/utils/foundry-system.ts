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
    await Promise.all(
      manifest.packs.map(async (pack) => {
        const path = join(basePath, "json-assets", pack.path + ".json");
        const entries = JSON.parse(await readFile(path, "utf-8")) as Entry[];
        return { ...pack, entries } as const;
      })
    ),
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
