import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, ArrowLeft, BookOpen } from "lucide-react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260520_111942_8fc50f9e-4dfd-45c1-81bb-d93342a23d87.mp4";

export default function NotFound() {
  const [, navigate] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 0.75;
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* ── Video background ── */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
      />

      {/* ── Layered overlays ── */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {/* Arabic inscription */}
        <p
          className="text-white/50 text-2xl font-light mb-6 tracking-widest"
          style={{ fontFamily: "serif", letterSpacing: "0.15em" }}
        >
          ٤٠٤
        </p>

        {/* 404 number */}
        <h1
          className="font-black leading-none mb-3 select-none"
          style={{
            fontSize: "clamp(6rem, 18vw, 11rem)",
            color: "transparent",
            backgroundImage:
              "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 40%, #0f766e 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 40px rgba(20,184,166,0.45))",
          }}
        >
          404
        </h1>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5 w-full max-w-xs">
          <div className="flex-1 h-px bg-white/15" />
          <span className="text-white/30 text-xs tracking-widest uppercase">Page not found</span>
          <div className="flex-1 h-px bg-white/15" />
        </div>

        {/* Message */}
        <p className="text-white/70 text-base leading-relaxed mb-2 max-w-sm">
          The path you followed doesn't exist — but every journey has a way back.
        </p>
        <p
          className="text-white/35 text-sm mb-10"
          style={{ fontFamily: "serif" }}
        >
          وَإِنَّ رَبَّكَ لَذُو مَغْفِرَةٍ لِلنَّاسِ عَلَىٰ ظُلْمِهِمْ
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 text-white"
            style={{
              background: "linear-gradient(135deg, #14b8a6, #0f766e)",
              boxShadow: "0 0 24px rgba(20,184,166,0.35)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 36px rgba(20,184,166,0.6)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 24px rgba(20,184,166,0.35)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <Home className="size-4" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white/80 transition-all duration-200 border border-white/20 hover:bg-white/10 hover:text-white hover:border-white/30"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>

          <Link
            href="/reader"
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white/80 transition-all duration-200 border border-white/20 hover:bg-white/10 hover:text-white hover:border-white/30"
          >
            <BookOpen className="size-4" />
            Read Quran
          </Link>
        </div>
      </div>

      {/* ── Subtle NoorAl watermark ── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
        style={{ opacity: visible ? 0.35 : 0, transition: "opacity 1s ease 0.5s" }}
      >
        <img
          src="/logo.svg"
          alt=""
          className="size-5 opacity-70"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <span className="text-white text-xs font-medium tracking-widest uppercase">NoorAl</span>
      </div>
    </div>
  );
}
