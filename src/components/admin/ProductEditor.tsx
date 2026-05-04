import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ALL_CATEGORIES, ALL_SIZES, CATEGORY_LABELS, getProductById, type ProductWithImages, type ProductVariantRow, type ProductVideoRow } from "@/lib/products";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Enums"]["product_category"];

type FormState = {
  name: string;
  slug: string;
  category: Category;
  short_description: string;
  description: string;
  story: string;
  price_fcfa: number;
  price_usd: number;
  price_eur: number;
  stock: number;
  is_published: boolean;
  monogram: boolean;
  fabric_composition: string;
  fabric_weight: string;
  fabric_mill: string;
  fabric_notes: string;
  sizes: string[];
  sold_out_sizes: string[];
  fits: string[];
  lapels: string[];
  linings: string[];
  colors: string[];
  details: string[];
};

const EMPTY: FormState = {
  name: "", slug: "", category: "suits",
  short_description: "", description: "", story: "",
  price_fcfa: 0, price_usd: 0, price_eur: 0, stock: 0,
  is_published: true, monogram: false,
  fabric_composition: "", fabric_weight: "", fabric_mill: "", fabric_notes: "",
  sizes: [], sold_out_sizes: [], fits: [], lapels: [], linings: [], colors: [], details: [],
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function fromProduct(p: ProductWithImages): FormState {
  return {
    name: p.name, slug: p.slug, category: p.category,
    short_description: p.short_description ?? "",
    description: p.description ?? "",
    story: p.story ?? "",
    price_fcfa: p.price_fcfa, price_usd: p.price_usd, price_eur: p.price_eur,
    stock: p.stock, is_published: p.is_published, monogram: p.monogram,
    fabric_composition: p.fabric_composition ?? "", fabric_weight: p.fabric_weight ?? "",
    fabric_mill: p.fabric_mill ?? "", fabric_notes: p.fabric_notes ?? "",
    sizes: p.sizes ?? [], sold_out_sizes: p.sold_out_sizes ?? [],
    fits: p.fits ?? [], lapels: p.lapels ?? [], linings: p.linings ?? [],
    colors: p.colors ?? [], details: p.details ?? [],
  };
}

type ImageItem = {
  id?: string;
  url: string;
  is_primary: boolean;
  position: number;
  variant_id: string | null;          // existing DB id (if image still attached to a saved variant)
  variant_key: string | null;         // stable local key matching VariantDraft.key
};

type VariantDraft = {
  id?: string;
  key: string;                         // stable local key (used to link images even before save)
  size: string;
  color: string;
  sku: string;
  stock: number;
  price_fcfa: number | null;
  is_available: boolean;
};

const newKey = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `k_${Math.random().toString(36).slice(2)}`);

type VideoDraft = {
  id?: string;
  url: string;
  poster_url: string;
  source: string;
};

