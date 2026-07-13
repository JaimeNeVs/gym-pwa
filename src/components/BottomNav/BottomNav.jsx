import { Dumbbell, History, Settings } from "lucide-react";

import styles from "./BottomNav.module.css";

const items = [
  {
    id: "workouts",
    label: "Treinos",
    icon: Dumbbell,
  },
  {
    id: "history",
    label: "Histórico",
    icon: History,
  },
  {
    id: "settings",
    label: "Ajustes",
    icon: Settings,
  },
];

export default function BottomNav({ activeItem, onChange }) {
  return (
    <nav className={styles.wrapper} aria-label="Navegação principal">
      <div className={styles.nav}>
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeItem === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.item} ${
                active ? styles.active : ""
              }`}
              onClick={() => onChange(item.id)}
            >
              <Icon size={21} strokeWidth={active ? 2.2 : 1.7} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}