import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Plus,
  X,
} from "lucide-react";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import NumberControl from "../../components/NumberControl/NumberControl";
import SortableExercise from "../../components/SortableExercise/SortableExercise";
import RestDurationControl from "../../components/RestDurationControl/RestDurationControl";
import styles from "./Editor.module.css";


function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

const emptyExercise = {
  name: "",
  sets: 3,
  weight: 20,
  reps: 10,
  restSeconds: 90,
};

export default function Editor({
  workout,
  onBack,
  onSave,
}) {
  const [draft, setDraft] = useState(() => ({
    id: workout?.id ?? createId("workout"),
    title: workout?.title ?? "",
    lastWorkout:
      workout?.lastWorkout ?? "Ainda não realizado",
    exercises: workout
      ? workout.exercises.map((exercise) => ({
          ...exercise,
        }))
      : [],
  }));

  const [exerciseForm, setExerciseForm] =
    useState(emptyExercise);

  const [showExerciseForm, setShowExerciseForm] =
    useState(draft.exercises.length === 0);

  const [
    expandedExerciseId,
    setExpandedExerciseId,
  ] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),

    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const canSave =
    draft.title.trim().length > 0 &&
    draft.exercises.length > 0;

  function updateExerciseForm(field, value) {
    setExerciseForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateExercise(exerciseId, field, value) {
    setDraft((current) => ({
      ...current,

      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              [field]: value,
            }
          : exercise
      ),
    }));
  }

  function addExercise() {
    const name = exerciseForm.name.trim();

    if (!name) return;

    const newExercise = {
  id: createId("exercise"),
  name,
  sets: exerciseForm.sets,
  weight: exerciseForm.weight,
  reps: exerciseForm.reps,

  restSeconds: exerciseForm.restSeconds,

  recordWeight: exerciseForm.weight,
  recordReps: exerciseForm.reps,
};

    setDraft((current) => ({
      ...current,
      exercises: [...current.exercises, newExercise],
    }));

    setExerciseForm(emptyExercise);
    setShowExerciseForm(false);
  }

  function removeExercise(exerciseId) {
    setDraft((current) => ({
      ...current,

      exercises: current.exercises.filter(
        (exercise) => exercise.id !== exerciseId
      ),
    }));

    if (expandedExerciseId === exerciseId) {
      setExpandedExerciseId(null);
    }
  }

  function toggleExercise(exerciseId) {
    setExpandedExerciseId((current) =>
      current === exerciseId ? null : exerciseId
    );
  }

  function handleDragStart() {
    setExpandedExerciseId(null);

    if (
      typeof navigator !== "undefined" &&
      navigator.vibrate
    ) {
      navigator.vibrate(20);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setDraft((current) => {
      const oldIndex = current.exercises.findIndex(
        (exercise) => exercise.id === active.id
      );

      const newIndex = current.exercises.findIndex(
        (exercise) => exercise.id === over.id
      );

      if (oldIndex === -1 || newIndex === -1) {
        return current;
      }

      return {
        ...current,
        exercises: arrayMove(
          current.exercises,
          oldIndex,
          newIndex
        ),
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!canSave) return;

    onSave({
      ...draft,
      title: draft.title.trim(),
    });
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBack}
          aria-label="Voltar"
        >
          <ArrowLeft size={21} strokeWidth={1.8} />
        </button>

        <div className={styles.headerText}>
          <p className={styles.eyebrow}>
            {workout ? "Editar treino" : "Novo treino"}
          </p>

          <h1 className={styles.title}>
            {workout
              ? "Ajuste sua rotina"
              : "Monte seu treino"}
          </h1>
        </div>
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.field}>
          <label htmlFor="workout-name">
            Nome do treino
          </label>

          <input
            id="workout-name"
            type="text"
            value={draft.title}
            placeholder="Ex.: Peito e tríceps"
            autoComplete="off"
            maxLength={40}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
          />
        </div>

        <div className={styles.sectionHeader}>
          <div>
            <h2>Exercícios</h2>

            <p>
              {draft.exercises.length}{" "}
              {draft.exercises.length === 1
                ? "exercício incluído"
                : "exercícios incluídos"}
            </p>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={draft.exercises.map(
              (exercise) => exercise.id
            )}
            strategy={verticalListSortingStrategy}
          >
            <div className={styles.exerciseList}>
              {draft.exercises.map(
                (exercise, index) => (
                  <SortableExercise
                    key={exercise.id}
                    exercise={exercise}
                    index={index}
                    expanded={
                      expandedExerciseId === exercise.id
                    }
                    onToggle={() =>
                      toggleExercise(exercise.id)
                    }
                    onUpdate={(field, value) =>
                      updateExercise(
                        exercise.id,
                        field,
                        value
                      )
                    }
                    onRemove={() =>
                      removeExercise(exercise.id)
                    }
                  />
                )
              )}
            </div>
          </SortableContext>
        </DndContext>

        {showExerciseForm ? (
          <div className={styles.addForm}>
            <div className={styles.addFormHeader}>
              <div>
                <h3>Novo exercício</h3>
                <p>Defina o objetivo inicial.</p>
              </div>

              {draft.exercises.length > 0 && (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={() =>
                    setShowExerciseForm(false)
                  }
                  aria-label="Fechar inclusão"
                >
                  <X size={19} strokeWidth={1.8} />
                </button>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="exercise-name">
                Exercício
              </label>

              <input
                id="exercise-name"
                type="text"
                value={exerciseForm.name}
                placeholder="Ex.: Supino inclinado"
                autoComplete="off"
                maxLength={50}
                onChange={(event) =>
                  updateExerciseForm(
                    "name",
                    event.target.value
                  )
                }
              />
            </div>

            <div className={styles.controlsGrid}>
  <NumberControl
    label="Séries"
    value={exerciseForm.sets}
    min={1}
    step={1}
    onChange={(value) =>
      updateExerciseForm("sets", value)
    }
  />

  <NumberControl
    label="Carga"
    value={exerciseForm.weight}
    min={0}
    step={2.5}
    unit="kg"
    onChange={(value) =>
      updateExerciseForm("weight", value)
    }
  />

  <NumberControl
    label="Repetições"
    value={exerciseForm.reps}
    min={1}
    step={1}
    onChange={(value) =>
      updateExerciseForm("reps", value)
    }
  />
</div>

<RestDurationControl
  value={exerciseForm.restSeconds}
  onChange={(value) =>
    updateExerciseForm("restSeconds", value)
  }
/>

            <button
              type="button"
              className={
                styles.confirmExerciseButton
              }
              disabled={!exerciseForm.name.trim()}
              onClick={addExercise}
            >
              <Plus size={19} strokeWidth={2.2} />
              Adicionar exercício
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={styles.addExerciseButton}
            onClick={() => setShowExerciseForm(true)}
          >
            <Plus size={20} strokeWidth={2} />
            Incluir exercício
          </button>
        )}

        <button
          type="submit"
          className={styles.saveButton}
          disabled={!canSave}
        >
          <Check size={20} strokeWidth={2.3} />
          Salvar treino
        </button>
      </form>
    </section>
  );
}