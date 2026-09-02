import type { Metadata } from "next";
import "./globals.css";

const title = "Serenity | Seu tempo. Seus sentidos. Sua experiencia";
const description =
  "Experiencias corporais, conteudo editorial adulto responsavel e plataforma digital exclusiva da Serenity.";

export const metadata: Metadata = {
  metadataBase: new URL("https://serenity.vercel.app"),
  title,
  description,
  icons: {
    icon: "/assets/serenity-logo-white.png",
    shortcut: "/assets/serenity-logo-white.png",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Serenity Terapias Holisticas",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1024,
        height: 1024,
        alt: "Marca original Serenity Terapias Holisticas.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
