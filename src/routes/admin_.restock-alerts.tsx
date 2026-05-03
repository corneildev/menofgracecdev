import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorMessage";

export const Route = createFileRoute("/admin_/restock-alerts")({
  head: () => ({
    meta: [
      { title: "Alertes de réassort — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RestockAlertsAdmin,
});

type Alert = {
  id: string;
  email: string | null;
  whatsapp: string | null;
  product_id: string | null;
  product_slug: string | null;
  product_name: string | null;
  size: string | null;
  notified: boolean;
  created_at: string;
};

function RestockAlertsAdmin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<"pending" | "notified" | "all">(
    "pending",
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/account" });
  }, [user, isAdmin, loading, navigate]);

  const loadAlerts = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("restock_alerts")
      .select(
        "id,email,whatsapp,product_id,product_slug,product_name,size,notified,created_at",
      )
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(getErrorMessage(error, "Impossible de charger les alertes"));
      setAlerts([]);
    } else {
      setAlerts((data ?? []) as Alert[]);
    }
    setFetching(false);
  };

  useEffect(() => {
    if (!isAdmin) return;
    void loadAlerts();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    if (filter === "all") return alerts;
    return alerts.filter((a) =>
      filter === "notified" ? a.notified : !a.notified,
    );
  }, [alerts, filter]);

  const counts = useMemo(
    () => ({
      pending: alerts.filter((a) => !a.notified).length,
      notified: alerts.filter((a) => a.notified).length,
      all: alerts.length,
    }),
    [alerts],
  );

  const setNotified = async (id: string, notified: boolean) => {
    setBusyId(id);
    const { error } = await supabase
      .from("restock_alerts")
      .update({ notified })
      .eq("id", id);
    setBusyId(null);
    if (error) {
      toast.error(getErrorMessage(error, "Mise à jour impossible"));
      return;
    }
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, notified } : a)),
    );
    toast.success(
      notified ? "Marquée comme notifiée" : "Marquée comme en attente",
    );
  };

  const markAllForProduct = async (
    productId: string | null,
    productSlug: string | null,
  ) => {
    const targets = alerts.filter(
      (a) =>
        !a.notified &&
        ((productId && a.product_id === productId) ||
          (productSlug && a.product_slug === productSlug)),
    );
    if (targets.length === 0) return;
    const ids = targets.map((t) => t.id);
    const { error } = await supabase
      .from("restock_alerts")
      .update({ notified: true })
      .in("id", ids);
    if (error) {
      toast.error(getErrorMessage(error, "Action groupée impossible"));
      return;
    }
    setAlerts((prev) =>
      prev.map((a) => (ids.includes(a.id) ? { ...a, notified: true } : a)),
    );
    toast.success(`${ids.length} alerte(s) marquée(s) comme notifiée(s)`);
  };

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className="border-b border-hairline pb-8 mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Link
              to="/admin"
              className="eyebrow text-bone/50 text-[10px] hover:text-bone"
            >
              ← Console
            </Link>
            <div className="eyebrow text-bone/60 mt-3 mb-3">— Réassort —</div>
            <h1 className="display text-4xl md:text-5xl">Alertes de stock</h1>
            <p className="text-bone/60 font-light mt-3 max-w-xl">
              Suivez les clients en attente d'une remise en stock et marquez les
              demandes comme notifiées une fois contactés.
            </p>
          </div>
          <div
            className="flex items-center gap-2"
            role="group"
            aria-label="Filtre"
          >
            {(
              [
                { v: "pending", l: `En attente (${counts.pending})` },
                { v: "notified", l: `Notifiées (${counts.notified})` },
                { v: "all", l: `Toutes (${counts.all})` },
              ] as const
            ).map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => setFilter(opt.v)}
                aria-pressed={filter === opt.v}
                className={`px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase border transition-colors ${
                  filter === opt.v
                    ? "border-bone bg-bone text-ink"
                    : "border-hairline text-bone/60 hover:border-bone hover:text-bone"
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        {fetching ? (
          <div className="border border-hairline p-12 text-center text-bone/60 font-light">
            Chargement…
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-hairline p-12 text-center text-bone/60 font-light">
            Aucune alerte{" "}
            {filter === "pending"
              ? "en attente"
              : filter === "notified"
                ? "notifiée"
                : ""}
            .
          </div>
        ) : (
          <div className="border border-hairline divide-y divide-hairline">
            <div className="hidden md:grid grid-cols-[1.4fr_1fr_0.6fr_1.2fr_0.8fr_auto] gap-4 px-5 py-3 eyebrow text-bone/50 text-[10px]">
              <div>Produit</div>
              <div>Contact</div>
              <div>Taille</div>
              <div>Reçue le</div>
              <div>Statut</div>
              <div className="text-right">Actions</div>
            </div>
            {filtered.map((a) => {
              const date = new Date(a.created_at);
              const dateStr = date.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div
                  key={a.id}
                  className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_0.6fr_1.2fr_0.8fr_auto] gap-4 px-5 py-4 items-center"
                >
                  <div>
                    <div className="font-serif text-bone">
                      {a.product_name ?? a.product_slug ?? "—"}
                    </div>
                    {a.product_slug && (
                      <div className="text-bone/40 text-[10px] tracking-wider">
                        {a.product_slug}
                      </div>
                    )}
                  </div>
                  <div className="text-bone/80 text-sm font-light break-all">
                    {a.email && <div>{a.email}</div>}
                    {a.whatsapp && (
                      <div className="text-bone/60">WhatsApp: {a.whatsapp}</div>
                    )}
                    {!a.email && !a.whatsapp && (
                      <span className="text-bone/40">—</span>
                    )}
                  </div>
                  <div className="eyebrow text-bone/70 text-[10px]">
                    {a.size ?? "—"}
                  </div>
                  <div className="text-bone/60 text-xs font-light">
                    {dateStr}
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2 py-1 eyebrow text-[9px] border ${
                        a.notified
                          ? "border-bone/30 text-bone/50"
                          : "border-bone bg-bone text-ink"
                      }`}
                    >
                      {a.notified ? "Notifiée" : "En attente"}
                    </span>
                  </div>
                  <div className="flex md:justify-end gap-3 flex-wrap">
                    <button
                      type="button"
                      disabled={busyId === a.id}
                      onClick={() => setNotified(a.id, !a.notified)}
                      className="eyebrow text-[10px] text-bone hover:text-bone/70 underline-offset-4 hover:underline disabled:opacity-40"
                    >
                      {a.notified ? "Rouvrir" : "Marquer notifiée"}
                    </button>
                    {!a.notified && (a.product_id || a.product_slug) && (
                      <button
                        type="button"
                        onClick={() =>
                          markAllForProduct(a.product_id, a.product_slug)
                        }
                        className="eyebrow text-[10px] text-bone/60 hover:text-bone underline-offset-4 hover:underline"
                      >
                        Tout pour ce produit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
