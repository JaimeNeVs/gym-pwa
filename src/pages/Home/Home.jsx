import { Plus } from "lucide-react";

import WorkoutCard from "../../components/WorkoutCard/WorkoutCard";
import styles from "./Home.module.css";

export default function Home({
  workouts,
  onStartWorkout,
  onEditWorkout,
  onDeleteWorkout,
  onCreateWorkout,
}) {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Sua rotina</p>
        <h1 className={styles.title}>Meus treinos</h1>
        <p className={styles.subtitle}>
          Escolha um treino ou deslize um card para editar.
        </p>
      </header>

      <div className={styles.list}>
        {workouts.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Nenhum treino cadastrado</h2>
            <p>Crie seu primeiro treino para começar.</p>
          </div>
        ) : (
          workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onStart={onStartWorkout}
              onEdit={onEditWorkout}
              onDelete={onDeleteWorkout}
            />
          ))
        )}
      </div>

      <button
        type="button"
        className={styles.createButton}
        onClick={onCreateWorkout}
      >
        <Plus size={20} strokeWidth={2} />
        <span>Novo treino</span>
      </button>
    </section>
  );
}