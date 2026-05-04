import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCountry } from "@/hooks/useCountry";
import { Icon } from "./Icon";

export function CountrySelectorModal() {
  const { hasSelectedCountry, setCountryPreference } = useCountry();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal if country hasn't been selected manually yet
    if (!hasSelectedCountry) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasSelectedCountry]);

  const handleSelect = (code: string, name: string) => {
    setCountryPreference(code, name);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-background border border-hairline p-8 sm:p-12 shadow-2xl"
          >
            <div className="text-center mb-10">
              <div className="eyebrow text-foreground/40 mb-4 tracking-[0.3em] uppercase">— Bienvenue chez Men of Grace —</div>
              <h2 className="display text-3xl sm:text-4xl mb-4">Sélectionnez votre région</h2>
              <p className="text-foreground/60 font-light text-sm leading-relaxed max-w-xs mx-auto">
                Afin de vous proposer le service de livraison et le mode de paiement adaptés.
              </p>
            </div>

            <div className="space-y-3">
              <CountryOption 
                code="BJ" 
                name="Bénin" 
                subtitle="Paiement à la livraison disponible" 
                onClick={() => handleSelect("BJ", "Bénin")}
              />
              <CountryOption 
                code="CI" 
                name="Côte d'Ivoire" 
                subtitle="Paiement à la livraison disponible" 
                onClick={() => handleSelect("CI", "Côte d'Ivoire")}
              />
              <CountryOption 
                code="OTHER" 
                name="Autre pays (International)" 
                subtitle="Livraison DHL — Paiement sécurisé" 
                onClick={() => handleSelect("OTHER", "International")}
              />
            </div>

            <div className="mt-10 pt-8 border-t border-hairline text-center">
              <p className="text-[10px] text-foreground/40 tracking-[0.2em] uppercase">
                Livraison en 5 jours · Retouches offertes
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CountryOption({ 
  code, 
  name, 
  subtitle, 
  onClick 
}: { 
  code: string; 
  name: string; 
  subtitle: string; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-5 p-5 border border-hairline hover:border-foreground/40 transition-all group text-left"
    >
      <div className="w-10 h-10 flex items-center justify-center bg-secondary text-foreground/40 group-hover:bg-foreground group-hover:text-background transition-colors">
        <Icon name="globe" className="text-lg" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-serif text-lg leading-tight mb-1">{name}</div>
        <div className="text-[11px] text-foreground/50 font-light tracking-wide">{subtitle}</div>
      </div>
      <Icon name="chevron-right" className="text-[10px] text-foreground/20 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
    </button>
  );
}
