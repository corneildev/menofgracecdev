import { Outlet, createRootRoute, Link } from "@tanstack/react-router";
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
import { CountrySelectorModal } from "@/components/CountrySelectorModal";

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
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

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
            <CountrySelectorModal />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
