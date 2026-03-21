import { useEffect, useState, useRef } from "react";
import { ChevronDown, Check, Loader2, CalendarSync } from "lucide-react";

export default function CalendarCard() {
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const dropdownRef = useRef(null);

  // For the two buttons
  const [isAdding, setIsAdding] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch("/api/v1/timetable/batches");
        if (response.ok) {
          const data = await response.json();
          const batchArray = Array.isArray(data) ? data : (data?.data || data?.batches || []);
          setBatches(batchArray);
        } else {
          setBatches([]);
        }
      } catch {
        setBatches([]);
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBatches = Array.isArray(batches) ? batches.filter((b) => {
    if (typeof b !== 'string') return false;
    return b.toLowerCase().includes(search.toLowerCase());
  }) : [];

  const handleApiCall = async (operation) => {
    if (!selectedBatch) return;

    setErrorMsg("");
    if (operation === "addToCalendar") setIsAdding(true);
    else setIsResetting(true);

    try {
      const response = await fetch("/api/v1/timetable/google/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          batch: selectedBatch,
          operation: operation
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get google calendar URL");
      }

      const data = await response.json();
      if (data && data.data) {
        window.location.href = data.data;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to connect to Google Calendar. Please try again later.");
    } finally {
      if (operation === "addToCalendar") setIsAdding(false);
      else setIsResetting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col relative overflow-visible group hover:border-white/20 transition-all h-full">
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl transition-all pointer-events-none" />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shadow-inner">
          <CalendarSync size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Google Calendar</h2>
          <p className="text-sm text-white/50">Sync & Reset Events</p>
        </div>
      </div>

      <p className="text-sm text-white/70 mb-6 relative z-10">
        Sync your class timetable up-to date seamlessly to Google Calendar or easily wipe events synced previously.
      </p>

      <div className="space-y-4 mb-8 relative z-20 flex-1">
        {loadingBatches ? (
          <div className="flex items-center gap-3 text-white/50 h-[42px] px-4 glass rounded-lg">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading batches...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 relative group/input pt-2" ref={dropdownRef}>
            <label className="text-sm font-medium text-white/70">Select your batch</label>
            <div
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all cursor-text ${isDropdownOpen ? 'border-blue-500/50 ring-2 ring-blue-500/20 bg-black/40' : 'glass border-white/10'}`}
              onClick={() => setIsDropdownOpen(true)}
            >
              <input
                type="text"
                placeholder="Search batch (e.g. 1A11)"
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30 text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
              />
              <ChevronDown size={16} className={`text-white/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-[110%] left-0 right-0 max-h-56 overflow-y-auto bg-black/80 border border-white/20 rounded-xl p-2 z-[100] shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                {filteredBatches.length > 0 ? (
                  filteredBatches.map((batch) => (
                    <button
                      key={batch}
                      onClick={() => {
                        setSelectedBatch(batch);
                        setSearch(batch);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between mb-0.5
                        ${selectedBatch === batch ? 'bg-blue-500/20 text-blue-300' : 'text-white/70 hover:bg-white/10 hover:text-white'}
                      `}
                    >
                      <span className="font-medium">{batch}</span>
                      {selectedBatch === batch && <Check size={16} />}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-sm text-white/40 text-center flex flex-col items-center gap-2">
                    <span className="opacity-50 text-xl block">📭</span>
                    No batches match '{search}'
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 relative z-10 w-full mt-auto pt-4">
        {errorMsg && (
          <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
            {errorMsg}
          </div>
        )}
        <div className="flex gap-4 w-full">
          <button
            onClick={() => handleApiCall('addToCalendar')}
            disabled={!selectedBatch || isAdding || isResetting}
            className="flex-1 py-3 px-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isAdding ? <Loader2 className="animate-spin" size={18} /> : <span>Add</span>}
          </button>
          <button
            onClick={() => handleApiCall('resetCalendar')}
            disabled={!selectedBatch || isAdding || isResetting}
            className="flex-1 py-3 px-4 bg-red-500/10 text-red-500 border border-red-500/20 font-bold rounded-xl hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isResetting ? <Loader2 className="animate-spin" size={18} /> : <span>Reset</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
