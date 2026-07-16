import { useEffect, useState } from "react";

import BottomNav from "./components/BottomNav/BottomNav";
import { initialWorkouts } from "./data/seed";
import Editor from "./pages/Editor/Editor";
import Finished from "./pages/Finished/Finished";
import Home from "./pages/Home/Home";
import Session from "./pages/Session/Session";
import Welcome from "./pages/Welcome/Welcome";

import {
  getAccessMode,
  loadWorkouts,
  saveWorkouts,
  setAccessMode,
} from "./services-temp/localStorageService";

export default function App() {
  const [accessMode, setCurrentAccessMode] = useState(() =>
    getAccessMode()
  );

  const [workouts, setWorkouts] = useState(() =>
    loadWorkouts(initialWorkouts)
  );

  const [activeTab, setActiveTab] = useState("workouts");
  const [currentPage, setCurrentPage] = useState("home");
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [finishedSummary, setFinishedSummary] = useState(null);

  /*
   * Salva automaticamente qualquer alteração nos treinos
   * quando o usuário estiver no modo convidado.
   */
  useEffect(() => {
    if (accessMode !== "guest") return;

    saveWorkouts(workouts);
  }, [workouts, accessMode]);

  function handleContinueAsGuest() {
    setAccessMode("guest");
    setCurrentAccessMode("guest");
  }

  function handleCloudOption(option) {
    const optionName =
      option === "google" ? "Google" : "e-mail";

    window.alert(
      `A autenticação com ${optionName} será conectada ao Supabase na próxima etapa.`
    );
  }

  function handleStartWorkout(workout) {
    setActiveWorkout(workout);
    setCurrentPage("session");
  }

  function handleCreateWorkout() {
    setEditingWorkout(null);
    setCurrentPage("editor");
  }

  function handleEditWorkout(workout) {
    setEditingWorkout(workout);
    setCurrentPage("editor");
  }

  function handleSaveWorkout(workout) {
    setWorkouts((currentWorkouts) => {
      const workoutExists = currentWorkouts.some(
        (item) => item.id === workout.id
      );

      if (workoutExists) {
        return currentWorkouts.map((item) =>
          item.id === workout.id ? workout : item
        );
      }

      return [...currentWorkouts, workout];
    });

    setEditingWorkout(null);
    setCurrentPage("home");
    setActiveTab("workouts");
  }

  function handleDeleteWorkout(workoutId) {
    const workout = workouts.find(
      (item) => item.id === workoutId
    );

    if (!workout) return;

    const confirmed = window.confirm(
      `Deseja excluir o treino "${workout.title}"?`
    );

    if (!confirmed) return;

    setWorkouts((currentWorkouts) =>
      currentWorkouts.filter(
        (item) => item.id !== workoutId
      )
    );
  }

  function handleFinishWorkout({
    workout,
    summary,
  }) {
    setWorkouts((currentWorkouts) =>
      currentWorkouts.map((item) =>
        item.id === workout.id ? workout : item
      )
    );

    setFinishedSummary({
      workoutTitle: workout.title,
      ...summary,
    });

    setActiveWorkout(null);
    setCurrentPage("finished");
  }

  function handleBottomNavigation(tab) {
    setActiveTab(tab);
    setCurrentPage("home");
    setEditingWorkout(null);
    setActiveWorkout(null);
  }

  function returnHome() {
    setCurrentPage("home");
    setActiveTab("workouts");
    setEditingWorkout(null);
    setActiveWorkout(null);
    setFinishedSummary(null);
  }

  /*
   * Sem modo de acesso escolhido:
   * mostra a tela inicial.
   */
  if (!accessMode) {
    return (
      <main className="app">
        <div className="appContent">
          <Welcome
            onContinueAsGuest={handleContinueAsGuest}
            onCloudOption={handleCloudOption}
          />
        </div>
      </main>
    );
  }

  const showBottomNavigation =
    currentPage === "home";

  return (
    <main className="app">
      <div className="appContent">
        {currentPage === "editor" && (
          <Editor
            workout={editingWorkout}
            onBack={returnHome}
            onSave={handleSaveWorkout}
          />
        )}

        {currentPage === "session" &&
          activeWorkout && (
            <Session
              workout={activeWorkout}
              onExit={returnHome}
              onFinish={handleFinishWorkout}
            />
          )}

        {currentPage === "finished" &&
          finishedSummary && (
            <Finished
              workoutTitle={
                finishedSummary.workoutTitle
              }
              summary={finishedSummary}
              onContinue={returnHome}
            />
          )}

        {currentPage === "home" &&
          activeTab === "workouts" && (
            <Home
              workouts={workouts}
              onStartWorkout={handleStartWorkout}
              onEditWorkout={handleEditWorkout}
              onDeleteWorkout={handleDeleteWorkout}
              onCreateWorkout={handleCreateWorkout}
            />
          )}

        {currentPage === "home" &&
          activeTab === "history" && (
            <TemporaryPage
              eyebrow="Histórico"
              title="Seus treinos"
              description="O histórico será implementado depois da experiência principal."
            />
          )}

        {currentPage === "home" &&
          activeTab === "settings" && (
            <TemporaryPage
              eyebrow="Ajustes"
              title="Configurações"
              description="As preferências serão adicionadas em outra etapa."
            />
          )}
      </div>

      {showBottomNavigation && (
        <BottomNav
          activeItem={activeTab}
          onChange={handleBottomNavigation}
        />
      )}
    </main>
  );
}

function TemporaryPage({
  eyebrow,
  title,
  description,
}) {
  return (
    <section>
      <p
        style={{
          marginBottom: 8,
          color: "var(--color-text-muted)",
          fontSize: "0.7rem",
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </p>

      <h1
        style={{
          fontSize: "2.4rem",
          lineHeight: 1,
          letterSpacing: "-0.06em",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          maxWidth: 360,
          marginTop: 14,
          color: "var(--color-text-muted)",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </section>
  );
}