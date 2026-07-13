import styles from "./ProgressDots.module.css";

export default function ProgressDots({ total = 5, filled = 0 }) {
  const safeTotal = Math.max(1, total);
  const safeFilled = Math.min(Math.max(filled, 0), safeTotal);

  return (
    <div
      className={styles.container}
      aria-label={`${safeFilled} de ${safeTotal} indicadores preenchidos`}
    >
      {Array.from({ length: safeTotal }).map((_, index) => (
        <span
          key={index}
          className={`${styles.dot} ${
            index < safeFilled ? styles.active : ""
          }`}
        />
      ))}
    </div>
  );
}