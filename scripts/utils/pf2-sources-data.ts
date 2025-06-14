export function getRealTag(source: string) {
  for (const { regex, tag } of sourceRegexList) {
    if (source.match(regex)) {
      return tag;
    }
  }
  return null;
}

type SourceState = {
  name: string;
  type:
    | "core"
    | "lost-omens"
    | "adventure-path"
    | "adventure"
    | "other"
    | "core-remaster";
  source: (string | RegExp)[];
  language: string[];
  compendiums?: string[];
};

export const sourceState: Record<string, SourceState> = {
  // Core
  "core-rulebook": {
    name: "Core Rulebook",
    type: "core",
    source: ["Core Rulebook", "Pathfinder Core Rulebook"],
    language: ["it"],
  },
  bestiary1: {
    name: "Bestiary",
    type: "core",
    source: ["Bestiary", "Pathfinder Bestiary"],
    language: ["it"],
  },
  "gamemastery-guide": {
    name: "Gamemastery Guide",
    type: "core",
    source: ["Gamemastery Guide", "Pathfinder Gamemastery Guide"],
    language: ["it"],
  },
  bestiary2: {
    name: "Bestiary 2",
    type: "core",
    source: ["Bestiary 2", "Pathfinder Bestiary 2"],
    language: ["it"],
  },
  "advanced-players-guide": {
    name: "Advanced Player's Guide",
    type: "core",
    source: ["Advanced Player's Guide", "Pathfinder Advanced Player's Guide"],
    language: ["it"],
  },
  "beginner-box": {
    name: "Beginner Box",
    type: "core",
    source: [
      "Pathfinder Beginner Box: Hero's Handbook",
      "Pathfinder Beginner Box",
      "Pathfinder Beginners Box",
    ],
    language: ["it"],
  },
  bestiary3: {
    name: "Bestiary 3",
    type: "core",
    source: ["Bestiary 3", "Pathfinder Bestiary 3"],
    language: ["it"],
  },
  "secrets-of-magic": {
    name: "Secrets of Magic",
    type: "core",
    source: ["Secrets of Magic", "Pathfinder Secrets of Magic"],
    language: ["it"],
  },
  "guns-and-gears": {
    name: "Guns & Gears",
    type: "core",
    source: [
      "Guns & Gears",
      "Pathfinder Guns and Gears",
      "Pathfinder Guns & Gears",
    ],
    language: ["it"],
  },
  "book-of-the-dead": {
    name: "Book of the Dead",
    type: "core",
    source: ["Pathfinder Book of the Dead", "Book of the Dead"],
    language: ["it"],
  },
  "dark-archive": {
    name: "Dark Archive",
    type: "core",
    source: ["Pathfinder Dark Archive", "Dark Archive", "Tomorrow's Feast"],
    language: ["it"],
  },
  "treasure-vault": {
    name: "Treasure Vault",
    type: "core",
    source: [
      "Pathfinder Treasure Vault",
      "Pathfinder Treasure Vault (Remastered)",
      " Pathfinder Treasure Vault (Remastered)",
    ],
    language: ["it"],
  },
  "rage-of-elements": {
    name: "Rage of Elements",
    type: "core",
    source: ["Pathfinder Rage of Elements"],
    language: ["it"],
  },
  "howl-of-the-wild": {
    name: "Howl of the Wild",
    type: "core",
    source: ["Pathfinder Howl of the Wild"],
    language: [],
  },
  "war-of-immortals": {
    name: "War of Immortals",
    type: "core",
    source: ["Pathfinder War of Immortals"],
    language: [],
  },
  // Lost Omens
  "character-guide": {
    name: "Lost Omens Character Guide",
    type: "lost-omens",
    source: [
      "Character Guide",
      "Pathfinder Lost Omens: Character Guide",
      "Pathfinder Lost Omens Character Guide",
    ],
    language: ["it"],
  },
  "world-guide": {
    name: "Lost Omens World Guide",
    type: "lost-omens",
    source: [
      "World Guide",
      "Pathfinder Lost Omens: World Guide",
      "Pathfinder Lost Omens World Guide",
    ],
    language: ["it"],
  },
  "gods-and-magic": {
    name: "Lost Omens Gods & Magic",
    type: "lost-omens",
    source: [
      "Gods & Magic",
      "Pathfinder Lost Omens: Gods & Magic",
      "Pathfinder Lost Omens Gods & Magic",
    ],
    language: ["it"],
  },
  legends: {
    name: "Lost Omens Legends",
    type: "lost-omens",
    source: [
      "Legends",
      "Pathfinder Lost Omens: Legends",
      "Pathfinder Lost Omens Legends",
    ],
    language: [],
  },
  "pfs-guide": {
    name: "Lost Omens Pathfinder Society Guide",
    type: "lost-omens",
    source: [
      "PFS Guide",
      "Pathfinder Lost Omens: PFS Guide",
      "Pathfinder Lost Omens: Pathfinder Society Guide",
      "Pathfinder Lost Omens Pathfinder Society Guide",
    ],
    language: ["it"],
  },
  "ancestry-guide": {
    name: "Lost Omens Ancestry Guide",
    type: "lost-omens",
    source: [
      "Ancestry Guide",
      "Pathfinder Lost Omens: Ancestry Guide",
      "Pathfinder Lost Omens Ancestry Guide",
    ],
    language: ["it"],
  },
  "the-mwangi-expanse": {
    name: "Lost Omens The Mwangi Expanse",
    type: "lost-omens",
    source: [
      "The Mwangi Expanse",
      "Pathfinder Lost Omens: The Mwangi Expanse",
      "Pathfinder Lost Omens The Mwangi Expanse",
    ],
    language: [],
  },
  "grand-bazaar": {
    name: "Lost Omens Grand Bazaar",
    type: "lost-omens",
    source: [
      "Grand Bazaar",
      "Pathfinder Lost Omens: The Grand Bazaar",
      "Pathfinder Lost Omens: Grand Bazaar",
      "Pathfinder Lost Omens The Grand Bazaar",
    ],
    language: ["it"],
  },
  absalom: {
    name: "Lost Omens Absalom, City of Lost Omens",
    type: "lost-omens",
    source: [
      "Pathfinder Lost Omens: Absalom, City of Lost Omens",
      "Pathfinder Lost Omens Absalom, City of Lost Omens",
    ],
    language: [],
  },
  "monsters-of-myth": {
    name: "Lost Omens Monsters of Myth",
    type: "lost-omens",
    source: [
      "Pathfinder Lost Omens: Monsters of Myth",
      "Pathfinder Lost Omens Monsters of Myth",
    ],
    language: [],
  },
  "knights-of-lastwall": {
    name: "Lost Omens Knights of Lastwall",
    type: "lost-omens",
    source: [
      "Pathfinder Lost Omens: Knights of Lastwall",
      "Knights of Lastwall",
      "Pathfinder Lost Omens Knights of Lastwall",
    ],
    language: [],
  },
  "travel-guide": {
    name: "Lost Omens Travel Guide",
    type: "lost-omens",
    source: [
      "Pathfinder Lost Omens: Travel Guide",
      "Pathfinder Lost Omens Travel Guide",
    ],
    language: [],
  },
  "impossible-lands": {
    name: "Lost Omens Impossible Lands",
    type: "lost-omens",
    source: [
      "Pathfinder Lost Omens: Impossible Lands",
      "Impossible Lands",
      "Pathfinder Lost Omens Impossible Lands",
    ],
    language: [],
  },
  firebrands: {
    name: "Lost Omens Firebrands",
    type: "lost-omens",
    source: [
      "Pathfinder Lost Omens: Firebrands",
      "Pathfinder Lost Omens Firebrands",
    ],
    language: [],
  },
  highhelm: {
    name: "Lost Omens Highhelm",
    type: "lost-omens",
    source: [
      "Pathfinder Lost Omens: Highhelm",
      "Pathfinder Lost Omens Highhelm",
    ],
    language: [],
  },
  "tian-xia-character-guide": {
    name: "Lost Omens Tian Xia Character Guide",
    type: "lost-omens",
    source: [
      "Pathfinder Lost Omens: Tian Xia Character Guide",
      "Pathfinder Lost Omens Tian Xia Character Guide",
    ],
    language: [],
  },
  "tian-xia-world-guide": {
    name: "Lost Omens Tian Xia World Guide",
    type: "lost-omens",
    source: [
      "Pathfinder Lost Omens: Tian Xia World Guide",
      "Pathfinder Lost Omens Tian Xia World Guide",
    ],
    language: [],
  },
  "divine-mysteries": {
    name: "Lost Omens Divine Mysteries",
    type: "lost-omens",
    source: [
      "Pathfinder Lost Omens: Divine Mysteries",
      "Lost Omens - Divine Mysteries",
      "Pathfinder Lost Omens Divine Mysteries",
    ],
    language: [],
  },
  "rival-academies": {
    name: "Lost Omens Rival Academies",
    type: "lost-omens",
    source: ["Pathfinder Lost Omens Rival Academies"],
    language: [],
  },
  "shining-kingdoms": {
    name: "Lost Omens Shining Kingdoms",
    type: "lost-omens",
    source: ["Pathfinder Lost Omens Shining Kingdoms"],
    language: [],
  },
  // Adventure Paths
  "age-of-ashes1": {
    name: "Age of Ashes",
    type: "adventure-path",
    source: [
      "Pathfinder: Age of Ashes Player's Guide",
      "Age of Ashes Player's Guide",
      "Pathfinder Age of Ashes Player's Guide",
      "Pathfinder #145",
      "Pathfinder #145: Hellknight Hill",
    ],
    language: ["it"],
  },
  "age-of-ashes2": {
    name: "Age of Ashes",
    type: "adventure-path",
    source: ["Pathfinder #146", "Pathfinder #146: Cult of Cinders"],
    language: ["it"],
  },
  "age-of-ashes3": {
    name: "Age of Ashes",
    type: "adventure-path",
    source: ["Pathfinder #147", "Pathfinder #147: Tomorrow Must Burn"],
    language: ["it"],
  },
  "age-of-ashes4": {
    name: "Age of Ashes",
    type: "adventure-path",
    source: ["Pathfinder #148", "Pathfinder #148: Fires of the Haunted City"],
    language: ["it"],
  },
  "age-of-ashes5": {
    name: "Age of Ashes",
    type: "adventure-path",
    source: ["Pathfinder #149", "Pathfinder #149: Against the Scarlet Triad"],
    language: ["it"],
  },
  "age-of-ashes6": {
    name: "Age of Ashes",
    type: "adventure-path",
    source: ["Pathfinder #150", "Pathfinder #150: Broken Promises"],
    language: ["it"],
  },
  "extinction-curse1": {
    name: "Extinction Curse",
    type: "adventure-path",
    source: [
      "Pathfinder: Extinction Curse Player's Guide",
      "Pathfinder Extinction Curse Player's Guide",
      "Pathfinder #151",
      "Pathfinder #151: The Show Must Go On",
    ],
    language: [],
  },
  "extinction-curse2": {
    name: "Extinction Curse",
    type: "adventure-path",
    source: ["Pathfinder #152", "Pathfinder #152: Legacy of the Lost God"],
    language: [],
  },
  "extinction-curse3": {
    name: "Extinction Curse",
    type: "adventure-path",
    source: [
      "Pathfinder #153",
      "Pathfinder #153: Life's Long Shadows",
      "Pathfinder #153: Life's Long Shadow",
    ],
    language: [],
  },
  "extinction-curse4": {
    name: "Extinction Curse",
    type: "adventure-path",
    source: ["Pathfinder #154", "Pathfinder #154: Siege of the Dinosaurs"],
    language: [],
  },
  "extinction-curse5": {
    name: "Extinction Curse",
    type: "adventure-path",
    source: ["Pathfinder #155", "Pathfinder #155: Lord of the Black Sands"],
    language: [],
  },
  "extinction-curse6": {
    name: "Extinction Curse",
    type: "adventure-path",
    source: ["Pathfinder #156", "Pathfinder #156: The Apocalypse Prophet"],
    language: [],
  },
  "agents-of-edgewatch1": {
    name: "Agents of Edgewatch",
    type: "adventure-path",
    source: [
      "Pathfinder: Agents of Edgewatch Player's Guide",
      "Agents of Edgewatch Player's Guide",
      "Pathfinder Agents of Edgewatch Player's Guide",
      "Pathfinder #157",
      "Pathfinder #157: Devil at the Dreaming Palace",
    ],
    language: ["it"],
  },
  "agents-of-edgewatch2": {
    name: "Agents of Edgewatch",
    type: "adventure-path",
    source: ["Pathfinder #158", "Pathfinder #158: Sixty Feet Under"],
    language: ["it"],
  },
  "agents-of-edgewatch3": {
    name: "Agents of Edgewatch",
    type: "adventure-path",
    source: ["Pathfinder #159", "Pathfinder #159: All or Nothing"],
    language: ["it"],
  },
  "agents-of-edgewatch4": {
    name: "Agents of Edgewatch",
    type: "adventure-path",
    source: [
      "Pathfinder #160",
      "Pathfinder #160: Assault on Hunting Lodge Seven",
    ],
    language: ["it"],
  },
  "agents-of-edgewatch5": {
    name: "Agents of Edgewatch",
    type: "adventure-path",
    source: ["Pathfinder #161", "Pathfinder #161: Belly of the Black Whale"],
    language: ["it"],
  },
  "agents-of-edgewatch6": {
    name: "Agents of Edgewatch",
    type: "adventure-path",
    source: ["Pathfinder #162", "Pathfinder #162: Ruins of the Radiant Siege"],
    language: ["it"],
  },
  "abomination-vaults1": {
    name: "Abomination Vaults",
    type: "adventure-path",
    source: [
      "Abomination Vaults Player's Guide",
      "Pathfinder: Abomination Vaults Player's Guide",
      "Pathfinder Abomination Vaults Player's Guide",
      "Pathfinder #163",
      "Pathfinder #163: Ruins of Gauntlight",
      "Pathfinder Abomination Vaults Hardcover Compilation",
    ],
    language: ["it"],
  },
  "abomination-vaults2": {
    name: "Abomination Vaults",
    type: "adventure-path",
    source: ["Pathfinder #164", "Pathfinder #164: Hands of the Devil"],
    language: ["it"],
  },
  "abomination-vaults3": {
    name: "Abomination Vaults",
    type: "adventure-path",
    source: [
      "Pathfinder #165",
      "Patfinder #165: Eyes of Empty Death",
      "Pathfinder #165: Eyes of Empty Death",
    ],
    language: ["it"],
  },
  "abomination-vaults-hc": {
    name: "Abomination Vaults",
    type: "adventure-path",
    source: ["Pathfinder Abomination Vaults Compilation Hardcover"],
    language: ["it"],
  },
  "fists-of-the-ruby-phoenix1": {
    name: "Fists of the Ruby Phoenix",
    type: "adventure-path",
    source: [
      "Pathfinder: Fists of the Ruby Phoenix Player's Guide",
      "Pathfinder Fists of the Ruby Phoenix Player's Guide",
      "Pathfinder #166",
      "Pathfinder #166: Despair on Danger Island",
    ],
    language: [],
  },
  "fists-of-the-ruby-phoenix2": {
    name: "Fists of the Ruby Phoenix",
    type: "adventure-path",
    source: ["Pathfinder #167", "Pathfinder #167: Ready? Fight!"],
    language: [],
  },
  "fists-of-the-ruby-phoenix3": {
    name: "Fists of the Ruby Phoenix",
    type: "adventure-path",
    source: [
      "Pathfinder #168",
      "Patfinder #168: King of the Mountain",
      "Pathfinder #168: King of the Mountain",
    ],
    language: [],
  },
  "fists-of-the-ruby-phoenix-hc": {
    name: "Fists of the Ruby Phoenix",
    type: "adventure-path",
    source: ["Pathfinder Fists of the Ruby Phoenix Hardcover Compilation"],
    language: [],
  },
  "strength-of-thousands1": {
    name: "Strength of Thousands",
    type: "adventure-path",
    source: [
      "Pathfinder: Strength of Thousands Player's Guide",
      "Pathfinder Strength of Thousands Player's Guide",
      "Strength of Thousands Player's Guide",
      "Pathfinder #169",
      "Pathfinder #169: Kindled Magic",
    ],
    language: [],
  },
  "strength-of-thousands2": {
    name: "Strength of Thousands",
    type: "adventure-path",
    source: ["Pathfinder #170", "Pathfinder #170: Spoken on the Song Wind"],
    language: [],
  },
  "strength-of-thousands3": {
    name: "Strength of Thousands",
    type: "adventure-path",
    source: ["Pathfinder #171", "Pathfinder #171: Hurricane's Howl"],
    language: [],
  },
  "strength-of-thousands4": {
    name: "Strength of Thousands",
    type: "adventure-path",
    source: [
      "Pathfinder #172",
      "Pathfinder #172: Secrets of the Temple-City",
      "Pathfinder #172: Secrets of the Temple City",
    ],
    language: [],
  },
  "strength-of-thousands5": {
    name: "Strength of Thousands",
    type: "adventure-path",
    source: ["Pathfinder #173: Doorway to the Red Star"],
    language: [],
  },
  "strength-of-thousands6": {
    name: "Strength of Thousands",
    type: "adventure-path",
    source: ["Pathfinder #174: Shadows of the Ancients"],
    language: [],
  },
  "quest-for-the-frozen-flame1": {
    name: "Quest for the Frozen Flame",
    type: "adventure-path",
    source: [
      "Pathfinder: Quest for the Frozen Flame Player's Guide",
      "Pathfinder Quest for the Frozen Flame Player's Guide",
      "Pathfinder #175: Broken Tusk Moon",
    ],
    language: ["it"],
  },
  "quest-for-the-frozen-flame2": {
    name: "Quest for the Frozen Flame",
    type: "adventure-path",
    source: ["Pathfinder #176: Lost Mammoth Valley"],
    language: ["it"],
  },
  "quest-for-the-frozen-flame3": {
    name: "Quest for the Frozen Flame",
    type: "adventure-path",
    source: ["Pathfinder #177: Burning Tundra"],
    language: ["it"],
  },
  "outlaws-of-alkenstar1": {
    name: "Outlaws of Alkenstar",
    type: "adventure-path",
    source: [
      "Pathfinder: Outlaws of Alkenstar Player's Guide",
      "Pathfinder Outlaws of Alkenstar Player's Guide",
      "Pathfinder #178: Punks in a Powder Keg",
    ],
    language: [],
  },
  "outlaws-of-alkenstar2": {
    name: "Outlaws of Alkenstar",
    type: "adventure-path",
    source: ["Pathfinder #179: Cradle of Quartz"],
    language: [],
  },
  "outlaws-of-alkenstar3": {
    name: "Outlaws of Alkenstar",
    type: "adventure-path",
    source: ["Pathfinder #180: The Smoking Gun"],
    language: [],
  },
  "blood-lords1": {
    name: "Blood Lords",
    type: "adventure-path",
    source: [
      "Pathfinder: Blood Lords Player's Guide",
      "Pathfinder Blood Lords Player's Guide",
      "Pathfinder #181: Zombie Feast",
    ],
    language: ["it"],
  },
  "blood-lords2": {
    name: "Blood Lords",
    type: "adventure-path",
    source: ["Pathfinder #182: Graveclaw"],
    language: ["it"],
  },
  "blood-lords3": {
    name: "Blood Lords",
    type: "adventure-path",
    source: ["Pathfinder #183: Field of Maidens"],
    language: ["it"],
  },
  "blood-lords4": {
    name: "Blood Lords",
    type: "adventure-path",
    source: ["Pathfinder #184: The Ghouls Hunger"],
    language: ["it"],
  },
  "blood-lords5": {
    name: "Blood Lords",
    type: "adventure-path",
    source: ["Pathfinder #185: A Taste of Ashes"],
    language: ["it"],
  },
  "blood-lords6": {
    name: "Blood Lords",
    type: "adventure-path",
    source: ["Pathfinder #186: Ghost King's Rage"],
    language: ["it"],
  },
  gatewalkers1: {
    name: "Gatewalkers",
    type: "adventure-path",
    source: [
      "Gatewalkers Player's Guide",
      "Pathfinder Gatewalkers Player's Guide",
      "Pathfinder: Gatewalkers Player's Guide",
      "Pathfinder #187: The Seventh Arch",
    ],
    language: [],
  },
  gatewalkers2: {
    name: "Gatewalkers",
    type: "adventure-path",
    source: ["Pathfinder #188: They Watched the Stars"],
    language: [],
  },
  gatewalkers3: {
    name: "Gatewalkers",
    type: "adventure-path",
    source: ["Pathfinder #189: Dreamers of the Nameless Spires"],
    language: [],
  },
  kingmaker: {
    name: "Kingmaker",
    type: "adventure-path",
    source: [
      "Pathfinder: Kingmaker Player's Guide",
      "Pathfinder Kingmaker Player's Guide",
      "Pathfinder Kingmaker",
      "Kingmaker Adventure Path",
    ],
    language: [],
  },
  "stolen-fate1": {
    name: "Stolen Fate",
    type: "adventure-path",
    source: [
      "Pathfinder: Stolen Fate Player's Guide",
      "Pathfinder Stolen Fate Player's Guide",
      "Pathfinder #190: The Choosing",
    ],
    language: [],
  },
  "stolen-fate2": {
    name: "Stolen Fate",
    type: "adventure-path",
    source: ["Pathfinder #191: The Destiny War"],
    language: [],
  },
  "stolen-fate3": {
    name: "Stolen Fate",
    type: "adventure-path",
    source: ["Pathfinder #192: Worst of All Possible Worlds"],
    language: [],
  },
  "sky-kings-tomb1": {
    name: "Sky King's Tomb",
    type: "adventure-path",
    source: [
      "Pathfinder: Sky King's Tomb Player's Guide",
      "Pathfinder Sky King's Tomb Player's Guide",
      "Pathfinder #193: Mantle of Gold",
    ],
    language: [],
  },
  "sky-kings-tomb2": {
    name: "Sky King's Tomb",
    type: "adventure-path",
    source: ["Pathfinder #194: Cult of the Cave Worm"],
    language: [],
  },
  "sky-kings-tomb3": {
    name: "Sky King's Tomb",
    type: "adventure-path",
    source: ["Pathfinder #195: Heavy is the Crown"],
    language: [],
  },
  "season-of-ghosts1": {
    name: "Season of Ghosts",
    type: "adventure-path",
    source: [
      "Pathfinder: Season of Ghosts Player's Guide",
      "Pathfinder Season of Ghosts Player's Guide",
      "Season of Ghosts Player's Guide",
      "Pathfinder #196: The Summer That Never Was",
    ],
    language: [],
  },
  "season-of-ghosts2": {
    name: "Season of Ghosts",
    type: "adventure-path",
    source: ["Pathfinder #197: Let the Leaves Fall"],
    language: [],
  },
  "season-of-ghosts3": {
    name: "Season of Ghosts",
    type: "adventure-path",
    source: ["Pathfinder #198: No Breath to Cry"],
    language: [],
  },
  "season-of-ghosts4": {
    name: "Season of Ghosts",
    type: "adventure-path",
    source: ["Pathfinder #199: To Bloom Below the Web"],
    language: [],
  },
  "seven-dooms-for-sandpoint": {
    name: "Seven Dooms for Sandpoint",
    type: "adventure-path",
    source: [
      "Pathfinder #200: Seven Dooms for Sandpoint",
      "Pathfinder: Seven Dooms for Sandpoint Player's Guide",
      "Pathfinder Seven Dooms for Sandpoint Player's Guide",
      "Seven Dooms for Sandpoint Player's Guide",
    ],
    language: [],
  },
  "wardens-of-wildwood1": {
    name: "Wardens of Wildwood",
    type: "adventure-path",
    source: [
      "Pathfinder #201: Pactbreaker",
      "Pathfinder: Wardens of Wildwood Player's Guide",
      "Pathfinder Wardens of Wildwood Player's Guide",
    ],
    language: [],
  },
  "wardens-of-wildwood2": {
    name: "Wardens of Wildwood",
    type: "adventure-path",
    source: ["Pathfinder #202: Severed at the Root"],
    language: [],
  },
  "wardens-of-wildwood3": {
    name: "Wardens of Wildwood",
    type: "adventure-path",
    source: ["Pathfinder #203: Shepherd of Decay"],
    language: [],
  },
  "curtain-call1": {
    name: "Curtain Call",
    type: "adventure-path",
    source: [
      "Pathfinder Curtain Call Player's Guide",
      "Pathfinder #204: Stage Fright",
    ],
    language: [],
  },
  "curtain-call2": {
    name: "Curtain Call",
    type: "adventure-path",
    source: ["Pathfinder #205: Singer, Stalker, Skinsaw Man"],
    language: [],
  },
  "curtain-call3": {
    name: "Curtain Call",
    type: "adventure-path",
    source: ["Pathfinder #206: Bring the House Down"],
    language: [],
  },
  "triumph-of-the-tusk1": {
    name: "Triumph of The Tusk",
    type: "adventure-path",
    source: [
      "Pathfinder Triumph of The Tusk Player's Guide",
      "Pathfinder #207: The Resurrection Flood",
    ],
    language: [],
  },
  "triumph-of-the-tusk2": {
    name: "Triumph of The Tusk",
    type: "adventure-path",
    source: ["Pathfinder #208: Hoof, Cinder, and Storm"],
    language: [],
  },
  "triumph-of-the-tusk3": {
    name: "Triumph of The Tusk",
    type: "adventure-path",
    source: ["Pathfinder #209: Destroyer's Doom"],
    language: [],
  },
  "spore-war1": {
    name: "Spore War",
    type: "adventure-path",
    source: [
      "Pathfinder Spore War Player's Guide",
      "Pathfinder #210: Whispers in the Dirt",
    ],
    language: [],
  },
  "spore-war2": {
    name: "Spore War",
    type: "adventure-path",
    source: ["Pathfinder #211: The Secret of Deathstalk Tower"],
    language: [],
  },
  "spore-war3": {
    name: "Spore War",
    type: "adventure-path",
    source: ["Pathfinder #212: A Voice in the Blight"],
    language: [],
  },
  "shades-of-blood1": {
    name: "Shades of Blood",
    type: "adventure-path",
    source: [
      "Pathfinder Shades of Blood Player's Guide",
      "Pathfinder #213: Thirst for Blood",
    ],
    language: [],
  },
  "shades-of-blood2": {
    name: "Shades of Blood",
    type: "adventure-path",
    source: ["Pathfinder #214: The Broken Palace"],
    language: [],
  },
  "shades-of-blood3": {
    name: "Shades of Blood",
    type: "adventure-path",
    source: ["Pathfinder #215: To Blot Out the Sun"],
    language: [],
  },
  // Adventures
  "the-fall-of-plaguestone": {
    name: "The Fall of Plaguestone",
    type: "adventure",
    source: [
      "The Fall of Plaguestone",
      "Pathfinder Adventure: The Fall of Plaguestone",
    ],
    language: ["it"],
  },
  "little-trouble-in-big-absalom": {
    name: "Little Trouble in Big Absalom",
    type: "adventure",
    source: ["Pathfinder Adventure: Little Trouble in Big Absalom"],
    language: [],
  },
  "the-slithering": {
    name: "The Slithering",
    type: "adventure",
    source: ["The Slithering", "Pathfinder Adventure: The Slithering"],
    language: [],
  },
  "troubles-in-otari": {
    name: "Troubles in Otari",
    type: "adventure",
    source: ["Troubles in Otari", "Pathfinder Adventure: Troubles in Otari"],
    language: ["it"],
  },
  malevolence: {
    name: "Malevolence",
    type: "adventure",
    source: ["Malevolence", "Pathfinder Adventure: Malevolence"],
    language: [],
  },
  "night-of-the-gray-death": {
    name: "Night of the Gray Death",
    type: "adventure",
    source: [
      "Night of the Gray Death",
      "Pathfinder Adventure: Night of the Gray Death",
    ],
    language: [],
  },
  "threshold-of-knowledge": {
    name: "Threshold of Knowledge",
    type: "adventure",
    source: ["Pathfinder Adventure: Threshold of Knowledge"],
    language: [],
  },
  "shadows-at-sundown": {
    name: "Shadows at Sundown",
    type: "adventure",
    source: ["Pathfinder Adventure: Shadows at Sundown"],
    language: [],
  },
  "a-fistful-of-flowers": {
    name: "A Fistful of Flowers",
    type: "adventure",
    source: ["Pathfinder Adventure: A Fistful of Flowers"],
    language: [],
  },
  "crown-of-the-kobold-king": {
    name: "Crown of the Kobold King",
    type: "adventure",
    source: [
      "Pathfinder Adventure: Crown of the Kobold King",
      "Crown of the Kobold King",
    ],
    language: ["it"],
  },
  "the-enmity-cycle": {
    name: "The Enmity Cycle",
    type: "adventure",
    source: ["Pathfinder Adventure: The Enmity Cycle"],
    language: [],
  },
  "the-dead-gods-hand": {
    name: "The Dead Gods Hand",
    type: "adventure",
    source: [],
    language: [],
  },
  "a-few-flowers-more": {
    name: "A Few Flowers More",
    type: "adventure",
    source: ["Pathfinder Adventure: A Few Flowers More"],
    language: [],
  },
  "the-great-toy-heist": {
    name: "A Few Flowers More",
    type: "adventure",
    source: ["Pathfinder Free RPG Day Adventure: The Great Toy Heist"],
    language: [],
  },
  "prey-for-death": {
    name: "Prey for Death",
    type: "adventure",
    source: ["Pathfinder Adventure: Prey for Death"],
    language: [],
  },
  // One-Shots
  "dinner-at-lionlodge": {
    name: "Dinner at Lionlodge",
    type: "adventure",
    source: ["Pathfinder One-Shot #2: Dinner at Lionlodge"],
    language: [],
  },
  "sundered-waves": {
    name: "Sundered Waves",
    type: "adventure",
    source: ["Pathfinder One-Shot #1: Sundered Waves"],
    language: [],
  },
  "head-shot-the-rot": {
    name: "Head Shot The Rot",
    type: "adventure",
    source: [],
    language: [],
  },
  "mark-of-the-mantis": {
    name: "Mark Of The Mantis",
    type: "adventure",
    source: ["Pathfinder One-Shot #4: Mark of the Mantis"],
    language: [],
  },
  rusthenge: {
    name: "Rusthenge",
    type: "adventure",
    source: ["Pathfinder Adventure: Rusthenge"],
    language: [],
  },
  "claws-of-the-tyrant": {
    name: "Claws of the Tyrant",
    type: "adventure",
    source: ["Pathfinder Claws of the Tyrant"],
    language: [],
  },
  // Other Random Stuff
  "random-sources": {
    name: "Random Sources",
    type: "other",
    source: [
      "Pathfinder Blog",
      "Pathfinder Special: Fumbus!",
      "Pathfinder Special: Fumbus",
      "Redpitch Alchemy",
      "Pathfinder Blog: The Waters of Stone Ring Pond",
      "Pathfinder Blog: April Fools",
      "Azarketi Ancestry Web Supplement",
      "Pathfinder: Wake the Dead #1",
      "Pathfinder Wake the Dead #1",
      "Pathfinder: Wake the Dead #2",
      "Pathfinder Wake the Dead #2",
      "Pathfinder: Wake the Dead #3",
      "Pathfinder Wake the Dead #3",
      "Pathfinder: Wake the Dead #4",
      "Pathfinder Wake the Dead #4",
      "Pathfinder: Wake the Dead #5",
      "Pathfinder Wake the Dead #5",
      "Pathfinder Dark Archive Web Supplement: In Darkness",
      "Pathfinder Blog: April Fool's Bestiary",
      "Pathfinder Critical Decks",
      "Pathfinder Hero Point Deck",
      /Paizo Blog: .+/,
      "Pathfinder Lost Omens Divine Mysteries Web Supplement",
    ],
    language: [],
  },
  "random-society": {
    name: "Random Society",
    type: "other",
    source: [
      "Organized Play Foundation",
      "Pathfinder Blog: Pathfinder Society Year 4 Rule Updates",
      "PFS Quest #5: The Dragon Who Stole Evoking Day",
      "Pathfinder Society: Season 1",
      /Pathfinder Society Quest .+/,
      /Pathfinder Bounty .+/,
      /Pathfinder Society Intro .+/,
      /Pathfinder Society Intro: .+/,
      /Pathfinder Society Scenario .+/,
      /Pathfinder Society Special .+/,
      "Pathfinder Society Boons",
    ],
    language: [],
  },
  "player-core": {
    name: "Player Core",
    type: "core-remaster",
    source: ["Pathfinder Player Core"],
    language: [],
  },
  "gm-core": {
    name: "GM Core",
    type: "core-remaster",
    source: ["Pathfinder GM Core"],
    language: [],
  },
  "monster-core": {
    name: "Monster Core",
    type: "core-remaster",
    source: ["Pathfinder Monster Core"],
    language: [],
  },
  "player-core2": {
    name: "Player Core 2",
    type: "core-remaster",
    source: ["Pathfinder Player Core 2"],
    language: [],
  },
  "npc-core": {
    name: "NPC Core",
    type: "core-remaster",
    source: ["Pathfinder NPC Core"],
    language: [],
  },
};

