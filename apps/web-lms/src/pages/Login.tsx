import { useState } from "react";
import { apiFetch } from "../api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // El backend responde con Set-Cookie (httpOnly), no hay token que guardar en JS.
      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      window.location.href = "/mi-area";
    } catch {
      setError("Credenciales inválidas");
    }
  }

  return (
    <main style={{ padding: 32, maxWidth: 320 }}>
      <h2>Acceder</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          autoComplete="username"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </main>
  );
}
