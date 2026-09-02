"use client";

import { CSSProperties, useMemo, useState } from "react";
import { AgeGate } from "./components/AgeGate";
import { SiteHeader } from "./components/SiteHeader";
import { articles, discoveryTags, experiences, muses, therapists } from "./data";

export default function Home() {
  const [activeTag, setActiveTag] = useState("Elegante");
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const source = [
      ...muses.map((muse) => ({ type: "Musa digital", title: muse.name, text: muse.phrase, href: `/musas/${muse.slug}` })),
      ...experiences.map((experience) => ({
        type: "Experiencia",
        title: experience.title,
        text: experience.copy,
        href: "#experiencias",
      })),
      ...articles.map(([type, title, text]) => ({ type, title, text, href: "#conteudos" })),
      ...therapists.map(([title, text, period]) => ({ type: "Terapeuta", title, text: `${text} - ${period}`, href: "#terapeutas" })),
    ];

    if (!query.trim()) return source.slice(0, 6);
    const normalized = query.toLocaleLowerCase("pt-BR");
    return source.filter((item) =>
      `${item.type} ${item.title} ${item.text}`.toLocaleLowerCase("pt-BR").includes(normalized),
    );
  }, [query]);

  return (
    <AgeGate>
      <main className="site-shell">
        <SiteHeader />

        <section id="inicio" className="hero-section relaxed-hero">
          <div className="hero-media" aria-hidden="true">
            <img src="/assets/clara-free-4.jpeg" alt="" />
          </div>
          <div className="hero-content">
            <p className="eyebrow">Serenity</p>
            <h1>Um convite aos sentidos.</h1>
            <p>Descubra personagens digitais, conteudos reservados e experiencias presenciais sem pressa.</p>
            <div className="button-row">
              <a className="primary-button" href="#musas">Conhecer as Musas</a>
              <a className="secondary-button" href="#experiencias">Ver experiencias</a>
            </div>
          </div>
        </section>

        <section id="musas" className="discovery-section airy-section" aria-labelledby="discover-title">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Musas Digitais</p>
              <h2 id="discover-title">Descubra seu próximo interesse.</h2>
            </div>
            <p>Cada personagem tem uma pagina propria, com fotos abertas e conteudos premium bloqueados.</p>
          </div>

          <div className="tag-strip tag-wrap" role="list" aria-label="Filtros por atmosfera">
            {discoveryTags.map((tag) => (
              <button
                className={activeTag === tag ? "tag-pill active" : "tag-pill"}
                key={tag}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="muse-directory">
            {muses.map((muse) => {
              const slideshowImages = Array.from(new Set([muse.image, ...muse.freeImages.slice(0, 3)]));
              const slideDuration = 6;
              const cycleDuration = slideshowImages.length * slideDuration;

              return (
              <article className="muse-card compact-muse-card" key={muse.name}>
                <div className="muse-slideshow" aria-hidden="true">
                  {slideshowImages.map((image, index) => (
                    <img
                      src={image}
                      alt=""
                      key={`${muse.slug}-${image}`}
                      style={
                        {
                          animationDelay: `${index * slideDuration}s`,
                          animationDuration: `${cycleDuration}s`,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
                <div className="muse-card-copy">
                  <span>{activeTag}</span>
                  <h3>{muse.name}</h3>
                  <p>{muse.phrase}</p>
                  <small>{muse.latest} - {muse.tag}</small>
                  <a className="card-button" href={`/musas/${muse.slug}`}>Abrir perfil</a>
                </div>
              </article>
              );
            })}
          </div>
        </section>

        <section id="experiencias" className="experience-section airy-section" aria-labelledby="experience-title">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Presencial</p>
              <h2 id="experience-title">Experiencias presenciais.</h2>
            </div>
            <p>Uma ponte discreta entre curiosidade digital, bem-estar e agendamento.</p>
          </div>
          <div className="experience-strip">
            {experiences.map((experience) => (
              <article className="experience-item soft-item" key={experience.title}>
                <h3>{experience.title}</h3>
                <p>{experience.copy}</p>
                <span>{experience.duration} - {experience.price}</span>
                <a className="text-link" href="#agendar">Solicitar horario</a>
              </article>
            ))}
          </div>
        </section>

        <section id="club" className="club-preview airy-section">
          <div>
            <p className="eyebrow">Club Serenity</p>
            <h2>Conteudo reservado, acesso claro.</h2>
            <p>
              Fotos premium aparecem borradas ate a assinatura. Na etapa de sistema real, esses arquivos devem sair do
              diretorio publico e ir para armazenamento protegido.
            </p>
          </div>
          <a className="primary-button" href="/musas/clara">Ver perfil da Clara</a>
        </section>

        <section id="conteudos" className="editorial-section airy-section" aria-labelledby="editorial-title">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Revista Serenity</p>
              <h2 id="editorial-title">Conteudos editoriais.</h2>
            </div>
            <p>Uma camada mais leve para descoberta, busca e navegacao interna.</p>
          </div>
          <div className="article-grid compact-article-grid">
            {articles.map(([category, title, text]) => (
              <article className="article-card soft-item" key={title}>
                <span>{category}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="busca" className="search-section airy-section" aria-labelledby="search-title">
          <div className="section-heading">
            <p className="eyebrow">Busca</p>
            <h2 id="search-title">Encontre rapido.</h2>
          </div>
          <label className="search-box">
            <span>Pesquisar modelos, experiencias, artigos e terapeutas</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Experimente: Clara" />
          </label>
          <div className="search-results" aria-live="polite">
            {searchResults.map((result) => (
              <a href={result.href} key={`${result.type}-${result.title}`}>
                <span>{result.type}</span>
                <strong>{result.title}</strong>
                <p>{result.text}</p>
              </a>
            ))}
          </div>
        </section>

        <section id="terapeutas" className="therapists-section airy-section" aria-labelledby="therapists-title">
          <div className="section-heading">
            <p className="eyebrow">Equipe real</p>
            <h2 id="therapists-title">Quem cuida da sua experiencia.</h2>
          </div>
          <div className="therapist-grid compact-team">
            {therapists.map(([name, specialty, period]) => (
              <article className="therapist-card soft-item" key={name}>
                <div className="therapist-photo" aria-hidden="true">{name.slice(0, 1)}</div>
                <h3>{name}</h3>
                <p>{specialty}</p>
                <span>{period}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="agendar" className="admin-section future-admin">
          <div className="admin-copy">
            <p className="eyebrow">Proxima etapa</p>
            <h2>Painel administrativo.</h2>
            <p>
              Em outro momento, montamos o painel para cadastrar modelos, fotos gratuitas, fotos premium, planos,
              experiencias e metricas sem editar codigo.
            </p>
          </div>
          <a className="primary-button" href="#inicio">Voltar ao inicio</a>
        </section>

        <footer id="contato" className="site-footer">
          <img src="/assets/serenity-logo-white.png" alt="Serenity Terapias Holisticas" />
          <div>
            <a href="#privacidade">Privacidade</a>
            <a href="#termos">Termos</a>
            <a href="#faq">FAQ</a>
            <a href="#agendar">Falar com a Serenity</a>
          </div>
          <p>Personagens digitais identificadas como IA. Conteudo premium demonstrativo com bloqueio visual.</p>
        </footer>

        <a className="floating-cta" href="#agendar">Agendar</a>
      </main>
    </AgeGate>
  );
}
