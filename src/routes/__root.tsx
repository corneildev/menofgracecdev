<<<<<<< HEAD
import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
=======
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  Link,
  useLocation,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthProvider } from "@/context/AuthContext";
import { LangBootstrap } from "@/components/LangBootstrap";
<<<<<<< HEAD
import "@/i18n";

import appCss from "../styles.css?url";
=======
import { initMetaPixel, trackMetaPageView } from "@/lib/metaPixel";
import "@/i18n";



const CONSENT_KEY = "mog:cookie-consent";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow mb-6">404</div>
        <h1 className="display text-5xl text-bone mb-6">Page not found</h1>
        <p className="text-bone/60 mb-10 font-light">
          The page you seek is not part of this collection.
        </p>
<<<<<<< HEAD
        <Link to="/" className="luxury-btn">Return Home</Link>
=======
        <Link to="/" className="luxury-btn">
          Return Home
        </Link>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      </div>
    </div>
  );
}

export const Route = createRootRoute({
<<<<<<< HEAD
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
=======
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

<<<<<<< HEAD
function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-ink text-bone overflow-x-hidden">
=======
function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());
  const location = useLocation();
  const [consentLoaded, setConsentLoaded] = useState(false);
  const [hasMarketingConsent, setHasMarketingConsent] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CONSENT_KEY);
    setHasMarketingConsent(stored === "accepted");
    setShowConsentBanner(stored === null);
    setConsentLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasMarketingConsent) return;
    initMetaPixel();
  }, [hasMarketingConsent]);

  useEffect(() => {
    if (!hasMarketingConsent) return;
    trackMetaPageView();
  }, [hasMarketingConsent, location.pathname, location.searchStr]);

  const acceptCookies = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CONSENT_KEY, "accepted");
    }
    setHasMarketingConsent(true);
    setShowConsentBanner(false);
    initMetaPixel();
    trackMetaPageView();
  };

  const declineCookies = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CONSENT_KEY, "declined");
    }
    setHasMarketingConsent(false);
    setShowConsentBanner(false);
  };

  return (
    <RootShell>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <LangBootstrap />
              <Header />
              <main className="min-h-screen bg-ink overflow-x-hidden">
                <Outlet />
              </main>
              <Footer />
              <WhatsAppFloat />
              <CartDrawer />
              {consentLoaded && showConsentBanner && (
                <CookieConsentBanner
                  onAccept={acceptCookies}
                  onDecline={declineCookies}
                />
              )}
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </QueryClientProvider>
    </RootShell>
  );
}

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
        {children}
        <Scripts />
      </body>
    </html>
  );
}
<<<<<<< HEAD

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <LangBootstrap />
            <Header />
            <main className="min-h-screen bg-ink overflow-x-hidden">
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
=======
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
