import * as React from "react";
import { useAuthContext } from "@/lib/auth";
import { X, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ArrowRight, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedOTPInput } from "@/components/ui/animated-otp-input";
import { useAuthModal } from "@/lib/auth-modal-store";
import { DevLoginModal } from "@/components/dev-login-modal";

/* ─────────────────────── types ───────────────────────────────── */
type Mode = "sign-in" | "sign-up";

/* ─────────────────────── dev trigger hook ────────────────────── */
function useDevTrigger(onActivate: () => void) {
  const tripleClickCount = React.useRef(0);
  const tripleClickTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        onActivate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onActivate]);

  const handleLogoClick = React.useCallback(() => {
    tripleClickCount.current += 1;
    if (tripleClickTimer.current) clearTimeout(tripleClickTimer.current);
    tripleClickTimer.current = setTimeout(() => { tripleClickCount.current = 0; }, 600);
    if (tripleClickCount.current >= 3) {
      tripleClickCount.current = 0;
      onActivate();
    }
  }, [onActivate]);

  return handleLogoClick;
}
type Step = "form" | "otp";

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 28, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -28, scale: 0.98 }),
};

/* ─────────────────────── small helpers ───────────────────────── */
function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}
          className="flex items-center gap-1.5 text-xs text-destructive mt-1"
        >
          <AlertCircle className="h-3 w-3 shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function AlertBanner({ type, message }: { type: "error" | "success"; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm",
        type === "error"
          ? "bg-destructive/10 border-destructive/30 text-destructive"
          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
      )}
    >
      {type === "error"
        ? <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        : <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />}
      <span className="leading-snug">{message}</span>
    </motion.div>
  );
}

function PasswordInput({
  id, placeholder, value, onChange, disabled, autoComplete, hasError,
}: {
  id: string; placeholder?: string; value: string;
  onChange: (v: string) => void; disabled?: boolean;
  autoComplete?: string; hasError?: boolean;
}) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative">
      <Input
        id={id} type={show ? "text" : "password"}
        placeholder={placeholder ?? "••••••••"} value={value}
        onChange={(e) => onChange(e.target.value)} disabled={disabled}
        autoComplete={autoComplete}
        className={cn("pr-10", hasError && "border-destructive focus-visible:ring-destructive/30")}
      />
      <button
        type="button" tabIndex={-1} onClick={() => setShow((s) => !s)} disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

/* ─────────────────────── sign-in form ────────────────────────── */
function SignInForm({
  onSwitchMode, onSuccess,
}: { onSwitchMode: () => void; onOtpNeeded: () => void; onSuccess: () => void }) {
  const { signIn } = useAuthContext();
  const isLoaded = true;
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState<{ type: "error" | "success"; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const clear = () => { setAlert(null); setFieldErrors({}); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); clear();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setAlert({ type: "error", message: error });
        return;
      }
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Invalid credentials.";
      setAlert({ type: "error", message: msg });
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <AnimatePresence mode="wait">
        {alert && <AlertBanner key={alert.message} type={alert.type} message={alert.message} />}
      </AnimatePresence>
      <div className="space-y-1.5">
        <Label htmlFor="si-email">Email</Label>
        <Input id="si-email" type="email" placeholder="you@example.com" value={email}
          onChange={(e) => { setEmail(e.target.value); clear(); }} disabled={loading} autoComplete="email"
          className={fieldErrors.email ? "border-destructive focus-visible:ring-destructive/30" : ""} />
        <FieldError message={fieldErrors.email} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="si-password">Password</Label>
        <PasswordInput id="si-password" value={password} onChange={(v) => { setPassword(v); clear(); }}
          disabled={loading} autoComplete="current-password" hasError={!!fieldErrors.password} />
        <FieldError message={fieldErrors.password} />
      </div>
      <Button type="submit" className="w-full" disabled={loading || !isLoaded}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
        Sign in
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onSwitchMode} className="text-primary font-medium hover:underline">
          Create one
        </button>
      </p>
    </form>
  );
}

