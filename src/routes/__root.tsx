import { Outlet, createRootRoute, HeadContent, Scripts, ScriptOnce, Link } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthProvider } from "@/context/AuthContext";
import { LangBootstrap } from "@/components/LangBootstrap";
import "@/i18n";

// Light par défaut. Le mode sombre n'est appliqué que si l'utilisateur l'a explicitement choisi.
const themeBootScript = `(function(){try{var t=localStorage.getItem("mog:theme");if(t!=="dark"){document.documentElement.classList.add("light");}}catch(e){document.documentElement.classList.add("light");}})();`;

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow mb-6">404</div>
        <h1 className="display text-5xl text-foreground mb-6">Page introuvable</h1>
        <p className="text-foreground/60 mb-10 font-light">
          La page que vous cherchez ne fait pas partie de cette collection.
        </p>
        <Link to="/" className="luxury-btn">Retour à l'accueil</Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Men of Grace — Maison de tailleur" },
      { name: "description", content: "Maison de tailleur d'exception : prêt-à-porter, sur-mesure, mariage et executive. Abidjan · Paris · Lagos · Dubaï." },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#FAFAFA" },
      { property: "og:title", content: "Men of Grace — Maison de tailleur" },
      { property: "og:description", content: "Costumes sur-mesure, mariage et executive sartoria pour les hommes qui imposent leur présence." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:site_name", content: "Men of Grace" },
      { property: "og:url", content: "https://menofgrace.store" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@menofgrace" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500&family=Inter:wght@200;300;400;500&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Men of Grace",
          url: "https://menofgrace.store",
          logo: "https://menofgrace.store/og-image.jpg",
          sameAs: [
            "https://www.instagram.com/menofgrace",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["French", "English"],
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Men of Grace",
          url: "https://menofgrace.store",
          inLanguage: "fr-FR",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <ScriptOnce children={themeBootScript} />
        <HeadContent />
      </head>
      <body className="bg-background text-foreground overflow-x-hidden">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <LangBootstrap />
            <Header />
            <main className="min-h-screen bg-background overflow-x-hidden">
              <Outlet />
            </main>
            <Footer />
            <WhatsAppFloat />
            <CartDrawer />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
