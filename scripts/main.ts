import { mkdir, writeFile } from "fs/promises";
import _ from "lodash";
import { join } from "path/posix";
import { readManifest, readSystemFiles } from "./foundry/system";
import { EntryActor, EntryItem, EntryJournalEntry } from "./foundry/types";

interface Compendium {
  label: string;
  mapping?: Record<string, string | { path: string; converter: string }>;
  entries: Record<string, any>;
}

const rangeRegex = /^(?:touch|planetary|[\d.,]+ (?:feet|miles?))$/;
const timeRegex = /^(?:1|2|3|reaction|free|[\d.,]+ (?:minutes?|days?|hours?))$/;

async function setupOut() {
  await mkdir("tmp", { recursive: true }).catch(() => Promise.resolve());
  await mkdir("lang/compendium", { recursive: true }).catch(() =>
    Promise.resolve()
  );
}

async function handleItem(id: string, label: string, entries: EntryItem[]) {
  const out: Compendium = {
    label,
    // mapping: {
    //   name: "name",
    //   description: "system.description.value",
    // },
    entries: {},
  };

  let hasFeats = false;
  let hasSpells = false;
  let hasAncestry = false;

  for (const entry of entries) {
    const el: any = (out.entries[entry.name] = {
      name: entry.name,
      description: entry.system.description.value,
    });

    if (entry.type === "spell") {
      hasSpells = true;

      if (entry.system.materials?.value) {
        el.spellMaterials = entry.system.materials?.value;
      }
      if (entry.system.target?.value) {
        el.spellTarget = entry.system.target?.value;
      }
      if (entry.system.cost?.value) {
        el.spellCost = entry.system.cost?.value;
      }
      if (entry.system.range?.value) {
        const val = entry.system.range?.value.toLowerCase();
        if (!val.match(rangeRegex)) {
          el.spellRange = entry.system.range?.value;
        }
      }
      if (entry.system.time?.value) {
        const val = entry.system.time?.value.toLowerCase();
        if (!val.match(timeRegex)) {
          el.spellTime = entry.system.time?.value;
        }
      }
    }
    if (entry.type === "ancestry") {
      hasAncestry = true;
    }
    if (entry.type === "feat") {
      hasFeats = true;
      const prerequisites = entry.system.prerequisites?.value ?? [];
      if (prerequisites.length > 0) {
        el.featPrerequisites = Object.fromEntries(
          entry.system.prerequisites.value.map((v, i) => [i, v.value])
        );
      }
    }
  }

  // if (hasAncestry) {
  //   out.mapping!.speed = {
  //     path: "system.speed",
  //     converter: "pfitLength",
  //   };
  //   out.mapping!.speed = {
  //     path: "system.reach",
  //     converter: "pfitLength",
  //   };
  // }
  // if (hasFeats) {
  //   out.mapping!.prerequisites = {
  //     path: "system.prerequisites.value",
  //     converter: "pfitArray",
  //   };
  // }
  // if (hasSpells) {
  //   out.mapping!.materials = "system.materials.value";
  //   out.mapping!.target = "system.target.value";
  //   out.mapping!.range = {
  //     path: "system.range.value",
  //     converter: "pfitRange",
  //   };
  //   out.mapping!.time = {
  //     path: "system.time.value",
  //     converter: "pfitTime",
  //   };
  // }

  const outData = JSON.stringify(out, null, 2);
  await writeFile(join("lang/compendium", id + ".json"), outData);
}

async function handleJournalEntry(
  id: string,
  name: string,
  entries: EntryJournalEntry[]
) {
  const out: Compendium = {
    label: name,
    entries: {},
  };
  for (const { name, content } of entries) {
    out.entries[name] = {
      name: name,
      description: content,
    };
  }

  const outData = JSON.stringify(out, null, 2);
  await writeFile(join("lang/compendium", id + ".json"), outData);
}

const itemTypes = [
  "ancestry",
  "heritage",
  "action",
  "armor",
  "attack",
  "backpack",
  "condition",
  "consumable",
  "effect",
  "equipment",
  "lore",
  "melee",
  "spell",
  "spellcastingEntry",
  "treasure",
  "weapon",
];
const ignoredItemTypes = [
  "ancestry",
  "heritage",
  "condition",
  "lore",
  "spellcastingEntry",
];

