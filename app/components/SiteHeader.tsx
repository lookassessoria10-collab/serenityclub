"use client";

import { useState } from "react";
import { navItems } from "../data";

const navIcons: Record<string, string> = {
  inicio: "01",
  musas: "02",
  experiencias: "03",
  club: "04",
  conteudos: "05",
  terapeutas: "06",
  agendar: "07",
};

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="app-sidebar" aria-label="Navegacao principal">
        <a className="brand sidebar-brand" href="/#inicio" aria-label="Serenity inicio">
          <img src="/assets/serenity-logo-white.png" alt="Serenity Terapias Holisticas" />
        </a>
        <nav className="sidebar-nav">
          {navItems.map(([label, id]) => (
            <a key={id} href={`/#${id}`}>
              <span>{navIcons[id] ?? "00"}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="sidebar-note">
          <strong>18+</strong>
          <p>Conteudo adulto com personagens digitais identificadas como IA.</p>
        </div>
      </aside>

      <header className="site-header">
        <a className="brand" href="/#inicio" aria-label="Serenity inicio">
          <img src="/assets/serenity-logo-white.png" alt="Serenity Terapias Holisticas" />
        </a>
        <button className="menu-toggle" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen}>
          Menu
        </button>
        <nav className={mobileOpen ? "main-nav is-open" : "main-nav"} aria-label="Navegacao principal">
          {navItems.map(([label, id]) => (
            <a key={id} href={`/#${id}`} onClick={() => setMobileOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      </header>
    </>
  );
}
