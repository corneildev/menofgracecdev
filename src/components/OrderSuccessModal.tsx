import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Icon } from "./Icon";
import { Link } from "@tanstack/react-router";

type OrderSuccessModalProps = {
  isOpen: boolean;
  orderNumber: string;
  onClose: () => void;
};

export function OrderSuccessModal({ isOpen, orderNumber, onClose }: OrderSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-secondary border border-hairline p-8 md:p-12 max-w-lg w-full text-center overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-bone" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-bone/5 rounded-full blur-3xl" />
            
            <div className="mb-8 relative inline-block">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-bone flex items-center justify-center rounded-full mx-auto"
              >
                <Icon name="check" className="text-secondary text-3xl" />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 border border-bone rounded-full"
              />
            </div>

            <h2 className="display text-3xl md:text-4xl text-bone mb-4">Commande Confirmée</h2>
            <p className="eyebrow text-bone/60 text-sm mb-6 tracking-[0.2em]">Numéro : {orderNumber}</p>
            
            <div className="space-y-4 mb-10 text-bone/70 font-light leading-relaxed">
              <p>Merci pour votre confiance. Notre concierge vous contactera très prochainement sur WhatsApp pour confirmer les derniers détails de votre livraison.</p>
              <p className="text-xs italic text-bone/40">Un email récapitulatif vous a été envoyé.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={onClose}
                className="luxury-btn luxury-btn-solid w-full"
              >
                Continuer mes achats
              </button>
              <Link 
                to="/collection" 
                className="eyebrow text-bone/50 hover:text-bone text-xs transition-colors py-2"
              >
                Retour à la collection
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