async function handleActor(
  id: string,
  label: string,
  entries: EntryActor[],
  itemEntries: Record<string, EntryItem[]>
) {
  const out: Compendium = {
    label,
    // mapping: {
    //   name: "name",
    //   items: {
    //     path: "items",
    //     converter: "fromPack",
    //   },
    //   tokenName: {
    //     path: "token.name",
    //     converter: "name",
    //   },
    // },
    entries: {},
  };

  let hasHazards = false;
  let hasMonsters = false;

  for (const entry of entries) {
    try {
      if (entry.type === "hazard") {
        hasHazards = true;
        const el: any = (out.entries[entry.name] = {
          name: label,
          description: entry.system.details.description,
        });

        if (entry.system.details.disable) {
          el.hazardDisable = entry.system.details.disable;
        }
        if (entry.system.details.reset) {
          el.hazardReset = entry.system.details.reset;
        }
        if (entry.system.details.routine) {
          el.hazardRoutine = entry.system.details.routine;
        }

        continue;
      }

      hasMonsters = true;

      const el: any = (out.entries[entry.name] = {
        name: entry.name,
        description: entry.system.details.publicNotes,
      });

      for (const item of entry.items) {
        try {
          if (!itemTypes.includes(item.type))
            throw new Error(`unknown item type: ${item.type}`);

          if (
            ignoredItemTypes.includes(item.type) ||
            (item.type == "spell" && !item.name.includes("("))
          )
            continue;

          const found =
            itemEntries[item.name.toLowerCase()]?.find(
              (x) =>
                (x.system.description.value &&
                  item.system.description.value.startsWith(
                    x.system.description.value
                  )) ||
                !x.system.description.value
            ) ?? null;

          if (!found) {
            el.items ??= {};
            const itemEl: any = (el.items[item.name] = {
              name: item.name,
            });

            if (item.system.description.value) {
              itemEl.description = item.system.description.value;
            }
          }
        } catch (e) {
          console.warn(`while parsing ${JSON.stringify(item, null, 2)}`);
          throw e;
        }
      }
    } catch (e) {
      console.warn(`while parsing ${entry._id}`);
      throw e;
    }
  }

  // if (hasHazards) {
  //   out.mapping!.hazardDescription = "system.details.description";
  //   out.mapping!.hazardDisable = "system.details.disable";
  //   out.mapping!.hazardReset = "system.details.reset";
  //   out.mapping!.hazardRoutine = "system.details.routine";
  // }
  // if (hasMonsters) {
  //   out.mapping!.description = "system.details.publicNotes";
  //   out.mapping!.speed = {
  //     path: "system.attributes.speed",
  //     converter: "pfitSpeeds",
  //   };
  // }

  const outData = JSON.stringify(out, null, 2);
  await writeFile(join("lang/compendium", id + ".json"), outData);
}

async function main() {
  await setupOut();
  const manifest = await readManifest("../system/system.json");
  const [allPacks, allLangs] = await readSystemFiles("../system", manifest);

  const langData = _.merge({}, ...allLangs);
  await writeFile("lang/en.json", JSON.stringify(langData, null, 2));

  const itemEntries = _.groupBy(
    allPacks
      .filter((x) => x.type == "Item")
      .flatMap((x) => x.entries as EntryItem[]),
    (x) => x.name.toLowerCase()
  );

  for (const pack of allPacks) {
    try {
      if (pack.type === "Actor") {
        await handleActor(
          pack.name,
          pack.label,
          pack.entries as EntryActor[],
          itemEntries
        );
      } else if (pack.type === "Item") {
        await handleItem(pack.name, pack.label, pack.entries as EntryItem[]);
      } else if (pack.type === "JournalEntry") {
        await handleJournalEntry(
          pack.name,
          pack.label,
          pack.entries as EntryJournalEntry[]
        );
      } else {
        throw new Error(`not implemented: ${pack.type}`);
      }
    } catch (e) {
      console.warn(`while parsing ${pack.name}`);
      throw e;
    }
  }
}

main().then(console.log);
