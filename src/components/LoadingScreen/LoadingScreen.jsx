import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./LoadingScreen.css";

const STEPS = [
  [0, "Checking Session"],
  [30, "Loading Dashboard"],
  [58, "Syncing Data"],
  [82, "Final Touches"],
  [100, "Ready"],
];

const RING_CIRCUMFERENCE = 578;

// holds here until the real load event fires, so it never claims done early
const SOFT_CAP = 90;

// failsafe in case the load event never fires
const FAILSAFE_MS = 8000;

function labelFor(value) {
  let label = STEPS[0][1];
  for (const [threshold, text] of STEPS) {
    if (value >= threshold) label = text;
  }
  return label;
}

export default function LoadingScreen() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [coreFading, setCoreFading] = useState(false);
  const [overlayFading, setOverlayFading] = useState(false);

  const intervalRef = useRef(null);
  const timeoutsRef = useRef([]);

  const schedule = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
  };

  const clearAllTimers = () => {
    clearInterval(intervalRef.current);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const finish = () => {
    clearInterval(intervalRef.current);
    setFinished(true);
    schedule(() => setCoreFading(true), 450);
    schedule(() => setOverlayFading(true), 700);
    schedule(() => setVisible(false), 1400);
  };

  // once per tab session, tied to the real load event so fast loads finish fast and slow ones wait
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("adminSplashShown") === "1";

    if (alreadyShown) {
      setVisible(false);
      return;
    }

    sessionStorage.setItem("adminSplashShown", "1");

    intervalRef.current = setInterval(() => {
      setProgress((prev) => Math.min(SOFT_CAP, prev + Math.random() * 7 + 2));
    }, 260);

    const complete = () => {
      setProgress(100);
      finish();
    };

    schedule(complete, FAILSAFE_MS);

    if (document.readyState === "complete") {
      schedule(complete, 400);
    } else {
      window.addEventListener("load", complete);
    }

    return () => {
      clearAllTimers();
      window.removeEventListener("load", complete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // quicker replay on every nav after the first (first load is handled above)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    clearAllTimers();
    setProgress(0);
    setFinished(false);
    setCoreFading(false);
    setOverlayFading(false);
    setVisible(true);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 22 + 14;
        if (next >= 100) {
          finish();
          return 100;
        }
        return next;
      });
    }, 110);

    return () => clearAllTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (!visible) return null;

  const offset = RING_CIRCUMFERENCE * (1 - progress / 100);

  return (
    <div className={`admin-loading-overlay${overlayFading ? " is-fading" : ""}`}>
      <div className={`admin-loading-core${coreFading ? " is-fading" : ""}`}>
        <svg width="180" height="180" viewBox="0 0 200 200" role="img">
          <title>Loading</title>

          <circle cx="100" cy="100" r="92" fill="none" stroke="#262626" strokeWidth="6" />

          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="#FFD700"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
          />

          <circle cx="100" cy="100" r="72" fill="none" stroke="#232323" strokeWidth="16" />

          <g className={finished ? "" : "admin-loading-spin"}>
            <circle cx="100" cy="100" r="60" fill="none" stroke="#FFD700" strokeWidth="3" />
            <g stroke="#5a5148" strokeWidth="4">
              <line x1="100" y1="44" x2="100" y2="156" />
              <line x1="44" y1="100" x2="156" y2="100" />
              <line x1="60" y1="60" x2="140" y2="140" />
              <line x1="140" y1="60" x2="60" y2="140" />
            </g>
            <circle cx="100" cy="100" r="13" fill="#FFD700" />
          </g>
        </svg>

        <span className="admin-loading-percent">{Math.round(progress)}%</span>
        <span className={`admin-loading-label${finished ? " is-done" : ""}`}>
          {labelFor(progress)}
        </span>
      </div>
    </div>
  );
}
