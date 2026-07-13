import styles from "./ProgressDotsSession.module.css";

export default function ProgressDotsSession({
  total,
  completed,
}) {
  return (
    <div
      className={styles.container}
      aria-label={`${completed} de ${total} séries concluídas`}
    >
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`${styles.dot} ${
            index < completed ? styles.completed : ""
          }`}
        />
      ))}
    </div>
  );
}