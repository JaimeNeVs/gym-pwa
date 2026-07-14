import { useEffect, useState } from "react";

import styles from "./RestDurationControl.module.css";

const PRESETS = [60, 90, 180];

export default function RestDurationControl({
  value = 90,
  onChange,
}) {
  const isPreset = PRESETS.includes(value);

  const [showCustom, setShowCustom] = useState(!isPreset);
  const [customValue, setCustomValue] = useState(String(value));

  useEffect(() => {
    setCustomValue(String(value));
    setShowCustom(!PRESETS.includes(value));
  }, [value]);

  function selectPreset(seconds) {
    setShowCustom(false);
    onChange(seconds);
  }

  function openCustom() {
    setShowCustom(true);

    if (isPreset) {
      setCustomValue(String(value));
    }
  }

  function confirmCustom() {
    const parsedValue = Number(customValue);

    if (
      Number.isNaN(parsedValue) ||
      parsedValue < 5
    ) {
      setCustomValue(String(value));
      return;
    }

    const normalizedValue = Math.min(
      900,
      Math.round(parsedValue)
    );

    setCustomValue(String(normalizedValue));
    onChange(normalizedValue);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmCustom();
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <span className={styles.label}>
            Descanso entre séries
          </span>

          <p className={styles.description}>
            O cronômetro começará automaticamente.
          </p>
        </div>

        <strong className={styles.currentValue}>
          {formatDuration(value)}
        </strong>
      </div>

      <div className={styles.presets}>
        {PRESETS.map((seconds) => {
          const active =
            value === seconds && !showCustom;

          return (
            <button
              key={seconds}
              type="button"
              className={`${styles.presetButton} ${
                active ? styles.active : ""
              }`}
              onClick={() => selectPreset(seconds)}
            >
              {formatDuration(seconds)}
            </button>
          );
        })}

        <button
          type="button"
          className={`${styles.presetButton} ${
            showCustom ? styles.active : ""
          }`}
          onClick={openCustom}
        >
          Personalizado
        </button>
      </div>

      {showCustom && (
        <div className={styles.customArea}>
          <div className={styles.customField}>
            <input
              type="number"
              inputMode="numeric"
              min="5"
              max="900"
              value={customValue}
              aria-label="Tempo personalizado em segundos"
              onChange={(event) =>
                setCustomValue(event.target.value)
              }
              onBlur={confirmCustom}
              onKeyDown={handleKeyDown}
            />

            <span>segundos</span>
          </div>

          <p>
            Entre 5 segundos e 15 minutos.
          </p>
        </div>
      )}
    </div>
  );
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  if (seconds === 0) {
    return `${minutes}min`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}