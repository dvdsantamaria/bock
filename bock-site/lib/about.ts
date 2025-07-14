/* lib/about.ts
   - Centraliza la consulta a Strapi para la sección “About”
   - Implementa caché in-memory para que las llamadas de build sean rápidas
*/

export interface AboutBlock {
  id: number;
  title: string;
  body: string | { type: string; children: { text: string }[] }[];
  slug: string;
  // ⚠️ añade aquí cualquier campo extra que uses en AboutPage (imagen, etc.)
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Caché simple en memoria del proceso
let _cache: AboutBlock[] | null = null;
let _fetchedAt = 0;
const TTL = 1000 * 60 * 5; // 5 min

/** Descarga (o devuelve de caché) todos los bloques About. */
export async function getAboutBlocks(): Promise<AboutBlock[]> {
  const now = Date.now();
  if (_cache && now - _fetchedAt < TTL) return _cache;

  const res = await fetch(
    `${API}/api/about-blocks?pagination[pageSize]=100&populate=*`
  );
  const json = await res.json();

  _cache =
    json.data?.map((it: any) => ({
      id: it.id,
      title: it.attributes.title,
      body: it.attributes.body || it.attributes.content || "",
      slug: it.attributes.slug,
      // image: it.attributes.image?.data?.attributes?.url
      //   ? `${API}${it.attributes.image.data.attributes.url}`
      //   : undefined,
    })) || [];

  _fetchedAt = now;
  return _cache;
}

/** Devuelve un bloque concreto por slug (o null). */
export async function getAboutBySlug(slug: string): Promise<AboutBlock | null> {
  const all = await getAboutBlocks();
  return all.find((b) => b.slug === slug) ?? null;
}
