import { createFileRoute } from "@tanstack/react-router";
import { RedirectToCollection } from "@/components/RedirectToCollection";

export const Route = createFileRoute("/trunk-shows")({
  head: () => ({
    meta: [
      { title: "MEN OF GRACE — Collection" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RedirectToCollection,
});
