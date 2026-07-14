import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";

import usePressHold from "../../hooks/usePressHold";
import styles from "./NumberControl.module.css";

export default function NumberControl({
  label,
  value,
  step = 1,
  min = 0,
  unit = "",
  onChange,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));

  const inputRef = useRef(null);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(String(value));
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (!isEditing) return;

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  function normalizeValue(number) {
    return Math.round(number * 10) / 10;
  }

  function decrease() {
    const nextValue = Math.max(
      min,
      Number(value) - step
    );

    onChange(normalizeValue(nextValue));
  }

  function increase() {
    const nextValue = Number(value) + step;

    onChange(normalizeValue(nextValue));
  }

  function formatValue() {
    const number = Number(value);

    return Number.isInteger(number)
      ? String(number)
      : number.toFixed(1);
  }

  function confirmInput() {
    const normalizedText = inputValue
      .replace(",", ".")
      .trim();

    const parsedValue = Number(normalizedText);

    if (
      normalizedText === "" ||
      Number.isNaN(parsedValue)
    ) {
      setInputValue(String(value));
      setIsEditing(false);
      return;
    }

    onChange(
      normalizeValue(Math.max(min, parsedValue))
    );

    setIsEditing(false);
  }

  function handleInputKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmInput();
    }

    if (event.key === "Escape") {
      setInputValue(String(value));
      setIsEditing(false);
    }
  }

  const decreasePress = usePressHold(decrease);
  const increasePress = usePressHold(increase);

  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>

      <div className={styles.control}>
        <button
          type="button"
          className={styles.button}
          aria-label={`Diminuir ${label}`}
          {...decreasePress}
        >
          <Minus size={16} strokeWidth={2} />
        </button>

        {isEditing ? (
          <input
            ref={inputRef}
            className={styles.valueInput}
            type="text"
            inputMode="decimal"
            value={inputValue}
            aria-label={`Informar ${label}`}
            onChange={(event) =>
              setInputValue(event.target.value)
            }
            onBlur={confirmInput}
            onKeyDown={handleInputKeyDown}
          />
        ) : (
          <button
            type="button"
            className={styles.value}
            onClick={() => setIsEditing(true)}
            aria-label={`Editar ${label}`}
          >
            <strong>{formatValue()}</strong>

            {unit && <span>{unit}</span>}
          </button>
        )}

        <button
          type="button"
          className={styles.button}
          aria-label={`Aumentar ${label}`}
          {...increasePress}
        >
          <Plus size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}