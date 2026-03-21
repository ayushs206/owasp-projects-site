import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundElements from "@/components/BackgroundElements";
import { CopyCheck, XOctagon, Loader2 } from "lucide-react";

export default function CalendarCallback() {
  const [searchParams] = useSearchParams();
  const result = searchParams.get("result");

  const isSuccess = result === "success";

  // You might want to get more detailed messages from query params if your backend sends them,
  // e.g. ?result=success&message=Events+synced
  const message = searchParams.get("message") || (isSuccess ? "Operation completed successfully!" : "There was an issue processing your request.");

  return (
    <div className="min-h-screen flex flex-col relative text-foreground w-full">
      <BackgroundElements />
      <Navbar />

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 pt-32 pb-16 flex flex-col items-center justify-center">
        <div className="glass-card rounded-2xl p-8 md:p-12 w-full text-center relative overflow-hidden group border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          {isSuccess ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none" />
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] pointer-events-none" />
          )}

          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl ${isSuccess ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
              {isSuccess ? <CopyCheck size={36} /> : <XOctagon size={36} />}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
              {isSuccess ? "Success!" : "Action Failed"}
            </h1>

            <p className="text-lg text-white/70 mb-10 max-w-md mx-auto">
              {message}
            </p>

            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-[0.98]"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
