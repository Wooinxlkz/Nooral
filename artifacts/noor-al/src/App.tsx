import { useEffect, useRef, useState } from "react";
import { AuthProvider, useClerk } from "@/lib/auth";
import { Switch, Route, useLocation, Router as WouterRouter } from 'wouter';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppStore } from "@/lib/store";
import { useAuthModal } from "@/lib/auth-modal-store";

import { AuthModal } from "@/components/auth-form";
import { SupportDialog } from "@/components/support-dialog";
import MainLayout from "@/components/layout/main-layout";
import { MorphPanel } from "@/components/ask-noor";
import { WelcomeBanner } from "@/components/welcome-banner";
import LandingPage from "@/pages/landing";
import AboutPage from "@/pages/about";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import DocumentationPage from "@/pages/documentation";
import ContributePage from "@/pages/contribute";
import ReaderPage from "@/pages/reader";
import DashboardPage from "@/pages/dashboard";
import MemorizationPage from "@/pages/memorization";
import NotesPage from "@/pages/notes";
import SearchPage from "@/pages/search";
import SettingsPage from "@/pages/settings";
import AhadithPage from "@/pages/ahadith";
import BookmarksPage from "@/pages/bookmarks";
import LanguageSelector from "@/pages/language-selector";

import NotFound from "@/pages/not-found";
import { LibraryHomePage } from "@/pages/library/home";
import { LibraryCategoryPage } from "@/pages/library/category";
import { LibraryArticlePage } from "@/pages/library/article";
import GivePage from "@/pages/give";
import PlansPage from "@/pages/plans";
import AnalyticsPage from "@/pages/analytics";
import DevConsolePage from "@/pages/dev-console/index";
import RecitersPage from "@/pages/reciters";
import RadioPage from "@/pages/radio";
import CollectionsPage from "@/pages/collections";
import CollectionDetailPage from "@/pages/collection-detail";
import ProfilePage from "@/pages/profile";
import CalendarPage from "@/pages/calendar";
import MediaPage from "@/pages/media";
import ReadingGoalPage from "@/pages/reading-goal";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

/* Open modal + redirect to reader (for /sign-in and /sign-up routes) */
function AuthRedirect({ mode }: { mode: "sign-in" | "sign-up" }) {
  const openModal = useAuthModal((s) => s.openModal);
  const [, setLocation] = useLocation();
  useEffect(() => {
    openModal(mode);
    setLocation("/reader", { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportType, setSupportType] = useState<"general" | "feature" | "bug" | undefined>(undefined);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ScrollToTop />
        <ClerkQueryClientCacheInvalidator />
        {/* Global auth modal — lives outside routes so it overlays any page */}
        <AuthModal />
        {/* Ask Noor — global AI panel, visible on every page */}
        <MorphPanel onOpenSupport={(type) => { setSupportType(type); setSupportOpen(true); }} />
        {/* Support dialog triggered by /support slash command or header button */}
        <SupportDialog open={supportOpen} onOpenChange={setSupportOpen} defaultType={supportType} />
        {/* Welcome banner — appears a few seconds after every app load */}
        <WelcomeBanner />
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/sign-in/*?">
            <AuthRedirect mode="sign-in" />
          </Route>
          <Route path="/sign-up/*?">
            <AuthRedirect mode="sign-up" />
          </Route>
          <Route path="/reader">
            <MainLayout><ReaderPage /></MainLayout>
          </Route>
          <Route path="/dashboard">
            <MainLayout><DashboardPage /></MainLayout>
          </Route>
          <Route path="/memorization">
            <MainLayout><MemorizationPage /></MainLayout>
          </Route>
          <Route path="/notes">
            <MainLayout><NotesPage /></MainLayout>
          </Route>
          <Route path="/search">
            <MainLayout><SearchPage /></MainLayout>
          </Route>
          <Route path="/settings">
            <MainLayout><SettingsPage /></MainLayout>
          </Route>
          <Route path="/ahadith">
            <MainLayout><AhadithPage /></MainLayout>
          </Route>
          <Route path="/bookmarks">
            <MainLayout><BookmarksPage /></MainLayout>
          </Route>
          <Route path="/library">
            <MainLayout><LibraryHomePage /></MainLayout>
          </Route>
          <Route path="/library/:categoryId">
            <MainLayout><LibraryCategoryPage /></MainLayout>
          </Route>
          <Route path="/library/:categoryId/:articleId">
            <MainLayout><LibraryArticlePage /></MainLayout>
          </Route>
          <Route path="/give">
            <MainLayout><GivePage /></MainLayout>
          </Route>
          <Route path="/plans">
            <MainLayout><PlansPage /></MainLayout>
          </Route>
          <Route path="/analytics">
            <MainLayout><AnalyticsPage /></MainLayout>
          </Route>
          <Route path="/reciters">
            <MainLayout><RecitersPage /></MainLayout>
          </Route>
          <Route path="/radio">
            <MainLayout><RadioPage /></MainLayout>
          </Route>
          <Route path="/collections">
            <MainLayout><CollectionsPage /></MainLayout>
          </Route>
          <Route path="/collections/:id">
            <MainLayout><CollectionDetailPage /></MainLayout>
          </Route>
          <Route path="/profile">
            <MainLayout><ProfilePage /></MainLayout>
          </Route>
          <Route path="/calendar">
            <MainLayout><CalendarPage /></MainLayout>
          </Route>
          <Route path="/media">
            <MainLayout><MediaPage /></MainLayout>
          </Route>
          <Route path="/reading-goal">
            <MainLayout><ReadingGoalPage /></MainLayout>
          </Route>
          <Route path="/about" component={AboutPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/documentation" component={DocumentationPage} />
          <Route path="/contribute" component={ContributePage} />
          <Route path="/dev-console">
            <DevConsolePage />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </QueryClientProvider>
    </AuthProvider>
  );
}

function ThemeManager() {
  const theme = useAppStore(state => state.theme);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'sepia');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'sepia') {
      root.classList.add('sepia');
    } else {
      root.classList.add('light');
    }
  }, [theme]);

  return null;
}

function OnboardingGate() {
  const hasPickedLanguage = useAppStore((s) => s.hasPickedLanguage);
  const setHasPickedLanguage = useAppStore((s) => s.setHasPickedLanguage);
  const setLanguage = useAppStore((s) => s.setLanguage);

  if (!hasPickedLanguage) {
    return (
      <LanguageSelector
        onSelect={(lang) => {
          setLanguage(lang);
          setHasPickedLanguage(true);
        }}
      />
    );
  }

  return <ClerkProviderWithRoutes />;
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ThemeManager />
      <TooltipProvider>
        <OnboardingGate />
        <Toaster />
      </TooltipProvider>
    </WouterRouter>
  );
}

export default App;
