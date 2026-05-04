import { createFileRoute } from "@tanstack/react-router";

const BODY = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /checkout
Disallow: /account
Disallow: /update-password
Disallow: /forgot-password
Disallow: /lovable/

Sitemap: https://menofgrace.store/sitemap.xml
`;

export const Route = createFileRoute("/robots[.]txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(BODY, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
