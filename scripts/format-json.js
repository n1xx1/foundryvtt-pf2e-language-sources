const { readFile, writeFile } = require("fs/promises");
const _ = require("lodash");

(async () => {
  const filePath = process.argv[2];
  const file = await readFile(filePath, "utf-8");
  const data = JSON.parse(file);

  function removeEmptyStrings(obj) {
    return _.pickBy(
      _.mapValues(obj, (v) =>
        typeof v === "object" ? removeEmptyStrings(v) : v === "" ? undefined : v
      ),
      (v, k) =>
        typeof v === "object"
          ? Object.keys(v).length > 0
          : v !== undefined && v !== null
    );
  }

  const out = removeEmptyStrings(data);
  await writeFile(filePath, JSON.stringify(out, null, 4));
})();
