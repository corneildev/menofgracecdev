import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/update-password")({
  head: () => ({
    meta: [
      { title: "Mise à jour du mot de passe — MEN OF GRACE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UpdatePasswordPage,
});

function UpdatePasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);

    const { error } = await updatePassword(password);
    if (error) {
      setError(error);
    } else {
      setInfo("Mot de passe mis à jour avec succès.");
      setTimeout(() => {
        navigate({ to: "/account" });
      }, 2000);
    }
    setBusy(false);
  };

  if (hasSession === false) {
    return (
      <div className="pt-40 pb-32 px-6 text-center bg-ink min-h-screen">
        <p className="text-bone mb-4">Le lien a expiré ou est invalide.</p>
        <Link to="/forgot-password" className="eyebrow underline text-bone/60">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <div className="eyebrow text-bone/60 mb-6">— Sécurité —</div>
          <h1 className="display text-4xl md:text-5xl mb-4">
            Nouveau mot de passe
          </h1>
          <p className="text-bone/60 font-light text-sm">
            Entrez votre nouveau mot de passe ci-dessous.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="eyebrow text-bone/60 mb-2 block">Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-transparent border-b border-hairline py-3 text-bone focus:outline-none focus:border-bone transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-bone/90 border-l-2 border-bone pl-4">
              {error}
            </p>
          )}
          {info && (
            <p className="text-sm text-bone/70 border-l-2 border-hairline pl-4">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || hasSession === null}
            className="luxury-btn luxury-btn-solid w-full disabled:opacity-50"
          >
            {busy ? "…" : "Mettre à jour le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
