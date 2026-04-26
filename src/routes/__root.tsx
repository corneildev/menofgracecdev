import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthProvider } from "@/context/AuthContext";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow mb-6">404</div>
        <h1 className="display text-5xl text-bone mb-6">Page not found</h1>
        <p className="text-bone/60 mb-10 font-light">
          The page you seek is not part of this collection.
        </p>
        <Link to="/" className="luxury-btn">Return Home</Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MEN OF GRACE — Bespoke Excellence" },
      { name: "description", content: "A luxury menswear house specialising in bespoke suits, wedding tailoring and executive sartoria." },
      { property: "og:title", content: "MEN OF GRACE — Bespoke Excellence" },
      { property: "og:description", content: "Bespoke suits, wedding tailoring and executive sartoria for men who command presence." },
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
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-ink text-bone">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Header />
          <main className="min-h-screen bg-ink">
            <Outlet />
          </main>
          <Footer />
          <WhatsAppFloat />
          <CartDrawer />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
