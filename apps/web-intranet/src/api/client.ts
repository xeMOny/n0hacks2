const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorageSafeGet("token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// Nota: sustituir por manejo de sesión real (contexto/estado) antes de producción.
function localStorageSafeGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
