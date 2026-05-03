import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
<<<<<<< HEAD
import { ALL_CATEGORIES, ALL_SIZES, CATEGORY_LABELS, getProductById, type ProductWithImages } from "@/lib/products";
=======
import {
  ALL_CATEGORIES,
  ALL_SIZES,
  CATEGORY_LABELS,
  getProductById,
  type ProductWithImages,
} from "@/lib/products";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
  name: "",
  slug: "",
  category: "suits",
  short_description: "",
  description: "",
  story: "",
  price_fcfa: 0,
  price_usd: 0,
  price_eur: 0,
  stock: 0,
  is_published: true,
  monogram: false,
  fabric_composition: "",
  fabric_weight: "",
  fabric_mill: "",
  fabric_notes: "",
  sizes: [],
  sold_out_sizes: [],
  fits: [],
  lapels: [],
  linings: [],
  colors: [],
  details: [],
};

const slugify = (s: string) =>
<<<<<<< HEAD
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
=======
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

function fromProduct(p: ProductWithImages): FormState {
  return {
    name: p.name,
    slug: p.slug,
    category: p.category,
    short_description: p.short_description ?? "",
    description: p.description ?? "",
    story: p.story ?? "",
    price_fcfa: p.price_fcfa,
    price_usd: p.price_usd,
    price_eur: p.price_eur,
    stock: p.stock,
    is_published: p.is_published,
    monogram: p.monogram,
    fabric_composition: p.fabric_composition ?? "",
    fabric_weight: p.fabric_weight ?? "",
    fabric_mill: p.fabric_mill ?? "",
    fabric_notes: p.fabric_notes ?? "",
    sizes: p.sizes ?? [],
    sold_out_sizes: p.sold_out_sizes ?? [],
    fits: p.fits ?? [],
    lapels: p.lapels ?? [],
    linings: p.linings ?? [],
    colors: p.colors ?? [],
    details: p.details ?? [],
  };
}

<<<<<<< HEAD
type ImageItem = { id?: string; url: string; is_primary: boolean; position: number; isNew?: boolean };
=======
type ImageItem = {
  id?: string;
  url: string;
  is_primary: boolean;
  position: number;
  isNew?: boolean;
};
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

