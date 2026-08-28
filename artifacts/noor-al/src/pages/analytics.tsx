import { useSEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetReadingAnalytics } from "@workspace/api-client-react";
import { TrendingUp, BookOpen, CalendarDays, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const SURAH_NAMES: Record<number, string> = {
  1:"Al-Fatihah",2:"Al-Baqarah",3:"Al-Imran",4:"An-Nisa",5:"Al-Ma'idah",
  6:"Al-An'am",7:"Al-A'raf",8:"Al-Anfal",9:"At-Tawbah",10:"Yunus",
  11:"Hud",12:"Yusuf",13:"Ar-Ra'd",14:"Ibrahim",15:"Al-Hijr",
  16:"An-Nahl",17:"Al-Isra",18:"Al-Kahf",19:"Maryam",20:"Ta-Ha",
  21:"Al-Anbiya",22:"Al-Hajj",23:"Al-Mu'minun",24:"An-Nur",25:"Al-Furqan",
  26:"Ash-Shu'ara",27:"An-Naml",28:"Al-Qasas",29:"Al-Ankabut",30:"Ar-Rum",
  31:"Luqman",32:"As-Sajdah",33:"Al-Ahzab",34:"Saba",35:"Fatir",
  36:"Ya-Sin",37:"As-Saffat",38:"Sad",39:"Az-Zumar",40:"Ghafir",
  41:"Fussilat",42:"Ash-Shura",43:"Az-Zukhruf",44:"Ad-Dukhan",45:"Al-Jathiyah",
  46:"Al-Ahqaf",47:"Muhammad",48:"Al-Fath",49:"Al-Hujurat",50:"Qaf",
  51:"Adh-Dhariyat",52:"At-Tur",53:"An-Najm",54:"Al-Qamar",55:"Ar-Rahman",
  56:"Al-Waqi'ah",57:"Al-Hadid",58:"Al-Mujadila",59:"Al-Hashr",60:"Al-Mumtahanah",
  61:"As-Saf",62:"Al-Jumu'ah",63:"Al-Munafiqun",64:"At-Taghabun",65:"At-Talaq",
  66:"At-Tahrim",67:"Al-Mulk",68:"Al-Qalam",69:"Al-Haqqah",70:"Al-Ma'arij",
  71:"Nuh",72:"Al-Jinn",73:"Al-Muzzammil",74:"Al-Muddaththir",75:"Al-Qiyamah",
  76:"Al-Insan",77:"Al-Mursalat",78:"An-Naba",79:"An-Nazi'at",80:"Abasa",
  81:"At-Takwir",82:"Al-Infitar",83:"Al-Mutaffifin",84:"Al-Inshiqaq",85:"Al-Buruj",
  86:"At-Tariq",87:"Al-A'la",88:"Al-Ghashiyah",89:"Al-Fajr",90:"Al-Balad",
  91:"Ash-Shams",92:"Al-Layl",93:"Ad-Duha",94:"Ash-Sharh",95:"At-Tin",
  96:"Al-Alaq",97:"Al-Qadr",98:"Al-Bayyinah",99:"Az-Zalzalah",100:"Al-Adiyat",
  101:"Al-Qari'ah",102:"At-Takathur",103:"Al-Asr",104:"Al-Humazah",105:"Al-Fil",
  106:"Quraysh",107:"Al-Ma'un",108:"Al-Kawthar",109:"Al-Kafirun",110:"An-Nasr",
  111:"Al-Masad",112:"Al-Ikhlas",113:"Al-Falaq",114:"An-Nas",
};

function DailyChart({ data }: { data: { date: string; count: number }[] }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="flex items-end gap-0.5 h-24 w-full">
      {data.map((day) => {
        const height = max > 0 ? (day.count / max) * 100 : 0;
        const isToday = day.date === new Date().toISOString().slice(0, 10);
        const hasActivity = day.count > 0;
        return (
          <div
            key={day.date}
            className="flex-1 flex flex-col items-center justify-end group relative"
          >
            <div
              className={cn(
                "w-full rounded-t transition-all duration-300",
                hasActivity
                  ? isToday
                    ? "bg-primary"
                    : "bg-primary/60 group-hover:bg-primary/80"
                  : "bg-muted/40"
              )}
              style={{ height: hasActivity ? `${Math.max(height, 8)}%` : "4%" }}
            />
            {day.count > 0 && (
              <div className="absolute bottom-full mb-1 bg-popover border border-border rounded px-1.5 py-0.5 text-[10px] font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                {day.date.slice(5)}: {day.count} sessions
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SurahCoverageGrid({ surahIds }: { surahIds: number[] }) {
  const readSet = new Set(surahIds);
  return (
    <div className="flex flex-wrap gap-0.5">
      {Array.from({ length: 114 }, (_, i) => i + 1).map((id) => {
        const read = readSet.has(id);
        return (
          <div
            key={id}
            title={`${id}. ${SURAH_NAMES[id] ?? ""}`}
            className={cn(
              "w-4 h-4 rounded-sm transition-colors cursor-default",
              read ? "bg-primary" : "bg-muted/40"
            )}
          />
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  useSEO("Reading Analytics", "Track your Quran reading sessions, coverage, and streaks.");
  const { t } = useTranslation();
  const { isSignedIn, isLoaded } = useAuth();

  const { data, isLoading } = useGetReadingAnalytics({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: { enabled: !!isSignedIn } as any,
  });

  if (isLoaded && !isSignedIn) {
    return (
      <SignInPrompt
        title="Sign in to see your analytics"
        description="Track which surahs you've read, your daily reading sessions, and your coverage of the Quran."
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-primary" />
          Reading Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Your Quran reading history and coverage</p>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Sessions</p>
              {isLoading ? (
                <Skeleton className="h-6 w-10 mt-0.5" />
              ) : (
                <p className="text-xl font-bold">{data?.totalSessions ?? 0}</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Surahs Read</p>
              {isLoading ? (
                <Skeleton className="h-6 w-12 mt-0.5" />
              ) : (
                <p className="text-xl font-bold">
                  {data?.surahsRead ?? 0}
                  <span className="text-sm font-normal text-muted-foreground ml-1">/ 114</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Coverage</p>
              {isLoading ? (
                <Skeleton className="h-6 w-14 mt-0.5" />
              ) : (
                <p className="text-xl font-bold">
                  {Math.round(((data?.surahsRead ?? 0) / 114) * 100)}%
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Daily chart ── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Daily Sessions (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <DailyChart data={data?.dailyData ?? []} />
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>{data?.dailyData?.[0]?.date?.slice(5) ?? ""}</span>
                  <span>Today</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ── Top surahs ── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Most Read Surahs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : data?.topSurahs?.length ? (
              <div className="space-y-2">
                {data.topSurahs.map((s, i) => {
                  const maxSessions = data.topSurahs[0]?.sessions ?? 1;
                  return (
                    <div key={s.surahId} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">
                        {i + 1}.
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-medium truncate">{s.surahName}</span>
                          <span className="text-xs text-muted-foreground ml-2 shrink-0">
                            {s.sessions}×
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(s.sessions / maxSessions) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Start reading to see your stats here
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Surah coverage grid (full width) ── */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Quran Coverage
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {data?.surahsRead ?? 0} of 114 surahs read
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <SurahCoverageGrid surahIds={data?.surahIds ?? []} />
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-primary" />
                    Read
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-muted/40" />
                    Not yet read
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
