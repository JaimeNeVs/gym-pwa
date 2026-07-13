import { Minus, Plus } from "lucide-react";

import styles from "./NumberControl.module.css";

export default function NumberControl({
  label,
  value,
  step = 1,
  min = 0,
  unit = "",
  onChange,
}) {
  function decrease() {
    const nextValue = Math.max(min, Number(value) - step);
    onChange(normalizeValue(nextValue));
  }

  function increase() {
    const nextValue = Number(value) + step;
    onChange(normalizeValue(nextValue));
  }

  function normalizeValue(number) {
    return Math.round(number * 10) / 10;
  }

  function formatValue() {
    const number = Number(value);

    if (Number.isInteger(number)) {
      return number;
    }

    return number.toFixed(1);
  }

  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>

      <div className={styles.control}>
        <button
          type="button"
          className={styles.button}
          onClick={decrease}
          aria-label={`Diminuir ${label}`}
        >
          <Minus size={16} strokeWidth={2} />
        </button>

        <div className={styles.value}>
          <strong>{formatValue()}</strong>

          {unit && <span>{unit}</span>}
        </div>

        <button
          type="button"
          className={styles.button}
          onClick={increase}
          aria-label={`Aumentar ${label}`}
        >
          <Plus size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}