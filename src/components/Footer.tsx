import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-ink border-t border-hairline pt-24 pb-10">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5">
            <div className="font-serif text-2xl tracking-[0.3em] mb-6">MEN OF GRACE</div>
            <p className="text-bone/60 max-w-sm font-light leading-relaxed">
              A house of bespoke menswear for those who command presence without speaking.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow mb-6">House</div>
            <ul className="space-y-3 text-bone/80">
              <li><Link to="/collection" className="hover:text-bone">Collection</Link></li>
              <li><Link to="/bespoke" className="hover:text-bone">Bespoke</Link></li>
              <li><Link to="/wedding" className="hover:text-bone">Wedding</Link></li>
              <li><Link to="/atelier" className="hover:text-bone">Atelier</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="eyebrow mb-6">Private Newsletter</div>
            <form className="flex border-b border-hairline pb-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent text-bone placeholder:text-bone/40 outline-none text-sm"
              />
              <button className="eyebrow text-bone hover:text-bone/60">Subscribe</button>
            </form>
            <div className="mt-10 flex gap-6 eyebrow text-bone/70">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-bone">Instagram</a>
              <a href="https://wa.me/22500000000" target="_blank" rel="noreferrer" className="hover:text-bone">WhatsApp</a>
              <a href="mailto:atelier@menofgrace.com" className="hover:text-bone">Email</a>
            </div>
          </div>
        </div>

        <div className="hairline mb-8" />
        <div className="flex flex-col md:flex-row justify-between gap-4 eyebrow text-bone/50">
          <span>© {new Date().getFullYear()} Men of Grace · Maison de Couture Masculine</span>
          <span>Crafted in Europe · Delivered Worldwide</span>
        </div>
      </div>
    </footer>
  );
}
