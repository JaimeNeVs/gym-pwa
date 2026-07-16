const WORKOUTS_KEY = "gym-pwa-workouts";
const ACCESS_MODE_KEY = "gym-pwa-access-mode";

export function getAccessMode() {
  return localStorage.getItem(ACCESS_MODE_KEY);
}

export function setAccessMode(mode) {
  localStorage.setItem(ACCESS_MODE_KEY, mode);
}

export function clearAccessMode() {
  localStorage.removeItem(ACCESS_MODE_KEY);
}

export function loadWorkouts(defaultWorkouts = []) {
  try {
    const savedValue = localStorage.getItem(WORKOUTS_KEY);

    if (!savedValue) {
      const normalizedDefaults =
        normalizeWorkouts(defaultWorkouts);

      saveWorkouts(normalizedDefaults);

      return normalizedDefaults;
    }

    const parsedValue = JSON.parse(savedValue);

    if (!Array.isArray(parsedValue)) {
      throw new Error(
        "Os treinos armazenados não possuem um formato válido."
      );
    }

    return normalizeWorkouts(parsedValue);
  } catch (error) {
    console.error(
      "Não foi possível carregar os treinos locais:",
      error
    );

    const normalizedDefaults =
      normalizeWorkouts(defaultWorkouts);

    saveWorkouts(normalizedDefaults);

    return normalizedDefaults;
  }
}

export function saveWorkouts(workouts) {
  try {
    localStorage.setItem(
      WORKOUTS_KEY,
      JSON.stringify(workouts)
    );
  } catch (error) {
    console.error(
      "Não foi possível salvar os treinos localmente:",
      error
    );
  }
}

export function clearLocalWorkouts() {
  localStorage.removeItem(WORKOUTS_KEY);
}

function normalizeWorkouts(workouts) {
  return workouts.map((workout, workoutIndex) => ({
    ...workout,

    id:
      workout.id ??
      `workout-local-${Date.now()}-${workoutIndex}`,

    title: workout.title ?? "Treino sem nome",

    lastWorkout:
      workout.lastWorkout ?? "Ainda não realizado",

    exercises: Array.isArray(workout.exercises)
      ? workout.exercises.map(
          (exercise, exerciseIndex) => ({
            ...exercise,

            id:
              exercise.id ??
              `exercise-local-${Date.now()}-${exerciseIndex}`,

            name:
              exercise.name ?? "Exercício sem nome",

            sets: Number(exercise.sets ?? 3),
            weight: Number(exercise.weight ?? 0),
            reps: Number(exercise.reps ?? 10),

            recordWeight: Number(
              exercise.recordWeight ??
                exercise.weight ??
                0
            ),

            recordReps: Number(
              exercise.recordReps ??
                exercise.reps ??
                10
            ),

            restSeconds: Number(
              exercise.restSeconds ?? 90
            ),

            note: exercise.note ?? "",
          })
        )
      : [],
  }));
}