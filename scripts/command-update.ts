import { mkdir, writeFile } from "fs/promises";
import _ from "lodash";
import path from "path";
import { join } from "path/posix";
import { readManifest, readSystemFiles } from "./utils/foundry-system";
import {
  EntryActor,
  EntryItem,
  EntryItemSpell,
  EntryJournalEntry,
} from "./utils/foundry-types";

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

function fixEntities(x: string) {
  return x.replace(/\u001e/g, " ");
}

async function handleItem(id: string, label: string, entries: EntryItem[]) {
  const out: Compendium = {
    label,
    entries: {},
  };

  for (const entry of entries) {
    const el: any = (out.entries[entry.name] = {
      name: entry.name,
      description: fixEntities(entry.system.description.value),
    });

    if (entry.type === "spell") {
      Object.assign(el, mapSpellData(entry.system) ?? {});

      if (entry.system.heightening?.type === "fixed") {
        for (const [level, overrides] of Object.entries(
          entry.system.heightening.levels
        )) {
          const el1 = mapSpellData(overrides);
          if (el1) {
            (el.spellHeightening ??= {})[`${level}`] = el1;
          }
        }
      }
    }
    if (entry.type === "feat") {
      const prerequisites = entry.system.prerequisites?.value ?? [];
      if (prerequisites.length > 0) {
        el.featPrerequisites = Object.fromEntries(
          entry.system.prerequisites.value.map((v, i) => [i, v.value])
        );
      }
    }
  }

  const outData = JSON.stringify(out, null, 2);
  await writeFile(join("lang/compendium", id + ".json"), outData);
}

function mapSpellData(system: Partial<EntryItemSpell["system"]>) {
  let el: any = null;
  if (system.materials?.value) {
    (el ??= {}).spellMaterials = system.materials?.value;
  }
  if (system.target?.value) {
    (el ??= {}).spellTarget = system.target?.value;
  }
  if (system.cost?.value) {
    (el ??= {}).spellCost = system.cost?.value;
  }
  if (system.range?.value) {
    const val = system.range?.value.toLowerCase();
    if (!val.match(rangeRegex)) {
      (el ??= {}).spellRange = system.range?.value;
    }
  }
  if (system.time?.value) {
    const val = system.time?.value.toLowerCase();
    if (!val.match(timeRegex)) {
      (el ??= {}).spellTime = system.time?.value;
    }
  }
  if (system.area?.details) {
    (el ??= {}).spellArea = system.area.details;
  }
  return el;
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

  for (const { name, content, pages } of entries) {
    const el: any = (out.entries[name] = {
      name: name,
    });

    if (content) {
      el.description = content;
    }
    if (pages) {
      el.pages = Object.fromEntries(
        pages
          .filter((p) => p.type === "text")
          .map((p) => [
            p.name,
            {
              name: p.name,
              text: p.text.content,
            },
          ])
      );
    }
  }

  const outData = JSON.stringify(out, null, 2);
  await writeFile(join("lang/compendium", id + ".json"), outData);
}

const itemTypes = [
  "action",
  "ancestry",
  "armor",
  "attack",
  "backpack",
  "background",
  "class",
  "condition",
  "consumable",
  "deity",
  "effect",
  "equipment",
  "feat",
  "heritage",
  "lore",
  "melee",
  "spell",
  "spellcastingEntry",
  "treasure",
  "weapon",
];
const ignoredItemTypes = [
  "ancestry",
  "background",
  "class",
  "condition",
  "deity",
  "feat",
  "heritage",
  "spellcastingEntry",
];
const ignoredDescriptionItemTypes = ["spell", "melee", "ranged"];
const attackType = ["melee", "ranged"];
const skillNames = [
  "acrobatics",
  "arcana",
  "athletics",
  "crafting",
  "deception",
  "diplomacy",
  "intimidation",
  "medicine",
  "nature",
  "occultism",
  "performance",
  "religion",
  "society",
  "stealth",
  "survival",
  "thievery",
];

