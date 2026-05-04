import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPriceFcfa } from "@/lib/products";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Mon compte — MEN OF GRACE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

type Order = {
  id: string;
  order_number: string;
  status: string;
  total_fcfa: number;
  created_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "En attente de paiement",
  paid: "Payée",
  in_production: "En confection",
  ready_for_delivery: "Prête à livrer",
  delivered: "Livrée",
  cancelled: "Annulée",
};

function AccountPage() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<{ full_name: string | null; phone: string | null } | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("id, order_number, status, total_fcfa, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []));
    supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-end mb-16 border-b border-hairline pb-8">
          <div>
            <div className="eyebrow text-bone/60 mb-4">— Espace Privé —</div>
            <h1 className="display text-4xl md:text-5xl">Bonjour{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
          </div>
          <div className="flex items-center gap-6">
            {isAdmin && (
              <Link to="/admin" className="eyebrow text-bone hover:text-bone/70">Admin</Link>
            )}
            <button onClick={() => { void signOut(); navigate({ to: "/" }); }} className="eyebrow text-bone/60 hover:text-bone">
              Déconnexion
            </button>
          </div>
        </div>

        <section>
          <h2 className="display text-2xl mb-8">Mes commandes</h2>
          {orders.length === 0 ? (
            <div className="border border-hairline p-12 text-center text-bone/60 font-light">
              Vous n'avez pas encore passé de commande.{" "}
              <Link to="/collection" className="text-bone underline">Découvrir la collection</Link>
            </div>
          ) : (
            <div className="border border-hairline divide-y divide-hairline">
              {orders.map((o) => (
                <div key={o.id} className="grid grid-cols-[1fr_auto_auto] gap-6 px-6 py-5 items-center">
                  <div>
                    <div className="font-serif text-lg text-bone">{o.order_number}</div>
                    <div className="text-bone/50 text-xs">{new Date(o.created_at).toLocaleDateString("fr-FR")}</div>
                  </div>
                  <div className="eyebrow text-bone/70 text-[10px]">{STATUS_LABEL[o.status] ?? o.status}</div>
                  <div className="text-bone/80 font-light text-sm">{formatPriceFcfa(o.total_fcfa)}</div>
                  <Link
                    to="/order/confirmation/$orderId"
                    params={{ orderId: o.id }}
                    className="eyebrow text-[10px] text-bone/70 hover:text-bone border border-hairline px-3 py-1.5 ml-4"
                  >
                    Détails →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
