import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPriceFcfa } from "@/lib/products";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Suivi de commande — MEN OF GRACE" },
      { name: "description", content: "Suivez l'état de votre commande en temps réel." },
    ],
  }),
  component: TrackOrderPage,
});

const STATUS_MAP: Record<string, { label: string; description: string; step: number }> = {
  pending_payment: { 
    label: "Attente de paiement", 
    description: "Nous attendons la confirmation de votre règlement pour débuter la confection.",
    step: 1 
  },
  paid: { 
    label: "Payée", 
    description: "Votre paiement a été validé. Votre commande est en attente de mise en production.",
    step: 2 
  },
  in_production: { 
    label: "En confection", 
    description: "Nos artisans travaillent actuellement sur vos pièces sur-mesure.",
    step: 3 
  },
  ready_for_delivery: { 
    label: "Prête à livrer", 
    description: "Votre commande est terminée et prête à être expédiée.",
    step: 4 
  },
  delivered: { 
    label: "Livrée", 
    description: "Votre commande a été livrée avec succès.",
    step: 5 
  },
  cancelled: { 
    label: "Annulée", 
    description: "Cette commande a été annulée.",
    step: 0 
  },
};

function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const { data, error: rpcError } = await supabase.rpc("track_order", {
        p_order_number: orderNumber.trim(),
        p_identifier: identifier.trim(),
      });

      if (rpcError) throw rpcError;
      if (!data) {
        setError("Aucune commande correspondante trouvée. Veuillez vérifier vos informations.");
      } else {
        setOrder(data);
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de la recherche.");
    } finally {
      setLoading(false);
    }
  }

  const currentStatus = order ? STATUS_MAP[order.status] : null;

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-16">
          <div className="eyebrow text-bone/60 mb-4">— Services —</div>
          <h1 className="display text-4xl md:text-5xl mb-6">Suivi de commande</h1>
          <p className="text-bone/60 font-light leading-relaxed">
            Entrez vos informations pour connaître l'état d'avancement de votre commande dans nos ateliers.
          </p>
        </header>

        <section className="border border-hairline p-8 md:p-12 mb-12">
          <form onSubmit={handleTrack} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="eyebrow text-[10px] text-bone/60 block mb-2">Numéro de commande</label>
              <input
                id="orderNumber"
                type="text"
                required
                placeholder="Ex: MOG-10001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-transparent border border-hairline p-4 text-bone placeholder:text-bone/20 focus:outline-none focus:border-bone/40 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="identifier" className="eyebrow text-[10px] text-bone/60 block mb-2">Email ou Numéro de téléphone</label>
              <input
                id="identifier"
                type="text"
                required
                placeholder="L'identifiant utilisé lors de l'achat"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-transparent border border-hairline p-4 text-bone placeholder:text-bone/20 focus:outline-none focus:border-bone/40 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="luxury-btn luxury-btn-solid w-full"
            >
              {loading ? "Recherche..." : "Rechercher la commande"}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-4 border border-red-500/20 bg-red-500/5 text-red-300/80 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <AnimatePresence>
          {order && currentStatus && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-hairline p-8 md:p-12 bg-white/[0.02]"
            >
              <div className="flex justify-between items-start mb-12 pb-6 border-b border-hairline">
                <div>
                  <div className="eyebrow text-bone/60 mb-2">Commande #{order.order_number}</div>
                  <div className="font-serif text-2xl">{currentStatus.label}</div>
                </div>
                <div className="text-right">
                  <div className="eyebrow text-bone/60 mb-2">Total</div>
                  <div className="text-bone font-light">{formatPriceFcfa(order.total_fcfa)}</div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="relative pt-8">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-hairline" />
                  <div 
                    className="absolute top-0 left-0 h-[2px] bg-bone transition-all duration-1000" 
                    style={{ width: `${(currentStatus.step / 5) * 100}%` }}
                  />
                  
                  <div className="flex justify-between mt-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div 
                        key={s} 
                        className={`w-3 h-3 rounded-full border-2 transition-colors ${
                          s <= currentStatus.step ? "bg-bone border-bone" : "bg-ink border-hairline"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center max-w-sm mx-auto">
                  <p className="text-bone/80 font-light text-sm leading-relaxed">
                    {currentStatus.description}
                  </p>
                </div>

                <div className="flex justify-center pt-6">
                  <Link 
                    to="/order/confirmation/$orderId" 
                    params={{ orderId: order.id }}
                    className="eyebrow text-[10px] text-bone/60 hover:text-bone border border-hairline px-6 py-3 transition-colors"
                  >
                    Voir les détails complets →
                  </Link>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
