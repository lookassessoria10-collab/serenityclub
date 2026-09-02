"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";

export function AgeGate({ children }: { children: ReactNode }) {
  const [verified, setVerified] = useState(false);
  const [ready, setReady] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [ageError, setAgeError] = useState("");

  useEffect(() => {
    setVerified(window.localStorage.getItem("serenity-age-verified") === "true");
    setReady(true);
    const introTimer = window.setTimeout(() => setIntroComplete(true), 2400);

    return () => window.clearTimeout(introTimer);
  }, []);

  function handleAgeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const day = Number(form.get("day"));
    const month = Number(form.get("month"));
    const year = Number(form.get("year"));
    const consent = form.get("consent") === "on";
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDelta = today.getMonth() - birthDate.getMonth();

    if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    const validDate =
      birthDate.getFullYear() === year &&
      birthDate.getMonth() === month - 1 &&
      birthDate.getDate() === day;

    if (!validDate || !consent || age < 18) {
      setAgeError("Acesso disponivel somente para adultos com validacao completa.");
      return;
    }

    window.localStorage.setItem("serenity-age-verified", "true");
    setAgeError("");
    setVerified(true);
  }

  if (!introComplete) {
    return (
      <main className="intro-screen" aria-label="Carregando Serenity">
        <div className="intro-aura" />
        <section className="intro-content">
          <img className="intro-logo" src="/assets/serenity-logo-white.png" alt="Serenity Terapias Holisticas" />
          <p className="intro-line">Entre devagar.</p>
          <p className="intro-phrase">O toque comeca antes da pele.</p>
          <div className="intro-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </section>
      </main>
    );
  }

  if (!ready || !verified) {
    return (
      <main className="gate-screen">
        <section className="gate-panel" aria-labelledby="gate-title">
          <img className="gate-logo" src="/assets/serenity-logo-white.png" alt="Serenity Terapias Holisticas" />
          <p className="gate-kicker">Espaco reservado para adultos</p>
          <h1 id="gate-title">Seu tempo. Seus sentidos. Sua experiencia.</h1>
          <p className="gate-copy">
            Antes de continuar, confirme sua data de nascimento. Esta camada foi desenhada para integrar um
            fornecedor especializado de verificacao de idade e minimizar dados armazenados pela Serenity.
          </p>
          <form className="age-form" onSubmit={handleAgeSubmit}>
            <label>
              Dia
              <input name="day" inputMode="numeric" min="1" max="31" placeholder="DD" required />
            </label>
            <label>
              Mes
              <input name="month" inputMode="numeric" min="1" max="12" placeholder="MM" required />
            </label>
            <label>
              Ano
              <input name="year" inputMode="numeric" min="1900" max="2008" placeholder="AAAA" required />
            </label>
            <label className="consent">
              <input name="consent" type="checkbox" required />
              <span>Confirmo que sou adulto e aceito prosseguir para uma area com conteudo reservado.</span>
            </label>
            {ageError && <p className="form-error">{ageError}</p>}
            <button type="submit">Validar acesso</button>
          </form>
          <div className="gate-notes">
            <span>Privacidade primeiro</span>
            <span>Sem previas sensiveis antes da autorizacao</span>
            <span>Integracao de verificacao pronta para fornecedor externo</span>
          </div>
        </section>
      </main>
    );
  }

  return children;
}
