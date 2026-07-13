import { Check, Trophy } from "lucide-react";

import styles from "./Finished.module.css";

export default function Finished({
  workoutTitle,
  summary,
  onContinue,
}) {
  return (
    <section className={styles.page}>
      <div className={styles.icon}>
        <Check size={34} strokeWidth={2.4} />
      </div>

      <p className={styles.eyebrow}>Concluído</p>

      <h1 className={styles.title}>
        Treino finalizado
      </h1>

      <p className={styles.workoutName}>
        {workoutTitle}
      </p>

      <div className={styles.summary}>
        <SummaryItem
          value={summary.exercises}
          label="Exercícios"
        />

        <SummaryItem
          value={summary.completedSeries}
          label="Séries"
        />

        <SummaryItem
          value={summary.prs}
          label="Recordes"
          gold={summary.prs > 0}
        />
      </div>

      {summary.prs > 0 && (
        <div className={styles.prMessage}>
          <Trophy size={18} strokeWidth={1.9} />
          <span>
            Você conquistou{" "}
            {summary.prs === 1
              ? "um novo recorde"
              : `${summary.prs} novos recordes`}
          </span>
        </div>
      )}

      <button
        type="button"
        className={styles.continueButton}
        onClick={onContinue}
      >
        Continuar
      </button>
    </section>
  );
}

function SummaryItem({
  value,
  label,
  gold = false,
}) {
  return (
    <div className={styles.summaryItem}>
      <strong
        className={gold ? styles.gold : ""}
      >
        {value}
      </strong>

      <span>{label}</span>
    </div>
  );
}