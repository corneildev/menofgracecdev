import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const SITE = "https://menofgrace.store";

const STATIC_URLS: Array<{ path: string; priority: number; changefreq: string }> = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/collection", priority: 0.9, changefreq: "weekly" },
  { path: "/size-finder", priority: 0.7, changefreq: "monthly" },
  { path: "/wishlist", priority: 0.4, changefreq: "monthly" },
  { path: "/shipping-returns", priority: 0.5, changefreq: "yearly" },
  { path: "/privacy", priority: 0.3, changefreq: "yearly" },
  { path: "/terms", priority: 0.3, changefreq: "yearly" },
  { path: "/cookies", priority: 0.3, changefreq: "yearly" },
];

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const url = process.env.VITE_SUPABASE_URL;
        const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

        let productEntries: Array<{ slug: string; updated: string | null }> = [];

        if (url && key) {
          try {
            const supabase = createClient(url, key);
            const { data } = await supabase
              .from("products")
              .select("slug, updated_at")
              .eq("is_published", true)
              .limit(2000);
            productEntries = (data ?? []).map((p) => ({
              slug: p.slug,
              updated: p.updated_at,
            }));
          } catch {
            // sitemap reste avec les pages statiques
          }
        }

        const today = new Date().toISOString().slice(0, 10);

        const urls = [
          ...STATIC_URLS.map(({ path, priority, changefreq }) =>
            `<url><loc>${SITE}${escapeXml(path)}</loc><lastmod>${today}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority.toFixed(1)}</priority></url>`,
          ),
          ...productEntries.map(({ slug, updated }) => {
            const lm = (updated ?? new Date().toISOString()).slice(0, 10);
            return `<url><loc>${SITE}/collection/${escapeXml(slug)}</loc><lastmod>${lm}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
          }),
        ].join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=1800",
          },
        });
      },
    },
  },
});
