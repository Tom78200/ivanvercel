export function getAdminToken(): string | null {
  try {
    return localStorage.getItem("admin_token");
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  try {
    localStorage.setItem("admin_token", token);
  } catch {
    // ignore
  }
}

export function clearAdminToken(): void {
  try {
    localStorage.removeItem("admin_token");
  } catch {
    // ignore
  }
}

export function getAdminHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = getAdminToken();
  const headers: Record<string, string> = { ...extraHeaders };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}
