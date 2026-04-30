import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const waMessage = encodeURIComponent("Bonjour MEN OF GRACE — j'ai une question.");
  const waHref = `https://wa.me/22500000000?text=${waMessage}`;

  return (
    <footer className="bg-ink border-t border-hairline pt-24 pb-10">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5">
            <div className="font-serif text-2xl tracking-[0.3em] mb-6">MEN OF GRACE</div>
            <p className="text-bone/60 max-w-sm font-light leading-relaxed">
              {t("home.heroTagline")}
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow mb-6">{t("footer.house")}</div>
            <ul className="space-y-3 text-bone/80">
              <li><Link to="/collection" className="hover:text-bone">{t("nav.collection")}</Link></li>
              <li><Link to="/account" className="hover:text-bone">Account</Link></li>
              <li><Link to="/wishlist" className="hover:text-bone">{t("nav.wishlist")}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow mb-6">Legal</div>
            <ul className="space-y-3 text-bone/80 text-sm font-light">
              <li><a href="#" className="hover:text-bone">Privacy</a></li>
              <li><a href="#" className="hover:text-bone">Terms</a></li>
              <li><a href="#" className="hover:text-bone">Shipping &amp; Returns</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow mb-6">{t("footer.contact")}</div>
            <div className="flex flex-col gap-3 eyebrow text-bone/70">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-bone">Instagram</a>
              <a href={waHref} target="_blank" rel="noreferrer" className="hover:text-bone">Speak with us</a>
              <a href="mailto:hello@menofgrace.com" className="hover:text-bone">Email</a>
            </div>
          </div>
        </div>

        <div className="hairline mb-8" />
        <div className="flex flex-col md:flex-row justify-between gap-4 eyebrow text-bone/50">
          <span>© {new Date().getFullYear()} MEN OF GRACE · {t("footer.rights")}</span>
          <span>Shipped within 5 business days · Free local alterations</span>
        </div>
      </div>
    </footer>
  );
}
