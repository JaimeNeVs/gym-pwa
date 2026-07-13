import { useRef, useState } from "react";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";

import ProgressDots from "../ProgressDots/ProgressDots";
import styles from "./WorkoutCard.module.css";

const ACTION_DISTANCE = 92;
const ACTION_THRESHOLD = 42;

export default function WorkoutCard({
  workout,
  onStart,
  onEdit,
  onDelete,
}) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(0);
  const startTranslate = useRef(0);
  const moved = useRef(false);

  function handlePointerDown(event) {
    startX.current = event.clientX;
    startTranslate.current = translateX;
    moved.current = false;

    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!isDragging) return;

    const movement = event.clientX - startX.current;

    if (Math.abs(movement) > 5) {
      moved.current = true;
    }

    const nextPosition = Math.max(
      -ACTION_DISTANCE,
      Math.min(ACTION_DISTANCE, startTranslate.current + movement)
    );

    setTranslateX(nextPosition);
  }

  function handlePointerUp(event) {
    if (!isDragging) return;

    setIsDragging(false);

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // O ponteiro pode já ter sido liberado pelo navegador.
    }

    if (translateX > ACTION_THRESHOLD) {
      setTranslateX(ACTION_DISTANCE);
      return;
    }

    if (translateX < -ACTION_THRESHOLD) {
      setTranslateX(-ACTION_DISTANCE);
      return;
    }

    setTranslateX(0);
  }

  function handleCardClick() {
    if (moved.current) return;

    if (translateX !== 0) {
      setTranslateX(0);
      return;
    }

    onStart(workout);
  }

  function handleEdit() {
    setTranslateX(0);
    onEdit(workout);
  }

  function handleDelete() {
    setTranslateX(0);
    onDelete(workout.id);
  }

  const dotCount = 5;
  const filledDots = Math.min(workout.exercises.length, dotCount);

  return (
    <div className={styles.swipeContainer}>
      <div className={`${styles.action} ${styles.editAction}`}>
        <button type="button" onClick={handleEdit}>
          <Pencil size={20} strokeWidth={1.8} />
          <span>Editar</span>
        </button>
      </div>

      <div className={`${styles.action} ${styles.deleteAction}`}>
        <button type="button" onClick={handleDelete}>
          <Trash2 size={20} strokeWidth={1.8} />
          <span>Excluir</span>
        </button>
      </div>

      <article
        className={`${styles.card} ${
          isDragging ? styles.dragging : ""
        }`}
        style={{ transform: `translateX(${translateX}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleCardClick}
      >
        <div className={styles.top}>
          <div>
            <h2 className={styles.title}>{workout.title}</h2>

            <p className={styles.exerciseCount}>
              {workout.exercises.length}{" "}
              {workout.exercises.length === 1
                ? "exercício"
                : "exercícios"}
            </p>
          </div>

          <div className={styles.startIcon}>
            <ArrowRight size={22} strokeWidth={1.8} />
          </div>
        </div>

        <div className={styles.middle}>
          <ProgressDots total={dotCount} filled={filledDots} />
        </div>

        <div className={styles.bottom}>
          <div>
            <span className={styles.lastWorkoutLabel}>
              Último treino
            </span>

            <strong className={styles.lastWorkoutValue}>
              {workout.lastWorkout}
            </strong>
          </div>

          <span className={styles.startText}>Começar</span>
        </div>
      </article>
    </div>
  );
}