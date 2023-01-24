import { sourceState } from "./utils/pf2-sources-data";

export async function commandWeblateQuery(queryFilter: string[], lang: string) {
  const translated1 = Object.entries(sourceState)
    .filter(([k, v]) => v.language.includes(lang))
    .map(([k, v]) => `label:"${k}"`)
    .join(` OR `);

  const translated2 = Object.entries(sourceState)
    .filter(([k, v]) => !v.language.includes(lang))
    .map(([k, v]) => `(NOT label:"${k}")`)
    .join(` AND `);

  const queries: [string, string][] = [
    ["untranslated-v1", `state:<translated AND (${translated1})`],
    ["untranslated-v2", `state:<translated AND ${translated2}`],
  ];

  for (const [key, query] of queries) {
    console.log(`QUERY ${key}:`);
    console.log(query);
    console.log();
  }
}
