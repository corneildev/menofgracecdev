import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listAllProducts, formatPriceFcfa, CATEGORY_LABELS, type ProductWithImages } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Catalogue — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProductsAdminPage,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function ProductsAdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [busy, setBusy] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [filterPub, setFilterPub] = useState<"all" | "published" | "draft">("all");
  const [working, setWorking] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/account" });
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    void load();
  }, [isAdmin]);

  async function load() {
    setBusy(true);
    setProducts(await listAllProducts());
    setBusy(false);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filterCat !== "all" && p.category !== filterCat) return false;
      if (filterPub === "published" && !p.is_published) return false;
      if (filterPub === "draft" && p.is_published) return false;
      if (q && !`${p.name} ${p.slug}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, search, filterCat, filterPub]);

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  }

  async function bulkPublish(value: boolean) {
    if (selected.size === 0) return;
    setWorking(true);
    const { error } = await supabase
      .from("products")
      .update({ is_published: value })
      .in("id", Array.from(selected));
    setWorking(false);
    if (error) { setMsg(`Erreur: ${error.message}`); return; }
    setMsg(`${selected.size} produit(s) ${value ? "publié(s)" : "dépublié(s)"}.`);
    setSelected(new Set());
    await load();
  }

  async function bulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Supprimer ${selected.size} produit(s) ? Cette action est irréversible.`)) return;
    setWorking(true);
    const { error } = await supabase.from("products").delete().in("id", Array.from(selected));
    setWorking(false);
    if (error) { setMsg(`Erreur: ${error.message}`); return; }
    setMsg(`${selected.size} produit(s) supprimé(s).`);
    setSelected(new Set());
    await load();
  }

  async function duplicate(p: ProductWithImages) {
    setWorking(true);
    const baseSlug = `${p.slug}-copie`;
    let slug = baseSlug;
    let n = 2;
    while (products.some((x) => x.slug === slug)) {
      slug = `${baseSlug}-${n++}`;
    }
    const { data: created, error } = await supabase
      .from("products")
      .insert({
        name: `${p.name} (copie)`,
        slug,
        category: p.category,
        short_description: p.short_description,
        description: p.description,
        story: p.story,
        price_fcfa: p.price_fcfa,
        price_usd: p.price_usd,
        price_eur: p.price_eur,
        stock: 0,
        sizes: p.sizes,
        colors: p.colors,
        fits: p.fits,
        lapels: p.lapels,
        linings: p.linings,
        details: p.details,
        sold_out_sizes: p.sold_out_sizes,
        monogram: p.monogram,
        fabric_composition: p.fabric_composition,
        fabric_mill: p.fabric_mill,
        fabric_notes: p.fabric_notes,
        fabric_weight: p.fabric_weight,
        is_published: false,
      })
      .select("id")
      .single();
    if (error || !created) {
      setWorking(false);
      setMsg(`Erreur: ${error?.message ?? "Duplication échouée"}`);
      return;
    }
    // Copy images
    if (p.images.length > 0) {
      await supabase.from("product_images").insert(
        p.images.map((img) => ({
          product_id: created.id,
          url: img.url,
          position: img.position,
          is_primary: img.is_primary,
        }))
      );
    }
    setWorking(false);
    setMsg(`"${p.name}" dupliqué.`);
    await load();
  }

  function exportCsv() {
    const headers = [
      "id", "name", "slug", "category", "is_published", "stock",
      "price_fcfa", "price_usd", "price_eur",
      "short_description", "description",
      "sizes", "colors",
      "primary_image",
    ];
    const rows = filtered.map((p) => [
      p.id, p.name, p.slug, p.category, p.is_published, p.stock,
      p.price_fcfa, p.price_usd, p.price_eur ?? "",
      p.short_description ?? "", p.description ?? "",
      (p.sizes ?? []).join("|"),
      (p.colors ?? []).join("|"),
      p.primaryImage,
    ]);
    const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `produits_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importCsv(file: File) {
    setWorking(true);
    setMsg(null);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) { setMsg("CSV vide"); return; }
      const head = parseCsvLine(lines[0]).map((s) => s.toLowerCase());
      const idx = (k: string) => head.indexOf(k);
      const iName = idx("name"), iSlug = idx("slug"), iCat = idx("category");
      const iFcfa = idx("price_fcfa"), iUsd = idx("price_usd"), iEur = idx("price_eur");
      const iStock = idx("stock"), iPub = idx("is_published");
      const iShort = idx("short_description"), iDesc = idx("description");
      const iSizes = idx("sizes"), iColors = idx("colors");
      if (iName < 0 || iCat < 0 || iFcfa < 0) {
        setMsg("Colonnes requises manquantes : name, category, price_fcfa");
        return;
      }
      let created = 0, updated = 0, errors = 0;
      for (let li = 1; li < lines.length; li++) {
        const cols = parseCsvLine(lines[li]);
        const name = cols[iName]?.trim();
        if (!name) continue;
        const slug = (iSlug >= 0 && cols[iSlug]?.trim()) || slugify(name);
        const payload = {
          name,
          slug,
          category: cols[iCat]?.trim(),
          price_fcfa: Number(cols[iFcfa] ?? 0) || 0,
          price_usd: iUsd >= 0 ? Number(cols[iUsd] ?? 0) || 0 : 0,
          price_eur: iEur >= 0 && cols[iEur] ? Number(cols[iEur]) : null,
          stock: iStock >= 0 ? Number(cols[iStock] ?? 0) || 0 : 0,
          is_published: iPub >= 0 ? /true|1|oui|yes/i.test(cols[iPub] ?? "") : false,
          short_description: iShort >= 0 ? cols[iShort] || null : null,
          description: iDesc >= 0 ? cols[iDesc] || null : null,
          sizes: iSizes >= 0 && cols[iSizes] ? cols[iSizes].split("|").filter(Boolean) : [],
          colors: iColors >= 0 && cols[iColors] ? cols[iColors].split("|").filter(Boolean) : [],
        };
        const { data: existing } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const upsertPayload = payload as any;
        if (existing?.id) {
          const { error } = await supabase.from("products").update(upsertPayload).eq("id", existing.id);
          if (error) errors++; else updated++;
        } else {
          const { error } = await supabase.from("products").insert(upsertPayload);
          if (error) errors++; else created++;
        }
      }
      setMsg(`Import : ${created} créé(s), ${updated} mis à jour, ${errors} erreur(s).`);
      await load();
    } finally {
      setWorking(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  if (loading || !user || !isAdmin) return null;

  const allChecked = filtered.length > 0 && selected.size === filtered.length;

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-hairline pb-8 mb-10">
          <div>
            <Link to="/admin" className="eyebrow text-[10px] text-bone/70 hover:text-bone">← Tableau de bord</Link>
            <h1 className="display text-4xl md:text-5xl mt-3">Catalogue</h1>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={exportCsv} className="luxury-btn">⬇ Export CSV</button>
            <button onClick={() => fileRef.current?.click()} className="luxury-btn">⬆ Import CSV</button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) void importCsv(f); }} />
            <Link to="/admin/products/new" className="luxury-btn luxury-btn-solid">+ Nouveau</Link>
          </div>
        </div>

        {msg && <div className="mb-4 text-emerald-300/80 text-sm">{msg}</div>}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 mb-6">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher (nom, slug)"
            className="bg-transparent border border-hairline px-4 py-3 text-sm text-bone placeholder:text-bone/40 focus:outline-none focus:border-bone/40" />
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="bg-ink border border-hairline px-4 py-3 text-sm text-bone">
            <option value="all">Toutes catégories</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={filterPub} onChange={(e) => setFilterPub(e.target.value as "all" | "published" | "draft")} className="bg-ink border border-hairline px-4 py-3 text-sm text-bone">
            <option value="all">Tous</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </select>
        </div>

        {selected.size > 0 && (
          <div className="border border-bone/40 bg-bone/[0.03] p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-bone text-sm">{selected.size} sélectionné(s)</div>
            <div className="flex gap-2 flex-wrap">
              <button disabled={working} onClick={() => bulkPublish(true)} className="luxury-btn text-xs">Publier</button>
              <button disabled={working} onClick={() => bulkPublish(false)} className="luxury-btn text-xs">Dépublier</button>
              <button disabled={working} onClick={bulkDelete} className="luxury-btn text-xs text-red-300/90">Supprimer</button>
              <button onClick={() => setSelected(new Set())} className="luxury-btn text-xs">Tout désélectionner</button>
            </div>
          </div>
        )}

        {busy ? (
          <div className="text-bone/60 py-12 text-center font-light">Chargement…</div>
        ) : (
          <div className="border border-hairline">
            <div className="grid grid-cols-[40px_64px_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-hairline eyebrow text-[10px] text-bone/50">
              <input type="checkbox" checked={allChecked} onChange={toggleAll} />
              <span></span>
              <span>Produit</span>
              <span>Prix</span>
              <span>Stock</span>
              <span>Statut</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-hairline">
              {filtered.length === 0 ? (
                <div className="p-12 text-center text-bone/50 font-light">Aucun produit.</div>
              ) : filtered.map((p) => (
                <div key={p.id} className="grid grid-cols-[40px_64px_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 items-center">
                  <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                  <div className="w-16 h-20 bg-secondary overflow-hidden">
                    <img src={p.primaryImage} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="font-serif text-bone">{p.name}</div>
                    <div className="text-bone/50 text-xs">{CATEGORY_LABELS[p.category]} · {p.slug}</div>
                  </div>
                  <div className="text-bone/70 text-sm font-light whitespace-nowrap">{formatPriceFcfa(p.price_fcfa)}</div>
                  <div className={`eyebrow text-[10px] ${p.stock === 0 ? "text-red-300/80" : "text-bone/60"}`}>{p.stock}</div>
                  <div className="eyebrow text-[10px]">
                    {p.is_published ? <span className="text-emerald-300/90">Publié</span> : <span className="text-bone/50">Brouillon</span>}
                  </div>
                  <div className="flex gap-3">
                    <Link to="/admin/products/$id" params={{ id: p.id }} className="eyebrow text-[10px] text-bone hover:text-bone/70">Éditer</Link>
                    <button onClick={() => duplicate(p)} disabled={working} className="eyebrow text-[10px] text-bone/70 hover:text-bone">Dupliquer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else cur += c;
    } else {
      if (c === ',') { out.push(cur); cur = ""; }
      else if (c === '"') inQ = true;
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}
