import * as React from "react";

interface ApiUser {
  id: string;
  email: string | null;
  displayName: string | null;
  imageUrl: string | null;
}

export interface AppUser {
  id: string;
  email: string | null;
  displayName: string | null;
  imageUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  fullName: string | null;
  primaryEmailAddress: { emailAddress: string } | null;
  emailAddresses: { emailAddress: string }[];
  setProfileImage: (opts: { file: File | null }) => Promise<void>;
}

function toAppUser(u: ApiUser | null): AppUser | null {
  if (!u) return null;
  const namePart = u.displayName?.trim() || "";
  const parts = namePart ? namePart.split(/\s+/) : [];
  const firstName = parts[0] ?? null;
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : null;
  const username = u.email ? u.email.split("@")[0] : null;
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    imageUrl: u.imageUrl,
    firstName,
    lastName,
    username,
    fullName: namePart || null,
    primaryEmailAddress: u.email ? { emailAddress: u.email } : null,
    emailAddresses: u.email ? [{ emailAddress: u.email }] : [],
    setProfileImage: async () => {
      /* avatar upload is not supported by the custom auth system yet */
    },
  };
}

type AuthListener = (payload: { user: AppUser | null }) => void;

export interface AuthResult {
  error?: string;
}

interface AuthContextValue {
  user: AppUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: (opts?: { redirectUrl?: string }) => Promise<void>;
  refresh: () => Promise<void>;
  addListener: (cb: AuthListener) => () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const API_BASE = `${basePath}/api/auth`;

async function parseJson(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AppUser | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const listenersRef = React.useRef<Set<AuthListener>>(new Set());

  const notify = React.useCallback((u: AppUser | null) => {
    listenersRef.current.forEach((cb) => cb({ user: u }));
  }, []);

  const setUserAndNotify = React.useCallback(
    (u: AppUser | null) => {
      setUser(u);
      notify(u);
    },
    [notify],
  );

  const refresh = React.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/me`, { credentials: "include" });
      const data = res.ok ? await parseJson(res) : null;
      setUser(toAppUser(data));
    } catch {
      setUser(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const signIn = React.useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const res = await fetch(`${API_BASE}/signin`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await parseJson(res);
      if (!res.ok) return { error: data?.error ?? "Sign in failed." };
      setUserAndNotify(toAppUser(data));
      return {};
    },
    [setUserAndNotify],
  );

  const signUp = React.useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await parseJson(res);
      if (!res.ok) return { error: data?.error ?? "Could not create account." };
      setUserAndNotify(toAppUser(data));
      return {};
    },
    [setUserAndNotify],
  );

  const signOut = React.useCallback(
    async (opts?: { redirectUrl?: string }) => {
      await fetch(`${API_BASE}/signout`, { method: "POST", credentials: "include" }).catch(() => {});
      setUserAndNotify(null);
      if (opts?.redirectUrl) {
        window.location.href = opts.redirectUrl;
      }
    },
    [setUserAndNotify],
  );

  const addListener = React.useCallback((cb: AuthListener) => {
    listenersRef.current.add(cb);
    return () => {
      listenersRef.current.delete(cb);
    };
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, isLoaded, isSignedIn: !!user, signIn, signUp, signOut, refresh, addListener }),
    [user, isLoaded, signIn, signUp, signOut, refresh, addListener],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within an AuthProvider");
  return ctx;
}

/* ── Clerk-compatible hooks (kept to minimize edits across the app) ── */
export function useAuth() {
  const { isSignedIn, isLoaded, user, signOut } = useAuthContext();
  return { isSignedIn, isLoaded, userId: user?.id ?? null, signOut };
}

export function useUser() {
  const { user, isLoaded, isSignedIn } = useAuthContext();
  return { user, isLoaded, isSignedIn };
}

export function useClerk() {
  const { signOut, addListener } = useAuthContext();
  return { signOut, addListener };
}
