import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/bespoke")({
  head: () => ({
    meta: [
      { title: "Bespoke — MEN OF GRACE" },
      { name: "description", content: "Begin your bespoke suit journey. A private consultation with our master tailors." },
      { property: "og:title", content: "Bespoke — MEN OF GRACE" },
      { property: "og:description", content: "Speak to a tailor and compose a suit around you." },
    ],
  }),
  component: Bespoke,
});

function Bespoke() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "",
    height: "",
    chest: "",
    waist: "",
    style: "Executive",
    notes: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello, I would like to begin a bespoke MEN OF GRACE suit.

Name: ${form.name}
Phone: ${form.phone}
Country: ${form.country}
Height: ${form.height} cm
Chest: ${form.chest} cm
Waist: ${form.waist} cm
Style: ${form.style}
Notes: ${form.notes}`;
    window.open(`https://wa.me/22500000000?text=${encodeURIComponent(text)}`, "_blank");
  };

  const inputCls =
    "w-full bg-transparent border-b border-hairline py-3 text-bone placeholder:text-bone/30 outline-none focus:border-bone transition-colors text-sm font-light";

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <div className="eyebrow text-bone/60 mb-6">— By Appointment —</div>
          <h1 className="display text-5xl md:text-7xl mb-6">Speak to a Tailor</h1>
          <p className="text-bone/60 font-light max-w-xl mx-auto leading-relaxed">
            Share a few essentials. A member of our atelier will respond within twenty-four hours via WhatsApp.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="eyebrow text-bone/50 block mb-2">Name</label>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} placeholder="Full name" />
            </div>
            <div>
              <label className="eyebrow text-bone/50 block mb-2">WhatsApp</label>
              <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} placeholder="+225 ..." />
            </div>
            <div>
              <label className="eyebrow text-bone/50 block mb-2">Country</label>
              <input required value={form.country} onChange={(e) => update("country", e.target.value)} className={inputCls} placeholder="Côte d'Ivoire" />
            </div>
            <div>
              <label className="eyebrow text-bone/50 block mb-2">Style Preference</label>
              <select value={form.style} onChange={(e) => update("style", e.target.value)} className={`${inputCls} appearance-none cursor-pointer`}>
                <option className="bg-ink">Executive</option>
                <option className="bg-ink">Wedding</option>
                <option className="bg-ink">Tuxedo / Cérémonie</option>
                <option className="bg-ink">Casual Tailoring</option>
              </select>
            </div>
          </div>

          <div>
            <div className="eyebrow text-bone/60 mb-6">— Measurements (optional) —</div>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <label className="eyebrow text-bone/50 block mb-2">Height</label>
                <input value={form.height} onChange={(e) => update("height", e.target.value)} className={inputCls} placeholder="cm" />
              </div>
              <div>
                <label className="eyebrow text-bone/50 block mb-2">Chest</label>
                <input value={form.chest} onChange={(e) => update("chest", e.target.value)} className={inputCls} placeholder="cm" />
              </div>
              <div>
                <label className="eyebrow text-bone/50 block mb-2">Waist</label>
                <input value={form.waist} onChange={(e) => update("waist", e.target.value)} className={inputCls} placeholder="cm" />
              </div>
            </div>
          </div>

          <div>
            <label className="eyebrow text-bone/50 block mb-2">Notes & Inspiration</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={4}
              className={`${inputCls} resize-none`}
              placeholder="Occasion, fabric preference, references..."
            />
          </div>

          <div className="pt-8 text-center">
            <button type="submit" className="luxury-btn luxury-btn-solid">Speak to a Tailor</button>
            <p className="eyebrow text-bone/40 mt-6">You will be redirected to WhatsApp.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
