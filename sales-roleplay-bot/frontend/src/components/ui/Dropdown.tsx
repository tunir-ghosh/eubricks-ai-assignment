import clsx from "clsx";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  icon?: LucideIcon;
  disabled?: boolean;
}

interface PanelRect {
  top: number;
  left: number;
  width: number;
}

/**
 * Custom-styled dropdown (replaces native <select>, whose option list can't
 * be themed on most platforms). Renders its option panel through a portal so
 * it never gets clipped by a scrolling ancestor, and repositions on
 * scroll/resize while open.
 *
 * Note: the panel is NOT wrapped in framer-motion's AnimatePresence — when
 * combined with createPortal, AnimatePresence fails to commit the portaled
 * child to the DOM (a known framer-motion limitation). The open animation
 * still plays via initial/animate; the panel just closes instantly.
 */
export function Dropdown({ label, options, value, onChange, icon: Icon, disabled }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<PanelRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function updateRect() {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ top: r.bottom + 6, left: r.left, width: r.width });
  }

  useLayoutEffect(() => {
    if (open) updateRect();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        panelRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function reposition() {
      updateRect();
    }

    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-white/45">
        {Icon && <Icon className="h-3 w-3 text-purple-300/70" />}
        {label}
      </span>

      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5",
          "text-sm text-white/90 outline-none transition-all duration-200",
          "hover:border-white/20 hover:bg-white/[0.05] focus-visible:border-purple/60 focus-visible:ring-2 focus-visible:ring-purple/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-white/10 disabled:hover:bg-white/[0.03]"
        )}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          className={clsx(
            "h-4 w-4 shrink-0 text-white/40 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open &&
        rect &&
        createPortal(
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ position: "fixed", top: rect.top, left: rect.left, width: rect.width }}
            className="scrollbar-thin z-[100] max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-surface/95 p-1 shadow-glass backdrop-blur-xl"
          >
            {options.map((option) => {
              const active = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={clsx(
                    "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    active
                      ? "bg-purple/15 text-white"
                      : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  {option}
                  {active && <Check className="h-3.5 w-3.5 text-purple-300" />}
                </button>
              );
            })}
          </motion.div>,
          document.body
        )}
    </div>
  );
}
