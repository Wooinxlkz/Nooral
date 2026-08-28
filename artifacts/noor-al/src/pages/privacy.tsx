import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { InfoPageLayout } from "@/components/layout/info-layout";

const SECTIONS = [
  { id: "overview",    title: "Overview" },
  { id: "collect",    title: "Data we collect" },
  { id: "use",        title: "How we use it" },
  { id: "storage",    title: "Data storage" },
  { id: "cookies",    title: "Cookies" },
  { id: "third",      title: "Third-party services" },
  { id: "rights",     title: "Your rights" },
  { id: "children",   title: "Children's privacy" },
  { id: "changes",    title: "Policy changes" },
  { id: "contact",    title: "Contact us" },
];

function TOC({ active }: { active: string }) {
  return (
    <aside className="hidden lg:block sticky top-24 self-start w-56 shrink-0">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4 px-2">
        On this page
      </p>
      <nav className="flex flex-col gap-0.5">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`text-sm px-2 py-1.5 rounded-lg transition-colors duration-150 ${
              active === s.id
                ? "text-primary font-medium bg-primary/8"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default function PrivacyPage() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <InfoPageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/6 via-transparent to-transparent"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-5"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 rounded-full">
              <Shield className="h-3.5 w-3.5" />
              Privacy Policy
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Your privacy matters to us
            </h1>
            <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
              We believe your spiritual journey is personal. Here's exactly what
              data we collect, why, and how it's protected.
            </p>
            <p className="text-xs text-muted-foreground/60 border border-border/40 rounded-lg px-4 py-2 bg-muted/30">
              Last updated: June 25, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-16 flex gap-16">
        <TOC active={active} />

        <article className="flex-1 min-w-0 prose-custom">
          <Section id="overview" title="Overview">
            <p>
              NoorAl ("we", "our", or "us") is committed to protecting your
              personal information. This Privacy Policy explains what data we
              collect when you use NoorAl, why we collect it, and how we
              handle it. By using NoorAl, you agree to this policy.
            </p>
            <p>
              We will never sell your data. We will never share your personal
              information with third parties for advertising purposes. Your
              Quran reading habits, notes, bookmarks, and memorization progress
              are yours alone.
            </p>
          </Section>

          <Section id="collect" title="Data we collect">
            <p>We collect only what we need to provide the service:</p>
            <ul>
              <li>
                <strong>Account information</strong> — your name, email address,
                and profile picture when you create an account via Clerk.
              </li>
              <li>
                <strong>Reading progress</strong> — the last surah and ayah you
                read, so we can restore your position.
              </li>
              <li>
                <strong>User content</strong> — notes, bookmarks, and
                collections you create are stored on our servers so they sync
                across your devices.
              </li>
              <li>
                <strong>Memorization data</strong> — which surahs you are
                memorizing, your review intervals, and hard-ayah flags.
              </li>
              <li>
                <strong>Preferences</strong> — your chosen theme, font size,
                translation, and reciter are saved locally in your browser.
              </li>
              <li>
                <strong>Usage data</strong> — anonymous, aggregated metrics
                such as which pages are visited most. No individual tracking.
              </li>
            </ul>
            <p>
              We do <strong>not</strong> collect payment information (we are
              free), location beyond what you choose to share for prayer times,
              or any biometric data.
            </p>
          </Section>

          <Section id="use" title="How we use it">
            <p>We use your data only to:</p>
            <ul>
              <li>Provide and improve the NoorAl service</li>
              <li>Sync your content (notes, bookmarks, progress) across devices</li>
              <li>Send essential service emails (e.g. email verification)</li>
              <li>Respond to your support requests</li>
              <li>Understand aggregate usage to improve features</li>
            </ul>
            <p>
              We do <strong>not</strong> use your data for advertising, profiling,
              or any purpose beyond what is listed above.
            </p>
          </Section>

          <Section id="storage" title="Data storage">
            <p>
              Your account data and user content are stored securely in our
              PostgreSQL database hosted on Neon (a GDPR-compliant cloud
              provider). Data is encrypted at rest and in transit using TLS.
            </p>
            <p>
              Your preferences (theme, font size, reciter) are stored
              locally in your browser's localStorage and never sent to our
              servers.
            </p>
            <p>
              We retain your data as long as your account is active. You may
              request deletion at any time (see "Your rights" below).
            </p>
          </Section>

          <Section id="cookies" title="Cookies">
            <p>
              NoorAl uses minimal cookies:
            </p>
            <ul>
              <li>
                <strong>Authentication cookies</strong> — set by Clerk to keep
                you signed in. These are session cookies and expire when you
                sign out.
              </li>
              <li>
                <strong>No advertising or tracking cookies.</strong> We do not
                use Google Analytics, Facebook Pixel, or any equivalent
                third-party tracking.
              </li>
            </ul>
          </Section>

          <Section id="third" title="Third-party services">
            <p>NoorAl uses these third-party services:</p>
            <ul>
              <li>
                <strong>Clerk</strong> (authentication) — manages sign-in and
                sign-up. Clerk's privacy policy applies to authentication data.
              </li>
              <li>
                <strong>quran.com API</strong> — Quran text, translations, and
                audio. No personal data is sent to them.
              </li>
              <li>
                <strong>aladhan.com</strong> — prayer time calculations. Your
                coordinates are sent anonymously, not tied to your account.
              </li>
              <li>
                <strong>ahadith.co</strong> — hadith content. No personal data
                is sent.
              </li>
            </ul>
          </Section>

          <Section id="rights" title="Your rights">
            <p>You have the right to:</p>
            <ul>
              <li>
                <strong>Access</strong> — request a copy of all data we hold
                about you.
              </li>
              <li>
                <strong>Correct</strong> — update any inaccurate personal
                information.
              </li>
              <li>
                <strong>Delete</strong> — request full deletion of your account
                and all associated data.
              </li>
              <li>
                <strong>Export</strong> — request an export of your notes,
                bookmarks, and progress.
              </li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:privacy@nooral.app" className="text-primary underline">
                privacy@nooral.app
              </a>
              . We respond within 30 days.
            </p>
          </Section>

          <Section id="children" title="Children's privacy">
            <p>
              NoorAl is not directed at children under 13. We do not knowingly
              collect personal information from anyone under 13. If you believe
              a child has provided us personal information, contact us
              immediately and we will delete it.
            </p>
          </Section>

          <Section id="changes" title="Policy changes">
            <p>
              We may update this policy from time to time. When we do, we will
              update the "Last updated" date at the top and, for material
              changes, notify you by email. Continued use of NoorAl after
              changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section id="contact" title="Contact us">
            <p>
              Questions about this Privacy Policy? We'd love to hear from you:
            </p>
            <ul>
              <li>
                Email:{" "}
                <a href="mailto:privacy@nooral.app" className="text-primary underline">
                  privacy@nooral.app
                </a>
              </li>
            </ul>
          </Section>
        </article>
      </div>
    </InfoPageLayout>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-24">
      <h2 className="text-xl font-bold text-foreground mb-5 pb-3 border-b border-border/40">
        {title}
      </h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed text-sm [&_strong]:text-foreground [&_a]:text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}
