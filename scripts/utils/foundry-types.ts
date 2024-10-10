export interface FoundrySystemManifest {
  name: string;
  title: string;
  description: string;
  version: string;
  minimumCoreVersion: string;
  compatibleCoreVersion: string;
  author: string;
  esmodules: string[];
  scripts: string[];
  styles: string[];
  packs: {
    name: string;
    label: string;
    system: string;
    module?: string;
    path: string;
    type: "Actor" | "Item" | "JournalEntry" | "Macro" | "RollTable";
    private?: boolean;
    folder?: string;
  }[];
  languages: {
    lang: string;
    name: string;
    path: string;
  }[];
  socket: string;
  templateVersion: string | number;
  initiative: string;
  gridDistance: string;
  gridUnits: string | number;
  url: string;
  manifest: string;
  download: string;
}

export type Entry =
  | EntryHazard
  | EntryNPC
  | EntryItem
  | EntryJournalEntry
  | EntryRollTable;

export type EntryActor = EntryHazard | EntryNPC;

export interface BaseEntry {
  _id: string;
  name: string;
  flags?: Record<string, unknown>;
  _stats?: {
    compendiumSource?: string;
  };
}

export interface EntryHazard extends BaseEntry {
  type: "hazard";
  system: {
    details: {
      description: string;
      disable: string;
      reset: string;
      routine: string;
    };
    source: { value: string };
  };
}

export interface EntryNPC extends BaseEntry {
  type: "npc";
  items: EntryItem[];
  system: {
    details: {
      publicNotes: string;
      source: { value: string };
    };
    attributes: {
      ac: { details: string };
      allSaves: { value: string };
      hp: { details: string };
      speed: {
        details: string;
        otherSpeeds: { label: string; type: string }[];
      };
    };
    traits: {
      senses: { value: string } | EntryNPCSense[];
    };
    saves: {
      fortitude: { saveDetail: string }; // saveDetail doesn't seem to be used
      reflex: { saveDetail: string }; // saveDetail doesn't seem to be used
      will: { saveDetail: string }; // saveDetail doesn't seem to be used
    };
  };
}

export type EntryNPCSense = {
  type: string;
  acuity?: string;
  value?: string;
  source?: string;
};

export type EntryItem =
  | EntryItemGeneric
  | EntryItemSpell
  | EntryItemAncestry
  | EntryItemFeat;

export interface EntryItemGeneric extends BaseEntry {
  type: "action" | "condition" | "weapon" | "melee" | "ranged" | "lore";
  system: {
    description: {
      value: string;
    };
  };
}

export interface EntryItemAncestry extends BaseEntry {
  type: "ancestry";
  system: {
    description: {
      value: string;
    };
    speed: number;
  };
}

export interface EntryItemFeat extends BaseEntry {
  type: "feat";
  system: {
    description: { value: string };
    source: { value: string };
    prerequisites: { value: { value: string }[] };
  };
}

export interface EntryItemSpell extends BaseEntry {
  type: "spell";
  system: {
    description: { value: string };
    materials: { value: string };
    target: { value: string };
    range: { value: string };
    time: { value: string };
    duration: { value: string };
    cost: { value: string };
    area: { details: string };
    heightening?: SpellHeighteningFixed | SpellHeighteningInterval;
  };
}

export type SpellHeighteningFixed = {
  type: "fixed";
  levels: Record<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    Partial<EntryItemSpell["system"]>
  >;
};

export type SpellHeighteningInterval = {
  type: "interval";
  interval: number;
};

export interface EntryJournalEntry extends BaseEntry {
  content?: string;
  pages?: EntryJournalEntryPage[];
}

export interface EntryJournalEntryPage extends BaseEntry {
  type: string;
  text: {
    content: string;
  };
}

export interface EntryRollTable extends BaseEntry {
  description: string;
  results: EntryRollTableResult;
}

export interface EntryRollTableResult extends BaseEntry {
  text: string;
}

export interface EntryMacro extends BaseEntry {
  command: string;
}