export function ProductEditor({ productId }: { productId?: string }) {
  const navigate = useNavigate();
  const isEdit = Boolean(productId);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [variants, setVariants] = useState<VariantDraft[]>([]);
  const [videos, setVideos] = useState<VideoDraft[]>([]);
  const [uploading, setUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    void getProductById(productId).then((p) => {
      if (cancelled || !p) { setLoading(false); return; }
      setForm(fromProduct(p));
      const variantKeyById = new Map<string, string>();
      const loadedVariants = (p.variants ?? []).map((v: ProductVariantRow) => {
        const key = newKey();
        variantKeyById.set(v.id, key);
        return {
          id: v.id, key,
          size: v.size ?? "", color: v.color ?? "", sku: v.sku ?? "",
          stock: v.stock, price_fcfa: v.price_fcfa, is_available: v.is_available,
        } as VariantDraft;
      });
      setVariants(loadedVariants);
      setImages(p.images.map((i) => ({
        id: i.id, url: i.url, is_primary: i.is_primary, position: i.position,
        variant_id: i.variant_id,
        variant_key: i.variant_id ? (variantKeyById.get(i.variant_id) ?? null) : null,
      })));
      setVideos((p.videos ?? []).map((v: ProductVideoRow) => ({
        id: v.id, url: v.url, poster_url: v.poster_url ?? "", source: v.source,
      })));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [productId]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleArr = (key: keyof FormState, value: string) => {
    setForm((f) => {
      const arr = (f[key] as string[]) ?? [];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...f, [key]: next } as FormState;
    });
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploads: ImageItem[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, {
          cacheControl: "3600", upsert: false, contentType: file.type,
        });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
        uploads.push({ url: pub.publicUrl, is_primary: false, position: 0, variant_id: null, variant_key: null });
      }
      setImages((prev) => {
        const next = [...prev, ...uploads];
        if (!next.some((i) => i.is_primary) && next.length > 0) next[0].is_primary = true;
        return next.map((i, idx) => ({ ...i, position: idx }));
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setVideoUploading(true);
    try {
      const uploads: VideoDraft[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "mp4";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-videos").upload(path, file, {
          cacheControl: "3600", upsert: false, contentType: file.type,
        });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("product-videos").getPublicUrl(path);
        uploads.push({ url: pub.publicUrl, poster_url: "", source: "upload" });
      }
      setVideos((prev) => [...prev, ...uploads]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur upload vidéo");
    } finally {
      setVideoUploading(false);
    }
  };

  const setPrimary = (idx: number) =>
    setImages((prev) => prev.map((i, k) => ({ ...i, is_primary: k === idx })));
  const removeImage = (idx: number) =>
    setImages((prev) => {
      const next = prev.filter((_, k) => k !== idx).map((i, k) => ({ ...i, position: k }));
      if (!next.some((i) => i.is_primary) && next.length > 0) next[0].is_primary = true;
      return next;
    });

  // Variants
  const addVariant = () => setVariants((v) => [...v, { key: newKey(), size: "", color: "", sku: "", stock: 0, price_fcfa: null, is_available: true }]);
  const updateVariant = (idx: number, patch: Partial<VariantDraft>) =>
    setVariants((vs) => vs.map((v, i) => i === idx ? { ...v, ...patch } : v));
  const removeVariant = (idx: number) => {
    const removed = variants[idx];
    setVariants((vs) => vs.filter((_, i) => i !== idx));
    if (removed) {
      setImages((prev) => prev.map((img) => img.variant_key === removed.key ? { ...img, variant_key: null, variant_id: null } : img));
    }
  };

  // Videos
  const addVideoUrl = () => setVideos((v) => [...v, { url: "", poster_url: "", source: "external" }]);
  const updateVideo = (idx: number, patch: Partial<VideoDraft>) =>
    setVideos((vs) => vs.map((v, i) => i === idx ? { ...v, ...patch } : v));
  const removeVideo = (idx: number) => setVideos((vs) => vs.filter((_, i) => i !== idx));

  const validate = (): string | null => {
    if (!form.name.trim()) return "Le nom est requis.";
    if (form.price_fcfa <= 0 || form.price_usd <= 0 || form.price_eur <= 0) {
      return "Les prix de base doivent être strictement supérieurs à 0.";
    }
    if (form.stock < 0) return "Le stock global ne peut pas être négatif.";

    // Variant validation
    const seen = new Map<string, number>();
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.size && !v.color) {
        return `Variante #${i + 1} : renseignez au moins une taille ou une couleur.`;
      }
      const k = `${(v.size || "").trim().toLowerCase()}|${(v.color || "").trim().toLowerCase()}`;
      if (seen.has(k)) {
        return `Doublon de variante taille/couleur : "${v.size || "—"} / ${v.color || "—"}" (lignes ${seen.get(k)! + 1} et ${i + 1}).`;
      }
      seen.set(k, i);
      if (v.stock < 0) return `Variante #${i + 1} : stock négatif interdit.`;
      if (v.is_available && v.stock <= 0) {
        return `Variante #${i + 1} (${v.size || "—"}/${v.color || "—"}) : marquée disponible mais stock à 0. Décochez "Dispo" ou ajustez le stock.`;
      }
      if (v.price_fcfa !== null) {
        if (v.price_fcfa <= 0) return `Variante #${i + 1} : prix override invalide.`;
        if (v.price_fcfa < Math.floor(form.price_fcfa * 0.3) || v.price_fcfa > Math.ceil(form.price_fcfa * 3)) {
          return `Variante #${i + 1} : prix override (${v.price_fcfa}) trop éloigné du prix de base (${form.price_fcfa}). Vérifiez.`;
        }
      }
    }

    // Images: variant_key must reference an existing variant
    const variantKeys = new Set(variants.map((v) => v.key));
    for (const img of images) {
      if (img.variant_key && !variantKeys.has(img.variant_key)) {
        return "Une image est rattachée à une variante supprimée. Réassignez-la avant d'enregistrer.";
      }
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setSaving(true);
    try {
      const slug = form.slug || slugify(form.name);
      const payload = { ...form, slug };

      let id = productId;
      if (isEdit && id) {
        const { error: upErr } = await supabase.from("products").update(payload).eq("id", id);
        if (upErr) throw upErr;
      } else {
        const { data, error: insErr } = await supabase.from("products").insert(payload).select("id").single();
        if (insErr) throw insErr;
        id = data.id;
      }
      if (!id) throw new Error("Produit non créé");

      // Replace variants (delete + insert) and map local key → new DB id
      await supabase.from("product_variants").delete().eq("product_id", id);
      const keyToDbId = new Map<string, string>();
      if (variants.length > 0) {
        const rows = variants.map((v, idx) => ({
          product_id: id!,
          size: v.size || null,
          color: v.color || null,
          sku: v.sku || null,
          stock: v.stock,
          price_fcfa: v.price_fcfa ?? null,
          is_available: v.is_available,
          position: idx,
        }));
        const { data: inserted, error: vErr } = await supabase.from("product_variants").insert(rows).select("id");
        if (vErr) throw vErr;
        (inserted ?? []).forEach((row, i) => keyToDbId.set(variants[i].key, row.id));
      }

      // Replace images, resolving variant_id from the stable variant_key
      await supabase.from("product_images").delete().eq("product_id", id);
      if (images.length > 0) {
        const imgRows = images.map((img, idx) => ({
          product_id: id!,
          url: img.url,
          is_primary: img.is_primary,
          position: idx,
          variant_id: img.variant_key ? (keyToDbId.get(img.variant_key) ?? null) : null,
        }));
        const { error: imgErr } = await supabase.from("product_images").insert(imgRows);
        if (imgErr) throw imgErr;
      }

      // Replace videos
      await supabase.from("product_videos").delete().eq("product_id", id);
      if (videos.length > 0) {
        const vidRows = videos
          .filter((v) => v.url.trim())
          .map((v, idx) => ({
            product_id: id!,
            url: v.url.trim(),
            poster_url: v.poster_url.trim() || null,
            source: v.source,
            position: idx,
          }));
        if (vidRows.length > 0) {
          const { error: vidErr } = await supabase.from("product_videos").insert(vidRows);
          if (vidErr) throw vidErr;
        }
      }

      navigate({ to: "/admin" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'enregistrement");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!productId) return;
    if (!confirm("Supprimer ce produit définitivement ?")) return;
    setSaving(true);
    const { error: delErr } = await supabase.from("products").delete().eq("id", productId);
    if (delErr) { setError(delErr.message); setSaving(false); return; }
    navigate({ to: "/admin" });
  };

  if (loading) {
    return <div className="pt-40 pb-32 px-6 bg-ink min-h-screen text-center text-bone/60">Chargement…</div>;
  }

  return (
    <div className="pt-32 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        <div className="border-b border-hairline pb-6 mb-10 flex items-center justify-between">
          <div>
            <div className="eyebrow text-bone/60 mb-3">— {isEdit ? "Édition" : "Nouveau produit"} —</div>
            <h1 className="display text-3xl md:text-4xl">{form.name || "Produit sans nom"}</h1>
          </div>
          <Link to="/admin" className="luxury-btn">← Retour</Link>
        </div>

        {error && (
          <div className="border border-red-500/40 bg-red-500/10 text-red-300 px-5 py-3 mb-8 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1.2fr_1fr] gap-12">
          {/* Left column */}
          <div className="space-y-10">
            <Section title="Identité">
              <Field label="Nom">
                <input value={form.name} onChange={(e) => update("name", e.target.value)} required className={inp} />
              </Field>
              <Field label="Slug (URL)">
                <input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder={slugify(form.name)} className={inp} />
              </Field>
              <Field label="Catégorie">
                <select value={form.category} onChange={(e) => update("category", e.target.value as Category)} className={inp}>
                  {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
              </Field>
              <Field label="Description courte">
                <input value={form.short_description} onChange={(e) => update("short_description", e.target.value)} className={inp} />
              </Field>
              <Field label="Description">
                <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} className={inp} />
              </Field>
              <Field label="Histoire / Story">
                <textarea value={form.story} onChange={(e) => update("story", e.target.value)} rows={3} className={inp} />
              </Field>
            </Section>

            <Section title="Variantes (taille / couleur / stock)">
              <p className="text-bone/50 text-xs mb-3 leading-relaxed">
                Les variantes pilotent le stock fin par taille/couleur et peuvent surcharger le prix de base. Si vide, le stock global est utilisé.
              </p>
              <div className="space-y-3">
                {variants.map((v, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 border border-hairline p-3 items-center">
                    <input placeholder="Taille" value={v.size} onChange={(e) => updateVariant(idx, { size: e.target.value })} className={`${inp} col-span-2`} />
                    <input placeholder="Couleur" value={v.color} onChange={(e) => updateVariant(idx, { color: e.target.value })} className={`${inp} col-span-2`} />
                    <input placeholder="SKU" value={v.sku} onChange={(e) => updateVariant(idx, { sku: e.target.value })} className={`${inp} col-span-2`} />
                    <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => updateVariant(idx, { stock: Number(e.target.value) })} className={`${inp} col-span-2`} />
                    <input type="number" placeholder="Prix FCFA" value={v.price_fcfa ?? ""} onChange={(e) => updateVariant(idx, { price_fcfa: e.target.value ? Number(e.target.value) : null })} className={`${inp} col-span-2`} />
                    <label className="flex items-center gap-1 text-[10px] text-bone/70 col-span-1">
                      <input type="checkbox" checked={v.is_available} onChange={(e) => updateVariant(idx, { is_available: e.target.checked })} />
                      Dispo
                    </label>
                    <button type="button" onClick={() => removeVariant(idx)} className="text-bone/50 hover:text-red-400 col-span-1 text-right">✕</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addVariant} className="luxury-btn mt-3">+ Ajouter une variante</button>
            </Section>

            <Section title="Vidéos">
              <p className="text-bone/50 text-xs mb-3 leading-relaxed">
                Uploadez un MP4 ou collez une URL YouTube/Vimeo. Plusieurs vidéos possibles.
              </p>
              <div className="border border-dashed border-hairline p-5 text-center mb-4">
                <input id="vid-upload" type="file" accept="video/*" multiple onChange={(e) => handleVideoUpload(e.target.files)} className="hidden" />
                <label htmlFor="vid-upload" className="luxury-btn cursor-pointer inline-block mr-3">
                  {videoUploading ? "Upload…" : "+ Upload vidéo"}
                </label>
                <button type="button" onClick={addVideoUrl} className="luxury-btn">+ Ajouter URL</button>
              </div>
              <div className="space-y-3">
                {videos.map((v, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 border border-hairline p-3 items-center">
                    <input placeholder="URL vidéo (MP4 / YouTube / Vimeo)" value={v.url} onChange={(e) => updateVideo(idx, { url: e.target.value })} className={`${inp} col-span-7`} />
                    <input placeholder="Poster URL (optionnel)" value={v.poster_url} onChange={(e) => updateVideo(idx, { poster_url: e.target.value })} className={`${inp} col-span-3`} />
                    <select value={v.source} onChange={(e) => updateVideo(idx, { source: e.target.value })} className={`${inp} col-span-1`}>
                      <option value="upload">upload</option>
                      <option value="youtube">youtube</option>
                      <option value="vimeo">vimeo</option>
                      <option value="external">externe</option>
                    </select>
                    <button type="button" onClick={() => removeVideo(idx)} className="text-bone/50 hover:text-red-400 col-span-1 text-right">✕</button>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Tailles & options (legacy / fallback)">
              <p className="text-bone/50 text-xs mb-3 leading-relaxed">
                Utilisé si vous n'avez pas de variantes. Sinon, les tailles/couleurs sont dérivées des variantes.
              </p>
              <Field label="Tailles disponibles">
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((s) => (
                    <Toggle key={s} active={form.sizes.includes(s)} onClick={() => toggleArr("sizes", s)}>{s}</Toggle>
                  ))}
                </div>
              </Field>
              <Field label="Tailles épuisées">
                {form.sizes.length === 0 ? (
                  <p className="text-bone/50 text-xs">Sélectionnez d'abord les tailles.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {form.sizes.map((s) => (
                      <Toggle key={s} active={form.sold_out_sizes.includes(s)} onClick={() => toggleArr("sold_out_sizes", s)} variant="warn">{s}</Toggle>
                    ))}
                  </div>
                )}
              </Field>
              <ListField label="Fits" values={form.fits} onChange={(v) => update("fits", v)} placeholder="Slim, Classic..." />
              <ListField label="Revers (lapels)" values={form.lapels} onChange={(v) => update("lapels", v)} placeholder="Notch, Peak..." />
              <ListField label="Doublures (linings)" values={form.linings} onChange={(v) => update("linings", v)} placeholder="Cupro Bordeaux..." />
              <ListField label="Couleurs (legacy)" values={form.colors} onChange={(v) => update("colors", v)} placeholder="Onyx, Ivory..." />
              <ListField label="Détails" values={form.details} onChange={(v) => update("details", v)} placeholder="Boutonnières à la main..." />
              <label className="flex items-center gap-3 text-sm text-bone/80 mt-4">
                <input type="checkbox" checked={form.monogram} onChange={(e) => update("monogram", e.target.checked)} />
                Monogramme proposé
              </label>
            </Section>

            <Section title="Tissu">
              <Field label="Composition"><input value={form.fabric_composition} onChange={(e) => update("fabric_composition", e.target.value)} className={inp} /></Field>
              <Field label="Poids"><input value={form.fabric_weight} onChange={(e) => update("fabric_weight", e.target.value)} className={inp} /></Field>
              <Field label="Manufacture (mill)"><input value={form.fabric_mill} onChange={(e) => update("fabric_mill", e.target.value)} className={inp} /></Field>
              <Field label="Notes"><textarea value={form.fabric_notes} onChange={(e) => update("fabric_notes", e.target.value)} rows={2} className={inp} /></Field>
            </Section>
          </div>

          {/* Right column */}
          <div className="space-y-10">
            <Section title="Images">
              <div className="border border-dashed border-hairline p-6 text-center">
                <input id="img-upload" type="file" accept="image/*" multiple onChange={(e) => handleUpload(e.target.files)} className="hidden" />
                <label htmlFor="img-upload" className="luxury-btn cursor-pointer inline-block">
                  {uploading ? "Upload en cours…" : "+ Ajouter des images"}
                </label>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group border border-hairline">
                      <img src={img.url} alt="" className="aspect-[4/5] w-full object-cover" />
                      <div className="absolute inset-x-0 top-0 bg-ink/85 px-2 py-1.5 flex justify-between items-center text-[10px]">
                        <select
                          value={img.variant_key ?? ""}
                          onChange={(e) => setImages((prev) => prev.map((p, k) => k === idx ? { ...p, variant_key: e.target.value || null, variant_id: null } : p))}
                          className="bg-transparent text-bone/70 text-[10px] border-0 focus:outline-none"
                        >
                          <option value="">Toutes variantes</option>
                          {variants.map((v) => (
                            <option key={v.key} value={v.key}>{v.color || "—"} / {v.size || "—"}</option>
                          ))}
                        </select>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-ink/85 px-2 py-1.5 flex justify-between items-center text-[10px]">
                        <button type="button" onClick={() => setPrimary(idx)} className={`eyebrow ${img.is_primary ? "text-bone" : "text-bone/50 hover:text-bone"}`}>
                          {img.is_primary ? "★ Principal" : "Définir"}
                        </button>
                        <button type="button" onClick={() => removeImage(idx)} className="text-bone/60 hover:text-red-400">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Prix & stock">
              <Field label="Prix FCFA"><input type="number" min={0} value={form.price_fcfa} onChange={(e) => update("price_fcfa", Number(e.target.value))} required className={inp} /></Field>
              <Field label="Prix USD"><input type="number" min={0} value={form.price_usd} onChange={(e) => update("price_usd", Number(e.target.value))} required className={inp} /></Field>
              <Field label="Prix EUR"><input type="number" min={0} value={form.price_eur} onChange={(e) => update("price_eur", Number(e.target.value))} required className={inp} /></Field>
              <Field label="Stock global (fallback)"><input type="number" min={0} value={form.stock} onChange={(e) => update("stock", Number(e.target.value))} className={inp} /></Field>
              <label className="flex items-center gap-3 text-sm text-bone/80 mt-2">
                <input type="checkbox" checked={form.is_published} onChange={(e) => update("is_published", e.target.checked)} />
                Publié (visible dans la collection)
              </label>
            </Section>

            <div className="space-y-3 sticky top-32">
              <button type="submit" disabled={saving} className="luxury-btn luxury-btn-solid w-full">
                {saving ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer le produit"}
              </button>
              {isEdit && (
                <button type="button" onClick={handleDelete} disabled={saving} className="luxury-btn w-full text-red-400 hover:text-red-300">
                  Supprimer le produit
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const inp = "w-full bg-transparent border border-hairline px-3 py-2 text-bone text-sm focus:outline-none focus:border-bone transition-colors";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-hairline p-6">
      <h2 className="display text-xl mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow text-bone/60 text-[10px] mb-2">{label}</div>
      {children}
    </div>
  );
}

function Toggle({
  active, onClick, children, variant = "default",
}: { active: boolean; onClick: () => void; children: React.ReactNode; variant?: "default" | "warn" }) {
  const activeCls = variant === "warn"
    ? "border-red-400 bg-red-500/15 text-red-200"
    : "border-bone bg-bone text-ink";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase border transition-colors ${
        active ? activeCls : "border-hairline text-bone/70 hover:border-bone"
      }`}
    >
      {children}
    </button>
  );
}

function ListField({
  label, values, onChange, placeholder,
}: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (!values.includes(v)) onChange([...values, v]);
    setDraft("");
  };
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className={inp}
        />
        <button type="button" onClick={add} className="luxury-btn px-4 text-xs whitespace-nowrap">+ Ajouter</button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {values.map((v) => (
            <span key={v} className="border border-hairline px-3 py-1 text-[11px] tracking-[0.15em] uppercase text-bone/80 flex items-center gap-2">
              {v}
              <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="text-bone/50 hover:text-red-400">✕</button>
            </span>
          ))}
        </div>
      )}
    </Field>
  );
}
