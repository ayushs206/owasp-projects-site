import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundElements from "@/components/BackgroundElements";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIMES = [
  "08:00 AM",
  "08:50 AM",
  "09:40 AM",
  "10:30 AM",
  "11:20 AM",
  "12:10 PM",
  "01:00 PM",
  "01:50 PM",
  "02:40 PM",
  "03:30 PM",
  "04:20 PM",
];

export default function ScheduleView() {
  const [searchParams] = useSearchParams();
  const batch = searchParams.get("batch");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (batch) {
          const res = await fetch(`/api/v1/timetable/schedule/${encodeURIComponent(batch)}`);
          if (res.ok) {
            const data = await res.json();
            setResult(data.data);
          } else {
            setError("Failed to fetch schedule data.");
          }
        } else {
          setError("No batch specified.");
        }
      } catch (err) {
        setError(`API connection failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [batch]);

  return (
    <div className="min-h-screen flex flex-col relative text-foreground w-full">
      <BackgroundElements />
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-16 flex flex-col">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 mb-2">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="p-2 bg-rose-500/20 text-rose-500 rounded-lg">
                <Calendar size={24} />
              </span>
              Schedule for {batch}
            </h1>
          </div>
          <p className="text-white/50">Weekly class timetable</p>
        </div>

        <div className="glass-card rounded-2xl p-6 min-h-[400px] flex flex-col overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          
          {loading ? (
            <div className="flex flex-col items-center justify-center flex-1 text-white/50 gap-4">
              <Loader2 size={32} className="animate-spin text-rose-500" />
              <p>Fetching schedule...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center flex-1 text-rose-400 gap-4">
              <p>{error}</p>
            </div>
          ) : result ? (
            <div className="flex-1 overflow-x-auto custom-scrollbar relative z-10 w-full">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="p-4 border-b border-white/10 bg-white/5 sticky left-0 z-20 w-32 font-semibold text-white/80">
                      Day
                    </th>
                    {TIMES.map((time) => (
                      <th
                        key={time}
                        className="p-4 border-b border-white/10 bg-white/5 font-medium text-white/60 text-sm whitespace-nowrap text-center min-w-[120px]"
                      >
                        {time}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((day) => (
                    <tr key={day} className="group hover:bg-white/5 transition-colors">
                      <td className="p-4 border-b border-white/5 bg-black/20 group-hover:bg-transparent sticky left-0 z-10 font-medium text-white/80 border-r border-white/10">
                        {day}
                      </td>
                      {TIMES.map((time) => {
                        const subject = result[day] ? result[day][time] : null;
                        return (
                          <td
                            key={time}
                            className={`p-3 border-b border-white/5 text-center text-sm transition-colors ${
                              subject
                                ? "bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                                : "text-white/20 hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center justify-center min-h-[40px]">
                              {subject ? (
                                <span className="font-medium line-clamp-3 leading-tight">{subject}</span>
                              ) : (
                                "-"
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-white/50">
              <p>No data to display.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
