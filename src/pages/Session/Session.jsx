import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import usePressHold from "../../hooks/usePressHold";
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  SkipForward,
  Trophy,
} from "lucide-react";

import ProgressDotsSession from "../../components/ProgressDotsSession/ProgressDotsSession";
import RestTimer from "../../components/RestTimer/RestTimer";
import styles from "./Session.module.css";

function isBetterPerformance(
  weight,
  reps,
  referenceWeight,
  referenceReps
) {
  return (
    weight > referenceWeight ||
    (weight === referenceWeight && reps > referenceReps)
  );
}

export default function Session({
  workout,
  onExit,
  onFinish,
}) {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);

  const [sessionExercises, setSessionExercises] = useState(() =>
    workout.exercises.map((exercise) => ({
  ...exercise,

  originalWeight: exercise.weight,
  originalReps: exercise.reps,

  recordWeight:
    exercise.recordWeight ?? exercise.weight,

  recordReps:
    exercise.recordReps ?? exercise.reps,

  restSeconds: exercise.restSeconds ?? 90,

  completedSets: 0,
  skipped: false,
}))
  );

  const currentExercise =
    sessionExercises[exerciseIndex];

  const isLastExercise =
    exerciseIndex === sessionExercises.length - 1;

  const isPR = useMemo(() => {
    if (!currentExercise) return false;

    return isBetterPerformance(
      currentExercise.weight,
      currentExercise.reps,
      currentExercise.recordWeight,
      currentExercise.recordReps
    );
  }, [currentExercise]);

  function updateCurrentExercise(field, value) {
    setSessionExercises((current) =>
      current.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              [field]: Math.max(
                0,
                Math.round(value * 10) / 10
              ),
            }
          : exercise
      )
    );
  }

  function changeWeight(delta) {
    updateCurrentExercise(
      "weight",
      currentExercise.weight + delta
    );
  }

  function changeReps(delta) {
    updateCurrentExercise(
      "reps",
      currentExercise.reps + delta
    );
  }

  function concludeSet() {
    const nextCompletedSets =
      currentExercise.completedSets + 1;

    const updatedExercises =
      sessionExercises.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              completedSets: nextCompletedSets,
            }
          : exercise
      );

    setSessionExercises(updatedExercises);

    const exerciseWasFinished =
      nextCompletedSets >= currentExercise.sets;

    if (!exerciseWasFinished) {
      setIsResting(true);
      return;
    }

    if (isLastExercise) {
      finishWorkout(updatedExercises);
      return;
    }

    window.setTimeout(() => {
      setExerciseIndex((current) => current + 1);
    }, 240);
  }

  function finishRest() {
    setIsResting(false);

    if (
      typeof navigator !== "undefined" &&
      navigator.vibrate
    ) {
      navigator.vibrate([120, 80, 120]);
    }
  }

  function skipExercise() {
    const updatedExercises =
      sessionExercises.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              skipped: true,
            }
          : exercise
      );

    setSessionExercises(updatedExercises);

    if (isLastExercise) {
      finishWorkout(updatedExercises);
      return;
    }

    setExerciseIndex((current) => current + 1);
  }

  function finishWorkout(exercises) {
    const updatedWorkout = {
      ...workout,
      lastWorkout: "Hoje",

      exercises: exercises.map((exercise) => {
        const wasPerformed =
          !exercise.skipped &&
          exercise.completedSets > 0;

        if (!wasPerformed) {
  return {
    id: exercise.id,
    name: exercise.name,
    sets: exercise.sets,

    weight: exercise.originalWeight,
    reps: exercise.originalReps,

    recordWeight: exercise.recordWeight,
    recordReps: exercise.recordReps,

    restSeconds: exercise.restSeconds,
  };
}
        const improvedCurrentGoal =
          isBetterPerformance(
            exercise.weight,
            exercise.reps,
            exercise.originalWeight,
            exercise.originalReps
          );

        const achievedNewRecord =
          isBetterPerformance(
            exercise.weight,
            exercise.reps,
            exercise.recordWeight,
            exercise.recordReps
          );

return {
  id: exercise.id,
  name: exercise.name,
  sets: exercise.sets,

  weight: improvedCurrentGoal
    ? exercise.weight
    : exercise.originalWeight,

  reps: improvedCurrentGoal
    ? exercise.reps
    : exercise.originalReps,

  recordWeight: achievedNewRecord
    ? exercise.weight
    : exercise.recordWeight,

  recordReps: achievedNewRecord
    ? exercise.reps
    : exercise.recordReps,

  restSeconds: exercise.restSeconds,
};
      }),
    };

    const completedSeries = exercises.reduce(
      (total, exercise) =>
        total + exercise.completedSets,
      0
    );

    const prs = exercises.filter((exercise) => {
      const wasPerformed =
        !exercise.skipped &&
        exercise.completedSets > 0;

      if (!wasPerformed) return false;

      return isBetterPerformance(
        exercise.weight,
        exercise.reps,
        exercise.recordWeight,
        exercise.recordReps
      );
    }).length;

    const completedExercises = exercises.filter(
      (exercise) =>
        !exercise.skipped &&
        exercise.completedSets > 0
    ).length;

    onFinish({
      workout: updatedWorkout,

      summary: {
        completedSeries,
        prs,
        exercises: completedExercises,
      },
    });
  }

  if (!currentExercise) {
    return null;
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onExit}
          aria-label="Sair do treino"
        >
          <ArrowLeft size={21} strokeWidth={1.8} />
        </button>

        <div className={styles.headerContent}>
          <p className={styles.eyebrow}>
            {workout.title}
          </p>

          <span className={styles.exercisePosition}>
            {exerciseIndex + 1} de{" "}
            {sessionExercises.length}
          </span>
        </div>
      </header>

     <main
  className={`${styles.content} ${
    isResting ? styles.restingContent : ""
  }`}
