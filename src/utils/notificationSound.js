let sharedContext = null;

function getContext() {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return null;

  if (!sharedContext || sharedContext.state === "closed") {
    sharedContext = new AudioContextCtor();
  }

  if (sharedContext.state === "suspended") {
    sharedContext.resume();
  }

  return sharedContext;
}

function tone(ctx, frequency, startAt, duration, peakGain) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = frequency;

  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(peakGain, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

export function playNotificationSound() {
  try {
    const ctx = getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    tone(ctx, 660, now, 0.28, 0.22);
    tone(ctx, 990, now + 0.11, 0.3, 0.2);
    tone(ctx, 1320, now + 0.22, 0.35, 0.16);
  } catch {
    // Web Audio unavailable — fail silently, sound is a nice-to-have.
  }
}
