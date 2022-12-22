# PF2 Language Sources

To be used with weblate. Items require a custom Babele converter that looks like this:

```js
let dynamicMapping = new CompendiumMapping("Item", null);

// translations can be either an array of translations or an object
function getTranslationForItem(data, translations) {
  if (Array.isArray(translations)) {
    return translations.find((t) => t.id === data._id || t.id === data.name);
  } else {
    return translations[data._id] || translations[data.name];
  }
}

// parse a sourceId reference (supports sub-items) and
// return the matching translation and mapping
function findTranslationSource(sourceId) {
  const m = sourceId.match(
    /^Compendium\.pf2e\.([^\.]+).([^\.]+)(?:\.Item\.([^\.]+))?$/
  );
  if (m) {
    const [_, packName, id, itemId] = m;
    const pack = game.babele.packs.get(`pf2e.${packName}`);
    if (!pack) {
      return [null, null];
    }

    const referencedTranslation = pack.translationsFor({ _id: id });
    if (!itemId) {
      return [referencedTranslation, pack.mapping];
    }

    if (referencedTranslation?.items) {
      const name = game.packs.get(`pf2e.${packName}`).index.get(itemId).name;

      return [
        getTranslationForItem(
          { _id: itemId, name },
          referencedTranslation.items
        ),
        dynamicMapping,
      ];
    }
  }
  return [null, null];
}

function fromPackPf2(items, translations) {
  return items.map((data) => {
    let translationData;
    let translationSource;

    if (translations) {
      const translation = getTranslationForItem(data, translations);
      if (translation) {
        const { _source, ...rest } = translation;
        translationData = dynamicMapping.map(data, rest);
        translationSource = _source ? `Compendium.pf2e.${_source}` : null;
      }
    }

    const sourceId = translationSource ?? data.flags?.core?.sourceId;
    if (sourceId) {
      const [translationData1, mapping] = findTranslationSource(sourceId);
      if (translationData1) {
        translationData = mergeObject(
          mapping.map(data, translationData1, { inplace: false }),
          translationData
        );
      }
    }

    if (!sourceId && (data.type === "melee" || data.type === "ranged")) {
      // find from equipment-srd
      const equipmentTranslation = game.babele.packs
        .get("pf2e.equipment-srd")
        .translationsFor({ _id: "", name: data.name });

      translationData = mapping.map(
        data,
        mergeObject(equipmentTranslation, translationData ?? {}),
        { inplace: false }
      );
    }

    return mergeObject(
      data,
      mergeObject(
        translationData,
        {
          translated: true,
          flags: {
            babele: {
              translated: true,
              hasTranslation: true,
              originalName: data.name,
            },
          },
        },
        { inplace: false }
      ),
      { inplace: false }
    );
  });
}
```
