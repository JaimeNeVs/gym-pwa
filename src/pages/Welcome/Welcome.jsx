import {
  Cloud,
  Mail,
  UserRound,
} from "lucide-react";

import styles from "./Welcome.module.css";

export default function Welcome({
  onContinueAsGuest,
  onCloudOption,
}) {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>
          Seu treino, sem distrações
        </p>

        <h1 className={styles.title}>
          Treine.
          <br />
          Registre.
          <br />
          Evolua.
        </h1>

        <p className={styles.subtitle}>
          Entre para sincronizar seus dados ou
          comece agora sem criar uma conta.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => onCloudOption("google")}
        >
          <Cloud size={19} strokeWidth={1.8} />
          Continuar com Google
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => onCloudOption("email")}
        >
          <Mail size={19} strokeWidth={1.8} />
          Entrar ou criar conta com e-mail
        </button>
      </div>

      <div className={styles.divider}>
        <span />
        <p>ou</p>
        <span />
      </div>

      <button
        type="button"
        className={styles.guestButton}
        onClick={onContinueAsGuest}
      >
        <UserRound size={18} strokeWidth={1.8} />
        Continuar sem conta
      </button>

      <p className={styles.guestMessage}>
        Seus dados ficarão salvos somente neste
        navegador. Depois você poderá transferi-los
        para uma conta.
      </p>
    </section>
  );
}