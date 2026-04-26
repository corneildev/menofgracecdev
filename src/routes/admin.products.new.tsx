import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProductEditor } from "@/components/admin/ProductEditor";

export const Route = createFileRoute("/admin/products/new")({
  head: () => ({ meta: [{ title: "Nouveau produit — MEN OF GRACE" }, { name: "robots", content: "noindex" }] }),
  component: NewProduct,
});

function NewProduct() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/account" });
  }, [user, isAdmin, loading, navigate]);
  if (loading || !user || !isAdmin) return null;
  return <ProductEditor />;
}
