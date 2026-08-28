import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/lib/auth-modal-store";

interface SignInPromptProps {
  title?: string;
  description?: string;
}

export function SignInPrompt({
  title = "Sign in to continue",
  description = "Create a free account to track your reading, bookmarks, notes, and memorization progress.",
}: SignInPromptProps) {
  const openModal = useAuthModal((s) => s.openModal);

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
        <Lock className="w-7 h-7 text-primary" />
      </div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>
      <div className="flex gap-3">
        <Button onClick={() => openModal("sign-in")}>Sign In</Button>
        <Button variant="outline" onClick={() => openModal("sign-up")}>Create Account</Button>
      </div>
    </div>
  );
}
