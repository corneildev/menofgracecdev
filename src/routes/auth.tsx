import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Compte — MEN OF GRACE" },
      { name: "description", content: "Connectez-vous ou créez votre compte privé MEN OF GRACE." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!loading && user) navigate({ to: "/account" });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    if (mode === "signin") {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      const { error } = await signUp(email, password, fullName);
      if (error) setError(error);
      else setInfo("Compte créé. Vous êtes connecté.");
    }
    setBusy(false);
  };

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <div className="eyebrow text-bone/60 mb-6">— Espace Privé —</div>
          <h1 className="display text-4xl md:text-5xl mb-4">{mode === "signin" ? "Connexion" : "Créer un compte"}</h1>
          <p className="text-bone/60 font-light text-sm">
            {mode === "signin" ? "Accédez à vos commandes et mesures." : "Rejoignez le cercle MEN OF GRACE."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {mode === "signup" && (
            <Field label="Nom complet">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-transparent border-b border-hairline py-3 text-bone focus:outline-none focus:border-bone transition-colors"
              />
            </Field>
          )}
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-hairline py-3 text-bone focus:outline-none focus:border-bone transition-colors"
            />
          </Field>
          <Field label="Mot de passe">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-transparent border-b border-hairline py-3 text-bone focus:outline-none focus:border-bone transition-colors"
            />
          </Field>

          {error && <p className="text-sm text-bone/90 border-l-2 border-bone pl-4">{error}</p>}
          {info && <p className="text-sm text-bone/70 border-l-2 border-hairline pl-4">{info}</p>}

          <button type="submit" disabled={busy} className="luxury-btn luxury-btn-solid w-full disabled:opacity-50">
            {busy ? "…" : mode === "signin" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>

        <div className="text-center mt-8">
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setInfo(""); }}
            className="eyebrow text-bone/60 hover:text-bone transition-colors"
          >
            {mode === "signin" ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="eyebrow text-bone/40 hover:text-bone/70 text-[10px]">← Retour</Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="eyebrow text-bone/60 mb-2 block">{label}</label>
      {children}
    </div>
  );
}
