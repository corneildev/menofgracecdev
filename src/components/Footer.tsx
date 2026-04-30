import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
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
              <li><Link to="/executive" className="hover:text-bone">{t("footer.executive")}</Link></li>
              <li><Link to="/bespoke" className="hover:text-bone">{t("footer.bespoke")}</Link></li>
              <li><Link to="/wedding" className="hover:text-bone">{t("footer.wedding")}</Link></li>
              <li><Link to="/corporate-program" className="hover:text-bone">{t("footer.corporate")}</Link></li>
              <li><Link to="/atelier" className="hover:text-bone">{t("footer.atelier")}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="eyebrow mb-6">{t("footer.contact")}</div>
            <div className="text-bone/70 text-sm font-light leading-relaxed mb-8">
              {t("footer.address")}<br />
              {t("common.locations")}
            </div>
            <div className="flex gap-6 eyebrow text-bone/70">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-bone">Instagram</a>
              <a href="https://wa.me/22500000000" target="_blank" rel="noreferrer" className="hover:text-bone">WhatsApp</a>
              <a href="mailto:atelier@menofgrace.com" className="hover:text-bone">Email</a>
            </div>
          </div>
        </div>

        <div className="hairline mb-8" />
        <div className="flex flex-col md:flex-row justify-between gap-4 eyebrow text-bone/50">
          <span>© {new Date().getFullYear()} MEN OF GRACE · {t("footer.rights")}</span>
          <span>Composed in the Maison · Crafted in Biella & Foshan</span>
        </div>
      </div>
    </footer>
  );
}
