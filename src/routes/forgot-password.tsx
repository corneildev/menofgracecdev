import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Mot de passe oublié — MEN OF GRACE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);

    const { error } = await resetPassword(email);
    if (error) {
      setError(error);
    } else {
      setInfo("Si cet email existe, un lien de réinitialisation vous a été envoyé.");
    }
    setBusy(false);
  };

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <div className="eyebrow text-bone/60 mb-6">— Récupération —</div>
          <h1 className="display text-4xl md:text-5xl mb-4">
            Mot de passe oublié
          </h1>
          <p className="text-bone/60 font-light text-sm">
            Entrez l'email associé à votre compte pour recevoir un lien de réinitialisation.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="eyebrow text-bone/60 mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            disabled={busy}
            className="luxury-btn luxury-btn-solid w-full disabled:opacity-50"
          >
            {busy ? "…" : "Envoyer le lien"}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link
            to="/auth"
            className="eyebrow text-bone/60 hover:text-bone transition-colors"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
