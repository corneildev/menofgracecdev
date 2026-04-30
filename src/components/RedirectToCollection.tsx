import { Navigate } from "@tanstack/react-router";

/**
 * Stub component for routes that have been retired during the e-commerce
 * pivot. Renders nothing on screen; immediately client-redirects to /collection.
 *
 * The route files are kept (rather than deleted) so existing inbound links,
 * bookmarks and search results land softly on the collection page instead of
 * a hard 404.
 */
export function RedirectToCollection() {
  return <Navigate to="/collection" replace />;
}
