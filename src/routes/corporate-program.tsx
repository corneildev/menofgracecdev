import { createFileRoute } from "@tanstack/react-router";
import { RedirectToCollection } from "@/components/RedirectToCollection";

export const Route = createFileRoute("/corporate-program")({
  head: () => ({
    meta: [
      { title: "MEN OF GRACE — Collection" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RedirectToCollection,
});
