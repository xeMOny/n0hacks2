const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    // La sesión viaja en una cookie httpOnly (Secure + SameSite=Strict, la
    // pone el backend en /auth/login) — el navegador la adjunta solo si
    // "credentials: include" está presente. No hay token accesible desde
    // JS: un XSS no puede robarlo leyendo localStorage/sessionStorage.
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || `Error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}