export const sourceStateMap = new Map(
  Object.entries(sourceState).flatMap(([k, v]) => v.source.map((h) => [h, k])),
);

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const sourceRegexList = Object.entries(sourceState).map(([k, v]) => ({
  regex:
    "^(" +
    v.source
      .map((s) => (s instanceof RegExp ? s.source : escapeRegExp(s)))
      .join("|") +
    ")$",
  tag: k,
}));

export const weaponPropertyRunes = [
  ["Anarchic", "Core Rulebook"],
  ["Ancestral Echoing", "Pathfinder #148: Fires of the Haunted City"],
  ["Anchoring", "Grand Bazaar"],
  ["Greater Anchoring", "Grand Bazaar"],
  ["Axiomatic", "Core Rulebook"],
  ["Bane", "Secrets of Magic"],
  ["Bloodbane", "Pathfinder #148: Fires of the Haunted City"],
  ["Greater Bloodbane", "Pathfinder #148: Fires of the Haunted City"],
  ["Bloodthirsty", "Grand Bazaar"],
  ["Brilliant", "Secrets of Magic"],
  ["Greater Brilliant", "Secrets of Magic"],
  ["Weapon Called Rune", "Knights of Lastwall"],
  ["Conducting", "Ancestry Guide"],
  ["Corrosive", "Core Rulebook"],
  ["Greater Corrosive", "Core Rulebook"],
  ["Crushing", "Grand Bazaar"],
  ["Greater Crushing", "Grand Bazaar"],
  ["Cunning", "PFS Guide"],
  ["Dancing", "Core Rulebook"],
  ["Deathdrinking", "Kingmaker Companion Guide"],
  ["Demolishing", "Pathfinder Special: Fumbus"],
  ["Disrupting", "Core Rulebook"],
  ["Greater Disrupting", "Core Rulebook"],
  ["Energizing", "Grand Bazaar"],
  ["Extending", "Secrets of Magic"],
  ["Greater Extending", "Secrets of Magic"],
  ["Fanged", "Grand Bazaar"],
  ["Greater Fanged", "Grand Bazaar"],
  ["Major Fanged", "Grand Bazaar"],
  ["Fearsome", "Advanced Player's Guide"],
  ["Greater Fearsome", "Advanced Player's Guide"],
  ["Flaming", "Core Rulebook"],
  ["Greater Flaming", "Core Rulebook"],
  ["Frost", "Core Rulebook"],
  ["Greater Frost", "Core Rulebook"],
  ["Ghost Touch", "Core Rulebook"],
  ["Giant-Killing", "Kingmaker Companion Guide"],
  ["Greater Giant-Killing", "Kingmaker Companion Guide"],
  ["Grievous", "Core Rulebook"],
  ["Hauling", "Grand Bazaar"],
  ["Greater Hauling", "Grand Bazaar"],
  ["Holy", "Core Rulebook"],
  ["Hooked", "Kingmaker Companion Guide"],
  ["Hopeful", "Grand Bazaar"],
  ["Impactful", "Secrets of Magic"],
  ["Greater Impactful", "Secrets of Magic"],
  ["Keen", "Core Rulebook"],
  ["Kin-Warding", "Pathfinder #148: Fires of the Haunted City"],
  ["Pacifying", "Pathfinder #157: Devil at the Dreaming Palace"],
  ["Returning", "Core Rulebook"],
  ["Serrating", "Character Guide"],
  ["Shifting", "Core Rulebook"],
  ["Shock", "Core Rulebook"],
  ["Greater Shock", "Core Rulebook"],
  ["Speed", "Core Rulebook"],
  ["Spell-Storing", "Core Rulebook"],
  ["Thundering", "Core Rulebook"],
  ["Greater Thundering", "Core Rulebook"],
  ["Unholy", "Core Rulebook"],
  ["Vorpal", "Core Rulebook"],
  ["Wounding", "Core Rulebook"],
];