async function handleActor(
  id: string,
  label: string,
  entries: EntryActor[],
  allPacksMap: Map<string, PackData>
) {
  const out: Compendium = {
    label,
    entries: {},
  };

  for (const entry of entries) {
    try {
      if (entry.type === "hazard") {
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

      const el: any = (out.entries[entry.name] = {
        name: entry.name,
        description: entry.system.details.publicNotes,
      });

      if (entry.type === "npc") {
        if (entry.system.attributes.ac.details) {
          el.npcAc = entry.system.attributes.ac.details;
        }
        if (entry.system.attributes.allSaves.value) {
          el.npcAllSaves = entry.system.attributes.allSaves.value;
        }
        if (entry.system.attributes.hp.details) {
          el.npcHp = entry.system.attributes.hp.details;
        }
        if (entry.system.attributes.speed.details) {
          el.npcSpeed = entry.system.attributes.speed.details;
        }
        if (
          entry.system.traits?.senses &&
          "value" in entry.system.traits?.senses
        ) {
          el.npcSenses = entry.system.traits.senses.value;
        }
        for (const speed of entry.system.attributes.speed.otherSpeeds) {
          if (speed.label) {
            (el.npcOtherSpeeds ??= {})[speed.type] = speed.label;
          }
        }
      }

      for (const item of entry.items) {
        try {
          if (!itemTypes.includes(item.type)) {
            throw new Error(`unknown item type: ${item.type}`);
          }

          if (isIgnoredItem(item)) {
            continue;
          }

          const [compendiumItem, compendiumId, origin] = findItemInCompendium(
            item,
            allPacksMap
          );

          if (!compendiumItem) {
            el.items ??= {};
            const itemEl: any = (el.items[item.name] = {
              name: item.name,
            });
            if (item.system.description.value) {
              itemEl.description = item.system.description.value;
            }
            continue;
          }

          const sameName = compendiumItem.name === item.name;
          const sameDesc =
            !item.system.description.value ||
            compendiumItem.system.description.value ===
              item.system.description.value ||
            ignoredDescriptionItemTypes.includes(item.type);

          if (sameName && sameDesc && origin !== "matching") {
            continue;
          }

          const itemEl: any = ((el.items ??= {})[item.name] = {});
          if (!sameName) {
            itemEl.name = item.name;
          }
          if (!sameDesc && item.system.description.value) {
            itemEl.description = item.system.description.value;
          }
          if (origin === "matching") {
            itemEl._source = compendiumId;
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

  const outData = JSON.stringify(out, null, 2);
  await writeFile(join("lang/compendium", id + ".json"), outData);
}

type PackData = Awaited<ReturnType<typeof readSystemFiles>>[0][number];

function isIgnoredItem(item: EntryItem) {
  if (ignoredItemTypes.includes(item.type)) {
    return true;
  }

  if (item.type === "lore" && skillNames.includes(item.name.toLowerCase())) {
    return true;
  }

  return false;
}

export function findItemInCompendium(
  item: EntryItem,
  allPacksMap: Map<string, PackData>
): [EntryItem | null, string, string] {
  const sourceId: string | undefined = (item.flags?.core as any)?.sourceId;

  const [matchingItem, pack, only] = findByMatchingItem(item, allPacksMap);
  if (sourceId) {
    const [sourceItem, compendiumId] = findBySourceId(sourceId, allPacksMap);
    // if the real source is correct then just respect the source
    if (sourceItem && (!matchingItem || sourceItem._id === matchingItem._id)) {
      return [sourceItem, compendiumId, "source"];
    }
  }
  if (matchingItem) {
    return [matchingItem, pack, "matching"];
  }
  if (attackType.includes(item.type)) {
    const equipItem = findByName(item.name, allPacksMap.get("equipment-srd")!);
    if (equipItem) {
      return [equipItem, `equipment-srd.${equipItem._id}`, "equip"];
    }
  }
  return [null, "", ""];
}

function findBySourceId(
  sourceId: string,
  allPacksMap: Map<string, PackData>
): [item: EntryItem | null, compendiumId: string] {
  const match = sourceId.match(
    /^Compendium\.pf2e\.([^\.]+).([^\.]+)(?:\.Item\.([^\.]+))?$/
  );
  if (!match) {
    return [null, ""];
  }

  const origin = sourceId.substring("Compendium.pf2e.".length);
  const [_, pack, id, itemId] = match;

  let sourceItem =
    (allPacksMap.get(pack)?.entries.find((x) => x._id === id) as EntryItem) ??
    null;

  if (!sourceItem || !itemId) {
    return [sourceItem, origin];
  }

  return [
    ((sourceItem.system as any).items as EntryItem[])?.find(
      (x) => x._id === itemId
    ) ?? null,
    origin,
  ];
}

function findByMatchingItem(
  item: EntryItem,
  allPacksMap: Map<string, PackData>
): [item: EntryItem | null, pack: string, only: boolean] {
  const founds: (EntryItem & { _pack: string })[] = [];
  for (const p of allPacksMap.values()) {
    if (p.type !== "Item") {
      continue;
    }
    founds.push(
      ...(p.entries as EntryItem[])
        .filter((entry) => entry.name === item.name)
        .map((entry) => ({ ...entry, _pack: p.name }))
    );
  }
  if (
    founds.length === 1 &&
    founds[0].type === item.type &&
    founds[0].system.description.value === item.system.description.value
  ) {
    return [founds[0], `${founds[0]._pack}.${founds[0]._id}`, true];
  }

  const found = founds.find(
    (entry) =>
      entry.type === item.type &&
      entry.system.description.value === item.system.description.value
  );
  if (found) {
    return [found, `${found._pack}.${found._id}`, false];
  }
  return [null, "", false];
}

function findByName(
  name: string,
  allPacksMap: Map<string, PackData> | PackData
) {
  const iterator =
    allPacksMap instanceof Map ? allPacksMap.values() : [allPacksMap];
  for (const p of iterator) {
    if (p.type !== "Item") {
      continue;
    }
    const found = (p.entries as EntryItem[]).find(
      (entry) => entry.name === name
    );
    if (found) {
      return found;
    }
  }
  return null;
}

export async function commandUpdate(systemDir = "../system") {
  await setupOut();
  const manifest = await readManifest(path.join(systemDir, "system.json"));
  const [allPacks, allLangs] = await readSystemFiles(systemDir, manifest);

  const langData = _.merge({}, ...allLangs);
  await writeFile("lang/en.json", JSON.stringify(langData, null, 2));

  const allPacksMap = new Map<string, PackData>(
    allPacks.map((p) => [p.name, p])
  );

  for (const pack of allPacks) {
    try {
      if (pack.type === "Actor") {
        await handleActor(
          pack.name,
          pack.label,
          pack.entries as EntryActor[],
          allPacksMap
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
