import { useEffect, useRef, useState } from "react";
import { LuPlay, LuPause, LuRotateCcw } from "react-icons/lu";
import { formatDuration } from "../lib/format";

function beep() {
  try {
    navigator.vibrate?.([200, 100, 200]);
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [0, 0.35].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.3);
    });
  } catch {
    /* audio tidak tersedia */
  }
}

// Timer berbasis waktu jam (bukan hitungan interval) agar tetap akurat
// walau tab sempat di latar belakang.
export function StepTimer({ seconds, label }) {
  const [state, setState] = useState("idle"); // idle | running | paused | done
  const [remaining, setRemaining] = useState(seconds);
  const endAt = useRef(0);

  useEffect(() => {
    if (state !== "running") return undefined;
    const tick = () => {
      const left = (endAt.current - Date.now()) / 1000;
      if (left <= 0) {
        setRemaining(0);
        setState("done");
        beep();
      } else {
        setRemaining(left);
      }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [state]);

  const start = () => {
    endAt.current = Date.now() + remaining * 1000;
    setState("running");
  };
  const pause = () => setState("paused");
  const reset = () => {
    setState("idle");
    setRemaining(seconds);
  };

  const r = 26;
  const circ = 2 * Math.PI * r;
  const progress = 1 - remaining / seconds;

  return (
    <div className="mt-4 flex items-center gap-4 rounded-2xl bg-sunken p-3 pr-4">
      <div className="relative h-16 w-16 shrink-0">
        <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden="true">
          <circle cx="32" cy="32" r={r} fill="none" stroke="var(--lc-line)" strokeWidth="6" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke={state === "done" ? "var(--lc-mint)" : "var(--lc-pine)"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progress)}
            style={{ transition: "stroke-dashoffset 250ms linear" }}
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="tabular text-2xl font-extrabold leading-none" role="timer" aria-live={state === "done" ? "assertive" : "off"}>
          {state === "done" ? "Selesai" : formatDuration(remaining)}
        </p>
        <p className="mt-1 text-sm text-muted">
          {state === "done" ? `${label} sudah cukup.` : state === "running" ? "Timer berjalan" : `Timer ${label}`}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        {state === "running" ? (
          <button type="button" onClick={pause} className="grid h-11 w-11 place-items-center rounded-full bg-surface text-ink shadow-sm" aria-label="Jeda timer">
            <LuPause size={18} />
          </button>
        ) : state !== "done" ? (
          <button type="button" onClick={start} className="grid h-11 w-11 place-items-center rounded-full bg-pine text-on-pine" aria-label={state === "paused" ? "Lanjutkan timer" : "Mulai timer"}>
            <LuPlay size={18} />
          </button>
        ) : null}
        {state !== "idle" && (
          <button type="button" onClick={reset} className="grid h-11 w-11 place-items-center rounded-full text-muted hover:bg-surface" aria-label="Ulang timer">
            <LuRotateCcw size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
