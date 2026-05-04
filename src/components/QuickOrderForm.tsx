import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./Icon";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";

type QuickOrderFormProps = {
  productId: string;
  productName: string;
  productImage: string;
  priceFcfa: number;
  priceUsd: number;
  selectedSize: string | null;
  selectedFit: string;
  selectedLapel: string;
  selectedLining: string;
  selectedMonogram: string;
  onSuccess: (orderId: string, orderNumber: string) => void;
};

export function QuickOrderForm({
  productId,
  productName,
  productImage,
  priceFcfa,
  priceUsd,
  selectedSize,
  selectedFit,
  selectedLapel,
  selectedLining,
  selectedMonogram,
  onSuccess,
}: QuickOrderFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clear } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.city) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const p_items = [
        {
          product_id: productId,
          quantity: 1,
          size: selectedSize,
          fit: selectedFit,
          lapel: selectedLapel,
          lining: selectedLining,
          monogram: selectedMonogram || null,
          product_image: productImage,
        },
      ];

      const p_customer = {
        full_name: form.fullName.trim(),
        email: `guest_${Date.now()}@menofgrace.store`, // Placeholder email for guest
        phone: form.phone.trim(),
        address: "Paiement à la livraison",
        city: form.city.trim(),
        country: "Côte d'Ivoire", // Or Bénin, we can refine this
        notes: "Commande express via formulaire produit",
      };

      const { data, error: rpcErr } = await supabase.rpc("place_order", {
        p_items,
        p_customer,
        p_payment: "cash_on_delivery",
        p_idempotency_key: crypto.randomUUID(),
        p_promo_code: null, // Resolving overloading by providing all params
      });

      if (rpcErr) throw rpcErr;
      const result = data as { id: string; order_number: string } | null;
      if (!result?.id) throw new Error("Erreur lors de la création de la commande");

      onSuccess(result.id, result.order_number);
      setIsOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 border border-hairline p-8 bg-bone/[0.02] backdrop-blur-md relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-bone/20 to-transparent" />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 flex items-center justify-center border border-bone/20 rounded-full shrink-0">
          <Icon name="bolt" className="text-bone/40 text-sm" />
        </div>
        <div>
          <h3 className="eyebrow text-sm text-bone tracking-[0.2em] mb-1">Achat Express</h3>
          <p className="text-bone/40 text-[10px] font-light uppercase tracking-widest">Paiement à la livraison · Abidjan & Cotonou</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="eyebrow text-[9px] text-bone/40 uppercase tracking-widest">Nom & Prénom</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="VOTRE NOM"
              className="w-full bg-transparent border-b border-hairline py-2 text-sm text-bone placeholder:text-bone/10 focus:border-bone outline-none transition-all duration-500"
            />
          </div>
          <div className="space-y-2">
            <label className="eyebrow text-[9px] text-bone/40 uppercase tracking-widest">Téléphone</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+225 ..."
              className="w-full bg-transparent border-b border-hairline py-2 text-sm text-bone placeholder:text-bone/10 focus:border-bone outline-none transition-all duration-500"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="eyebrow text-[9px] text-bone/40 uppercase tracking-widest">Ville de livraison</label>
          <input
            type="text"
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="ABIDJAN, COTONOU..."
            className="w-full bg-transparent border-b border-hairline py-2 text-sm text-bone placeholder:text-bone/10 focus:border-bone outline-none transition-all duration-500"
          />
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400/60 text-[10px] uppercase tracking-widest italic"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="luxury-btn luxury-btn-solid w-full mt-6 py-4 flex items-center justify-center gap-4 group/btn overflow-hidden relative"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border border-bone/30 border-t-bone rounded-full animate-spin" />
              <span className="eyebrow text-[10px] tracking-[0.2em]">TRANSMISSION…</span>
            </span>
          ) : (
            <>
              <span className="eyebrow text-[10px] tracking-[0.3em]">VALIDER MA COMMANDE</span>
              <Icon name="chevron-right" className="text-[8px] group-hover/btn:translate-x-1 transition-transform duration-500" />
            </>
          )}
        </button>
      </form>
      
      <p className="text-[9px] text-bone/20 text-center mt-6 uppercase tracking-[0.2em]">
        En validant, un concierge vous contactera pour confirmer la livraison.
      </p>
    </div>
  );
}