export function ProductEditor({ productId }: { productId?: string }) {
  const navigate = useNavigate();
  const isEdit = Boolean(productId);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [images, setImages] = useState<ImageItem[]>([]);
<<<<<<< HEAD
=======
  const [initialImageUrls, setInitialImageUrls] = useState<string[]>([]);
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    void getProductById(productId).then((p) => {
<<<<<<< HEAD
      if (cancelled || !p) { setLoading(false); return; }
      setForm(fromProduct(p));
      setImages(p.images.map((i) => ({ id: i.id, url: i.url, is_primary: i.is_primary, position: i.position })));
      setLoading(false);
    });
    return () => { cancelled = true; };
=======
      if (cancelled || !p) {
        setLoading(false);
        return;
      }
      setForm(fromProduct(p));
      const loaded = p.images.map((i) => ({
        id: i.id,
        url: i.url,
        is_primary: i.is_primary,
        position: i.position,
      }));
      setImages(loaded);
      setInitialImageUrls(loaded.map((i) => i.url));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  }, [productId]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleArr = (key: keyof FormState, value: string) => {
    setForm((f) => {
      const arr = (f[key] as string[]) ?? [];
<<<<<<< HEAD
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
=======
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
        uploads.push({ url: pub.publicUrl, is_primary: false, position: 0, isNew: true });
      }
      setImages((prev) => {
        const next = [...prev, ...uploads];
        if (!next.some((i) => i.is_primary) && next.length > 0) next[0].is_primary = true;
=======
        const { error: upErr } = await supabase.storage
          .from("product-images")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);
        uploads.push({
          url: pub.publicUrl,
          is_primary: false,
          position: 0,
          isNew: true,
        });
      }
      setImages((prev) => {
        const next = [...prev, ...uploads];
        if (!next.some((i) => i.is_primary) && next.length > 0)
          next[0].is_primary = true;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
        return next.map((i, idx) => ({ ...i, position: idx }));
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur upload image");
    } finally {
      setUploading(false);
    }
  };

  const setPrimary = (idx: number) =>
    setImages((prev) => prev.map((i, k) => ({ ...i, is_primary: k === idx })));

  const removeImage = (idx: number) =>
    setImages((prev) => {
<<<<<<< HEAD
      const next = prev.filter((_, k) => k !== idx).map((i, k) => ({ ...i, position: k }));
      if (!next.some((i) => i.is_primary) && next.length > 0) next[0].is_primary = true;
=======
      const removed = prev[idx];
      if (removed?.isNew) {
        const path = getStoragePathFromPublicUrl(removed.url);
        if (path) {
          void supabase.storage
            .from("product-images")
            .remove([path])
            .then(({ error: rmErr }) => {
              if (rmErr) setError(rmErr.message);
            });
        }
      }
      const next = prev
        .filter((_, k) => k !== idx)
        .map((i, k) => ({ ...i, position: k }));
      if (!next.some((i) => i.is_primary) && next.length > 0)
        next[0].is_primary = true;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      return next;
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const slug = form.slug || slugify(form.name);
      const payload = { ...form, slug };

      let id = productId;
      if (isEdit && id) {
<<<<<<< HEAD
        const { error: upErr } = await supabase.from("products").update(payload).eq("id", id);
        if (upErr) throw upErr;
        // Replace images: delete existing rows, re-insert
        const { error: delErr } = await supabase.from("product_images").delete().eq("product_id", id);
        if (delErr) throw delErr;
      } else {
        const { data, error: insErr } = await supabase.from("products").insert(payload).select("id").single();
=======
        const { error: upErr } = await supabase
          .from("products")
          .update(payload)
          .eq("id", id);
        if (upErr) throw upErr;
        // Replace images: delete existing rows, re-insert
        const { error: delErr } = await supabase
          .from("product_images")
          .delete()
          .eq("product_id", id);
        if (delErr) throw delErr;
      } else {
        const { data, error: insErr } = await supabase
          .from("products")
          .insert(payload)
          .select("id")
          .single();
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
        if (insErr) throw insErr;
        id = data.id;
      }

      if (id && images.length > 0) {
        const rows = images.map((img, idx) => ({
          product_id: id!,
          url: img.url,
          is_primary: img.is_primary,
          position: idx,
        }));
<<<<<<< HEAD
        const { error: imgErr } = await supabase.from("product_images").insert(rows);
        if (imgErr) throw imgErr;
      }

=======
        const { error: imgErr } = await supabase
          .from("product_images")
          .insert(rows);
        if (imgErr) throw imgErr;
      }

      const removedUrls = initialImageUrls.filter(
        (url) => !images.some((img) => img.url === url),
      );
      if (removedUrls.length > 0) {
        const paths = removedUrls
          .map(getStoragePathFromPublicUrl)
          .filter((p): p is string => Boolean(p));
        if (paths.length > 0) {
          const { error: rmErr } = await supabase.storage
            .from("product-images")
            .remove(paths);
          if (rmErr) throw rmErr;
        }
      }

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
    const { error: delErr } = await supabase.from("products").delete().eq("id", productId);
    if (delErr) { setError(delErr.message); setSaving(false); return; }
=======
    const paths = images
      .map((img) => getStoragePathFromPublicUrl(img.url))
      .filter((p): p is string => Boolean(p));
    if (paths.length > 0) {
      const { error: rmErr } = await supabase.storage
        .from("product-images")
        .remove(paths);
      if (rmErr) {
        setError(rmErr.message);
        setSaving(false);
        return;
      }
    }
    const { error: delErr } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    if (delErr) {
      setError(delErr.message);
      setSaving(false);
      return;
    }
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    navigate({ to: "/admin" });
  };

  if (loading) {
<<<<<<< HEAD
    return <div className="pt-40 pb-32 px-6 bg-ink min-h-screen text-center text-bone/60">Chargement…</div>;
=======
    return (
      <div className="pt-40 pb-32 px-6 bg-ink min-h-screen text-center text-bone/60">
        Chargement…
      </div>
    );
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  }

  return (
    <div className="pt-32 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        <div className="border-b border-hairline pb-6 mb-10 flex items-center justify-between">
          <div>
<<<<<<< HEAD
            <div className="eyebrow text-bone/60 mb-3">— {isEdit ? "Édition" : "Nouveau produit"} —</div>
            <h1 className="display text-3xl md:text-4xl">{form.name || "Produit sans nom"}</h1>
          </div>
          <Link to="/admin" className="luxury-btn">← Retour</Link>
        </div>

        {error && (
          <div className="border border-red-500/40 bg-red-500/10 text-red-300 px-5 py-3 mb-8 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1.2fr_1fr] gap-12">
=======
            <div className="eyebrow text-bone/60 mb-3">
              — {isEdit ? "Édition" : "Nouveau produit"} —
            </div>
            <h1 className="display text-3xl md:text-4xl">
              {form.name || "Produit sans nom"}
            </h1>
          </div>
          <Link to="/admin" className="luxury-btn">
            ← Retour
          </Link>
        </div>

        {error && (
          <div className="border border-red-500/40 bg-red-500/10 text-red-300 px-5 py-3 mb-8 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-[1.2fr_1fr] gap-12"
        >
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
          {/* Left column */}
          <div className="space-y-10">
            <Section title="Identité">
              <Field label="Nom">
<<<<<<< HEAD
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
=======
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                  className={inp}
                />
              </Field>
              <Field label="Slug (URL)">
                <input
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  placeholder={slugify(form.name)}
                  className={inp}
                />
              </Field>
              <Field label="Catégorie">
                <select
                  value={form.category}
                  onChange={(e) =>
                    update("category", e.target.value as Category)
                  }
                  className={inp}
                >
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Description courte">
                <input
                  value={form.short_description}
                  onChange={(e) => update("short_description", e.target.value)}
                  className={inp}
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  className={inp}
                />
              </Field>
              <Field label="Histoire / Story">
                <textarea
                  value={form.story}
                  onChange={(e) => update("story", e.target.value)}
                  rows={3}
                  className={inp}
                />
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
              </Field>
            </Section>

            <Section title="Tailles & options">
              <Field label="Tailles disponibles">
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((s) => (
<<<<<<< HEAD
                    <Toggle key={s} active={form.sizes.includes(s)} onClick={() => toggleArr("sizes", s)}>{s}</Toggle>
=======
                    <Toggle
                      key={s}
                      active={form.sizes.includes(s)}
                      onClick={() => toggleArr("sizes", s)}
                    >
                      {s}
                    </Toggle>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                  ))}
                </div>
              </Field>

              <Field label="Tailles épuisées (Sold out)">
                {form.sizes.length === 0 ? (
<<<<<<< HEAD
                  <p className="text-bone/50 text-xs">Sélectionnez d'abord les tailles disponibles.</p>
=======
                  <p className="text-bone/50 text-xs">
                    Sélectionnez d'abord les tailles disponibles.
                  </p>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {form.sizes.map((s) => (
                      <Toggle
                        key={s}
                        active={form.sold_out_sizes.includes(s)}
                        onClick={() => toggleArr("sold_out_sizes", s)}
                        variant="warn"
                      >
                        {s}
                      </Toggle>
                    ))}
                  </div>
                )}
                <p className="text-bone/40 text-[11px] mt-2 leading-relaxed">
<<<<<<< HEAD
                  Les tailles cochées resteront affichées sur la fiche produit avec la mention "Sold out" et seront désactivées au panier.
                </p>
              </Field>

              <ListField label="Fits" values={form.fits} onChange={(v) => update("fits", v)} placeholder="Slim, Classic..." />
              <ListField label="Revers (lapels)" values={form.lapels} onChange={(v) => update("lapels", v)} placeholder="Notch, Peak..." />
              <ListField label="Doublures (linings)" values={form.linings} onChange={(v) => update("linings", v)} placeholder="Cupro Bordeaux..." />
              <ListField label="Couleurs" values={form.colors} onChange={(v) => update("colors", v)} placeholder="Onyx, Ivory..." />
              <ListField label="Détails" values={form.details} onChange={(v) => update("details", v)} placeholder="Boutonnières à la main..." />

              <label className="flex items-center gap-3 text-sm text-bone/80 mt-4">
                <input type="checkbox" checked={form.monogram} onChange={(e) => update("monogram", e.target.checked)} />
=======
                  Les tailles cochées resteront affichées sur la fiche produit
                  avec la mention "Sold out" et seront désactivées au panier.
                </p>
              </Field>

              <ListField
                label="Fits"
                values={form.fits}
                onChange={(v) => update("fits", v)}
                placeholder="Slim, Classic..."
              />
              <ListField
                label="Revers (lapels)"
                values={form.lapels}
                onChange={(v) => update("lapels", v)}
                placeholder="Notch, Peak..."
              />
              <ListField
                label="Doublures (linings)"
                values={form.linings}
                onChange={(v) => update("linings", v)}
                placeholder="Cupro Bordeaux..."
              />
              <ListField
                label="Couleurs"
                values={form.colors}
                onChange={(v) => update("colors", v)}
                placeholder="Onyx, Ivory..."
              />
              <ListField
                label="Détails"
                values={form.details}
                onChange={(v) => update("details", v)}
                placeholder="Boutonnières à la main..."
              />

              <label className="flex items-center gap-3 text-sm text-bone/80 mt-4">
                <input
                  type="checkbox"
                  checked={form.monogram}
                  onChange={(e) => update("monogram", e.target.checked)}
                />
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                Monogramme proposé
              </label>
            </Section>

            <Section title="Tissu">
<<<<<<< HEAD
              <Field label="Composition"><input value={form.fabric_composition} onChange={(e) => update("fabric_composition", e.target.value)} className={inp} /></Field>
              <Field label="Poids"><input value={form.fabric_weight} onChange={(e) => update("fabric_weight", e.target.value)} className={inp} /></Field>
              <Field label="Manufacture (mill)"><input value={form.fabric_mill} onChange={(e) => update("fabric_mill", e.target.value)} className={inp} /></Field>
              <Field label="Notes"><textarea value={form.fabric_notes} onChange={(e) => update("fabric_notes", e.target.value)} rows={2} className={inp} /></Field>
=======
              <Field label="Composition">
                <input
                  value={form.fabric_composition}
                  onChange={(e) => update("fabric_composition", e.target.value)}
                  className={inp}
                />
              </Field>
              <Field label="Poids">
                <input
                  value={form.fabric_weight}
                  onChange={(e) => update("fabric_weight", e.target.value)}
                  className={inp}
                />
              </Field>
              <Field label="Manufacture (mill)">
                <input
                  value={form.fabric_mill}
                  onChange={(e) => update("fabric_mill", e.target.value)}
                  className={inp}
                />
              </Field>
              <Field label="Notes">
                <textarea
                  value={form.fabric_notes}
                  onChange={(e) => update("fabric_notes", e.target.value)}
                  rows={2}
                  className={inp}
                />
              </Field>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
            </Section>
          </div>

          {/* Right column */}
          <div className="space-y-10">
            <Section title="Images">
              <div className="border border-dashed border-hairline p-6 text-center">
                <input
                  id="img-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleUpload(e.target.files)}
                  className="hidden"
                />
<<<<<<< HEAD
                <label htmlFor="img-upload" className="luxury-btn cursor-pointer inline-block">
=======
                <label
                  htmlFor="img-upload"
                  className="luxury-btn cursor-pointer inline-block"
                >
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                  {uploading ? "Upload en cours…" : "+ Ajouter des images"}
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {images.map((img, idx) => (
<<<<<<< HEAD
                    <div key={idx} className="relative group border border-hairline">
                      <img src={img.url} alt="" className="aspect-[4/5] w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-ink/85 px-2 py-1.5 flex justify-between items-center text-[10px]">
                        <button type="button" onClick={() => setPrimary(idx)} className={`eyebrow ${img.is_primary ? "text-bone" : "text-bone/50 hover:text-bone"}`}>
                          {img.is_primary ? "★ Principal" : "Définir"}
                        </button>
                        <button type="button" onClick={() => removeImage(idx)} className="text-bone/60 hover:text-red-400">✕</button>
=======
                    <div
                      key={idx}
                      className="relative group border border-hairline"
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="aspect-[4/5] w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-ink/85 px-2 py-1.5 flex justify-between items-center text-[10px]">
                        <button
                          type="button"
                          onClick={() => setPrimary(idx)}
                          className={`eyebrow ${img.is_primary ? "text-bone" : "text-bone/50 hover:text-bone"}`}
                        >
                          {img.is_primary ? "★ Principal" : "Définir"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="text-bone/60 hover:text-red-400"
                        >
                          ✕
                        </button>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Prix & stock">
<<<<<<< HEAD
              <Field label="Prix FCFA"><input type="number" min={0} value={form.price_fcfa} onChange={(e) => update("price_fcfa", Number(e.target.value))} required className={inp} /></Field>
              <Field label="Prix USD"><input type="number" min={0} value={form.price_usd} onChange={(e) => update("price_usd", Number(e.target.value))} required className={inp} /></Field>
              <Field label="Prix EUR"><input type="number" min={0} value={form.price_eur} onChange={(e) => update("price_eur", Number(e.target.value))} required className={inp} /></Field>
              <Field label="Stock"><input type="number" min={0} value={form.stock} onChange={(e) => update("stock", Number(e.target.value))} className={inp} /></Field>
              <label className="flex items-center gap-3 text-sm text-bone/80 mt-2">
                <input type="checkbox" checked={form.is_published} onChange={(e) => update("is_published", e.target.checked)} />
=======
              <Field label="Prix FCFA">
                <input
                  type="number"
                  min={0}
                  value={form.price_fcfa}
                  onChange={(e) => update("price_fcfa", Number(e.target.value))}
                  required
                  className={inp}
                />
              </Field>
              <Field label="Prix USD">
                <input
                  type="number"
                  min={0}
                  value={form.price_usd}
                  onChange={(e) => update("price_usd", Number(e.target.value))}
                  required
                  className={inp}
                />
              </Field>
              <Field label="Prix EUR">
                <input
                  type="number"
                  min={0}
                  value={form.price_eur}
                  onChange={(e) => update("price_eur", Number(e.target.value))}
                  required
                  className={inp}
                />
              </Field>
              <Field label="Stock">
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => update("stock", Number(e.target.value))}
                  className={inp}
                />
              </Field>
              <label className="flex items-center gap-3 text-sm text-bone/80 mt-2">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => update("is_published", e.target.checked)}
                />
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                Publié (visible dans la collection)
              </label>
            </Section>

            <div className="space-y-3 sticky top-32">
<<<<<<< HEAD
              <button type="submit" disabled={saving} className="luxury-btn luxury-btn-solid w-full">
                {saving ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer le produit"}
              </button>
              {isEdit && (
                <button type="button" onClick={handleDelete} disabled={saving} className="luxury-btn w-full text-red-400 hover:text-red-300">
=======
              <button
                type="submit"
                disabled={saving}
                className="luxury-btn luxury-btn-solid w-full"
              >
                {saving
                  ? "Enregistrement…"
                  : isEdit
                    ? "Mettre à jour"
                    : "Créer le produit"}
              </button>
              {isEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="luxury-btn w-full text-red-400 hover:text-red-300"
                >
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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

<<<<<<< HEAD
const inp = "w-full bg-transparent border border-hairline px-3 py-2 text-bone text-sm focus:outline-none focus:border-bone transition-colors";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
=======
const inp =
  "w-full bg-transparent border border-hairline px-3 py-2 text-bone text-sm focus:outline-none focus:border-bone transition-colors";

function getStoragePathFromPublicUrl(url: string): string | null {
  const marker = "/storage/v1/object/public/product-images/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const path = url.slice(idx + marker.length);
  return path ? decodeURIComponent(path) : null;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  return (
    <section className="border border-hairline p-6">
      <h2 className="display text-xl mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

<<<<<<< HEAD
function Field({ label, children }: { label: string; children: React.ReactNode }) {
=======
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  return (
    <div>
      <div className="eyebrow text-bone/60 text-[10px] mb-2">{label}</div>
      {children}
    </div>
  );
}

function Toggle({
<<<<<<< HEAD
  active, onClick, children, variant = "default",
}: { active: boolean; onClick: () => void; children: React.ReactNode; variant?: "default" | "warn" }) {
  const activeCls = variant === "warn"
    ? "border-red-400 bg-red-500/15 text-red-200"
    : "border-bone bg-bone text-ink";
=======
  active,
  onClick,
  children,
  variant = "default",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "warn";
}) {
  const activeCls =
    variant === "warn"
      ? "border-red-400 bg-red-500/15 text-red-200"
      : "border-bone bg-bone text-ink";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
  label, values, onChange, placeholder,
}: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
=======
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className={inp}
        />
        <button type="button" onClick={add} className="luxury-btn px-4 text-xs whitespace-nowrap">+ Ajouter</button>
=======
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={inp}
        />
        <button
          type="button"
          onClick={add}
          className="luxury-btn px-4 text-xs whitespace-nowrap"
        >
          + Ajouter
        </button>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {values.map((v) => (
<<<<<<< HEAD
            <span key={v} className="border border-hairline px-3 py-1 text-[11px] tracking-[0.15em] uppercase text-bone/80 flex items-center gap-2">
              {v}
              <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="text-bone/50 hover:text-red-400">✕</button>
=======
            <span
              key={v}
              className="border border-hairline px-3 py-1 text-[11px] tracking-[0.15em] uppercase text-bone/80 flex items-center gap-2"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                className="text-bone/50 hover:text-red-400"
              >
                ✕
              </button>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
            </span>
          ))}
        </div>
      )}
    </Field>
  );
}
