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

const themeBootScript = `(function(){try{var t=localStorage.getItem("mog:theme");if(t==="light"){document.documentElement.classList.add("light");}}catch(e){}})();`;

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
      { title: "MEN OF GRACE — Maison de tailleur" },
      { name: "description", content: "Maison de tailleur d'exception : prêt-à-porter, sur-mesure, mariage et executive. Abidjan · Paris · Lagos · Dubaï." },
      { property: "og:title", content: "MEN OF GRACE — Maison de tailleur" },
      { property: "og:description", content: "Costumes sur-mesure, mariage et executive sartoria pour les hommes qui imposent leur présence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
