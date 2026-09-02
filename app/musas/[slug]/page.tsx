import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgeGate } from "../../components/AgeGate";
import { SiteHeader } from "../../components/SiteHeader";
import { muses } from "../../data";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

function findMuse(slug: string) {
  return muses.find((muse) => muse.slug === slug);
}

export function generateStaticParams() {
  return muses.map((muse) => ({ slug: muse.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const muse = findMuse(resolvedParams.slug);

  if (!muse) {
    return {
      title: "Musa Digital | Serenity",
    };
  }

  return {
    title: `${muse.name} | Musa Digital Serenity`,
    description: `${muse.name}: ${muse.phrase}`,
    openGraph: {
      title: `${muse.name} | Musa Digital Serenity`,
      description: muse.phrase,
      images: [
        {
          url: muse.avatar,
          width: 1024,
          height: 1024,
          alt: `Perfil de ${muse.name}`,
        },
      ],
    },
    twitter: {
      title: `${muse.name} | Musa Digital Serenity`,
      description: muse.phrase,
      images: [muse.avatar],
    },
  };
}

export default async function MuseProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const muse = findMuse(resolvedParams.slug);

  if (!muse) notFound();

  return (
    <AgeGate>
      <main className="site-shell muse-page">
        <SiteHeader />

        <section className="muse-page-hero">
          <div className="muse-page-cover">
            <img src={muse.image} alt={`Capa de ${muse.name}`} />
          </div>
          <div className="muse-page-intro">
            <img className="profile-avatar-large" src={muse.avatar} alt={`Perfil de ${muse.name}`} />
            <span className="ai-badge">{muse.tag}</span>
            <h1>{muse.name}</h1>
            <p className="adult-range">{muse.age}</p>
            <p>{muse.bio}</p>
            <dl className="profile-facts">
              <div>
                <dt>Personalidade</dt>
                <dd>{muse.personality}</dd>
              </div>
              <div>
                <dt>Estetica</dt>
                <dd>{muse.aesthetic}</dd>
              </div>
              <div>
                <dt>Conteudos</dt>
                <dd>{muse.posts}</dd>
              </div>
              <div>
                <dt>Assinatura</dt>
                <dd>{muse.price}</dd>
              </div>
            </dl>
            <div className="button-row">
              <a className="primary-button" href="#premium">assine premiums</a>
              <a className="secondary-button" href="/#musas">Ver outras Musas</a>
            </div>
          </div>
        </section>

        <section className="profile-gallery-section" aria-labelledby="free-gallery-title">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Galeria aberta</p>
              <h2 id="free-gallery-title">Fotos gratuitas.</h2>
            </div>
            <p>Imagens visiveis apos a verificacao de idade.</p>
          </div>
          <div className="profile-photo-grid">
            {muse.freeImages.map((image, index) => (
              <figure className="profile-photo-card" key={image}>
                <img src={image} alt={`Foto gratuita ${index + 1} de ${muse.name}`} />
              </figure>
            ))}
          </div>
        </section>

        <section id="premium" className="profile-gallery-section premium-band" aria-labelledby="premium-gallery-title">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Conteudo premium</p>
              <h2 id="premium-gallery-title">Colecao reservada.</h2>
            </div>
            <p>As fotos premium usam tamanho padrao e bloqueio visual ate a assinatura.</p>
          </div>
          <div className="profile-photo-grid">
            {muse.premiumImages.map((image, index) => (
              <figure className="profile-photo-card premium-profile-photo" key={image}>
                <img src={image} alt={`Foto premium bloqueada ${index + 1} de ${muse.name}`} />
                <figcaption>
                  <span>Premium</span>
                  <strong>Conteudo reservado</strong>
                  <button>assine premiums</button>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <footer className="site-footer">
          <img src="/assets/serenity-logo-white.png" alt="Serenity Terapias Holisticas" />
          <div>
            <a href="/#inicio">Inicio</a>
            <a href="/#musas">Musas Digitais</a>
            <a href="/#club">Club Serenity</a>
          </div>
          <p>{muse.name} e uma personagem digital criada por IA. Nao representa atendimento presencial.</p>
        </footer>
      </main>
    </AgeGate>
  );
}
