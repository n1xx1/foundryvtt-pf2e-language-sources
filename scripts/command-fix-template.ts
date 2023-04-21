import { writeFile } from "fs/promises";
import path from "path";
import { readFileJson } from "./utils";

export async function commandFixTemplate(
  lang: string,
  name: string,
  systemDir: string
) {
  const translatedPath = path.join("trad", lang, "compendium", `${name}.json`);

  let translated = await readFileJson<Record<string, unknown>>(translatedPath);

  function convertTemplate(tpl: string) {
    return tpl.replace(/@Template\[(.*?)\]/g, (all, content: string) => {
      const parts = content.split(/\|/g);

      content = parts
        .map((p) => {
          if (p.startsWith("distance:")) {
            const distance = +p.substring("distance:".length);
            return `distance:${(distance / 1.5) * 5}`;
          }
          if (p.startsWith("width:")) {
            const width = +p.substring("width:".length);
            return `width:${(width / 1.5) * 5}`;
          }
          return p;
        })
        .join("|");
      return `@Template[${content}]`;
    });
  }

  function mapTranslation(v: any) {
    if (typeof v === "string") {
      return convertTemplate(v);
    }
    if (Array.isArray(v)) {
      for (let i = 0; i < v.length; i++) {
        v[i] = mapTranslation(v[i]);
      }
    } else if (typeof v === "object") {
      for (const [k, v1] of Object.entries(v)) {
        v[k] = mapTranslation(v1);
      }
    }
    return v;
  }

  translated = mapTranslation(translated);

  await writeFile(translatedPath, JSON.stringify(translated, null, 4));
}