export const bombs = [
  ["Greater Acid Flask", "Core Rulebook"],
  ["Lesser Acid Flask", "Core Rulebook"],
  ["Major Acid Flask", "Core Rulebook"],
  ["Moderate Acid Flask", "Core Rulebook"],
  ["Acid Flask", "Core Rulebook"],

  ["Greater Alchemist's Fire", "Core Rulebook"],
  ["Lesser Alchemist's Fire", "Core Rulebook"],
  ["Major Alchemist's Fire", "Core Rulebook"],
  ["Moderate Alchemist's Fire", "Core Rulebook"],
  ["Alchemist's Fire", "Core Rulebook"],

  ["Greater Alignment Ampoule", "PFS Guide"],
  ["Lesser Alignment Ampoule", "PFS Guide"],
  ["Major Alignment Ampoule", "PFS Guide"],
  ["Moderate Alignment Ampoule", "PFS Guide"],
  ["Alignment Ampoule", "PFS Guide"],

  ["Greater Blight Bomb", "Advanced Player's Guide"],
  ["Lesser Blight Bomb", "Advanced Player's Guide"],
  ["Major Blight Bomb", "Advanced Player's Guide"],
  ["Moderate Blight Bomb", "Advanced Player's Guide"],
  ["Blight Bomb", "Advanced Player's Guide"],

  ["Blindpepper Bomb", "Pathfinder #157: Devil at the Dreaming Palace"],

  ["Greater Bottled Lightning", "Core Rulebook"],
  ["Lesser Bottled Lightning", "Core Rulebook"],
  ["Major Bottled Lightning", "Core Rulebook"],
  ["Moderate Bottled Lightning", "Core Rulebook"],
  ["Bottled Lightning", "Core Rulebook"],

  ["Greater Bottled Sunlight", "Book of the Dead"],
  ["Lesser Bottled Sunlight", "Book of the Dead"],
  ["Major Bottled Sunlight", "Book of the Dead"],
  ["Moderate Bottled Sunlight", "Book of the Dead"],
  ["Bottled Sunlight", "Book of the Dead"],

  ["Greater Crystal Shards", "Advanced Player's Guide"],
  ["Major Crystal Shards", "Advanced Player's Guide"],
  ["Moderate Crystal Shards", "Advanced Player's Guide"],
  ["Crystal Shards", "Advanced Player's Guide"],

  ["Greater Dread Ampoule", "Advanced Player's Guide"],
  ["Lesser Dread Ampoule", "Advanced Player's Guide"],
  ["Major Dread Ampoule", "Advanced Player's Guide"],
  ["Moderate Dread Ampoule", "Advanced Player's Guide"],
  ["Dread Ampoule", "Advanced Player's Guide"],

  ["Lesser Dwarven Daisy", "PFS Quest #5: The Dragon Who Stole Evoking Day"],
  ["Moderate Dwarven Daisy", "PFS Quest #5: The Dragon Who Stole Evoking Day"],
  ["Dwarven Daisy", "PFS Quest #5: The Dragon Who Stole Evoking Day"],

  ["Greater Frost Vial", "Core Rulebook"],
  ["Lesser Frost Vial", "Core Rulebook"],
  ["Major Frost Vial", "Core Rulebook"],
  ["Moderate Frost Vial", "Core Rulebook"],
  ["Frost Vial", "Core Rulebook"],

  ["Greater Ghost Charge", "Advanced Player's Guide"],
  ["Lesser Ghost Charge", "Advanced Player's Guide"],
  ["Major Ghost Charge", "Advanced Player's Guide"],
  ["Moderate Ghost Charge", "Advanced Player's Guide"],
  ["Ghost Charge", "Advanced Player's Guide"],

  ["Greater Goo Grenade", "Impossible Lands"],
  ["Lesser Goo Grenade", "Impossible Lands"],
  ["Major Goo Grenade", "Impossible Lands"],
  ["Moderate Goo Grenade", "Impossible Lands"],
  ["Goo Grenade", "Impossible Lands"],

  ["Greater Junk Bomb", "Pathfinder Special: Fumbus"],
  ["Lesser Junk Bomb", "Pathfinder Special: Fumbus"],
  ["Major Junk Bomb", "Pathfinder Special: Fumbus"],
  ["Moderate Junk Bomb", "Pathfinder Special: Fumbus"],
  ["Junk Bomb", "Pathfinder Special: Fumbus"],

  ["Greater Mud Bomb", "Pathfinder #176: Lost Mammoth Valley"],
  ["Lesser Mud Bomb", "Pathfinder #176: Lost Mammoth Valley"],
  ["Major Mud Bomb", "Pathfinder #176: Lost Mammoth Valley"],
  ["Moderate Mud Bomb", "Pathfinder #176: Lost Mammoth Valley"],
  ["Mud Bomb", "Pathfinder #176: Lost Mammoth Valley"],

  ["Greater Necrotic Bomb", "Pathfinder #165: Eyes of Empty Death"],
  ["Lesser Necrotic Bomb", "Pathfinder #165: Eyes of Empty Death"],
  ["Major Necrotic Bomb", "Pathfinder #165: Eyes of Empty Death"],
  ["Moderate Necrotic Bomb", "Pathfinder #165: Eyes of Empty Death"],
  ["Necrotic Bomb", "Pathfinder #165: Eyes of Empty Death"],

  ["Overloaded Brain Grenade", "Pathfinder Special: Fumbus"],

  ["Greater Pernicious Spore Bomb", "Pathfinder #176: Lost Mammoth Valley"],
  ["Lesser Pernicious Spore Bomb", "Pathfinder #176: Lost Mammoth Valley"],
  ["Major Pernicious Spore Bomb", "Pathfinder #176: Lost Mammoth Valley"],
  ["Moderate Pernicious Spore Bomb", "Pathfinder #176: Lost Mammoth Valley"],
  ["Pernicious Spore Bomb", "Pathfinder #176: Lost Mammoth Valley"],

  ["Greater Peshspine Grenade", "Pathfinder #149: Against the Scarlet Triad"],
  ["Lesser Peshspine Grenade", "Pathfinder #149: Against the Scarlet Triad"],
  ["Major Peshspine Grenade", "Pathfinder #149: Against the Scarlet Triad"],
  ["Moderate Peshspine Grenade", "Pathfinder #149: Against the Scarlet Triad"],
  ["Peshspine Grenade", "Pathfinder #149: Against the Scarlet Triad"],

  ["Greater Pressure Bomb", "Pathfinder Special: Fumbus"],
  ["Lesser Pressure Bomb", "Pathfinder Special: Fumbus"],
  ["Major Pressure Bomb", "Pathfinder Special: Fumbus"],
  ["Moderate Pressure Bomb", "Pathfinder Special: Fumbus"],
  ["Pressure Bomb", "Pathfinder Special: Fumbus"],

  ["Greater Redpitch Bomb", "Redpitch Alchemy"],
  ["Lesser Redpitch Bomb", "Redpitch Alchemy"],
  ["Major Redpitch Bomb", "Redpitch Alchemy"],
  ["Moderate Redpitch Bomb", "Redpitch Alchemy"],
  ["Redpitch Bomb", "Redpitch Alchemy"],

  ["Greater Star Grenade", "Pathfinder #180: The Smoking Gun"],
  ["Lesser Star Grenade", "Pathfinder #180: The Smoking Gun"],
  ["Major Star Grenade", "Pathfinder #180: The Smoking Gun"],
  ["Moderate Star Grenade", "Pathfinder #180: The Smoking Gun"],
  ["Star Grenade", "Pathfinder #180: The Smoking Gun"],

  ["Greater Sulfur Bomb", "Grand Bazaar"],
  ["Lesser Sulfur Bomb", "Grand Bazaar"],
  ["Major Sulfur Bomb", "Grand Bazaar"],
  ["Moderate Sulfur Bomb", "Grand Bazaar"],
  ["Sulfur Bomb", "Grand Bazaar"],

  ["Greater Tallow Bomb", "Pathfinder #175: Broken Tusk Moon"],
  ["Lesser Tallow Bomb", "Pathfinder #175: Broken Tusk Moon"],
  ["Major Tallow Bomb", "Pathfinder #175: Broken Tusk Moon"],
  ["Moderate Tallow Bomb", "Pathfinder #175: Broken Tusk Moon"],
  ["Tallow Bomb", "Pathfinder #175: Broken Tusk Moon"],

  ["Greater Tanglefoot Bag", "Core Rulebook"],
  ["Lesser Tanglefoot Bag", "Core Rulebook"],
  ["Major Tanglefoot Bag", "Core Rulebook"],
  ["Moderate Tanglefoot Bag", "Core Rulebook"],
  ["Tanglefoot Bag", "Core Rulebook"],

  ["Greater Thunderstone", "Core Rulebook"],
  ["Lesser Thunderstone", "Core Rulebook"],
  ["Major Thunderstone", "Core Rulebook"],
  ["Moderate Thunderstone", "Core Rulebook"],
  ["Thunderstone", "Core Rulebook"],

  ["Greater Twigjack Sack", "Pathfinder #175: Broken Tusk Moon"],
  ["Lesser Twigjack Sack", "Pathfinder #175: Broken Tusk Moon"],
  ["Major Twigjack Sack", "Pathfinder #175: Broken Tusk Moon"],
  ["Moderate Twigjack Sack", "Pathfinder #175: Broken Tusk Moon"],
  ["Twigjack Sack", "Pathfinder #175: Broken Tusk Moon"],

  ["Greater Vexing Vapor", "Grand Bazaar"],
  ["Lesser Vexing Vapor", "Grand Bazaar"],
  ["Major Vexing Vapor", "Grand Bazaar"],
  ["Moderate Vexing Vapor", "Grand Bazaar"],
  ["Vexing Vapor", "Grand Bazaar"],

  ["Greater Water Bomb", "Pathfinder #176: Lost Mammoth Valley"],
  ["Lesser Water Bomb", "Pathfinder #176: Lost Mammoth Valley"],
  ["Major Water Bomb", "Pathfinder #176: Lost Mammoth Valley"],
  ["Moderate Water Bomb", "Pathfinder #176: Lost Mammoth Valley"],
  ["Water Bomb", "Pathfinder #176: Lost Mammoth Valley"],
];
