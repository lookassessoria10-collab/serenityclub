"use client";

import { useState } from "react";
import { navItems } from "../data";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
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
  );
}
