import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download, Search, User, UserRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSessionStore } from "../../store/sessionStore";

function formatClock(ms: number, startMs: number): string {
  const seconds = Math.max(0, Math.floor((ms - startMs) / 1000));
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function transcriptToText(entries: { speaker: string; text: string; timestampMs: number }[]): string {
  const start = entries[0]?.timestampMs ?? Date.now();
  return entries
    .map(
      (e) =>
        `[${formatClock(e.timestampMs, start)}] ${e.speaker === "rep" ? "Sales Rep" : "Customer"}: ${e.text}`
    )
    .join("\n");
}

export function TranscriptPanel() {
  const transcript = useSessionStore((s) => s.transcript);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return transcript;
    const lower = query.toLowerCase();
    return transcript.filter((e) => e.text.toLowerCase().includes(lower));
  }, [transcript, query]);

  const startMs = transcript[0]?.timestampMs ?? Date.now();

  useEffect(() => {
    if (!query) bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [transcript.length, query]);

  function handleCopy() {
    navigator.clipboard.writeText(transcriptToText(transcript)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleDownload() {
    const blob = new Blob([transcriptToText(transcript)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-call-transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transcript…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2 pl-8 pr-3 text-xs text-white/90 outline-none transition-colors focus:border-purple/60 focus:ring-2 focus:ring-purple/20 placeholder:text-white/30"
          />
        </div>
        <button
          onClick={handleCopy}
          disabled={transcript.length === 0}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/50 transition-colors hover:border-white/20 hover:text-white disabled:opacity-30"
          title="Copy transcript"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={handleDownload}
          disabled={transcript.length === 0}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/50 transition-colors hover:border-white/20 hover:text-white disabled:opacity-30"
          title="Download transcript"
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto pr-1">
        {transcript.length === 0 ? (
          <p className="mt-6 text-center text-xs text-white/30">
            Your live transcript will appear here once the call starts.
          </p>
        ) : filtered.length === 0 ? (
          <p className="mt-6 text-center text-xs text-white/30">No matches for "{query}".</p>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((entry, i) => {
              const isRep = entry.speaker === "rep";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`flex items-end gap-2 ${isRep ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      isRep
                        ? "border-purple/30 bg-purple/15 text-purple-300"
                        : "border-white/10 bg-white/[0.06] text-white/60"
                    }`}
                  >
                    {isRep ? <UserRound className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  </div>
                  <div className={`flex max-w-[80%] flex-col gap-1 ${isRep ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                        isRep
                          ? "rounded-br-sm bg-gradient-purple text-white"
                          : "rounded-bl-sm border border-white/10 bg-white/[0.05] text-white/75"
                      }`}
                    >
                      {entry.text}
                    </div>
                    <span className="px-1 font-mono text-[10px] text-white/25">
                      {isRep ? "You" : "Customer"} · {formatClock(entry.timestampMs, startMs)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
