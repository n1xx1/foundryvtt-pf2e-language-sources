import "dotenv/config";

import { resolve } from "path";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { commandFindMostCommon } from "./command-find-most-common";
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
        argv.filter?.map((x) => x.toString()) ?? []
      );
    }
  )
  .command(
    "weblate-query [lang]",
    "print out some weblate queries",
    (yargs) => yargs.positional("lang", { type: "string", demandOption: true }),
    async (argv) => {
      await commandWeblateQuery([], argv.lang);
    }
  )
  .command(
    "find-most-common [lang] [compendium]",
    "find the most common untranslated strings in a translation compendium",
    (yargs) =>
      yargs
        .positional("lang", { type: "string", demandOption: true })
        .positional("compendium", { type: "string", demandOption: true }),
    async (argv) => {
      await commandFindMostCommon(argv.lang, argv.compendium);
    }
  )
  .strictCommands()
  .demandCommand(1)
  .parse();
