import Header from "./header";
import AudioPlayer from "./audio-player";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pb-24">
        {children}
      </main>
      <AudioPlayer />
    </div>
  );
}
