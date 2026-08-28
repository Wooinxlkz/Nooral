const KEY = "nooral-dev-session";
const INACTIVITY_TTL = 30 * 60 * 1000;
// Must match backend SESSION_TTL_MS in devAuth.ts — hard cap from login time
const HARD_SESSION_TTL = 30 * 60 * 1000;

export interface DevSession {
  token: string;
  name: string;
  loginTime: number;
  lastActivity: number;
}

export function getDevSession(): DevSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const session: DevSession = JSON.parse(raw);
    const now = Date.now();
    // Expire if idle too long OR if the backend hard TTL (from loginTime) has elapsed
    if (now - session.lastActivity > INACTIVITY_TTL || now - session.loginTime > HARD_SESSION_TTL) {
      clearDevSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setDevSession(token: string, name: string, loginTime: number) {
  const session: DevSession = { token, name, loginTime, lastActivity: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearDevSession() {
  localStorage.removeItem(KEY);
}

export function touchDevSession() {
  const session = getDevSession();
  if (session) {
    session.lastActivity = Date.now();
    localStorage.setItem(KEY, JSON.stringify(session));
  }
}

export function isDevSessionActive(): boolean {
  return getDevSession() !== null;
}

export function devFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const session = getDevSession();
  if (!session) return Promise.reject(new Error("No dev session"));
  touchDevSession();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
      "x-dev-session": session.token,
    },
  });
}
