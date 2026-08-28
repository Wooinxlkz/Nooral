import { useRef, useState } from "react";
import { useUser, useAuth } from "@/lib/auth";
import { useSEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";
import { useGetProfileStats, useGetProfileMe } from "@workspace/api-client-react";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, FileText, Brain, Flame, Trophy, Heart, Bookmark, Star, Pin, FolderHeart, Trash2, CalendarDays, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const BADGE_ICONS: Record<string, React.ReactNode> = {
  first_bookmark:    <Bookmark className="w-5 h-5" />,
  bookmark_collector:<Bookmark className="w-5 h-5" />,
  first_note:        <FileText className="w-5 h-5" />,
  journal_keeper:    <FileText className="w-5 h-5" />,
  hundred_notes:     <FileText className="w-5 h-5" />,
  streak_3:          <Flame className="w-5 h-5" />,
  streak_7:          <Flame className="w-5 h-5" />,
  streak_30:         <Flame className="w-5 h-5" />,
  hifz_start:        <Brain className="w-5 h-5" />,
  hifz_100:          <Brain className="w-5 h-5" />,
  first_khatm:       <Trophy className="w-5 h-5" />,
  khatm_3:           <Trophy className="w-5 h-5" />,
  mood_tagger:       <Heart className="w-5 h-5" />,
  collector:         <FolderHeart className="w-5 h-5" />,
};

function AvatarUpload() {
  const { user } = useUser();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const initial = (
    user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0] ?? "?"
  ).toUpperCase();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try { await user.setProfileImage({ file }); } catch { /* ignore */ }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  return (
    <div
      className="relative w-24 h-24 cursor-pointer shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !uploading && fileRef.current?.click()}
    >
      {/* Avatar circle */}
      <div className="w-24 h-24 rounded-full border-4 border-primary/20 bg-primary/10 overflow-hidden flex items-center justify-center text-3xl font-bold text-primary select-none">
        {uploading ? (
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
        ) : user?.imageUrl ? (
          <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </div>

      {/* Dark overlay on hover */}
      {hovered && !uploading && (
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center pointer-events-none">
          <span className="text-white text-xs font-medium">Change</span>
        </div>
      )}

      {/* Trash badge — bottom-right on hover, only when photo exists */}
      {hovered && !uploading && user?.imageUrl && (
        <button
          className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
          onClick={(e) => {
            e.stopPropagation();
            user.setProfileImage({ file: null as unknown as File });
          }}
          aria-label="Remove photo"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

export default function ProfilePage() {
  useSEO("My Profile", "Your NoorAl profile — stats, achievements, and reading history.");
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGetProfileStats({
    query: { enabled: !!isSignedIn } as any,
  });
  const { data: dbUser } = useGetProfileMe({
    query: { enabled: !!isSignedIn } as any,
  });

  if (isLoaded && !isSignedIn) {
    return (
      <SignInPrompt
        title="Sign in to view your profile"
        description="Track your Quran journey — stats, streaks, and achievement badges."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const earnedBadges   = stats?.badges.filter((b) => b.earned) ?? [];
  const unearnedBadges = stats?.badges.filter((b) => !b.earned) ?? [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        <AvatarUpload />

        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">
            {user?.fullName ?? user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? "My Profile"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {user?.emailAddresses?.[0]?.emailAddress}
          </p>
          <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
            <Badge variant="secondary" className="text-xs">
              🔥 {stats?.currentStreak ?? 0}-day streak
            </Badge>
            {(stats?.totalKhatm ?? 0) > 0 && (
              <Badge className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30">
                🏆 {stats?.totalKhatm} Khatm{(stats?.totalKhatm ?? 0) > 1 ? "s" : ""}
              </Badge>
            )}
            {dbUser?.createdAt && (
              <Badge variant="outline" className="text-xs gap-1">
                <CalendarDays className="w-3 h-3" />
                Member since {new Date(dbUser.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
              </Badge>
            )}
            {dbUser && (
              <Badge variant="outline" className="text-xs gap-1 border-green-500/30 text-green-600 dark:text-green-400">
                <Database className="w-3 h-3" />
                Saved to database
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {[
          { icon: <Bookmark className="w-5 h-5 text-blue-500" />,     label: "Bookmarks",       value: stats?.totalBookmarks ?? 0 },
          { icon: <FileText className="w-5 h-5 text-green-500" />,    label: "Notes",           value: stats?.totalNotes ?? 0 },
          { icon: <Brain className="w-5 h-5 text-purple-500" />,      label: "Ayahs Memorized", value: stats?.totalMastered ?? 0 },
          { icon: <Flame className="w-5 h-5 text-orange-500" />,      label: "Longest Streak",  value: `${stats?.longestStreak ?? 0}d` },
          { icon: <FolderHeart className="w-5 h-5 text-rose-500" />,  label: "Collections",     value: stats?.totalCollections ?? 0 },
          { icon: <Heart className="w-5 h-5 text-pink-500" />,        label: "Moods Tagged",    value: stats?.totalMoods ?? 0 },
          { icon: <Pin className="w-5 h-5 text-indigo-500" />,        label: "Pinned Verses",   value: stats?.totalPinnedVerses ?? 0 },
          { icon: <Star className="w-5 h-5 text-yellow-500" />,       label: "Hard Ayahs",      value: stats?.totalHardAyahs ?? 0 },
          { icon: <Trophy className="w-5 h-5 text-amber-500" />,      label: "Khatm Completed", value: stats?.totalKhatm ?? 0 },
          { icon: <BookOpen className="w-5 h-5 text-teal-500" />,     label: "Current Streak",  value: `${stats?.currentStreak ?? 0}d` },
        ].map((stat, i) => (
          <Card key={i} className="text-center">
            <CardContent className="pt-5 pb-4">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Earned Badges ── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            {t("profile.achievements")}
            <Badge variant="secondary" className="ml-auto text-xs">
              {earnedBadges.length} / {stats?.badges.length ?? 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earnedBadges.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Start reading to earn your first badge!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center text-center p-3 rounded-xl bg-primary/5 border border-primary/10"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    {BADGE_ICONS[badge.id] ?? <Star className="w-5 h-5" />}
                  </div>
                  <p className="text-xs font-semibold leading-tight">{badge.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{badge.description}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Locked Badges ── */}
      {unearnedBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
              <Star className="w-4 h-4" />
              Badges to Unlock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {unearnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={cn(
                    "flex flex-col items-center text-center p-3 rounded-xl border border-border opacity-50 grayscale"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
                    {BADGE_ICONS[badge.id] ?? <Star className="w-5 h-5" />}
                  </div>
                  <p className="text-xs font-semibold leading-tight">{badge.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{badge.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
