import { readFile, writeFile } from "fs/promises";
import { join } from "path";

export async function commandFixBuildPacks(systemDir = "../system") {
  const compendiumPackSrc = join(systemDir, "build/lib/compendium-pack.ts");
  const contents = await readFile(compendiumPackSrc, "utf-8");

  const newContents = contents.replace(
    /async save\(\): Promise<number>/,
    newSaveFunc
  );

  await writeFile(compendiumPackSrc, newContents);
}

const newSaveFunc = `save(): number {
        if (!fs.lstatSync(CompendiumPack.outDir, { throwIfNoEntry: false })?.isDirectory()) {
            fs.mkdirSync(CompendiumPack.outDir);
        }

        fs.writeFileSync(
            path.resolve(CompendiumPack.outDir, this.packDir),
            this.data
                .map((datum) => this.#finalize(datum))
                .join("\\n")
                .concat("\\n")
        );
        console.log(\`Pack "\${this.packId}" with \${this.data.length} entries built successfully.\`);

        return this.data.length;
    }

    async save__old(): Promise<number>`;
