// seed.js  – ponelo al lado de package.json y tus JSON
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const { createStrapi } = require("@strapi/strapi"); // importamos la factory

async function run() {
  // 1) Arranca Strapi sin servidor HTTP
  const strapi = createStrapi();
  await strapi.load();

  // 2) Carga datos de cada JSON
  await loadFromJson("about");
  await loadFromJson("design");
  await loadFromJson("photography");
  await loadFromJson("writing");

  console.log("✔ Seed completado");
  process.exit(0);

  // --- helper interno ---
  async function loadFromJson(name) {
    const file = path.join(__dirname, `${name}.json`);
    const json = JSON.parse(fs.readFileSync(file, "utf-8"));

    // single type: intro
    if (json.intro) {
      const uid = `${name}-intro`;
      const data = {
        title: json.intro.title,
        subtitle: json.intro.subtitle || "",
        content: json.intro.body || "",
        slug:
          json.intro.slug || slugify(json.intro.title || uid, { lower: true }),
        category: json.intro.category || "",
      };
      const [existing] = await strapi.entityService.findMany(
        `api::${uid}.${uid}`,
        {}
      );
      if (existing) {
        await strapi.entityService.update(`api::${uid}.${uid}`, existing.id, {
          data,
        });
      } else {
        await strapi.entityService.create(`api::${uid}.${uid}`, { data });
      }
    }

    // collection type: articles
    const collUid = name === "writing" ? "writting" : name;
    for (const art of json.articles) {
      await strapi.entityService.create(`api::${collUid}.${collUid}`, {
        data: {
          title: art.title,
          subtitle: art.subtitle || "",
          body: art.body || "",
          category: art.category || "",
          slug: art.slug || slugify(art.title, { lower: true }),
        },
      });
    }
  }
}

run().catch((err) => {
  console.error("❌ Error en el seed:", err);
  process.exit(1);
});
