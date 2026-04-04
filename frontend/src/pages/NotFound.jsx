import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundElements from "@/components/BackgroundElements";
import Seo from "@/components/Seo";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative text-foreground w-full">
      <Seo
        title="404 Not Found"
        description="The page you are looking for does not exist on OWASP Timetable."
        path={location.pathname}
        robots="noindex, follow"
      />

      <BackgroundElements />
      <Navbar />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 pt-32 pb-16 flex items-center justify-center">
        <section className="glass-card w-full max-w-3xl rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-10 w-44 h-44 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center text-rose-400 mb-6">
              <SearchX size={30} />
            </div>

            <p className="text-sm uppercase tracking-[0.28em] text-white/50">Error 404</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60">
              Page Not Found
            </h1>

            <p className="mt-5 text-base md:text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
              The page <span className="text-white/90 font-medium">{location.pathname}</span> does not exist,
              may have moved, or the URL might be incorrect.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 bg-white text-black font-semibold hover:bg-white/90 transition-colors"
              >
                <Home size={18} />
                Back To Home
              </Link>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}