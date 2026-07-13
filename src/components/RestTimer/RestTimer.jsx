import { useEffect, useMemo, useRef, useState } from "react";
import { SkipForward } from "lucide-react";

import styles from "./RestTimer.module.css";

export default function RestTimer({
  duration = 90,
  onComplete,
}) {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const endTimeRef = useRef(Date.now() + duration * 1000);
  const completedRef = useRef(false);

  useEffect(() => {
    function finishTimer() {
      if (completedRef.current) return;

      completedRef.current = true;
      onComplete();
    }

    function updateTimer() {
      const remainingMilliseconds =
        endTimeRef.current - Date.now();

      const remainingSeconds = Math.max(
        0,
        Math.ceil(remainingMilliseconds / 1000)
      );

      setSecondsLeft(remainingSeconds);

      if (remainingSeconds === 0) {
        finishTimer();
      }
    }

    updateTimer();

    const intervalId = window.setInterval(updateTimer, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [onComplete]);

  const elapsedPercentage = useMemo(() => {
    return ((duration - secondsLeft) / duration) * 100;
  }, [duration, secondsLeft]);

  const formattedTime = formatTime(secondsLeft);

  function skipTimer() {
    if (completedRef.current) return;

    completedRef.current = true;
    onComplete();
  }

  return (
    <div className={styles.container}>
      <div>
        <p className={styles.eyebrow}>Descanso</p>
        <h2 className={styles.title}>Respire um pouco</h2>
      </div>

      <div
        className={styles.timer}
        style={{
          "--progress": `${elapsedPercentage}%`,
        }}
        role="timer"
        aria-label={`${formattedTime} restantes`}
      >
        <div className={styles.timerContent}>
          <strong>{formattedTime}</strong>
          <span>restantes</span>
        </div>
      </div>

      <p className={styles.message}>
        A próxima série começa quando o tempo terminar.
      </p>

      <button
        type="button"
        className={styles.skipButton}
        onClick={skipTimer}
      >
        <SkipForward size={17} strokeWidth={1.8} />
        Pular descanso
      </button>
    </div>
  );
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}