>
  {isResting ? (
    <RestTimer
  duration={currentExercise.restSeconds ?? 90}
  onComplete={finishRest}
  message={`Próxima: série ${
    currentExercise.completedSets + 1
  } de ${currentExercise.sets}`}
/>
  ) : (
    <>
      <div className={styles.exerciseHeader}>
        <p className={styles.exerciseLabel}>
          Exercício atual
        </p>

        <h1 className={styles.exerciseName}>
          {currentExercise.name}
        </h1>
      </div>

      <ProgressDotsSession
        total={currentExercise.sets}
        completed={currentExercise.completedSets}
      />

      <p className={styles.setText}>
        Série{" "}
        {Math.min(
          currentExercise.completedSets + 1,
          currentExercise.sets
        )}{" "}
        de {currentExercise.sets}
      </p>

      <div className={styles.values}>
        <ValueControl
          label="Carga"
          value={currentExercise.weight}
          unit="kg"
          onDecrease={() => changeWeight(-2.5)}
          onIncrease={() => changeWeight(2.5)}
          onDirectChange={(value) =>
            updateCurrentExercise("weight", value)
          }
        />

        <ValueControl
          label="Repetições"
          value={currentExercise.reps}
          unit="reps"
          onDecrease={() => changeReps(-1)}
          onIncrease={() => changeReps(1)}
          onDirectChange={(value) =>
            updateCurrentExercise("reps", value)
          }
        />
      </div>

      {isPR && (
        <div className={styles.prBadge}>
          <Trophy size={17} strokeWidth={1.9} />
          <span>Novo recorde</span>
        </div>
      )}

      <div className={styles.reference}>
        <span>Meta atual</span>

        <strong>
          {currentExercise.originalWeight} kg ·{" "}
          {currentExercise.originalReps} reps
        </strong>
      </div>

      <div className={styles.reference}>
        <span>Recorde</span>

        <strong>
          {currentExercise.recordWeight} kg ·{" "}
          {currentExercise.recordReps} reps
        </strong>
      </div>
    </>
  )}
</main>

      {!isResting && (
        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.finishButton}
            onClick={concludeSet}
          >
            <Check size={20} strokeWidth={2.4} />

            {currentExercise.completedSets + 1 ===
            currentExercise.sets
              ? "Finalizar exercício"
              : "Concluir série"}
          </button>

          <button
            type="button"
            className={styles.skipButton}
            onClick={skipExercise}
          >
            <SkipForward size={17} strokeWidth={1.8} />
            Pular hoje
          </button>
        </footer>
      )}
    </section>
  );
}

function ValueControl({
  label,
  value,
  unit,
  onDecrease,
  onIncrease,
  onDirectChange,
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

  const decreasePress = usePressHold(onDecrease);
  const increasePress = usePressHold(onIncrease);

  const formattedValue = Number.isInteger(value)
    ? value
    : value.toFixed(1);

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

    onDirectChange(
      Math.max(
        0,
        Math.round(parsedValue * 10) / 10
      )
    );

    setIsEditing(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmInput();
    }

    if (event.key === "Escape") {
      setInputValue(String(value));
      setIsEditing(false);
    }
  }

  return (
    <div className={styles.valueBlock}>
      <span className={styles.valueLabel}>
        {label}
      </span>

      <div className={styles.valueControl}>
        <button
          type="button"
          aria-label={`Diminuir ${label}`}
          {...decreasePress}
        >
          <Minus size={21} strokeWidth={1.8} />
        </button>

        {isEditing ? (
          <input
            ref={inputRef}
            className={styles.directValueInput}
            type="text"
            inputMode="decimal"
            value={inputValue}
            aria-label={`Informar ${label}`}
            onChange={(event) =>
              setInputValue(event.target.value)
            }
            onBlur={confirmInput}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <button
            type="button"
            className={styles.value}
            onClick={() => setIsEditing(true)}
            aria-label={`Editar ${label}`}
          >
            <strong>{formattedValue}</strong>
            <span>{unit}</span>
          </button>
        )}

        <button
          type="button"
          aria-label={`Aumentar ${label}`}
          {...increasePress}
        >
          <Plus size={21} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}