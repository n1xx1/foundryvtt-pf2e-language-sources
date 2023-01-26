import {
  get,
  groupBy,
  isArray,
  isPlainObject,
  mapValues,
  orderBy,
} from "lodash";
import { join } from "path";
import { readFileJson } from "./utils";

export async function commandFindMostCommon(lang: string, compendium: string) {
  const original = await readFileJson<Record<string, unknown>>(
    join("lang", "compendium", `${compendium}.json`)
  );
  const translated = await readFileJson<Record<string, unknown>>(
    join("trad", lang, "compendium", `${compendium}.json`)
  );

  const untranslated = filterDeep(
    translated,
    (key, v) => get(original, key) === v
  );

  const res: any = {};
  walkObject(untranslated, (path, v) => {
    res[path] = v;
  });
  const grouped = mapValues(
    groupBy(Object.entries(res), ([k, v]) => v),
    (values) => values.length
  );
  const ordered = orderBy(
    Object.entries(grouped).filter((x) => x[1] > 2),
    (x) => x[1],
    "desc"
  );
  for (const [k, v] of ordered.slice(0, 15)) {
    console.log(`: "${k}"`);
  }
}

function walkObject(
  o: Record<string, unknown>,
  cb: (path: string, v: unknown, k: string) => void
) {
  walker(o, null);

  function walker(o: Record<string, unknown>, path: string | null) {
    for (const [k, v] of Object.entries(o)) {
      const newPath = path ? `${path}.${k}` : k;
      if (isPlainObject(v)) {
        walker(v as any, newPath);
        continue;
      }
      cb(newPath, v, k);
    }
  }
}

function filterDeep(
  item: Record<string, unknown>,
  predicate: (key: string, value: unknown, lastKey: string) => boolean
) {
  const res: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(item)) {
    const newPath = k;
    if (isPlainObject(v)) {
      const deep = filterDeepRecursive(newPath, v as any, predicate);
      if (Object.keys(deep).length !== 0) {
        res[k] = deep;
      }
      continue;
    }
    if (!predicate(newPath, v, k)) {
      continue;
    }
    res[k] = v;
  }
  return res;
}

function filterDeepRecursive(
  path: string,
  item: Record<string, unknown>,
  predicate: (key: string, value: unknown, lastKey: string) => boolean
) {
  const res: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(item)) {
    const newPath = `${path}.${k}`;
    if (isPlainObject(v)) {
      const deep = filterDeepRecursive(newPath, v as any, predicate);
      if (Object.keys(deep).length !== 0) {
        res[k] = deep;
      }
      continue;
    }
    if (!predicate(newPath, v, k)) {
      continue;
    }
    res[k] = v;
  }
  return res;
}
