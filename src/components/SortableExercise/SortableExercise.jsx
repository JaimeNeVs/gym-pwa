import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Trash2,
} from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import NumberControl from "../NumberControl/NumberControl";
import styles from "./SortableExercise.module.css";

export default function SortableExercise({
  exercise,
  index,
  expanded,
  onToggle,
  onUpdate,
  onRemove,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: exercise.id,
  });

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={sortableStyle}
      className={`${styles.card} ${
        expanded ? styles.expanded : ""
      } ${isDragging ? styles.dragging : ""}`}
    >
      <div className={styles.top}>
        <span className={styles.index}>
          {String(index + 1).padStart(2, "0")}
        </span>

        <button
          type="button"
          className={styles.information}
          onClick={onToggle}
          aria-expanded={expanded}
        >
          <span className={styles.nameRow}>
            <strong>{exercise.name}</strong>

            {expanded ? (
              <ChevronUp size={17} strokeWidth={1.8} />
            ) : (
              <ChevronDown size={17} strokeWidth={1.8} />
            )}
          </span>

          <span className={styles.summary}>
            {exercise.sets} séries · {exercise.weight} kg ·{" "}
            {exercise.reps} reps
          </span>
        </button>

        <button
          ref={setActivatorNodeRef}
          type="button"
          className={styles.dragHandle}
          aria-label={`Reordenar ${exercise.name}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} strokeWidth={1.8} />
        </button>

        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemove}
          aria-label={`Remover ${exercise.name}`}
        >
          <Trash2 size={18} strokeWidth={1.8} />
        </button>
      </div>

      {expanded && (
        <div className={styles.editor}>
          <div className={styles.field}>
            <label htmlFor={`exercise-name-${exercise.id}`}>
              Nome do exercício
            </label>

            <input
              id={`exercise-name-${exercise.id}`}
              type="text"
              value={exercise.name}
              maxLength={50}
              onChange={(event) =>
                onUpdate("name", event.target.value)
              }
            />
          </div>

          <div className={styles.controlsGrid}>
            <NumberControl
              label="Séries"
              value={exercise.sets}
              min={1}
              step={1}
              onChange={(value) => onUpdate("sets", value)}
            />

            <NumberControl
              label="Carga"
              value={exercise.weight}
              min={0}
              step={2.5}
              unit="kg"
              onChange={(value) => onUpdate("weight", value)}
            />

            <NumberControl
              label="Repetições"
              value={exercise.reps}
              min={1}
              step={1}
              onChange={(value) => onUpdate("reps", value)}
            />
          </div>
        </div>
      )}
    </article>
  );
}