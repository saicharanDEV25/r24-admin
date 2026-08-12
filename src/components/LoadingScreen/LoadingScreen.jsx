import { useEffect, useRef, useState } from "react";
import "./LoadingScreen.css";

const STEPS = [
  [0, "Checking Session"],
  [30, "Loading Dashboard"],
  [58, "Syncing Data"],
  [82, "Final Touches"],
  [100, "Ready"],
];

const RING_CIRCUMFERENCE = 578;

// Progress climbs on its own but holds here until the page actually
// finishes loading — so it never claims "done" before it's true.
const SOFT_CAP = 90;

// If the browser's load event never fires for some reason, don't trap
// the admin behind the screen forever.
const FAILSAFE_MS = 8000;

function labelFor(value) {
  let label = STEPS[0][1];
  for (const [threshold, text] of STEPS) {
    if (value >= threshold) label = text;
  }
  return label;
}

export default function LoadingScreen() {
  const [alreadyShown] = useState(
    () => sessionStorage.getItem("adminSplashShown") === "1"
  );

  const [progress, setProgress] = useState(alreadyShown ? 100 : 0);
  const [finished, setFinished] = useState(alreadyShown);
  const [coreFading, setCoreFading] = useState(alreadyShown);
  const [overlayFading, setOverlayFading] = useState(alreadyShown);
  const [hidden, setHidden] = useState(alreadyShown);

  const intervalRef = useRef(null);

  const finish = () => {
    setFinished(true);
    setTimeout(() => setCoreFading(true), 450);
    setTimeout(() => setOverlayFading(true), 700);
    setTimeout(() => setHidden(true), 1400);
  };

  useEffect(() => {
    if (alreadyShown) return;

    sessionStorage.setItem("adminSplashShown", "1");

    intervalRef.current = setInterval(() => {
      setProgress((prev) => Math.min(SOFT_CAP, prev + Math.random() * 7 + 2));
    }, 260);

    const complete = () => {
      clearInterval(intervalRef.current);
      clearTimeout(failsafeTimer);
      setProgress(100);
      finish();
    };

    const failsafeTimer = setTimeout(complete, FAILSAFE_MS);

    if (document.readyState === "complete") {
      setTimeout(complete, 400);
    } else {
      window.addEventListener("load", complete);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(failsafeTimer);
      window.removeEventListener("load", complete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) return null;

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
