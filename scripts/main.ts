import "dotenv/config";

import { resolve } from "path";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { commandFixBuildPacks } from "./command-fix-build-packs";
import { commandFindMostCommon } from "./command-find-most-common";
import { commandFixItemIds } from "./command-fix-item-ids";
import { commandRemoveSameTranslation } from "./command-fix-same-translation";
import { commandFixTemplate } from "./command-fix-template";
import { commandUpdate } from "./command-update";
import { commandUpdateSource } from "./command-update-source";
import { commandWeblateQuery } from "./command-weblate-query";

yargs(hideBin(process.argv))
  .option("directory", {
    description: "the foundry system directory",
    alias: "d",
    type: "string",
    default: "../system",
  })
  .command(
    "update",
    "update the sources",
    (yargs) => yargs,
    async (argv) => {
      const dir = resolve(argv.directory);
      console.log(`updating sources using system at ${dir}`);
      await commandUpdate(dir);
    }
  )
  .command(
    "fix-build-packs",
    "fix build packs",
    (yargs) => yargs,
    async (argv) => {
      const dir = resolve(argv.directory);
      console.log(`fixing build:packs for system at ${dir}`);
      await commandFixBuildPacks(dir);
    }
  )
  .command(
    "update-source",
    "set the correct source using labels on weblate",
    (yargs) =>
      yargs
        .option("token", {
          description: "weblate token (env: TTOKEN)",
          alias: "t",
          type: "string",
        })
        .option("filter", {
          description: "only filter some compendiums to update",
          alias: "f",
          type: "array",
        })
        .option("debug-skip", {
          description:
            "skip all the packs before the specified one, used for debugging only",
          type: "string",
        })
        .option("dry", {
          description: "dry run",
          type: "boolean",
        }),
    async (argv) => {
      const token = argv.token ?? process.env.WEBLATE_TOKEN ?? "";
      if (!token) {
        throw new Error(
          "missing weblate token! either provided it in the WEBLATE_TOKEN enviroment variable or pass it with the --token flag"
        );
      }
      await commandUpdateSource(
        argv.directory,
        token,
        argv.dry ?? false,
        argv.filter?.map((x) => x.toString()) ?? [],
        argv.debugSkip
      );
    }
  )
  .command(
    "weblate-query <lang>",
    "print out some weblate queries",
    (yargs) => yargs.positional("lang", { type: "string", demandOption: true }),
    async (argv) => {
      await commandWeblateQuery([], argv.lang);
    }
  )
  .command(
    "find-most-common <lang> [compendium]",
    "find the most common untranslated strings in a translation compendium",
    (yargs) =>
      yargs
        .positional("lang", { type: "string", demandOption: true })
        .positional("compendium", { type: "string", demandOption: true }),
    async (argv) => {
      await commandFindMostCommon(argv.lang, argv.compendium);
    }
  )
  .command(
    "fix-item-ids <lang>",
    "fix item names to item ids for the specified language",
    (yargs) => yargs.positional("lang", { type: "string", demandOption: true }),
    async (argv) => {
      await commandFixItemIds(argv.lang, argv.directory);
    }
  )
  .command(
    "remove-same-translation <lang> [compendium]",
    "remove strings with the same translation",
    (yargs) =>
      yargs
        .positional("lang", { type: "string", demandOption: true })
        .positional("compendium", { type: "string" }),
    async (argv) => {
      await commandRemoveSameTranslation(
        argv.lang,
        argv.compendium,
        argv.directory
      );
    }
  )
  .command(
    "fix-template <lang> [compendium]",
    "",
    (yargs) =>
      yargs
        .positional("lang", { type: "string", demandOption: true })
        .positional("compendium", { type: "string", demandOption: true }),
    async (argv) => {
      await commandFixTemplate(argv.lang, argv.compendium, argv.directory);
    }
  )
  .strictCommands()
  .demandCommand(1)
  .parse();
