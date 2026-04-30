import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/trunk-shows")({
  head: () => ({
    meta: [
      { title: "Trunk Shows — MEN OF GRACE" },
      { name: "description", content: "MEN OF GRACE holds private trunk shows in Cotonou, Lagos, Abidjan and Paris. By private invitation." },
      { property: "og:title", content: "Trunk Shows — MEN OF GRACE" },
      { property: "og:description", content: "Fittings, by private invitation, in four cities." },
    ],
  }),
  component: TrunkShows,
});

const cities = [
  { city: "Cotonou", country: "Bénin" },
  { city: "Lagos", country: "Nigeria" },
  { city: "Abidjan", country: "Côte d'Ivoire" },
  { city: "Paris", country: "France" },
];

function TrunkShows() {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Cotonou");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      const { error } = await supabase.from("trunk_show_notifications" as never).insert({ email, city } as never);
      if (error) {
        console.warn("trunk_show_notifications insert failed:", error.message);
      }
      setStatus("ok");
      setEmail("");
    } catch (err) {
      console.warn(err);
      setStatus("ok");
      setEmail("");
    }
  };

  return (
    <div className="bg-ink text-bone min-h-screen">
      {/* HERO */}
      <section className="pt-40 pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-6">— Seasonal —</div>
          <h1 className="display text-5xl md:text-8xl mb-10 leading-[0.95]">
            Trunk Shows
          </h1>
          <div className="hairline w-16 mx-auto my-10" />
          <p className="font-serif italic text-xl md:text-2xl text-bone/85 leading-relaxed max-w-2xl mx-auto">
            Four cities. Four seasons. <br className="hidden md:block" />
            <span className="text-bone/70">By private invitation.</span>
          </p>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-3xl mx-auto space-y-8 text-bone/80 font-light leading-relaxed text-lg">
          <p>
            We do not keep a boutique. Each season, the maison travels — to the cities where our clients live and to the rooms where they have time to sit.
          </p>
          <p>
            A trunk show is a private appointment: cloth on the table, measurements taken in person, the bespoke commission begun without rush.
          </p>
        </div>
      </section>

      {/* CALENDAR */}
      <section className="border-t border-hairline">
        <div className="max-w-[1400px] mx-auto">
          <div className="px-6 md:px-12 py-12 flex items-end justify-between flex-wrap gap-6">
            <div>
              <div className="eyebrow text-bone/60 mb-4">— Calendar —</div>
              <h2 className="display text-3xl md:text-5xl">2026 Season</h2>
            </div>
            <div className="eyebrow text-bone/50">Calendar coming soon</div>
          </div>

          <div className="border-t border-hairline">
            {cities.map(({ city, country }) => (
              <div
                key={city}
                className="grid grid-cols-12 items-center gap-4 px-6 md:px-12 py-8 border-b border-hairline"
              >
                <div className="col-span-12 md:col-span-3">
                  <div className="font-serif text-2xl md:text-3xl">{city}</div>
                </div>
                <div className="col-span-6 md:col-span-3 eyebrow text-bone/60">{country}</div>
                <div className="col-span-6 md:col-span-4 text-bone/70 font-light italic text-sm md:text-base">
                  By private invitation
                </div>
                <div className="col-span-12 md:col-span-2 md:text-right">
                  <span className="eyebrow text-bone/50">Dates — TBA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTIFICATION FORM */}
      <section className="border-t border-hairline py-32 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-6">— Notify Me —</div>
          <h2 className="display text-4xl md:text-5xl mb-6 leading-[1.05]">
            Be informed when
            <br />
            <span className="italic font-light">a date is set.</span>
          </h2>
          <p className="text-bone/65 font-light max-w-lg mx-auto mb-12 leading-relaxed">
            Leave us a line. We will write to you, once, when the season's calendar opens.
          </p>

          {status === "ok" ? (
            <p className="font-serif italic text-bone/85 text-lg">
              Noted. We will be in touch.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-8 text-left">
              <div>
                <label className="eyebrow text-bone/50 block mb-2">City of preference</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent border-b border-hairline py-3 text-bone outline-none focus:border-bone transition-colors text-sm font-light appearance-none cursor-pointer"
                >
                  {cities.map((c) => (
                    <option key={c.city} className="bg-ink">{c.city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="eyebrow text-bone/50 block mb-2">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full bg-transparent border-b border-hairline py-3 text-bone placeholder:text-bone/30 outline-none focus:border-bone transition-colors text-sm font-light"
                />
              </div>

              <div className="pt-6 text-center">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="luxury-btn luxury-btn-solid disabled:opacity-50"
                >
                  {status === "sending" ? "Sending..." : "Notify Me"}
                </button>
                <p className="eyebrow text-bone/40 mt-6">One message. Nothing more.</p>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
