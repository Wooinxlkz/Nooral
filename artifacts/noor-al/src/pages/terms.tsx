import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";
import { InfoPageLayout } from "@/components/layout/info-layout";

const SECTIONS = [
  { id: "acceptance",   title: "Acceptance of terms" },
  { id: "service",      title: "Use of service" },
  { id: "account",      title: "Your account" },
  { id: "content",      title: "User content" },
  { id: "prohibited",   title: "Prohibited conduct" },
  { id: "ip",           title: "Intellectual property" },
  { id: "third",        title: "Third-party links" },
  { id: "disclaimers",  title: "Disclaimers" },
  { id: "liability",    title: "Limitation of liability" },
  { id: "governing",    title: "Governing law" },
  { id: "changes",      title: "Changes to terms" },
  { id: "contact",      title: "Contact us" },
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

export default function TermsPage() {
  const [active, setActive] = useState("acceptance");

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
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-500/6 via-transparent to-transparent"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-5"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 border border-amber-500/30 bg-amber-500/5 px-3 py-1.5 rounded-full">
              <ScrollText className="h-3.5 w-3.5" />
              Terms of Service
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Terms & conditions
            </h1>
            <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
              Please read these terms carefully before using NoorAl. By using
              our service, you agree to be bound by them.
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

        <article className="flex-1 min-w-0">
          <Section id="acceptance" title="Acceptance of terms">
            <p>
              By accessing or using NoorAl ("the Service"), you agree to be
              bound by these Terms of Service ("Terms"). If you do not agree to
              these Terms, please do not use the Service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access
              or use the Service.
            </p>
          </Section>

          <Section id="service" title="Use of service">
            <p>
              NoorAl provides a platform for reading and studying the Quran,
              tracking memorization progress, accessing Islamic content, and
              related features. The Service is provided for personal,
              non-commercial use.
            </p>
            <p>
              You agree to use the Service only for lawful purposes and in
              accordance with these Terms. NoorAl reserves the right to
              terminate access for any user who violates these Terms.
            </p>
          </Section>

          <Section id="account" title="Your account">
            <p>
              To access certain features of the Service, you must create an
              account. You are responsible for:
            </p>
            <ul>
              <li>
                Maintaining the confidentiality of your account credentials
              </li>
              <li>
                All activity that occurs under your account
              </li>
              <li>
                Providing accurate and complete information during registration
              </li>
              <li>
                Notifying us immediately of any unauthorized use of your account
              </li>
            </ul>
            <p>
              You may not share your account with others or create multiple
              accounts.
            </p>
          </Section>

          <Section id="content" title="User content">
            <p>
              NoorAl allows you to create notes, bookmarks, and collections
              ("User Content"). You retain ownership of any content you create.
              By creating content on NoorAl, you grant us a limited licence to
              store and display that content solely to provide the Service to you.
            </p>
            <p>
              You are solely responsible for your User Content. You agree not
              to post content that is unlawful, harmful, offensive, or violates
              the rights of others.
            </p>
          </Section>

          <Section id="prohibited" title="Prohibited conduct">
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose</li>
              <li>
                Attempt to gain unauthorized access to any part of the Service
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                Service
              </li>
              <li>
                Reverse engineer, decompile, or disassemble any part of the
                Service
              </li>
              <li>
                Use automated tools (bots, scrapers) to access the Service
                without our written consent
              </li>
              <li>
                Impersonate any person or entity or misrepresent your
                affiliation with any person or entity
              </li>
              <li>
                Upload or transmit viruses or any other malicious code
              </li>
            </ul>
          </Section>

          <Section id="ip" title="Intellectual property">
            <p>
              The NoorAl name, logo, and all related UI, code, and design
              ("NoorAl IP") are the exclusive property of NoorAl. You may not
              use NoorAl IP without our prior written consent.
            </p>
            <p>
              Quran text, translations, and hadith content are sourced from
              verified scholarly works and their respective rights holders. We
              do not claim ownership of Islamic religious texts.
            </p>
          </Section>

          <Section id="third" title="Third-party links">
            <p>
              The Service may contain links to third-party websites or services
              that are not owned or controlled by NoorAl. We have no control
              over and assume no responsibility for the content, privacy
              policies, or practices of any third-party sites.
            </p>
          </Section>

          <Section id="disclaimers" title="Disclaimers">
            <p>
              The Service is provided on an "as is" and "as available" basis
              without warranties of any kind. NoorAl does not warrant that the
              Service will be uninterrupted, error-free, or completely secure.
            </p>
            <p>
              NoorAl is not a religious authority and the content on the
              platform should not be used as a substitute for guidance from
              qualified Islamic scholars.
            </p>
          </Section>

          <Section id="liability" title="Limitation of liability">
            <p>
              To the maximum extent permitted by applicable law, NoorAl shall
              not be liable for any indirect, incidental, special, consequential,
              or punitive damages arising from your use of the Service.
            </p>
            <p>
              In no event shall NoorAl's total liability to you exceed the
              greater of (a) the amount you paid for the Service in the past
              twelve months or (b) $50 USD.
            </p>
          </Section>

          <Section id="governing" title="Governing law">
            <p>
              These Terms shall be governed by and construed in accordance with
              applicable law. Any disputes arising under these Terms shall be
              resolved through binding arbitration.
            </p>
          </Section>

          <Section id="changes" title="Changes to terms">
            <p>
              We reserve the right to modify these Terms at any time. We will
              provide notice of significant changes by updating the "Last
              updated" date and, where appropriate, notifying you by email.
              Your continued use of the Service after such changes constitutes
              your acceptance of the new Terms.
            </p>
          </Section>

          <Section id="contact" title="Contact us">
            <p>
              Questions about these Terms? Contact us:
            </p>
            <ul>
              <li>
                Email:{" "}
                <a href="mailto:legal@nooral.app" className="text-primary underline">
                  legal@nooral.app
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