/* ─────────────────────── sign-up form ────────────────────────── */
function SignUpForm({
  onSwitchMode, onSuccess,
}: { onSwitchMode: () => void; onOtpNeeded: () => void; onEmailSet: (e: string) => void; onSuccess: () => void }) {
  const { signUp } = useAuthContext();
  const isLoaded = true;
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState<{ type: "error" | "success"; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const clear = () => { setAlert(null); setFieldErrors({}); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "At least 8 characters";
    if (!confirm) e.confirm = "Please confirm your password";
    else if (password !== confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); clear();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) {
        setAlert({ type: "error", message: error });
        return;
      }
      // Email verification (OTP) is temporarily disabled — accounts are active immediately.
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Could not create account.";
      setAlert({ type: "error", message: msg });
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <AnimatePresence mode="wait">
        {alert && <AlertBanner key={alert.message} type={alert.type} message={alert.message} />}
      </AnimatePresence>
      <div className="space-y-1.5">
        <Label htmlFor="su-email">Email</Label>
        <Input id="su-email" type="email" placeholder="you@example.com" value={email}
          onChange={(e) => { setEmail(e.target.value); clear(); }} disabled={loading} autoComplete="email"
          className={fieldErrors.email ? "border-destructive focus-visible:ring-destructive/30" : ""} />
        <FieldError message={fieldErrors.email} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="su-password">Password</Label>
        <PasswordInput id="su-password" placeholder="At least 8 characters" value={password}
          onChange={(v) => { setPassword(v); clear(); }} disabled={loading} autoComplete="new-password"
          hasError={!!fieldErrors.password} />
        <FieldError message={fieldErrors.password} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="su-confirm">Confirm password</Label>
        <PasswordInput id="su-confirm" placeholder="Repeat your password" value={confirm}
          onChange={(v) => { setConfirm(v); clear(); }} disabled={loading} autoComplete="new-password"
          hasError={!!fieldErrors.confirm} />
        <FieldError message={fieldErrors.confirm} />
      </div>
      <Button type="submit" className="w-full" disabled={loading || !isLoaded}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
        Create account
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button type="button" onClick={onSwitchMode} className="text-primary font-medium hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ─────────────────────── OTP step ────────────────────────────── */
function OtpStep({
  title, description, email, onVerify, onResend, onBack,
}: {
  title: string; description: string; email?: string;
  onVerify: (code: string) => Promise<void>;
  onResend?: () => Promise<void>;
  onBack: () => void;
}) {
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleVerify = async (c: string) => {
    if (c.length < 6) { setAlert({ type: "error", message: "Please enter all 6 digits." }); return; }
    setAlert(null); setLoading(true);
    try { await onVerify(c); }
    catch (err: unknown) {
      setAlert({ type: "error", message: (err as { message?: string })?.message ?? "Verification failed." });
      setCode("");
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (!onResend) return;
    setAlert(null);
    try { await onResend(); setAlert({ type: "success", message: `New code sent${email ? ` to ${email}` : ""}.` }); }
    catch { setAlert({ type: "error", message: "Failed to resend. Please wait." }); }
  };

  return (
    <motion.div
      key="otp" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      <div className="text-center space-y-1 pb-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <AnimatePresence mode="wait">
        {alert && <AlertBanner key={alert.message} type={alert.type} message={alert.message} />}
      </AnimatePresence>
      <div className="flex justify-center pt-2">
        <AnimatedOTPInput value={code} onChange={(v) => { setCode(v); setAlert(null); }}
          onComplete={(v) => handleVerify(v)} maxLength={6} />
      </div>
      <Button className="w-full" disabled={loading || code.length < 6} onClick={() => handleVerify(code)}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
        Confirm code
      </Button>
      {onResend && (
        <div className="flex flex-col items-center gap-1.5 text-sm text-muted-foreground">
          <span>Didn&apos;t receive it?</span>
          <button type="button" disabled={loading} onClick={handleResend}
            className="flex items-center gap-1.5 text-primary font-medium hover:underline disabled:opacity-50">
            <RotateCcw className="h-3.5 w-3.5" /> Resend code
          </button>
        </div>
      )}
      <button type="button" onClick={onBack}
        className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Go back
      </button>
    </motion.div>
  );
}

/* ─────────────────────── AuthCardContent ─────────────────────── */
export function AuthCardContent({
  initialMode = "sign-in",
  onSuccess,
  onClose,
}: {
  initialMode?: Mode;
  onSuccess: () => void;
  onClose?: () => void;
}) {
  const [mode, setMode] = React.useState<Mode>(initialMode);
  const [step] = React.useState<Step>("form");
  const [otpEmail, setOtpEmail] = React.useState("");
  const [direction, setDirection] = React.useState(1);

  const [devModalOpen, setDevModalOpen] = React.useState(false);
  const handleLogoClick = useDevTrigger(() => setDevModalOpen(true));

  const switchMode = (next: Mode) => {
    setDirection(next === "sign-up" ? 1 : -1);
    setMode(next);
  };

  // NOTE: OTP/2FA verification is currently disabled (kept below, unreachable, for future use).
  const isOtp = false && step === "otp";

  return (
    <div className="bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden w-full">
      {/* Brand strip + mode tabs */}
      <div className="px-5 pt-6 pb-4 sm:px-8 sm:pt-7 sm:pb-5 text-center border-b border-border/30 relative">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="flex justify-center mb-3">
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt="NoorAl"
            className="h-10 w-10 sm:h-11 sm:w-11 object-contain rounded-xl cursor-pointer select-none"
            onClick={handleLogoClick}
            draggable={false}
          />
        </div>
        <DevLoginModal
          open={devModalOpen}
          onClose={() => setDevModalOpen(false)}
          onSuccess={() => { setDevModalOpen(false); window.location.href = `${import.meta.env.BASE_URL}dev-console`; }}
        />
        {!isOtp && (
          <div className="flex gap-1 bg-muted rounded-xl p-1 mt-3 sm:mt-4">
            {(["sign-in", "sign-up"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200",
                  mode === m
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m === "sign-in" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Animated form area */}
      <div className="px-5 py-5 sm:px-8 sm:py-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {/* OTP/2FA step is temporarily disabled — isOtp is always false, so this branch is unreachable. */}
          {isOtp ? null : (
            <motion.div
              key={`${mode}-form`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              {mode === "sign-in" ? (
                <SignInForm
                  onSwitchMode={() => switchMode("sign-up")}
                  onOtpNeeded={() => {}}
                  onSuccess={onSuccess}
                />
              ) : (
                <SignUpForm
                  onSwitchMode={() => switchMode("sign-in")}
                  onOtpNeeded={() => {}}
                  onEmailSet={setOtpEmail}
                  onSuccess={onSuccess}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground pb-4 px-5 sm:pb-5 sm:px-8">
        By continuing you agree to our{" "}
        <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-2 hover:underline">Terms</a>{" "}&amp;{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-2 hover:underline">Privacy Policy</a>.
      </p>
    </div>
  );
}

/* ─────────────────────── Global Auth Modal ───────────────────── */
export function AuthModal() {
  const { open, mode, closeModal } = useAuthModal();

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, closeModal]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          {/* Scroll container — needs pointer-events-auto so scroll wheel works */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[61] overflow-y-auto"
            aria-modal="true"
            role="dialog"
            onClick={closeModal}
          >
            <div className="flex min-h-full items-center justify-center px-3 py-5 sm:px-6 sm:py-8">
              <div
                className="w-full max-w-[22rem] sm:max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <AuthCardContent
                  initialMode={mode}
                  onSuccess={closeModal}
                  onClose={closeModal}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────── Legacy / route compat ───────────────── */
export function AuthPage({ initialMode = "sign-in" }: { initialMode?: Mode }) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <AuthCardContent initialMode={initialMode} onSuccess={() => { window.location.href = "/"; }} />
      </div>
    </div>
  );
}

export function CustomSignIn({ signUpUrl: _ }: { signUpUrl: string }) {
  return <AuthPage initialMode="sign-in" />;
}
export function CustomSignUp({ signInUrl: _ }: { signInUrl: string }) {
  return <AuthPage initialMode="sign-up" />;
}
