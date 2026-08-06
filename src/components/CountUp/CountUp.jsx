import { useEffect, useRef, useState } from "react";

function CountUp({ end = 0, duration = 2, separator = false }) {

  const [count, setCount] = useState(0);

  const frameRef = useRef(null);

  useEffect(() => {

    const target = Number(end) || 0;

    const durationMs = duration * 1000;

    let startTime = null;

    const animate = (time) => {

      if (!startTime) startTime = time;

      const progress = Math.min((time - startTime) / durationMs, 1);

      setCount(Math.floor(progress * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };

  }, [end, duration]);

  return <>{separator ? count.toLocaleString("en-IN") : count}</>;
}

export default CountUp;
